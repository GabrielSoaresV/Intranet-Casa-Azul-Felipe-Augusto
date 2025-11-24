import {Component,OnInit,OnDestroy,ChangeDetectorRef,} from '@angular/core';
import { InterfaceJovem } from '../../models/interface-jovem.model';
import { ActivatedRoute, Router } from '@angular/router';
import { JovemService } from '../../service/jovem';
import { BuscaService } from '../../service/busca.service';
import { Subscription } from 'rxjs';
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

  // --- MODAL UNIVERSAL ---
  modalAberto = false;
  modalTipo: 'sucesso' | 'erro' | 'confirmar' | 'info' = 'info';
  modalTitulo = '';
  modalMensagem = '';
  callbackConfirmacao: (() => void) | null = null;

  constructor(
    private jovemService: JovemService,
    private buscaService: BuscaService,
    private cdr: ChangeDetectorRef,
    private emailService: EmailService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(() => {
      this.carregarDados();  // 🔥 Força recarregar ao voltar da avaliação
    });

    this.carregarDados();
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
      error: () =>
        this.abrirModal('erro', 'Erro ao Carregar', 'Não foi possível carregar os registros.')
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
  if (!jovem) return '';

  const hoje = new Date();

  // 1️⃣ Período em meses
  const periodo = Number(jovem.periodoAvaliacao);
  if (!periodo) return '';

  // 2️⃣ Selecionar a data base
  let dataBase: Date;

  if (jovem.ultimaAvaliacao) {
    // Se tiver avaliação → usar última avaliação
    dataBase = new Date(jovem.ultimaAvaliacao);
  } else {
    // Senão → usar contratação
    dataBase = new Date(jovem.contratacao);
  }

  // 3️⃣ Próxima data esperada
  const proxima = new Date(dataBase);
  proxima.setMonth(proxima.getMonth() + periodo);

  // 4️⃣ Diferença em dias
  const diff = Math.ceil((proxima.getTime() - hoje.getTime()) / 86400000);

  // 5️⃣ Regras do semáforo
  if (diff < 0) return 'status-vermelho';   // Atrasado
  if (diff <= 7) return 'status-vermelho';  // Última semana
  if (diff <= 30) return 'status-amarelo';  // Próximo mês

  return 'status-verde';
}
getStatusInfo(jovem: InterfaceJovem): string {
  if (!jovem) return '';

  const periodo = Number(jovem.periodoAvaliacao);
  if (!periodo) return '';

  const hoje = new Date();
  let dataBase: Date;

  // 1️⃣ Seleciona a data correta
  if (jovem.ultimaAvaliacao) {
    dataBase = new Date(jovem.ultimaAvaliacao);
  } else {
    dataBase = new Date(jovem.contratacao);
  }

  // 2️⃣ Próxima data prevista
  const proxima = new Date(dataBase);
  proxima.setMonth(proxima.getMonth() + periodo);

  // 3️⃣ Diferença de dias
  const diff = Math.ceil((proxima.getTime() - hoje.getTime()) / 86400000);

  // 4️⃣ Textos amigáveis
  if (diff < 0) return `Atrasado há ${Math.abs(diff)} dias`;
  if (diff === 0) return `Vence hoje`;
  if (diff === 1) return `Vence amanhã`;

  if (diff <= 7) return `Faltam ${diff} dias (atenção)`;
  if (diff <= 30) return `Próxima em ${diff} dias`;

  return `Dentro do prazo (${diff} dias restantes)`;
}

getDiasParaProximaAvaliacao(jovem: InterfaceJovem): number | null {
  if (!jovem) return null;

  const periodo = Number(jovem.periodoAvaliacao || 0);
  if (!periodo) return null;

  const hoje = new Date();

  // Se NÃO houver última avaliação → usar data da contratação
  const dataBase = jovem.ultimaAvaliacao
    ? new Date(jovem.ultimaAvaliacao)
    : new Date(jovem.contratacao);

  // Próxima avaliação = dataBase + periodo (em meses)
  const proxima = new Date(dataBase);
  proxima.setMonth(proxima.getMonth() + periodo);

  const diffMs = proxima.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDias;
}


  editarRegistro(jovem: InterfaceJovem): void {
    this.registroEditando = { ...jovem };
  }

  salvarEdicao(): void {
    if (!this.registroEditando) return;

    this.jovemService.atualizarJovem(this.registroEditando).subscribe({
      next: () => {
        this.abrirModal('sucesso', 'Salvo com Sucesso', 'As alterações foram registradas.');
        this.fecharModal();
        this.carregarDados();
      },
      error: () => {
        this.abrirModal('erro', 'Erro ao Salvar', 'Não foi possível aplicar as alterações.');
      },
    });
  }

  excluir(matricula: string): void {
    this.abrirModal(
      'confirmar',
      'Confirmar Exclusão',
      'Deseja realmente excluir este registro?',
      () => this.excluirRegistro(matricula)
    );
  }

  excluirRegistro(matricula: string) {
    this.jovemService.excluir(matricula).subscribe({
      next: () => {
        // Remove localmente primeiro
        this.jovens = this.jovens.filter(j => j.matricula !== matricula);
        this.todosJovens = this.todosJovens.filter(j => j.matricula !== matricula);

        // Atualiza visual ANTES do modal abrir
        this.cdr.detectChanges();

        // Mostra o modal de sucesso
        setTimeout(() => {
          this.abrirModal('sucesso', 'Excluído', 'O registro foi removido.');
        }, 0);

        // Recarrega do backend depois do modal de sucesso fechar
        setTimeout(() => this.carregarDados(), 150);
      },
      error: () => {
        this.abrirModal('erro', 'Erro ao Excluir', 'Não foi possível remover o registro.');
      }
    });
  }


  confirmar(jovem: InterfaceJovem) {
  }

  enviarEmail(jovem: InterfaceJovem) {
    if (!jovem?.matricula) {
      this.abrirModal('erro', 'Erro', 'Matrícula inválida.');
      return;
    }

    this.emailService.enviarEmail(jovem.matricula).subscribe({
      next: () => {
        this.abrirModal('sucesso', 'Email Enviado', `O email foi enviado para a empresa de ${jovem.nome}.`);
      },
      error: () => {
        this.abrirModal('erro', 'Falha no Envio', 'Ocorreu um erro ao enviar o email.');
      }
    });
  }

  fecharModal(): void {
    this.registroEditando = null;
  }

  // --- MODAL ---
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
  }

  fecharModalGenerico() {
    this.modalAberto = false;
    this.callbackConfirmacao = null;  // impede de excluir ao cancelar
  }

  irParaAvaliacao(jovem: any) {
    this.router.navigate(['/avaliacao', jovem.matricula]);
  }

  executarConfirmacao() {
    if (this.callbackConfirmacao) {
      const fn = this.callbackConfirmacao;
      this.callbackConfirmacao = null;
      fn();
    }

    this.modalAberto = false;
  }

  trackByMatricula(index: number, jovem: InterfaceJovem) {
    return jovem.matricula;
  }
}
