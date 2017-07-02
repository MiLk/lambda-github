const assert = require('assert');

const handler = require('../index').handler;

const newFakeEvent = (message, eventType) => {
  return {
    EventSource: 'aws:sns',
    Sns: {
      Timestamp: '2017-07-02T09:29:38.614Z',
      MessageId: 'f3dabfcd-efd2-5698-b878-ee1f5090c12a',
      Message: message,
      MessageAttributes: {
        'X-Github-Event': {
          Type: 'String',
          Value: eventType
        }
      }
    }
  }
};

describe('handler', () => {
  it('should return without error if no input', function(done) {
    handler(null, null, (err, result) => {
      if (err) return done(err);
      assert.equal(result, 'No records');
      return done();
    });
  });

  it('should return without error if no records', function(done) {
    handler({}, null, (err, result) => {
      if (err) return done(err);
      assert.equal(result, 'No records');
      return done();
    });
  });

  it('should return without error if empty records', function(done) {
    handler([], null, (err, result) => {
      if (err) return done(err);
      assert.equal(result, 'No records');
      return done();
    });
  });

  it('should process all records', function(done) {
    handler({ Records: [
      newFakeEvent(null, 'test1'),
      newFakeEvent(null, 'test2'),
      newFakeEvent(null, 'test3'),
      newFakeEvent(null, 'test4'),
      newFakeEvent(null, 'test5')
    ]}, null, (err, result) => {
      if (err) return done(err);
      assert.equal(result.length, 5);
      assert.deepStrictEqual(result, [
        "No event handler for the \"test1\" event.",
        "No event handler for the \"test2\" event.",
        "No event handler for the \"test3\" event.",
        "No event handler for the \"test4\" event.",
        "No event handler for the \"test5\" event."
      ]);
      return done();
    });
  });
});

describe('processRecord', () => {
  const processRecord = require('../index').processRecord;
  it('should not fail on unhandled event', function() {
    const input = require('./data/push').push;
    return processRecord(input).then((result) => {
      assert.equal(result, 'No event handler for the "push" event.');
    });
  });

  describe('pull_request', function () {
    it('should change the assignees', function () {
      const input = newFakeEvent(JSON.stringify(require('./data/pr').open), 'pull_request');
      return processRecord(input).then((result) => {
        assert.equal(result, 'Assignee list updated.');
      });
    });
  });
});

