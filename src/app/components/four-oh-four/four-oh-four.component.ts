import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-four-oh-four',
  templateUrl: './four-oh-four.component.html',
  styleUrls: []
})
export class FourOhFourComponent implements OnInit {

  constructor(private logger: LogService) {}

  ngOnInit(): void {
    this.logger.debug("Utilisateur redirigé vers 404 !");
  }

}
