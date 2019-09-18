const BotConnector = require('./libraries/botframework-connector/lib');

(async () => {

    const appId = '<YOUR-DATA>';
    const appPassword = '<YOUR-DATA>';

    const basePath = 'https://telegram.botframework.com';

    const auth = new BotConnector.CustomAuth(appId, appPassword);

    const convoApi = new BotConnector.ConversationsApi(basePath);
    convoApi.setDefaultAuthentication(auth);

    const params = {
        bot: {
            id: "12345678",
            name: "bot's name"
        },
        members: [
            {
                id: "1234abcd",
                name: "recipient's name"
            }
        ]
    };

    try {
        var result = await convoApi.CreateConversation(params);
        console.log(JSON.stringify(result.body));
    } catch (error) {
        console.log(error);
    }
})();
