import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  test: Date = new Date();

  onNavigate(url: string) {
    // window.open(url, '_blank');
  }
}
