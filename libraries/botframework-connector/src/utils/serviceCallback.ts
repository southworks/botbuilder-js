import { RestError } from '@azure/core-rest-pipeline';
import { WebResourceLike, CompatResponse } from '@azure/core-http-compat';

/**
 * Service callback that is returned for REST requests initiated by the service client.
 */
export interface ServiceCallback<TResult> {
    /**
     * A method that will be invoked as a callback to a service function.
     * @param err - The error occurred if any, while executing the request; otherwise null.
     * @param result - The deserialized response body if an error did not occur.
     * @param request - The raw/actual request sent to the server if an error did not occur.
     * @param response - The raw/actual response from the server if an error did not occur.
     */
    (
      err: Error | RestError | null,
      result?: TResult,
      request?: WebResourceLike,
      response?: CompatResponse
    ): void;
  }
