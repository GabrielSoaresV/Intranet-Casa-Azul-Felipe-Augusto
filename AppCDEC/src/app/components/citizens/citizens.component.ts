import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { CitizensService } from '../../services/citizens.service';
import { DemandsService } from '../../services/demands.service';
import { Citizen, Demand } from '../../models/types';
import { HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { CidadaoDTO } from '../../dtos/cidadao.dto';

@Component({
  selector: 'app-citizens',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule],
  templateUrl: './citizens.component.html',
  styleUrls: ['./citizens.component.css']
})
export class CitizensComponent implements OnInit {
  citizens: Citizen[] = [];
  loading = true;
  showModal = false;
  selectedCitizen: Citizen | null = null;
  citizenDemands: Demand[] = [];
  loadingDemands = false;

  constructor(
    private citizensService: CitizensService,
    private demandsService: DemandsService
  ) {}

  async ngOnInit() {
    await this.loadCitizens();
  }

  async loadCitizens() {
    try {
      this.loading = true;

      // Recebe os DTOs do backend
      const dtoList: CidadaoDTO[] = await firstValueFrom(this.citizensService.getAllCitizens());

      // Converte os DTOs para Citizen apenas com os campos disponíveis
      this.citizens = dtoList.map(dto => ({
        name: dto.nome || '',
        email: dto.email || '',
        cpf: dto.cpf || ''
      }));

      console.log('Cidadãos carregados (DTO):', this.citizens);
    } catch (error) {
      console.error('Erro ao carregar cidadãos:', error);
    } finally {
      this.loading = false;
    }
  }


  async viewCitizen(citizen: Citizen) {
    this.selectedCitizen = citizen;
    this.showModal = true;
    this.loadingDemands = true;

    try {
      this.citizenDemands = await this.demandsService.getDemandsByCitizen(citizen.cpf);
      console.log('Demandas do cidadão:', this.citizenDemands);
    } catch (error) {
      console.error('Erro ao carregar demandas:', error);
    } finally {
      this.loadingDemands = false;
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedCitizen = null;
    this.citizenDemands = [];
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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
