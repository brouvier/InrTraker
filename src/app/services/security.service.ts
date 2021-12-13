import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { sha256 } from "js-sha256";
import { environment } from "src/environments/environment";
import { LogService } from "./log.service";

@Injectable()
export class SecurityService {

    private static APP_STORAGE = localStorage;
    private static STORAGE_TOKEN_KEY = 'appToken';

    private token: string = '';

    constructor(private logger: LogService, private router: Router) { }

    unlock(pass: string) {
        this.token = sha256(environment.salt.concat(pass));
        SecurityService.APP_STORAGE.setItem(SecurityService.STORAGE_TOKEN_KEY, this.token);
        this.router.navigate(['home']);
    }

    lock() {
        this.token = '';
        SecurityService.APP_STORAGE.removeItem(SecurityService.STORAGE_TOKEN_KEY);
        this.router.navigate(['login']);
    }

    checkLock(withRedirect: boolean): boolean {
        const storageToken = SecurityService.APP_STORAGE.getItem(SecurityService.STORAGE_TOKEN_KEY);
        if (storageToken != null) {
            this.token = storageToken;
            if (withRedirect) {
                this.router.navigate(['home']);
            }
            return true
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }

    getAppTocken() {
        return { 'appToken': this.token };
    }

}