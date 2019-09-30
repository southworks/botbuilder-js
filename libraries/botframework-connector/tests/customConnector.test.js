require('dotenv').config({path: __dirname + '/.env'});
const fs = require('fs-extra');
const path = require('path');
const assert = require('assert');
const customBotframeworkConnector = require('../lib');
const { MockMode, usingNock } = require('./mockHelper');
const nock = require('nock');

const channelId = 'emulator';
const fakeUserId = '04cb9d92-5faf-446e-8393-74720c952e22';
const baseUri = 'https://api.botframework.com';
const userAgent = 'Microsoft-BotFramework/3.1 BotBuilder/4.1.6 (Node.js,Version=v12.6.0; Windows_NT 10.0.17763; x64)';
const user = { id: process.env['USER_ID'] || 'UK8CH2281:TKGSUQHQE' };
const bot = { id: process.env['BOT_ID'] || 'BKGSYSTFG:TKGSUQHQE' };

var createConversation = () => ({
    members: [ user ],
    bot: bot
});

/*
** To use this test select one of these modes:
** -MockMode.lockdown to use the test with the mocked files.
** -MockMode.record to use the test normal and record new mock files.
** -MockMode.wild to use the test without mocks and without recording.
*/
const mode = MockMode.lockdown;

// Set up this variables in your .env file
const userId = process.env['USER_ID'];
const appId = process.env['APP_ID'];
const appPassword = process.env['APP_PASSWORD'];
const connectionName = process.env['CONNECTION_NAME'];

let customCredentials = customBotframeworkConnector.CustomMicrosoftAppCredentials;
let customClient = customBotframeworkConnector.CustomTokenApiClient;
let options;

/*
** Steps to obtain a response 200 in getToken method:
** 1.- Run an authentication bot which you could log in with you azure account (https://github.com/southworks/BotBuilder-Samples/tree/master/samples/javascript_nodejs/18.bot-authentication)
** 2.- Open Bot Framework Emulator
** 3.- Interact with you bot and log in
** 4.- Get the user id 
** 5.- Call the method using the id obtained in the last step
*/

