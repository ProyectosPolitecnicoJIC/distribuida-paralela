import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable } from 'rxjs';

export interface GameState {
  words: string[];
  foundWords: string[];
  scores: { [key: string]: number };
  board: string[][];
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  private gameState = new BehaviorSubject<GameState>({
    words: [
        "apple",
        "banana",
        "cherry",
        "date",
        "elderberry",
        "fig",
        "grape",
    ],
    foundWords: [],
    scores: {},
    board: []
  });

  constructor() {
    this.socket$ = webSocket('ws://localhost:8080');
    this.socket$.subscribe(
      (message) => {
        this.gameState.next(message);
      },
      (err) => console.error(err),
      () => console.log('WebSocket connection closed')
    );
  }

  getGameState(): Observable<GameState> {
    return this.gameState.asObservable();
  }

  sendWordFound(word: string) {
    this.socket$.next({ type: 'WORD_FOUND', word });
  }

  requestNewGame() {
    this.socket$.next({ type: 'NEW_GAME' });
  }
} 