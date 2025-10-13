import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DemandaService } from '../../../services/demanda';
import { DemandaSearchDTO } from '../../../dtos/dto-demandas/demanda-search.dto';

@Component({
  selector: 'app-cidadao-demandas-modal',
  standalone: false,
  templateUrl: './cidadao-demandas-modal.html',
  styleUrls: ['./cidadao-demandas-modal.css']
})
export class CidadaoDemandasModal implements OnInit, OnChanges {
  @Input() cpf: string = '';
  @Input() nome: string = '';
  @Output() fechar = new EventEmitter<void>();

  demandas: DemandaSearchDTO[] = [];
  carregando: boolean = false;
  demandasExpandidas: { [id: number]: boolean } = {};

  constructor(private demandaService: DemandaService) {}

  ngOnInit(): void {
    this.carregando = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cpf'] && this.cpf) {
      this.carregando = true;
      setTimeout(() => {
        this.carregarDemandas();
      }, 200);
    }
  }

  carregarDemandas(): void {
    this.demandaService.listarPorCidadao(this.cpf).subscribe({
      next: (res: any) => {
        this.demandas = res.data || [];
        this.demandas.forEach(d => this.demandasExpandidas[d.id] = false);
        this.carregando = false;
      },
      error: () => {
        this.demandas = [];
        this.carregando = false;
      }
    });
  }

  toggleExpansao(id: number): void {
    Object.keys(this.demandasExpandidas).forEach(key => {
      if (+key !== id) this.demandasExpandidas[+key] = false;
    });
    this.demandasExpandidas[id] = !this.demandasExpandidas[id];
  }

  fecharModal(): void {
    this.fechar.emit();
  }
}
