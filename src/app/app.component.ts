import { Component } from '@angular/core';
import { LogService } from './services/log.service';
import { SecurityService } from './services/security.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: []
})
export class AppComponent {

  constructor(private logger: LogService, private security: SecurityService) {
    this.logger.debug("Initialisation de l'application");
    this.security.checkLock(true);
  }

  lock(){
    this.security.lock();
  }

  isUnlock(): boolean{
    return this.security.getAppTocken().appToken != '';
  }

}
