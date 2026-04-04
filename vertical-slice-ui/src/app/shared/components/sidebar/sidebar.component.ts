import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  color: string;
  colorDark: string;
  badge: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside style="width:16rem;min-width:16rem;height:100%;display:flex;flex-direction:column;
                  background:#030b1a;border-right:1px solid rgba(255,255,255,0.06);color:white">

      <!-- Brand -->
      <div style="display:flex;align-items:center;gap:0.75rem;padding:1.5rem;
                  border-bottom:1px solid rgba(255,255,255,0.06)">
        <div style="width:2.25rem;height:2.25rem;border-radius:0.75rem;display:flex;
                    align-items:center;justify-content:center;flex-shrink:0;
                    background:linear-gradient(135deg,#3b82f6,#6366f1)">
          <svg style="width:1.25rem;height:1.25rem;color:white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z
                 M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z
                 M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z
                 M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
        </div>
        <div>
          <p style="font-size:0.875rem;font-weight:700;color:white;line-height:1.2">Vertical Slice</p>
          <p style="font-size:0.75rem;color:#475569">Demo App</p>
        </div>
      </div>

      <!-- Nav -->
      <nav style="flex:1;padding:1.25rem 1rem;display:flex;flex-direction:column;gap:0.25rem;overflow-y:auto">
        <p style="font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;
                  padding:0 0.75rem;margin-bottom:0.75rem;color:#334155">Módulos</p>

        @for (item of navItems(); track item.route; let i = $index) {
          <a
            [routerLink]="item.route"
            routerLinkActive
            #rla="routerLinkActive"
            [routerLinkActiveOptions]="{ exact: false }"
            style="display:flex;align-items:center;gap:0.75rem;padding:0.625rem 0.75rem;
                   border-radius:0.75rem;font-size:0.875rem;font-weight:500;
                   transition:background 0.15s,border 0.15s;text-decoration:none;position:relative"
            [style.background]="rla.isActive ? item.color + '18' : 'transparent'"
            [style.border]="rla.isActive ? '1px solid ' + item.color + '44' : '1px solid transparent'">

            <!-- Number badge -->
            <span style="width:1.5rem;height:1.5rem;border-radius:50%;display:flex;align-items:center;
                         justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0"
                  [style.background]="item.color + '22'"
                  [style.color]="item.color">
              {{ i + 1 }}
            </span>

            <!-- Icon -->
            <span class="nav-icon" style="width:1rem;height:1rem;flex-shrink:0;transition:color 0.15s"
                  [style.color]="rla.isActive ? item.color : '#64748b'"
                  [innerHTML]="item.icon"></span>

            <!-- Label -->
            <span style="transition:color 0.15s"
                  [style.color]="rla.isActive ? item.color : '#94a3b8'">
              {{ item.label }}
            </span>

            <!-- Badge -->
            @if (rla.isActive) {
              <span style="margin-left:auto;font-size:0.65rem;font-weight:700;text-transform:uppercase;
                           padding:0.125rem 0.375rem;border-radius:0.25rem"
                    [style.color]="item.color"
                    [style.background]="item.color + '22'">
                {{ item.badge }}
              </span>
            }
          </a>
        }
      </nav>

      <!-- Footer -->
      <div style="padding:1rem 1.5rem;border-top:1px solid rgba(255,255,255,0.06)">
        <p style="font-size:0.75rem;color:#334155">.NET 10 + Angular 21</p>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  readonly navItems = signal<NavItem[]>([
    {
      label: 'Productos',
      route: '/products',
      badge: 'CRUD',
      color: '#f97316',
      colorDark: '#ea580c',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                 d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
             </svg>`
    },
    {
      label: 'Clientes',
      route: '/clients',
      badge: 'CRUD',
      color: '#06d6a0',
      colorDark: '#059669',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                    M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                    m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
             </svg>`
    },
    {
      label: 'Proveedores',
      route: '/providers',
      badge: 'CRUD',
      color: '#a855f7',
      colorDark: '#7c3aed',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                 d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5
                    M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
             </svg>`
    }
  ]);
}
