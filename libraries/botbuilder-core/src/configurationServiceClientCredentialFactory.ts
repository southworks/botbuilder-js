// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as z from 'zod';
import { Configuration } from 'botbuilder-dialogs-adaptive-runtime-core';
import {
    ManagedIdentityServiceClientCredentialsFactory,
    JwtTokenProviderFactory,
    PasswordServiceClientCredentialFactory,
    ServiceClientCredentialsFactory,
} from 'botframework-connector';

import type { ServiceClientCredentials } from '@azure/ms-rest-js';

const TypedConfig = z
    .object({
        /**
         * The ID assigned to your bot in the [Bot Framework Portal](https://dev.botframework.com/).
         */
        MicrosoftAppId: z.string(),

        /**
         * The password assigned to your bot in the [Bot Framework Portal](https://dev.botframework.com/).
         */
        MicrosoftAppPassword: z.string(),

        /**
         * The type of app id assigned to your bot in the [Bot Framework Portal](https://dev.botframework.com/).
         */
        MicrosoftAppType: z.string(),

        /**
         * The tenant id assigned to your bot in the [Bot Framework Portal](https://dev.botframework.com/).
         */
        MicrosoftAppTenantId: z.string(),
    })
    .partial();

enum MicrosoftAppTypes {
    /*
     * MultiTenant app which uses botframework.com tenant to acquire tokens.
     */
    MultiTenant,

    /*
     * SingleTenant app which uses the bot's host tenant to acquire tokens.
     */
    SingleTenant,

    /*
     * App with a user assigned Managed Identity (MSI), which will be used as the AppId for token acquisition.
     */
    UserAssignedMsi,
}

/**
 * Contains settings used to configure a [ConfigurationServiceClientCredentialFactory](xref:botbuilder-core.ConfigurationServiceClientCredentialFactory) instance.
 */
export type ConfigurationServiceClientCredentialFactoryOptions = z.infer<typeof TypedConfig>;

/**
 * ServiceClientCredentialsFactory that uses a [ConfigurationServiceClientCredentialFactoryOptions](xref:botbuilder-core.ConfigurationServiceClientCredentialFactoryOptions) or a [Configuration](xref:botbuilder-dialogs-adaptive-runtime-core.Configuration) instance to build ServiceClientCredentials with an AppId and App Password.
 */
export class ConfigurationServiceClientCredentialFactory extends PasswordServiceClientCredentialFactory {
    private readonly inner: ServiceClientCredentialsFactory;

    /**
     * Initializes a new instance of the [ConfigurationServiceClientCredentialFactory](xref:botbuilder-core.ConfigurationServiceClientCredentialFactory) class.
     *
     * @param factoryOptions A [ConfigurationServiceClientCredentialFactoryOptions](xref:botbuilder-core.ConfigurationServiceClientCredentialFactoryOptions) object.
     */
    constructor(factoryOptions: ConfigurationServiceClientCredentialFactoryOptions = {}) {
        const {
            MicrosoftAppId = null,
            MicrosoftAppPassword = null,
            MicrosoftAppType = null,
            MicrosoftAppTenantId = null,
        } = TypedConfig.nonstrict().parse(factoryOptions);
        super(MicrosoftAppId, MicrosoftAppPassword, MicrosoftAppTenantId);

        const appType = MicrosoftAppType ?? MicrosoftAppTypes.MultiTenant;

        switch (appType) {
            case MicrosoftAppTypes.UserAssignedMsi:
                if (!MicrosoftAppId || MicrosoftAppId.trim() === '') {
                    throw new Error('MicrosoftAppId is required for MSI in configuration.');
                }

                if (!MicrosoftAppTenantId || MicrosoftAppTenantId.trim() === '') {
                    throw new Error('MicrosoftAppTenantId is required for MSI in configuration.');
                }

                if (MicrosoftAppPassword && MicrosoftAppPassword.trim() !== '') {
                    throw new Error('MicrosoftAppPassword must not be set for MSI in configuration.');
                }

                this.inner = new ManagedIdentityServiceClientCredentialsFactory(
                    MicrosoftAppId,
                    new JwtTokenProviderFactory()
                );
                break;
            case MicrosoftAppTypes.SingleTenant:
                if (!MicrosoftAppId || MicrosoftAppId.trim() === '') {
                    throw new Error('MicrosoftAppId is required for SingleTenant in configuration.');
                }

                if (!MicrosoftAppTenantId || MicrosoftAppTenantId.trim() === '') {
                    throw new Error('MicrosoftAppTenantId is required for SingleTenant in configuration.');
                }

                if (!MicrosoftAppPassword || MicrosoftAppPassword.trim() === '') {
                    throw new Error('MicrosoftAppPassword is required for SingleTenant in configuration.');
                }

                this.inner = new PasswordServiceClientCredentialFactory(
                    MicrosoftAppId,
                    MicrosoftAppPassword,
                    MicrosoftAppTenantId
                );
                break;
            default:
                //MultiTenant
                this.inner = new PasswordServiceClientCredentialFactory(MicrosoftAppId, MicrosoftAppPassword, '');
                break;
        }
    }

    /**
     * @inheritdoc
     */
    isValidAppId(microsoftAppId: string): Promise<boolean> {
        return this.inner.isValidAppId(microsoftAppId);
    }

    /**
     * @inheritdoc
     */
    isAuthenticationDisabled(): Promise<boolean> {
        return this.inner.isAuthenticationDisabled();
    }

    /**
     * @inheritdoc
     */
    createCredentials(
        microsoftAppId: string,
        audience: string,
        loginEndpoint: string,
        validateAuthority: boolean
    ): Promise<ServiceClientCredentials> {
        return this.inner.createCredentials(microsoftAppId, audience, loginEndpoint, validateAuthority);
    }
}

/**
 * Creates a new instance of the [ConfigurationServiceClientCredentialFactory](xref:botbuilder-core.ConfigurationServiceClientCredentialFactory) class.
 *
 * @remarks
 * The [Configuration](xref:botbuilder-dialogs-adaptive-runtime-core.Configuration) instance provided to the constructor should
 * have the desired authentication values available at the root, using the properties of [ConfigurationServiceClientCredentialFactoryOptions](xref:botbuilder-core.ConfigurationServiceClientCredentialFactoryOptions) as its keys.
 * @param configuration A [Configuration](xref:botbuilder-dialogs-adaptive-runtime-core.Configuration) instance.
 * @returns A [ConfigurationServiceClientCredentialFactory](xref:botbuilder-core.ConfigurationServiceClientCredentialFactory) instance.
 */
export function createServiceClientCredentialFactoryFromConfiguration(
    configuration: Configuration
): ConfigurationServiceClientCredentialFactory {
    const factoryOptions = configuration.get<ConfigurationServiceClientCredentialFactoryOptions>();
    return new ConfigurationServiceClientCredentialFactory(factoryOptions);
}
