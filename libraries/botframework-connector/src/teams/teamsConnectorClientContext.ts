/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ServiceClient } from '@azure/core-client';
import { TokenCredential } from '@azure/identity';
import { TeamsConnectorClientOptions } from './models';

/**
 * The Bot Connector REST API extension for Microsoft Teams allows your
 * bot to perform extended operations on the Microsoft Teams channel
 * configured in the [Bot Framework Developer Portal](https://dev.botframework.com).
 * The Connector service uses industry-standard REST and JSON over HTTPS.
 */
export class TeamsConnectorClientContext extends ServiceClient {
    credentials: TokenCredential;
    endpoint: string;

    /**
     * Initializes a new instance of the TeamsConnectorClientContext class.
     * @param endpoint Subscription endpoint
     * @param credentials Subscription credentials which uniquely identify client subscription.
     * @param [options] The parameter options
     */
    constructor(credentials: TokenCredential, options?: TeamsConnectorClientOptions) {
        if (!options) {
            options = {};
        }

        super(options);

        this.endpoint = options.endpoint || this.endpoint || 'https://api.botframework.com';
        this.credentials = credentials;
    }
}
