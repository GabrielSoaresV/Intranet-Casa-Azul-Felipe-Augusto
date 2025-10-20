import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { DemandsService } from '../../services/demands.service';
import { DemandHistory } from '../../models/types';
import { DemandHistoryService } from '../../services/demand-history.service';

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

  constructor(
    private demandsService: DemandsService,
    private historyService: DemandHistoryService
  ) {}

  async ngOnInit() {
    await this.loadAllHistory();
  }

  async loadAllHistory() {
    try {
      this.loading = true;

      // Pega todas as demandas
      const demands = (await this.demandsService.getAllDemands().toPromise()) || [];

      // Pega o histórico de cada demanda
      const historyPromises = demands.map(demand =>
        this.historyService.getHistoryByDemand(demand.id).toPromise()
      );

      const historyArrays = await Promise.all(historyPromises);

      // Filtra e ordena os históricos
      this.allHistory = historyArrays
        .flat()
        .filter((h): h is DemandHistory => !!h)
        .sort((a, b) => {
          const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

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
