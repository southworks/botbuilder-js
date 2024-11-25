/* eslint-disable prettier/prettier */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { RequestOptionsBase } from "../../utils";
import { createSerializer, OperationSpec, RawResponseCallback } from '@azure/core-client';
import * as Models from '../models';
import * as Mappers from '../models/teamsMappers';
import * as Parameters from '../models/parameters';
import { TeamsConnectorClientContext, retryAction } from '../';
import {
    Activity,
    ConversationList,
    TeamDetails,
    TeamsMeetingInfo,
    TeamsMeetingParticipant,
    MeetingNotificationResponse,
    MeetingNotification,
    TeamsMember,
    BatchOperationResponse,
    BatchOperationStateResponse,
    BatchFailedEntriesResponse
} from 'botframework-schema';


/** Class representing a Teams. */
export class Teams {
    private readonly client: TeamsConnectorClientContext;
    private readonly retryCount = 10;

    /**
     * Create a Teams.
     *
     * @param {TeamsConnectorClientContext} client Reference to the service client.
     */
    constructor(client: TeamsConnectorClientContext) {
        this.client = client;
    }

    /**
     * Fetches channel list for a given team.
     *
     * @param teamId Team Id.
     * @param options Optional. The options object to be used in every request.
     * @returns A `Promise<Models.TeamsFetchChannelListResponse>`.
     */
    fetchChannelList(
        teamId: string,
        options?: RequestOptionsBase
    ): Promise<Models.TeamsFetchChannelListResponse>;
    /**
     * Fetches channel list for a given team.
     *
     * @param teamId Team Id.
     * @param callback The callback.
     */
    fetchChannelList(teamId: string, callback: RawResponseCallback): void;
    /**
     * Fetches channel list for a given team.
     *
     * @param teamId Team Id.
     * @param options The options object to be used in every request.
     * @param callback The callback.
     */
    fetchChannelList(
        teamId: string,
        options: RequestOptionsBase,
        callback: RawResponseCallback
    ): void;
    /**
     * Fetches channel list for a given team.
     *
     * @param teamId Team Id.
     * @param options Optional. The options object to be used in every request.
     * @param callback The callback.
     * @returns A `Promise<Models.TeamsFetchChannelListResponse>`.
     */
    fetchChannelList(
        teamId: string,
        options?: RequestOptionsBase | RawResponseCallback,
        callback?: RawResponseCallback
    ): Promise<Models.TeamsFetchChannelListResponse> {
        if (typeof options === 'function') {
            const onResponse = options;
            options = {
                onResponse
            }
        } else if (options) {
            options.onResponse = callback;
        }

        return this.client.sendOperationRequest(
            {
                teamId,
                options,
            },
            fetchChannelListOperationSpec
        ) as Promise<Models.TeamsFetchChannelListResponse>;
    }

    /**
     * Fetches details related to a team.
     *
     * @param teamId Team Id.
     * @param options Optional. The options object to be used in every request.
     * @returns A `Promise<Models.TeamsFetchTeamDetailsResponse>`.
     */
    fetchTeamDetails(
        teamId: string,
        options?: RequestOptionsBase
    ): Promise<Models.TeamsFetchTeamDetailsResponse>;
    /**
     * Fetches details related to a team.
     *
     * @param teamId Team Id.
     * @param callback The callback.
     */
    fetchTeamDetails(teamId: string, callback: RawResponseCallback): void;
    /**
     * Fetches details related to a team.
     *
     * @param teamId Team Id.
     * @param options The options object to be used in every request.
     * @param callback The callback.
     */
    fetchTeamDetails(
        teamId: string,
        options: RequestOptionsBase,
        callback: RawResponseCallback
    ): void;
    /**
     * Fetches details related to a team.
     *
     * @param teamId Team Id.
     * @param options Optional. The options object to be used in every request.
     * @param callback The callback.
     * @returns A `Promise<Models.TeamsFetchTeamDetailsResponse>`.
     */
    fetchTeamDetails(
        teamId: string,
        options?: RequestOptionsBase | RawResponseCallback,
        callback?: RawResponseCallback
    ): Promise<Models.TeamsFetchTeamDetailsResponse> {
        if (typeof options === 'function') {
            const onResponse = options;
            options = {
                onResponse
            }
        } else if (options) {
            options.onResponse = callback;
        }

        return this.client.sendOperationRequest(
            {
                teamId,
                options,
            },
            fetchTeamDetailsOperationSpec
        ) as Promise<Models.TeamsFetchTeamDetailsResponse>;
    }

