/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogRecord, LogRecordProcessor } from '@opentelemetry/sdk-logs';
import { Context } from '@opentelemetry/api';
import { TelemetryClient } from 'applicationinsights';
import { addBotIdentifiers } from './addBotIdentifiers';

export class CustomLogRecordProcessor implements LogRecordProcessor {
    constructor(private client: TelemetryClient) {}

    onEmit(record: LogRecord, context?: Context): void {
        console.log('CustomLogRecordProcessor.onEmit');
        addBotIdentifiers(record, this.client.context);
    }

    shutdown(): Promise<void> {
        return Promise.resolve();
    }

    forceFlush(): Promise<void> {
        return Promise.resolve();
    }
}
