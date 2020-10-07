import { Injectable } from '@angular/core';
import { Evento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  eventos: Evento [] = [];
  constructor() {
    this.crearEvento('nuevo echeq', 'esto es una prueba');
  }

  crearEvento(text: string, description: string){
    const evento: Evento = new Evento(text, description);
    this.eventos.push(evento);
    console.log(this.eventos);
  }
  mostrarEventos(){
    return this.eventos;
  }
}
