import { LogRecord, LogRecordProcessor } from '@opentelemetry/sdk-logs';
import { Context } from '@opentelemetry/api';

export class CustomLogRecordProcessor implements LogRecordProcessor {
    shutdown(): Promise<void> {
        return Promise.resolve();
    }
    onEmit(logRecord: LogRecord, context?: Context): void {
        console.log('onEmit');
    }

    forceFlush(): Promise<void> {
        return Promise.resolve();
    }
}
