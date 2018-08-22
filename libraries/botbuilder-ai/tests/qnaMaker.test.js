const assert = require('assert');
const { TestAdapter, TurnContext } = require('botbuilder');
const ai = require('../');
const nock = require('nock');
var fs = require('fs');

// Save test keys
const knowledgeBaseId = process.env.QNAKNOWLEDGEBASEID;
const endpointKey = process.env.QNAENDPOINTKEY;
const hostname = process.env.QNAHOSTNAME || 'botbuilder-test-app';

class TestContext extends TurnContext {
    constructor(request) {
        super(new TestAdapter(), request);
        this.sent = [];
        this.onSendActivities((context, activities, next) => {
            this.sent = this.sent.concat(activities);
            context.responded = true;
        });
    }
}

describe('QnAMaker', function () {
    this.timeout(10000);
    const testFiles = fs.readdirSync(`${ __dirname }/TestData/${ this.title }/`);
    const mockQnA = true;

    if (!knowledgeBaseId) {
        console.warn('WARNING: QnAMaker test suite QNAKNOWLEDGEBASEID environment variable is not defined');
    }
    if (!endpointKey) {
        console.warn('WARNING: QnAMaker test suite QNAENDPOINTKEY environment variable is not defined');
    }
    if (!hostname) {
        console.warn('WARNING: QnAMaker test suite QNAHOSTNAME environment variable is not defined');
    }

    // Generate endpoints
    const endpoint = {
        knowledgeBaseId: knowledgeBaseId,
        endpointKey: endpointKey,
        host: `https://${ hostname }.azurewebsites.net/qnamaker`
    }

    beforeEach(function(done){
        if (mockQnA) {
            var filename = replaceCharacters(this.currentTest.title);
            var arr = testFiles.filter(function(file) { return file.startsWith(filename)} )
            arr.forEach(file => {
                nock(`https://${ hostname }.azurewebsites.net`).post(/qnamaker/)
                .replyWithFile(200, `${ __dirname }/TestData/${ this.test.parent.title }/${ file }`)
            });
        }
        done();
    })

    function replaceCharacters (testName, testDesc) {
        return testName
        .replace(/"/g, '')
        .replace(/ /g, '_');
    }

    it('should work free standing', function () {
        const qna = new ai.QnAMaker(endpoint, { top: 1 });

        return qna.generateAnswer(`how do I clean the stove?`)
            .then(res => {
                assert(res);
                assert(res.length == 1);
                assert(res[0].answer.startsWith("BaseCamp: You can use a damp rag to clean around the Power Pack"));
            })
            .then(() => qna.generateAnswer("is the stove hard to clean?"))
            .then(res => {
                assert(res);
                assert(res.length == 1);
                assert(res[0].answer.startsWith("BaseCamp: You can use a damp rag to clean around the Power Pack"));
            });
    });
    
    it('should return 0 answers for an empty or undefined utterance', function () {
        const qna = new ai.QnAMaker(endpoint, { top: 1 });
        
        return qna.generateAnswer(``)
            .then(res => {
                assert(res);
                assert(res.length == 0);
            })
            .then(() => qna.generateAnswer(undefined))
            .then(res => {
                assert(res.length == 0);
            });
    });

    it('should return 0 answers for questions without an answer.', function () {
        const qna = new ai.QnAMaker(endpoint, { top: 1 });

        return qna.generateAnswer(`foo`)
            .then(res => {
                assert(res);
                assert(res.length == 0, `returned ${JSON.stringify(res)}`)
            })
            .then(() => qna.generateAnswer(undefined))
            .then(res => {
                assert(res.length == 0);
            });
    });
    
    it('should return "false" from answer() if no good answers found', function (done) {
        const context = new TestContext({ text: `foo`, type: 'message' });
        const qna = new ai.QnAMaker(endpoint, { top: 1 });

        qna.answer(context).then((found) => {
            assert(!found);
            done();
        });
    });

    it('should emit trace info once per call to Answer', function (done) {
        const context = new TestContext({ text: `how do I clean the stove?`, type: 'message'});
        const qna = new ai.QnAMaker(endpoint, { top: 1 });

        qna.answer(context)
            .then((found) => {
                assert(found);
                let qnaMakerTraceActivies = context.sent.filter(s => s.type === 'trace' && s.name === 'QnAMaker');
                assert(qnaMakerTraceActivies.length === 1);
                traceActivity = qnaMakerTraceActivies[0];
                assert(traceActivity.type === 'trace');
                assert(traceActivity.name === 'QnAMaker');
                assert(traceActivity.label === 'QnAMaker Trace');
                assert(traceActivity.valueType === 'https://www.qnamaker.ai/schemas/trace');
                assert(traceActivity.value);
                assert(traceActivity.value.message);
                assert(traceActivity.value.queryResults);
                assert(traceActivity.value.knowledgeBaseId === knowledgeBaseId);
                assert(traceActivity.value.scoreThreshold);
                done();
            });
    });
});