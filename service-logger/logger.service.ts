import { Injectable } from '@angular/core';
import { LogLevel } from './types/log-level.type';
import { FrontendLogItem } from './models/frontend-log-item.model';
import { BackendLogItem } from './models/backend-log-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LogCallback } from './models/log-callback.model';

/**
 * About: Service responsible for logging information to the Browser Console and to a Database via remote API
 */
@Injectable({
    providedIn: 'root',
})
export class LoggerService {
    private static readonly LogHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    });

    private readonly url: string;
    private readonly isProduction: boolean;
    private readonly buffer: Array<FrontendLogItem>;
    private readonly maxBufferSize: number;

    // Lookup object to translate LogLevel to appropriate console method
    private readonly consoleMethods: LogCallback[] = [
        { icon: '🐳', level: LogLevel.Debug, print: console.dir },
        { icon: '🐸', level: LogLevel.Information, print: console.log },
        { icon: '🐠', level: LogLevel.Warning, print: console.warn },
        { icon: '🐝', level: LogLevel.Error, print: console.error },
        { icon: '🐞', level: LogLevel.Fatal, print: console.error },
    ];

    constructor(
        private readonly http: HttpClient
    ) {
        this.buffer = [];
        this.maxBufferSize = 10000;
        this.url = environment.logger.url;
        this.isProduction = environment.production;
    }

    //-------------------------------------------------------------
    // Section: Private methods
    //-------------------------------------------------------------

    private log(message: string, level: LogLevel, logToDb: boolean): void {
        const { print = console.log, icon = '🐸' } = this.getLogMethod(level);

        const timestamp = new Date();

        // (1). Clear buffer and browser if the log is to big
        if (this.buffer.length > this.maxBufferSize) {
            this.clearBuffer();
        }

        const runtimeLogItem: FrontendLogItem = {
            level: level,
            message: `${icon} ${message} ${timestamp.toLocaleString()}`,
        };

        // (2). Store message in Buffer to be displayed in the app that is running in Kiosk-mode
        this.buffer.push(runtimeLogItem);

        // (3). Log to browser console during development
        if (!this.isProduction) {
            print(runtimeLogItem.message);
        }

        const backendLogItem: BackendLogItem = {
            level: level,
            message: message,
            timestamp: timestamp,
        };

        // (4). Log to database
        if (logToDb) {
            this.http.post<BackendLogItem>(this.url, backendLogItem, {
                headers: this.headers
            });
        }
    }

    private getLogMethod(level: LogLevel): LogCallback {
        return (
            this.consoleMethods.find((item: LogCallback) => {
                return item.level === level;
            }) || <LogCallback>{}
        );
    }

    private clearBuffer(): void {
        console.clear();

        this.buffer.splice(0, this.buffer.length);
    }

    //-------------------------------------------------------------
    // Section: Public interface
    //-------------------------------------------------------------

    dump(): void {
        console.clear();

        this.buffer.forEach((item: FrontendLogItem) => {
            const { print = console.log } = this.getLogMethod(item.level);

            print(item.message);
        });
    }

    getBuffer(): Array<FrontendLogItem> {
        return this.buffer;
    }

    debug(message: string, logToDb: boolean = false): void {
        this.log(message, LogLevel.Debug, logToDb);
    }

    information(message: string, logToDb: boolean = false): void {
        this.log(message, LogLevel.Information, logToDb);
    }

    warning(message: string, logToDb: boolean = true): void {
        this.log(message, LogLevel.Warning, logToDb);
    }

    error(message: string, logToDb: boolean = true): void {
        this.log(message, LogLevel.Error, logToDb);
    }

    fatal(message: string, logToDb: boolean = true): void {
        this.log(message, LogLevel.Fatal, logToDb);
    }
}
