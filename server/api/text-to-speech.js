const config = require('config')
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1')
const {IamAuthenticator} = require('ibm-watson/auth')

const apiKey = process.env.API_KEY_WATSON_SPEECH || config.get('api.ibm.text.key')
const urlApi = process.env.API_URL_WATSON_SPEECH || config.get('api.ibm.text.url')

const speech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
        apikey: apiKey
    }),
    urlApi
});


module.exports = speech;
