/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ServiceClient, ServiceClientOptions } from "@azure/core-client";
import { getDefaultUserAgentValue } from "../utils/userAgent";
import * as Models from "./models";
import { TokenCredential } from "@azure/identity";

const packageName = "botframework-connector";
const packageVersion = "4.0.0";

export class ConnectorClientContext extends ServiceClient {
  credentials: TokenCredential;
  endpoint: string;

  /**
   * Initializes a new instance of the ConnectorClientContext class.
   * @param credentials Subscription credentials which uniquely identify client subscription.
   * @param endpoint Subscription endpoint
   * @param [options] The parameter options
   */
  constructor(credentials: TokenCredential, options?: ServiceClientOptions) {
    if (credentials === null || credentials === undefined) {
      throw new Error('\'credentials\' cannot be null.');
    }

    if (!options) {
      // NOTE: autogen creates a {} which is invalid, it needs to be cast
      options = {} as ServiceClientOptions;
    }
    // TODO  This is to workaround fact that AddUserAgent() was removed.  
    const defaultUserAgent = getDefaultUserAgentValue();
//    options.userAgent = `${packageName}/${packageVersion} ${defaultUserAgent} ${options.userAgent || ''}`;

    super(options);

    this.endpoint = options.endpoint || this.endpoint || "https://api.botframework.com";
    this.credentials = credentials;

  }
}