    /**
     * Fetch a meeting participant
     *
     * @summary Fetches a meeting participant
     * @param meetingId Meeting Id
     * @param participantId Participant Id
     * @param [options] The optional parameters
     * @returns Promise<Models.TeamsFetchMeetingParticipantResponse>
     */
    fetchMeetingParticipant(
        meetingId: string,
        participantId: string,
        options?: Models.TeamsFetchMeetingParticipantOptionalParams
    ): Promise<Models.TeamsFetchMeetingParticipantResponse>;
    /**
     * @param meetingId Meeting Id
     * @param participantId Participant Id
     * @param callback The callback
     */
    fetchMeetingParticipant(
        meetingId: string,
        participantId: string,
        callback: RawResponseCallback
    ): void;
    /**
     * @param meetingId Meeting Id
     * @param participantId Participant Id
     * @param options The optional parameters
     * @param callback The callback
     */
    fetchMeetingParticipant(
        meetingId: string,
        participantId: string,
        options: Models.TeamsFetchMeetingParticipantOptionalParams,
        callback: RawResponseCallback
    ): void;
    /**
     * @param meetingId Meeting Id.
     * @param participantId Participant Id.
     * @param options The optional parameters.
     * @param callback The callback.
     * @returns Promise with TeamsFetchMeetingParticipantResponse.
     */
    fetchMeetingParticipant(
        meetingId: string,
        participantId: string,
        options?: Models.TeamsFetchMeetingParticipantOptionalParams | RawResponseCallback,
        callback?: RawResponseCallback
    ): Promise<Models.TeamsFetchMeetingParticipantResponse> {
        if (typeof options === 'function') {
            const onResponse = options;
            options = {
                onResponse
            }
        } else if (options) {
            options.onResponse = callback;
        }

        return this.client.sendOperationRequest(
            {
                meetingId,
                participantId,
                options,
            },
            fetchMeetingParticipantOperationSpec
        ) as Promise<Models.TeamsFetchMeetingParticipantResponse>;
    }

    /**
     * Fetch meeting information.
     *
     * @summary Fetches information of a Teams meeting.
     * @param meetingId Meeting Id, encoded as a BASE64 string.
     * @param [options] The optional parameters
     * @returns Promise<Models.TeamsFetchMeetingInfoResponse>
     */
    fetchMeetingInfo(
        meetingId: string,
        options?: RequestOptionsBase | RawResponseCallback
    ): Promise<Models.TeamsMeetingInfoResponse>;
    /**
     * @param meetingId Meeting Id, encoded as a BASE64 string.
     * @param callback The callback
     */
    fetchMeetingInfo(
        meetingId: string,
        callback: RawResponseCallback
    ): void;
    /**
     * @param meetingId Meeting Id, encoded as a BASE64 string.
     * @param options The optional parameters
     * @param callback The callback
     */
    fetchMeetingInfo(
        meetingId: string,
        options: RequestOptionsBase | RawResponseCallback,
        callback: RawResponseCallback
    ): void;
    /**
     * @param meetingId Meeting Id.
     * @param options The optional parameters.
     * @param callback The callback.
     * @returns Promise with TeamsFetchMeetingInfoResponse.
     */
    fetchMeetingInfo(
        meetingId: string,
        options?: RequestOptionsBase | RawResponseCallback,
        callback?: RawResponseCallback
    ): Promise<Models.TeamsMeetingInfoResponse> {
        if (typeof options === 'function') {
            const onResponse = options;
            options = {
                onResponse
            }
        } else if (options) {
            options.onResponse = callback;
        }

        return this.client.sendOperationRequest(
            {
                meetingId,
                options,
            },
            fetchMeetingInfoOperationSpec
        ) as Promise<Models.TeamsMeetingInfoResponse>;
    }

