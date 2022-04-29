import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  regYear: number = new Date().getFullYear();
  mapiframe: SafeResourceUrl = '';
  constructor(private sanitizer: DomSanitizer) {
    this.mapiframe = sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5436.502004417077!2d73.74158686368604!3d24.57435829808969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDM0JzI3LjciTiA3M8KwNDQnNDYuMCJF!5e0!3m2!1sen!2sin!4v1585582520805!5m2!1sen!2sin'
    );
  }

  ngOnInit(): void {}
}
