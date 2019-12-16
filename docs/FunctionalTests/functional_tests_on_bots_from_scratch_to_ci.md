# Functional tests on Bots - From Scratch to CI

## Introduction and setup environment

In this article we will be making a walkthrough over the making and development of Functional tests using Mocha and make a simple bot to test using the [Bot Framework SDK v4 for Javascript](https://github.com/microsoft/botbuilder-js/).

This guide aims to go through the basics of making functional tests from scratch using [Mocha](https://mochajs.org/) as the test suite and the [Bot Service DirectLine channel](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-directline?view=azure-bot-service-4.0) as our client interface. Additionally, you will have a better understanding of how is the workflow behind the functional tests library included in the Bot Framework SDK v4 for Javascript.

You can download the project files used in this article in the [project_files folder](https://github.com/microsoft/botbuilder-js/tree/master/libraries/functional-tests) included within this article's directory.

### Setup environment

To start, bring up a new terminal. We're going to start by initializing a new NPM project. Run `npm init --yes`, the `--yes` argument is *optional* if you want to automatically skips the metadata prompts.

The next step is to install the required dependencies by running `npm i mocha swagger-client --save-dev` at the root directory of your project.

Now that we have the root test suite dependencies installed, let's create a new folder for our Bot named `functionaltestbot` (Feel free to use the name of your desire, just remember to replace `functionaltestbot` with the name that you've chosen).

In the terminal, let's make our way to the new folder and run `cd functionaltestbot`. Then again we will run `npm init --yes` to initialize the new NPM project. 

When NPM finishes creating the new project, let's run the command `npm botbuilder restify dotenv --save` since we are going to use the [Bot Builder for Node.js](https://www.npmjs.com/package/botbuilder) package to build our Bot, [Restify](https://www.npmjs.com/package/restify) to make a REST API and expose our Bot logic and [Dotenv](https://www.npmjs.com/package/dotenv) that will allow us to store values in a local `.env` file that will be loaded as environment variables in our Bot.

Now we have all the dependencies will need to start making our Test-driven Bot and its functional tests suite.

### Create test bot using the Bot Framework SDK v4 for JavaScript

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

Let's add a constructor with the variable `conversationState` as parameter [To be continued ...]

```javascript
// TODO: Comment briefly the logic for each activity event handler registered
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
```