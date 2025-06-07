import { Component, OnInit } from '@angular/core';
import { WebSocketService, GameState } from '../../services/websocket.service';

interface Position {
  row: number;
  col: number;
  direction: [number, number];
}

interface FoundWord {
  word: string;
  cells: { row: number; col: number }[];
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  gameState: GameState;
  selectedCells: { row: number; col: number }[] = [];
  isSelecting = false;
  private startCell: { row: number; col: number } | null = null;
  private foundWords: FoundWord[] = [];
  private readonly MIN_BOARD_SIZE = 12;
  private readonly BOARD_PADDING = 3;
  private readonly DIRECTIONS: [number, number][] = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal derecha abajo
    [1, -1],  // diagonal izquierda abajo
  ];

  constructor(private wsService: WebSocketService) {
    this.gameState = {
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
    };
    this.generateBoard();
  }

  ngOnInit() {
    this.wsService.getGameState().subscribe(state => {
      this.gameState = state;
      if (state.board.length === 0) {
        this.generateBoard();
      }
    });
  }

  private calculateBoardSize(): number {
    const longestWord = Math.max(...this.gameState.words.map(word => word.length));
    return Math.max(longestWord + this.BOARD_PADDING, this.MIN_BOARD_SIZE);
  }

  private generateBoard() {
    const boardSize = this.calculateBoardSize();
    const board = this.createEmptyBoard(boardSize);
    const sortedWords = [...this.gameState.words].sort((a, b) => b.length - a.length);
    
    // Intentar colocar cada palabra
    for (const word of sortedWords) {
      this.placeWordOnBoard(board, word.toUpperCase());
    }

    this.gameState.board = board;
    this.foundWords = []; // Resetear palabras encontradas al generar nuevo tablero
  }

  private createEmptyBoard(size: number): string[][] {
    return Array(size).fill(null)
      .map(() => Array(size).fill(null)
        .map(() => this.getRandomLetter()));
  }

  private placeWordOnBoard(board: string[][], word: string) {
    const boardSize = board.length;
    let placed = false;
    let attempts = 0;
    const maxAttempts = 50;

    while (!placed && attempts < maxAttempts) {
      const row = Math.floor(Math.random() * (boardSize - word.length));
      const col = Math.floor(Math.random() * (boardSize - word.length));
      const direction = this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];

      if (this.canPlaceWord(board, word, row, col, direction)) {
        this.placeWord(board, word, row, col, direction);
        placed = true;
      }
      attempts++;
    }

    if (!placed) {
      const row = Math.floor(Math.random() * (boardSize - word.length));
      const col = Math.floor(Math.random() * (boardSize - word.length));
      const direction = this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];
      this.placeWord(board, word, row, col, direction);
    }
  }

  private canPlaceWord(board: string[][], word: string, row: number, col: number, direction: [number, number]): boolean {
    const boardSize = board.length;
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + (direction[0] * i);
      const newCol = col + (direction[1] * i);

      if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
        return false;
      }

      if (board[newRow][newCol] !== null && board[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    return true;
  }

  private placeWord(board: string[][], word: string, row: number, col: number, direction: [number, number]) {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + (direction[0] * i);
      const newCol = col + (direction[1] * i);
      board[newRow][newCol] = word[i];
    }
  }

  private getRandomLetter(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const uncommonLetters = 'JKQXZ';
    return Math.random() < 0.3 ? 
      uncommonLetters[Math.floor(Math.random() * uncommonLetters.length)] :
      letters[Math.floor(Math.random() * letters.length)];
  }

  onCellMouseDown(row: number, col: number) {
    this.isSelecting = true;
    this.startCell = { row, col };
    this.selectedCells = [{ row, col }];
  }

  onCellMouseEnter(row: number, col: number) {
    if (this.isSelecting && this.startCell) {
      const direction = this.getSelectionDirection(this.startCell, { row, col });
      if (direction) {
        this.selectedCells = this.getCellsInDirection(this.startCell, { row, col }, direction);
      }
    }
  }

  private getSelectionDirection(start: { row: number; col: number }, end: { row: number; col: number }): [number, number] | null {
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    
    // Determinar la dirección principal
    if (Math.abs(rowDiff) > Math.abs(colDiff)) {
      // Movimiento más vertical
      return [Math.sign(rowDiff), 0];
    } else if (Math.abs(colDiff) > Math.abs(rowDiff)) {
      // Movimiento más horizontal
      return [0, Math.sign(colDiff)];
    } else if (Math.abs(rowDiff) === Math.abs(colDiff)) {
      // Movimiento diagonal
      return [Math.sign(rowDiff), Math.sign(colDiff)];
    }
    
    return null;
  }

  private getCellsInDirection(start: { row: number; col: number }, end: { row: number; col: number }, direction: [number, number]): { row: number; col: number }[] {
    const cells: { row: number; col: number }[] = [];
    const maxDistance = Math.max(
      Math.abs(end.row - start.row),
      Math.abs(end.col - start.col)
    );

    for (let i = 0; i <= maxDistance; i++) {
      const row = start.row + (direction[0] * i);
      const col = start.col + (direction[1] * i);
      
      // Verificar límites del tablero
      if (row >= 0 && row < this.gameState.board.length &&
          col >= 0 && col < this.gameState.board[0].length) {
        cells.push({ row, col });
      }
    }

    return cells;
  }

  onCellMouseUp() {
    if (this.isSelecting) {
      this.isSelecting = false;
      const word = this.getSelectedWord();
      if (word && this.gameState.words.includes(word.toLowerCase())) {
        this.wsService.sendWordFound(word);
        // Guardar las celdas de la palabra encontrada
        this.foundWords.push({
          word: word.toLowerCase(),
          cells: [...this.selectedCells]
        });
      }
      this.selectedCells = [];
      this.startCell = null;
    }
  }

  private getSelectedWord(): string {
    return this.selectedCells
      .map(cell => this.gameState.board[cell.row][cell.col])
      .join('')
      .toUpperCase();
  }

  isCellSelected(row: number, col: number): boolean {
    return this.selectedCells.some(cell => cell.row === row && cell.col === col);
  }

  isCellFound(row: number, col: number): boolean {
    return this.foundWords.some(foundWord => 
      foundWord.cells.some(cell => cell.row === row && cell.col === col)
    );
  }

  isWordFound(word: string): boolean {
    return this.foundWords.some(foundWord => foundWord.word === word.toLowerCase());
  }

  requestNewGame() {
    this.generateBoard();
    this.wsService.requestNewGame();
  }
} 