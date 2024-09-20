/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module botbuilder-applicationinsights
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
//require('./instrumentation'); // Ensure this is the first import
//const { setupOpentelemetry } = await import('./instrumentation');

import * as appInsights from 'applicationinsights';
import * as cls from 'cls-hooked';
//import * as crypto from 'crypto';

import {
    Activity,
    BotTelemetryClient,
    BotPageViewTelemetryClient,
    TelemetryDependency,
    TelemetryEvent,
    TelemetryException,
    TelemetryTrace,
    TelemetryPageView,
} from 'botbuilder-core';

// This is the currently recommended work-around for using Application Insights with async/await
// https://github.com/Microsoft/ApplicationInsights-node.js/issues/296
// This allows AppInsights to automatically apply the appropriate context objects deep inside the async/await chain.
// import {
//     CorrelationContext,
//     CorrelationContextManager,
// } from 'applicationinsights/out/AutoCollection/CorrelationContextManager';
import { CorrelationContextManager } from 'applicationinsights/out/src/shim/CorrelationContextManager';
import { ICorrelationContext } from 'applicationinsights/out/src/shim/types';
import { CorrelationContext, MapContext } from './CorrelationContext';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { CustomSpanProcessor } from './customSpanProcessor';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { Attributes, SpanOptions, Tracer, trace, TracerProvider } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';

import { Context, Span } from '@opentelemetry/api';
import { ReadableSpan, SpanProcessor } from '@opentelemetry/sdk-trace-base';
const { useAzureMonitor } = require('@azure/monitor-opentelemetry');
const resources = require('@opentelemetry/resources');

class SpanEnrichingProcessor implements SpanProcessor {
    forceFlush(): Promise<void> {
        return Promise.resolve();
    }
    onStart(span: Span, parentContext: Context): void {
        return;
    }
    onEnd(span: ReadableSpan): void {
        console.log('t2');
        // span.attributes['custom-attribute'] = 'custom-value';
        span.attributes['_MS.baseType'] = 'EventData';
        span.attributes[SemanticAttributes.HTTP_CLIENT_IP] = '192.1.0.1';
        span.attributes[SemanticAttributes.ENDUSER_ID] = 'user-id';
    }
    shutdown(): Promise<void> {
        return Promise.resolve();
    }
}

const origGetCurrentContext = CorrelationContextManager.getCurrentContext;
const ns = cls.createNamespace('my.request');

function getCurrentContext(): CorrelationContext {
    return ns.get('ctx') || MapContext(origGetCurrentContext());
}

// Overwrite the built-in getCurrentContext() method with a new one.
CorrelationContextManager.getCurrentContext = getCurrentContext;

export const ApplicationInsightsWebserverMiddleware: any = (req: any, res: any, next: any): void => {
    // Check to see if the request contains an incoming request.
    // If so, set it into the Application Insights context.
    const activity: Partial<Activity> = req.body;
    if (activity && activity.id) {
        const context: ICorrelationContext = appInsights.getCorrelationContext();
        context['activity'] = req.body;
    }

    ns.bindEmitter(req);
    ns.bindEmitter(res);
    ns.run((): void => {
        ns.set('ctx', origGetCurrentContext());
        next();
    });
};

/**
 * This is a wrapper class around the Application Insights node client.
 * This is primarily designed to be used alongside the WaterfallDialog telemetry collection.
 * It provides a pre-configured App Insights client, and wrappers around
 * the major tracking functions, allowing it to conform to Botbuilder's generic BotTelemetryClient interface.
 * To use it, create pass in an instrumentation key:
 *
 * ```
 * const myDialog = new WaterfallDialog('my_dialog', steps);
 * const appInsightsClient = new ApplicationInsightsTelemetryClient(my_instrumentation_key);
 * myDialog.telemetryClient = appInsightsClient;
 * ```
 */
export class ApplicationInsightsTelemetryClient implements BotTelemetryClient, BotPageViewTelemetryClient {
    private client: appInsights.TelemetryClient;
    private config: appInsights.Configuration;
    private provider: TracerProvider;
    private tracer: Tracer;

