import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GameState {
  gameId: string;
  words: string[];
  foundWords: string[];
  board: string[][];
}

export interface GameInfo {
  id: string;
  playerName: string;
  foundWords: number;
  totalWords: number;
}

interface StoredGameState {
  gameId: string;
  playerName: string;
  words: string[];
  foundWords: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$!: WebSocketSubject<any>;
  private gameState = new BehaviorSubject<GameState>({
    gameId: '',
    words: [],
    foundWords: [],
    board: []
  });
  private gameList = new BehaviorSubject<GameInfo[]>([]);
  private reconnect$ = new Subject<void>();
  private readonly STORAGE_KEY = 'wordSearchGame';

  constructor() {
    console.log('Initializing WebSocket connection...');
    this.loadStoredGame();
    this.connect();
  }

  private loadStoredGame() {
    const storedGame = localStorage.getItem(this.STORAGE_KEY);
    if (storedGame) {
      try {
        const gameState: StoredGameState = JSON.parse(storedGame);
        console.log('Loaded stored game:', gameState);
        this.gameState.next({
          ...this.gameState.value,
          gameId: gameState.gameId,
          words: gameState.words,
          foundWords: gameState.foundWords
        });
        // Reconnect to the game
        if (gameState.playerName) {
          this.joinGame(gameState.playerName);
        }
      } catch (error) {
        console.error('Error loading stored game:', error);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  private storeGameState(state: GameState, playerName: string) {
    const storedState: StoredGameState = {
      gameId: state.gameId,
      playerName: playerName,
      words: state.words,
      foundWords: state.foundWords
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedState));
  }

  private connect() {
    this.socket$ = webSocket('ws://localhost:3000');
    this.socket$.subscribe(
      (message) => {
        console.log('Received message:', message);
        switch (message.type) {
          case 'gameStart':
            console.log('Game started:', message);
            const newState = {
              gameId: message.gameId,
              words: message.words,
              foundWords: [],
              board: []
            };
            this.gameState.next(newState);
            this.storeGameState(newState, this.getStoredPlayerName());
            break;
          case 'wordFound':
            console.log('Word found:', message);
            const currentState = this.gameState.value;
            const updatedState = {
              ...currentState,
              foundWords: message.foundWords
            };
            this.gameState.next(updatedState);
            this.storeGameState(updatedState, this.getStoredPlayerName());
            break;
          case 'gameList':
            console.log('Game list updated:', message);
            this.gameList.next(message.games);
            break;
        }
      },
      (err) => {
        console.error('WebSocket error:', err);
        setTimeout(() => this.reconnect$.next(), 5000);
      },
      () => {
        console.log('WebSocket connection closed');
        setTimeout(() => this.reconnect$.next(), 5000);
      }
    );

    this.reconnect$.subscribe(() => {
      console.log('Attempting to reconnect...');
      this.connect();
    });
  }

  private getStoredPlayerName(): string {
    const storedGame = localStorage.getItem(this.STORAGE_KEY);
    if (storedGame) {
      try {
        const gameState: StoredGameState = JSON.parse(storedGame);
        return gameState.playerName;
      } catch {
        return '';
      }
    }
    return '';
  }

  getGameState(): Observable<GameState> {
    return this.gameState.asObservable();
  }

  getGameList(): Observable<GameInfo[]> {
    return this.gameList.asObservable().pipe(
      map(games => [...games])
    );
  }

  joinGame(playerName: string) {
    console.log('Joining game with player name:', playerName);
    this.socket$.next({ type: 'join', playerName });
  }

  sendWordFound(word: string) {
    console.log('Sending word found:', word);
    if (this.gameState.value.words.includes(word) && 
        !this.gameState.value.foundWords.includes(word)) {
      this.socket$.next({ type: 'wordFound', word });
    }
  }

  requestNewGame() {
    console.log('Requesting new game');
    this.socket$.next({ type: 'newGame' });
  }

  clearStoredGame() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  disconnect() {
    if (this.socket$) {
      this.socket$.complete();
    }
    this.clearStoredGame();
    this.gameState.next({
      gameId: '',
      words: [],
      foundWords: [],
      board: []
    });
    this.gameList.next([]);
    console.log('WebSocket disconnected and state cleared.');
  }
} 