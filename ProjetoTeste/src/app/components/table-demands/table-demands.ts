import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DemandService } from '../../core/services/demand.service';
import { Demand } from '../../models/demand.model';

@Component({
  selector: 'app-table-demands',
  standalone: false,
  templateUrl: './table-demands.html',
  styleUrl: './table-demands.css'
})

export class TableDemands implements OnInit {
  displayedColumns: string[] = ['creator', 'title', 'description', 'status', 'priority'];
  dataSource = new MatTableDataSource<Demand>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private demandService: DemandService) {}

  ngOnInit(): void {
    this.loadDemands();
  }

  loadDemands(): void {
    this.demandService.getAllDemands().subscribe({
      next: (demands) => {
        this.dataSource.data = demands;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Erro ao carregar demandas:', err)
    });
  }

  getStatusClasses(status: string): string {
    switch(status) {
      case 'COMPLETED': return 'status-completo';
      case 'IN_PROGRESS': return 'status-em-progresso';
      case 'PENDING': return 'status-pendente';
      case 'CANCELLED': return 'status-cancelado';
      default: return '';
    }
  }

  getPriorityClasses(priority: string): string {
    switch(priority) {
      case 'HIGH': return 'prioridade-alta';
      case 'MEDIUM': return 'prioridade-media';
      case 'LOW': return 'prioridade-baixa';
      default: return '';
    }
  }
}