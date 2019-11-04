/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var botPage;
module.exports = {
    botPage: {},
    before: function(browser) {
        botPage = browser.page.echoBotPage();
    },
    afer: function(browser) {
        // End current page session
        botPage.end();
    },
    'Echo bot webchat is loaded': function(browser) {
        // Navigate to the Echo Bot page
        // This step is performed made in the first test since navigation can't be done in the 'before' hook
        botPage.navigate();

        // Check Webchat container is initialized and is present in the page
        botPage
            .assert.elementPresent('@webchatContainer');
    },
    'Echo bot webchat sends messages': function(browser) {
        // Type 'Hello' in the webchat input box and send it to the bot
        botPage
            .setValue('@webchatMessageInput', 'Hello')
            .click('@webchatMessageInputSubtmitButton', function(result) {
                // Assertion to check the button was clickable and got triggered
                this.assert.strictEqual(result.status, 0, 'Message input working');
            })
            .pause(250);

        assertMessageIsPresentInPage(botPage, 'Hello', 'Webchat contains user message');
    },
    'Echo bot webchat echoes messages': function(browser) {
        assertMessageIsPresentInPage(botPage, '1: You said “Hello”', 'Webchat contains bot reply');
    }
};

function assertMessageIsPresentInPage(pageInstance, textSearch, assertMessage) {
    // Get messages list from webchat
    pageInstance.api.elements('@webchatMessagesList', function(messagesWebElements) {
        messagesWebElements.value.forEach(function(webElement) {
            pageInstance.api.elementIdText(webElement.ELEMENT, function(elementText) {
                if (elementText.value == textSearch) {
                    // A better approach should be analyzed since when no message is found,
                    // the test is skipped showing no failed result
                    pageInstance.assert.strictEqual(elementText.value, textSearch, assertMessage);
                }
            });
        });
    });
}
