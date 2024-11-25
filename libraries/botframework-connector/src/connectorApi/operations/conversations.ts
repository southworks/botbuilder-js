/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as Mappers from "../models/conversationsMappers";
import * as Models from "../models";
import * as Parameters from "../models/parameters";
import { RequestOptionsBase } from "../../utils";
import { PipelineResponse } from "@azure/core-rest-pipeline";
import { createSerializer, OperationSpec, RawResponseCallback } from "@azure/core-client";
import { ConnectorClientContext } from "../connectorClientContext";
import { ConversationIdHttpHeaderName } from "../../conversationConstants";

/**
 * The flattened response to a REST call.
 * Contains the underlying {@link PipelineResponse} as well as
 * the merged properties of the `parsedBody`, `parsedHeaders`, etc.
 */
interface RestResponse {
  /**
   * The underlying HTTP response containing both raw and deserialized response data.
   */
  _response: PipelineResponse;
  /**
   * The flattened properties described by the `OperationSpec`, deserialized from headers and the HTTP body.
   */
  [key: string]: any;
}

/** Class representing a Conversations. */
export class Conversations {
  private readonly client: ConnectorClientContext;

  /**
   * Create a Conversations.
   * @param {ConnectorClientContext} client Reference to the service client.
   */
  constructor(client: ConnectorClientContext) {
    this.client = client;
  }

  /**
   * List the Conversations in which this bot has participated.
   *
   * GET from this method with a skip token
   *
   * The return value is a ConversationsResult, which contains an array of ConversationMembers and a
   * skip token.  If the skip token is not empty, then
   * there are further values to be returned. Call this method again with the returned token to get
   * more values.
   *
   * Each ConversationMembers object contains the ID of the conversation and an array of
   * ChannelAccounts that describe the members of the conversation.
   * @summary GetConversations
   * @param [options] The optional parameters
   * @returns Promise<Models.ConversationsGetConversationsResponse>
   */
  getConversations(options?: Models.ConversationsGetConversationsOptionalParams): Promise<Models.ConversationsGetConversationsResponse>;
  /**
   * @param callback The callback
   */
  getConversations(callback: RawResponseCallback): void;
  /**
   * @param options The optional parameters
   * @param callback The callback
   */
  getConversations(options: Models.ConversationsGetConversationsOptionalParams, callback: RawResponseCallback): void;
  getConversations(options?: Models.ConversationsGetConversationsOptionalParams | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsGetConversationsResponse> {
    if (typeof options === 'function') {
      const onResponse = options;
      options = {
        continuationToken: null,
        onResponse
      }
    } else if (options) {
      options.onResponse = callback;
    }

    return this.client.sendOperationRequest(
      {
        options
      },
      getConversationsOperationSpec
    ) as Promise<Models.ConversationsGetConversationsResponse>;
  }

  /**
   * Create a new Conversation.
   *
   * POST to this method with a
   * * Bot being the bot creating the conversation
   * * IsGroup set to true if this is not a direct message (default is false)
   * * Array containing the members to include in the conversation
   *
   * The return value is a ResourceResponse which contains a conversation id which is suitable for
   * use
   * in the message payload and REST API uris.
   *
   * Most channels only support the semantics of bots initiating a direct message conversation.  An
   * example of how to do that would be:
   *
   * ```
   * const resource = await connector.conversations.createConversation({
   *     bot,
   *     members: [{ id: 'user1' }]
   * });
   * await connector.conversations.sendToConversation(resource.Id, ... );
   * ```
   * @summary CreateConversation
   * @param parameters Parameters to create the conversation from
   * @param [options] The optional parameters
   * @returns Promise<Models.ConversationsCreateConversationResponse>
   */
  createConversation(parameters: Models.ConversationParameters, options?: RequestOptionsBase): Promise<Models.ConversationsCreateConversationResponse>;
  /**
   * @param parameters Parameters to create the conversation from
   * @param callback The callback
   */
  createConversation(parameters: Models.ConversationParameters, callback: RawResponseCallback): void;
  /**
   * @param parameters Parameters to create the conversation from
   * @param options The optional parameters
   * @param callback The callback
   */
  createConversation(parameters: Models.ConversationParameters, options: RequestOptionsBase, callback: RawResponseCallback): void;
  createConversation(parameters: Models.ConversationParameters, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsCreateConversationResponse> {
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
        parameters,
        options
      },
      createConversationOperationSpec
    ) as Promise<Models.ConversationsCreateConversationResponse>;
  }

