const express = require('express');
const bodyParser = require('body-parser');
const {loadCandidates, voteForCandidate} = require('./app')

const app = express();
const protocol = 'http'
const host = 'localhost';
const port = 4001;

//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }))
//To parse json data
app.use(bodyParser.json())

function bigintReplacer(key, value) {
    if (typeof value === "bigint") {
        return JSON.rawJSON(value.toString());
    } else {
        return value;
    }
}

app.get('/candidates', (req, res) => {
    loadCandidates()
    .then((response) => {
        // console.log(response[0].votes)
        // res.setHeader('Content-Type', 'application/json');
        // res.status(200).send(JSON.stringify({data: response}, bigintReplacer))
        res.status(200).send(response)
    })
    .catch(err => {
        console.error(err)
    })
})

app.get('/candidates/:candidate', (req, res) => {
    voteForCandidate(req.params.candidate)
    .then((response) => {
        // res.setHeader('Content-Type', 'application/json');
        // res.status(200).send(JSON.stringify(response))
        res.end(response)
    })
    .catch(err => {
        console.error(err)
    })
})

app.listen(port, function() {
    console.log('The server is running, ' +
        'please open your browser at %s://%s:%d', protocol, host, port);
});
