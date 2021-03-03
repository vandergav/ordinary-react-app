const dialogflow = require('@google-cloud/dialogflow');
const config = require('../config/ordinaryreactapp-ikba-e3f4d5ce5d38.json');

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: './config/ordinaryreactapp-ikba-e3f4d5ce5d38.json',
});

exports.textQuery = async (req, res) => {
  const sessionPath = sessionClient.projectAgentSessionPath(
    config.project_id,
    `ordinary-react-app-${req.body.userID}`
  );
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.text,
        languageCode: 'en-US',
      },
    },
  };
  let responses = await sessionClient.detectIntent(request);
  res.send(responses[0].queryResult);
};
