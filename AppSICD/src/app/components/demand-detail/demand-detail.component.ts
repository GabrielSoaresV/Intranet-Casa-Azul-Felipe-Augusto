import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demand-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './demand-detail.component.html',
  styleUrls: ['./demand-detail.component.css']
})
export class DemandDetailComponent implements OnInit {
  // Propriedades que o template espera
  demand: any = {};
  messages: any[] = [];
  newMessage: string = '';
  sendingMessage: boolean = false;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    console.log('DemandDetailComponent initialized');
  }

  // Funções que o template chama
  updateStatus(status: string) {
    console.log(`updateStatus called with: ${status}`);
  }

  isMyMessage(message: any): boolean {
    console.log('isMyMessage called with:', message);
    return false;
  }

  formatTime(date: string): string {
    console.log('formatTime called with:', date);
    return date ? new Date(date).toLocaleTimeString() : '';
  }

  sendMessage() {
    console.log('sendMessage called with:', this.newMessage);
    this.newMessage = '';
  }

  goBack() {
  console.log('goBack called');
  this.router.navigate(['/dashboard']); // opcional: voltar para o dashboard
}

getStatusText(status: string): string {
  console.log('getStatusText called with:', status);
  return status; // apenas placeholder
}

getPriorityText(priority: string): string {
  console.log('getPriorityText called with:', priority);
  return priority; // apenas placeholder
}

assignToMe() {
  console.log('assignToMe called');
}

formatDate(date: string): string {
  console.log('formatDate called with:', date);
  return date ? new Date(date).toLocaleDateString('pt-BR') : '';
}

}
