// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { createHttpHeaders } from '@azure/core-rest-pipeline';
import { TokenCredential } from '@azure/identity';
import { WebResourceLike } from '@azure/core-http-compat';

const AuthorizationHeader = "Authorization";
const DEFAULT_AUTHORIZATION_SCHEME = 'Bearer';

/**
 * A credentials object that uses a token string and a authorzation scheme to authenticate.
 */
export class TokenCredentials implements TokenCredential {
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
     * @param {WebResourceLike} webResource The WebResourceLike to be signed.
     * @returns {Promise<WebResourceLike>} The signed request object.
     */
    signRequest(webResource: WebResourceLike) {
        if (!webResource.headers) webResource.headers = createHttpHeaders();
        webResource.headers.set(AuthorizationHeader, `${this.authorizationScheme} ${this.token}`);
        return Promise.resolve(webResource);
    }
}
