import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';

// Initialize the tracer provider
// const provider = new NodeTracerProvider();

// // Create an Azure Monitor exporter
// const exporter = new AzureMonitorTraceExporter({
//     connectionString: 'InstrumentationKey=<YOUR_INSTRUMENTATION_KEY>',
// });

// // Add a span processor
// provider.addSpanProcessor(new BatchSpanProcessor(exporter));

// // Register the tracer provider
// provider.register();

// // Register instrumentations
// registerInstrumentations({
//     instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
// });

export const setupOpentelemetry = () => {
    const traceProvider = new NodeTracerProvider();
    const exporter = new AzureMonitorTraceExporter({
        connectionString: 'InstrumentationKey=<YOUR_INSTRUMENTATION_KEY>',
    });

    traceProvider.addSpanProcessor(new BatchSpanProcessor(exporter));
    traceProvider.register();

    registerInstrumentations({
        instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
    });
};
