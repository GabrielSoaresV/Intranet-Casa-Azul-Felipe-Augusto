import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { DemandsService } from '../../services/demands.service';
import { DemandHistory } from '../../models/types';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  allHistory: DemandHistory[] = [];
  loading = true;

  constructor(private demandsService: DemandsService) {}

  async ngOnInit() {
    await this.loadAllHistory();
  }

  async loadAllHistory() {
    try {
      this.loading = true;
      const demands = await this.demandsService.getAllDemands();

      const historyPromises = demands.map(demand =>
        this.demandsService.getDemandHistory(demand.id)
      );

      const historyArrays = await Promise.all(historyPromises);
      this.allHistory = historyArrays.flat().sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      this.loading = false;
    }
  }

  getActionText(action: string): string {
    const actionMap: Record<string, string> = {
      'created': 'Criada',
      'updated': 'Atualizada',
      'assigned': 'Atribuída',
      'completed': 'Concluída',
      'cancelled': 'Cancelada'
    };
    return actionMap[action] || action;
  }

  getActionClass(action: string): string {
    const classMap: Record<string, string> = {
      'created': 'action-created',
      'updated': 'action-updated',
      'assigned': 'action-assigned',
      'completed': 'action-completed',
      'cancelled': 'action-cancelled'
    };
    return classMap[action] || '';
  }

  formatDateTime(date: string): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
