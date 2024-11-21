/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { createSerializer } from "@azure/core-client"
import { RequestOptionsBase } from "../../utils";
import { OperationSpec, RawResponseCallback } from "@azure/core-client";
import { ConnectorClientContext } from "../connectorClientContext";
import * as Models from "../models";
import * as Mappers from "../models/attachmentsMappers";
import * as Parameters from "../models/parameters";

/** Class representing a Attachments. */
export class Attachments {
  private readonly client: ConnectorClientContext;

  /**
   * Create a Attachments.
   * @param {ConnectorClientContext} client Reference to the service client.
   */
  constructor(client: ConnectorClientContext) {
    this.client = client;
  }

  /**
   * Get AttachmentInfo structure describing the attachment views
   * @summary GetAttachmentInfo
   * @param attachmentId attachment id
   * @param [options] The optional parameters
   * @returns Promise<Models.AttachmentsGetAttachmentInfoResponse>
   */
  getAttachmentInfo(attachmentId: string, options?: RequestOptionsBase): Promise<Models.AttachmentsGetAttachmentInfoResponse>;
  /**
   * @param attachmentId attachment id
   * @param callback The callback
   */
  getAttachmentInfo(attachmentId: string, callback: RawResponseCallback): void;
  /**
   * @param attachmentId attachment id
   * @param options The optional parameters
   * @param callback The callback
   */
  getAttachmentInfo(attachmentId: string, options: RequestOptionsBase, callback: RawResponseCallback): void;
  getAttachmentInfo(attachmentId: string, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.AttachmentsGetAttachmentInfoResponse> {
    if (typeof options === 'function') {
      const onResponse = options;
      options = {
        onResponse
      }
    } else {
      options.onResponse = callback;
    }

    return this.client.sendOperationRequest(
      {
        attachmentId,
        options
      },
      getAttachmentInfoOperationSpec
    ) as Promise<Models.AttachmentsGetAttachmentInfoResponse>;
  }

  /**
   * Get the named view as binary content
   * @summary GetAttachment
   * @param attachmentId attachment id
   * @param viewId View id from attachmentInfo
   * @param [options] The optional parameters
   * @returns Promise<Models.AttachmentsGetAttachmentResponse>
   */
  getAttachment(attachmentId: string, viewId: string, options?: RequestOptionsBase): Promise<Models.AttachmentsGetAttachmentResponse>;
  /**
   * @param attachmentId attachment id
   * @param viewId View id from attachmentInfo
   * @param callback The callback
   */
  getAttachment(attachmentId: string, viewId: string, callback: RawResponseCallback): void;
  /**
   * @param attachmentId attachment id
   * @param viewId View id from attachmentInfo
   * @param options The optional parameters
   * @param callback The callback
   */
  getAttachment(attachmentId: string, viewId: string, options: RequestOptionsBase, callback: RawResponseCallback): void;
  getAttachment(attachmentId: string, viewId: string, options?: RequestOptionsBase | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.AttachmentsGetAttachmentResponse> {
    if (typeof options === 'function') {
      const onResponse = options;
      options = {
        onResponse
      }
    } else {
      options.onResponse = callback;
    }

    return this.client.sendOperationRequest(
      {
        attachmentId,
        viewId,
        options
      },
      getAttachmentOperationSpec
    ) as Promise<Models.AttachmentsGetAttachmentResponse>;
  }
}

// Operation Specifications
const serializer = createSerializer(Mappers);
const getAttachmentInfoOperationSpec: OperationSpec = {
  httpMethod: "GET",
  path: "v3/attachments/{attachmentId}",
  urlParameters: [
    Parameters.attachmentId
  ],
  responses: {
    200: {
      bodyMapper: Mappers.AttachmentInfo
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const getAttachmentOperationSpec: OperationSpec = {
  httpMethod: "GET",
  path: "v3/attachments/{attachmentId}/views/{viewId}",
  urlParameters: [
    Parameters.attachmentId,
    Parameters.viewId
  ],
  responses: {
    200: {
      bodyMapper: {
        serializedName: "parsedResponse",
        type: {
          name: "Stream"
        }
      }
    },
    301: {},
    302: {},
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};
