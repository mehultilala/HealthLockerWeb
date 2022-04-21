import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-wrapper">
      <div class="spinner">
        <mat-spinner></mat-spinner>
        <span class="msg-margin">Please wait...</span>
      </div>
    </div>
  `,
  styles: [
    `
      .spinner-wrapper {
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.5);
        z-index: 998;
        background: rgba(0, 0, 0, 0.32);
      }

      .spinner {
        width: 18em;
        height: 10em;
        display: flex;
        justify-content: center;
        align-items: center;
        background: white;
        border-radius: 5px;
        box-shadow: 1px 1px 2px #cecece;
      }

      .msg-margin {
        margin-left: 1rem;
      }
    `,
  ],
})
export class LoadingSpinnerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
