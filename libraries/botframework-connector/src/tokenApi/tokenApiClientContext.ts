/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ServiceClient, ServiceClientOptions } from "@azure/core-client";
import { getDefaultUserAgentValue, ServiceClientCredentials } from "../utils";
import * as Models from "./models";

const packageName = "botframework-Token";
const packageVersion = "4.0.0";

export class TokenApiClientContext extends ServiceClient {
  credentials: ServiceClientCredentials;
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
  constructor(credentials: ServiceClientCredentials, options?: ServiceClientOptions) {
    if (credentials === null || credentials === undefined) {
      throw new Error('\'credentials\' cannot be null.');
    }

    if (!options) {
      options = {};
    }
    const defaultUserAgent = getDefaultUserAgentValue();
    options.userAgentOptions = {
      userAgentPrefix: `${packageName}/${packageVersion} ${defaultUserAgent} ${options.userAgentOptions?.userAgentPrefix || ''}`
    };

    super(options);

    this.endpoint = options.endpoint || this.endpoint || "https://token.botframework.com";
    this.credentials = credentials;

  }
}
