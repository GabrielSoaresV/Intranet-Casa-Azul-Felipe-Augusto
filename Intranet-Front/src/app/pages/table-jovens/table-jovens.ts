import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InterfaceEmpresa } from '../../models/interface-empresa.model';
import { EmpresaService } from '../../service/empresa';
import { BuscaService } from '../../service/busca.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-jovens',
  standalone: false,
  templateUrl: './table-jovens.html',
  styleUrls: ['./table-jovens.css']
})
export class TableJovens implements OnInit {
  empresas: InterfaceEmpresa[] = [];
  todasEmpresas: InterfaceEmpresa[] = [];
  registroExpandido: number | null = null;
  registroEditando: InterfaceEmpresa | null = null;
  private buscaSubscription!: Subscription;

  constructor(
    private empresaService: EmpresaService,
    private buscaService: BuscaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDados();

    this.buscaSubscription = this.buscaService.textoBusca$.subscribe((texto) => {
      this.aplicarFiltro(texto);
    });
  }

  carregarDados(): void {
    this.empresaService.listar().subscribe({
      next: (dados) => {
        this.todasEmpresas = dados;
        this.empresas = dados;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar dados', err)
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

  confirmar(empresa: InterfaceEmpresa) {
    console.log('Enviar:', empresa);
  }

  editarRegistro(empresa: InterfaceEmpresa) {
    this.registroEditando = { ...empresa };
  }

  salvarEdicao() {
    if (!this.registroEditando) return;

    this.empresaService.atualizarEmpresa(this.registroEditando).subscribe({
      next: () => {
        alert(`Alterações salvas com sucesso para ${this.registroEditando?.nomeEmpresa}!`);
        this.fecharModal();
        this.carregarDados(); // Atualiza a lista
      },
      error: (err) => {
        console.error('Erro ao salvar edição:', err);
        alert('Erro ao salvar alterações.');
      }
    });
  }

  fecharModal() {
    this.registroEditando = null;
  }

  excluir(empresa: InterfaceEmpresa) {
    if (confirm(`Confirma exclusão do registro ${empresa.cnpj}?`)) {
      this.empresaService.excluir(empresa.cnpj).subscribe({
        next: () => {
          alert('Registro excluído com sucesso!');
          this.empresas = this.empresas.filter(emp => emp.cnpj !== empresa.cnpj);
          this.todasEmpresas = this.todasEmpresas.filter(emp => emp.cnpj !== empresa.cnpj);
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
