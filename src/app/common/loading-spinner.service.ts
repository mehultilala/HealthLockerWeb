import { Injectable } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';

import { LoadingSpinnerComponent } from './components/loading-spinner.component';

// ## LoadingSpinnerService provides centralized functionality to hide and reveal LoadingSpinnerComponent
// * reveal: attaches LoadingSpinnerComponent to _overlayRef
// * hide: detaches LoadingSpinnerComponent from _overlayRef

@Injectable({
  providedIn: 'root',
})
export class LoadingSpinnerService {
  constructor(private _overlay: Overlay) {}
  private _overlayRef!: OverlayRef;
  private loadingSpinnerPortal: ComponentPortal<LoadingSpinnerComponent> =
    new ComponentPortal(LoadingSpinnerComponent);

  reveal() {
    if (!this._overlayRef)
      this._overlayRef = this._overlay.create({
        width: '100%',
        height: '100%',
      });

    if (!this._overlayRef.hasAttached())
      this._overlayRef.attach(this.loadingSpinnerPortal);
  }

  hide() {
    if (!!this._overlayRef && this._overlayRef.hasAttached())
      this._overlayRef.detach();
  }
}
