import { LogLevel } from '../types/log-level.type';

export interface BackendLogItem {
    level: LogLevel;
    message: string;
    timestamp: Date;
}
