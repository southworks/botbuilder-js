require('dotenv').config({path: __dirname + '/.env'});
const fs = require('fs-extra');
const path = require('path');
const assert = require('assert');
const customBotframeworkConnector = require('../lib');
const { MockMode, usingNock } = require('./mockHelper');
const nock = require('nock');

const baseUri = 'https://api.botframework.com';
const userAgent = 'Microsoft-BotFramework/3.1 BotBuilder/4.1.6 (Node.js,Version=v12.6.0; Windows_NT 10.0.17763; x64)';

/*
** To use this test select one of these modes:
** -MockMode.lockdown to use the test with the mocked files.
** -MockMode.record to use the test normal and record new mock files.
** -MockMode.wild to use the test without mocks and without recording.
*/
const mode = MockMode.wild;

// Set up this variables in your .env file
const userId = process.env['USER_ID'];
const appId = process.env['APP_ID'];
const appPassword = process.env['APP_PASSWORD'];
const connectionName = process.env['CONNECTION_NAME'];

let customCredentials = customBotframeworkConnector.CustomMicrosoftAppCredentials;
let customClient = customBotframeworkConnector.CustomTokenApiClient;
let options;

function setHeaderForTest(test) {
    if(mode === MockMode.lockdown) {
        try {
            const fileLocation = `${ path.join(__dirname, 'TestData', test.parent.title) }\\${ test.title.replace(/ /g, '_') }.json`;
            let file = fs.readFileSync(fileLocation);
            let jsonFile = JSON.parse(file);
            let authToken = jsonFile[0].reqheaders.authorization[0];
            options = {
                channelId: 'emulator',
                headers: { 'authorization': [authToken] }
            };
        } catch(e) {
            throw new Error('No recorded object has been provided for this test.');
        }        
    }
}

describe('CustomConnector getToken', async function() {

    before(async function() {
        customCredentials = new customBotframeworkConnector.CustomMicrosoftAppCredentials(appId, appPassword); 
        customClient = new customBotframeworkConnector.CustomTokenApiClient(customCredentials, { baseUri: baseUri, userAgent: userAgent } );
        bearerToken = await customCredentials.getToken(true);
        authToken = `Bearer ${ bearerToken }`;
        const custHeader = { 'authorization': [authToken] };

        options = {
            channelId: 'emulator',
            headers: custHeader
        };      
    });

    beforeEach(function(done) {
        nock.cleanAll();
        nock.enableNetConnect();
        done();
    });

    it('should throw expected 401 error message.', function() {

        return usingNock(this.test, mode)
            .then(({ nockDone }) => {

                let options = {
                    channelId: 'emulator',
                    headers: { 'authorization': ['Bearer fakeToken'] }
                };

                return (customClient.userToken.getToken('04cb9d92-5faf-446e-8393-74720c952e22', connectionName, options))
                    .then((response) => {
                        assert(response._response.status === 401);
                    })
                    .then(nockDone);
            });    
    });

    it('should throw expected 404 error message.', function() {
        this.timeout(100000);
        setHeaderForTest(this.test);
        return usingNock(this.test, mode)
            .then(( {nockDone }) => {                
                return (customClient.userToken.getToken('04cb9d92-5faf-446e-8393-74720c952e22', connectionName, options))
                    .then((response) => {
                        assert(response._response.status === 404);                        
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
                        assert(response._response.status === 200);
                    })
                    .then(nockDone);
            });    
    });
});