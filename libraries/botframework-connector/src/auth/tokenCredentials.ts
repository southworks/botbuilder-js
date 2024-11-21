// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { createHttpHeaders, PipelineRequest } from '@azure/core-rest-pipeline';

const AuthorizationHeader = "Authorization";
const DEFAULT_AUTHORIZATION_SCHEME = 'Bearer';

/**
 * A credentials object that uses a token string and a authorzation scheme to authenticate.
 */
export class TokenCredentials {
    token: string;
    authorizationScheme: string = DEFAULT_AUTHORIZATION_SCHEME;

    /**
     * Creates a new TokenCredentials object.
     *
     * @class
     * @param {string} token The token.
     * @param {string} [authorizationScheme] The authorization scheme.
     */
    constructor(token: string, authorizationScheme: string = DEFAULT_AUTHORIZATION_SCHEME) {
        if (!token) {
            throw new Error('token cannot be null or undefined.');
        }
        this.token = token;
        this.authorizationScheme = authorizationScheme;
    }

    /**
     * Signs a request with the Authentication header.
     *
     * @param {PipelineRequest} webResource The Request to be signed.
     * @returns {Promise<PipelineRequest>} The signed request object.
     */
    signRequest(webResource: PipelineRequest) {
        if (!webResource.headers) webResource.headers = createHttpHeaders();
        webResource.headers.set(AuthorizationHeader, `${this.authorizationScheme} ${this.token}`);
        return Promise.resolve(webResource);
    }
}
