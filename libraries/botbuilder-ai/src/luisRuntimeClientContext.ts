/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */
import { ServiceClientOptions, ServiceClient } from '@azure/core-client';
import { TokenCredential } from '@azure/identity';
/**
 * Client for LUIS context
 */
export class LUISRuntimeClientContext extends ServiceClient {
    endpoint: string;
    credentials: TokenCredential;

    /**
     * Initializes a new instance of the LUISRuntimeClientContext class.
     *
     * @param credentials Subscription credentials which uniquely identify client subscription.
     * @param endpoint Supported Cognitive Services endpoints (protocol and hostname, for example:
     * https://westus.api.cognitive.microsoft.com).
     * @param [options] The parameter options
     */
    constructor(credentials: TokenCredential, endpoint: string, options?: ServiceClientOptions) {
        if (endpoint == undefined) {
            throw new Error("'endpoint' cannot be null.");
        }
        if (credentials == undefined) {
            throw new Error("'credentials' cannot be null.");
        }

        if (!options) {
            options = {};
        }

        super(options);

        //this.baseUri = '{Endpoint}/luis/v3.0-preview';
        //this.requestContentType = 'application/json; charset=utf-8';
        this.endpoint = endpoint;
        this.credentials = credentials;
    }
}
