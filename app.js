//jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

//mongoose
mongoose.connect('mongodb+srv://admin:mfrem7079@gameofphonesdb.yuoby.mongodb.net/gameOfPhonesDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

const cardSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true
    }
});

const passwordSchema = new mongoose.Schema({
    pass: {
        type: String,
        required: true
    }
});

const Card = mongoose.model('Card', cardSchema);

const Password = mongoose.model('Password', passwordSchema);

var deck = null;

Card.find({}, (err, results) => {
    deck = results;
});

//routing

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/addCard', (req, res) => {
    res.render('signIn');
});

app.post('/addCard', (req, res) => {
    if (req.body.prompt != null){
        const newCard = new Card({
            prompt: req.body.prompt
        });
        newCard.save()

        Card.countDocuments({}, (err, result) => {
            if (deck == null || deck.length != result){
                Card.find({}, (err, results) => {
                    deck = results;
                    res.render('addCard', {deck: deck});
                });
            } else {
                res.render('addCard', {deck: deck});
            }
        });  
    } else {
        Password.find({}, (err, password) => {
            if (req.body.password != password[0].pass){
                res.redirect('/');
            } else {
                Card.countDocuments({}, (err, result) => {
                    if (deck == null || deck.length != result){
                        Card.find({}, (err, results) => {
                            deck = results;
                            res.render('addCard', {deck: deck});
                        });
                    } else {
                        res.render('addCard', {deck: deck});
                    }
                });  
            }
        });
    }
});

app.get('/play', (req, res) => {

    Card.countDocuments({}, (err, result) => {
        var n = Math.floor(Math.random() * result);
        var randCard = deck[n];
        res.render('gameRoom', {card: randCard});
    });  

});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});