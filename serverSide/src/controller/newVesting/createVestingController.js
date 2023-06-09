const { where } = require('sequelize');
const { whitelist, vesting } = require('../../../models')

const crateVesting = async (req, res) => {
    try {
        let {
            beneficiary,
            locked,
            starttime,
            cliff,
            slicePeriod,
            endTime,
            networkId,
            tokenId,
            amount,
            recieveOnInterval,
            claimed
        } = req.body;
        let decimal
        try {
            const list = await whitelist.findOne({
                where: { networkId: networkId, whitelistId: tokenId }
            })
            const whitelistdata = await list.dataValues
            decimal = whitelistdata.decimals
        }
        catch (e) {
            console.log(e);
            res.json(e)
        }
        amount = (amount / (10 ** decimal))
        recieveOnInterval = ((recieveOnInterval / (10 ** decimal)))
        const Vesting = await vesting.create({
            beneficiary,
            locked,
            starttime,
            cliff,
            slicePeriod,
            endTime,
            networkId,
            tokenId,
            amount,
            recieveOnInterval,
            claimed
        })
        res.status(200).json({ message: "Vesting Created successfully." })
    }
    catch (e) {
        console.log(e);
        res.json(e)
    }
}

const getVesting = async (req, res) => {
    try {

        const { networkId, vestingId, beneficiary } = req.body;

        let vesting_data = await vesting.findOne({
            where: {
                vestingId: vestingId,
                networkId: networkId,
                beneficiary: beneficiary
            }
        })
        let token_data = (await vesting_data.getWhitelist()).dataValues
        vesting_data = { ...vesting_data.dataValues, token_data }
        res.status(200).json(vesting_data)
    }
    catch (e) {
        console.log(e);
        res.status(400).json(e)
    }
}

const getAllVesting = async (req, res) => {
    try {

        const { networkId, beneficiary } = req.body;

        let vesting_data = await vesting.findAll({
            where: {
                networkId: networkId,
                beneficiary: beneficiary
            }
        })
        // vesting_data.forEach(e => {
        //     // console.log(e.dataValues);
        //     let d = e
        //     console.log((d.getwhitelist()).dataValues);
        // })
        // let token_data = (await vesting_data[0].getwhitelist()).dataValues
        // console.log(token_data);
        // vesting_data = { ...vesting_data.dataValues, token_data }
        res.status(200).json(vesting_data)
    }
    catch (e) {
        console.log(e);
        res.json(e)
    }
}

const updateVesting = async (req, res) => {
    try {

        const { vestingId, claimed, beneficiary, networkId } = req.body;

        const updateVesting = await vesting.update({ claimed: claimed }, {
            where: {
                vestingId: vestingId,
                beneficiary: beneficiary,
                networkId: networkId
            }
        })
        res.status(200).json({ message: "claimed Updated" })
    }
    catch (e) {
        console.log(e);
        res.status(400).json(e)
    }
}

module.exports = {
    crateVesting,
    getVesting,
    getAllVesting,
    updateVesting
}