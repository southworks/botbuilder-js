const assert = require('assert');
const customBotframeworkConnector = require('../lib');

const userId = 'UK8CH2281:TKGSUQHQE';
const baseUri = 'https://api.botframework.com';
const authAppId = '2cd87869-38a0-4182-9251-d056e8f0ac24';
const authAppPassword = '2.30Vs3VQLKt974F';
const userAgent = 'Microsoft-BotFramework/3.1 BotBuilder/4.1.6 (Node.js,Version=v12.6.0; Windows_NT 10.0.17763; x64)';
var mock = false;
const trueUserId = process.env['TRUE_USER_ID'];
const wrongUserId = process.env['WRONG_USER_ID'];
const appId = process.env['APP_ID'];
const appPassword = process.env['APP_PASSWORD'];
const connectionName = 'authname';
const channelId = 'emulator';

var createConversation = () => ({
    members: [ user ],
    bot: bot
});

const user = {
    id: process.env['USER_ID'] || 'UK8CH2281:TKGSUQHQE'
};
const bot = {
    id: process.env['BOT_ID'] || 'BKGSYSTFG:TKGSUQHQE'
};


describe('CustomConnector getToken', function() {

    it('should throw expected 401 error message.', function(done) {
            
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(authAppId, authAppPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        let options = {
            headers: {
                'Authorization': `Bearer FakeToken`
            },
            channelId: channelId
        };

        customClient.userToken.getToken(userId, connectionName, options)
            .then((response) => {
                assert(response._response.status === 401);
                done();
            }).catch((onreject) => {
                done(onreject.message);
            });
    
    });

    it('should throw expected 404 error message.', function(done) {
        this.timeout(100000);
        
        let options = {
            channelId: channelId
        };

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.getToken(wrongUserId, connectionName, options)
            .then((response) => {
                assert(response._response.status === 404);
                done();
            }).catch((onreject) => {
                done(onreject.message);
            });
    
    });

    it('should throw expected 200 message.', function(done) {
        
        let options = {
            channelId: channelId
        };

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );
        
        customClient.userToken.getToken(trueUserId, connectionName, options)
            .then((response) => {
                assert(response._response.status === 200);
                done();
            });
    });

    it('should throw on null userId', function(done) {

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.getToken(null, 'mockConnection')
            .then((result) => {
                assert.fail();
            }, (error) => {
                assert(!!error.message);
            }).then(done, done);
    });

    it('should throw on null connectionName', function(done) {

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.getToken(trueUserId, null)
            .then((result) => {
                assert.fail();
            }, (error) => {
                assert(!!error.message);
            }).then(done, done);
    });
    
    it('should return null on invalid connection string', function(done) {

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.getToken(trueUserId, 'invalid')
            .then((result) => {
                assert.equal(result.token, null);
                done();
            });
    });
    
    //We don't know which variables are valid to test this method. The API has no documentation. 404
    it('should return token with no magic code', function(done) {

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.getToken(trueUserId, connectionName, { code: null })
            .then((result) => {
                assert(result.channelId);
                assert(result.connectionName);
                assert(result.token);
                assert(result.expiration);
                done();
            });
    });

});

describe('CustomConnector signOut', function() {

    it('should throw expected 401 error message.', function(done) {
            
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(authAppId, authAppPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        let options = {
            headers: {
                'Authorization': `Bearer FakeToken`
            },
            channelId: channelId,
            connectionName : connectionName
        };

        customClient.userToken.signOut(userId, options)
            .then((response) => {
                assert(response._response.status === 401);
                done();
            }).catch((onreject) => {
                done(onreject.message);
            });
    
    });

    it('should throw expected 200 message.', function(done) {
        
        let options = {
            channelId: channelId,
            connectionName : connectionName
        };

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );
        
        customClient.userToken.signOut(trueUserId, options)
            .then((response) => {
                assert(response._response.status === 200);
                done();
            });
    
    });

    it('should throw on null userId', function(done) {
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.signOut(null)
            .then((result) => {
                assert.fail();
            }, (error) => {
                assert(!!error.message);
            }).then(done, done);
    });


    //Proof again when we change the deserialize method. 
    //Response 200 description not response body.
    it('should return a response', function(done) {

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri } );

        customClient.userToken.signOut(trueUserId)
            .then((result) => {
                assert(result._response);
                assert.equal(result._response.status, 200);
                done();
            });
    });

});

describe('getAadTokens', function() {
    it('should throw on null userId', function(done) {

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(authAppId, authAppPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.getAadTokens(null, 'mockConnection', { resourceUrls: ['http://localhost' ]})
            .then((result) => {
                assert.fail();
            }, (error) => {
                assert(!!error.message);
            }).then(done, done);
    });
    it('should throw on null connectionName', function(done) {
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(authAppId, authAppPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.getAadTokens(trueUserId, null, { resourceUrls: ['http://localhost' ]})
            .then((result) => {
                assert.fail();
            }, (error) => {
                assert(!!error.message);
            }).then(done, done);
    });

    //We don't know which variables are valid to test this method. The API has no documentation. 404
    it('should return token', function(done) {

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri } );

        customClient.userToken.getAadTokens(trueUserId, connectionName, { resourceUrls: [baseUri]})
            .then((result) => {
                assert(result.channelId);
                assert(result.connectionName);
                assert(result.token);
                assert(result.expiration);
                done();
            });
    });
    
});

describe('getTokenStatus', function() {
    it('should throw on null userId', function(done) {
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri } );

        customClient.userToken.getTokenStatus(null)
            .then((result) => {
                assert.fail();
            }, (error) => {
                assert(!!error.message);
            }).then(done, done);
    });

    //We don't know which variables are valid to test this method. The API has no documentation. to get values like channel id, is needed to change in
    // the deserializeResponse method on userTokenapi the json to text, it returns a TokenStatus with undefined objects. 200
    it('should return token', function(done) {
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri } );

        customClient.userToken.getTokenStatus(trueUserId)
            .then((result) => {
                assert(result[0].connectionName);
                assert.notEqual(result[0].hasToken, null);
                assert(result[0].serviceProviderDisplayName);
                done();
            });
    });
});

describe('botSignIn', function() {

    //To make this test pass the signature of getSignInUrl was changed, adding a empty object as initializer of options variable in null cases.
    it('should return a valid sign in url', function(done) {
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri} );

        const urlRegex = /https:\/\/token.botframework.com\/api\/oauth\/signin\?signin=.*/i;
        var conversation = createConversation();
        conversation.user = user;
        const state = {
            ConnectionName: 'github',
            Conversation: conversation,
            MsAppId: appId
        };
        const finalState = Buffer.from(JSON.stringify(state)).toString('base64');
        customClient.botSignIn.getSignInUrl(finalState)
            .then((result) => {
                assert.equal(result._response.status, 200);
                assert(result._response.bodyAsText.match(urlRegex));
                done();
            }, (error) => {
                assert.fail(error);
            });              
    });
});

describe('customTokenApiClient Construction', function() {
    it('should not throw on http url', function(done) {
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        var client = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, {
            baseUri: 'http://localhost'
        });
        assert(client);
        done();
    });
    it('should throw on null credentials', function(done) {
        try {
            var client = new customBotframeworkConnector.CustomTokenApiClient(null, {
                baseUri: 'http://localhost'
            });
            assert.fail();
        } catch (err) {
            assert(!!err.message);
        }
        done();
    });
});