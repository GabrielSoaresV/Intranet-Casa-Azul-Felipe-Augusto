import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { DemandaCreateDTO } from '../../dtos/dto-demandas/demanda-create.dto';
import { DemandaService } from '../../services/demanda';
import { CidadaoService } from '../../services/cidadao';

@Component({
  selector: 'app-demanda-form',
  standalone: false,
  templateUrl: './demanda-form.html',
  styleUrls: ['./demanda-form.css']
})
export class DemandaForm implements OnInit {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos-list' | 'cidadao-form' | 'demandas-list' | 'demanda-form'>();

  demanda: DemandaCreateDTO = new DemandaCreateDTO();
  cidadaos: { cpf: string; nome: string }[] = [];
  cpfSelecionado: string = '';

  constructor(
    private cidadaoService: CidadaoService,
    private demandaService: DemandaService
  ) {}

  ngOnInit(): void {
    this.carregarCidadaos();
  }

  carregarCidadaos(): void {
    this.cidadaoService.listar().subscribe({
      next: (res: any) => {
        if (res.data && Array.isArray(res.data)) {
          this.cidadaos = res.data.map((c: any) => ({
            cpf: c.cpf,
            nome: c.nome
          }));
          if (this.cidadaos.length > 0) {
            this.cpfSelecionado = this.cidadaos[0].cpf;
          }
        } else {
          this.cidadaos = [];
        }
      },
      error: () => {
        this.cidadaos = [];
      }
    });
  }

  salvar(): void {
    if (!this.cpfSelecionado) {
      alert('Selecione um cidadão!');
      return;
    }
    this.demanda.cpfCidadao = this.cpfSelecionado;

    this.demandaService.criar(this.demanda).subscribe({
      next: () => {
        this.componenteSelecionado.emit('demandas-list');
      },
      error: () => {}
    });
  }

  cancelar(): void {
    this.componenteSelecionado.emit('demandas-list');
  }
}
