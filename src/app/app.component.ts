import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from './services/log.service';
import { SecurityService } from './services/security.service';

@Component({
  selector: 'app-root',
  template: `<div class="container"><router-outlet></router-outlet></div>`,
  styles: []
})
export class AppComponent {

  constructor(private logger: LogService, private security: SecurityService) {
    this.logger.debug("Initialisation de l'application");
    this.security.checkLock(true);
  }

}
