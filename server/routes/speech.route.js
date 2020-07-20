module.exports = (app, db) => {
    const controller = require('../controllers/ApiControllers')(db);

    app.route('/api/v1/speech-to-text')
        .post(controller.speech)

    app.route('/api/v1/text-to-speech')
        .post(controller.text)
}
