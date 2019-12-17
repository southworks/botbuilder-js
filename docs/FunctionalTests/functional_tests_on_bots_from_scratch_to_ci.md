# Functional tests on Bots - From Scratch to CI

## Introduction

In this article we will be making a walkthrough over the making and development of Functional tests using Mocha and make a simple bot to test using the [Bot Framework SDK v4 for Javascript](https://github.com/microsoft/botbuilder-js/).

This guide aims to go through the basics of making functional tests from scratch using [Mocha](https://mochajs.org/) as the test suite and the [Bot Service DirectLine channel](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-directline?view=azure-bot-service-4.0) as our client interface. Additionally, you will have a better understanding of how is the workflow behind the functional tests library included in the Bot Framework SDK v4 for Javascript.

You can download the project files used in this article in the [project_files folder](https://github.com/microsoft/botbuilder-js/tree/master/libraries/functional-tests) included within this article's directory.

## Setting up the development environment

To start, bring up a new terminal. We're going to start by initializing a new NPM project. Run `npm init --yes`, the `--yes` argument is *optional* if you want to automatically skips the metadata prompts.

The next step is to install the required dependencies by running `npm i mocha swagger-client --save-dev` at the root directory of your project.

Now that we have the root test suite dependencies installed, let's create a new folder for our Bot named `functionaltestbot` (Feel free to use the name of your desire, just remember to replace `functionaltestbot` with the name that you've chosen).

In the terminal, let's make our way to the new folder and run `cd functionaltestbot`. Then again we will run `npm init --yes` to initialize the new NPM project. 

When NPM finishes creating the new project, let's run the command `npm botbuilder restify dotenv --save` since we are going to use the [Bot Builder for Node.js](https://www.npmjs.com/package/botbuilder) package to build our Bot, [Restify](https://www.npmjs.com/package/restify) to make a REST API and expose our Bot logic and [Dotenv](https://www.npmjs.com/package/dotenv) that will allow us to store values in a local `.env` file that will be loaded as environment variables in our Bot.

Now we have all the dependencies will need to start making our Test-driven Bot and its functional tests suite.

## Create test bot using the Bot Framework SDK v4 for JavaScript

To write functional tests and make end-to-end testing first we need a Bot, (I know. I became Captain Obvious). If you already have a Bot built or you wish to skip this step you can get the test Bot used in this guide inside the [functionaltestbot](./functional-tests/functionaltestbot/) folder.

Since we already have our dependencies installed, let's start right away by firstly creating a folder named `bots`, then create a JS file named `myBot.js` and open it in your desired code editor or IDE.

Lets start by adding a `require` of the `botbuilder` package and import only the `ActivityHandler` with [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring). 

Then we will define a new class extending `ActivityHandler` and export our Bot by using the [Node's exports module shorcut](https://nodejs.org/api/modules.html#modules_exports_shortcut). You should have something like this:

```javascript
// Require only the ActivityHandler class by using Destructuring Assignments.
const { ActivityHandler } = require('botbuilder');

// Define our Bot class extending the ActivityHandler class.
class MyBot extends ActivityHandler {
}

// Export our class using Node's exports moodule shorcut.
exports.MyBot = MyBot;

```

Now we need to define our Bot behavior logic using the constructor and registering the actions the Bot will make whenever an User interaction takes place.

For ease of reading, the following code block contains comments explaining step by step the workflow that the Bot follows for each activity handler.

Let's add a constructor with the parameter `conversationState` that the SDK will inject with the data state associated with the current conversation.

```javascript
// TODO: Comment briefly the logic for each activity event handler registered
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

        // Release the conversation workflow
        await next();
    });
}
```

With that in place we have a working Bot logic that is able to greet users that join the conversation and echoes back every message sent by an user.

Even though the Bot has functional logic, we still don't have the Bot with an API with exposed endpoints for a client.

To do this we will use Restify to make functional endpoints and expose our Bot [TO BE CONTINUED]

```javascript
const restify = require('restify');
const path = require('path');

const { BotFrameworkAdapter, MemoryStorage, UserState, ConversationState, InspectionState, InspectionMiddleware } = require('botbuilder');
const { MyBot } = require('./bots/myBot')

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

var memoryStorage = new MemoryStorage();
var inspectionState = new InspectionState(memoryStorage);

var userState = new UserState(memoryStorage);
var conversationState = new ConversationState(memoryStorage);

adapter.use(new InspectionMiddleware(inspectionState, userState, conversationState, { appId: process.env.MicrosoftAppId, appPassword: process.env.MicrosoftAppPassword }));

adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError]: ${ error }`);
    await context.sendActivity(`Oops. Something went wrong!`);
};

var bot = new MyBot(conversationState);

console.log('welcome to test bot - a local test tool for working with the emulator');

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`\n${ server.name } listening to ${ server.url }`);
});

server.post('/api/mybot', (req, res) => {
    adapter.processActivity(req, res, async (turnContext) => {
        await bot.run(turnContext);
    });
});

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (turnContext) => {
        await bot.run(turnContext);
    });
});
```
