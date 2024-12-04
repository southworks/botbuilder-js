/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ServiceClient, OperationArguments, OperationSpec, RawResponseCallback } from '@azure/core-client';
import { WebResourceLike, convertHttpClient, createRequestPolicyFactoryPolicy, ExtendedServiceClient } from '@azure/core-http-compat';
import { PipelineRequest, PipelineResponse, createHttpHeaders } from '@azure/core-rest-pipeline';
import { getDefaultUserAgentValue, ServiceCallback, ServiceClientCredentials, ServiceClientOptions } from './utils';
import { toWebResourceLike } from '../node_modules/@azure/core-http-compat/dist/commonjs/util';

export class ServiceClientContext extends ServiceClient {
    credentials: ServiceClientCredentials;
    private options: ServiceClientOptions;

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
        // this.addPolicies(options.requestPolicyFactories);
    }

    /**
     * @deprecated Could cause unwanted behaviors due to the migration of core-http to core-client. Please use core-client sendRequest instead.
     * Send the provided httpRequest.
     */
    sendRequest(options: any): Promise<any>;

    /**
     * @remarks from core-client package.
     * @inheritdoc
     */
    sendRequest(request: PipelineRequest): Promise<PipelineResponse>;

    async sendRequest(request: PipelineRequest): Promise<PipelineResponse> {
        const webResource = toWebResourceLike(request);
        await this.credentials.signRequest(webResource);
        const headers = createHttpHeaders({ ...request.headers.toJSON(), ...webResource.headers.rawHeaders() });
        request.withCredentials = this.options?.withCredentials;
        request.headers = headers;
        return super.sendRequest(request);
    }

    /**
     * @deprecated Could cause unwanted behaviors due to the migration of core-http to core-client. Please use core-client sendOperationRequest instead.
     * Send an HTTP request that is populated using the provided OperationSpec.
     * @param operationArguments - The arguments that the HTTP request's templated values will be populated from.
     * @param operationSpec - The OperationSpec to use to populate the httpRequest.
     * @param callback - The callback to call when the response is received.
     */
    sendOperationRequest(operationArguments: any, operationSpec: any, callback?: ServiceCallback<any>): Promise<any>;

    /**
     * @remarks from core-client package.
     * @inheritdoc
     */
    sendOperationRequest<T>(operationArguments: OperationArguments, operationSpec: OperationSpec): Promise<T>;

    async sendOperationRequest<T>(
        operationArguments: OperationArguments,
        operationSpec: OperationSpec,
        callback?: ServiceCallback<T>,
    ): Promise<T> {
        operationArguments.options = operationArguments.options ?? {};
        let cb = callback;
        const _onResponse = operationArguments.options.onResponse;

        if (typeof operationArguments.options === 'function') {
            cb = operationArguments.options;
        }

        operationArguments.options.onResponse = (rawResponse, flatResponse, error: Error) => {
            _onResponse?.(rawResponse, flatResponse, error);
            cb?.(error, rawResponse.parsedBody, toWebResourceLike(rawResponse.request), rawResponse);
        };

        return super.sendOperationRequest(operationArguments, operationSpec);
    }

    // private addPolicies(policies: ServiceClientOptions['requestPolicyFactories']): void {
    //     if (Array.isArray(policies)) {
    //         for (const policy of policies) {
    //             const isLegacyPolicy = policy.create !== undefined;
    //             const newPolicy: PipelinePolicy = isLegacyPolicy
    //                 ? createRequestPolicyFactoryPolicy([policy])
    //                 : (policy as any);

    //             const p = this.pipeline.getOrderedPolicies().find(e => e.name = 'userAgentPolicy');
    //             p.sendRequest(null, null);

    //             this.pipeline.addPolicy(newPolicy);
    //         }
    //     } else if (typeof policies === 'function') {
    //         return this.addPolicies(policies([]) || []);
    //     }

    //     return;
    // }
}
