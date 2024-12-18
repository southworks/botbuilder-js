/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ServiceClient, OperationArguments, OperationSpec } from '@azure/core-client';
import { convertHttpClient, createRequestPolicyFactoryPolicy } from '@azure/core-http-compat';
import { PipelineRequest, PipelineResponse, createHttpHeaders, PipelinePolicy } from '@azure/core-rest-pipeline';
import {
    ServiceCallback,
    ServiceClientCredentials,
    ServiceClientOptions,
    OperationArguments as LegacyOperationArguments,
    WebResourceLike,
} from './compat';

import {
    toPipelineRequest,
    toWebResourceLike,
} from '../../node_modules/@azure/core-http-compat/dist/commonjs/util';
import {
    toCompatResponse,
} from '../../node_modules/@azure/core-http-compat/dist/commonjs/response';

export class ServiceClientContext extends ServiceClient {
    /**
     * If specified, this is the base URI that requests will be made against for this ServiceClient.
     * If it is not specified, then all OperationSpecs must contain a baseUrl property.
     */
    protected baseUri?: string;
    /**
     * The default request content type for the service.
     * Used if no requestContentType is present on an OperationSpec.
     */
    protected requestContentType?: string;

    credentials: ServiceClientCredentials;
    private options: ServiceClientOptions;

    // Protects against JSON.stringify leaking secrets
    private toJSON(): unknown {
        return { name: this.constructor.name };
    }

    /**
     * Initializes a new instance of the ConnectorClientContext class.
     * @param credentials Subscription credentials which uniquely identify client subscription.
     * @param [options] The parameter options
     */
    constructor(credentials: ServiceClientCredentials, options: ServiceClientOptions = {}) {
        if (credentials === null || credentials === undefined) {
            throw new Error("'credentials' cannot be null.");
        }

        if (!options) {
            options = {};
        }

        const requestContentType =
            options.deserializationContentTypes?.json?.join(' ') ||
            options.deserializationContentTypes?.xml?.join(' ') ||
            'application/json; charset=utf-8';

        const userAgentPrefix =
            (typeof options.userAgent === 'function' ? options.userAgent('') : options.userAgent) || '';

        super({
            endpoint: options.baseUri,
            requestContentType,
            userAgentOptions: { userAgentPrefix },
            allowInsecureConnection: options.baseUri?.toLowerCase().startsWith('http:'),
            proxyOptions: options.proxySettings,
            httpClient: options.httpClient ? convertHttpClient(options.httpClient) : undefined,
            credentialScopes: options.credentialScopes,
        });

        this.baseUri = options.baseUri;
        this.requestContentType = requestContentType;
        this.credentials = credentials;
        this.options = options;
        this.addPolicies(options.requestPolicyFactories);
        // do something with noPolicy option.
    }

    /**
     * TODO: evaluate if it should say deprecated or not.
     * @deprecated Could cause unwanted behaviors due to the migration of core-http to core-client. Please use core-client sendRequest instead.
     * Send the provided httpRequest.
     */
    sendRequest(options: WebResourceLike): Promise<any>;

    /**
     * @remarks from core-client package.
     * @inheritdoc
     */
    sendRequest(request: PipelineRequest): Promise<PipelineResponse>;

    async sendRequest(request: PipelineRequest | WebResourceLike): Promise<PipelineResponse> {
        const isLegacyResource = (request as PipelineRequest).headers.toJSON === undefined;
        const newRequest = isLegacyResource
            ? toPipelineRequest(request as WebResourceLike)
            : (request as PipelineRequest);
        // Convert to WebResourceLike to acquire token header.
        const webResource = toWebResourceLike(newRequest);
        await this.credentials.signRequest(webResource);
        const headers = createHttpHeaders({
            ...newRequest.headers.toJSON({ preserveCase: true }),
            ...webResource.headers.toJson({ preserveCase: true }),
        });
        newRequest.withCredentials = this.options?.withCredentials === true;
        newRequest.headers = headers;
        return super.sendRequest(newRequest);
    }

