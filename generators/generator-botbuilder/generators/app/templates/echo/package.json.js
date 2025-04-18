{
    "name": "<%= botname %>",
    "version": "4.1.6",
    "description": "<%= botDescription %>",
    "author": "Generated using Microsoft Bot Builder Yeoman generator v5",
    "license": "MIT",
    "main": "<%= npmMain %>",
    "scripts": {
        "start": "node ./index.js",
        "watch": "nodemon ./index.js",
        "lint": "eslint .",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com"
    },
    "dependencies": {
        "botbuilder": "4.1.6",
        "dotenv": "~8.2.0",
        "restify": "~11.1.0"
    },
    "devDependencies": {
        "eslint": "^7.0.0",
        "eslint-config-standard": "^14.1.1",
        "eslint-plugin-import": "^2.20.2",
        "eslint-plugin-node": "^11.1.0",
        "eslint-plugin-promise": "^4.2.1",
        "eslint-plugin-standard": "^4.0.1",
        "nodemon": "^2.0.4"
    }
}
