import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CidadaoService } from '../../services/cidadao';
import { CidadaoSearchDTO } from '../../dtos/dto-cidadaos/cidadao-search.dto';

@Component({
  selector: 'app-cidadao-list',
  standalone: false,
  templateUrl: './cidadao-list.html',
  styleUrls: ['./cidadao-list.css']
})
export class CidadaoList implements OnInit {
  @Output() componenteSelecionado = new EventEmitter<'cidadaos-list' | 'cidadao-form' | 'demandas-list' | 'demanda-form'>();

  cidadaos: CidadaoSearchDTO[] = [];
  carregando = false;

  // Para modal
  modalAberto: boolean = false;
  cpfModal: string = '';
  nomeModal: string = '';

  constructor(private cidadaoService: CidadaoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarCidadaos();
  }

  carregarCidadaos(): void {
    this.carregando = true;
    this.cidadaoService.listar().subscribe({
      next: (res: any) => {
        this.cidadaos = res.data as CidadaoSearchDTO[];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar cidadãos:', err);
        this.carregando = false;
      }
    });
  }

  navegarPara(componente: 'cidadaos-list' | 'cidadao-form' | 'demandas-list' | 'demanda-form') {
    this.componenteSelecionado.emit(componente);
  }

  excluir(cidadao: CidadaoSearchDTO) {
    console.log('Excluir cidadão:', cidadao);
  }

  abrirModalDemandas(cidadao: CidadaoSearchDTO): void {
    this.cpfModal = cidadao.cpf;
    this.nomeModal = cidadao.nome;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }
}
