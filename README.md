# Angular Snippets

## About
Reusable code snippets for Angular.

## Logger service
A log service that enables easy logging with public methods for Debug, Log, Warning, Error and Fatal Levels. This log service logs to:

- The console
- Internal buffer
- Backend API

The Internal Buffer is usefull to Display Log Messages for Apps Running in Browser Kiosk-mode. 

The various log methods will map to the browser console different log methods to display appropriate colors. Custom icons also exist to make it more easy to filter through the log.

### Usage
```ts
class AppComponent {
    private readonly logPrefix: string = `[${AppComponent.name}]`;

    constructor(
        private readonly logger: LoggerService
    ) { }

    doLogClick(): void {
        this.logger.debug(`${this.logPrefix} - This is a debug message`);
        this.logger.log(`${this.logPrefix} - This is a log message`);
        this.logger.warn(`${this.logPrefix} - This is a warning message`);
        this.logger.error(`${this.logPrefix} - This is a error message`);
        this.logger.fatal(`${this.logPrefix} - This is a fatal message`);
    }

    dumpLogClick(): void {
        this.logger.dump();
    }

    clearLogClick(): void {
        this.logger.clear();
    }

    getLogClick(): void {
        const log = this.logger.get();
    }
}
```

The code above will output content in the browser console as followed.

*TODO*

---

## Local storage service
A service to talk with the browser LocalStorage. Easy to use CRUD operations with model support. Same concept can be used to make a service for SessionStorage.

### Usage
```ts
class AppComponent {
    constructor(
        private readonly localStorage: LocalStorageService
    ) { }

    getUserClick(): void {
        
    }

    setUserClick(): void {

    }

    clearUserClick(): void {

    }

    clearAllClick(): void {

    }
}
```
---
