/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ServiceClient, ServiceClientOptions } from "@azure/core-client";
import { TokenCredential } from '@azure/identity'
import { getDefaultUserAgentValue } from "../utils/userAgent";
import * as Models from "./models";

const packageName = "botframework-Token";
const packageVersion = "4.0.0";

export class TokenApiClientContext extends ServiceClient {
  credentials: TokenCredential;
  endpoint: string;

  // Protects against JSON.stringify leaking secrets
  private toJSON(): unknown {
    return { name: this.constructor.name };
  }

  /**
   * Initializes a new instance of the TokenApiClientContext class.
   * @param credentials Subscription credentials which uniquely identify client subscription.
   * @param endpoint Subscription endpoint
   * @param [options] The parameter options
   */
  constructor(credentials: TokenCredential, options?: ServiceClientOptions) {
    if (credentials === null || credentials === undefined) {
      throw new Error('\'credentials\' cannot be null.');
    }

    if (!options) {
      options = {};
    }
    const defaultUserAgent = getDefaultUserAgentValue();
//    options.userAgent = `${packageName}/${packageVersion} ${defaultUserAgent} ${options.userAgent || ''}`;

    super(options);

    this.endpoint = options.endpoint || this.endpoint || "https://token.botframework.com";
//    this.requestContentType = "application/json; charset=utf-8";
    this.credentials = credentials;

  }
}
