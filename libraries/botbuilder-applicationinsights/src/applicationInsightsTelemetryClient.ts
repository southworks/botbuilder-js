/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module botbuilder-applicationinsights
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as appInsights from 'applicationinsights';
import * as cls from 'cls-hooked';
import {
    Activity,
    BotTelemetryClient,
    BotPageViewTelemetryClient,
    TelemetryDependency,
    TelemetryEvent,
    TelemetryException,
    TelemetryTrace,
    TelemetryPageView,
    Severity,
} from 'botbuilder-core';

// This is the currently recommended work-around for using Application Insights with async/await
// https://github.com/Microsoft/ApplicationInsights-node.js/issues/296
// This allows AppInsights to automatically apply the appropriate context objects deep inside the async/await chain.
import { CorrelationContextManager } from 'applicationinsights/out/src/shim/CorrelationContextManager';
import { ICorrelationContext } from 'applicationinsights/out/src/shim/types';
import { CorrelationContext, MapContext } from './CorrelationContext';
import { CustomSpanProcessor } from './customSpanProcessor';
import { CustomLogRecordProcessor } from './customLogRecordProcessor';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes, SemanticAttributes } from '@opentelemetry/semantic-conventions';

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
        this.config = appInsights
            .setup(setupString)
            .setAutoDependencyCorrelation(true)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true, true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true);

        this.client = appInsights.defaultClient;

        const customResource = new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'my-service',
            [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'my-namespace',
            [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: 'my-instance',
            [SemanticAttributes.ENDUSER_ID]: 'user id',
        });

        this.client.config.azureMonitorOpenTelemetryOptions = {
            spanProcessors: [new CustomSpanProcessor(this.client)],
            logRecordProcessors: [new CustomLogRecordProcessor(this.client)],
            resource: customResource,
        };

        appInsights.start();
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
        this.defaultClient.trackEvent({
            ...telemetry,
            measurements: telemetry.metrics,
        });
    }

    /**
     * Logs a system exception.
     *
     * @param telemetry The [TelemetryException](xref:botbuilder-core.TelemetryException) to track.
     */
    trackException(telemetry: TelemetryException): void {
        this.defaultClient.trackException({
            ...telemetry,
            severity: Severity[telemetry.severityLevel],
        });
    }

    /**
     * Sends a trace message.
     *
     * @param telemetry The [TelemetryTrace](xref:botbuilder-core.TelemetryTrace) to track.
     */
    trackTrace(telemetry: TelemetryTrace): void {
        this.defaultClient.trackTrace({
            ...telemetry,
            severity: Severity[telemetry.severityLevel],
        });
    }

    /**
     * Logs a dialog entry as an Application Insights page view.
     *
     * @param telemetry The [TelemetryPageView](xref:botbuilder-core.TelemetryPageView) to track.
     */
    trackPageView(telemetry: TelemetryPageView): void {
        this.defaultClient.trackPageView({
            id: '',
            ...telemetry,
            measurements: telemetry.metrics,
        });
    }

    /**
     * Flushes the in-memory buffer and any metrics being pre-aggregated.
     */
    flush(): void {
        this.defaultClient.flush();
    }
}
