// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getDefaultUserAgentValue, userAgentPolicy } from '../utils';
import { ConnectorClient } from '../connectorApi/connectorClient';
import { ConnectorClientOptions } from '../connectorApi/models';
import { ConnectorFactory } from './connectorFactory';
import type { ServiceClientCredentialsFactory } from './serviceClientCredentialsFactory';
import { RequestPolicyFactory } from "@azure/core-http-compat";
import { PipelinePolicy, PipelineRequest, PipelineResponse, SendRequest, createEmptyPipeline } from "@azure/core-rest-pipeline";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageInfo: Record<'name' | 'version', string> = require('../../package.json');
export const USER_AGENT = `Microsoft-BotFramework/3.1 ${packageInfo.name}/${packageInfo.version
    } ${getDefaultUserAgentValue()} `;

/**
 * @internal
 * Implementation of [ConnectorFactory](xref:botframework-connector.ConnectorFactory).
 */
export class ConnectorFactoryImpl extends ConnectorFactory {
    /**
     * @param appId The AppID.
     * @param toChannelFromBotOAuthScope The to Channel from bot oauth scope.
     * @param loginEndpoint The login url.
     * @param validateAuthority The validate authority value to use.
     * @param credentialFactory A ServiceClientCredentialsFactory to use.
     * @param connectorClientOptions The [ConnectorClientOptions](xref:botframework-connector.ConnectorClientOptions) to use when creating ConnectorClients.
     */
    constructor(
        private readonly appId: string,
        private readonly toChannelFromBotOAuthScope: string,
        private readonly loginEndpoint: string,
        private readonly validateAuthority: boolean,
        private readonly credentialFactory: ServiceClientCredentialsFactory,
        private readonly connectorClientOptions: ConnectorClientOptions = {}
    ) {
        super();
    }

    /**
     * @param serviceUrl The client's service URL.
     * @param audience The audience to use for outbound communication. It will vary by cloud environment.
     * @returns The new instance of the ConnectorClient class.
     */
    async create(serviceUrl: string, audience?: string): Promise<ConnectorClient> {
        // Use the credentials factory to create credentails specific to this particular cloud environment.
        const credentials = await this.credentialFactory.createCredentials(
            this.appId,
            audience ?? this.toChannelFromBotOAuthScope,
            this.loginEndpoint,
            this.validateAuthority
        );

        // A new connector client for making calls against this serviceUrl using credentials derived from the current appId and the specified audience.
        const options = this.getClientOptions(serviceUrl);
        return new ConnectorClient(credentials, options);
    }

    private getClientOptions(serviceUrl: string): ConnectorClientOptions {
        const { requestPolicyFactories, ...clientOptions } = this.connectorClientOptions;

        const options: ConnectorClientOptions = Object.assign({}, { baseUri: serviceUrl }, clientOptions);

        const userAgent = typeof options.userAgent === 'function' ? options.userAgent(USER_AGENT) : options.userAgentOptions;
        const setUserAgent = userAgentPolicy({
            value: `${USER_AGENT}${userAgent ?? ''}`,
        });

        const acceptHeader: PipelinePolicy = {
            name: "acceptHeaderPolicy",
            sendRequest: async (request: PipelineRequest, next: SendRequest): Promise<PipelineResponse> => {
                if (!request.headers.has("accept")) {
                    request.headers.set("accept", "*/*");
                }
                return next(request);
            },
        };

        const authorizationHeader: PipelinePolicy = {
            name: "authorizationHeaderPolicy",
            sendRequest: async (request: PipelineRequest, next: SendRequest): Promise<PipelineResponse> => {
                const authHeader = "Bearer";
                request.headers.set("Authorization", `Bearer ${authHeader}`);
                return next(request);
            },
        };

        // Create the pipeline with the provided options
        const pipeline = createEmptyPipeline();

        // Add custom policies
        pipeline.addPolicy(acceptHeader, { afterPhase: "Serialize" });
        pipeline.addPolicy(setUserAgent, { afterPhase: "Serialize" });
        pipeline.addPolicy(authorizationHeader, { afterPhase: "Serialize" });

        // Attach the pipeline to the options
        options.requestPolicyFactories = pipeline;

        return options;
    }
}
