import { WebResourceLike} from '@azure/core-http-compat';
import { TokenCredential, } from '@azure/identity';

/**
 * Represents an object or class with a `signRequest` method which will sign outgoing requests (for example, by setting the `Authorization` header).
 */
export interface ServiceClientCredentials {
    /**
     * @deprecated
     * Signs a request with the Authentication header.
     *
     * @param webResource - The WebResourceLike/request to be signed.
     * @returns The signed request object;
     */
    signRequest(webResource: WebResourceLike): Promise<WebResourceLike>;

    /**
     * Gets an OAuth access token.
     *
     * @param forceRefresh True to force a refresh of the token; or false to get
     * a cached token if it exists.
     * @returns A Promise that represents the work queued to execute.
     * @remarks If the promise is successful, the result contains the access token string.
     */
    getToken(forceRefresh?: boolean): Promise<string>;
}