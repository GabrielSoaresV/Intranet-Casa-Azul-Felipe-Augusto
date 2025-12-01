import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'avaliacao/:matricula',
    renderMode: RenderMode.Client
  },
  {
    path: 'editar-usuario/:username',
    renderMode: RenderMode.Client
  },
  {
    path: 'gerenciar-roles/:username',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
