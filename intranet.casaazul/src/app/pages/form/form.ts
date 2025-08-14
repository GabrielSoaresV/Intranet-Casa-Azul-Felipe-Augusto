import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JovemService } from '../../services/jovem';
import { JovemAprendiz } from '../../models/jovem-aprendiz.model';
import { BuscaService } from '../../services/busca.service';  

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})

export class Form implements OnInit, OnDestroy {
  jovens: JovemAprendiz[] = [];
  todosJovens: JovemAprendiz[] = [];
  registroExpandido: number | null = null;
  registroEditando: JovemAprendiz | null = null;
  private timerId: any;
  private buscaSubscription!: Subscription;

  constructor(
    private jovemService: JovemService,
    private buscaService: BuscaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log("função ngOnInit iniciada form");
    this.carregarDados();

    this.buscaSubscription = this.buscaService.textoBusca$.subscribe((texto) => {
      this.aplicarFiltro(texto);
    });

    this.timerId = setInterval(() => {
      this.cdr.detectChanges();
    }, 86400000);
  }

  ngOnDestroy(): void {
    console.log("função ngOnDestroy iniciada form");
    if (this.timerId) clearInterval(this.timerId);
    if (this.buscaSubscription) this.buscaSubscription.unsubscribe();
  }

  carregarDados(): void {
    console.log("função carregarDados iniciada form");
    this.jovemService.listar().subscribe({
      next: (dados) => {
        this.todosJovens = dados;
        this.jovens = dados;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar dados', err);
      }
    });
  }

  aplicarFiltro(texto: string): void {
    console.log("função aplicarFiltro iniciada form");
    if (!texto) {
      this.jovens = [...this.todosJovens];
    } else {
      this.jovens = this.todosJovens.filter(j =>
        j.nome?.toLowerCase().includes(texto) ||
        j.matricula?.toLowerCase().includes(texto)
      );
    }
    this.cdr.detectChanges();
  }

  getStatusClass(jovem: JovemAprendiz): string {
    console.log("função getStatusClass iniciada form");
    if (!jovem || !jovem.contratacao || jovem.periodoAvaliacao == null) return '';
    const hoje = new Date();
    const dataContratacao = new Date(jovem.contratacao);
    const periodoMeses = Number(jovem.periodoAvaliacao);
    const dataAvaliacao = new Date(dataContratacao);
    dataAvaliacao.setMonth(dataContratacao.getMonth() + periodoMeses);
    const diffDias = Math.ceil((dataAvaliacao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias <= 7) return 'status-vermelho';
    if (diffDias <= 30) return 'status-amarelo';
    return 'status-verde';
  }

  toggleDetalhes(index: number) {
    console.log("função toggleDetalhes iniciada form");
    this.registroExpandido = this.registroExpandido === index ? null : index;
  }

  editarRegistro(jovem: JovemAprendiz) {
    console.log("função editarRegistro iniciada form");
    this.registroEditando = { ...jovem };
  }

  carregarRegistros(): void {
    console.log("função carregarRegistros iniciada form");
    this.carregarDados();
  }

  salvarEdicao() {
    if (this.registroEditando) {
      this.jovemService.atualizarJovem(this.registroEditando).subscribe({
        next: () => {
          alert(`Alterações salvas com sucesso para ${this.registroEditando?.nome}!`);
          this.fecharModal();
          this.carregarRegistros();
        },
        error: (erro) => {
          console.error('Erro ao atualizar:', erro);
          alert('Erro ao salvar as alterações.');
        }
      });
    }
  }

  fecharModal() {
    this.registroEditando = null;
  }

  confirmar(jovem: JovemAprendiz) {
    console.log('Clicado:', jovem);
  }

  excluir(matricula: string): void {
  if (confirm(`Confirma exclusão do registro ${matricula}?`)) {
    this.jovemService.excluir(matricula).subscribe({
      next: () => {
        this.jovens = this.jovens.filter(j => j.matricula !== matricula);
        this.todosJovens = this.todosJovens.filter(j => j.matricula !== matricula);
        this.cdr.detectChanges();
        alert('Registro excluído com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao excluir registro', err);
        alert('Erro ao excluir o registro.');
      }
    });
   }
  }
}
