import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DrugIntake, DrugService } from 'src/app/services/drug.service';
import { LogService } from 'src/app/services/log.service';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-modal-edit-intake',
  templateUrl: 'modal-edit-intake.component.html',
  styles: [
  ]
})
export class ModalEditIntakeComponent implements OnInit, OnDestroy {

  private intakeSub: Subscription|undefined;
  modalIntake: DrugIntake = DrugService.EMPTY_INTAKE;
  production = environment.production;

  constructor(private logger: LogService, private drugServ: DrugService) { }

  ngOnInit(): void {
    this.intakeSub = this.drugServ.getModalIntake().subscribe(next => this.modalIntake = next)
  }

  ngOnDestroy(): void {
    this.intakeSub!.unsubscribe();
  }

  intakeMatch(){
    return this.modalIntake.intake.match('20[0-9]{2}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-6][0-9]:[0-6][0-9]')
  }

  save(){
    this.drugServ.editDrugIntake(this.modalIntake);
    $("#editIntakeModal").modal("hide");
  }

}
