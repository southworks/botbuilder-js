/*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License. See License.txt in the project root for
* license information.
*/

/*
* WORKING WITH THESE TESTS
*   To run mocked and without recording:
*    1. Supply .env with:
*       * NOCK_OFF=false
*
*   To run live or unmocked:
*    1. Supply .env with (all must be valid): 
*       * CLIENT_ID (appID)
*       * CLIENT_SECRET (appPass)
*       * USER_ID (from Slack)
*       * BOT_ID (from slack)
*       * AZURE_SUBSCRIPTION_ID
*       * NOCK_OFF=true 
*    2. Ensure appId has Slack channel enabled and you've installed the bot in Slack
*
*   To re-record:
*    1. All from live/unmocked, except NOCK_OFF=false and AZURE_NOCK_RECORD=true
*    2. GetAttachment should work fine, provided SuiteBase appropriately replaces the encoded stream with fs.createReadStream('tests/bot-framework.png')
*       * You shouldn't need to adjust/change anything unless the test image or path changes.
*
*   Notes: tokenApiClient.userToken.get*Token has to be mocked/stubbed because the bot can't be logged in to create a valid token
*/
require('dotenv').config({ path: 'tests/.env' });
const fs = require('fs');
const assert = require('assert');
const SuiteBase = require('../../../tools/framework/suite-base');
const should = require('should');
const BotConnector = require('../lib');

const ConnectorClient = BotConnector.ConnectorClient;
const TokenApiClient = BotConnector.TokenApiClient;
const Credentials = BotConnector.MicrosoftAppCredentials;

const clientId = process.env['CLIENT_ID'];
const clientSecret = process.env['CLIENT_SECRET'];
const hostURL = process.env['HOST_URL'] || 'https://slack.botframework.com';
const testPrefix = 'botFramework-connector-tests';
const libraryPath = 'botframework-connector';

var requiredEnvironment = [
    'USER_ID',
    'BOT_ID',
    'HOST_URL'
];
const user = {
    id: process.env['USER_ID'] || 'UK8CH2281:TKGSUQHQE'
};
const bot = {
    id: process.env['BOT_ID'] || 'BKGSYSTFG:TKGSUQHQE'
};

var suite;
var credentials;
var client;
var tokenApiClient;

var createActivity = () => ({
    type: 'message',
    text: 'test activity',
    recipient: user,
    from: bot
});

var createConversation = () => ({
    members: [ user ],
    bot: bot
});

var createAttachment = () => ({
    name: 'bot-framework.png',
    type: 'image/png',
    originalBase64: base64Encode(__dirname + '/bot-framework.png')
});

var readStreamToBuffer = function(stream, callback) {
    var buffer = [];
    stream.on('data', d => buffer.push(d));
    stream.on('end', () => callback(null, buffer.join('')));
    stream.on('error', (err) => callback(err, null));
};

// function to encode file data to base64 encoded string
function base64Encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap);
}