    /**
     * Send meeting notification.
     * 
     * @param meetingId Meeting Id.
     * @param notification The content and configuration for the notification to send.
     * @param options The optional parameters.
     */
    sendMeetingNotification(
        meetingId: string,
        notification: MeetingNotification,
        options?: RequestOptionsBase,
    ): Promise<Models.TeamsMeetingNotificationResponse>
    /**
     * @param meetingId Meeting Id.
     * @param notification The content and configuration for the notification to send.
     * @param callback The callback.
     */
    sendMeetingNotification(
        meetingId: string,
        notification: MeetingNotification,
        callback: RawResponseCallback
    ): void;
    /**
     * @param meetingId Meeting Id.
     * @param notification The content and configuration for the notification to send.
     * @param options The optional parameters.
     * @param callback The callback.
     */
    sendMeetingNotification(
        meetingId: string,
        notification: MeetingNotification,
        options: RequestOptionsBase,
        callback: RawResponseCallback
    ): void;
    /**
     * @param meetingId Meeting Id.
     * @param notification The content and configuration for the notification to send.
     * @param options The optional parameters.
     * @param callback The callback.
     * @returns Promise with either MeetingNotificationResponse or an empty object.
     */
    sendMeetingNotification(
        meetingId: string,
        notification: MeetingNotification,
        options?: RequestOptionsBase,
        callback?: RawResponseCallback
    ): Promise<Models.TeamsMeetingNotificationResponse> {
        options.onResponse = callback;

        return this.client.sendOperationRequest(
            {
                meetingId,
                notification,
                options
            },
            sendMeetingNotificationOperationSpec
        ) as Promise<Models.TeamsMeetingNotificationResponse>;
    }

    //Batch Operations
    /**
     * Send message to a list of users.
     *
     * @param activity The activity to send.
     * @param tenantId The tenant Id.
     * @param members The list of members.
     * @param options The optional parameters.
     * @param callback The callback.
     * @returns Promise with TeamsBatchOperationResponse.
     */
    sendMessageToListOfUsers(
        activity: Activity,
        tenantId: string,
        members: TeamsMember[],
        options?: RequestOptionsBase,
        callback?: RawResponseCallback
    ): Promise<Models.TeamsBatchOperationResponse> {
        const content = {
            activity,
            members,
            tenantId
        }

        options.onResponse = callback;

        return retryAction(() => this.client.sendOperationRequest(
            {
                content,
                options
            },
            sendMessageToListOfUsersOperationSpec
        ) as Promise<Models.TeamsBatchOperationResponse>, this.retryCount);
    }

    /**
     * Send message to all users belonging to a tenant.
     *
     * @param activity The activity to send.
     * @param tenantId The id of the recipient Tenant.
     * @param options The optional parameters.
     * @param callback The callback.
     * @returns Promise with TeamsBatchOperationResponse.
     */
    sendMessageToAllUsersInTenant(
        activity: Activity,
        tenantId: string,
        options?: RequestOptionsBase,
        callback?: RawResponseCallback
    ): Promise<Models.TeamsBatchOperationResponse> {
        const content = {
            activity,
            tenantId
        }

        options.onResponse = callback;

        return retryAction(() => this.client.sendOperationRequest(
            {
                content,
                options
            },
            sendMessageToAllUsersInTenantOperationSpec
        ) as Promise<Models.TeamsBatchOperationResponse>, this.retryCount);
    }

    /**
     * Send message to all users belonging to a team.
     *
     * @param activity The activity to send.
     * @param tenantId The tenant Id.
     * @param teamId The id of the recipient Team.
     * @param options The optional parameters.
     * @param callback The callback.
     * @returns Promise with TeamsBatchOperationResponse.
     */
    sendMessageToAllUsersInTeam(
        activity: Activity,
        tenantId: string,
        teamId: string,
        options?: RequestOptionsBase,
        callback?: RawResponseCallback
    ): Promise<Models.TeamsBatchOperationResponse> {
        const content = {
            activity,
            tenantId,
            teamId
        }

        options.onResponse = callback;

        return retryAction(() => this.client.sendOperationRequest(
            {
                content,
                options
            },
            sendMessageToAllUsersInTeamOperationSpec
        ) as Promise<Models.TeamsBatchOperationResponse>, this.retryCount);
    }

