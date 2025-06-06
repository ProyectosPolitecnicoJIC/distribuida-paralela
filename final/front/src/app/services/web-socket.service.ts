import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocketSubject<any>;
  private serverUrl: string = "localhost:5000"


  connect(userName: string){
    this.socket = webSocket(`ws:${this.serverUrl}`)
    this.socket.next({type: 'create_game', userName})
  }



}
