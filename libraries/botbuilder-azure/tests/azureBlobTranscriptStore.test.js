const assert = require('assert');
const { AzureBlobTranscriptStore } = require('../');
const azure = require('azure-storage');
const base = require('../../botbuilder/tests/transcriptStoreBaseTest');
const { MockMode, usingNock } = require('./mockHelper');
const nock = require('nock');

const mode = process.env.MOCK_MODE || MockMode.lockdown;

const getSettings = (container = null) => ({
    storageAccountOrConnectionString: 'UseDevelopmentStorage=true;',
    containerName: container || 'test-transcript'
});

const noEmulatorMessage = 'skipping test because azure storage emulator is not running';
const settings = getSettings();
const useParallel = settings.storageAccountOrConnectionString !== 'UseDevelopmentStorage=true;';

const reset = (done) => {
    nock.cleanAll();
    nock.enableNetConnect();
    if ( mode !== MockMode.lockdown ) {
        let settings = getSettings();
        let client = azure.createBlobService(settings.storageAccountOrConnectionString, settings.storageAccessKey);
        client.deleteContainerIfExists(settings.containerName, (err, result) => done());
    } else {
        done();
    }
}

const handleConnectionError = (reason) => {
    if (reason.code == 'ECONNREFUSED') {
        console.log(noEmulatorMessage);
    } else {
        assert(false, `should not throw: ${print(reason)}`);
    }
}

const print = (o) => {
    return JSON.stringify(o, null, '  ');
}

function getDataFromScopes(scopes) {
    let filteredScopes = scopes.filter(function(x) { return x.interceptors && x.interceptors.length > 0 && x.interceptors[0]._requestBody != '' });
    return filteredScopes.map(s => {
        let requestBody = s.interceptors[0]._requestBody;
        return {
            id: requestBody.id,
            timestamp: requestBody.timestamp
        }
    });
}

function createActivities(conversationId = '_conversationId', timestamp = new Date(), baseId = '1', amount = 1) {
    let activities = [];

    for (let i = 1; i <= amount; i++) {
        let tempActivities = base.createActivity(conversationId, timestamp, baseId, i);
        activities.push(tempActivities[0]);
        activities.push(tempActivities[1]);
    }

    return activities;
}

testStorage = function () {

    xit('bad args', function () {
        let storage = new AzureBlobTranscriptStore(settings);
        return base._badArgs(storage)
            .then(messages => {
                assert(messages.every(message => message.startsWith('expected error')));
            })
            .catch(handleConnectionError)
    })

    it('log activity', function () {
        return usingNock(this.test, mode)
            .then(({nockDone, context}) => {
                // context.scopes.forEach(cs => {
                //     cs.filteringPath(function(path) {
                //         let fixedPath = path.replace(/[0-9a-fA-F]{15}\-[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/i, '8d63dad9fbaa600-bf6620f6-437a-4b45-abcc-ca3888c18be6');
                //         return fixedPath;
                //     })
                // });

                // let activity = createActivity('bf6620f6-437a-4b45-abcc-ca3888c18be6', new Date('2018-10-29T14:48:43.795Z'));
                // let activity = createActivitiesFromScope(context.scopes, '_logActivity').pop();

                let scopeData = getDataFromScopes(context.scopes)[0];

                let activity = createActivities('_logActivity', new Date(scopeData.timestamp), scopeData.id, 1).pop();

                let storage = new AzureBlobTranscriptStore(settings);
                return base._logActivity(storage, activity)
                    .then(() => assert(true))
                    .catch(handleConnectionError)
                    .then(nockDone);
            });
    })

    xit('log multiple activities', function () {
        return usingNock(this.test, mode)
            .then(({nockDone, context}) => {
                let storage = new AzureBlobTranscriptStore(settings);
                return base._logMultipleActivities(storage, useParallel)
                    .then(() => assert(true))
                    .catch(handleConnectionError)
                    .then(nockDone);
            });
    })

    xit('delete transcript', function () {
        return usingNock(this.test, mode)
            .then(({nockDone, context}) => {
                let scopeData = getDataFromScopes(context.scopes);
                
                let activities = createActivities('_deleteConversation', new Date(), 1, 5);
                let activities2 = createActivities('_deleteConversation2', new Date(), 1, 5);

                if (scopeData.length === (activities.length + activities2.length)) {
                    for(let i = 0; i < activities.length; i++) {
                        let activity = activities[i];
                        activity.id = scopeData[i].id;
                        activity.timestamp = new Date(scopeData[i].timestamp);
                    }
    
                    for(let i = 0; i < activities2.length; i++) {
                        let activity = activities2[i];
                        activity.id = scopeData[10 + i].id;
                        activity.timestamp = new Date(scopeData[10 + i].timestamp);
                    }
                } else {
                    activities = null;
                    activities2 = null;
                }

                let storage = new AzureBlobTranscriptStore(settings);
                return base._deleteTranscript(storage, useParallel, activities, activities2)
                    .then(() => assert(true))
                    .catch(handleConnectionError)
                    .then(nockDone);
            });
    })

    it('get transcript activities', function () {
        return usingNock(this.test, mode)
            .then(({nockDone, context}) => {
                let scopeData = getDataFromScopes(context.scopes);

                let activities = createActivities('_getTranscriptActivitiesPaging', new Date(), 1, 50);

                if (activities.length === scopeData.length) {
                    for (let i = 0; i < activities.length; i++) {
                        let activity = activities[i];
                        let scope = scopeData[i];

                        activity.id = scope.id;
                        activity.timestamp = new Date(scope.timestamp);
                    }
                } else {
                    activities = null;
                }

                let storage = new AzureBlobTranscriptStore(settings);
                return base._getTranscriptActivities(storage, useParallel, activities)
                    .then(() => assert(true))
                    .catch(handleConnectionError)
                    .then(nockDone);
            });
    })

    it('get transcript activities with startDate', function () {
        return usingNock(this.test, mode)
            .then(({nockDone, context}) => {
                let scopeData = getDataFromScopes(context.scopes);

                let activities = createActivities('_getTranscriptActivitiesStartDate', new Date(), 1, 50);

                if (activities.length === scopeData.length) {
                    for (let i = 0; i < activities.length; i++) {
                        let activity = activities[i];
                        let scope = scopeData[i];

                        activity.id = scope.id;
                        activity.timestamp = new Date(scope.timestamp);
                    }
                } else {
                    activities = null;
                }
                
                let storage = new AzureBlobTranscriptStore(settings);
                return base._getTranscriptActivitiesStartDate(storage, useParallel, activities)
                    .then(() => assert(true))
                    .catch(handleConnectionError)
                    .then(nockDone);
            });
    })

    xit('list transcripts', function () {
        return usingNock(this.test, mode)
            .then(({nockDone, context}) => {
                let storage = new AzureBlobTranscriptStore(settings);
                return base._listTranscripts(storage, useParallel)
                    .then(() => assert(true))
                    .catch(handleConnectionError)
                    .then(nockDone);
            });
    })
}

describe('AzureBlobTranscriptStore', function () {
    this.timeout(20000);
    before('cleanup', reset);
    testStorage();
    after('cleanup', reset);
});
