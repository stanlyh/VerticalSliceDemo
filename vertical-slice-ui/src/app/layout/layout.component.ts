import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { ToastComponent } from '../shared/components/toast/toast.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <div class="flex h-screen bg-gray-100 overflow-hidden">

      <!-- Sidebar -->
      <app-sidebar />

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-6 max-w-7xl mx-auto">
          <router-outlet />
        </div>
      </main>

      <!-- Toast notifications (global) -->
      <app-toast />
    </div>
  `
})
export class LayoutComponent {}
