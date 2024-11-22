import { AbortSignalLike } from "@azure/abort-controller";
import { HttpClient, HttpMethods, PipelineOptions, PipelinePolicy, PipelineRequest, PipelineResponse, TransferProgressEvent, RestError } from "@azure/core-rest-pipeline";
import { TracingContext } from "@azure/core-tracing";
import { WebResourceLike, CompatResponse, HttpPipelineLogLevel } from '@azure/core-http-compat';
import * as os from "os";
import { OperationOptions, SerializerOptions } from "@azure/core-client";

/**
 * Describes the base structure of the options object that will be used in every operation.
 */
export interface RequestOptionsBase extends OperationOptions {
    /**
     * will be applied before the request is sent.
     */
    customHeaders?: {
        [key: string]: string;
    };
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
    serializerOptions?: SerializerOption;
}

/**
 * Options to govern behavior of xml parser and builder.
 */
interface SerializerOption extends SerializerOptions {
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

/**
 * Creates a new RequestPolicy per-request that uses the provided nextPolicy.
 */
export declare type RequestPolicyFactory = {
    create(nextPolicy: RequestPolicy, options: RequestPolicyOptionsLike): RequestPolicy;
};
/**
 * The underlying structure of a request policy.
 */
export interface RequestPolicy {
    /**
     * A method that retrieves an {@link HttpOperationResponse} given a {@link WebResourceLike} describing the request to be made.
     * @param httpRequest - {@link WebResourceLike} describing the request to be made.
     */
    sendRequest(httpRequest: WebResourceLike): Promise<HttpOperationResponse>;
}

export interface RequestPolicyOptionsLike {
    /**
     * Get whether or not a log with the provided log level should be logged.
     * @param logLevel - The log level of the log that will be logged.
     * @returns Whether or not a log with the provided log level should be logged.
     */
    shouldLog(logLevel: HttpPipelineLogLevel): boolean;
    /**
     * Attempt to log the provided message to the provided logger. If no logger was provided or if
     * the log level does not meet the logger's threshold, then nothing will be logged.
     * @param logLevel - The log level of this log.
     * @param message - The message of this log.
     */
    log(logLevel: HttpPipelineLogLevel, message: string): void;
}

export interface HttpOperationResponse extends PipelineResponse {
    /**
     * The parsed HTTP response headers.
     */
    parsedHeaders?: {
        [key: string]: any;
    };
    /**
     * The response body as text (string format)
     */
    bodyAsText?: string | null;
    /**
     * The response body as parsed JSON or XML
     */
    parsedBody?: any;
    /**
     * BROWSER ONLY
     *
     * The response body as a browser Blob.
     * Always undefined in node.js.
     */
    blobBody?: Promise<Blob>;
    /**
     * NODEJS ONLY
     *
     * The response body as a node.js Readable stream.
     * Always undefined in the browser.
     */
    readableStreamBody?: NodeJS.ReadableStream;
}

/**
 * Returns a policy that adds the user agent header to outgoing requests based on the given {@link TelemetryInfo}.
 * @param userAgentData - Telemetry information.
 * @returns A new {@link UserAgentPolicy}.
 */
export declare function userAgentPolicy(userAgentData?: TelemetryInfo): RequestPolicyFactory;
