import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaService {
  private textoBuscaSubject = new Subject<string>();
  textoBusca$ = this.textoBuscaSubject.asObservable();

  emitirTexto(texto: string) {
    this.textoBuscaSubject.next(texto);
  }
}

