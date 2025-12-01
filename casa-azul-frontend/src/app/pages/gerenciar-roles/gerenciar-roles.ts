import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { RoleResponse } from '../../models/role-response.model';

@Component({
  selector: 'app-gerenciar-roles',
  standalone: false,
  templateUrl: './gerenciar-roles.html',
  styleUrl: './gerenciar-roles.css'
})
export class GerenciarRoles implements OnInit {

  usernameParam = '';
  todasRoles: RoleResponse[] = [];
  rolesUsuario: string[] = [];
  roleSelecionada = '';

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usernameParam = this.route.snapshot.params['username'];
    this.carregar();
  }

  carregar() {
    this.roleService.getAllRoles().subscribe({ next: (r) => this.todasRoles = r });

    this.roleService.getUserRoles(this.usernameParam).subscribe({
      next: (roles) => this.rolesUsuario = roles,
      error: () => this.abrirModal('erro', 'Erro', 'Não foi possível carregar as roles.')
    });
  }

  adicionarRole() {
    if (!this.roleSelecionada) return;

    this.abrirModal(
      'confirmar',
      'Adicionar Role',
      `Deseja adicionar a role ${this.roleSelecionada}?`,
      () => this.executarAdicionar()
    );
  }

  executarAdicionar() {
    this.roleService.addRole(this.usernameParam, { roleName: this.roleSelecionada }).subscribe({
      next: () => {
        this.abrirModal('sucesso', 'Sucesso', 'Role adicionada!');
        this.carregar();
      },
      error: () => this.abrirModal('erro', 'Erro', 'Falha ao adicionar role.')
    });
  }

  removerRole(role: string) {
    this.abrirModal(
      'confirmar',
      'Remover Role',
      `Deseja remover a role ${role}?`,
      () => this.executarRemover(role)
    );
  }

  executarRemover(role: string) {
    this.roleService.removeRole(this.usernameParam, { roleName: role }).subscribe({
      next: () => {
        this.abrirModal('sucesso', 'Sucesso', 'Role removida!');
        this.carregar();
      },
      error: () => this.abrirModal('erro', 'Erro', 'Falha ao remover role.')
    });
  }

  // modal universal ↓
  modalAberto=false;modalTipo:any='info';modalTitulo='';modalMensagem='';callbackConfirmacao:any=null;

  abrirModal(t:any,ti:string,m:string,cb?:()=>void){this.modalTipo=t;this.modalTitulo=ti;this.modalMensagem=m;this.modalAberto=true;this.callbackConfirmacao=cb||null;this.cdr.detectChanges();}
  fecharModalGenerico(){this.modalAberto=false;if(this.callbackConfirmacao&&this.modalTipo!=='confirmar'){const f=this.callbackConfirmacao;this.callbackConfirmacao=null;setTimeout(()=>f(),50);}}
  executarConfirmacao(){if(this.callbackConfirmacao){const f=this.callbackConfirmacao;this.callbackConfirmacao=null;this.modalAberto=false;setTimeout(()=>f(),50);}}
}