    /**
     * Creates a new instance of the
     * [ApplicationInsightsTelemetryClient](xref:botbuilder-applicationinsights.ApplicationInsightsTelemetryClient)
     * class.
     *
     * @param connectionString The ApplicationInsights connection string.
     *
     * @remarks The settings parameter is passed directly into appInsights.setup().
     * https://www.npmjs.com/package/applicationinsights#basic-usage
     */
    constructor(connectionString: string);
    /**
     * Creates a new instance of the
     * [ApplicationInsightsTelemetryClient](xref:botbuilder-applicationinsights.ApplicationInsightsTelemetryClient)
     * class.
     *
     * @param instrumentationKey The ApplicationInsights instrumentation key.
     *
     * @remarks The settings parameter is passed directly into appInsights.setup().
     * https://www.npmjs.com/package/applicationinsights#basic-usage
     */
    constructor(instrumentationKey: string);

    /**
     * @internal
     */
    constructor(setupString: string) {
        // this.config = appInsights
        //     .setup(setupString)
        //     .setAutoDependencyCorrelation(true)
        //     .setAutoCollectRequests(true)
        //     .setAutoCollectPerformance(true, true) //default was true.
        //     //.setAutoCollectPerformance(true)
        //     .setAutoCollectExceptions(true)
        //     .setAutoCollectDependencies(true)
        //     .start();

        const customResource = resources.Resource.EMPTY;
        customResource.attributes[SemanticAttributes.ENDUSER_ID] = "my-instance";

        useAzureMonitor({
            azureMonitorExporterOptions: {
                connectionString: setupString,
            },
            // spanProcessors: [new SpanEnrichingProcessor()],
            resource: customResource,
        });

        this.provider = trace.getTracerProvider();

        // var resource = resources.Resource;

        // this.client = new appInsights.TelemetryClient(setupString);
        // this.client.config.enableAutoDependencyCorrelation = true;
        // this.client.config.enableAutoCollectRequests = true;
        // this.client.config.enableAutoCollectPerformance = true;
        // this.client.config.enableAutoCollectExceptions = true;
        // this.client.config.enableAutoCollectDependencies = true;
        // this.client.config.enableSendLiveMetrics = true;
        // this.client.config.enableWebInstrumentation = true;
        // this.client.config.azureMonitorOpenTelemetryOptions = {
        //     // resource: { [appInsights.defaultClient.context.keys.userId]: 'testing2' }
        //     resource: new resources.Resource({
        //         ['user_Id']: 'testing3',
        //         [this.client.context.keys.userId]: 'testing2',
        //     }),
        // };

        // this.client.context.tags[this.client.context.keys.cloudRole] = 'node123';
        // this.client = appInsights.defaultClient;
        // this.client = new appInsights.TelemetryClient(setupString)
        // this.config = this.client.config;
        // this.client.initialize();
        // this.client.commonProperties["customattribute2"] = "custom-value2";
        // appInsights.defaultClient.commonProperties["customattribute3"] = "custom-value3";
        // appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = "MyRoleName3";
        // this.client.context.tags[appInsights.defaultClient.context.keys.userId] = "testing2";
        console.log('t1');

        //setupOpentelemetry();

        //this.client.addTelemetryProcessor(addBotIdentifiers);

        // Initialize the tracer provider
        // this.provider = new NodeTracerProvider();

        //const exporter = new ConsoleSpanExporter(); //TODO: replace with correct exporter.

        // Add the custom span processor
        // this.provider.addSpanProcessor(new CustomSpanProcessor(this.client));
        // this.provider.addSpanProcessor(new SpanEnrichingProcessor());

        // Register the tracer provider
        // this.provider.register();

        // Register instrumentations
        // registerInstrumentations({
        //     instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
        // });

        this.tracer = this.provider.getTracer('applicationInsightsTelemetryClient');
    }

    // Protects against JSON.stringify cycles
    private toJSON(): unknown {
        return { name: 'ApplicationInsightsTelemetryClient' };
    }

    /**
     * Provides access to the Application Insights configuration that is running here.
     * Allows developers to adjust the options, for example:
     * `appInsightsClient.configuration.setAutoCollectDependencies(false)`
     *
     * @returns app insights configuration
     */
    get configuration(): appInsights.Configuration {
        return this.config;
    }

    /**
     * Provides direct access to the telemetry client object, which might be necessary for some operations.
     *
     * @returns app insights telemetry client
     */
    get defaultClient(): appInsights.TelemetryClient {
        return this.client;
    }

    /**
     * Sends information about an external dependency (outgoing call) in the application.
     *
     * @param telemetry The [TelemetryDependency](xref:botbuilder-core.TelemetryDependency) to track.
     */
    trackDependency(telemetry: TelemetryDependency): void {
        this.defaultClient.trackDependency(telemetry);
    }

