const { CrossTrainedRecognizerSet, RegexRecognizer, IntentPattern } = require('botbuilder-dialogs-adaptive');
const { TestUtils } = require('../lib');
const {
    crossTrainText,
    xIntentText,
    recognizeIntentAndValidateTelemetry,
    spyOnTelemetryClientTrackEvent,
} = require('./recognizerTelemetryUtils');

const { makeResourceExplorer } = require('./utils');

const createRecognizer = () =>
    new CrossTrainedRecognizerSet().configure({
        recognizers: [
            new RegexRecognizer().configure({
                id: 'x',
                intents: [new IntentPattern('DeferToRecognizer_y', crossTrainText), new IntentPattern('x', 'x')],
            }),
            new RegexRecognizer().configure({
                id: 'y',
                intents: [new IntentPattern('y', crossTrainText), new IntentPattern('y', 'y')],
            }),
            new RegexRecognizer().configure({
                id: 'z',
                intents: [new IntentPattern('z', crossTrainText), new IntentPattern('z', 'z')],
            }),
        ],
    });

describe('CrossTrainedRecognizerSetTests', function () {
    let resourceExplorer;
    before(function () {
        resourceExplorer = makeResourceExplorer('CrossTrainedRecognizerSetTests');
    });

    it('AllNone', async function () {
        await TestUtils.runTestScript(resourceExplorer, 'CrossTrainedRecognizerSetTests_AllNone');
    });

    it('CircleDefer', async function () {
        await TestUtils.runTestScript(resourceExplorer, 'CrossTrainedRecognizerSetTests_CircleDefer');
    });

    it('DoubleDefer', async function () {
        await TestUtils.runTestScript(resourceExplorer, 'CrossTrainedRecognizerSetTests_DoubleDefer');
    });

    it('DoubleIntent', async function () {
        await TestUtils.runTestScript(resourceExplorer, 'CrossTrainedRecognizerSetTests_DoubleIntent');
    });

    it('Empty', async function () {
        await TestUtils.runTestScript(resourceExplorer, 'CrossTrainedRecognizerSetTests_Empty');
    });

    it('NoneWithIntent', async function () {
        await TestUtils.runTestScript(resourceExplorer, 'CrossTrainedRecognizerSetTests_NoneWithIntent');
    });

    it('EntitiesWithNoneIntent', async function () {
        await TestUtils.runTestScript(resourceExplorer, 'CrossTrainedRecognizerSetTests_NoneIntentWithEntities');
    });

    describe('Telemetry', function () {
        const recognizer = createRecognizer();
        let spy;

        beforeEach(function () {
            spy = spyOnTelemetryClientTrackEvent(recognizer);
        });

        afterEach(function () {
            spy.restore();
        });

        it('should log PII when logPersonalInformation is true', async function () {
            recognizer.logPersonalInformation = true;

            await recognizeIntentAndValidateTelemetry({
                text: crossTrainText,
                callCount: 1,
                recognizer,
                spy,
            });

            await recognizeIntentAndValidateTelemetry({
                text: xIntentText,
                callCount: 2,
                recognizer,
                spy,
            });
        });

        it('should not log PII when logPersonalInformation is false', async function () {
            recognizer.logPersonalInformation = false;

            await recognizeIntentAndValidateTelemetry({
                text: crossTrainText,
                callCount: 1,
                recognizer,
                spy,
            });

            await recognizeIntentAndValidateTelemetry({
                text: xIntentText,
                callCount: 2,
                recognizer,
                spy,
            });
        });

        it('should refrain from logging PII by default', async function () {
            const recognizerWithDefaultLogPii = createRecognizer();
            const trackEventSpy = spyOnTelemetryClientTrackEvent(recognizerWithDefaultLogPii);

            await recognizeIntentAndValidateTelemetry({
                text: crossTrainText,
                callCount: 1,
                recognizer: recognizerWithDefaultLogPii,
                spy: trackEventSpy,
            });
        });
    });
});
