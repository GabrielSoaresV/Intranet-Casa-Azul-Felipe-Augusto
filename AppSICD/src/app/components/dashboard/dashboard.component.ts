import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { DemandsService } from '../../services/demands.service';
import { Demand } from '../../models/types';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  demands: Demand[] = [];
  filteredDemands: Demand[] = [];
  loading = true;
  selectedStatus = 'all';

  constructor(
    private demandsService: DemandsService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadDemands();
  }

  async loadDemands() {
    this.loading = true;
    try {
      this.demands = await firstValueFrom(this.demandsService.getAllDemands());
      this.filterDemands();
    } catch (error) {
      console.error('Erro ao carregar demandas:', error);
    } finally {
      this.loading = false;
    }
  }

  filterDemands() {
    if (this.selectedStatus === 'all') {
      this.filteredDemands = this.demands;
    } else {
      this.filteredDemands = this.demands.filter(d => d.status === this.selectedStatus);
    }
  }

  onFilterChange(status: string) {
    this.selectedStatus = status;
    this.filterDemands();
  }

  viewDemand(demandId: string) {
    this.router.navigate(['/demand', demandId]);
  }

  // ===================== PLACEHOLDERS =====================
  getStatusText(status: string): string {
    console.log('getStatusText chamado');
    return status; // Placeholder
  }

  getPriorityText(priority: string): string {
    console.log('getPriorityText chamado');
    return priority; // Placeholder
  }

  formatDate(date: string): string {
    console.log('formatDate chamado');
    return date; // Placeholder
  }

  goBack() {
    console.log('goBack chamado');
  }

  assignToMe() {
    console.log('assignToMe chamado');
  }

  newMessage: string = '';
  sendMessage() {
    console.log('sendMessage chamado', this.newMessage);
  }
}