    /**
     * @deprecated Could cause unwanted behaviors due to the migration of core-http to core-client. Please use core-client sendOperationRequest instead.
     * Send an HTTP request that is populated using the provided OperationSpec.
     * @param operationArguments - The arguments that the HTTP request's templated values will be populated from.
     * @param operationSpec - The OperationSpec to use to populate the httpRequest.
     * @param callback - The callback to call when the response is received.
     */
    sendOperationRequest(
        operationArguments: LegacyOperationArguments,
        operationSpec: OperationSpec,
        callback?: ServiceCallback<any>,
    ): Promise<any>;

    /**
     * @remarks from core-client package.
     * @inheritdoc
     */
    sendOperationRequest<T>(operationArguments: OperationArguments, operationSpec: OperationSpec): Promise<T>;

    async sendOperationRequest<T>(
        operationArguments: OperationArguments | LegacyOperationArguments,
        operationSpec: OperationSpec,
        callback?: ServiceCallback<T>,
    ): Promise<T> {
        let resolve: any;
        let reject: any;
        const result = new Promise<T>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        const options =
            this.createOptions(operationArguments.options as LegacyOperationArguments['options'], callback) ?? {};

        const innerOnResponse = options.onResponse;
        options.onResponse = (rawResponse, flatResponse, error) => {
            innerOnResponse?.(rawResponse, flatResponse, error);
            if (error) {
                reject(error);
            } else {
                Object.defineProperty(flatResponse, '_response', {
                    value: rawResponse,
                });
                resolve(flatResponse);
            }
        };

        await super.sendOperationRequest<T>({ ...operationArguments, options }, operationSpec);
        return result;
    }

    private isLegacyOptions(options: LegacyOperationArguments['options']): boolean {
        return (
            !!options?.onDownloadProgress ||
            !!options?.onUploadProgress ||
            !!options?.shouldDeserialize ||
            Object.keys(options?.serializerOptions || {}).some((e) =>
                ['includeRoot', 'rootName', 'xmlCharKey'].includes(e),
            ) ||
            !!options?.tracingContext ||
            !!options?.timeout ||
            !!options?.customHeaders ||
            !!options?.onDownloadProgress ||
            !!options?.onUploadProgress
        );
    }

    private createOptions(
        options: LegacyOperationArguments['options'],
        callback?: ServiceCallback<any>,
    ): OperationArguments['options'] {
        if (!options) {
            return {};
        }

        const isLegacy = this.isLegacyOptions(options);
        if (!isLegacy) {
            return options as OperationArguments['options'];
        }

        const result: OperationArguments['options'] = {
            ...(options as OperationArguments['options']),
            requestOptions: {
                customHeaders: options?.customHeaders,
                timeout: options?.timeout,
                shouldDeserialize(response) {
                    return typeof options?.shouldDeserialize === 'function'
                        ? options?.shouldDeserialize?.(toCompatResponse(response))
                        : options?.shouldDeserialize === true;
                },
                onDownloadProgress: options?.onDownloadProgress,
                onUploadProgress: options?.onUploadProgress,
            },
            onResponse(rawResponse: any, flatResponse, error) {
                const args = [];
                typeof options === 'function' ??
                    (options as ServiceCallback<any>)?.(
                        error as Error,
                        rawResponse.parsedBody,
                        toWebResourceLike(rawResponse.request),
                        rawResponse,
                    );
                callback?.(error as Error, rawResponse.parsedBody, toWebResourceLike(rawResponse.request), rawResponse);
            },
        };

        if (options.serializerOptions) {
            result.serializerOptions = {
                xml: options.serializerOptions,
            };
        }

        if (options.tracingOptions) {
            result.tracingOptions = {
                tracingContext: options.tracingContext,
            };
        }

        return result;
    }

    private addPolicies(policies: ServiceClientOptions['requestPolicyFactories']): void {
        if (Array.isArray(policies)) {
            for (const policy of policies) {
                const isLegacyPolicy = policy.create !== undefined;
                const newPolicy: PipelinePolicy = isLegacyPolicy
                    ? createRequestPolicyFactoryPolicy([policy])
                    : (policy as any);

                // Override existing.
                this.pipeline.removePolicy(newPolicy);
                this.pipeline.addPolicy(newPolicy);
            }
        } else if (typeof policies === 'function') {
            return this.addPolicies(policies([]) || []);
        }
    }
}
