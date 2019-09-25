const assert = require('assert');
const customBotframeworkConnector = require('../lib');

const userId = 'UK8CH2281:TKGSUQHQE';
const baseUri = 'https://api.botframework.com';
const authAppId = '2cd87869-38a0-4182-9251-d056e8f0ac24';
const authAppPassword = '2.30Vs3VQLKt974F';
const userAgent = 'Microsoft-BotFramework/3.1 BotBuilder/4.1.6 (Node.js,Version=v12.6.0; Windows_NT 10.0.17763; x64)';
var mock = false;


// Do not upload the following vars
const trueUserId = process.env['TRUE_USER_ID'];
const wrongUserId = process.env['WRONG_USER_ID'];
const appId = process.env['APP_ID'];
const appPassword = process.env['APP_PASSWORD'];



describe('CustomConnector getToken', function() {

    it('should throw expected 401 error message.', function(done) {
            
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(authAppId, authAppPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        let options = {
            channelId: 'emulator'
        };

        customClient.userToken.getToken(userId, 'authname', options)
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
            channelId: 'emulator'
        };

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.getToken(wrongUserId, 'authname', options)
            .then((response) => {
                assert(response._response.status === 404);
                done();
            }).catch((onreject) => {
                done(onreject.message);
            });
    
    });

    it('should throw expected 200 message.', function(done) {
        
        let options = {
            channelId: 'emulator'
        };

        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );
        
        customClient.userToken.getToken(trueUserId, 'authname', options)
            .then((response) => {
                assert(response._response.status === 200);
                done();
            });
    
    });

});