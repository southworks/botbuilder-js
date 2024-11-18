import { AbortSignalLike } from "@azure/abort-controller";
import { HttpClient, HttpMethods, PipelineOptions, PipelinePolicy, PipelineRequest, PipelineResponse, TransferProgressEvent, RestError } from "@azure/core-rest-pipeline";
import { TracingContext } from "@azure/core-tracing";
import { WebResourceLike, CompatResponse } from '@azure/core-http-compat';

/**
 * Describes the base structure of the options object that will be used in every operation.
 */
export interface RequestOptionsBase {
    /**
     * will be applied before the request is sent.
     */
    customHeaders?: {
        [key: string]: string;
    };
    /**
     * Signal of an abort controller. Can be used to abort both sending a network request and waiting for a response.
     */
    abortSignal?: AbortSignalLike;
    /**
     * The number of milliseconds a request can take before automatically being terminated.
     * If the request is terminated, an `AbortError` is thrown.
     */
    timeout?: number;
    /**
     * Callback which fires upon upload progress.
     */
    onUploadProgress?: (progress: TransferProgressEvent) => void;
    /**
     * Callback which fires upon download progress.
     */
    onDownloadProgress?: (progress: TransferProgressEvent) => void;
    /**
     * Whether or not the HttpOperationResponse should be deserialized. If this is undefined, then the
     * HttpOperationResponse should be deserialized.
     */
    shouldDeserialize?: boolean | ((response: PipelineResponse) => boolean);
    /**
     * Tracing: Context used when creating spans.
     */
    tracingContext?: TracingContext;
    /**
     * May contain other properties.
     */
    [key: string]: any;
    /**
     * Options to override XML parsing/building behavior.
     */
    serializerOptions?: SerializerOptions;
}

/**
 * Options to govern behavior of xml parser and builder.
 */
interface SerializerOptions {
    /**
     * indicates the name of the root element in the resulting XML when building XML.
     */
    rootName?: string;
    /**
     * indicates whether the root element is to be included or not in the output when parsing XML.
     */
    includeRoot?: boolean;
    /**
     * key used to access the XML value content when parsing XML.
     */
    xmlCharKey?: string;
}

/**
 * Service callback that is returned for REST requests initiated by the service client.
 */
export interface ServiceCallback<TResult> {
    /**
     * A method that will be invoked as a callback to a service function.
     * @param err - The error occurred if any, while executing the request; otherwise null.
     * @param result - The deserialized response body if an error did not occur.
     * @param request - The raw/actual request sent to the server if an error did not occur.
     * @param response - The raw/actual response from the server if an error did not occur.
     */
    (
        err: Error | RestError | null,
        result?: TResult,
        request?: WebResourceLike,
        response?: CompatResponse
    ): void;
}

import * as os from "os";

export type TelemetryInfo = { key?: string; value?: string };

export function getDefaultUserAgentValue(): string {
    const runtimeInfo = getRuntimeInfo();
    const platformSpecificData = getPlatformSpecificData();
    const userAgent = getUserAgentString(runtimeInfo.concat(platformSpecificData));
    return userAgent;
}

function getRuntimeInfo(): TelemetryInfo[] {
    const msRestRuntime = {
        key: "core-http",
        value: "3.0.4",
    };

    return [msRestRuntime];
}

function getPlatformSpecificData(): TelemetryInfo[] {
    const runtimeInfo = {
        key: "Node",
        value: process.version,
    };

    const osInfo = {
        key: "OS",
        value: `(${os.arch()}-${os.type()}-${os.release()})`,
    };

    return [runtimeInfo, osInfo];
}

function getUserAgentString(
    telemetryInfo: TelemetryInfo[],
    keySeparator = " ",
    valueSeparator = "/"
): string {
    return telemetryInfo
        .map((info) => {
            const value = info.value ? `${valueSeparator}${info.value}` : "";
            return `${info.key}${value}`;
        })
        .join(keySeparator);
} 
