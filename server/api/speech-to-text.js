const config = require('config')
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1')
const {IamAuthenticator} = require('ibm-watson/auth')

const apiKey = process.env.API_KEY_WATSON_SPEECH || config.get('api.ibm.speech.key')
const urlApi = process.env.API_URL_WATSON_SPEECH || config.get('api.ibm.speech.url')

const speech = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: apiKey
    }),
    urlApi
});


module.exports = speech;