describe('Bot Framework Connector SDK', function() {
    before(function(done) {
        suite = new SuiteBase(this, testPrefix, requiredEnvironment, libraryPath);
        suite.setupSuite(function() {
            credentials = new BotConnector.MicrosoftAppCredentials(clientId, clientSecret);
            client = new ConnectorClient(credentials, { baseUri: hostURL });
            tokenApiClient = new TokenApiClient(credentials, { baseUri: 'https://token.botframework.com' });
        });
        Credentials.trustServiceUrl(hostURL);
        Credentials.trustServiceUrl('https://token.botframework.com');
        done();
    });
	
    after(function(done) {
        suite.teardownSuite(done);
    });
	
    beforeEach(function(done) {
        suite.setupTest(done);
    });
	
    afterEach(function(done) {
        suite.baseTeardownTest(done);
    });
	
    describe('Conversations', function() {
        describe('CreateConversation', function() {
            it('should return a valid conversation ID', function(done) {
                var params = createConversation();
                params.activity = createActivity();
				
                client.conversations.createConversation(params)
                    .then((result) => assert(!!result.id))
                    .then(done, done);
            });
            
            it('should fail with invalid bot', function(done) {
                var params = createConversation();
                params.bot = { id: 'invalid-id' };
        
                client.conversations.createConversation(params).then((result) => {
                    assert(!!result.error.code);
                    assert(!!result.error.message);
                }).then(done, done);
            });
            it('should fail without members', function(done) {
                var params = createConversation();
                params.members = [];
				
                client.conversations.createConversation(params).then((result) => {
                    assert(!!result.error.code);
                    assert(!!result.error.message);
                }).then(done, done);
            });
            it('should fail with bot member', function(done) {
                var params = createConversation();
                params.members = [ bot ];
				
                client.conversations.createConversation(params).then((result) => {
                    assert(!!result.error.code);
                    assert(!!result.error.message);
                }).then(done, done);
            });
        });
		
        describe('GetConversationMembers', function() {
            it('should have the userId', function(done) {
                var params = createConversation();
				
                client.conversations.createConversation(params)
                    .then((result) => client.conversations.getConversationMembers(result.id))
                    .then((result) => {
                        result.should.matchAny((member) => member.id === user.id);
                    })
                    .then(done, done);
            });
            it('should fail with invalid conversationId', function(done) {
                var params = createConversation();
				
                client.conversations.createConversation(params)
                    .then((result) => client.conversations.getConversationMembers(result.id.concat('M')))
                    .then((result) => {
                        assert(!!result.error.code);
                        assert(!!result.error.message);
                    }).then(done, done);
            });
        });
		
        describe('SendToConversation', function() {
            it('should return a valid activityId', function(done) {
                var params = createConversation();
				
                client.conversations.createConversation(params)
                    .then((result) => client.conversations.sendToConversation(result.id, createActivity()))
                    .then((result) => {
                        assert(!!result.id);
                    })
                    .then(done, done);
            });
            it('should return a valid activityId with Teams activity', function(done) {
                var params = createConversation();
                var activity = createActivity();
                activity.entities = [
                    {
                        type: 'mention',
                        text: `<at>User1</at>`,
                        mentioned: {
                            name: 'User1',
                            id: `${ user.id }_1`
                        }
                    },
                    {
                        type: 'mention',
                        text: `<at>User2</at>`,
                        mentioned: {
                            name: 'User2',
                            id: `${ user.id }_2`
                        }
                    }
                ];
				
                client.conversations.createConversation(params)
                    .then((result) => client.conversations.sendToConversation(result.id, activity))
                    .then((result) => {
                        assert(!!result.id);
                    })
                    .then(done, done);
            });
            it('should fail with invalid conversationId', function(done) {
                var params = createConversation();
				
                client.conversations.createConversation(params)
                    .then((result) => client.conversations.sendToConversation(result.id.concat('M'), createActivity()))
                    .then((result) => {
                        assert(!!result.error.code);
                        assert(!!result.error.message);
                    }).then(done, done);
            });
            it('should send a Hero card', function(done) {
                var params = createConversation();
                var activity = createActivity();
                activity.attachments = [
                    {
                        contentType: 'application/vnd.microsoft.card.hero',
                        content: {
                            title: 'A static image',
                            subtitle: 'JPEG image',
                            images: [
                                { url: 'https://docs.microsoft.com/en-us/bot-framework/media/designing-bots/core/dialogs-screens.png'}
                            ]
                        }
                    }
                ];
				
                client.conversations.createConversation(params)
                    .then((result) => client.conversations.sendToConversation(result.id, activity))
                    .then((result) => {
                        assert(!!result.id);
                    })
                    .then(done, done);
            });
        });
		
        describe('GetActivityMembers', function() {
            it('should have the userId', function(done) {
                var params = createConversation();
                params.activity = createActivity();
				
                client.conversations.createConversation(params)
                    .then((result) => client.conversations.getActivityMembers(result.id, result.activityId))
                    .then((result) => {
                        result.should.matchAny((member) => member.id === user.id);
                    })
                    .then(done, done);
            });
            it('should fail with invalid conversatoinId', function(done) {
                var params = createConversation();
                params.activity = createActivity();
				
                client.conversations.createConversation(params)
                    .then((result) => client.conversations.getActivityMembers(result.id.concat('M'), result.activityId))
                    .then((result) => {
                        assert(!!result.error.code);
                        assert(!!result.error.message);
                    }).then(done, done);
            });
        });
		
        describe('ReplyToActivity', function() {
            it('should return a valid activityId', function(done) {
                var params = createConversation();
                var reply = createActivity();
                reply.text = 'reply';
				
                var conversationId = '';
				
                client.conversations.createConversation(params)
                    .then((result) => {
                        conversationId = result.id;
                        return client.conversations.sendToConversation(result.id, createActivity());
                    })
                    .then((result) => client.conversations.replyToActivity(conversationId, result.id, reply))
                    .then((result) => {
                        assert(!!result.id);
                    })
                    .then(done, done);
            });
            it('should fail with invalid conversationId', function(done) {
                client.conversations.createConversation(createConversation())
                    .then((result) => client.conversations.sendToConversation(result.id, createActivity()))
                    .then((result) => client.conversations.replyToActivity('invalid-id', result.id, createActivity()))
                    .then((result) => {
                        assert(!!result.error.code);
                        assert(!!result.error.message);
                    }).then(done, done);
            });
			
        });
		
        describe('DeleteActivity', function() {
            it('should delete the activity', function(done) {
                var conversation = createConversation();
                conversation.activity = createActivity();
                client.conversations.createConversation(conversation)
                    .then((result) => client.conversations.deleteActivity(result.id, result.activityId))
                    .then(ok => done(), done);
            });
            it('should fail with invalid conversationId', function(done) {
                client.conversations.createConversation(createConversation())
                    .then((result) => client.conversations.sendToConversation(result.id, createActivity()))
                    .then((result) => client.conversations.deleteActivity('invalid-id', result.id))
                    .then((result) => {
                        assert(!!result.error.code);
                        assert(!!result.error.message);
                    }).then(done, done);
            });
			
        });
		
        describe('UpdateActivity', function() {
            it('should return a valid activityId', function(done) {
                var conversationId = '';
                var updatedActivity = createActivity();
                updatedActivity.text = 'updated activity';
				
                client.conversations.createConversation(createConversation())
                    .then((result) => {
                        conversationId = result.id;
                        return client.conversations.sendToConversation(result.id, createActivity());
                    })
                    .then((result) => {
                        updatedActivity.id = result.id;
                        return client.conversations.updateActivity(conversationId, result.id, updatedActivity);
                    })
                    .then((result) => {
                        assert(!!result.id);
                    })
                    .then(done, done);
            });
            it('should fail with invalid conversationId', function(done) {
                client.conversations.createConversation(createConversation())
                    .then((result) => client.conversations.sendToConversation(result.id, createActivity()))
                    .then((result) => client.conversations.updateActivity('invalid-id', result.id, createActivity()))
                    .then((result) => {
                        assert(!!result.error.code);
                        assert(!!result.error.message);
                    }).then(done, done);
            });
			
        });
		
        describe('UploadAttachment', function() {
            it('should return a valid attachmentId', function(done) {
                client.conversations.createConversation(createConversation())
                    .then((result) => client.conversations.uploadAttachment(result.id, createAttachment()))
                    .then((result) => {
                        assert(!!result.id);
                    })
                    .then(done, done);
            });
			
        });
		
    });
	
    describe('Attachments', function() {
        describe('GetAttachmentInfo', function() {
            it('should return a valid attachmentId', function(done) {
                var attachment = createAttachment();
                client.conversations.createConversation(createConversation())
                    .then((result) => { return client.conversations.uploadAttachment(result.id, attachment); })
                    .then((result) => { return client.attachments.getAttachmentInfo(result.id); })
                    .then((result) => {
                        result.name.should.be.exactly(attachment.name);
                    })
                    .then(done, done);
            });
			
        });
		
        describe('GetAttachment', function() {
            it('should return valid attachment', function(done) {
                var attachment = createAttachment();
                var attachmentId = '';
                client.conversations.createConversation(createConversation())
                    .then((result) => {
                        return client.conversations.uploadAttachment(result.id, attachment);
                    })
                    .then((result) => {
                        attachmentId = result.id;
                        return client.attachments.getAttachmentInfo(result.id);
                    })
                    .then((result) => {
                        return client.attachments.getAttachment(attachmentId, result.views[0].viewId);
                    })
                    .then((result) => {
                        return readStreamToBuffer(result._response.readableStreamBody, (err, buffer) => {
                            buffer.toString().should.be.exactly(attachment.originalBase64.toString());
                        });
                    })
                    .then(done, done);
            });
        });
    });
});
