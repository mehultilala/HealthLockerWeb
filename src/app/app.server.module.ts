import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { AppComponent } from './app.component';

@NgModule({
  imports: [AppModule, ServerModule, FlexLayoutServerModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
