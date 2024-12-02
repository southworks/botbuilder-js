import { PipelineOptions, PipelineRequest, PipelineResponse, TransferProgressEvent, createHttpHeaders, PipelinePolicy, SendRequest } from "@azure/core-rest-pipeline";
import { TracingContext } from "@azure/core-tracing";
import { RequestPolicy, RequestPolicyFactory, RequestPolicyOptionsLike, HttpPipelineLogLevel, WebResourceLike, toHttpHeadersLike, CompatResponse } from '@azure/core-http-compat';
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
 * A compatible interface for core-http request policies
 */
// export interface RequestPolicy {
//     sendRequest(httpRequest: PipelineRequest): Promise<HttpOperationResponses>;
// }

/**
 * Returns a policy that adds the user agent header to outgoing requests based on the given {@link TelemetryInfo}.
 * @param userAgentData - Telemetry information.
 * @returns A new {@link PipelinePolicy}.
 */
export function userAgentPolicy(userAgentData?: TelemetryInfo): PipelinePolicy {
    const headerKey: string =
        userAgentData?.key ?? "User-Agent";
    const headerValue: string =
        userAgentData?.value ?? getDefaultUserAgentValue();

    return {
        name: "userAgentPolicy",
        async sendRequest(request: PipelineRequest, next: SendRequest): Promise<PipelineResponse> {
            // Set the User-Agent header if it is not already set
            if (!request.headers.has(headerKey)) {
                request.headers.set(headerKey, headerValue);
            }
            // Forward the request to the next policy in the pipeline
            return next(request);
        },
    };
}

/**
 * The base class from which all request policies derive.
 */
export abstract class BaseRequestPolicy implements RequestPolicy {
    /**
     * The main method to implement that manipulates a request/response.
     */
    protected constructor(
        /**
         * The next policy in the pipeline. Each policy is responsible for executing the next one if the request is to continue through the pipeline.
         */
        readonly _nextPolicy: RequestPolicy,
        /**
         * The options that can be passed to a given request policy.
         */
        readonly _options: RequestPolicyOptionsLike
    ) { }

    /**
     * Sends a network request based on the given web resource.
     * @param webResource - A {@link WebResourceLike} that describes a HTTP request to be made.
     */
    public abstract sendRequest(webResource: WebResourceLike): Promise<CompatResponse>;

    /**
     * Get whether or not a log with the provided log level should be logged.
     * @param logLevel - The log level of the log that will be logged.
     * @returns Whether or not a log with the provided log level should be logged.
     */
    public shouldLog(logLevel: HttpPipelineLogLevel): boolean {
        return this._options.shouldLog(logLevel);
    }

    /**
     * Attempt to log the provided message to the provided logger. If no logger was provided or if
     * the log level does not meat the logger's threshold, then nothing will be logged.
     * @param logLevel - The log level of this log.
     * @param message - The message of this log.
     */
    public log(logLevel: HttpPipelineLogLevel, message: string): void {
        this._options.log(logLevel, message);
    }
}

/**
 * A policy that adds the user agent header to outgoing requests based on the given {@link TelemetryInfo}.
 */
export class UserAgentPolicy extends BaseRequestPolicy {
    constructor(
        readonly _nextPolicy: RequestPolicy,
        readonly _options: RequestPolicyOptionsLike,
        protected headerKey: string,
        protected headerValue: string
    ) {
        super(_nextPolicy, _options);
    }

    sendRequest(request: WebResourceLike): Promise<CompatResponse> {
        this.addUserAgentHeader(request);
        return this._nextPolicy.sendRequest(request);
    }

    /**
     * Adds the user agent header to the outgoing request.
     */
    addUserAgentHeader(request: WebResourceLike): void {
        if (!request.headers) {
            request.headers = toHttpHeadersLike(createHttpHeaders());
        }

        if (!request.headers.get(this.headerKey) && this.headerValue) {
            request.headers.set(this.headerKey, this.headerValue);
        }
    }
}

/**
 * A Logger that can be added to a HttpPipeline. This enables each RequestPolicy to log messages
 * that can be used for debugging purposes.
 */
export interface HttpPipelineLogger {
    /**
     * The log level threshold for what logs will be logged.
     */
    minimumLogLevel: HttpPipelineLogLevel;

    /**
     * Log the provided message.
     * @param logLevel - The HttpLogDetailLevel associated with this message.
     * @param message - The message to log.
     */
    log(logLevel: HttpPipelineLogLevel, message: string): void;
}

export class RequestPolicyOptions {
    constructor(private _logger?: HttpPipelineLogger) { }

    /**
     * Get whether or not a log with the provided log level should be logged.
     * @param logLevel - The log level of the log that will be logged.
     * @returns Whether or not a log with the provided log level should be logged.
     */
    public shouldLog(logLevel: HttpPipelineLogLevel): boolean {
        return (
            !!this._logger &&
            logLevel !== HttpPipelineLogLevel.OFF &&
            logLevel <= this._logger.minimumLogLevel
        );
    }

    /**
     * Attempt to log the provided message to the provided logger. If no logger was provided or if
     * the log level does not meet the logger's threshold, then nothing will be logged.
     * @param logLevel - The log level of this log.
     * @param message - The message of this log.
     */
    public log(logLevel: HttpPipelineLogLevel, message: string): void {
        if (this._logger && this.shouldLog(logLevel)) {
            this._logger.log(logLevel, message);
        }
    }
}
