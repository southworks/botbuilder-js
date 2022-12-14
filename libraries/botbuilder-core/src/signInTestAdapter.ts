/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { SignInUrlResponse } from 'botframework-schema';
import { TurnContext } from './turnContext';
import { TestAdapter } from './testAdapter';

/**
 * Sign in test adapter used for unit tests. This adapter can be used to simulate sending messages from the
 * user to the bot.
 *
 * @remarks
 * The following example sets up the test adapter and then executes a simple test:
 *
 * ```JavaScript
 * const { TestAdapter } = require('botbuilder');
 *
 * const adapter = new TestAdapter(async (context) => {
 *      await context.sendActivity(`Hello World`);
 * });
 *
 * adapter.test(`hi`, `Hello World`)
 *        .then(() => done());
 * ```
 */
export class SignInTestAdapter extends TestAdapter {
    /**
     * Gets a sign-in resource.
     *
     * @param turnContext [TurnContext](xref:botbuilder-core.TurnContext) for the current turn of conversation with the user.
     * @param connectionName Name of the auth connection to use.
     * @param userId User ID
     * @param finalRedirect Final redirect URL.
     * @returns A `Promise` with a new [SignInUrlResponse](xref:botframework-schema.SignInUrlResponse) object.
     */
    async getSignInResource(
        turnContext: TurnContext,
        connectionName: string,
        userId: string,
        finalRedirect: string = null
    ): Promise<SignInUrlResponse> {
        const result = await super.getSignInResource(turnContext, connectionName, userId, finalRedirect);
        result.tokenPostResource.sasUrl = `https://www.fakesas.com/${connectionName}/${userId}`;
        return result;
    }
}
