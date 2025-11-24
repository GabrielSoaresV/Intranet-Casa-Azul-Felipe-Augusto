import { Component, Input } from '@angular/core';
import { AvaliacoesService } from '../../service/avaliacoes.service';
import { ActivatedRoute } from '@angular/router';
import { InterfaceJovem } from '../../models/interface-jovem.model';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-avaliacao-form',
  standalone: false,
  templateUrl: './avaliacao-form.html',
  styleUrls: ['./avaliacao-form.css']
})
export class AvaliacaoForm {

  @Input() matricula!: string;
  avaliacaoTexto: string = '';
  carregando = false;
  erro: string | null = null;
  nomeJovem: string = '';
  proximaAvaliacao: string = '';

  constructor(
    private avaliacaoService: AvaliacoesService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  listaAvaliacoes: any[] = [];

  // Modal universal
  modalAberto = false;
  modalTipo: 'sucesso' | 'erro' | 'confirmar' | 'info' = 'info';
  modalTitulo = '';
  modalMensagem = '';
  mostrarModalAvaliacoes = false;
  avaliacoesDoJovem: any[] = [];

  callbackConfirmacao: (() => void) | null = null;

  ngOnInit() {
    this.matricula = this.route.snapshot.paramMap.get('matricula')!;

    this.avaliacaoService.listarJovem(this.matricula)
      .subscribe((j: InterfaceJovem) => {
        this.nomeJovem = j.nome;
      });

    this.avaliacaoService.listarPorJovem(this.matricula)
      .subscribe(lista => {
        const ordem = ['UM', 'DOIS', 'TRES', 'FINAL'];
        this.proximaAvaliacao = ordem[Math.min(lista.length, 3)];
      });
  }

  salvar() {
  if (!this.avaliacaoTexto.trim()) {
    this.erro = "A avaliação não pode estar vazia.";
    this.cdr.detectChanges();
    return;
  }

  this.erro = null;
  this.carregando = true;
  this.cdr.detectChanges(); // 🔥 força render imediatamente

  const payload = { avaliacao: this.avaliacaoTexto };

  this.avaliacaoService.salvarAvaliacao(this.matricula, payload)
    .subscribe({
      next: () => {

        this.carregando = false;

        this.abrirModal(
          'sucesso',
          'Avaliação Salva',
          'A avaliação foi registrada com sucesso!'
        );

        this.cdr.detectChanges(); // 🔥 força o modal a aparecer imediatamente
      },

      error: () => {

        this.carregando = false;

        this.abrirModal(
          'erro',
          'Erro ao Salvar',
          'Não foi possível registrar a avaliação.'
        );

        this.cdr.detectChanges(); // 🔥 força UI atualizar
      }
    });
}
abrirListaAvaliacoes() {
  this.avaliacaoService.listarPorJovem(this.matricula).subscribe(lista => {

    if (!lista || lista.length === 0) {
      this.abrirModal(
        'info',
        'Nenhuma Avaliação Encontrada',
        'Ainda não existem avaliações registradas para este jovem.'
      );
      return;
    }

    this.avaliacoesDoJovem = lista;
    this.mostrarModalAvaliacoes = true;
    this.cdr.detectChanges();
  });
}


  abrirModal(
    tipo: 'sucesso' | 'erro' | 'confirmar' | 'info',
    titulo: string,
    mensagem: string,
    callback?: () => void
  ) {
    this.modalTipo = tipo;
    this.modalTitulo = titulo;
    this.modalMensagem = mensagem;
    this.modalAberto = true;
    this.callbackConfirmacao = callback || null;
    this.cdr.detectChanges();
  }

  fecharModalGenerico() {
    this.modalAberto = false;
    this.callbackConfirmacao = null;

    // 🔥 Aqui garantimos que o backend terminou antes de voltar
    setTimeout(() => {
      this.router.navigate(['/gestao'], { queryParams: { reload: new Date().getTime() }});
    }, 200);
  }

  executarConfirmacao() {
    if (this.callbackConfirmacao) {
      this.callbackConfirmacao();
    }
    setTimeout(() => {
    this.router.navigate(['/gestao'], { queryParams: { reload: new Date().getTime() }});
  }, 200);
}
}
