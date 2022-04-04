import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export interface NavItem {
  path?: string;
  activeIcon?: string;
  inactiveIcon?: string;
  title?: string;
  children?: NavItem[];
  beta_version: string;
}

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ],
})
export class MenuListItemComponent implements OnInit {
  expanded!: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item!: NavItem;
  @Input() depth!: number;
  path!: string;

  constructor(public router: Router) {
    if (!this.depth) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    // this.navService.activeRouteAnouncer.subscribe((url: string) => {
    //   if (this.item.path && url) {
    //     this.expanded = url.indexOf(`/dashboard/${this.item.path}`) === 0;
    //     this.ariaExpanded = this.expanded;
    //   }
    // });
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.path = '/dashboard/'.concat(item!.path as string);
      this.router.navigate([this.path]);
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }
}
