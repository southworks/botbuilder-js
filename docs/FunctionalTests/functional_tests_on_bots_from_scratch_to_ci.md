# Bot Functional Test - From Scratch to CI

## Introduction

This article walks you through making and development functional test for bots testing from the scratch to CI.

We will be covering the basics of making a simple echo bot to test, write functional tests using [Mocha](https://mochajs.org/) and create an Azure CI to Deploy the bot and running tests.

At the end, you will learn how to:

- Create a basic Echo bot
- Create a functional tests using Mocha as test suite
- Set up an Azure CI for Deploying a bot and running functional the functional tests

You can download the project files used in this article in the [project_files folder](https://github.com/microsoft/botbuilder-js/tree/master/libraries/functional-tests) included within this article's directory.

## Create a test bot

### Prerequisites

- [Visual Studio Code](https://www.visualstudio.com/downloads)
- [Node.js](https://nodejs.org/)
- [Bot Framework Emulator](https://aka.ms/bot-framework-emulator-readme)
- Knowledge of restify and asynchronous programming in JavaScript

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

To do this we will use Restify to make functional endpoints and expose our Bot.

Let's get out of the Bot folder and create a file named index.js in the root of the functional-test-bot project and add the next code.

```javascript
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Import required packages
const restify = require('restify');
const path = require('path');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
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


### Start and test your bot

Open a terminal or command prompt in the directory where you created the index.js file, and start it with `node index.js`. At this point, your bot is running locally.

Then, start the Bot Framework Emulator and click on the Open bot button, Add the route of the bot endpoint running locally and connect. 

Once connected, the bot will send you a welcome message.


## Deploy your bot

### Prerequisites
- Azure subscription to [Microsoft Azure](https://azure.microsoft.com/free/)
- Lastest version of the [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)

### Prepare for deployment

To deploy your bot, you need to put the bot code into a zip file then deploy to azure using the CLI's commands.

Before compress your bot code, you need to configure the project be able to run the bot when deployed to Azure.

In the test bot folder run the next command:
`az bot prepare-deploy --code-dir "." --lang Javascript``
This command will fetch a web.config which is needed for Node.js apps to work with IIS on Azure App Services.

Then, create a new file without name with the next extension `.deployment` and add the next logic to it.

```
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

With this file when deploy your bot's code, Web App/Kudu's behavior is as follows:

Kudu adds an additional build steps during deployment, such as npm install.

Finally, Zip up the test bot code without the node_modules folder.

#### Deploy code to Azure

1. Login to Azure
Once you have prepared the bot code to deploy. Open a command terminal to log in to the Azure Portal usinf the ClI's commands

run `az login` A browser window will open, allowing you to sign in.

2. Set the Subscription ID
`az account set --subscription "<azure-subscription>"`

3. Create Resource Group
`az group create --name "<test-bot-name>" --location "Regions"`




