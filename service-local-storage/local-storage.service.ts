import { Injectable } from '@angular/core';

/**
 * About: Service responsible for getting and setting data to browser LocalStorage
 */
@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor() {}

    get<T>(key: string): T | null {
        const item = localStorage.getItem(key) || '';

        if (!item) {
            return null;
        }

        try {
            return <T>JSON.parse(item);
        } catch (error) {
            console.error(`Failed to JSON.parse [${JSON.stringify(error)}]`);

            return null;
        }
    }

    set<T>(key: string, value: T): void {
        let item = '{}';

        try {
            item = JSON.stringify(value);
        } catch (error) {
            console.error(`Failed to JSON.stringify [${JSON.stringify(error)}]`);
        }

        localStorage.setItem(key, item);
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
