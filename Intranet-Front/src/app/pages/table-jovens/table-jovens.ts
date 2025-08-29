import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  styleUrls: ['./table-jovens.css']
})
export class TableJovens implements OnInit {
  jovens: InterfaceJovem[] = [];
  todosJovens: InterfaceJovem[] = [];
  registroExpandido: number | null = null;
  registroEditando: InterfaceJovem | null = null;
  private buscaSubscription!: Subscription;

  constructor(
    private jovemService: JovemService,
    private buscaService: BuscaService,
    private cdr: ChangeDetectorRef,
    private emailService: EmailService,
    private http: HttpClient

  ) {}

  ngOnInit(): void {
    this.carregarDados();

    this.buscaSubscription = this.buscaService.textoBusca$.subscribe((texto) => {
      this.aplicarFiltro(texto);
    });
  }

  carregarDados(): void {
    this.jovemService.listar().subscribe({
      next: (dados) => {
        this.todosJovens = dados;
        this.jovens = dados;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar dados', err)
    });
  }

  aplicarFiltro(texto: string): void {
    if (!texto) {
      this.jovens = [...this.todosJovens];
    } else {
      const busca = texto.toLowerCase();
      this.jovens = this.todosJovens.filter(jovem =>
        jovem.nome?.toLowerCase().includes(busca) ||
        jovem.matricula?.toLowerCase().includes(busca)
      );
    }
    this.cdr.detectChanges();
  }

  toggleDetalhes(index: number) {
    this.registroExpandido = this.registroExpandido === index ? null : index;
  }

  confirmar(jovem: InterfaceJovem) {
    console.log('Enviar:', jovem);
  }

  editarRegistro(jovem: InterfaceJovem) {
    console.log('função editarRegistro, chamada');
    this.registroEditando = { ...jovem };
  }

  carregarRegistros(): void {
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
  getStatusClass(jovem: InterfaceJovem): string {
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

  verAvaliacoes(){
    console.log("verAvaliacoes chamada!");
  }

  enviarEmail(jovem: any) {
    
    const payload: EmailJovemDTO = {
      nomeJovem: jovem.nome,
      telefoneUsuario: jovem.telefone,
      nomeUsuario: jovem.nomeresponsavel,
      nomeOrientador: jovem.empresa.rhNomeResponsavel,
      emailDestino: jovem.empresa.emailEmpresa
    };

    console.log('DTO enviado:', payload);

    this.http.post(`http://localhost:8080/api/email/${jovem.matricula}`, payload, { responseType: 'text' })
    .subscribe({
      next: (res) => alert(res), 
      error: (err: any) => alert('Erro ao enviar email: ' + err.message)
    });
  }
}
