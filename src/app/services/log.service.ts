import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LogLevel } from './log.level.enum';

@Injectable()
export class LogService {

    level: LogLevel = environment.logLevel;

    private shouldLog(level: LogLevel): boolean {
        if ((level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.All)
            return true;
        return false;
    }

    private writeToLog(msg: string, level: LogLevel, params: any[]) {
        if (this.shouldLog(level)) {
            switch (level) {
                case LogLevel.Warn:
                    if(params.length > 0)
                        console.warn(this.getCurrentTime() + ' | ' + msg, params);
                    else
                        console.warn(this.getCurrentTime() + ' | ' + msg);
                    break;
                case LogLevel.Error:
                    if(params.length > 0)
                        console.error(this.getCurrentTime() + ' | ' + msg, params);
                    else
                        console.error(this.getCurrentTime() + ' | ' + msg);
                    break;
                case LogLevel.Fatal:
                    if(params.length > 0)
                        console.error(this.getCurrentTime() + ' | ' + msg, params);
                    else
                        console.error(this.getCurrentTime() + ' | ' + msg);
                    break;
                default:
                    if(params.length > 0)
                        console.log(this.getCurrentTime() + ' | ' + msg, params);
                    else
                        console.log(this.getCurrentTime() + ' | ' + msg);
            }
        }
    }

    debug(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Debug, optionalParams);
    }

    info(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Info, optionalParams);
    }

    warn(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Warn, optionalParams);
    }

    error(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Error, optionalParams);
    }

    fatal(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.Fatal, optionalParams);
    }

    log(msg: string, ...optionalParams: any[]) {
        this.writeToLog(msg, LogLevel.All, optionalParams);
    }

    getCurrentTime(): string {
        let dt = new Date();
        return dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + ',' + dt.getMilliseconds();
    }
}
