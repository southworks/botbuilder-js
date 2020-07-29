/**
 * @module botbuilder-dialogs
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity, TurnContext } from 'botbuilder-core';
import { ChoiceFactory, ChoiceFactoryOptions, FindChoicesOptions, FoundChoice, recognizeChoices } from '../choices';
import { ListStyle, Prompt, PromptOptions, PromptRecognizerResult, PromptValidator } from './prompt';
import { PromptCultureModels } from './promptCultureModels';

// Need ChoiceDefaultsProperty so we can set choiceDefaults dynamically with lambda
interface ChoiceDefaultsChoicePrompt { [locale: string]: ChoiceFactoryOptions };

/**
 * Prompts a user to select from a list of choices.
 *
 * @remarks
 * By default the prompt will return to the calling dialog a `FoundChoice` object containing the
 * choice that was selected.
 */
export class ChoicePrompt extends Prompt<FoundChoice> {

    /**
     * A dictionary of Default Choices based on [[PromptCultureModels.getSupportedCultures()]].
     * Can be replaced by user using the constructor that contains choiceDefaults.
     */
    private choiceDefaults: ChoiceDefaultsChoicePrompt;

    /**
     * The prompts default locale that should be recognized.
     */
    public defaultLocale: string|undefined;

    /**
     * Style of the "yes" and "no" choices rendered to the user when prompting.
     *
     * @remarks
     * Defaults to `ListStyle.auto`.
     */
    public style: ListStyle;

    /**
     * Additional options passed to the `ChoiceFactory` and used to tweak the style of choices
     * rendered to the user.
     */
    public choiceOptions: ChoiceFactoryOptions|undefined;

    /**
     * Additional options passed to the underlying `recognizeChoices()` function.
     */
    public recognizerOptions: FindChoicesOptions|undefined;

    /**
     * Creates a new `ChoicePrompt` instance.
     * @param dialogId Unique ID of the dialog within its parent `DialogSet`.
     * @param validator (Optional) validator that will be called each time the user responds to the prompt. If the validator replies with a message no additional retry prompt will be sent.
     * @param defaultLocale (Optional) locale to use if `dc.context.activity.locale` not specified. Defaults to a value of `en-us`.
     * @param choiceDefaults (Optional) Overrides the dictionary of Bot Framework SDK-supported _choiceDefaults (for prompt localization).
     *  Must be passed in to each ConfirmPrompt that needs the custom choice defaults.
     */
    public constructor(dialogId: string, validator?: PromptValidator<FoundChoice>, defaultLocale?: string, choiceDefaults?: ChoiceDefaultsChoicePrompt) {
        super(dialogId, validator);
        this.style = ListStyle.auto;
        this.defaultLocale = defaultLocale;
        
        if (choiceDefaults == undefined) {
            const supported: ChoiceDefaultsChoicePrompt = {};
            PromptCultureModels.getSupportedCultures().forEach((culture): void => {
                supported[culture.locale] = {
                    inlineSeparator: culture.separator,
                    inlineOr: culture.inlineOr,
                    inlineOrMore: culture.inlineOrMore,
                    includeNumbers: true
                };
            });
            this.choiceDefaults = supported;
        } else {
            this.choiceDefaults = choiceDefaults;
        }
    }

    protected async onPrompt(context: TurnContext, state: any, options: PromptOptions, isRetry: boolean): Promise<void> {
        // Determine locale
        const locale = this.determineCulture(context.activity);

        // Format prompt to send
        let prompt: Partial<Activity>;
        const choices: any[] = (this.style === ListStyle.suggestedAction ? ChoiceFactory.toChoices(options.choices) : options.choices) || [];
        const channelId: string = context.activity.channelId;
        const choiceOptions: ChoiceFactoryOptions = this.choiceOptions || this.choiceDefaults[locale];
        const choiceStyle: ListStyle = options.style === 0 ? 0 : options.style || this.style;
        if (isRetry && options.retryPrompt) {
            prompt = this.appendChoices(options.retryPrompt, channelId, choices, choiceStyle, choiceOptions);
        } else {
            prompt = this.appendChoices(options.prompt, channelId, choices, choiceStyle, choiceOptions);
        }

        // Send prompt
        await context.sendActivity(prompt);
    }

    protected async onRecognize(context: TurnContext, state: any, options: PromptOptions): Promise<PromptRecognizerResult<FoundChoice>> {

        const result: PromptRecognizerResult<FoundChoice> = { succeeded: false };
        const activity: Activity = context.activity;
        const utterance: string = activity.text;
        if (!utterance) {
            return result;
        }
        const choices: any[] = (this.style === ListStyle.suggestedAction ? ChoiceFactory.toChoices(options.choices) : options.choices)|| [];
        const opt: FindChoicesOptions = this.recognizerOptions || {};
        opt.locale = this.determineCulture(activity, opt);
        const results: any[]  = recognizeChoices(utterance, choices, opt);
        if (Array.isArray(results) && results.length > 0) {
            result.succeeded = true;
            result.value = results[0].resolution;
        }

        return result;
    }

    private determineCulture(activity: Activity, opt: FindChoicesOptions = null): string {
        const optLocale = opt && opt.locale ? opt.locale : null;
        let culture = PromptCultureModels.mapToNearestLanguage(activity.locale || optLocale || this.defaultLocale || PromptCultureModels.English.locale);
        if (!culture || !this.choiceDefaults[culture])
        {
            culture = PromptCultureModels.English.locale;
        }

        return culture;
    }
}
