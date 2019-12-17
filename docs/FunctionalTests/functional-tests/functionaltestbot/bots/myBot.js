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
        // Create a new property in the ConversationState databag to persist data between the conversation turns
        this.conversationStateAccessor = this.conversationState.createProperty('test');
    
        // Register handler that will be executed every time the User sends a message
        this.onMessage(async (context, next) => {
            // Get the current state of the conversation
            var state = await this.conversationStateAccessor.get(context, { count: 0 });
    
            // Answer the user with an echo message and the turn count
            await context.sendActivity(`you said "${context.activity.text}" ${state.count}`);
    
            // Increment the turn counter
            state.count++;
    
            // Persist the conversation data state
            await this.conversationState.saveChanges(context, false);
    
            // Release the conversation workflow
            await next();
        });
    
        // Register handler that will be executed every time a new member is added to the conversation
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    // Iterate through the list of added members and greet them by it's name
                    await context.sendActivity(`welcome ${membersAdded[cnt].name}`);
                }
            }
            await next();
        });
    }
}

exports.MyBot = MyBot;