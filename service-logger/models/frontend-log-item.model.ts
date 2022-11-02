import { LogLevel } from '../types/log-level.type';

export interface FrontendLogItem {
    level: LogLevel;
    message: string;
}
