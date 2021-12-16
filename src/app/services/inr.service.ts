import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LogService } from "./log.service";
import { SecurityService } from "./security.service";
import { formatDate } from "./util";

export interface InrMeasure {
    id?: number;
    measureDate: string;
    inr: number;
    comment: string;
}

@Injectable()
export class INRService {

    static EMPTY_INR_MEASURE: InrMeasure = { id: 0, measureDate: '', inr: 0, comment: '' };

    readonly inrMeasureUrl = environment.apiLocation + 'inr_measure/';

    private inrMeasures$ = new BehaviorSubject<InrMeasure[]>([]);
    private modalInrMeasure$ = new BehaviorSubject<InrMeasure>(INRService.EMPTY_INR_MEASURE);

    constructor(private httpClient: HttpClient, private logger: LogService, private security: SecurityService) {
        this.logger.debug('Initialisation du service INRService');
        this.refresh();
    }

    refresh() {
        this.selectInrMeasure().subscribe(
            next => {
                this.logger.debug('Mise à jour des mesures d\'INR : ', next);
                this.inrMeasures$.next(next);
            }
        )
    }

    getInrMeasures(): Observable<InrMeasure[]> { return this.inrMeasures$.asObservable() }

    addInrMeasure(inr: number) {
        const im: InrMeasure = { measureDate: formatDate(new Date()), inr: inr, comment: '' };
        this.logger.debug('Ajout d\'une prise', im);

        this.insertNewInrMeasure(im).subscribe({
            next: response => this.refresh(),
            error: error => this.logger.error('insertNewInrMeasure error', error)
        });
    }

    removeInrMeasure(inrMeasure: InrMeasure) {
        this.logger.debug('Suppression d\'une mesure', inrMeasure);

        this.deleteInrMeasure(inrMeasure).subscribe({
            next: response => this.refresh(),
            error: error => this.logger.error('deleteInrMeasure error', error)
        });
    }

    saveInrMeasure(inrMeasure: InrMeasure) {
        this.logger.debug('Sauvegarde d\'une mesure', inrMeasure);

        if(inrMeasure.id == 0){
            this.insertNewInrMeasure(inrMeasure).subscribe({
                next: response => this.refresh(),
                error: error => this.logger.error('saveInrMeasure insert error', error)
            });
        } else {
            this.updateInrMeasure(inrMeasure).subscribe({
                next: response => this.refresh(),
                error: error => this.logger.error('saveInrMeasure update error', error)
            });
        }
    }

    private selectInrMeasure() { return this.httpClient.get<InrMeasure[]>(this.inrMeasureUrl, { headers: this.security.getAppTocken() }) }
    private insertNewInrMeasure(inrMeasure: InrMeasure) { return this.httpClient.post(this.inrMeasureUrl, inrMeasure, { headers: this.security.getAppTocken() }) }
    private updateInrMeasure(inrMeasure: InrMeasure) { return this.httpClient.put(this.inrMeasureUrl + inrMeasure.id, inrMeasure, { headers: this.security.getAppTocken() }) }
    private deleteInrMeasure(inrMeasure: InrMeasure) { return this.httpClient.delete(this.inrMeasureUrl + inrMeasure.id, { headers: this.security.getAppTocken() }) }

    /* Modal */
    setModalMeasure(di: InrMeasure): void { this.modalInrMeasure$.next(di) }
    getModalMeasure(): Observable<InrMeasure> { return this.modalInrMeasure$.asObservable() }
}