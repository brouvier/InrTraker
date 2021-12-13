import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Drug, DrugIntake, DrugService } from 'src/app/services/drug.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-intake-list',
  templateUrl: './intake-list.component.html',
  styles: [
  ]
})
export class IntakeListComponent implements OnInit, OnDestroy {

  private currentDrugId: number = 0;
  private drugsSub: Subscription|undefined;
  private intakesSub: Subscription|undefined;
  currentDrug: Drug = {id: 0, label: 'Erreur', posology: '', maxFrequency: 0};
  currentDrugIntakes: DrugIntake[] = [];


  constructor(private logger: LogService, private drugServ: DrugService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idDrug = this.route.snapshot.paramMap.get('idDrug');
    if(!isNaN(Number(idDrug))){
      this.currentDrugId = Number(idDrug);
    } else {
      this.currentDrugId = 0;
      this.logger.error('Identifiant de médicament invalide')
    }

    this.drugsSub = this.drugServ.getDrugs().subscribe(next => this.currentDrug = next.filter(d => d.id == this.currentDrugId)[0]);
    this.intakesSub = this.drugServ.getIntakes().subscribe(next => this.currentDrugIntakes = next.filter(i => i.fkDrugId == this.currentDrugId));
  }

  ngOnDestroy(): void {
    this.drugsSub!.unsubscribe();
    this.intakesSub!.unsubscribe();
  }

  editIntake(drugIntake: DrugIntake){
    this.drugServ.setModalIntake(drugIntake)
  }

  removeIntake(drugIntake: DrugIntake){
    this.drugServ.removeDrugIntake(drugIntake);
  }

}
