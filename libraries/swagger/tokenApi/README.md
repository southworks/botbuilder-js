## An isomorphic javascript sdk for - TokenApiClient

This package contains an isomorphic SDK for TokenApiClient.

### Currently supported environments

- Node.js version 6.x.x or higher
- Browser JavaScript

### How to Install

```
npm install botframework-Token
```

### How to use

#### nodejs - Authentication, client creation and getSignInUrl botSignIn as an example written in TypeScript.

##### Install @azure/ms-rest-nodeauth

```
npm install @azure/ms-rest-nodeauth
```

##### Sample code

```ts
import * as msRest from "@azure/ms-rest-js";
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { TokenApiClient, TokenApiModels, TokenApiMappers } from "botframework-Token";
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];

msRestNodeAuth.interactiveLogin().then((creds) => {
  const client = new TokenApiClient(creds, subscriptionId);
  const state = "teststate";
  const codeChallenge = "testcodeChallenge";
  const emulatorUrl = "testemulatorUrl";
  const finalRedirect = "testfinalRedirect";
  client.botSignIn.getSignInUrl(state, codeChallenge, emulatorUrl, finalRedirect).then((result) => {
    console.log("The result is:");
    console.log(result);
  });
}).catch((err) => {
  console.error(err);
});
```

#### browser - Authentication, client creation and getSignInUrl botSignIn as an example written in JavaScript.

##### Install @azure/ms-rest-browserauth

```
npm install @azure/ms-rest-browserauth
```

##### Sample code

See https://github.com/Azure/ms-rest-browserauth to learn how to authenticate to Azure in the browser.

- index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>botframework-Token sample</title>
    <script src="node_modules/@azure/ms-rest-js/dist/msRest.browser.js"></script>
    <script src="node_modules/@azure/ms-rest-browserauth/dist/msAuth.js"></script>
    <script src="node_modules/botframework-Token/dist/botframework-Token.js"></script>
    <script type="text/javascript">
      const subscriptionId = "<Subscription_Id>";
      const authManager = new msAuth.AuthManager({
        clientId: "<client id for your Azure AD app>",
        tenant: "<optional tenant for your organization>"
      });
      authManager.finalizeLogin().then((res) => {
        if (!res.isLoggedIn) {
          // may cause redirects
          authManager.login();
        }
        const client = new BotframeworkToken.TokenApiClient(res.creds, subscriptionId);
        const state = "teststate";
        const codeChallenge = "testcodeChallenge";
        const emulatorUrl = "testemulatorUrl";
        const finalRedirect = "testfinalRedirect";
        client.botSignIn.getSignInUrl(state, codeChallenge, emulatorUrl, finalRedirect).then((result) => {
          console.log("The result is:");
          console.log(result);
        }).catch((err) => {
          console.log("An error occurred:");
          console.error(err);
        });
      });
    </script>
  </head>
  <body></body>
</html>
```

## Related projects

- [Microsoft Azure SDK for Javascript](https://github.com/Azure/azure-sdk-for-js)
