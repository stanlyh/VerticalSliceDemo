import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { ToastComponent } from '../shared/components/toast/toast.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <div style="display:flex;height:100vh;overflow:hidden;background:#060d1f">

      <!-- Sidebar -->
      <app-sidebar />

      <!-- Main content -->
      <main style="flex:1;overflow-y:auto">
        <div style="padding:2rem;max-width:80rem;margin:0 auto">
          <router-outlet />
        </div>
      </main>

      <!-- Toast notifications (global) -->
      <app-toast />
    </div>
  `
})
export class LayoutComponent {}
