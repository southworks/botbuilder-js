import { ICorrelationContext } from 'applicationinsights/out/src/shim/types';

export interface CorrelationContext {
    operation: {
        name: string;
        id: string;
        parentId: string;
        traceparent?: Traceparent;
        tracestate?: Tracestate;
    };
    /** Do not store sensitive information here.
     *  Properties here are exposed via outgoing HTTP headers for correlating data cross-component.
     */
    customProperties: CustomProperties;
}

export interface CustomProperties {
    /**
     * Get a custom property from the correlation context
     */
    getProperty(key: string): string;
    /**
     * Store a custom property in the correlation context.
     * Do not store sensitive information here.
     * Properties stored here are exposed via outgoing HTTP headers for correlating data cross-component.
     * The characters ',' and '=' are disallowed within keys or values.
     */
    setProperty(key: string, value: string): void;
}

declare class Traceparent {
    static DEFAULT_TRACE_FLAG: string;
    static DEFAULT_VERSION: string;
    legacyRootId: string;
    parentId: string;
    spanId: string;
    traceFlag: string;
    traceId: string;
    version: string;
    constructor(traceparent?: string, parentId?: string);
    static isValidTraceId(id: string): boolean;
    static isValidSpanId(id: string): boolean;
    getBackCompatRequestId(): string;
    toString(): string;
    updateSpanId(): void;
}

declare class Tracestate {
    static strict: boolean;
    fieldmap: string[];
    constructor(id?: string);
    toString(): string;
    private static validateKeyChars(key);
    private parseHeader(id);
}

/**
 * @param context ..
 * @returns .
 */
export function MapContext(context: ICorrelationContext): CorrelationContext {
    const traceparent = new Traceparent();
    traceparent.legacyRootId = context.operation.traceparent.legacyRootId;
    traceparent.parentId = context.operation.traceparent.parentId;
    traceparent.spanId = context.operation.traceparent.spanId;
    traceparent.traceFlag = context.operation.traceparent.traceFlag;
    traceparent.traceId = context.operation.traceparent.traceId;
    traceparent.version = context.operation.traceparent.version;

    const tracestate = new Tracestate();
    tracestate.fieldmap = context.operation.tracestate.fieldmap;

    return {
        operation: {
            name: context.operation.name,
            id: context.operation.id,
            parentId: context.operation.parentId,
            traceparent: traceparent,
            tracestate: tracestate,
        },
        customProperties: context.customProperties as CustomProperties,
    };
}
