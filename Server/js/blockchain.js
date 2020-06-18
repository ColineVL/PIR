const Web3 = require('web3');
const provider = 'http://192.168.33.115:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(provider))

const Admin = require('web3-eth-admin').Admin;
const options = {
    defaultAccount: '0xfe3b557e8fb62b89f4916b721be55ceb828dbd73',
    defaultBlock: 'latest',
    defaultGas: 1,
    defaultGasPrice: 0,
    transactionBlockTimeout: 50,
    transactionConfirmationBlocks: 24,
    transactionPollingTimeout: 480,
};
const admin = new Admin(provider, null, options);

const SignedTransaction = require('./SignedTransactionModule');

/********************************
 * Variables
 ********************************/
let nodelistIDS = [];
let blockslistNUMBERS = [];
// TODO let the user change this ?
const nbBlocksToPrint = 5;

/********************************
 * Accounts
 ********************************/

async function getBalance(addressToCheck) {
    let bal = await web3.eth.getBalance(addressToCheck);
    bal = web3.utils.fromWei(bal, 'ether');
    return bal;
}

async function createNewAccount() {
    return web3.eth.accounts.create();
}

async function getAccount(privateKey) {
    try {
        let account = web3.eth.accounts.privateKeyToAccount(privateKey);
        return account;
    }
    catch(err) {
        return {error:"Bad private key."};
    }
}

/********************************
 * Nodes
 ********************************/
//setInterval(refreshNodesList, 2000);
async function refreshNodesList() {
    let PeerCount = await web3.eth.net.getPeerCount();
    let peers = await admin.getPeers();
    nodelistIDS = [];
    for (let i = 0; i < PeerCount; i++) {
        nodelistIDS.push(peers[i].id);
    }
}

/********************************
 * Create a transaction
 ********************************/

async function createTransaction(jsonInfo) {
    jsonInfo = JSON.parse(jsonInfo);
    const receipt = await SignedTransaction.createAndSendSignedTransaction(provider, jsonInfo["amount"], jsonInfo["privateKey"], jsonInfo["sender"], jsonInfo["receiver"]);
    //,0.001,'8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','0xfe3b557e8fb62b89f4916b721be55ceb828dbd73','0xf17f52151EbEF6C7334FAD080c5704D77216b732');
    return receipt;
}

/********************************
 * Blocks
 ********************************/

// Update of the list of last blocks numbers
//setInterval(refreshBlocksNUMBERSList, 2000);

function callbackBlocksNUMBERSlist() {
    if (nbBlocksToPrint === blockslistNUMBERS.length) {
        blockslistNUMBERS.sort();
        blockslistNUMBERS.reverse();
    }
}

function refreshBlocksNUMBERSList() {
    blockslistNUMBERS = [];
    web3.eth.getBlockNumber().then((n) => {
        for (let i = n - nbBlocksToPrint + 1; i <= n; i++) {
            web3.eth.getBlock(i).then((json) => {
                blockslistNUMBERS.push(json["number"]);
                callbackBlocksNUMBERSlist();
            });
        }
    });
}

async function getBlockInfo(blocknumber) {
    return web3.eth.getBlock(blocknumber);
}


/********************************
 * Exports
 ********************************/

async function getNodelistIDS() {
    await refreshNodesList();
    return nodelistIDS;
}

function getBlockslistNUMBERS() {
    refreshBlocksNUMBERSList();
    return blockslistNUMBERS;
}

module.exports = {
    getNodelistIDS,
    getBlockslistNUMBERS,
    getBlockInfo,
    getBalance,
    getAccount,
    createNewAccount,
    createTransaction,
};