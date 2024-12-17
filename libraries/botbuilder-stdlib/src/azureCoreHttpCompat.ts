// Can't access the HttpHeaders from the @azure/core-http-compat package directly because it is not defined in the package.json 'exports' property.
import {
    toPipelineRequest,
    toWebResourceLike,
    HttpHeaders,
} from '../node_modules/@azure/core-http-compat/dist/commonjs/util';

import { WebResourceLike, CompatResponse as HttpResponse } from '@azure/core-http-compat';
import { ProxySettings } from '@azure/core-rest-pipeline';
import { TokenCredential, isTokenCredential } from '@azure/core-auth';

/**
 * Represents an object or class with a `signRequest` method which will sign outgoing requests (for example, by setting the `Authorization` header).
 */
export interface ServiceClientCredentials {
    /**
     * Signs a request with the Authentication header.
     *
     * @param webResource - The WebResourceLike/request to be signed.
     * @returns The signed request object;
     */
    signRequest(webResource: WebResourceLike): Promise<WebResourceLike>;
}

/**
 * A set of constants used internally when processing requests.
 */
export const Constants = {
    /**
     * Defines constants for use with HTTP headers.
     */
    HeaderConstants: {
        /**
         * The Authorization header.
         */
        AUTHORIZATION: 'Authorization',
        AUTHORIZATION_SCHEME: 'Bearer',
    },
};

/**
 * The flattened response to a REST call.
 * Contains the underlying {@link HttpOperationResponse} as well as
 * the merged properties of the `parsedBody`, `parsedHeaders`, etc.
 */
export interface RestResponse {
    /**
     * The underlying HTTP response containing both raw and deserialized response data.
     */
    _response: HttpOperationResponse;
    /**
     * The flattened properties described by the `OperationSpec`, deserialized from headers and the HTTP body.
     */
    [key: string]: any;
}

import { createSerializer } from '@azure/core-client';

import {
    RequestOptionsBase,
    ServiceClientOptions,
    ServiceCallback,
    HttpOperationResponse,
    getDefaultUserAgentValue,
    OperationArguments,
} from './utils';
import { CompositeMapper } from '@azure/core-client';
import { OperationURLParameter, OperationQueryParameter, OperationSpec } from '@azure/core-client';

export {
    toPipelineRequest,
    toWebResourceLike,
    WebResourceLike,
    WebResourceLike as WebResource,
    HttpHeaders,
    ProxySettings,
    HttpResponse,
    RequestOptionsBase,
    ServiceClientOptions,
    CompositeMapper,
    OperationURLParameter,
    OperationQueryParameter,
    OperationSpec,
    createSerializer,
    ServiceCallback,
    TokenCredential,
    isTokenCredential,
    getDefaultUserAgentValue,
    OperationArguments,
};
