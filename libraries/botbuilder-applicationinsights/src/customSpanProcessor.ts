import { SpanProcessor, Span } from '@opentelemetry/sdk-trace-base';
import { TelemetryClient } from 'applicationinsights';
import { CorrelationContextManager } from 'applicationinsights/out/src/shim/CorrelationContextManager';
import { ICorrelationContext } from 'applicationinsights/out/src/shim/types';
import { Activity } from 'botframework-schema';
import * as crypto from 'crypto';

export class CustomSpanProcessor implements SpanProcessor {
    private telemetryClient: TelemetryClient;
    //private context: ICorrelationContext;
    spansProcessed: Array<Span> = [];

    constructor(telemetryClient: TelemetryClient) {
        this.telemetryClient = telemetryClient;
        //this.context = context;
    }

    forceFlush(): Promise<void> {
        return Promise.resolve();
    }

    onStart(span: Span): void {
        console.log(1);
        const correlationContext = CorrelationContextManager.spanToContextObject(
            span.spanContext(),
            span.parentSpanId,
            span.name
        );
        if (correlationContext && correlationContext['activity']) {
            const activity: Partial<Activity> = correlationContext['activity'];
            //const telemetryItem: any = envelope.data['baseData']; // TODO: update when envelope ts definition includes baseData
            //const userId: string = activity.from ? activity.from.id : '';
            // const channelId: string = activity.channelId || '';
            // const conversationId: string = activity.conversation ? activity.conversation.id : '';
            // Hashed ID is used due to max session ID length for App Insights session Id
            //const sessionId: string = conversationId;
            // ? crypto.createHash('sha256').update(conversationId).digest('base64')
            // : '';

            // Add additional properties
            span.setAttribute('activityId', activity.id);
            // telemetry.properties = telemetry.properties || {};
            // telemetry.properties.activityId = activity.id;
            // telemetry.properties.channelId = channelId;
            // telemetry.properties.activityType = activity.type;
            // telemetry.properties.conversationId = conversationId;
            // telemetry.properties.tags[appInsights.defaultClient.context.keys.userId] = channelId + userId;
            // telemetry.properties.tags[appInsights.defaultClient.context.keys.sessionId] = sessionId;
        }
    }

    onEnd(span: Span): void {
        console.log(2);
        const context = this.telemetryClient.context;
        // const envelope: any = {}; // Create an envelope object to hold telemetry data
        // const activity: any = span.attributes['ai.operation.id'];
        // const telemetryItem: any = span.attributes;

        // if (activity) {
        //     const userId = activity.from ? activity.from.id : '';
        //     const channelId = activity.channelId || '';
        //     const conversationId = activity.conversation ? activity.conversation.id : '';
        //     const sessionId = conversationId ? crypto.createHash('sha256').update(conversationId).digest('base64') : '';

        //     // Set user id and session id
        //     envelope.tags = {};
        //     envelope.tags[context.keys.userId] = channelId + userId;
        //     envelope.tags[context.keys.sessionId] = sessionId;

        //     // Add additional properties
        //     telemetryItem.properties = telemetryItem.properties || {};
        //     telemetryItem.properties.activityId = activity.id;
        //     telemetryItem.properties.channelId = channelId;
        //     telemetryItem.properties.activityType = activity.type;
        //     telemetryItem.properties.conversationId = conversationId;

        this.spansProcessed.push(span);

        // Send telemetry data
        //this.telemetryClient.trackTrace({ message: 'Custom Span Data', properties: telemetryItem.properties });
        //}
    }

    shutdown(): Promise<void> {
        return Promise.resolve();
    }
}
