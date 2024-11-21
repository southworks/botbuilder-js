/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ServiceClient, ServiceClientOptions } from "@azure/core-client";
import { getDefaultUserAgentValue, ServiceClientCredentials } from "../utils";
import * as Models from "./models";

const packageName = "botframework-connector";
const packageVersion = "4.0.0";

export class ConnectorClientContext extends ServiceClient {
  credentials: ServiceClientCredentials;
  endpoint: string;

  /**
   * Initializes a new instance of the ConnectorClientContext class.
   * @param credentials Subscription credentials which uniquely identify client subscription.
   * @param endpoint Subscription endpoint
   * @param [options] The parameter options
   */
  constructor(credentials: ServiceClientCredentials, options?: ServiceClientOptions) {
    if (credentials === null || credentials === undefined) {
      throw new Error('\'credentials\' cannot be null.');
    }

    if (!options) {
      // NOTE: autogen creates a {} which is invalid, it needs to be cast
      options = {} as ServiceClientOptions;
    }

    const defaultUserAgent = getDefaultUserAgentValue();
    options.userAgentOptions = {
      userAgentPrefix: `${packageName}/${packageVersion} ${defaultUserAgent} ${options.userAgentOptions?.userAgentPrefix || ''}`
    };

    super(options);

    this.endpoint = options.endpoint || this.endpoint || "https://api.botframework.com";
    this.credentials = credentials;

  }
}
