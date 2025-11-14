import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { DEFAULT_MENU, EURODAC_MENU, EXPERT_MENU } from './menu.models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    <ng-container *ngFor="let item of model; let i = index">
      <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
      <li *ngIf="item.separator" class="menu-separator"></li>
    </ng-container>
  </ul> `,
})
export class AppMenu {
  @Input() projectName: string = '';

  model: MenuItem[] = [];

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    const key = this.projectName.toLowerCase();

    switch (key) {
      case 'eurodac':
        this.model = EURODAC_MENU;
        break;
      case 'expert':
        this.model = EXPERT_MENU;
        break;
      default:
        this.model = DEFAULT_MENU;
        break;
    }
  }
}