describe('Token API tests', async function() {
    before(async function() {
        customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );
        bearerToken = await customCredentials.getToken(true);
        authToken = `Bearer ${ bearerToken }`;
        const custHeader = { 'Authorization': [authToken] };

        options = {
            channelId: channelId,
            headers: custHeader
        };      
    });

    beforeEach(function(done) {
        nock.cleanAll();
        nock.enableNetConnect();
        done();
    });

    describe('CustomConnector getToken', async function() {
        it('should throw on null userId', function(done) {
            customClient.userToken.getToken(null, 'mockConnection')
                .then((result) => {
                    assert.fail();
                }, (error) => {
                    assert(!!error.message);
                }).then(done, done);
        });
    
        it('should throw on null connectionName', function(done) {
            customClient.userToken.getToken(userId, null)
                .then((result) => {
                    assert.fail();
                }, (error) => {
                    assert(!!error.message);
                }).then(done, done);
        });

        it('should throw expected 401 error message.', function() {
            return usingNock(this.test, mode)
                .then(({ nockDone }) => {    
                    let options = {
                        channelId: channelId,
                        headers: { 'Authorization': ['Bearer fakeToken'] }
                    };    
                    return (customClient.userToken.getToken(fakeUserId, connectionName, options))
                        .then((response) => {
                            assert.equal(response._response.status, 401);
                        })
                        .catch((error) => {
                            assert.fail(error.message);
                        })
                        .then(nockDone);
                });    
        });
    
        it('should throw expected 404 error message.', function() {
            this.timeout(100000);
            setHeaderForTest(this.test);
            return usingNock(this.test, mode)
                .then(( {nockDone }) => {                
                    return (customClient.userToken.getToken(fakeUserId, connectionName, options))
                        .then((response) => {
                            assert.equal(response._response.status, 404);                        
                        })
                        .catch((error) => {
                            assert.fail(error.message);
                        })
                        .then(nockDone);
                });    
        });
    
        it('should throw expected 200 message.', async function() {
            setHeaderForTest(this.test);
            return usingNock(this.test, mode)
                .then(async ({ nockDone }) => {                
                    return (customClient.userToken.getToken(userId, connectionName, options))
                        .then((response) => {
                            assert.equal(response._response.status, 200);
                        })
                        .catch((error) => {
                            assert.fail(error.message);
                        })
                        .then(nockDone);
                });    
        });
        
        it('should return null on invalid connection string', function() {
            setHeaderForTest(this.test);
            return usingNock(this.test, mode)
                .then(({ nockDone }) => {
                    return (customClient.userToken.getToken(userId, 'invalid', options))
                        .then((result) => {
                            assert.equal(result.token, null);
                        })
                        .catch((error) => {
                            assert.fail(error.message);
                        })
                        .then(nockDone);
                });
        });
        
        it('should return token with no magic code', function() {
            setHeaderForTest(this.test);
            return usingNock(this.test, mode)
                .then(({ nockDone}) => {
                    let codeOptions = Object.assign({}, options);
                    codeOptions.code = null;
                    return (customClient.userToken.getToken(userId, connectionName, codeOptions))
                        .then((result) => {
                            assert(result.connectionName);
                            assert(result.token);
                        })
                        .then(nockDone);
                });
        });    
    });

    describe('getAadTokens', function() {
        it('should throw on null userId', function(done) {
            customClient.userToken.getAadTokens(null, 'mockConnection', { resourceUrls: [baseUri ]})
                .then((result) => {
                    assert.fail();
                }, (error) => {
                    assert(!!error.message);
                }).then(done, done);
        });
        it('should throw on null connectionName', function(done) {
            customClient.userToken.getAadTokens(userId, null, { resourceUrls: [baseUri ]})
                .then((result) => {
                    assert.fail();
                }, (error) => {
                    assert(!!error.message);
                }).then(done, done);
        });
    
        //We don't know which variables are valid to test this method. The API has no documentation. 404
        xit('should return token', function(done) {
    
            const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
            const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri } );
    
            customClient.userToken.getAadTokens(userId, connectionName, { resourceUrls: [baseUri]})
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
            customClient.userToken.getTokenStatus(null)
                .then((result) => {
                    assert.fail();
                }, (error) => {
                    assert(!!error.message);
                }).then(done, done);
        });
    
        it('should return token', function() {
            setHeaderForTest(this.test);
            return usingNock(this.test, mode)
                .then(({ nockDone }) => {
                    return (customClient.userToken.getTokenStatus(userId, options))
                        .then((result) => {
                            assert(result[0].connectionName);
                            assert.notEqual(result[0].hasToken, null);
                            assert(result[0].serviceProviderDisplayName);
                        })
                        .catch((error) => {
                            assert.fail(error.message);
                        })
                        .then(nockDone);
                });
        });
    });
    
    describe('botSignIn', function() {
        it('should return a valid sign in url', function() {
            setHeaderForTest(this.test);
            return usingNock(this.test, mode)
                .then(({ nockDone }) => {
                    const urlRegex = /https:\/\/token.botframework.com\/api\/oauth\/signin\?signin=.*/i;
                    var conversation = createConversation();
                    conversation.user = user;
                    const state = {
                        ConnectionName: 'github',
                        Conversation: conversation,
                        MsAppId: appId
                    };
                    const finalState = Buffer.from(JSON.stringify(state)).toString('base64');
                    return (customClient.botSignIn.getSignInUrl(finalState, options))
                        .then((result) => {
                            assert.equal(result._response.status, 200);
                            assert(result._response.bodyAsText.match(urlRegex));
                        }, (error) => {
                            assert.fail(error.message);
                        })
                        .then(nockDone);
                });           
        });
    });
    
    describe('customTokenApiClient Construction', function() {
        it('should not throw on http url', function(done) {
            const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
            var client = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, {
                baseUri: baseUri
            });
            assert(client);
            done();
        });
        it('should throw on null credentials', function(done) {
            try {
                var client = new customBotframeworkConnector.CustomTokenApiClient(null, {
                    baseUri: baseUri
                });
                assert.fail();
            } catch (err) {
                assert(!!err.message);
            }
            done();
        });
    });
    
    describe('CustomConnector signOut', function() {
        it('should throw on null userId', function(done) {
            customClient.userToken.signOut(null)
                .then((result) => {
                    assert.fail();
                }, (error) => {
                    assert(!!error.message);
                })
                .then(done);
        });

        it('should throw expected 401 error message.', function() {
            return usingNock(this.test, mode)
                .then(({ nockDone }) => {
                    let options = {
                        headers: { 'Authorization': `Bearer FakeToken` },
                        channelId: channelId,
                        connectionName : connectionName
                    };
                    return (customClient.userToken.signOut(userId, options))
                        .then((response) => {
                            assert.equal(response._response.status, 401);
                        }).catch((error) => {
                            assert.fail(error.message);
                        })
                        .then(nockDone);
                });
        });
    
        it('should throw expected 200 message.', function() {
            setHeaderForTest(this.test);
            return usingNock(this.test, mode)
                .then(({ nockDone }) => {
                    return (customClient.userToken.signOut(userId, options))
                        .then((response) => {
                            assert(result._response);
                            assert.equal(response._response.status, 200);
                        })
                        .catch((error) => {
                            assert.fail(error.message);
                        })
                        .then(nockDone);
                });
        });  
    });
});
   
function setHeaderForTest(test) {
    if(mode === MockMode.lockdown) {
        try {
            const fileLocation = `${ path.join(__dirname, 'TestData', test.parent.title) }\\${ test.title.replace(/ /g, '_') }.json`;
            let file = fs.readFileSync(fileLocation);
            let jsonFile = JSON.parse(file);
            let authToken = jsonFile[0].reqheaders.authorization[0];
            options = {
                channelId: 'emulator',
                headers: { 'Authorization': [authToken] }
            };
        } catch(e) {
            throw new Error('No recorded object has been provided for this test.');
        }        
    }
}