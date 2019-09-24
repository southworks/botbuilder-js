const assert = require('assert');
const customBotframeworkConnector = require('../lib');
const userId = 'UK8CH2281:TKGSUQHQE';
const baseUri = 'https://api.botframework.com';
const appId = '2cd87869-38a0-4182-9251-d056e8f0ac24';
const appPassword = '2.30Vs3VQLKt974F';
const userAgent = 'Microsoft-BotFramework/3.1 BotBuilder/4.1.6 (Node.js,Version=v12.6.0; Windows_NT 10.0.17763; x64)';

describe('CustomConnector', function() {

    it('should throw expected 401 error message.', function(done) {
            
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.getToken(userId, 'authname', { channelId: 'emulator'})
            .then((response) => {
                assert(response._response.status === 401);
                done();
            }).catch((onreject) => {
                done(onreject.message);
            });
    
    });

    it('should throw expected 404 error message.', function(done) {
        this.timeout(100000);
        
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );

        customClient.userToken.getToken(userId, 'authname', { channelId: 'emulator'})
            .then((response) => {
                assert(response._response.status === 404);
                done();
            }).catch((onreject) => {
                done(onreject.message);
            });
    
    });

    it('should throw expected 200 message.', function(done) {
        
        const customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        const customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );
        
        customClient.userToken.getToken(userId, 'authname', { channelId: 'emulator'})
            .then((response) => {
                assert(response._response.status === 200);
                done();
            });
    
    });

});