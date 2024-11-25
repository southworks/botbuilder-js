/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { RequestOptionsBase } from "../../utils";
import { createSerializer, OperationSpec, RawResponseCallback } from '@azure/core-client';
import * as Models from '../models';
import * as Mappers from '../models/userTokenMappers';
import * as Parameters from '../models/parameters';
import { TokenApiClientContext } from '../tokenApiClientContext';
import { TokenExchangeRequest, TokenResponse, TokenStatus } from 'botframework-schema';

/** Class representing a UserToken. */
export class UserToken {
    private readonly client: TokenApiClientContext;

    /**
     * Create a UserToken.
     *
     * @param {TokenApiClientContext} client Reference to the service client.
     */
    constructor(client: TokenApiClientContext) {
        this.client = client;
    }

    /**
     * @param userId
     * @param connectionName
     * @param [options] The optional parameters
     * @returns Promise<Models.UserTokenGetTokenResponse>
     */
    getToken(
        userId: string,
        connectionName: string,
        options?: Models.UserTokenGetTokenOptionalParams
    ): Promise<Models.UserTokenGetTokenResponse>;
    /**
     * @param userId
     * @param connectionName
     * @param callback The callback
     */
    getToken(userId: string, connectionName: string, callback: RawResponseCallback): void;
    /**
     * @param userId
     * @param connectionName
     * @param options The optional parameters
     * @param callback The callback
     */
    getToken(
        userId: string,
        connectionName: string,
        options: Models.UserTokenGetTokenOptionalParams,
        callback: RawResponseCallback
    ): void;
    getToken(
        userId: string,
        connectionName: string,
        options?: Models.UserTokenGetTokenOptionalParams | RawResponseCallback,
        callback?: RawResponseCallback
    ): Promise<Models.UserTokenGetTokenResponse> {
        if (typeof options === 'function') {
            const onResponse = options;
            options = {
                onResponse
            }
        } else if (options) {
            options.onResponse = callback;
        }

        return this.client.sendOperationRequest(
            {
                userId,
                connectionName,
                options,
            },
            getTokenOperationSpec
        ) as Promise<Models.UserTokenGetTokenResponse>;
    }

    /**
     * @param userId
     * @param connectionName
     * @param aadResourceUrls
     * @param [options] The optional parameters
     * @returns Promise<Models.UserTokenGetAadTokensResponse>
     */
    getAadTokens(
        userId: string,
        connectionName: string,
        aadResourceUrls: Models.AadResourceUrls,
        options?: Models.UserTokenGetAadTokensOptionalParams
    ): Promise<Models.UserTokenGetAadTokensResponse>;
    /**
     * @param userId
     * @param connectionName
     * @param aadResourceUrls
     * @param callback The callback
     */
    getAadTokens(
        userId: string,
        connectionName: string,
        aadResourceUrls: Models.AadResourceUrls,
        callback: RawResponseCallback
    ): void;
    /**
     * @param userId
     * @param connectionName
     * @param aadResourceUrls
     * @param options The optional parameters
     * @param callback The callback
     */
    getAadTokens(
        userId: string,
        connectionName: string,
        aadResourceUrls: Models.AadResourceUrls,
        options: Models.UserTokenGetAadTokensOptionalParams,
        callback: RawResponseCallback
    ): void;
    getAadTokens(
        userId: string,
        connectionName: string,
        aadResourceUrls: Models.AadResourceUrls,
        options?:
            | Models.UserTokenGetAadTokensOptionalParams
            | RawResponseCallback,
        callback?: RawResponseCallback
    ): Promise<Models.UserTokenGetAadTokensResponse> {
        if (typeof options === 'function') {
            const onResponse = options;
            options = {
                onResponse
            }
        } else if (options) {
            options.onResponse = callback;
        }

        return this.client.sendOperationRequest(
            {
                userId,
                connectionName,
                aadResourceUrls,
                options,
            },
            getAadTokensOperationSpec
        ) as Promise<Models.UserTokenGetAadTokensResponse>;
    }

    /**
     * @param userId
     * @param [options] The optional parameters
     * @returns Promise<Models.UserTokenSignOutResponse>
     */
    signOut(userId: string, options?: Models.UserTokenSignOutOptionalParams): Promise<Models.UserTokenSignOutResponse>;
    /**
     * @param userId
     * @param callback The callback
     */
    signOut(userId: string, callback: RawResponseCallback): void;
    /**
     * @param userId
     * @param options The optional parameters
     * @param callback The callback
     */
    signOut(
        userId: string,
        options: Models.UserTokenSignOutOptionalParams,
        callback: RawResponseCallback
    ): void;
    signOut(
        userId: string,
        options?: Models.UserTokenSignOutOptionalParams | RawResponseCallback,
        callback?: RawResponseCallback
    ): Promise<Models.UserTokenSignOutResponse> {
        if (typeof options === 'function') {
            const onResponse = options;
            options = {
                onResponse
            }
        } else if (options) {
            options.onResponse = callback;
        }

        return this.client.sendOperationRequest(
            {
                userId,
                options,
            },
            signOutOperationSpec
        ) as Promise<Models.UserTokenSignOutResponse>;
    }

