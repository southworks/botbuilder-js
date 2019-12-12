# Functional tests on Bots - From Scratch to CI

## Introduction and setup environment

In this article we will be making a walkthrough over the making and development of Functional tests using Mocha and make a simple bot to test using the [Bot Framework SDK v4 for Javascript](https://github.com/microsoft/botbuilder-js/).

This guide aims to go through the basics of making functional tests from scratch using [Mocha](https://mochajs.org/) as the test suite and the [Bot Service DirectLine channel](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-directline?view=azure-bot-service-4.0) as our client interface. Additionally, you will have a better understanding of how is the workflow behind the functional tests library included in the Bot Framework SDK v4 for Javascript.

You can download the project files used in this article in the [project_files folder](https://github.com/microsoft/botbuilder-js/tree/master/libraries/functional-tests) included within this article's directory.

### Setup environment

To start, lets start by initializing a new NPM project. Run `npm init --yes`, the `--yes` argument is optional if you want to automatically skips the metadata prompts.

The next step is to install the required dependencies by running `npm i mocha --save-dev`.