import { deserializationPolicy, ServiceClientOptions } from "@azure/core-client";
import {
  CompatResponse,
  ExtendedServiceClient,
  RequestPolicyFactory,
  WebResourceLike
} from "@azure/core-http-compat";
import {
  PipelineRequest,
  exponentialRetryPolicy,
  logPolicy,
  proxyPolicy,
  redirectPolicy,
  systemErrorRetryPolicy,
  throttlingRetryPolicy,
  defaultRetryPolicy,
  createPipelineFromOptions,
  Pipeline,
  PipelineResponse,
  SendRequest,
  PipelinePolicy
} from "@azure/core-rest-pipeline";
import { logger } from "@azure/identity";
import * as Models from "./models";
import { getDefaultUserAgentValue, ServiceClientCredentials } from "../utils";

const packageName = "botframework-connector";
const packageVersion = "4.0.0";

export class ConnectorClientContext extends ExtendedServiceClient {
  credentials: ServiceClientCredentials;
  _requestPolicyFactories: Pipeline;
  endpoint: string;
  /**
     * If specified, this is the base URI that requests will be made against for this ServiceClient.
     * If it is not specified, then all OperationSpecs must contain a baseUrl property.
     */
  protected baseUri?: string;

  /**
   * Initializes a new instance of the ConnectorClientContext class.
   * @param credentials Subscription credentials which uniquely identify client subscription.
   * @param [options] The parameter options
   */
  constructor(credentials: ServiceClientCredentials, options?: Models.ConnectorClientOptions) {
    if (credentials === null || credentials === undefined) {
      throw new Error("'credentials' cannot be null.");
    }

    if (!options) {
      options = {} as Models.ConnectorClientOptions;
    }

    const defaultUserAgent = getDefaultUserAgentValue();
    options.userAgentOptions = {
      userAgentPrefix: `${packageName}/${packageVersion} ${defaultUserAgent} ${options.userAgentOptions?.userAgentPrefix || ''}`
    };

    // Pass the pipeline to the ExtendedServiceClient constructor
    super(options);

    this.baseUri = options.baseUri || this.baseUri || "https://api.botframework.com";
    this.credentials = credentials;
    this._requestPolicyFactories = this.createPipeline(credentials, options);
  }

  /**
   * Create a custom pipeline to add policies
   */
  createPipeline(credentials: ServiceClientCredentials, options: Models.ConnectorClientOptions): Pipeline {
    const pipeline = createPipelineFromOptions(options);

    const policies = options?.requestPolicyFactories?.getOrderedPolicies() ?? [];
    const pipelinePolicies = pipeline.getOrderedPolicies();
    for (const policy of policies) {
      const exist = pipelinePolicies.find(pipelinePolicy => pipelinePolicy.name == policy.name)
      if (!exist) {
        pipeline.addPolicy(policy)
      }
    }

    const authorizationHeader: PipelinePolicy = {
      name: "authorizationHeaderPolicy",
      sendRequest: async (request: PipelineRequest, next: SendRequest): Promise<PipelineResponse> => {
        const authHeader = "Bearer";
        request.headers.set("Authorization", `Bearer ${authHeader}`);
        return next(request);
      },
    };

    pipeline.addPolicy(authorizationHeader);

    return pipeline;
  }
}
