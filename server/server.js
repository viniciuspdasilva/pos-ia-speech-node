const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const cors = require('cors')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const app = express();

app.set('port', process.env.PORT || config.get('server.port'))
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


let db;
MongoClient.connect('mongodb://localhost:27017/trackDB', {useUnifiedTopology: true})
    .then(database => {
        require('./routes/speech.route')(app, database)
    })
    .catch(err => {
        if (err) {
            console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
            process.exit(1);
        }
    });

module.exports = app;
