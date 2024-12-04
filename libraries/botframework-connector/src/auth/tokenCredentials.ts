// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { WebResourceLike } from '@azure/core-http-compat';
import { HttpHeaders } from '../../node_modules/@azure/core-http-compat/dist/commonjs/util';
import { ServiceClientCredentials } from '../utils';

const AUTHORIZATION_HEADER = 'Authorization';
const DEFAULT_AUTHORIZATION_SCHEME = 'Bearer';

/**
 * A credentials object that uses a token string and a authorzation scheme to authenticate.
 */
export class TokenCredentials implements ServiceClientCredentials {
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
    signRequest(webResource: WebResourceLike): Promise<WebResourceLike> {
        if (!webResource.headers) webResource.headers = new HttpHeaders();
        webResource.headers.set(AUTHORIZATION_HEADER, `${this.authorizationScheme} ${this.token}`);
        return Promise.resolve(webResource);
    }
}
