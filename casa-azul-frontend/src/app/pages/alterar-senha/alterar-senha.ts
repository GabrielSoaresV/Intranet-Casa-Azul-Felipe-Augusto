import { Component, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ChangePasswordRequest } from '../../models/change-password-request.model';

@Component({
  selector: 'app-alterar-senha',
  standalone: false,
  templateUrl: './alterar-senha.html',
  styleUrl: './alterar-senha.css'
})
export class AlterarSenha {

  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  confirmarTroca() {
    if (this.novaSenha !== this.confirmarSenha) {
      return this.abrirModal('erro', 'Senhas Diferentes', 'A nova senha e a confirmação não coincidem.');
    }

    this.abrirModal(
      'confirmar',
      'Confirmar Alteração',
      'Deseja realmente alterar sua senha?',
      () => this.enviar()
    );
  }

  enviar() {
    const dto: ChangePasswordRequest = {
      currentPassword: this.senhaAtual,
      newPassword: this.novaSenha,
      confirmNewPassword: this.confirmarSenha
    };

    this.userService.changePassword(dto).subscribe({
      next: () => {
        this.abrirModal('sucesso', 'Sucesso', 'Senha alterada com sucesso!');
        this.senhaAtual = this.novaSenha = this.confirmarSenha = '';
      },
      error: (err) => {
        const msg = err.error?.message || 'Erro ao alterar a senha.';
        this.abrirModal('erro', 'Erro', msg);
      }
    });
  }

  // modal universal ↓
  modalAberto=false;modalTipo:any='info';modalTitulo='';modalMensagem='';callbackConfirmacao:any=null;

  abrirModal(t:any,ti:string,m:string,cb?:()=>void){this.modalTipo=t;this.modalTitulo=ti;this.modalMensagem=m;this.modalAberto=true;this.callbackConfirmacao=cb||null;this.cdr.detectChanges();}
  fecharModalGenerico(){this.modalAberto=false;if(this.callbackConfirmacao&&this.modalTipo!=='confirmar'){const f=this.callbackConfirmacao;this.callbackConfirmacao=null;setTimeout(()=>f(),50);}}
  executarConfirmacao(){if(this.callbackConfirmacao){const f=this.callbackConfirmacao;this.callbackConfirmacao=null;this.modalAberto=false;setTimeout(()=>f(),50);}}
}