    /**
     * Logs custom events with extensible named fields.
     *
     * @param telemetry The [TelemetryEvent](xref:botbuilder-core.TelemetryEvent) to track.
     */
    trackEvent(telemetry: TelemetryEvent): void {
        // const telemetry2 = addBotIdentifiers(telemetry);
        // const options: SpanOptions = {
        //     attributes: attributes,
        // };
        const span = this.tracer.startSpan('track-event');
        // const { name, properties, metrics: measurements } = telemetry;
        // this.defaultClient.trackEvent({ name, properties, measurements });
        span.end();
    }

    /**
     * Logs a system exception.
     *
     * @param telemetry The [TelemetryException](xref:botbuilder-core.TelemetryException) to track.
     */
    trackException(telemetry: TelemetryException): void {
        this.defaultClient.trackException(telemetry);
    }

    /**
     * Sends a trace message.
     *
     * @param telemetry The [TelemetryTrace](xref:botbuilder-core.TelemetryTrace) to track.
     */
    trackTrace(telemetry: TelemetryTrace): void {
        this.defaultClient.trackTrace(telemetry);
    }

    /**
     * Logs a dialog entry as an Application Insights page view.
     *
     * @param telemetry The [TelemetryPageView](xref:botbuilder-core.TelemetryPageView) to track.
     */
    trackPageView(telemetry: TelemetryPageView): void {
        const telemetry2 = {
            id: '',
            name: telemetry.name,
            properties: telemetry.properties,
            measurements: telemetry.metrics,
        };
        this.defaultClient.trackPageView(telemetry2);
    }

    /**
     * Flushes the in-memory buffer and any metrics being pre-aggregated.
     */
    flush(): void {
        this.defaultClient.flush();
    }
}

/* Define the telemetry initializer function which is responsible for setting the userId. sessionId and some other values
 * so that application insights can correlate related events.
 */
function addBotIdentifiers(telemetry: TelemetryEvent): TelemetryEvent {
    const correlationContext = CorrelationContextManager.getCurrentContext();
    if (correlationContext && correlationContext['activity']) {
        const activity: Partial<Activity> = correlationContext['activity'];
        //const telemetryItem: any = envelope.data['baseData']; // TODO: update when envelope ts definition includes baseData
        const userId: string = activity.from ? activity.from.id : '';
        const channelId: string = activity.channelId || '';
        const conversationId: string = activity.conversation ? activity.conversation.id : '';
        // Hashed ID is used due to max session ID length for App Insights session Id
        const sessionId: string = conversationId;
        // ? crypto.createHash('sha256').update(conversationId).digest('base64')
        // : '';

        // Add additional properties
        telemetry.properties = telemetry.properties || {};
        telemetry.properties.activityId = activity.id;
        telemetry.properties.channelId = channelId;
        telemetry.properties.activityType = activity.type;
        telemetry.properties.conversationId = conversationId;
        // telemetry.properties.tags[appInsights.defaultClient.context.keys.userId] = channelId + userId;
        // telemetry.properties.tags[appInsights.defaultClient.context.keys.sessionId] = sessionId;
    }
    return telemetry;
}

/* Define the telemetry initializer function which is responsible for setting the userId. sessionId and some other values
 * so that application insights can correlate related events.
 */
// function addBotIdentifiers(envelope: Envelope, context: { [name: string]: any }): boolean {
// //function addBotIdentifiers(envelope: appInsights.Contracts.Envelope, context: { [name: string]: any }): boolean {
//     if (context.correlationContext && context.correlationContext.activity) {
//         const activity: Partial<Activity> = context.correlationContext.activity;
//         const telemetryItem: any = envelope.data['baseData']; // TODO: update when envelope ts definition includes baseData
//         const userId: string = activity.from ? activity.from.id : '';
//         const channelId: string = activity.channelId || '';
//         const conversationId: string = activity.conversation ? activity.conversation.id : '';
//         // Hashed ID is used due to max session ID length for App Insights session Id
//         const sessionId: string = conversationId
//             ? crypto.createHash('sha256').update(conversationId).digest('base64')
//             : '';

//         // set user id and session id
//         envelope.tags[appInsights.defaultClient.context.keys.userId] = channelId + userId;
//         envelope.tags[appInsights.defaultClient.context.keys.sessionId] = sessionId;

//         // Add additional properties
//         telemetryItem.properties = telemetryItem.properties || {};
//         telemetryItem.properties.activityId = activity.id;
//         telemetryItem.properties.channelId = channelId;
//         telemetryItem.properties.activityType = activity.type;
//         telemetryItem.properties.conversationId = conversationId;
//     }

//     return true;
// }
