import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmpresaService } from '../../services/empresa';
import { InterfaceEmpresa } from '../../models/empresa.model';
import { BuscaService } from '../../services/busca.service';


@Component({
  selector: 'app-form2',
  standalone: false,
  templateUrl: './form2.html',
  styleUrls: ['./form2.css']
})
export class Form2 implements OnInit, OnDestroy {
  empresas: InterfaceEmpresa[] = [];
  todasEmpresas: InterfaceEmpresa[] = [];
  registroExpandido: number | null = null;
  registroEditando: InterfaceEmpresa | null = null;
  private timerId: any;
  private buscaSubscription!: Subscription;

  constructor(
    private empresaService: EmpresaService,
    private buscaService: BuscaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log("função ngOnInit iniciada");
    this.carregarDados();

    this.buscaSubscription = this.buscaService.textoBusca$.subscribe((texto) => {
      this.aplicarFiltro(texto);
    });

    this.timerId = setInterval(() => {
      this.cdr.detectChanges();
    }, 86400000); // Atualiza diariamente (em ms)
  }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
    if (this.buscaSubscription) this.buscaSubscription.unsubscribe();
  }

  carregarDados(): void {
    this.empresaService.listar().subscribe({
      next: (dados) => {
        console.log("Dados recebidos do backend:", dados);
        this.todasEmpresas = dados;
        this.empresas = dados;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar dados', err);
      }
    });
  }

  aplicarFiltro(texto: string): void {
    if (!texto) {
      this.empresas = [...this.todasEmpresas];
    } else {
      const busca = texto.toLowerCase();
      this.empresas = this.todasEmpresas.filter(emp =>
        emp.nomeEmpresa?.toLowerCase().includes(busca) ||
        emp.cnpj?.toLowerCase().includes(busca)
      );
    }
    this.cdr.detectChanges();
  }

  toggleDetalhes(index: number) {
    this.registroExpandido = this.registroExpandido === index ? null : index;
  }

  editarRegistro(empresa: InterfaceEmpresa) {
    this.registroEditando = { ...empresa };
  }

  carregarRegistros(): void {
    this.carregarDados();
  }

  salvarEdicao() {
    if (this.registroEditando) {
      this.empresaService.atualizarEmpresa(this.registroEditando).subscribe({
        next: () => {
          alert(`Alterações salvas com sucesso para ${this.registroEditando?.nomeEmpresa}!`);
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

  confirmar(empresa: InterfaceEmpresa) {
    console.log('Clicado:', empresa);
  }

  excluir(cnpj: string): void {
    if (confirm(`Confirma exclusão do registro ${cnpj}?`)) {
      this.empresaService.excluir(cnpj).subscribe({
        next: () => {
          alert('Registro excluído com sucesso!');
          // Atualiza a lista local removendo o excluído
          this.empresas = this.empresas.filter(emp => emp.cnpj !== cnpj);
          this.todasEmpresas = this.todasEmpresas.filter(emp => emp.cnpj !== cnpj);
        },
        error: (err) => {
          console.error('Erro ao excluir registro', err);
          alert('Erro ao excluir o registro.');
        }
      });
    }
  }

    formatarCnpj(cnpj: string): string {
      if (!cnpj) return '';
      let v = cnpj.replace(/\D/g, '');
      v = v.replace(/^(\d{2})(\d)/, '$1.$2');
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
      return v;
    }
}
