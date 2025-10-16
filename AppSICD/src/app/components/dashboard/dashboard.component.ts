import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { DemandsService } from '../../services/demands.service';
import { Demand } from '../../models/types';

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
    try {
      this.loading = true;
      this.demands = await this.demandsService.getAllDemands();
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

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'in_progress': 'Em Andamento',
      'completed': 'Concluída',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  getPriorityText(priority: string): string {
    const priorityMap: Record<string, string> = {
      'low': 'Baixa',
      'medium': 'Média',
      'high': 'Alta'
    };
    return priorityMap[priority] || priority;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
