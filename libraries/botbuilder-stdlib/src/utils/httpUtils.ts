import {
    PipelineRequest,
    PipelineResponse,
    TransferProgressEvent,
    createHttpHeaders,
    PipelinePolicy,
    SendRequest,
} from '@azure/core-rest-pipeline';
import { TracingContext } from '@azure/core-tracing';
import { AbortSignalLike } from '@azure/abort-controller';
import {
    RequestPolicy,
    RequestPolicyFactory,
    RequestPolicyOptionsLike,
    HttpPipelineLogLevel,
    WebResourceLike,
    toHttpHeadersLike,
    CompatResponse,
} from '@azure/core-http-compat';
import * as os from 'os';
import { OperationOptions, SerializerOptions as CoreSerializerOptions } from '@azure/core-client';
import { ProxySettings } from '@azure/core-rest-pipeline';
import { DeserializationContentTypes } from '@azure/core-client';
import { RequestPolicy as HttpClient } from '@azure/core-http-compat';

/**
 * A collection of properties that apply to a single invocation of an operation.
 */
export interface OperationArguments {
    /**
     * The parameters that were passed to the operation method.
     */
    [parameterName: string]: any;
    /**
     * The optional arugments that are provided to an operation.
     */
    options?: RequestOptionsBase;
}

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
    shouldDeserialize?: boolean | ((response: HttpOperationResponse) => boolean);
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

export type TelemetryInfo = { key?: string; value?: string };

export function getDefaultUserAgentValue(): string {
    const runtimeInfo = getRuntimeInfo();
    const platformSpecificData = getPlatformSpecificData();
    const userAgent = getUserAgentString(runtimeInfo.concat(platformSpecificData));
    return userAgent;
}

function getRuntimeInfo(): TelemetryInfo[] {
    const msRestRuntime = {
        key: 'core-http',
        value: '3.0.4',
    };

    return [msRestRuntime];
}

function getPlatformSpecificData(): TelemetryInfo[] {
    const runtimeInfo = {
        key: 'Node',
        value: process.version,
    };

    const osInfo = {
        key: 'OS',
        value: `(${os.arch()}-${os.type()}-${os.release()})`,
    };

    return [runtimeInfo, osInfo];
}

function getUserAgentString(telemetryInfo: TelemetryInfo[], keySeparator = ' ', valueSeparator = '/'): string {
    return telemetryInfo
        .map((info) => {
            const value = info.value ? `${valueSeparator}${info.value}` : '';
            return `${info.key}${value}`;
        })
        .join(keySeparator);
}

export interface HttpOperationResponse {
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
    const headerKey: string = userAgentData?.key ?? 'User-Agent';
    const headerValue: string = userAgentData?.value ?? getDefaultUserAgentValue();

    return {
        name: 'userAgentPolicy',
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
        readonly _options: RequestPolicyOptionsLike,
    ) {}

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
        protected headerValue: string,
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
    constructor(private _logger?: HttpPipelineLogger) {}

    /**
     * Get whether or not a log with the provided log level should be logged.
     * @param logLevel - The log level of the log that will be logged.
     * @returns Whether or not a log with the provided log level should be logged.
     */
    public shouldLog(logLevel: HttpPipelineLogLevel): boolean {
        return !!this._logger && logLevel !== HttpPipelineLogLevel.OFF && logLevel <= this._logger.minimumLogLevel;
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

export interface ServiceClientOptions {
    /**
     * (Optional) baseUri will be set automatically within BotFrameworkAdapter,
     * but is required if using the ConnectorClient outside of the adapter.
     */
    baseUri?: string;
    /**
     * An array of factories which get called to create the RequestPolicy pipeline used to send a HTTP
     * request on the wire, or a function that takes in the defaultRequestPolicyFactories and returns
     * the requestPolicyFactories that will be used.
     */
    requestPolicyFactories?:
        | RequestPolicyFactory[]
        | ((defaultRequestPolicyFactories: RequestPolicyFactory[]) => void | RequestPolicyFactory[]);
    /**
     * The HttpClient that will be used to send HTTP requests.
     */
    httpClient?: HttpClient;
    /**
     * The HttpPipelineLogger that can be used to debug RequestPolicies within the HTTP pipeline.
     */
    httpPipelineLogger?: HttpPipelineLogger;
    /**
     * If set to true, turn off the default retry policy.
     */
    noRetryPolicy?: boolean;
    /**
     * Gets or sets the retry timeout in seconds for AutomaticRPRegistration. Default value is 30.
     */
    rpRegistrationRetryTimeout?: number;
    /**
     * Whether or not to generate a client request ID header for each HTTP request.
     */
    generateClientRequestIdHeader?: boolean;
    /**
     * Whether to include credentials in CORS requests in the browser.
     * See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials for more information.
     */
    withCredentials?: boolean;
    /**
     * If specified, a GenerateRequestIdPolicy will be added to the HTTP pipeline that will add a
     * header to all outgoing requests with this header name and a random UUID as the request ID.
     */
    clientRequestIdHeaderName?: string;
    /**
     * The content-types that will be associated with JSON or XML serialization.
     */
    deserializationContentTypes?: DeserializationContentTypes;
    /**
     * The header name to use for the telemetry header while sending the request. If this is not
     * specified, then "User-Agent" will be used when running on Node.js and "x-ms-useragent" will
     * be used when running in a browser.
     */
    userAgentHeaderName?: string | ((defaultUserAgentHeaderName: string) => string);
    /**
     * The string to be set to the telemetry header while sending the request, or a function that
     * takes in the default user-agent string and returns the user-agent string that will be used.
     */
    userAgent?: string | ((defaultUserAgent: string) => string);
    /**
     * Proxy settings which will be used for every HTTP request (Node.js only).
     */
    proxySettings?: ProxySettings;
    /**
     * If specified, will be used to build the BearerTokenAuthenticationPolicy.
     */
    credentialScopes?: string | string[];
}

export interface ServiceCallback<TResult> {
    /**
     * A method that will be invoked as a callback to a service function.
     * @param err - The error occurred if any, while executing the request; otherwise null.
     * @param result - The deserialized response body if an error did not occur.
     * @param request - The raw/actual request sent to the server if an error did not occur.
     * @param response - The raw/actual response from the server if an error did not occur.
     */
    (err: Error | null, result?: TResult, request?: WebResourceLike, response?: HttpOperationResponse): void;
}