    /**
     * @param userId
     * @param [options] The optional parameters
     * @returns Promise<Models.UserTokenGetTokenStatusResponse>
     */
    getTokenStatus(
        userId: string,
        options?: Models.UserTokenGetTokenStatusOptionalParams
    ): Promise<Models.UserTokenGetTokenStatusResponse>;
    /**
     * @param userId
     * @param callback The callback
     */
    getTokenStatus(userId: string, callback: RawResponseCallback): void;
    /**
     * @param userId
     * @param options The optional parameters
     * @param callback The callback
     */
    getTokenStatus(
        userId: string,
        options: Models.UserTokenGetTokenStatusOptionalParams,
        callback: RawResponseCallback
    ): void;
    getTokenStatus(
        userId: string,
        options?: Models.UserTokenGetTokenStatusOptionalParams | RawResponseCallback,
        callback?: RawResponseCallback
    ): Promise<Models.UserTokenGetTokenStatusResponse> {
        if (typeof options === 'function') {
            const onResponse = options;
            options = {
                onResponse
            }
        } else if (options) {
            options.onResponse = callback;
        }

        return this.client.sendOperationRequest(
            {
                userId,
                options,
            },
            getTokenStatusOperationSpec
        ) as Promise<Models.UserTokenGetTokenStatusResponse>;
    }

    /**
     * @param userId
     * @param connectionName
     * @param channelId
     * @param exchangeRequest
     * @param [options] The optional parameters
     * @returns Promise<Models.UserTokenExchangeAsyncResponse>
     */
    exchangeAsync(
        userId: string,
        connectionName: string,
        channelId: string,
        exchangeRequest: TokenExchangeRequest,
        options?: RequestOptionsBase
    ): Promise<Models.UserTokenExchangeAsyncResponse>;
    /**
     * @param userId
     * @param connectionName
     * @param channelId
     * @param exchangeRequest
     * @param callback The callback
     */
    exchangeAsync(
        userId: string,
        connectionName: string,
        channelId: string,
        exchangeRequest: TokenExchangeRequest,
        callback: RawResponseCallback
    ): void;
    /**
     * @param userId
     * @param connectionName
     * @param channelId
     * @param exchangeRequest
     * @param options The optional parameters
     * @param callback The callback
     */
    exchangeAsync(
        userId: string,
        connectionName: string,
        channelId: string,
        exchangeRequest: TokenExchangeRequest,
        options: RequestOptionsBase,
        callback: RawResponseCallback
    ): void;
    exchangeAsync(
        userId: string,
        connectionName: string,
        channelId: string,
        exchangeRequest: TokenExchangeRequest,
        options?: RequestOptionsBase | RawResponseCallback,
        callback?: RawResponseCallback
    ): Promise<Models.UserTokenExchangeAsyncResponse> {
        if (typeof options === 'function') {
            const onResponse = options;
            options = {
                onResponse
            }
        } else if (options) {
            options.onResponse = callback;
        }

        return this.client.sendOperationRequest(
            {
                userId,
                connectionName,
                channelId,
                exchangeRequest,
                options,
            },
            exchangeAsyncOperationSpec
        ) as Promise<Models.UserTokenExchangeAsyncResponse>;
    }
}

// Operation Specifications
const serializer = createSerializer(Mappers);
const getTokenOperationSpec: OperationSpec = {
    httpMethod: 'GET',
    path: 'api/usertoken/GetToken',
    queryParameters: [Parameters.userId, Parameters.connectionName0, Parameters.channelId0, Parameters.code],
    responses: {
        200: {
            bodyMapper: Mappers.TokenResponse,
        },
        404: {
            bodyMapper: Mappers.TokenResponse,
        },
        default: {
            bodyMapper: Mappers.ErrorResponse,
        },
    },
    serializer,
};

const getAadTokensOperationSpec: OperationSpec = {
    httpMethod: 'POST',
    path: 'api/usertoken/GetAadTokens',
    queryParameters: [Parameters.userId, Parameters.connectionName0, Parameters.channelId0],
    requestBody: {
        parameterPath: 'aadResourceUrls',
        mapper: {
            ...Mappers.AadResourceUrls,
            required: true,
        },
    },
    responses: {
        200: {
            bodyMapper: {
                serializedName: 'parsedResponse',
                type: {
                    name: 'Dictionary',
                    value: {
                        type: {
                            name: 'Composite',
                            className: 'TokenResponse',
                        },
                    },
                },
            },
        },
        default: {
            bodyMapper: Mappers.ErrorResponse,
        },
    },
    serializer,
};

const signOutOperationSpec: OperationSpec = {
    httpMethod: 'DELETE',
    path: 'api/usertoken/SignOut',
    queryParameters: [Parameters.userId, Parameters.connectionName1, Parameters.channelId0],
    responses: {
        200: {
            bodyMapper: {
                serializedName: 'parsedResponse',
                type: {
                    name: 'Object',
                },
            },
        },
        204: {},
        default: {
            bodyMapper: Mappers.ErrorResponse,
        },
    },
    serializer,
};

const getTokenStatusOperationSpec: OperationSpec = {
    httpMethod: 'GET',
    path: 'api/usertoken/GetTokenStatus',
    queryParameters: [Parameters.userId, Parameters.channelId0, Parameters.include],
    responses: {
        200: {
            bodyMapper: {
                serializedName: 'parsedResponse',
                type: {
                    name: 'Sequence',
                    element: {
                        type: {
                            name: 'Composite',
                            className: 'TokenStatus',
                        },
                    },
                },
            },
        },
        default: {
            bodyMapper: Mappers.ErrorResponse,
        },
    },
    serializer,
};

const exchangeAsyncOperationSpec: OperationSpec = {
    httpMethod: 'POST',
    path: 'api/usertoken/exchange',
    queryParameters: [Parameters.userId, Parameters.connectionName0, Parameters.channelId1],
    requestBody: {
        parameterPath: 'exchangeRequest',
        mapper: {
            ...Mappers.TokenExchangeRequest,
            required: true,
        },
    },
    responses: {
        200: {
            bodyMapper: Mappers.TokenResponse,
        },
        400: {
            bodyMapper: Mappers.ErrorResponse,
        },
        404: {
            bodyMapper: Mappers.TokenResponse,
        },
        default: {
            bodyMapper: Mappers.ErrorResponse,
        },
    },
    serializer,
};
