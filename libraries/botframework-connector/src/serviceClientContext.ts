/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ServiceClient, OperationArguments, OperationSpec } from '@azure/core-client';
import { convertHttpClient, createRequestPolicyFactoryPolicy } from '@azure/core-http-compat';
import { PipelineRequest, PipelineResponse, createHttpHeaders, PipelinePolicy } from '@azure/core-rest-pipeline';
import {
    getDefaultUserAgentValue,
    ServiceCallback,
    ServiceClientCredentials,
    ServiceClientOptions,
    OperationArguments as LegacyOperationArguments,
} from './utils';
import {
    toPipelineRequest,
    toWebResourceLike,
    WebResourceLike,
} from '../node_modules/@azure/core-http-compat/dist/commonjs/util';
import {} from 'lodash';

export class ServiceClientContext extends ServiceClient {
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
    constructor(credentials: ServiceClientCredentials, options?: ServiceClientOptions) {
        if (credentials === null || credentials === undefined) {
            throw new Error("'credentials' cannot be null.");
        }

        super({
            endpoint: options?.baseUri,
            requestContentType: 'application/json; charset=utf-8',
            userAgentOptions: {
                userAgentPrefix: `${getDefaultUserAgentValue()} ${options?.userAgent || ''}`,
            },
            allowInsecureConnection: options?.baseUri?.toLowerCase().startsWith('http:'),
            proxyOptions: options?.proxySettings,
            httpClient: options?.httpClient ? convertHttpClient(options?.httpClient) : null,
            credentialScopes: options?.credentialScopes,
        });

        this.credentials = credentials;
        this.options = options;
        this.addPolicies(options.requestPolicyFactories);
        // do something with noPolicy option.
    }

    /**
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
        newRequest.withCredentials = this.options?.withCredentials;
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
        const newArguments = this.createOperationArguments(operationArguments as LegacyOperationArguments, callback);
        return super.sendOperationRequest(newArguments, operationSpec);
    }

    private isLegacyOperationArguments(operationArguments: LegacyOperationArguments) {
        const options = operationArguments.options;
        return (
            options?.onDownloadProgress ||
            options?.onUploadProgress ||
            options?.shouldDeserialize ||
            Object.keys(options?.serializerOptions || {}).some((e) =>
                ['includeRoot', 'rootName', 'xmlCharKey'].includes(e),
            ) ||
            options?.tracingContext ||
            options?.timeout ||
            options?.customHeaders ||
            options?.onDownloadProgress ||
            options?.onUploadProgress
        );
    }

    private createOperationArguments(
        operationArguments: LegacyOperationArguments,
        callback: ServiceCallback<any>,
    ): OperationArguments {
        const isLegacy = this.isLegacyOperationArguments(operationArguments);
        if (!isLegacy) {
            return operationArguments as OperationArguments;
        }

        const optionsCallback = operationArguments.options as ServiceCallback<any>;
        return {
            options: {
                serializerOptions: {
                    xml: operationArguments.options?.serializerOptions,
                },
                tracingOptions: {
                    tracingContext: operationArguments.options?.tracingContext,
                },
                requestOptions: {
                    customHeaders: operationArguments.options?.customHeaders,
                    timeout: operationArguments.options?.timeout,
                    shouldDeserialize: operationArguments.options?.shouldDeserialize,
                    onDownloadProgress: operationArguments.options?.onDownloadProgress,
                    onUploadProgress: operationArguments.options?.onUploadProgress,
                },
                onResponse(rawResponse, flatResponse, error: Error) {
                    optionsCallback?.(
                        error,
                        rawResponse.parsedBody,
                        toWebResourceLike(rawResponse.request),
                        rawResponse,
                    );
                    callback?.(error, rawResponse.parsedBody, toWebResourceLike(rawResponse.request), rawResponse);
                },
            },
        };
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

        return;
    }
}
