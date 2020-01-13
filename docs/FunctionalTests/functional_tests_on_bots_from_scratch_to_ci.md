# Bot Functional Test - From Scratch to CI

## Introduction

This article walks you through making and developing functional tests for bots from scratch to CI.

We will be covering the basics of making a simple echo bot to test, write functional tests using [Mocha](https://mochajs.org/) and create an [Azure CI](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops) to Deploy the bot and running tests.

At the end, you will learn how to:

- Create a test bot
- Create a functional test using [Mocha](https://mochajs.org/) as a test suite
- Set up an [Azure CI](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops) for Deploying a bot and running the functional tests

## Create a test bot

### Prerequisites

- [Visual Studio Code](https://www.visualstudio.com/downloads)
- [Node.js](https://nodejs.org/)
- [Bot Framework Emulator](https://aka.ms/bot-framework-emulator-readme)

To create your test bot and initialize its packages.

1.  Create the next directory for your functional test project.

   ```
   bot-functional-test
   └───test-bot
   ```

2. Add the next files to the `test-bot` folder.

   **package.json**

   ```json
   {
     "name": "test-bot",
     "version": "1.0.0",
     "description": "a test bot for functional tests",
     "main": "index.js",
     "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     "author": "",
     "license": "MIT",
     "dependencies": {
       "botbuilder": "^4.1.6",
       "restify": "^8.3.0",
       "dotenv": "^6.1.0"
     }
   }
   ```

   **bot.js**

   ```javascript
   // Copyright (c) Microsoft Corporation. All rights reserved.
   // Licensed under the MIT License.
   
   const { ActivityHandler, MessageFactory } = require('botbuilder');
   
   class TestBot extends ActivityHandler {
       constructor() {
           super();
           // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
           this.onMessage(async (context, next) => {
               const replyText = `Echo: ${ context.activity.text }`;
               await context.sendActivity(MessageFactory.text(replyText, replyText));
               // By calling next() you ensure that the next BotHandler is run.
               await next();
           });
   
           this.onMembersAdded(async (context, next) => {
               const membersAdded = context.activity.membersAdded;
               const welcomeText = 'Hello and welcome!';
               for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                   if (membersAdded[cnt].id !== context.activity.recipient.id) {
                       await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                   }
               }
               // By calling next() you ensure that the next BotHandler is run.
               await next();
           });
       }
   }
   
   module.exports.TestBot = TestBot;
   
   ```

   **index.js**

   ```javascript
   // Copyright (c) Microsoft Corporation. All rights reserved.
   // Licensed under the MIT License.
   
   const dotenv = require('dotenv');
   const path = require('path');
   const restify = require('restify');
   
   // Import required bot services.
   // See https://aka.ms/bot-services to learn more about the different parts of a bot.
   const { BotFrameworkAdapter } = require('botbuilder');
   
   // This bot's main dialog.
   const { TestBot } = require('./bot');
   
   // Import required bot configuration.
   const ENV_FILE = path.join(__dirname, '.env');
   dotenv.config({ path: ENV_FILE });
   
   // Create HTTP server
   const server = restify.createServer();
   server.listen(process.env.port || process.env.PORT || 3978, () => {
       console.log(`\n${ server.name } listening to ${ server.url }`);
       console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
       console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
   });
   
   // Create adapter.
   // See https://aka.ms/about-bot-adapter to learn more about how bots work.
   const adapter = new BotFrameworkAdapter({
       appId: process.env.MicrosoftAppId,
       appPassword: process.env.MicrosoftAppPassword
   });
   
   // Catch-all for errors.
   const onTurnErrorHandler = async (context, error) => {
       // This check writes out errors to console log .vs. app insights.
       // NOTE: In production environment, you should consider logging this to Azure
       //       application insights.
       console.error(`\n [onTurnError] unhandled error: ${ error }`);
   
       // Send a trace activity, which will be displayed in Bot Framework Emulator
       await context.sendTraceActivity(
           'OnTurnError Trace',
           `${ error }`,
           'https://www.botframework.com/schemas/error',
           'TurnError'
       );
   
       // Send a message to the user
       await context.sendActivity('The bot encountered an error or bug.');
       await context.sendActivity('To continue to run this bot, please fix the bot source code.');
   };
   
   // Set the onTurnError for the singleton BotFrameworkAdapter.
   adapter.onTurnError = onTurnErrorHandler;
   
   // Create the main dialog.
   const myBot = new TestBot();
   
   // Listen for incoming requests.
   server.post('/api/messages', (req, res) => {
       adapter.processActivity(req, res, async (context) => {
           // Route to main dialog.
           await myBot.run(context);
       });
   });
   
   ```

3. Install the node modules, open a terminal and run the next command in the test-bot folder.

   ```bash
   npm install
   ```

4. Start and test the bot.

   Open a terminal in the directory where you created the index.js file, and start it with the next command.

   ```bash
   node index.js
   ```

   Then, start the [Bot Framework Emulator](https://aka.ms/bot-framework-emulator-readme) and click on the **Open bot** button. 
   
   Add the route of the bot endpoint `http://localhost:3978/api/messages` and click on **Connect**.
   
   Once connected, the bot will send you a welcome message.

    ![alt text](https://github.com/southworks/botbuilder-js/blob/add/deploy-bot-deploy-section/docs/media/bf-emulator-connected.png)



## Create Functional Test

The functional test will consist of three parts:

One, create a DirectLine client to connect the test with the bot using the [swagger-client](https://www.npmjs.com/package/swagger-client) package.

Two, use the client to create a conversation then, send a message and retrieve the bot response. 

Three, make the assertion of the bot message.

To create the functional test

1. Add the next files in the root of the project folder.

   **package.json**

   ```json
   {
     "name": "functional-tests",
     "version": "1.0.0",
     "description": "Test that hits services",
     "main": "",
     "dependencies": {
       "mocha": "^7.0.0",
       "swagger-client": "^2.1.18"
     },
     "directories": {
       "test-bot": "test-bot"
     },
     "scripts": {},
     "keywords": [],
     "author": "",
     "license": "MIT"
   }
   ```

   **directline-swagger.json**

   Find the Direct Line API definition in the functional test folder from the **BotBuilder-JS** repository. [Here](https://github.com/microsoft/botbuilder-js/blob/master/libraries/functional-tests/tests/directline-swagger.json) 

   **functional.test.js**

   ``````javascript
   /**
    * Copyright (c) Microsoft Corporation. All rights reserved.
    * Licensed under the MIT License.
    */
   
   const assert = require('assert');
   const directLineSpec = require('./directline-swagger.json');
   const Swagger = require('swagger-client');
   
   const directLineClientName = 'DirectLineClient';
   const userMessage = 'Contoso';
   const directLineSecret = process.env.DIRECT_LINE_KEY || null;
   
   const auths = {
       AuthorizationBotConnector: new Swagger.ApiKeyAuthorization('Authorization', 'BotConnector ' + directLineSecret, 'header'),
   };
   
   function getDirectLineClient() {    
       return new Swagger({
           spec: directLineSpec,
           usePromise: true,
           authorizations: auths
       });
   }
   
   async function sendMessage(client, conversationId) {       
       let status;
       do{
           await client.Conversations.Conversations_PostMessage({
               conversationId: conversationId,
               message: {
                   from: directLineClientName,
                   text: userMessage
               }
           }).then((result) => {
               status = result.status;
           }).catch((err)=>{
               status = err.status;
           }); 
       }while(status == 502);
   }
   
   function getMessages(client, conversationId) {    
       let watermark = null;
       return client.Conversations.Conversations_GetMessages({ conversationId: conversationId, watermark: watermark })
           .then((response) => {            
               return response.obj.messages.filter((message) => message.from !== directLineClientName);       
           });
   }
   
   function getConversationId(client) {
       return client.Conversations.Conversations_NewConversation()
           .then((response) => response.obj.conversationId);
   }
   
   describe('Test Azure Bot', function(){
       this.timeout(60000);    
       it('Check deployed bot answer', async function(){
           const directLineClient = await getDirectLineClient();    
           const conversationId = await getConversationId(directLineClient);
           await sendMessage(directLineClient, conversationId);
           const messages = await getMessages(directLineClient, conversationId);
           const result = messages.filter((message) => message.text.includes('You said'));                
           assert(result[0].text == `You said: "${ userMessage }"`, `test fail`);
       });
   });
   
   ``````



As you can see in the test code.

```javascript
const directLineSecret = process.env.DIRECT_LINE_KEY || null;
```

To run the test, you will need a `directLineSecret` value, which is a token used for the bot connector authorization schema to make requests to the bot.

To get this value you will need that your bot is been deployed in Azure and have a [DirectLine Channel](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-directline?view=azure-bot-service-4.0) configured.

The test gets the value from the process environment variables as it will be running in an [Azure DevOps pipeline](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops).