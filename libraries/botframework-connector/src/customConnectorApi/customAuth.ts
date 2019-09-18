import { Issuer, Client, ClientMetadata, TokenSet, GrantBody } from 'openid-client';
import { Authentication } from './model';

const issuerUrl: string = 'https://login.botframework.com/v1/.well-known/openidconfiguration';
const tokenEndpoint: string = 'https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token';

export class CustomAuth implements Authentication {
    private readonly clientMetadata: ClientMetadata;
    private readonly clientGrant: GrantBody;

    constructor(appId: string, appPassword: string) {
        this.clientMetadata = {
            client_id: appId,
            client_secret: appPassword
        };
        this.clientGrant = {
            grant_type: 'client_credentials',
            'scope': 'https://api.botframework.com/.default'
        };
    }

    public async applyToRequest(requestOptions: any): Promise<void> {
        const issuer: Issuer<Client> = await Issuer.discover(issuerUrl);
        issuer.token_endpoint = tokenEndpoint;
        const client: Client = new issuer.Client(this.clientMetadata);

        const token: TokenSet = await client.grant(this.clientGrant);

        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + token.access_token;
        }
    }
}
