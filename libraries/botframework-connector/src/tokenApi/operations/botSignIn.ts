/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { createSerializer, OperationSpec, RawResponseCallback } from "@azure/core-client";
import * as Models from "../models";
import * as Mappers from "../models/botSignInMappers";
import * as Parameters from "../models/parameters";
import { TokenApiClientContext } from "../tokenApiClientContext";
import { SignInUrlResponse } from "botframework-schema";

/** Class representing a BotSignIn. */
export class BotSignIn {
  private readonly client: TokenApiClientContext;

  /**
   * Create a BotSignIn.
   * @param {TokenApiClientContext} client Reference to the service client.
   */
  constructor(client: TokenApiClientContext) {
    this.client = client;
  }

  /**
   * @param state
   * @param [options] The optional parameters
   * @returns Promise<Models.BotSignInGetSignInUrlResponse>
   */
  getSignInUrl(state: string, options?: Models.BotSignInGetSignInUrlOptionalParams): Promise<Models.BotSignInGetSignInUrlResponse>;
  /**
   * @param state
   * @param callback The callback
   */
  getSignInUrl(state: string, callback: RawResponseCallback): void;
  /**
   * @param state
   * @param options The optional parameters
   * @param callback The callback
   */
  getSignInUrl(state: string, options: Models.BotSignInGetSignInUrlOptionalParams, callback: RawResponseCallback): void;
  getSignInUrl(state: string, options?: Models.BotSignInGetSignInUrlOptionalParams | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.BotSignInGetSignInUrlResponse> {
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
        state,
        options
      },
      getSignInUrlOperationSpec
    ) as Promise<Models.BotSignInGetSignInUrlResponse>;
  }

  /**
   * @param state
   * @param [options] The optional parameters
   * @returns Promise<Models.BotSignInGetSignInResourceResponse>
   */
  getSignInResource(state: string, options?: Models.BotSignInGetSignInResourceOptionalParams): Promise<Models.BotSignInGetSignInResourceResponse>;
  /**
   * @param state
   * @param callback The callback
   */
  getSignInResource(state: string, callback: RawResponseCallback): void;
  /**
   * @param state
   * @param options The optional parameters
   * @param callback The callback
   */
  getSignInResource(state: string, options: Models.BotSignInGetSignInResourceOptionalParams, callback: RawResponseCallback): void;
  getSignInResource(state: string, options?: Models.BotSignInGetSignInResourceOptionalParams | RawResponseCallback, callback?: RawResponseCallback): Promise<Models.BotSignInGetSignInResourceResponse> {
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
        state,
        options
      },
      getSignInResourceOperationSpec
    ) as Promise<Models.BotSignInGetSignInResourceResponse>;
  }
}

// Operation Specifications
const serializer = createSerializer(Mappers);
const getSignInUrlOperationSpec: OperationSpec = {
  httpMethod: "GET",
  path: "api/botsignin/GetSignInUrl",
  queryParameters: [
    Parameters.state,
    Parameters.codeChallenge,
    Parameters.emulatorUrl,
    Parameters.finalRedirect
  ],
  responses: {
    200: {
      bodyMapper: {
        serializedName: "parsedResponse",
        type: {
          name: "String"
        }
      }
    },
    default: {}
  },
  serializer
};

const getSignInResourceOperationSpec: OperationSpec = {
  httpMethod: "GET",
  path: "api/botsignin/GetSignInResource",
  queryParameters: [
    Parameters.state,
    Parameters.codeChallenge,
    Parameters.emulatorUrl,
    Parameters.finalRedirect
  ],
  responses: {
    200: {
      bodyMapper: Mappers.SignInUrlResponse
    },
    default: {}
  },
  serializer
};
