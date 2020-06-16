
const Web3 = require('web3');
var Tx = require('ethereumjs-tx');
let fs = require("fs");


// Web3 Initialisation
var provider = 'http://192.168.33.115:8545';
console.log("******************************************");
console.log("Using provider : " + provider);
console.log("******************************************");
var web3 = new Web3(new Web3.providers.HttpProvider(provider))
var web3ws = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.33.115:8546'))
//


//////////////////////////////////Account Info///////////////////////////////////////////////////////
var account1= "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";//"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
var key1 =new Buffer.from('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3','hex');//'8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63','hex');
/////////////////////////////////////////////////////////////////////////////////////////:

// ABI description as JSON structure
let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"uint256","name":"publicKey","type":"uint256"}],"name":"NewClient","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"contractEndTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"publicKey","type":"uint256"}],"name":"NewDataReference","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"bytes32","name":"encryptedKeyHash","type":"bytes32"}],"name":"encryptedKeyHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"uint256","name":"time","type":"uint256"}],"name":"raiseDisputeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":true,"internalType":"address","name":"loser","type":"address"},{"indexed":false,"internalType":"uint256","name":"funds","type":"uint256"}],"name":"settledDispute","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"referenceId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":true,"internalType":"uint256","name":"funds","type":"uint256"}],"name":"withdrawRefund","type":"event"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"uint256","name":"_publicKey","type":"uint256"}],"name":"buy_reference","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_contractEndTime","type":"uint256"},{"internalType":"uint256","name":"_publicKey","type":"uint256"}],"name":"createDataReference","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"dataReferences","outputs":[{"internalType":"uint256","name":"referenceId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"referenceKey","type":"uint256"},{"internalType":"uint256","name":"contractEndTime","type":"uint256"},{"internalType":"address","name":"provider","type":"address"},{"internalType":"bool","name":"withdrawnFunds","type":"bool"},{"internalType":"uint256","name":"clientDisputes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClientDisputes","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"bool[]","name":"","type":"bool[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"getClients","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"raiseDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setDisputePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"bytes32","name":"_encryptedKeyHash","type":"bytes32"}],"name":"setEncryptedHashedKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"},{"internalType":"address payable","name":"client","type":"address"}],"name":"settleDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawDisputeFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_referenceId","type":"uint256"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const gasPrice = 1000;//web3.eth.gasPrice;
const gasPriceHex = web3.utils.numberToHex(gasPrice);
const gasLimitHex = web3.utils.numberToHex(4000000);

const contract = new web3.eth.Contract(abi,'0x42699A7612A82f1d9C36148af9C77354759b210b');

const transactionObject = {
    from: account1,
    gas: web3.utils.numberToHex(3000000),
    gasPrice: gasPrice
};

const setuint1ref = contract.methods.createDataReference(,,).encodeABI();
// const getDataRef = contract.methods.getDataReferences(0).encodeABI();


//
//
(async () => {
    const nonceval = await web3.eth.getTransactionCount(account1, "pending"); //'0x' + new Date().getTime();
    console.log(nonceval)
    var fTx1 = {
        nonce: nonceval,
        to : '0x42699A7612A82f1d9C36148af9C77354759b210b',
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data:setuint1ref ,
        from: account1,
        //value: 3//web3.utils.toWei('1', 'ether'),
    };


    var txx1 = new Tx(fTx1);
    // var txx2 = new Tx(fTx2);
    // var txx3 = new Tx(fTx3);
    txx1.sign(key1);
    // txx2.sign(key1);
    // txx3.sign(key1);

    var sTx1 =txx1.serialize();
    // var sTx2 =txx2.serialize();
    // var sTx3 =txx3.serialize();


    // const dataOld = await web3.eth.sendSignedTransaction('0x' + sTx1.toString('hex'));
    // const dataOld1 = await web3.eth.sendSignedTransaction('0x' + sTx1.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // }).on('error', function(error){
    //     console.log(error);
    // });
    // console.log("..........." + Object.keys(dataOld1))
    // const dataOld2 = await web3.eth.sendSignedTransaction('0x' + sTx2.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // }).on('error', function(error){
    //     console.log(error);
    // });
    // const dataOld3 = await web3.eth.sendSignedTransaction('0x' + sTx3.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // }).on('error', function(error){
    //     console.log(error);
    // });




    // const dataNew = await web3.eth.sendSignedTransaction('0x' + sTx3.toString('hex')).on('receipt', function(receipt){
    //     console.log(receipt);
    // });
    // console.log("*************************************");
    // const map = await contract.methods.dataReferences(0).call(transactionObject);
    // // const data2 = await contract.methods.data2().call(transactionObject);
    // // const data = await contract.methods.getData().call(transactionObject);
    // console.log("data refs :" + map.clients);
    // console.log(map)
    // // console.log("data2 :" + data2);
    // console.log("map of 10 :" + map);



    // console.log("data before :" + dataOld);
    // console.log("data before :" +dataNew);



    // const contractws = new web3ws.eth.Contract(abi,'0x42699A7612A82f1d9C36148af9C77354759b210b');
    // const events = await contractws.events.NewDataReference({
    //     fromBlock: 0
    // })
    //     .on('data', function(event){
    //         console.log(event); // same results as the optional callback above
    //     })
    //
    // console.log(events.callback())
    // console.log("**********************************");
    // contractws.getPastEvents("NewClient", {
    //     fromBlock: 0,
    //     toBlock: 'latest'
    // }, function(error, events){ console.log(events); })
    //     .then(function(events){
    //         console.log(events) // same results as the optional callback above
    //     });
})();





// console.log('**********************************Events*************************************************')
// //
// const contractws = new web3ws.eth.Contract(abi,'0x9B8397f1B0FEcD3a1a40CdD5E8221Fa461898517');
// events = contractws.events.NewClient({
//     fromBlock: 0
// }, function(error, event){ console.log("**********" + event); })
//     .on('data', function(event){
//         // console.log(event); // same results as the optional callback above
//     })
//     .on('changed', function(event){
//         // remove event from local database
//     })
//     .on('error', console.error);
//
// console.log(typeof events[0])
// //     // toBlock: 'latest'




