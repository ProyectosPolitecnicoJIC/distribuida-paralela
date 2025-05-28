import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as convert from 'xml-js';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule,
    HttpClientModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  bookForm: FormGroup;
  books: any[] = [];
  editingBookId: string | null = null;
  metrics: {
    totalBooks: number;
    authorPercentages: { [key: string]: number };
    mostProlificAuthor: string;
    maxBooks: number;
    averageBooksPerAuthor: number;
    uniqueAuthors: number;
  } = {
    totalBooks: 0,
    authorPercentages: {},
    mostProlificAuthor: '',
    maxBooks: 0,
    averageBooksPerAuthor: 0,
    uniqueAuthors: 0
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.getBooks();
  }

  getBooks() {
    this.http.get<any[]>('https://book-api-444452953129.us-central1.run.app/books')
      .subscribe({
        next: (books) => {
          this.books = books;
          this.calculateMetrics();
        },
        error: (error) => {
          this.snackBar.open('Error al obtener los libros', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
  }

  calculateMetrics() {
    // Total number of books
    const totalBooks = this.books.length;
    
    // Author statistics
    const authorCounts: { [key: string]: number } = {};
    this.books.forEach(book => {
      authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    });

    // Calculate percentages and find most prolific author
    const authorPercentages: { [key: string]: number } = {};
    let mostProlificAuthor = '';
    let maxBooks = 0;

    Object.entries(authorCounts).forEach(([author, count]) => {
      const percentage = (count / totalBooks) * 100;
      authorPercentages[author] = percentage;
      if (count > maxBooks) {
        maxBooks = count;
        mostProlificAuthor = author;
      }
    });

    // Calculate average books per author
    const uniqueAuthors = Object.keys(authorCounts).length;
    const averageBooksPerAuthor = totalBooks / uniqueAuthors;

    this.metrics = {
      totalBooks,
      authorPercentages,
      mostProlificAuthor,
      maxBooks,
      averageBooksPerAuthor,
      uniqueAuthors
    };
  }

  jsonToXml(book: any): string {
    let createdAt = '';
    if (book.createdAt) {
      if (typeof book.createdAt === 'object' && typeof book.createdAt.toDate === 'function') {
        createdAt = book.createdAt.toDate().toISOString();
      } else if (typeof book.createdAt === 'string') {
        createdAt = book.createdAt;
      } else if (book.createdAt.seconds) {
        // Firestore timestamp formato { seconds, nanoseconds }
        createdAt = new Date(book.createdAt.seconds * 1000).toISOString();
      } else if (book.createdAt._seconds) {
        // Firestore timestamp serializado { _seconds, _nanoseconds }
        createdAt = new Date(book.createdAt._seconds * 1000).toISOString();
      } else {
        createdAt = String(book.createdAt);
      }
    }
    const bookObj = {
      book: {
        id: { _text: book.id },
        title: { _text: book.title },
        author: { _text: book.author },
        createdAt: { _text: createdAt }
      }
    };
    return convert.js2xml(bookObj, { compact: true, spaces: 2 });
  }

  booksToXml(books: any[]): string {
    const xmlContent = books.map(book => this.jsonToXml(book)).join('\n');
    const metricsXml = `
    <metrics>
      <totalBooks>${this.metrics.totalBooks}</totalBooks>
      <uniqueAuthors>${this.metrics.uniqueAuthors}</uniqueAuthors>
      <averageBooksPerAuthor>${this.metrics.averageBooksPerAuthor.toFixed(2)}</averageBooksPerAuthor>
      <mostProlificAuthor>
        <name>${this.metrics.mostProlificAuthor}</name>
        <bookCount>${this.metrics.maxBooks}</bookCount>
      </mostProlificAuthor>
      <authorPercentages>
        ${Object.entries(this.metrics.authorPercentages)
          .map(([author, percentage]) => 
            `<author name="${author}">${(percentage as number).toFixed(2)}%</author>`
          ).join('\n        ')}
      </authorPercentages>
    </metrics>`;
    const wrappedXmlContent = `<books>\n${xmlContent}\n${metricsXml}\n</books>`;
    return wrappedXmlContent;
  }

  editBook(book: any) {
    this.editingBookId = book.id;
    this.bookForm.setValue({
      title: book.title,
      author: book.author
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteBook(id: string) {
    this.http.delete(
      `https://book-api-444452953129.us-central1.run.app/books/${id}`,
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        this.snackBar.open('Libro eliminado', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.getBooks();
      },
      error: (error) => {
        this.snackBar.open('Error al eliminar el libro', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        console.error('Error:', error);
      }
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const data = this.bookForm.value;
      console.log(this.editingBookId);
      if (this.editingBookId) {
        // Editar libro existente
        this.http.put(
          `https://book-api-444452953129.us-central1.run.app/books/${this.editingBookId}`, 
          data,
          { responseType: 'text' }
        ).subscribe({
          next: () => {
            this.snackBar.open('Libro actualizado exitosamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.bookForm.reset();
            this.editingBookId = null;
            this.getBooks();
          },
          error: (error) => {
            this.snackBar.open('Error al actualizar el libro', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            console.error('Error:', error);
          }
        });
      } else {
        // Crear libro nuevo
        this.http.post('https://book-api-444452953129.us-central1.run.app/books', data)
          .subscribe({
            next: (response) => {
              this.snackBar.open('Libro creado exitosamente', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
              this.bookForm.reset();
              this.getBooks();
            },
            error: (error) => {
              this.snackBar.open('Error al crear el libro', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
              console.error('Error:', error);
            }
          });
      }
    }
  }

  downloadAsPdf() {
    const doc = new jsPDF();
    let yOffset = 20;
    
    // Add title
    doc.setFontSize(16);
    doc.text('Lista de Libros', 20, yOffset);
    yOffset += 20;

    // Add each book
    const xmlContent = this.booksToXml(this.books);
    doc.setFontSize(12);
      const splitXml = doc.splitTextToSize(xmlContent, 170);
      
      // Check if we need a new page
      if (yOffset + splitXml.length * 7 > 280) {
        doc.addPage();
        yOffset = 20;
      }
      
      doc.text(splitXml, 20, yOffset);
    yOffset += splitXml.length * 7 + 10;
    
    // Save the PDF
    doc.save('libros.pdf');
  }

  getAuthorPercentages(): { name: string; percentage: number }[] {
    return Object.entries(this.metrics.authorPercentages)
      .map(([name, percentage]) => ({
        name,
        percentage: percentage as number
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }
}
