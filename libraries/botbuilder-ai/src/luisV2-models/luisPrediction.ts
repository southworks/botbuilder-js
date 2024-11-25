/**
 * @module botbuilder-ai
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { OperationSpec, createSerializer, RawResponseCallback } from '@azure/core-client';
import { LUISRuntimeClientContext } from '../luisRuntimeClientContext';
import { LuisResult, PredictionResolveOptionalParams, PredictionResolveResponse } from './luisResult';
import * as Parameters from './luisParameters';
import * as Mappers from './luisMappers';

/** Class representing a Prediction. */
export class LuisPrediction {
    private readonly client: LUISRuntimeClientContext;

    /**
     * Create a Prediction.
     *
     * @param {LUISRuntimeClientContext} client Reference to the service client.
     */
    constructor(client: LUISRuntimeClientContext) {
        this.client = client;
    }

    /**
     * Gets predictions for a given utterance, in the form of intents and entities. The current maximum
     * query size is 500 characters.
     *
     * @param appId The LUIS application ID (Guid).
     * @param query The utterance to predict.
     * @param [options] The optional parameters
     * @returns Promise<Models.PredictionResolveResponse>
     */
    resolve(
        appId: string,
        query: string,
        options?: PredictionResolveOptionalParams
    ): Promise<PredictionResolveResponse>;
    /**
     * @param appId The LUIS application ID (Guid).
     * @param query The utterance to predict.
     * @param callback The callback
     */
    resolve(appId: string, query: string, callback: RawResponseCallback): void;
    /**
     * @param appId The LUIS application ID (Guid).
     * @param query The utterance to predict.
     * @param options The optional parameters
     * @param callback The callback
     */
    resolve(
        appId: string,
        query: string,
        options: PredictionResolveOptionalParams,
        callback: RawResponseCallback
    ): void;
    /**
     * @param appId The LUIS application ID (Guid).
     * @param query The utterance to predict.
     * @param options The optional parameters.
     * @param callback The callback.
     * @returns Promise<Models.PredictionResolveResponse>.
     */
    resolve(
        appId: string,
        query: string,
        options?: PredictionResolveOptionalParams | RawResponseCallback,
        callback?: RawResponseCallback
    ): Promise<PredictionResolveResponse> {
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
                appId,
                query,
                options,
            },
            resolveOperationSpec
        ) as Promise<PredictionResolveResponse>;
    }
}

// Operation Specifications
const serializer = createSerializer(Mappers);
const resolveOperationSpec: OperationSpec = {
    httpMethod: 'POST',
    path: 'apps/{appId}',
    urlParameters: [Parameters.endpoint, Parameters.appId],
    queryParameters: [
        Parameters.timezoneOffset,
        Parameters.verbose,
        Parameters.staging,
        Parameters.spellCheck,
        Parameters.bingSpellCheckSubscriptionKey,
        Parameters.log,
    ],
    requestBody: {
        parameterPath: 'query',
        mapper: {
            required: true,
            serializedName: 'query',
            constraints: {
                MaxLength: 500,
            },
            type: {
                name: 'String',
            },
        },
    },
    responses: {
        200: {
            bodyMapper: Mappers.LuisResult,
        },
        default: {
            bodyMapper: Mappers.APIError,
        },
    },
    serializer,
};
