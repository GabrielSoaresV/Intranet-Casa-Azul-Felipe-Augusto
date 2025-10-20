import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandService } from '../../../core/services/demand.service';
import { AuthService } from '../../../core/services/auth.service';
import { Demand } from '../../../shared/models/demand.model';

@Component({
  selector: 'app-demand-list',
  standalone: false,
  templateUrl: './demand-list.component.html',
  styleUrls: ['./demand-list.component.css']
})
export class DemandListComponent implements OnInit {
  demands: Demand[] = [];
  filteredDemands: Demand[] = [];
  loading = false;

  filterStatus: string = 'ALL';
  filterPriority: string = 'ALL';
  searchTerm: string = '';

  showCreateModal = false;

  constructor(
    private demandService: DemandService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDemands();
  }

  loadDemands() {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();

    if (currentUser?.role === 'CITIZEN') {
      this.demandService.getDemandsByCreator(currentUser.cpf).subscribe({
        next: (demands) => {
          this.demands = demands;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading demands:', error);
          this.loading = false;
        }
      });
    } else {
      this.demandService.getAllDemands().subscribe({
        next: (demands) => {
          this.demands = demands;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading demands:', error);
          this.loading = false;
        }
      });
    }
  }

  applyFilters() {
    this.filteredDemands = this.demands.filter(demand => {
      const matchesStatus = this.filterStatus === 'ALL' || demand.status === this.filterStatus;
      const matchesPriority = this.filterPriority === 'ALL' || demand.priority === this.filterPriority;
      const matchesSearch = !this.searchTerm ||
        demand.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        demand.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  viewDemand(id: string | undefined) {
    if (id) {
      this.router.navigate(['/demands', id]);
    }
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  onDemandCreated() {
    this.closeCreateModal();
    this.loadDemands();
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'Pendente',
      'IN_PROGRESS': 'Em Andamento',
      'COMPLETED': 'Concluída',
      'CANCELLED': 'Cancelada'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'LOW': 'Baixa',
      'MEDIUM': 'Média',
      'HIGH': 'Alta'
    };
    return labels[priority] || priority;
  }

  canCreateDemand(): boolean {
    return true;
  }
}
