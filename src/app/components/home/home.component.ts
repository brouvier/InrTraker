import { Component, OnDestroy, OnInit } from '@angular/core';
import { max, min, reduce, Subscription } from 'rxjs';
import { DrugService, LastDrugIntake } from 'src/app/services/drug.service';
import { InrMeasure, INRService } from 'src/app/services/inr.service';
import { LogService } from 'src/app/services/log.service';
import { formatDateTime, addHours } from 'src/app/services/util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  production = environment.production;
  lastIntakesSub: Subscription | undefined;
  inrMeasuresSub: Subscription | undefined;
  lastIntakes: LastDrugIntake[] = [];
  dt = formatDateTime(new Date());

  constructor(private logger: LogService, private drugs: DrugService, private inr: INRService) { }

  ngOnInit(): void {
    this.lastIntakesSub = this.drugs.getLastIntakes().subscribe(next => this.lastIntakes = next);
    this.inrMeasuresSub = this.inr.getInrMeasures().subscribe(next => this.formatGraphData(next));
  }

  ngOnDestroy(): void {
    this.lastIntakesSub!.unsubscribe();
    this.inrMeasuresSub!.unsubscribe;
  }

  nextIntake(dIntake: LastDrugIntake): string {
    if (dIntake.lastIntake == null)
      return '';
    return addHours(dIntake.lastIntake!, dIntake.maxFrequency);
  }

  addIntake(drugId: number) {
    this.drugs.addDrugIntake(drugId);
  }

  /* Chart https://echarts.apache.org/en/index.html https://xieziyu.github.io/ngx-echarts/#/welcome */

  public inrGraphUpdateOptions: any;

  private formatGraphData(inrMeasures: InrMeasure[]){
    const newData: any[] = [];
    var minDate: Date|null = null;
    var maxDate: Date|null = null;

    if(inrMeasures.length == 0)
      return;

    inrMeasures.forEach(m => {
      const mDt: Date = new Date(m.measureDate);
      if(minDate == null || minDate > mDt) minDate = mDt;
      if(maxDate == null || maxDate < mDt) maxDate = mDt;
      newData.push([mDt, m.inr]);
    });

    // Ajout d'une marge d'une journée
    minDate = new Date(minDate!.getTime() - (1000 * 60 * 60 * 24));
    maxDate = new Date(maxDate!.getTime() + (1000 * 60 * 60 * 24));

    this.inrGraphUpdateOptions = { 
      xAxis: { type: 'time', min: minDate, max: maxDate, },
      series: [{ data: newData }] 
    };
  }

  public inrGraphOptions: any = {
    legend: { show: false },
    tooltip: { trigger: 'axis' },
    yAxis: {},
    xAxis: { type: 'time', },
    series: [
      {
        type: 'line',
        name: 'INR',
        data: [],
        smooth: true,
        markLine: {
          symbol: 'none',
          lineStyle: { color: '#ff0000', width: 2 },
          data: [
            { name: 'Min', yAxis: 2 },
            { name: 'Max', yAxis: 3 }
          ]
        }
      },
    ],
  }

}
