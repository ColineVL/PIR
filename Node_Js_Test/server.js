const express = require('express');
const bc = require('./js/blockchain');
const EventsModule = require('./js/EventsModule');

/********************************
 * Create the app
 ********************************/
const app = express();
// Load the css folder
app.use(express.static(__dirname + '/css'));
// Load the js files
app.use(express.static(__dirname + '/js'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/********************************
 * Register the URLs
 ********************************/
app.use('/public', express.static(__dirname + '/public'))

    .get('', function (req, res) {
        res.render('home.ejs');
    })

    /** Main gets **/

    .get('/connect/:privateKey', async (req, res) => {
        let account = await bc.getAccount(req.params.privateKey);
        res.json(account);
    })

    .get('/updatenodelist/', async (req, res) => {
        let liste = bc.getNodelistIDS();
        res.json(liste);
    })

    .get('/getnodeinfo/:nodeID', async (req, res) => {
        let info = await bc.getNodeInfo(req.params.nodeID);
        res.json(info);
    })

    .get('/updatelistBlocks/', async (req, res) => {
        let info = bc.getBlockslistNUMBERS();
        res.json(info);
    })

    .get('/getblockinfo/:blocknumber', async (req, res) => {
        let info = await bc.getBlockInfo(req.params.blocknumber);
        res.json(info);
    })

    .get('/getbalance/:addressToCheck', async (req, res) => {
        let bal = await bc.getBalance(req.params.addressToCheck);
        res.json(bal);
    })

    .get('/newaccount/', async (req, res) => {
        let info = await bc.createNewAccount();
        res.json([info["address"], info["privateKey"]]);
    })

    .get('/maketransaction/:jsonInfo', async (req, res) => {
        let receipt = await bc.createTransaction(req.params.jsonInfo);
        res.json(receipt);
    })

    /** Buy gets **/

    .get('/getreferences/', async (req, res) => {
        let Ids = await EventsModule.GetAvailableRefs();
        res.json(Ids);
    })

    .get('/getrefinfo/:id', async (req, res) => {
        let product = await EventsModule.GetRef(req.params.id);
        console.log("Product ")
        console.log(product);
        res.json(product);
    })


    /** Sell gets **/



    /** Redirection to home if the page is not found **/
    .use(function (req, res, next) {
        res.redirect('/');
    })



    .listen(8081);