import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { WebSocketService } from 'src/app/services/web-socket.service';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
})
export class RegistrationFormComponent {

  @Output() wasUserNameCreated = new EventEmitter<boolean>();

  registrationForm: FormGroup;


  constructor(private fb: FormBuilder, private ws: WebSocketService) {
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]]
    })
  }




  onSubmit() {

    // TODO: Crear la conexion a nuestro servidor web socket


    this.wasUserNameCreated.emit(true)
    this.ws.connect(this.registrationForm.get("userName")?.value)

  }

}