  /**
   * This method allows you to send an activity to the end of a conversation.
   *
   * This is slightly different from ReplyToActivity().
   * * SendToConversation(conversationId) - will append the activity to the end of the conversation
   * according to the timestamp or semantics of the channel.
   * * ReplyToActivity(conversationId,ActivityId) - adds the activity as a reply to another activity,
   * if the channel supports it. If the channel does not support nested replies, ReplyToActivity
   * falls back to SendToConversation.
   *
   * Use ReplyToActivity when replying to a specific activity in the conversation.
   *
   * Use SendToConversation in all other cases.
   * @summary SendToConversation
   * @param conversationId Conversation ID
   * @param activity Activity to send
   * @param [options] The optional parameters
   * @returns Promise<Models.ConversationsSendToConversationResponse>
   */
  sendToConversation(conversationId: string, activity: Partial<Models.Activity>, options?: RequestOptionsBase): Promise<Models.ConversationsSendToConversationResponse>;
  /**
   * @param conversationId Conversation ID
   * @param activity Activity to send
   * @param callback The callback
   */
  sendToConversation(conversationId: string, activity: Partial<Models.Activity>, callback: RawResponseCallback): void;
  /**
   * @param conversationId Conversation ID
   * @param activity Activity to send
   * @param options The optional parameters
   * @param callback The callback
   */
  sendToConversation(conversationId: string, activity: Partial<Models.Activity>, options: RequestOptionsBase, callback: RawResponseCallback): void;
  sendToConversation(conversationId: string, activity: Partial<Models.Activity>, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsSendToConversationResponse> {
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
        conversationId,
        activity,
        options
      },
      sendToConversationOperationSpec
    ) as Promise<Models.ConversationsSendToConversationResponse>;
  }

  /**
   * This method allows you to upload the historic activities to the conversation.
   *
   * Sender must ensure that the historic activities have unique ids and appropriate timestamps. The
   * ids are used by the client to deal with duplicate activities and the timestamps are used by the
   * client to render the activities in the right order.
   * @summary SendConversationHistory
   * @param conversationId Conversation ID
   * @param history Historic activities
   * @param [options] The optional parameters
   * @returns Promise<Models.ConversationsSendConversationHistoryResponse>
   */
  sendConversationHistory(conversationId: string, history: Models.Transcript, options?: RequestOptionsBase): Promise<Models.ConversationsSendConversationHistoryResponse>;
  /**
   * @param conversationId Conversation ID
   * @param history Historic activities
   * @param callback The callback
   */
  sendConversationHistory(conversationId: string, history: Models.Transcript, callback: RawResponseCallback): void;
  /**
   * @param conversationId Conversation ID
   * @param history Historic activities
   * @param options The optional parameters
   * @param callback The callback
   */
  sendConversationHistory(conversationId: string, history: Models.Transcript, options: RequestOptionsBase, callback: RawResponseCallback): void;
  sendConversationHistory(conversationId: string, history: Models.Transcript, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsSendConversationHistoryResponse> {
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
        conversationId,
        history,
        options
      },
      sendConversationHistoryOperationSpec
    ) as Promise<Models.ConversationsSendConversationHistoryResponse>;
  }

  /**
   * Edit an existing activity.
   *
   * Some channels allow you to edit an existing activity to reflect the new state of a bot
   * conversation.
   *
   * For example, you can remove buttons after someone has clicked "Approve" button.
   * @summary UpdateActivity
   * @param conversationId Conversation ID
   * @param activityId activityId to update
   * @param activity replacement Activity
   * @param [options] The optional parameters
   * @returns Promise<Models.ConversationsUpdateActivityResponse>
   */
  updateActivity(conversationId: string, activityId: string, activity: Partial<Models.Activity>, options?: RequestOptionsBase): Promise<Models.ConversationsUpdateActivityResponse>;
  /**
   * @param conversationId Conversation ID
   * @param activityId activityId to update
   * @param activity replacement Activity
   * @param callback The callback
   */
  updateActivity(conversationId: string, activityId: string, activity: Partial<Models.Activity>, callback: RawResponseCallback): void;
  /**
   * @param conversationId Conversation ID
   * @param activityId activityId to update
   * @param activity replacement Activity
   * @param options The optional parameters
   * @param callback The callback
   */
  updateActivity(conversationId: string, activityId: string, activity: Partial<Models.Activity>, options: RequestOptionsBase, callback: RawResponseCallback): void;
  updateActivity(conversationId: string, activityId: string, activity: Partial<Models.Activity>, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsUpdateActivityResponse> {
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
        conversationId,
        activityId,
        activity,
        options
      },
      updateActivityOperationSpec
    ) as Promise<Models.ConversationsUpdateActivityResponse>;
  }

  /**
   * This method allows you to reply to an activity.
   *
   * This is slightly different from SendToConversation().
   * * SendToConversation(conversationId) - will append the activity to the end of the conversation
   * according to the timestamp or semantics of the channel.
   * * ReplyToActivity(conversationId,ActivityId) - adds the activity as a reply to another activity,
   * if the channel supports it. If the channel does not support nested replies, ReplyToActivity
   * falls back to SendToConversation.
   *
   * Use ReplyToActivity when replying to a specific activity in the conversation.
   *
   * Use SendToConversation in all other cases.
   * @summary ReplyToActivity
   * @param conversationId Conversation ID
   * @param activityId activityId the reply is to (OPTIONAL)
   * @param activity Activity to send
   * @param [options] The optional parameters
   * @returns Promise<Models.ConversationsReplyToActivityResponse>
   */
  replyToActivity(conversationId: string, activityId: string, activity: Partial<Models.Activity>, options?: RequestOptionsBase): Promise<Models.ConversationsReplyToActivityResponse>;
  /**
   * @param conversationId Conversation ID
   * @param activityId activityId the reply is to (OPTIONAL)
   * @param activity Activity to send
   * @param callback The callback
   */
  replyToActivity(conversationId: string, activityId: string, activity: Partial<Models.Activity>, callback: RawResponseCallback): void;
  /**
   * @param conversationId Conversation ID
   * @param activityId activityId the reply is to (OPTIONAL)
   * @param activity Activity to send
   * @param options The optional parameters
   * @param callback The callback
   */
  replyToActivity(conversationId: string, activityId: string, activity: Partial<Models.Activity>, options: RequestOptionsBase, callback: RawResponseCallback): void;
  replyToActivity(conversationId: string, activityId: string, activity: Partial<Models.Activity>, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsReplyToActivityResponse> {
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
        conversationId,
        activityId,
        activity,
        options
      },
      replyToActivityOperationSpec
    ) as Promise<Models.ConversationsReplyToActivityResponse>;
  }

  /**
   * Delete an existing activity.
   *
   * Some channels allow you to delete an existing activity, and if successful this method will
   * remove the specified activity.
   * @summary DeleteActivity
   * @param conversationId Conversation ID
   * @param activityId activityId to delete
   * @param [options] The optional parameters
   * @returns Promise<RestResponse>
   */
  deleteActivity(conversationId: string, activityId: string, options?: RequestOptionsBase): Promise<RestResponse>;
  /**
   * @param conversationId Conversation ID
   * @param activityId activityId to delete
   * @param callback The callback
   */
  deleteActivity(conversationId: string, activityId: string, callback: RawResponseCallback): void;
  /**
   * @param conversationId Conversation ID
   * @param activityId activityId to delete
   * @param options The optional parameters
   * @param callback The callback
   */
  deleteActivity(conversationId: string, activityId: string, options: RequestOptionsBase, callback: RawResponseCallback): void;
  deleteActivity(conversationId: string, activityId: string, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<RestResponse> {
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
        conversationId,
        activityId,
        options
      },
      deleteActivityOperationSpec
    );
  }

  /**
   * Enumerate the members of a conversation.
   *
   * This REST API takes a ConversationId and returns an array of ChannelAccount objects representing
   * the members of the conversation.
   * @summary GetConversationMembers
   * @param conversationId Conversation ID
   * @param [options] The optional parameters
   * @returns Promise<Models.ConversationsGetConversationMembersResponse>
   */
  getConversationMembers(conversationId: string, options?: RequestOptionsBase): Promise<Models.ConversationsGetConversationMembersResponse>;
  /**
   * @param conversationId Conversation ID
   * @param callback The callback
   */
  getConversationMembers(conversationId: string, callback: RawResponseCallback): void;
  /**
   * @param conversationId Conversation ID
   * @param options The optional parameters
   * @param callback The callback
   */
  getConversationMembers(conversationId: string, options: RequestOptionsBase, callback: RawResponseCallback): void;
  getConversationMembers(conversationId: string, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsGetConversationMembersResponse> {
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
        conversationId,
        options
      },
      getConversationMembersOperationSpec
    ) as Promise<Models.ConversationsGetConversationMembersResponse>;
  }

  /**
   * @param conversationId Conversation ID
   * @param memberId MemberId for the user
   * @param options The optional parameters
   * @param callback The callback
   */
  getConversationMember(conversationId: string, memberId: string, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsGetConversationMemberResponse> {
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
        conversationId,
        memberId,
        options
      },
      getConversationMemberOperationSpec
    ) as Promise<Models.ConversationsGetConversationMemberResponse>;
  }

  /**
   * Enumerate the members of a conversation one page at a time.
   *
   * This REST API takes a ConversationId. Optionally a pageSize and/or continuationToken can be
   * provided. It returns a PagedMembersResult, which contains an array
   * of ChannelAccounts representing the members of the conversation and a continuation token that
   * can be used to get more values.
   *
   * One page of ChannelAccounts records are returned with each call. The number of records in a page
   * may vary between channels and calls. The pageSize parameter can be used as
   * a suggestion. If there are no additional results the response will not contain a continuation
   * token. If there are no members in the conversation the Members will be empty or not present in
   * the response.
   *
   * A response to a request that has a continuation token from a prior request may rarely return
   * members from a previous request.
   * @summary GetConversationPagedMembers
   * @param conversationId Conversation ID
   * @param [options] The optional parameters
   * @returns Promise<Models.ConversationsGetConversationPagedMembersResponse>
   */
  getConversationPagedMembers(conversationId: string, options?: Models.ConversationsGetConversationPagedMembersOptionalParams): Promise<Models.ConversationsGetConversationPagedMembersResponse>;
  /**
   * @param conversationId Conversation ID
   * @param callback The callback
   */
  getConversationPagedMembers(conversationId: string, callback: RawResponseCallback): void;
  /**
   * @param conversationId Conversation ID
   * @param options The optional parameters
   * @param callback The callback
   */
  getConversationPagedMembers(conversationId: string, options: Models.ConversationsGetConversationPagedMembersOptionalParams, callback: RawResponseCallback): void;
  getConversationPagedMembers(conversationId: string, options?: Models.ConversationsGetConversationPagedMembersOptionalParams | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsGetConversationPagedMembersResponse> {
    if (typeof options === 'function') {
      const onResponse = options;
      options = {
        pageSize: 0,
        continuationToken: null,
        onResponse
      }
    } else if (options) {
      options.onResponse = callback;
    }

    return this.client.sendOperationRequest(
      {
        conversationId,
        options
      },
      getConversationPagedMembersOperationSpec
    ) as Promise<Models.ConversationsGetConversationPagedMembersResponse>;
  }

  /**
   * Deletes a member from a conversation.
   *
   * This REST API takes a ConversationId and a memberId (of type string) and removes that member
   * from the conversation. If that member was the last member
   * of the conversation, the conversation will also be deleted.
   * @summary DeleteConversationMember
   * @param conversationId Conversation ID
   * @param memberId ID of the member to delete from this conversation
   * @param [options] The optional parameters
   * @returns Promise<RestResponse>
   */
  deleteConversationMember(conversationId: string, memberId: string, options?: RequestOptionsBase): Promise<RestResponse>;
  /**
   * @param conversationId Conversation ID
   * @param memberId ID of the member to delete from this conversation
   * @param callback The callback
   */
  deleteConversationMember(conversationId: string, memberId: string, callback: RawResponseCallback): void;
  /**
   * @param conversationId Conversation ID
   * @param memberId ID of the member to delete from this conversation
   * @param options The optional parameters
   * @param callback The callback
   */
  deleteConversationMember(conversationId: string, memberId: string, options: RequestOptionsBase, callback: RawResponseCallback): void;
  deleteConversationMember(conversationId: string, memberId: string, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<RestResponse> {
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
        conversationId,
        memberId,
        options
      },
      deleteConversationMemberOperationSpec
    );
  }

  /**
   * Enumerate the members of an activity.
   *
   * This REST API takes a ConversationId and a ActivityId, returning an array of ChannelAccount
   * objects representing the members of the particular activity in the conversation.
   * @summary GetActivityMembers
   * @param conversationId Conversation ID
   * @param activityId Activity ID
   * @param [options] The optional parameters
   * @returns Promise<Models.ConversationsGetActivityMembersResponse>
   */
  getActivityMembers(conversationId: string, activityId: string, options?: RequestOptionsBase): Promise<Models.ConversationsGetActivityMembersResponse>;
  /**
   * @param conversationId Conversation ID
   * @param activityId Activity ID
   * @param callback The callback
   */
  getActivityMembers(conversationId: string, activityId: string, callback: RawResponseCallback): void;
  /**
   * @param conversationId Conversation ID
   * @param activityId Activity ID
   * @param options The optional parameters
   * @param callback The callback
   */
  getActivityMembers(conversationId: string, activityId: string, options: RequestOptionsBase, callback: RawResponseCallback): void;
  getActivityMembers(conversationId: string, activityId: string, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsGetActivityMembersResponse> {
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
        conversationId,
        activityId,
        options
      },
      getActivityMembersOperationSpec
    ) as Promise<Models.ConversationsGetActivityMembersResponse>;
  }

  /**
   * Upload an attachment directly into a channel's blob storage.
   *
   * This is useful because it allows you to store data in a compliant store when dealing with
   * enterprises.
   *
   * The response is a ResourceResponse which contains an AttachmentId which is suitable for using
   * with the attachments API.
   * @summary UploadAttachment
   * @param conversationId Conversation ID
   * @param attachmentUpload Attachment data
   * @param [options] The optional parameters
   * @returns Promise<Models.ConversationsUploadAttachmentResponse>
   */
  uploadAttachment(conversationId: string, attachmentUpload: Models.AttachmentData, options?: RequestOptionsBase): Promise<Models.ConversationsUploadAttachmentResponse>;
  /**
   * @param conversationId Conversation ID
   * @param attachmentUpload Attachment data
   * @param callback The callback
   */
  uploadAttachment(conversationId: string, attachmentUpload: Models.AttachmentData, callback: RawResponseCallback): void;
  /**
   * @param conversationId Conversation ID
   * @param attachmentUpload Attachment data
   * @param options The optional parameters
   * @param callback The callback
   */
  uploadAttachment(conversationId: string, attachmentUpload: Models.AttachmentData, options: RequestOptionsBase, callback: RawResponseCallback): void;
  uploadAttachment(conversationId: string, attachmentUpload: Models.AttachmentData, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.ConversationsUploadAttachmentResponse> {
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
        conversationId,
        attachmentUpload,
        options
      },
      uploadAttachmentOperationSpec
    ) as Promise<Models.ConversationsUploadAttachmentResponse>;
  }
}