    /**
     * Send message to a list of channels.
     *
     * @param activity The activity to send.
     * @param tenantId The tenant Id.
     * @param members The list of channels.
     * @param options The optional parameters.
     * @param callback The callback.
     * @returns Promise with TeamsBatchOperationResponse.
     */
    sendMessageToListOfChannels(
        activity: Activity,
        tenantId: string,
        members: TeamsMember[],
        options?: RequestOptionsBase,
        callback?: RawResponseCallback
    ): Promise<Models.TeamsBatchOperationResponse> {
        const content = {
            activity,
            tenantId,
            members
        }

        options.onResponse = callback;

        return retryAction(() => this.client.sendOperationRequest(
            {
                content,
                options
            },
            sendMessageToListOfChannelsOperationSpec
        ) as Promise<Models.TeamsBatchOperationResponse>, this.retryCount);
    }

    /**
     * Get the state of an operation.
     * 
     * @param operationId The operationId to get the state of.
     * @param options The optional parameters.
     * @param callback The callback.
     * @returns Promise with BatchOperationStateResponse.
     */
    getOperationState(
        operationId: string,
        options?: RequestOptionsBase,
        callback?: RawResponseCallback
    ): Promise<Models.BatchBatchOperationStateResponse> {
        options.onResponse = callback;

        return retryAction(() => this.client.sendOperationRequest(
            {
                operationId,
                options
            },
            getOperationStateSpec
        ) as Promise<Models.BatchBatchOperationStateResponse>, this.retryCount);
    }

    /**
     * Get the failed entries of an operation.
     * 
     * @param operationId The operationId to get the failed entries of.
     * @param options The optional parameters.
     * @param callback The callback.
     * @returns Promise with BatchFailedEntriesResponse.
     */
    getOperationFailedEntries(
        operationId: string,
        options?: RequestOptionsBase,
        callback?: RawResponseCallback
    ): Promise<Models.BatchBatchFailedEntriesResponse> {
        options.onResponse = callback;

        return retryAction(() => this.client.sendOperationRequest(
            {
                operationId,
                options
            },
            getPagedFailedEntriesSpec
        ) as Promise<Models.BatchBatchFailedEntriesResponse>, this.retryCount);
    }

    /**
     * Cancel an operation.
     *
     * @param operationId The id of the operation to cancel.
     * @param options The optional parameters.
     * @returns Promise with CancelOperationResponse.
     */
    cancelOperation(
        operationId: string,
        options?: RequestOptionsBase,
    ): Promise<Models.CancelOperationResponse> {
        return retryAction(() => this.client.sendOperationRequest(
            {
                operationId,
                options
            },
            cancelOperationSpec
        ) as Promise<Models.CancelOperationResponse>, this.retryCount);
    }
}

// Operation Specifications
const serializer = createSerializer(Mappers);
const fetchChannelListOperationSpec: OperationSpec = {
    httpMethod: 'GET',
    path: 'v3/teams/{teamId}/conversations',
    urlParameters: [Parameters.teamId],
    responses: {
        200: {
            bodyMapper: Mappers.ConversationList,
        },
        default: {},
    },
    serializer,
};

const fetchTeamDetailsOperationSpec: OperationSpec = {
    httpMethod: 'GET',
    path: 'v3/teams/{teamId}',
    urlParameters: [Parameters.teamId],
    responses: {
        200: {
            bodyMapper: Mappers.TeamDetails,
        },
        default: {},
    },
    serializer,
};

const fetchMeetingParticipantOperationSpec: OperationSpec = {
    httpMethod: 'GET',
    path: 'v1/meetings/{meetingId}/participants/{participantId}',
    urlParameters: [Parameters.meetingId, Parameters.participantId],
    queryParameters: [Parameters.tenantId],
    responses: {
        200: {
            bodyMapper: Mappers.TeamsMeetingParticipant,
        },
        default: {},
    },
    serializer,
};

