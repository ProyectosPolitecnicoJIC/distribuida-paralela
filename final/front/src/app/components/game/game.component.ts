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
    const numWords = this.gameState.words.length;
    
    // Calculamos un tamaño mínimo basado en la palabra más larga
    const minSize = longestWord + 2;
    
    // Calculamos un tamaño basado en el número de palabras
    // Asumimos que necesitamos al menos 2 espacios por palabra
    const wordsBasedSize = Math.ceil(Math.sqrt(numWords * 2));
    
    // Tomamos el máximo de ambos cálculos y añadimos un margen
    return Math.max(minSize, wordsBasedSize) + 2;
  }

  private generateBoard(): void {
    const boardSize = this.calculateBoardSize();
    console.log('Board size:', boardSize, 'Words:', this.gameState.words);
    
    // Crear tablero vacío
    const board = Array(boardSize).fill(null)
      .map(() => Array(boardSize).fill(null));
    
    // Ordenar palabras por longitud (más largas primero)
    const sortedWords = [...this.gameState.words]
      .sort((a, b) => b.length - a.length)
      .map(word => word.toUpperCase());
    
    // Intentar colocar cada palabra
    for (const word of sortedWords) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 1000; // Aumentamos significativamente los intentos
      
      while (!placed && attempts < maxAttempts) {
        // Intentar colocar la palabra en una posición aleatoria
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        const direction = this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];
        
        if (this.canPlaceWord(board, word, row, col, direction)) {
          this.placeWord(board, word, row, col, direction);
          placed = true;
        }
        attempts++;
      }
      
      // Si no se pudo colocar aleatoriamente, hacer una búsqueda exhaustiva
      if (!placed) {
        for (let row = 0; row < boardSize && !placed; row++) {
          for (let col = 0; col < boardSize && !placed; col++) {
            for (const direction of this.DIRECTIONS) {
              if (this.canPlaceWord(board, word, row, col, direction)) {
                this.placeWord(board, word, row, col, direction);
                placed = true;
                break;
              }
            }
            if (placed) break;
          }
          if (placed) break;
        }
      }
      
      // Si aún no se pudo colocar, aumentar el tamaño del tablero y reintentar
      if (!placed) {
        console.log('Could not place word:', word, 'increasing board size');
        this.gameState.board = []; // Limpiar el tablero actual
        this.generateBoard(); // Recursión con tablero más grande
        return;
      }
    }
    
    // Rellenar espacios vacíos con letras aleatorias
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === null) {
          board[i][j] = this.getRandomLetter();
        }
      }
    }
    
    this.gameState.board = board;
    this.foundWords = [];
  }

  private canPlaceWord(board: string[][], word: string, row: number, col: number, direction: [number, number]): boolean {
    const boardSize = board.length;
    
    // Verificar que la palabra quepa en el tablero
    const endRow = row + (direction[0] * (word.length - 1));
    const endCol = col + (direction[1] * (word.length - 1));
    
    if (endRow < 0 || endRow >= boardSize || endCol < 0 || endCol >= boardSize) {
      return false;
    }
    
    // Verificar que no haya conflictos con otras letras
    for (let i = 0; i < word.length; i++) {
      const newRow = row + (direction[0] * i);
      const newCol = col + (direction[1] * i);
      
      // Si la celda está vacía o tiene la misma letra, es válida
      if (board[newRow][newCol] === null || board[newRow][newCol] === word[i]) {
        continue;
      }
      
      // Si hay una letra diferente, no podemos colocar la palabra aquí
      return false;
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