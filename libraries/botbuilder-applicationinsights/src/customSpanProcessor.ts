import { SpanProcessor, Span } from '@opentelemetry/sdk-trace-base';
import { TelemetryClient } from 'applicationinsights';
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
        // span.setAttribute('userId', 'user-id');
        // if (this.context && this.context.customProperties['activity']) {
        //     const activity: Partial<Activity> = this.context.customProperties['activity'];
        //     //const telemetryItem: any = envelope.data['baseData']; // TODO: update when envelope ts definition includes baseData
        //     const userId: string = activity.from ? activity.from.id : '';
        //     const channelId: string = activity.channelId || '';
        //     const conversationId: string = activity.conversation ? activity.conversation.id : '';
        //     // Hashed ID is used due to max session ID length for App Insights session Id
        //     const sessionId: string = conversationId
        //         ? crypto.createHash('sha256').update(conversationId).digest('base64')
        //         : '';

        //     // set user id and session id
        //     envelope.tags[appInsights.defaultClient.context.keys.userId] = channelId + userId;
        //     envelope.tags[appInsights.defaultClient.context.keys.sessionId] = sessionId;


        //     // Add additional properties
        //     // telemetryItem.properties = telemetryItem.properties || {};
        //     // telemetryItem.properties.activityId = activity.id;
        //     // telemetryItem.properties.channelId = channelId;
        //     // telemetryItem.properties.activityType = activity.type;
        //     // telemetryItem.properties.conversationId = conversationId;
        //     span.setAttribute('activityId', activity.id);
        //     span.setAttribute('channelId', channelId);
        //     span.setAttribute('activityType', activity.type);
        //     span.setAttribute('conversationId', conversationId);
        // }
    }

    onEnd(span: Span): void {
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
