/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ConnectorClientOptions } from './models';
import { ServiceClientCredentials } from '../utils';
import { ServiceClientContext } from '../serviceClientContext';

const packageName = 'botframework-connector';
const packageVersion = '4.0.0';

export class ConnectorClientContext extends ServiceClientContext {
    /**
     * Initializes a new instance of the ConnectorClientContext class.
     * @param credentials Subscription credentials which uniquely identify client subscription.
     * @param [options] The parameter options
     */
    constructor(credentials: ServiceClientCredentials, options?: ConnectorClientOptions) {
        super(credentials, {
            ...options,
            baseUri: options?.baseUri || 'https://api.botframework.com',
            userAgent: `${packageName}/${packageVersion} ${options?.userAgent || ''}`,
        });
    }
}
