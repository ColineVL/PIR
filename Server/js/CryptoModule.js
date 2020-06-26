const crypto = require('crypto');
const Web3 = require('web3');
const provider = 'http://192.168.33.115:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(provider));

// function toBinary(input) {
//     var result = "";
//     for (var i = 0; i < input.length; i++) {
//         var bin = input[i].charCodeAt().toString(2);
//         result += Array(8 - bin.length + 1).join("0") + bin;
//     }
//     return result;
// }

module.exports = {
    // toBinary: function(input) {
    //     var result = "";
    //     for (let i = 0; i < input.length; i++) {
    //         const bin = input[i].charCodeAt().toString(2);
    //         result += Array(8 - bin.length + 1).join("0") + bin;
    //     }
    //     return result;
    // },
    toAscii: function(input) {
        let result = "";
        const arr = input.match(/.{1,8}/g);
        for (let i = 0; i < arr.length; i++) {
            result += String.fromCharCode((parseInt(arr[i], 2)).toString(10));
        }
        return result;
    },

    /* Get a prime of length l used for other Diffie Hellman functions*/
    GetPrime : function(l){
        const DH = crypto.createDiffieHellman(l);
        return [DH.getPrime().toString("hex"), DH.getGenerator().toString('hex') ];
    },

    /* One Time Pad , key length must be greater or equal than message. */
    OTP: function(key, message) {
        const res = [];
        for (let i = 0; i < Math.min(message.length, key.length) ; i++) {
            res.push(key[i] ^ message[i]);
        }
        return new Buffer.from(res,'hex');
    },

    /* Generate l random bytes */
    RandomBytes: function(length) {
        return crypto.randomBytes(length);
    },

    /* Generates a Diffie Hellmann pair  with a given prime and returns the private and public keys*/
    DiffieHellmanGenerate : function(prime) {
        const p = new Buffer.from(prime[0],'hex');
        const generator = new Buffer.from(prime[1],'hex');
        const DH = crypto.createDiffieHellman(p, generator);
        DH.generateKeys();

        return [DH.getPrivateKey(), DH.getPublicKey()];
    },

    /*Compute the secret given the info*/
    DiffieHellmanComputeSecret : function(prime, pub_key, private_key ,pub_key_other) {
        const p = new Buffer.from(prime[0],'hex');
        const generator = new Buffer.from(prime[1],'hex');
        const DH = crypto.createDiffieHellman(p, generator);
        DH.setPublicKey(pub_key);
        DH.setPrivateKey(private_key);
        return DH.computeSecret(pub_key_other);
    },

    /*Hash*/
    Hash: function (buff) {
        return web3.utils.keccak256(buff);
    },


    GetAvailableRefs: function (contractws, endTime, priceMax, provider) {
        const result = [];
        endTime = endTime || 0; //TODO Talk about endtime

        return result;
    },


};

// event NewDataReference(uint referenceId, address provider, uint price, uint contractEndTime);