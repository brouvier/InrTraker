import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LogService } from "./log.service";
import { SecurityService } from "./security.service";
import { formatDateTime } from "./util";

export interface Drug {
    id: number;
    label: string;
    posology: string;
    maxFrequency: number;
    order: number;
}

export interface DrugIntake {
    id?: number;
    fkDrugId: number;
    intake: string;
}

export interface LastDrugIntake {
    id: number;
    label: string;
    lastIntake: string | null;
    posology: string;
    maxFrequency: number;
    order: number;
}

@Injectable()
export class DrugService {

    static EMPTY_INTAKE: DrugIntake = { id: 0, fkDrugId: 0, intake: '' };

    readonly drugUrl = environment.apiLocation + 'drug/';
    readonly drugIntakeUrl = environment.apiLocation + 'drug_intake/';

    private drugs$ = new BehaviorSubject<Drug[]>([]);
    private intakes$ = new BehaviorSubject<DrugIntake[]>([]);
    private lastIntakes$ = new BehaviorSubject<LastDrugIntake[]>([]);
    private modalIntake$ = new BehaviorSubject<DrugIntake>(DrugService.EMPTY_INTAKE);

    constructor(private httpClient: HttpClient, private logger: LogService, private security: SecurityService) {
        this.refresh();
    }

    refresh() {
        forkJoin({
            drugs: this.selectDrug() as Observable<Drug[]>,
            drugIntakes: this.selectDrugIntake() as Observable<DrugIntake[]>
        }).subscribe(
            r => {
                const hashTable = Object.create(null);
                const lastIntakes: LastDrugIntake[] = [];;
                r.drugs.forEach(d => {
                    hashTable[d.id] = { ...d, lastIntake: null };
                    lastIntakes.push(hashTable[d.id]);
                });
                r.drugIntakes.forEach(di => {
                    if (hashTable[di.fkDrugId].lastIntake == null || hashTable[di.fkDrugId].lastIntake! < di.intake) {
                        hashTable[di.fkDrugId].lastIntake = di.intake;
                    }
                });
                this.logger.debug('Calcul des dernières prises : ', lastIntakes);
                this.drugs$.next(r.drugs);
                this.intakes$.next(r.drugIntakes);
                this.lastIntakes$.next(lastIntakes);
            }
        )
    }

    getDrugs() { return this.drugs$.asObservable() }
    getIntakes() { return this.intakes$.asObservable() }
    getLastIntakes() { return this.lastIntakes$.asObservable() }

    addDrugIntake(drugId: number) {
        const di: DrugIntake = { fkDrugId: drugId, intake: formatDateTime(new Date()) };
        this.logger.debug('Ajout d\'une prise', di);

        this.insertNewDrugIntake(di).subscribe({
            next: response => this.refresh(),
            error: error => this.logger.error('insertNewDrugIntake error', error)
        });
    }

    removeDrugIntake(drugIntake: DrugIntake) {
        this.logger.debug('Suppression d\'une prise', drugIntake);

        this.deleteDrugIntake(drugIntake).subscribe({
            next: response => this.refresh(),
            error: error => this.logger.error('removeDrugIntake error', error)
        });
    }

    editDrugIntake(drugIntake: DrugIntake) {
        this.logger.debug('Edition d\'une prise', drugIntake);

        this.updateDrugIntake(drugIntake).subscribe({
            next: response => this.refresh(),
            error: error => this.logger.error('editDrugIntake error', error)
        });
    }

    private selectDrug() { return this.httpClient.get<Drug[]>(this.drugUrl + '/?by=order', {headers: this.security.getAppTocken()}) }
    private insertNewDrug(drug: Drug) { return this.httpClient.post(this.drugUrl, drug, {headers: this.security.getAppTocken()}) }
    private updateDrug(drug: Drug) { return this.httpClient.put(this.drugUrl + drug.id, drug, {headers: this.security.getAppTocken()}) }
    private deleteDrug(drug: Drug) { return this.httpClient.delete(this.drugUrl + drug.id, {headers: this.security.getAppTocken()}) }

    private selectDrugIntake() { return this.httpClient.get<DrugIntake[]>(this.drugIntakeUrl + '/?by=intake', {headers: this.security.getAppTocken()}) }
    private insertNewDrugIntake(drugIntake: DrugIntake) { return this.httpClient.post(this.drugIntakeUrl, drugIntake, {headers: this.security.getAppTocken()}) }
    private updateDrugIntake(drugIntake: DrugIntake) { return this.httpClient.put(this.drugIntakeUrl + drugIntake.id, drugIntake, {headers: this.security.getAppTocken()}) }
    private deleteDrugIntake(drugIntake: DrugIntake) { return this.httpClient.delete(this.drugIntakeUrl + drugIntake.id, {headers: this.security.getAppTocken()}) }

    /* Modal */
    setModalIntake(di: DrugIntake): void { this.modalIntake$.next(di) }
    getModalIntake(): Observable<DrugIntake> { return this.modalIntake$.asObservable() }
}