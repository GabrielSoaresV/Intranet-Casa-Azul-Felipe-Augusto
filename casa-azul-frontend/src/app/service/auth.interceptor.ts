import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  // endpoints that should not get Authorization header automatically
  private skipAuthUrls = [
    '/auth/login',
    '/auth/refresh',
    '/users/register'
  ];

  constructor(private tokenService: TokenService, private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // don't modify requests to skipAuthUrls
    if (!this.shouldSkip(req.url)) {
      const token = this.tokenService.getAccessToken();
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(req).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401 && !this.shouldSkip(req.url)) {
          return this.handle401(req, next);
        }
        return throwError(() => err);
      })
    );
  }

  private shouldSkip(url: string): boolean {
    try {
      const path = new URL(url).pathname;
      return this.skipAuthUrls.some(skip => path.endsWith(skip));
    } catch {
      // if relative url, do a simple check
      return this.skipAuthUrls.some(skip => url.endsWith(skip));
    }
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;
          this.refreshSubject.next(res.accessToken);
          this.tokenService.setAccessToken(res.accessToken);
          this.tokenService.setRefreshToken(res.refreshToken);

          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${res.accessToken}`
            }
          });
          return next.handle(cloned);
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.tokenService.clear();
          // you can route to login page here if you want
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(cloned);
        })
      );
    }
  }
}
