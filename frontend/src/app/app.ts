import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SideMenu } from './side-menu/side-menu';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SideMenu
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  protected readonly dataService = inject(DataService);

  readonly isLoginRoute = signal<boolean>(false);
  readonly isMobileMenuOpen = signal<boolean>(false);

  constructor() {
    // Detect initial URL and subsequent route changes
    this.updateRouteState(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateRouteState(event.urlAfterRedirects || event.url);
        this.isMobileMenuOpen.set(false); // Close mobile drawer on route change
      });
  }

  private updateRouteState(url: string) {
    const cleanUrl = url.split('?')[0];
    this.isLoginRoute.set(cleanUrl === '/' || cleanUrl === '' || cleanUrl === '/login');
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  logout() {
    this.router.navigate(['/']);
    this.dataService.showToast('Sessão encerrada com sucesso.', 'info');
  }
}
