/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// Destructuring Assignments only requires the ActivityHandler class.
const { ActivityHandler } = require('botbuilder');

// Define our Bot class extending the ActivityHandler class.
class MyBot extends ActivityHandler {
    constructor(conversationState) {
        super();

        this.conversationState = conversationState;
        this.conversationStateAccessor = this.conversationState.createProperty('test');
        // Register handler that will be executed every time the User sends a message
        this.onMessage(async (context, next) => {
            // Get the conversation context
            var state = await this.conversationStateAccessor.get(context, { count: 0 });

            await context.sendActivity(`you said "${context.activity.text}" ${state.count}`);

            state.count++;
            await this.conversationState.saveChanges(context, false);

            await next();
        });
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(`welcome ${membersAdded[cnt].name}`);
                }
            }
            await next();
        });
    }
}

exports.MyBot = MyBot;