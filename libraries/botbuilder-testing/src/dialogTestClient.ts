/**
 * @module botbuilder-testing
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Activity, TestAdapter, Middleware, ConversationState, MemoryStorage, AutoSaveStateMiddleware, TurnContext } from 'botbuilder-core';
import { Dialog, DialogContext, DialogSet, DialogTurnStatus, DialogTurnResult } from 'botbuilder-dialogs';

/**
 * A client for testing dialogs in isolation.
 */
export class DialogTestClient {

    private readonly _callback: (turnContext: TurnContext) => Promise<void>;
    private _dialogContext: DialogContext = null;
    private readonly _testAdapter: TestAdapter;

    /**
     * A DialogTurnResult instance with the result of the last turn.
     */
    public dialogTurnResult: DialogTurnResult;

    /**
     * A ConversationState instance for the current test client.
     */
    public conversationState: ConversationState;

    /**
     * Creates a `DialogTestClient` to test a dialog without having to create a full-fledged adapter.
     * ```javascript
     * let client = new DialogTestClient('test', MY_DIALOG, MY_OPTIONS);
     * let reply = await client.sendActivity('first message');
     * assert.strictEqual(reply.text, 'first reply', 'reply failed');
     * ```
     * @param channelId The channelId to be used for the test.
	 * Use 'emulator' or 'test' if you are uncertain of the channel you are targeting.
	 * Otherwise, it is recommended that you use the id for the channel(s) your bot will be using and write a test case for each channel.
     * @param testAdapter A list of middlewares to be added to the test adapter.
     * @param targetDialog The dialog to be tested. This will be the root dialog for the test client.
     * @param initialDialogOptions Optional. Additional argument(s) to pass to the dialog being started.
     * @param middlewares Optional. The test adapter to use. If this parameter is not provided, the test client will use a default TestAdapter.
     * @param conversationState Optional. A ConversationState instance to use in the test client.
     */
    public constructor(channelId: string, targetDialog: Dialog, initialDialogOptions?: any, middlewares?: Middleware[], conversationState?: ConversationState);
    /**
     * Creates a `DialogTestClient` to test a dialog without having to create a full-fledged adapter.
     * ```javascript
     * let client = new DialogTestClient(MY_DIALOG, MY_OPTIONS);
     * let reply = await client.sendActivity('first message');
     * assert.strictEqual(reply.text, 'first reply', 'reply failed');
     * ```
     * @param testAdapter A list of middlewares to be added to the test adapter.
     * @param targetDialog The dialog to be tested. This will be the root dialog for the test client.
     * @param initialDialogOptions Optional. Additional argument(s) to pass to the dialog being started.
     * @param middlewares Optional. The test adapter to use. If this parameter is not provided, the test client will use a default TestAdapter.
     * @param conversationState Optional. A ConversationState instance to use in the test client.
     */
    public constructor(testAdapter: TestAdapter, targetDialog: Dialog, initialDialogOptions?: any, middlewares?: Middleware[], conversationState?: ConversationState)
    /**
     * Creates a `DialogTestClient` to test a dialog without having to create a full-fledged adapter.
     * @param channelOrAdapter The channelId to be used for the test or a list of middlewares to be added to the test adapter.
     * @param targetDialog The dialog to be tested. This will be the root dialog for the test client.
     * @param initialDialogOptions Optional. Additional argument(s) to pass to the dialog being started.
     * @param middlewares Optional. The test adapter to use. If this parameter is not provided, the test client will use a default TestAdapter.
     * @param conversationState Optional. A ConversationState instance to use in the test client.
     */
    public constructor(channelOrAdapter: string|TestAdapter, targetDialog: Dialog, initialDialogOptions?: any, middlewares?: Middleware[], conversationState?: ConversationState) {
        this.conversationState = conversationState || new ConversationState(new MemoryStorage());

        let dialogState = this.conversationState.createProperty('DialogState');

        this._callback = this.getDefaultCallback(targetDialog, initialDialogOptions || null, dialogState);

        if (typeof channelOrAdapter == 'string') {
            const channelIdToUse: string = channelOrAdapter;
            this._testAdapter = new TestAdapter(this._callback, {channelId: channelIdToUse}).use(new AutoSaveStateMiddleware(this.conversationState));
        } else {
            const testAdapterToUse: TestAdapter = channelOrAdapter;
            this._testAdapter = testAdapterToUse;
        }

        this.addUserMiddlewares(middlewares);
    }

    /**
     * Gets a reference for the DialogContext.
     * @remarks
     * This property will be null until at least one activity is sent to DialogTestClient.
     */
    public get dialogContext(): DialogContext {
        return this._dialogContext;
    }

    /**
     * Send an activity into the dialog.
     * @returns a TestFlow that can be used to assert replies etc
     * @param activity an activity potentially with text
     *
     * ```javascript
     * DialogTest.send('hello').assertReply('hello yourself').then(done);
     * ```
     */
    public async sendActivity(activity: Partial<Activity> | string): Promise<any> {
        await this._testAdapter.receiveActivity(activity);
        return this._testAdapter.activityBuffer.shift();
    }

    /**
     * Get the next reply waiting to be delivered (if one exists)
     */
    public getNextReply(): Partial<Activity> {
        return this._testAdapter.activityBuffer.shift();
    }

    /**
     * @private
     */
    private getDefaultCallback(targetDialog: Dialog, initialDialogOptions: any, dialogState: any): (turnContext: TurnContext) => Promise<void> {

        return async (turnContext: TurnContext): Promise<void> => {

            const dialogSet = new DialogSet(dialogState);
            dialogSet.add(targetDialog);

            this._dialogContext = await dialogSet.createContext(turnContext);
            this.dialogTurnResult = await this._dialogContext.continueDialog();
            if (this.dialogTurnResult.status === DialogTurnStatus.empty) {
                this.dialogTurnResult = await this._dialogContext.beginDialog(targetDialog.id, initialDialogOptions);
            }
        };
    }

    /**
     * @private
     */
    private addUserMiddlewares(middlewares: Middleware[]): void {
        if (middlewares != null) {
            middlewares.forEach((middleware): void => {
                this._testAdapter.use(middleware);
            });
        }
    }
}
