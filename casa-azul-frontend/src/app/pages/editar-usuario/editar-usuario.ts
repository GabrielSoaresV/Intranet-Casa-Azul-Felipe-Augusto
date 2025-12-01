import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { UpdateUserRequest } from '../../models/update-user-request.model';

@Component({
  selector: 'app-editar-usuario',
  standalone: false,
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css'
})
export class EditarUsuario implements OnInit {

  usernameParam = '';
  dados: UpdateUserRequest = { username: '', email: '', cpf: '' };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usernameParam = this.route.snapshot.params['username'];
    this.carregar();
  }

  carregar() {
    this.userService.getUserDetails(this.usernameParam).subscribe({
      next: (user) => {
        this.dados.username = user.username;
        this.dados.email = user.email;
        this.dados.cpf = user.cpf;
      },
      error: () => this.abrirModal('erro', 'Erro', 'Usuário não encontrado.')
    });
  }

  salvarAlteracoes() {
    this.abrirModal('confirmar', 'Confirmar', 'Salvar alterações?', () => this.enviar());
  }

  enviar() {
    this.userService.updateUser(this.dados).subscribe({
      next: () => this.abrirModal('sucesso', 'Sucesso', 'Alterações salvas!'),
      error: (err) => this.abrirModal('erro', 'Erro', err.error?.message || 'Erro ao salvar.')
    });
  }

  formatarCPF(event: any) {
    let v = event.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d)/, "$1.$2.$3");
    else if (v.length > 3) v = v.replace(/(\d{3})(\d)/, "$1.$2");
    this.dados.cpf = v;
  }

  // Modal genérico 👇 (mesmo padrão)
  modalAberto=false; modalTipo:any='info'; modalTitulo=''; modalMensagem=''; callbackConfirmacao:any=null;

  abrirModal(t:any,ti:string,m:string,cb?:()=>void){this.modalTipo=t;this.modalTitulo=ti;this.modalMensagem=m;this.modalAberto=true;this.callbackConfirmacao=cb||null;this.cdr.detectChanges();}
  fecharModalGenerico(){this.modalAberto=false;if(this.callbackConfirmacao&&this.modalTipo!=='confirmar'){const f=this.callbackConfirmacao;this.callbackConfirmacao=null;setTimeout(()=>f(),50);}}
  executarConfirmacao(){if(this.callbackConfirmacao){const f=this.callbackConfirmacao;this.callbackConfirmacao=null;this.modalAberto=false;setTimeout(()=>f(),50);}}
}
