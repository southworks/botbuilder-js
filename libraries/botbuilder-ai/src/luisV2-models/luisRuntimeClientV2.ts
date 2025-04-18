/**
 * @module botbuilder-ai
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ServiceClientCredentials, ServiceClientOptions } from 'botbuilder-stdlib/lib/azureCoreHttpCompat';
import * as Models from './luisResult';
import * as Mappers from './luisMappers';
import { LuisPrediction } from './luisPrediction';
import { LUISRuntimeClientContext } from '../luisRuntimeClientContext';

/**
 * Represents the LUIS client for V2 of the runtime.
 *
 * @remarks This is a clone of the LUISRuntimeClient in version 2 of the runtime.
 */
class LUISRuntimeClientV2 extends LUISRuntimeClientContext {
    // Operation groups
    prediction: LuisPrediction;

    /**
     * Initializes a new instance of the LUISRuntimeClientV2 class.
     *
     * @param credentials Subscription credentials which uniquely identify client subscription.
     * @param endpoint Supported Cognitive Services endpoints (protocol and hostname, for example:
     * https://westus.api.cognitive.microsoft.com).
     * @param [options] The parameter options
     */
    constructor(credentials: ServiceClientCredentials, endpoint: string, options?: ServiceClientOptions) {
        const baseUri = options?.baseUri || `${endpoint}/luis/v2.0`;
        super(credentials, endpoint, { ...options, baseUri });
        this.prediction = new LuisPrediction(this);
    }
}

// Operation Specifications

export { LUISRuntimeClientV2, Models as LUISRuntimeModels, Mappers as LUISRuntimeMappers };
