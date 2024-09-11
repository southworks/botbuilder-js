import { SpanProcessor, ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { TelemetryClient } from 'applicationinsights';
import * as crypto from 'crypto';

export class CustomSpanProcessor implements SpanProcessor {
    private telemetryClient: TelemetryClient;

    constructor(telemetryClient: TelemetryClient) {
        this.telemetryClient = telemetryClient;
    }

    forceFlush(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    onStart(_span: ReadableSpan): void {
        // Custom logic when a span starts
    }

    onEnd(span: ReadableSpan): void {
        const context = this.telemetryClient.context;
        const envelope: any = {}; // Create an envelope object to hold telemetry data
        const activity: any = span.attributes['ai.operation.id'];
        const telemetryItem: any = span.attributes;

        if (activity) {
            const userId = activity.from ? activity.from.id : '';
            const channelId = activity.channelId || '';
            const conversationId = activity.conversation ? activity.conversation.id : '';
            const sessionId = conversationId ? crypto.createHash('sha256').update(conversationId).digest('base64') : '';

            // Set user id and session id
            envelope.tags = {};
            envelope.tags[context.keys.userId] = channelId + userId;
            envelope.tags[context.keys.sessionId] = sessionId;

            // Add additional properties
            telemetryItem.properties = telemetryItem.properties || {};
            telemetryItem.properties.activityId = activity.id;
            telemetryItem.properties.channelId = channelId;
            telemetryItem.properties.activityType = activity.type;
            telemetryItem.properties.conversationId = conversationId;

            // Send telemetry data
            this.telemetryClient.trackTrace({ message: 'Custom Span Data', properties: telemetryItem.properties });
        }
    }

    shutdown(): Promise<void> {
        // Custom logic to handle shutdown
        return Promise.resolve();
    }
}
