const { expect } = require('chai')

const { login, vesting, whitelist, Sequelize } = require('../../models');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const { execSync } = require('child_process');
const config = require('../../config/config.json');
const app = require('../../index.js');
const { apiBody, addTokenBody, loginBody, updateapiBody } = require("../Constant/apibody");
const { message } = require('../Constant/message');
const { log } = require('console');
const BaseUri = "http://localhost:3000"


const sequelize = new Sequelize(
    config.test.database,
    config.test.username,
    config.test.password,
    {
        host: config.test.host,
        dialect: config.test.dialect,
    },
);


describe("This is Backend testing", async () => {

    before(async () => {

        console.log("Before block");
        execSync(' npx sequelize-cli db:migrate --env test', {
            stdio: 'inherit',
        });
        await sequelize.sync({ force: true });
    })

    after(() => {
        console.log("after block");
        execSync(' npx sequelize-cli db:migrate:undo:all --env test', {
            stdio: 'inherit',
        });


    })

    it("Add new login data", async () => {

        const response = await request(BaseUri)
            .post('/newLogin')
            .set('Content-Type', 'application/json')
            .send(loginBody)

        const checkData = await login.findOne({
            where: {
                address: '0xC9399199f40686cfacF7Ae7555Ef0DEfa0487Ebe',
            }
        })
        expect(checkData).to.not.null;
        expect(response.status).to.equal(200);
        expect(response).to.be.an('object');
        expect(response.body.nounce).to.equal(checkData.nounce);
    })

    it("Get Login data", async () => {
        const response = await request(BaseUri)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(loginBody)

        const checkData = await login.findOne({
            where: {
                address: '0xC9399199f40686cfacF7Ae7555Ef0DEfa0487Ebe',
            }
        })
        expect(checkData).to.not.null;
        expect(response.status).to.equal(200);
        expect(response).to.be.an('object');
        expect(response.body.address).to.equal(checkData.address);
    })


    it("Add to Whitelist ", async () => {

        const response = await request(BaseUri)
            .post('/addWhitelist')
            .set('Content-Type', 'application/json')
            .send(addTokenBody)

        const checkData = await whitelist.findOne({
            where: {
                tokenAddress: '0x783adA73A6202083C03A90970e9d4C58cC275e6a',
            }
        })
        expect(checkData).to.not.null;
        expect(response.status).to.equal(200);
        expect(response).to.be.an('object');
        expect(response.body.message).to.equal(message.tokenAdded);
    })

    it("Insert Vesting data to Databse.", async () => {


        const response = await request(BaseUri)
            .post('/createVesting')
            .set('Content-Type', 'application/json')
            .send(apiBody)

        const checkData = await vesting.findOne({
            where: {
                beneficiary: '0xC9399199f40686cfacF7Ae7555Ef0DEfa0487Ebe',
            }
        })
        expect(checkData).to.not.null;
        expect(response.status).to.equal(200);
        expect(response).to.be.an('object');
        expect(response.body.message).to.equal(message.dataAdded);
    })

    it("Fetch Vesting Data", async () => {
        const response = await request(BaseUri)
            .post('/vesting')
            .set('Content-Type', 'application/json')
            .send(updateapiBody)

        const checkData = await vesting.findOne({
            where: {
                vestingId: 1
            }
        })
        expect(checkData).to.not.null;
        expect(response.status).to.equal(200);
        expect(response).to.be.an('object');
        expect((await (response.body)).vestingId).to.equal(1)
    })

    it("Fetch all current vesting", async () => {
        const response = await request(BaseUri)
            .post('/vestings')
            .set('Content-Type', 'application/json')
            .send(updateapiBody)

        const checkData = await vesting.findAll({
            where: {
                beneficiary: "0xC9399199f40686cfacF7Ae7555Ef0DEfa0487Ebe"
            }
        })
        expect(checkData).to.not.null;
        expect(response.status).to.equal(200);
        expect(response).to.be.an('object');
        expect(await response.body.length).to.equal(checkData.length)
    })

    it("Update Vesting data to Databse.", async () => {


        const response = await request(BaseUri)
            .post('/updateVesting')
            .set('Content-Type', 'application/json')
            .send(updateapiBody)

        const checkData = await vesting.findOne({
            where: {
                vestingId: 1
            }
        })
        expect(checkData).to.not.null;
        expect(response.status).to.equal(200);
        expect(response).to.be.an('object');
        expect(response.body.message).to.equal(message.update);
    })

    it("Remove Vesting data from Databse.", async () => {

        const removeVesting = await vesting.destroy({
            where: {
                vestingId: 1
            }
        })
        const checkData = await vesting.findOne({
            where: {
                vestingId: 1
            }
        })
        expect(checkData).to.be.null;
    })

    it("Fetch all Whitelist Tokens ", async () => {

        const response = await request(BaseUri)
            .post('/whitelist')
            .set('Content-Type', 'application/json')
            .send(addTokenBody)

        const checkData = await whitelist.findAll({
            where: {
                networkId: "80001"
            }
        })

        expect(checkData).to.not.null;
        expect(response.status).to.equal(200);
        expect(response).to.be.an('object');
        // expect(response.body.datavalues).to.equal(checkData);
    })

    it("Fetch Whitelisted Token", async () => {

        const response = await request(BaseUri)
            .post('/whitelistToken')
            .set('Content-Type', 'application/json')
            .send(addTokenBody)

        const checkData = await whitelist.findOne({
            where: {
                networkId: "80001",
                tokenAddress: "0x783adA73A6202083C03A90970e9d4C58cC275e6a"
            }
        })

        expect(checkData).to.not.null;
        expect(response.status).to.equal(200);
        expect(response).to.be.an('object');
        expect((await (response.body))[0].tokenAddress).to.equal("0x783adA73A6202083C03A90970e9d4C58cC275e6a");
    })

    it("Remove from Whitelist ", async () => {

        const response = await request(BaseUri)
            .delete('/removeWhitelist')
            .set('Content-Type', 'application/json')
            .send(addTokenBody)

        const checkData = await whitelist.findOne({
            where: {
                tokenAddress: '0x783adA73A6202083C03A90970e9d4C58cC275e6a',

            }
        })
        // expect(checkData).to.be.null;
        expect(response.status).to.equal(200);
        expect(response).to.be.an('object');
        expect(response.body.message).to.equal(message.removeToken);
    })
})