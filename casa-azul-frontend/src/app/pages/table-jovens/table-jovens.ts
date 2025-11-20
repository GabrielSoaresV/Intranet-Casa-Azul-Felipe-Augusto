import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { InterfaceJovem } from '../../models/interface-jovem.model';
import { JovemService } from '../../service/jovem';
import { BuscaService } from '../../service/busca.service';
import { Subscription } from 'rxjs';
import { EmailJovemDTO } from '../../models/interface-email-dto.model';
import { EmailService } from '../../service/email.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table-jovens',
  standalone: false,
  templateUrl: './table-jovens.html',
  styleUrls: ['./table-jovens.css'],
})
export class TableJovens implements OnInit, OnDestroy {
  jovens: InterfaceJovem[] = [];
  todosJovens: InterfaceJovem[] = [];

  registroExpandido: number | null = null;
  registroEditando: InterfaceJovem | null = null;

  textoBusca: string = '';

  private buscaSubscription?: Subscription;

  constructor(
    private jovemService: JovemService,
    private buscaService: BuscaService,
    private cdr: ChangeDetectorRef,
    private emailService: EmailService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.carregarDados();

    this.buscaSubscription = this.buscaService.textoBusca$.subscribe(
      (texto) => this.aplicarFiltro(texto)
    );
  }

  ngOnDestroy(): void {
    this.buscaSubscription?.unsubscribe();
  }

  carregarDados(): void {
    this.jovemService.listar().subscribe({
      next: (dados) => {
        this.todosJovens = dados;
        this.jovens = dados;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar dados', err),
    });
  }

  aplicarFiltro(texto: string): void {
    if (!texto) {
      this.jovens = [...this.todosJovens];
      return;
    }

    const busca = texto.toLowerCase();

    this.jovens = this.todosJovens.filter(
      (jovem) =>
        jovem.nome?.toLowerCase().includes(busca) ||
        jovem.matricula?.toLowerCase().includes(busca) ||
        jovem.empresa?.nomeEmpresa?.toLowerCase().includes(busca)
    );

    this.cdr.detectChanges();
  }

  toggleDetalhes(index: number): void {
    this.registroExpandido = this.registroExpandido === index ? null : index;
  }

  getStatusClass(jovem: InterfaceJovem): string {
    if (!jovem?.contratacao || jovem.periodoAvaliacao == null) return '';

    const hoje = new Date();
    const contratacao = new Date(jovem.contratacao);
    const avaliacao = new Date(contratacao);
    avaliacao.setMonth(
      contratacao.getMonth() + Number(jovem.periodoAvaliacao)
    );

    const diff = Math.ceil((avaliacao.getTime() - hoje.getTime()) / 86400000);

    if (diff <= 7) return 'status-vermelho';
    if (diff <= 30) return 'status-amarelo';
    return 'status-verde';
  }

  editarRegistro(jovem: InterfaceJovem): void {
    this.registroEditando = { ...jovem };
  }

  salvarEdicao(): void {
    if (!this.registroEditando) return;

    this.jovemService.atualizarJovem(this.registroEditando).subscribe({
      next: () => {
        alert('Alterações salvas com sucesso!');
        this.fecharModal();
        this.carregarDados();
      },
      error: () => alert('Erro ao salvar alterações.'),
    });
  }

  excluir(matricula: string): void {
    if (!confirm('Deseja excluir este registro?')) return;

    this.jovemService.excluir(matricula).subscribe({
      next: () => {
        this.jovens = this.jovens.filter((j) => j.matricula !== matricula);
        this.todosJovens = this.todosJovens.filter(
          (j) => j.matricula !== matricula
        );
        alert('Registro excluído com sucesso!');
      },
      error: () => alert('Erro ao excluir registro.'),
    });
  }

  confirmar(jovem: InterfaceJovem) {
    console.log('Enviar avaliação:', jovem);
  }

  enviarEmail(jovem: InterfaceJovem) {
    if (!jovem?.matricula) {
      alert('Matrícula não encontrada para envio do email.');
      return;
    }

    this.emailService.enviarEmail(jovem.matricula).subscribe({
      next: () => {
        alert(`Email enviado com sucesso para a empresa de ${jovem.nome}!`);
      },
      error: (err) => {
        console.error('Erro ao enviar email:', err);
        alert('Erro ao enviar email.');
      }
    });
  }


  fecharModal(): void {
    this.registroEditando = null;
  }

  trackByMatricula(index: number, jovem: InterfaceJovem) {
    return jovem.matricula;
  }
}
