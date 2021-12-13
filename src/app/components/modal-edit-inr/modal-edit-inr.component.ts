import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InrMeasure, INRService } from 'src/app/services/inr.service';
import { LogService } from 'src/app/services/log.service';
import { dateMatch } from 'src/app/services/util';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-modal-edit-inr',
  templateUrl: 'modal-edit-inr.component.html',
  styles: [
  ]
})
export class ModalEditInrComponent implements OnInit, OnDestroy {

  private intakeSub: Subscription|undefined;
  modalInrMeasure: InrMeasure = INRService.EMPTY_INR_MEASURE;
  production = environment.production;

  constructor(private logger: LogService, private inrServ: INRService) { }

  ngOnInit(): void {
    this.intakeSub = this.inrServ.getModalMeasure().subscribe(next => this.modalInrMeasure = next)
  }

  ngOnDestroy(): void {
    this.intakeSub!.unsubscribe();
  }

  checkDate() {
    if(!this.modalInrMeasure.measureDate)
      return false;
    return dateMatch(this.modalInrMeasure.measureDate!);
  }

  save(){
    this.inrServ.editInrMeasure(this.modalInrMeasure);
    $("#editInrModal").modal("hide");
  }

}
