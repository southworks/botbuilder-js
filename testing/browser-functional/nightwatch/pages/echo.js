/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// const dotenv = require('dotenv');
// dotenv.config();

module.exports = {
    name: 'EchoBot',
    url: function(){
        console.log(this)
        return this.api.launchUrl;
    },
    elements: {
        webchatContainer: {
            selector: 'div[id=webchat]>div',
        },
        webchatMessagesList: {
            selector: 'section.webchat__basic-transcript__transcript',
        },
        webchatMessageInput: {
            selector: 'input[data-id=webchat-sendbox-input]',
        },
        webchatMessageInputSubmitButton: {
            selector: 'button.webchat__send-button',
        },
    },
};
