/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PipelineResponse, PipelineRequestOptions, Pipeline, ProxySettings } from '@azure/core-rest-pipeline';
import { ServiceClientOptions } from '@azure/core-client';
import {
    ConversationList,
    TeamDetails,
    MeetingInfo,
    MeetingNotificationResponse,
    TeamsMeetingParticipant,
    BatchOperationResponse,
    BatchOperationStateResponse,
    BatchFailedEntriesResponse,
} from 'botframework-schema';
import { HttpPipelineLogger, RequestOptionsBase } from '../../utils';
import { AgentSettings } from '../../connectorApi/models';

/**
 * @interface
 * An interface representing TeamsConnectorClientOptions.
 * @extends ServiceClientOptions
 */
export interface TeamsConnectorClientOptions extends ServiceClientOptions {
    /**
     * @member {string} [baseUri]
     */
    baseUri?: string;
    /**
   * HTTP and HTTPS agents which will be used for every HTTP request (Node.js only).
   */
    agentSettings?: AgentSettings;
    /**
       * The string to be set to the telemetry header while sending the request, or a function that
       * takes in the default user-agent string and returns the user-agent string that will be used.
       */
    userAgent?: string | ((defaultUserAgent: string) => string);
    /**
       * An array of factories which get called to create the RequestPolicy pipeline used to send a HTTP
       * request on the wire, or a function that takes in the defaultRequestPolicyFactories and returns
       * the requestPolicyFactories that will be used.
       */
    requestPolicyFactories?: Pipeline;
    /**
       * The HttpPipelineLogger that can be used to debug RequestPolicies within the HTTP pipeline.
       */
    httpPipelineLogger?: HttpPipelineLogger;
    /**
       * Proxy settings which will be used for every HTTP request (Node.js only).
       */
    proxySettings?: ProxySettings;
}

/**
 * Contains response data for the fetchChannelList operation.
 */
export type TeamsFetchChannelListResponse = ConversationList & {
    /**
     * The underlying HTTP response.
     */
    _response: PipelineResponse & {
        /**
         * The response body as text (string format)
         */
        bodyAsText: string;
        /**
         * The response body as parsed JSON or XML
         */
        parsedBody: ConversationList;
    };
};

/**
 * Contains response data for the fetchTeamDetails operation.
 */
export type TeamsFetchTeamDetailsResponse = TeamDetails & {
    /**
     * The underlying HTTP response.
     */
    _response: PipelineResponse & {
        /**
         * The response body as text (string format)
         */
        bodyAsText: string;
        /**
         * The response body as parsed JSON or XML
         */
        parsedBody: TeamDetails;
    };
};

export interface ConversationsGetConversationPagedMembersOptionalParams extends PipelineRequestOptions {
    /**
     * Suggested page size
     */
    pageSize: number;
    /**
     * Continuation Token
     */
    continuationToken: string;
}

/**
 * Contains response data for the fetchMeetingParticipant operation.
 */
export type TeamsFetchMeetingParticipantResponse = TeamsMeetingParticipant & {
    /**
     * The underlying HTTP response.
     */
    _response: PipelineResponse & {
        /**
         * The response body as text (string format)
         */
        bodyAsText: string;
        /**
         * The response body as parsed JSON or XML
         */
        parsedBody: TeamsMeetingParticipant;
    };
};

/**
 * @interface
 * An interface representing TeamsFetchMeetingParticipantOptionalParams.
 * Optional Parameters.
 *
 * @extends RequestOptionsBase
 */
export interface TeamsFetchMeetingParticipantOptionalParams extends RequestOptionsBase {
    /**
     * @member {string} [tenantId]
     */
    tenantId?: string;
}

/**
 * Contains response data for the fetchMeetingInfo operation.
 */
export type TeamsMeetingInfoResponse = MeetingInfo & {
    /**
     * The underlying HTTP response.
     */
    _response: PipelineResponse & {
        /**
         * The response body as text (string format)
         */
        bodyAsText: string;
        /**
         * The response body as parsed JSON or XML
         */
        parsedBody: TeamsMeetingParticipant;
    };
};

/**
 * Contains response data for the sendMeetingNotification operation.
 */
export type TeamsMeetingNotificationResponse = MeetingNotificationResponse & {
    /**
     * The underlying HTTP response.
     */
    _response: PipelineResponse & {
        /**
         * The response body as text (string format)
         */
        bodyAsText: string;
        /**
         * The response body as parsed JSON or XML
         */
        parsedBody: MeetingNotificationResponse | {};
    };
};

/**
 * Contains response data for the Teams batch operations.
 */
export type TeamsBatchOperationResponse = BatchOperationResponse & {
    /**
     * The underlying HTTP response.
     */
    _response: PipelineResponse & {
        /**
         * The response body as text (string format)
         */
        bodyAsText: string;
        /**
         * The response body as parsed JSON or XML
         */
        parsedBody: BatchOperationResponse | {};
    };
};

/**
 * Contains response data for the Teams batch operation state.
 */
export type BatchBatchOperationStateResponse = BatchOperationStateResponse & {
    /**
     * The underlying HTTP response.
     */
    _response: PipelineResponse & {
        /**
         * The response body as text (string format)
         */
        bodyAsText: string;
        /**
         * The response body as parsed JSON or XML
         */
        parsedBody: BatchOperationStateResponse | {};
    };
};

/**
 * Contains response data for the Teams batch failed entries.
 */
export type BatchBatchFailedEntriesResponse = BatchFailedEntriesResponse & {
    /**
     * The underlying HTTP response.
     */
    _response: PipelineResponse & {
        /**
         * The response body as text (string format)
         */
        bodyAsText: string;
        /**
         * The response body as parsed JSON or XML
         */
        parsedBody: BatchFailedEntriesResponse | {};
    };
};

/**
 * Contains response data for the Teams batch cancel operation.
 */
export type CancelOperationResponse = {
    /**
     * The underlying HTTP response.
     */
    _response: PipelineResponse & {
        /**
         * The response body as text (string format)
         */
        bodyAsText: string;
        /**
         * The response body as parsed JSON or XML
         */
        parsedBody: {};
    };
};
