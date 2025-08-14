import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-container',
  standalone: false,
  templateUrl: './main-container.html',
  styleUrls: ['./main-container.css']
})

export class MainContainer {
  @Input() tela: string = ''; 

}


