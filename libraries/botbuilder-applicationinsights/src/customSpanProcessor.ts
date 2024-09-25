/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SpanProcessor, Span } from '@opentelemetry/sdk-trace-base';
import { TelemetryClient } from 'applicationinsights';
import { addBotIdentifiers } from './addBotIdentifiers';

export class CustomSpanProcessor implements SpanProcessor {
    constructor(private client: TelemetryClient) {}

    onEnd(span: Span): void {
    }
    
    onStart(span: Span): void {
        console.log('CustomSpanProcessor.onStart');
        addBotIdentifiers(span, this.client.context);
    }

    forceFlush(): Promise<void> {
        return Promise.resolve();
    }

    shutdown(): Promise<void> {
        return Promise.resolve();
    }
}
