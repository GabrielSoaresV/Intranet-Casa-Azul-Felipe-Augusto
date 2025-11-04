import { Component, OnInit } from '@angular/core';
import { DemandHistoryService } from '../../core/services/demand-history.service';
import { DemandHistory } from '../../models/demand-history.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-demand-history',
  standalone: false,
  templateUrl: './demand-history.html',
  styleUrl: './demand-history.css'
})
export class DemandHistoryList {
  loading = false;
  searchId = '';
  allHistory: DemandHistory[] = [];
  errorMessage = '';

  constructor(private historyService: DemandHistoryService) {}

  /** 🔹 Buscar histórico pelo ID digitado */
  searchHistory(): void {
    if (!this.searchId.trim()) {
      this.errorMessage = 'Por favor, digite um ID de demanda.';
      this.allHistory = [];
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.allHistory = [];

    console.log('🔍 Buscando histórico da demanda:', this.searchId);

    this.historyService.getHistoryByDemand(this.searchId.trim()).subscribe({
      next: (data) => {
        this.allHistory = data;
        this.loading = false;
        console.log('✅ Histórico carregado:', data);

        if (data.length === 0) {
          this.errorMessage = 'Nenhum histórico encontrado para essa demanda.';
        }
      },
      error: (err) => {
        console.error('❌ Erro ao buscar histórico:', err);
        this.errorMessage = 'Erro ao buscar o histórico. Verifique o ID da demanda.';
        this.loading = false;
      }
    });
  }

  /** 🔹 Define classe CSS com base na ação */
  getActionClass(action: string): string {
    switch (action?.toLowerCase()) {
      case 'created': return 'action-created';
      case 'updated': return 'action-updated';
      case 'assigned': return 'action-assigned';
      case 'completed': return 'action-completed';
      case 'cancelled': return 'action-cancelled';
      default: return '';
    }
  }

  /** 🔹 Retorna texto legível para a ação */
  getActionText(action: string): string {
    switch (action?.toLowerCase()) {
      case 'created': return 'Criada';
      case 'updated': return 'Atualizada';
      case 'assigned': return 'Atribuída';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return 'Alteração';
    }
  }

  /** 🔹 Formata a data/hora */
  formatDateTime(date?: string | Date): string {
    if (!date) return 'Data não disponível';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Data inválida';
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}