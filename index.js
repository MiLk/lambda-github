console.log('Loading...');
const request = require('request');

exports.handler = (event, context, callback) => {
  if (!event || !event.Records || event.Records.length === 0) {
    return callback(null, 'No records');
  }

  Promise.all(event.Records.map(processRecord))
    .then((result) => {
      console.log('Success:', result);
      callback(null, result)
    })
    .catch((error) => {
      console.error('Error:', error);
      callback(error, null)
    });
};

const processRecord = (record) => {
  return new Promise((resolve, reject) => {
    if (!record.EventSource || record.EventSource !== 'aws:sns') {
      return reject('Invalid EventSource');
    }

    if (!record.Sns) {
      return reject('No SNS data');
    }

    const {Timestamp, MessageId, Message, MessageAttributes} = record.Sns;

    if (!MessageAttributes
      || !MessageAttributes['X-Github-Event']
      || !MessageAttributes['X-Github-Event'].Value) {
      return reject('Invalid event');
    }

    const eventName = MessageAttributes['X-Github-Event'].Value;

    console.log(`[${Timestamp}] ${MessageId}: Received "${eventName}" event from Github`);
    if (eventHandler.hasOwnProperty(eventName)) {
      const msg = JSON.parse(Message);
      return resolve(eventHandler[eventName](msg));
    }

    return resolve(`No event handler for the "${eventName}" event.`);
  });
};

const pullRequestHandler = (msg) => {
  return new Promise((resolve, reject) => {
    const {action, pull_request, sender} = msg;
    if (action !== 'opened') {
      return resolve('Nothing to do.');
    }

    const url = `${pull_request.issue_url}/assignees`;
    const postData = {assignees: [sender.login]};
    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'User-Agent': 'lambda-github'
    };

    console.log('Send', postData, 'to', url, 'with', headers);

    request({
      url: url,
      method: 'POST',
      headers: headers,
      json: postData
    }, (error, resp, body) => {
      console.log('Response code:', resp.statusCode);

      if (error) {
        return reject(error);
      }

      if (resp.statusCode !== 201) {
        return reject(body);
      }

      return resolve('Assignee list updated.');
    });
  });
};

const eventHandler = {
  'pull_request': pullRequestHandler
};

if (process.env.LOADED_MOCHA_OPTS) {
  exports.processRecord = processRecord;
}

console.log('Loaded.');