const fetchMeetingInfoOperationSpec: OperationSpec = {
    httpMethod: 'GET',
    path: 'v1/meetings/{meetingId}',
    urlParameters: [Parameters.meetingId],
    responses: {
        200: {
            bodyMapper: Mappers.TeamsMeetingInfo,
        },
        default: {},
    },
    serializer,
};

const sendMeetingNotificationOperationSpec: OperationSpec = {
    httpMethod: 'POST',
    path: 'v1/meetings/{meetingId}/notification',
    urlParameters: [Parameters.meetingId],
    requestBody: {
        parameterPath: 'notification',
        mapper: {
            ...Mappers.MeetingNotification,
            required: true
        }
    },
    responses: {
        202: {
            bodyMapper: Mappers.MeetingNotificationResponse
        },
        207: {
            bodyMapper: Mappers.MeetingNotificationResponse
        },
        default: {
            bodyMapper: Mappers.ErrorResponse
        }
    },
    serializer
}

const sendMessageToListOfUsersOperationSpec: OperationSpec = {
    httpMethod: 'POST',
    path: 'v3/batch/conversation/users',
    requestBody: {
        parameterPath: 'content',
        mapper: {
            ...Mappers.BatchOperationRequest,
            required: true
        }
    },
    responses: {
        201: {
            bodyMapper: Mappers.BatchOperationResponse
        },
        default: {
            bodyMapper: Mappers.ErrorResponse
        }
    },
    serializer
}

const sendMessageToAllUsersInTenantOperationSpec: OperationSpec = {
    httpMethod: 'POST',
    path: 'v3/batch/conversation/tenant',
    requestBody: {
        parameterPath: 'content',
        mapper: {
            ...Mappers.BatchOperationRequest,
            required: true
        }
    },
    responses: {
        201: {
            bodyMapper: Mappers.BatchOperationResponse
        },
        default: {
            bodyMapper: Mappers.ErrorResponse
        }
    },
    serializer
}

const sendMessageToAllUsersInTeamOperationSpec: OperationSpec = {
    httpMethod: 'POST',
    path: 'v3/batch/conversation/team',
    requestBody: {
        parameterPath: 'content',
        mapper: {
            ...Mappers.BatchOperationRequest,
            required: true
        }
    },
    responses: {
        201: {
            bodyMapper: Mappers.BatchOperationResponse
        },
        default: {
            bodyMapper: Mappers.ErrorResponse
        }
    },
    serializer
}

const sendMessageToListOfChannelsOperationSpec: OperationSpec = {
    httpMethod: 'POST',
    path: 'v3/batch/conversation/channels',
    requestBody: {
        parameterPath: 'content',
        mapper: {
            ...Mappers.BatchOperationRequest,
            required: true
        }
    },
    responses: {
        201: {
            bodyMapper: Mappers.BatchOperationResponse
        },
        default: {
            bodyMapper: Mappers.ErrorResponse
        }
    },
    serializer
}

const getOperationStateSpec: OperationSpec = {
    httpMethod: 'GET',
    path: 'v3/batch/conversation/{operationId}',
    urlParameters: [Parameters.operationId],
    responses: {
        200: {
            bodyMapper: Mappers.GetTeamsOperationStateResponse,
        },
        default: {
            bodyMapper: Mappers.ErrorResponse
        }
    },
    serializer,
};

const getPagedFailedEntriesSpec: OperationSpec = {
    httpMethod: 'GET',
    path: 'v3/batch/conversation/failedentries/{operationId}',
    urlParameters: [Parameters.operationId],
    responses: {
        200: {
            bodyMapper: Mappers.GetTeamsFailedEntriesResponse,
        },
        default: {
            bodyMapper: Mappers.ErrorResponse
        }
    },
    serializer,
};

const cancelOperationSpec: OperationSpec = {
    httpMethod: 'DELETE',
    path: 'v3/batch/conversation/{operationId}',
    urlParameters: [Parameters.operationId],
    responses: {
        200: {},
        default: {
            bodyMapper: Mappers.ErrorResponse
        }
    },
    serializer,
};
