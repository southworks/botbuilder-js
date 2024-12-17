// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './interfaces';

export {
    WebResourceLike,
    CompatResponse as HttpOperationResponse,
    RequestPolicy as HttpClient,
    toHttpHeadersLike,
} from '@azure/core-http-compat';
export { ProxySettings, userAgentPolicy, createHttpHeaders } from '@azure/core-rest-pipeline';
export { TokenCredential, isTokenCredential } from '@azure/core-auth';
export {
    createSerializer,
    OperationURLParameter,
    OperationQueryParameter,
    OperationSpec,
    CompositeMapper,
} from '@azure/core-client';

// Can't access the HttpHeaders from the @azure/core-http-compat package directly because it is not defined in the package.json 'exports' property.
export {
    toPipelineRequest,
    toWebResourceLike,
    HttpHeaders,
} from '../../node_modules/@azure/core-http-compat/dist/commonjs/util';
export { toCompatResponse } from '../../node_modules/@azure/core-http-compat/dist/commonjs/response';

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
