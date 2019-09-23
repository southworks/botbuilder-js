const BotConnector = require('../lib');
const CustomConnectorClient = require('../lib/customConnectorApi').CustomConnectorClient;
const CustomCredentials = require('../lib/auth').CustomMicrosoftAppCredentials;
const CustomJwtTokenValidation = require('../lib/auth').CustomJwtTokenValidation;
const JwtTokenValidation = require('../lib/auth').JwtTokenValidation;
const assert = require('assert');

// AppId, Password, Client (telegram, slack, msteams, etc) to test
const appId = process.env['USER_ID'] || '';
const appPassword = process.env['CLIENT_SECRET'] || '';
const basePath = 'https://slack.botframework.com';

// Create client with new implementation
const customCredentials = new CustomCredentials(appId, appPassword);
const customClient = new CustomConnectorClient(customCredentials, { baseUri: basePath });

// Create client with old implementation
const oldCredentials = new BotConnector.MicrosoftAppCredentials(appId, appPassword);
const oldClient = new BotConnector.ConnectorClient(oldCredentials, { baseUri: basePath });

const user = {
    id: 'UK8CH2281:TKGSUQHQE',
};
const bot = {
    id: 'BKGSYSTFG:TKGSUQHQE',
};

var createConversationParmans = () => ({
    members: [user],
    bot: bot
});

var createActivity = () => ({
    type: 'message',
    text: 'test activity',
    recipient: user,
    from: bot
});


describe('Bot Framework Connector SDK', function() {
    this.timeout(100000);
    describe('Custom SendToConversation', function() {

        beforeEach(function() {
            // Add slack as a new  thrusted service URL into the connector clients. 
            
            return new Promise(async function(resolve) {
                const simpleCredentials = new BotConnector.SimpleCredentialProvider(appId, '');

                // OLD Implementation  
                const oldHeader = `Bearer ${await oldCredentials.getToken(true)}`;
                await JwtTokenValidation.authenticateRequest({ serviceUrl: 'https://slack.botframework.com' }, oldHeader, simpleCredentials, undefined);

                // CUSTOM Implementation
                const customHeader = `Bearer ${await customCredentials.getToken(true)}`;
                await CustomJwtTokenValidation.authenticateRequest({ serviceUrl: 'https://slack.botframework.com' }, customHeader, simpleCredentials, undefined);
                resolve();
            });
        });

        it('should return a valid activityId', async function() {
            return new Promise(async function(resolve) {
                var params = createConversationParmans();

                await oldClient.conversations.createConversation(params)
                    .then((result) => oldClient.conversations.sendToConversation(result.id, createActivity()))
                    .then((result) => {
                        assert(!!result.id);
                        actual = result;
                    });


                await customClient.conversations.createConversation(params)
                    .then((result) => customClient.conversations.sendToConversation(result.id, createActivity()))
                    .then((result) => {
                        assert(!!result.id);
                        expected = result;
                    });

                resolve();
            });
        });

        it('should return a valid activityId with Teams activity', function() {
            return new Promise(async function(resolve) {
                var params = createConversationParmans();
                var activity = createActivity();
                activity.entities = [
                    {
                        type: 'mention',
                        text: `<at>User1</at>`,
                        mentioned: {
                            name: 'User1',
                            id: `${user.id}_1`
                        }
                    },
                    {
                        type: 'mention',
                        text: `<at>User2</at>`,
                        mentioned: {
                            name: 'User2',
                            id: `${user.id}_2`
                        }
                    }
                ];

                await oldClient.conversations.createConversation(params)
                    .then((result) => oldClient.conversations.sendToConversation(result.id, createActivity()))
                    .then((result) => {
                        assert(!!result.id);
                        actual = result;
                    });


                await customClient.conversations.createConversation(params)
                    .then((result) => customClient.conversations.sendToConversation(result.id, createActivity()))
                    .then((result) => {
                        assert(!!result.id);
                        expected = result;
                    });

                resolve();
            });
        });

        it('should fail with invalid conversationId', function() {
            return new Promise(async function(resolve) {
                var params = createConversationParmans();

                await oldClient.conversations.createConversation(params)
                    .then((result) => oldClient.conversations.sendToConversation(result.id.concat('M'), createActivity()))
                    .then(() => {
                        assert.fail();
                    }).catch((error) => {
                        assert(error.code);
                        assert(error.message);
                    })


                await customClient.conversations.createConversation(params)
                    .then((result) => customClient.conversations.sendToConversation(result.id.concat('M'), createActivity()))
                    .then(() => {
                        assert.fail();
                    }).catch((error) => {
                        assert(error.code);
                        assert(error.message);
                    })


                resolve();
            });
        });

        it('should send a Hero card', function() {
            return new Promise(async function(resolve) {
                var params = createConversationParmans();
                var activity = createActivity();
                activity.attachments = [
                    {
                        contentType: 'application/vnd.microsoft.card.hero',
                        content: {
                            title: 'A static image',
                            subtitle: 'JPEG image',
                            images: [
                                { url: 'https://docs.microsoft.com/en-us/bot-framework/media/designing-bots/core/dialogs-screens.png' }
                            ]
                        }
                    }
                ];

                await oldClient.conversations.createConversation(params)
                    .then((result) => oldClient.conversations.sendToConversation(result.id, activity))
                    .then((result) => {
                        assert(!!result.id);
                    });

                await customClient.conversations.createConversation(params)
                    .then((result) => customClient.conversations.sendToConversation(result.id, activity))
                    .then((result) => {
                        assert(!!result.id);
                    });

                resolve();
            });
        });
    });
});