// Operation Specifications
const serializer = createSerializer(Mappers);
const getConversationsOperationSpec: OperationSpec = {
  httpMethod: "GET",
  path: "v3/conversations",
  queryParameters: [
    Parameters.continuationToken
  ],
  responses: {
    200: {
      bodyMapper: Mappers.ConversationsResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const createConversationOperationSpec: OperationSpec = {
  httpMethod: "POST",
  path: "v3/conversations",
  requestBody: {
    parameterPath: "parameters",
    mapper: {
      ...Mappers.ConversationParameters,
      required: true
    }
  },
  responses: {
    200: {
      bodyMapper: Mappers.ConversationResourceResponse
    },
    201: {
      bodyMapper: Mappers.ConversationResourceResponse
    },
    202: {
      bodyMapper: Mappers.ConversationResourceResponse
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const sendToConversationOperationSpec: OperationSpec = {
  httpMethod: "POST",
  path: "v3/conversations/{conversationId}/activities",
  urlParameters: [
    Parameters.conversationId
  ],
  requestBody: {
    parameterPath: "activity",
    mapper: {
      ...Mappers.Activity,
      required: true
    }
  },
  responses: {
    200: {
      bodyMapper: Mappers.ResourceResponse
    },
    201: {
      bodyMapper: Mappers.ResourceResponse
    },
    202: {
      bodyMapper: Mappers.ResourceResponse
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const sendConversationHistoryOperationSpec: OperationSpec = {
  httpMethod: "POST",
  path: "v3/conversations/{conversationId}/activities/history",
  urlParameters: [
    Parameters.conversationId
  ],
  requestBody: {
    parameterPath: "history",
    mapper: {
      ...Mappers.Transcript,
      required: true
    }
  },
  responses: {
    200: {
      bodyMapper: Mappers.ResourceResponse
    },
    201: {
      bodyMapper: Mappers.ResourceResponse
    },
    202: {
      bodyMapper: Mappers.ResourceResponse
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const updateActivityOperationSpec: OperationSpec = {
  httpMethod: "PUT",
  path: "v3/conversations/{conversationId}/activities/{activityId}",
  urlParameters: [
    Parameters.conversationId,
    Parameters.activityId
  ],
  requestBody: {
    parameterPath: "activity",
    mapper: {
      ...Mappers.Activity,
      required: true
    }
  },
  responses: {
    200: {
      bodyMapper: Mappers.ResourceResponse
    },
    201: {
      bodyMapper: Mappers.ResourceResponse
    },
    202: {
      bodyMapper: Mappers.ResourceResponse
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const replyToActivityOperationSpec: OperationSpec = {
  httpMethod: "POST",
  path: "v3/conversations/{conversationId}/activities/{activityId}",
  urlParameters: [
    Parameters.conversationId,
    Parameters.activityId
  ],
  headerParameters: [{
    parameterPath: 'conversationId',
    mapper: {
      serializedName: ConversationIdHttpHeaderName,
      type: {
        name: 'String'
      }
    },
  }],
  requestBody: {
    parameterPath: "activity",
    mapper: {
      ...Mappers.Activity,
      required: true
    }
  },
  responses: {
    200: {
      bodyMapper: Mappers.ResourceResponse
    },
    201: {
      bodyMapper: Mappers.ResourceResponse
    },
    202: {
      bodyMapper: Mappers.ResourceResponse
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const deleteActivityOperationSpec: OperationSpec = {
  httpMethod: "DELETE",
  path: "v3/conversations/{conversationId}/activities/{activityId}",
  urlParameters: [
    Parameters.conversationId,
    Parameters.activityId
  ],
  responses: {
    200: {},
    202: {},
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const getConversationMembersOperationSpec: OperationSpec = {
  httpMethod: "GET",
  path: "v3/conversations/{conversationId}/members",
  urlParameters: [
    Parameters.conversationId
  ],
  responses: {
    200: {
      bodyMapper: {
        serializedName: "parsedResponse",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "ChannelAccount"
            }
          }
        }
      }
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const getConversationMemberOperationSpec: OperationSpec = {
  httpMethod: "GET",
  path: "v3/conversations/{conversationId}/members/{memberId}",
  urlParameters: [
    Parameters.conversationId,
    Parameters.memberId
  ],
  responses: {
    200: {
      bodyMapper: Mappers.ChannelAccount,
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const getConversationPagedMembersOperationSpec: OperationSpec = {
  httpMethod: "GET",
  path: "v3/conversations/{conversationId}/pagedmembers",
  urlParameters: [
    Parameters.conversationId
  ],
  queryParameters: [
    Parameters.pageSize,
    Parameters.continuationToken
  ],
  responses: {
    200: {
      bodyMapper: Mappers.PagedMembersResult
    },
    default: {}
  },
  serializer
};

const deleteConversationMemberOperationSpec: OperationSpec = {
  httpMethod: "DELETE",
  path: "v3/conversations/{conversationId}/members/{memberId}",
  urlParameters: [
    Parameters.conversationId,
    Parameters.memberId
  ],
  responses: {
    200: {},
    204: {},
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const getActivityMembersOperationSpec: OperationSpec = {
  httpMethod: "GET",
  path: "v3/conversations/{conversationId}/activities/{activityId}/members",
  urlParameters: [
    Parameters.conversationId,
    Parameters.activityId
  ],
  responses: {
    200: {
      bodyMapper: {
        serializedName: "parsedResponse",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "ChannelAccount"
            }
          }
        }
      }
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const uploadAttachmentOperationSpec: OperationSpec = {
  httpMethod: "POST",
  path: "v3/conversations/{conversationId}/attachments",
  urlParameters: [
    Parameters.conversationId
  ],
  requestBody: {
    parameterPath: "attachmentUpload",
    mapper: {
      ...Mappers.AttachmentData,
      required: true
    }
  },
  responses: {
    200: {
      bodyMapper: Mappers.ResourceResponse
    },
    201: {
      bodyMapper: Mappers.ResourceResponse
    },
    202: {
      bodyMapper: Mappers.ResourceResponse
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};
