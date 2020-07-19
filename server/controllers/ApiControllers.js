const fs = require('fs');
const api = require('../api/speech-to-text')
const multer = require('multer');
const mongodb = require('mongodb')
const ObjectID = mongodb.ObjectID
const {Readable} = require('stream')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart({uploadDir: './'})
module.exports = (db) => {
    const ApiController = {}

    ApiController.speech = (req, res) => {
        const schema = db.db('audio')
        const filename = 'audio - ' + new Date() + '.' + 'wav';
        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './uploads')
            },
            filename: function (req, file, callback) {
                callback(null, filename);
            }
        })
        const up = multer({storage: storage});

        return up.single('audio')(req, res, (err) => {
            if (err) {
                return res.status(400).json({message: "Upload Request Validation Failed".concat(' ').concat(err)});
            }
            const params = {
                audio: fs.createReadStream('./uploads/' + filename),
                objectMode: true,
                contentType: 'audio/wav',
                model: 'pt-BR_BroadbandModel',
                maxAlternatives: 3
            }
            api.recognize(params)
                .then(speechRecognitionResults => {
                    return res.status(200).json(speechRecognitionResults['result']);
                })
                .catch(err => {
                    return res.status(200).json(err)
                });
            ;
        })

    }
    return ApiController;
}
