/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ServiceClientCredentials } from '../utils';
import { TeamsConnectorClientOptions } from './models';
import { ExtendedServiceClient } from '@azure/core-http-compat';
import { createPipelineFromOptions, Pipeline } from '@azure/core-rest-pipeline';

/**
 * The Bot Connector REST API extension for Microsoft Teams allows your
 * bot to perform extended operations on the Microsoft Teams channel
 * configured in the [Bot Framework Developer Portal](https://dev.botframework.com).
 * The Connector service uses industry-standard REST and JSON over HTTPS.
 */
export class TeamsConnectorClientContext extends ExtendedServiceClient {
    credentials: ServiceClientCredentials;
    endpoint: string;
    _requestPolicyFactories: Pipeline;

    /**
     * Initializes a new instance of the TeamsConnectorClientContext class.
     * @param endpoint Subscription endpoint
     * @param credentials Subscription credentials which uniquely identify client subscription.
     * @param [options] The parameter options
     */
    constructor(credentials: ServiceClientCredentials, options?: TeamsConnectorClientOptions) {
        if (!options) {
            options = {};
        }

        // options.pipeline = this.createPipeline(credentials, options);
        const pipeline = createPipelineFromOptions(options);

        const policies = options?.requestPolicyFactories?.getOrderedPolicies() ?? [];
        const pipelinePolicies = pipeline.getOrderedPolicies();
        for (const policy of policies) {
            const exist = pipelinePolicies.find(pipelinePolicy => pipelinePolicy.name == policy.name)
            if (!exist) {
                pipeline.addPolicy(policy)
            }
        }

        options.pipeline = pipeline;

        super(options);

        this.endpoint = options.endpoint || this.endpoint || 'https://api.botframework.com';
        this.credentials = credentials;
        this._requestPolicyFactories = options.pipeline
    }

    /**
     * Create a custom pipeline to add policies
     */
    createPipeline(credentials: ServiceClientCredentials, options: TeamsConnectorClientOptions): Pipeline {
        const pipeline = createPipelineFromOptions(options);

        const policies = options?.requestPolicyFactories?.getOrderedPolicies() ?? [];
        const pipelinePolicies = pipeline.getOrderedPolicies();
        for (const policy of policies) {
            const exist = pipelinePolicies.find(pipelinePolicy => pipelinePolicy.name == policy.name)
            if (!exist) {
                pipeline.addPolicy(policy)
            }
        }

        return pipeline;
    }
}
