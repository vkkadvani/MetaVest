const jwt = require('jsonwebtoken');
const address = '0xC9399199f40686cfacF7Ae7555Ef0DEfa0487Ebe';
const token = jwt.sign({ address }, 'metavestbest');
const currentTime = new Date().getTime();
const start = 1686288815;
const cliff = 60;
const end_timestamp = 1686288935;
const networkId = '80001';
const tokenId = 1

const apiBody = {
    beneficiary: "0xC9399199f40686cfacF7Ae7555Ef0DEfa0487Ebe",
    locked: true,
    starttime: ((start * 1000) + currentTime),
    cliff: ((cliff * 1000) + currentTime),
    slicePeriod: 60,
    endTime: ((end_timestamp * 1000) + currentTime),
    networkId: networkId,
    tokenId: tokenId,
    amount: 100,
    recieveOnInterval: 50,
    claimed: 0,
    secretkey: "metavestbest",
    accsessToken: token
}
const updateapiBody = {
    beneficiary: "0xC9399199f40686cfacF7Ae7555Ef0DEfa0487Ebe",
    locked: true,
    starttime: ((start * 1000) + currentTime),
    cliff: ((cliff * 1000) + currentTime),
    slicePeriod: 60,
    endTime: ((end_timestamp * 1000) + currentTime),
    networkId: networkId,
    tokenId: tokenId,
    amount: 100,
    recieveOnInterval: 50,
    claimed: 100,
    secretkey: "metavestbest",
    accsessToken: token,
    vestingId: 1,
}
const addTokenBody = {
    tokenAddress: "0x783adA73A6202083C03A90970e9d4C58cC275e6a",
    tokenName: "CasinoCase",
    tokenSymbol: "CCT",
    networkId: "80001",
    decimals: 18,
    secretkey: "metavestbest",
    accsessToken: token
}
const loginBody = {
    address: "0xC9399199f40686cfacF7Ae7555Ef0DEfa0487Ebe",
    nounce: 234
}
module.exports = {
    apiBody,
    addTokenBody,
    token,
    updateapiBody,
    loginBody
}