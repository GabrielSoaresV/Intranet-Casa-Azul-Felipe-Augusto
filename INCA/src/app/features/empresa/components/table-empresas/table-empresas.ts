import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmpresaService } from '../../../../core/services/empresa.service';
import { Empresa } from '../../../../models/empresa';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData } from '../../../../shared/confirm-dialog/confirm-dialog';
import { ModalEditarEmpresa } from '../modal-edit-empresa/modal-edit-empresa';

@Component({
  selector: 'app-table-empresas',
  standalone: false,
  templateUrl: './table-empresas.html',
  styleUrls: ['./table-empresas.css']
})
export class TableEmpresas implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'nomeEmpresa',
    'cnpj',
    //'emailEmpresa',
    'telefoneEmpresa',
    'rhNomeResponsavel',
    'actions'
  ];

  dataSource = new MatTableDataSource<Empresa>([]);
  expandedElement: Empresa | null = null;

  searchTerm = '';
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empresaService: EmpresaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmpresas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    // 🔎 Permite filtrar listas (como emailEmpresa[])
    this.dataSource.filterPredicate = (data: Empresa, filter: string) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.includes(filter);
    };
  }

  loadEmpresas(): void {
    this.empresaService.listarTodas().subscribe({
      next: empresas => {
        this.dataSource.data = empresas;
      },
      error: () => this.errorMessage = 'Erro ao carregar empresas.'
    });
  }

  toggleExpand(row: Empresa): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  clearFilter(): void {
    this.searchTerm = '';
    this.dataSource.filter = '';
  }

  editarEmpresa(empresa: Empresa) {
    const dialogRef = this.dialog.open(ModalEditarEmpresa, {
      width: '520px',
      data: empresa
    });

    dialogRef.afterClosed().subscribe(atualizou => {
      if (atualizou) {
        this.loadEmpresas();
      }
    });
  }

  deleteEmpresa(empresa: Empresa): void {
    const data: ConfirmDialogData = {
      title: 'Excluir Empresa',
      message: `Deseja realmente excluir "${empresa.nomeEmpresa}"?`,
      confirmText: 'Excluir'
    };

    const dialogRef = this.dialog.open(ConfirmDialog, { width: '360px', data });

    dialogRef.afterClosed().subscribe(ok => {
      if (!ok) return;

      this.empresaService.excluir(empresa.cnpj).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(e => e.cnpj !== empresa.cnpj);
        },
        error: () => this.errorMessage = 'Erro ao excluir empresa.'
      });
    });
  }
}
