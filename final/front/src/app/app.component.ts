import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front';

  wasUserNameCreated: boolean = false;

  onUserNameCreated(event: boolean) {
    this.wasUserNameCreated = event;
  }

}
