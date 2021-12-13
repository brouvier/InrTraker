import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InrMeasure, INRService } from 'src/app/services/inr.service';
import { LogService } from 'src/app/services/log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-measure-list',
  templateUrl: 'measure-list.component.html',
  styles: [
  ]
})
export class MeasureListComponent implements OnInit, OnDestroy {

  production = environment.production;
  private measuresSub: Subscription|undefined;
  inrMeasures: InrMeasure[] = [];

  constructor(private logger: LogService, private inrServ: INRService) { }

  ngOnInit(): void {
    this.measuresSub = this.inrServ.getInrMeasures().subscribe(next => this.inrMeasures = next);
  }

  ngOnDestroy(): void {
    this.measuresSub!.unsubscribe();
  }

  edit(inr: InrMeasure){
    this.inrServ.setModalMeasure(inr)
  }

  remove(inr: InrMeasure){
    this.inrServ.removeInrMeasure(inr);
  }

}
