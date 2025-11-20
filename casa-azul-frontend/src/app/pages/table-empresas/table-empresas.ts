import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InterfaceEmpresa } from '../../models/interface-empresa.model';
import { EmpresaService } from '../../service/empresa';
import { BuscaService } from '../../service/busca.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-empresas',
  standalone: false,
  templateUrl: './table-empresas.html',
  styleUrl: './table-empresas.css'
})
export class TableEmpresa implements OnInit {
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
    console.log('função editarRegistro, chamada');
    this.registroEditando = { ...empresa };
  }

  carregarRegistros(): void {
    console.log('função carregarRegistros, chamada');
    this.carregarDados();
  }

  salvarEdicao() {
    console.log('função salvarEdicao, chamada');
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

  excluir(cnpj: string): void {
    if (confirm(`Confirma exclusão do registro ${cnpj}?`)) {
      this.empresaService.excluir(cnpj).subscribe({
        next: () => {
          this.empresas = this.empresas.filter(j => j.cnpj !== cnpj);
          this.todasEmpresas = this.todasEmpresas.filter(j => j.cnpj !== cnpj);
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

  formatarCnpj(cnpj: string): string {
    if (!cnpj) return '';
    let v = cnpj.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
    return v;
  }

  trackByCnpj(index: number, item: InterfaceEmpresa) {
    return item.cnpj;
  }
}
