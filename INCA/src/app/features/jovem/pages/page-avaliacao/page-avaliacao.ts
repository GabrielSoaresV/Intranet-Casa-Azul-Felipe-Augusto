import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AvaliacaoService } from '../../../../core/services/avaliacao.service';
import { Avaliacao } from '../../../../models/avaliacao';

@Component({
  selector: 'app-page-avaliacao',
  standalone: false,
  templateUrl: './page-avaliacao.html',
  styleUrls: ['./page-avaliacao.css'],
})
export class PageAvaliacao implements OnInit {

  matricula!: string;
  avaliacoes: Avaliacao[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;
  expandedAvaliacao: Avaliacao | null = null;

  novaAvaliacao: Avaliacao = {
    avaliacao: '',
    numeroAvaliacao: 'UM',
    dataAvaliacao: new Date().toISOString()
  };

  constructor(
    private route: ActivatedRoute,
    private avaliacaoService: AvaliacaoService
  ) {}

  ngOnInit(): void {
    this.matricula = this.route.snapshot.paramMap.get('matricula')!;
    this.carregarAvaliacoes();
  }

  carregarAvaliacoes() {
    this.loading = true;
    this.errorMessage = null;

    this.avaliacaoService.listarPorJovem(this.matricula).subscribe({
      next: (res) => {
        this.avaliacoes = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar avaliações.';
        this.loading = false;
      }
    });
  }


  salvar() {
    this.avaliacaoService.salvar(this.matricula, this.novaAvaliacao).subscribe({
      next: (res) => {
        this.avaliacoes.push(res);
        this.novaAvaliacao = {
          avaliacao: '',
          numeroAvaliacao: 'UM',
          dataAvaliacao: new Date().toISOString()
        };
        alert("Avaliação salva!");
      },
      error: (err) => console.error(err)
    });
  }

  excluir(id: number | undefined) {
    if (!id) return;

    this.avaliacaoService.excluir(id).subscribe({
      next: () => {
        this.avaliacoes = this.avaliacoes.filter(a => a.idAvaliacao !== id);
      }
    });
  }

  toggleExpand(av: Avaliacao) {
    this.expandedAvaliacao = this.expandedAvaliacao === av ? null : av;
  }

  gerarCertificado() {
    console.log("Gerar certificado da matrícula:", this.matricula);
  }

  get podeGerarCertificado() {
    return this.avaliacoes.length >= 4;
  }
}