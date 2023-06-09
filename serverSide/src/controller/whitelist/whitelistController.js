const { whitelist } = require('../../../models')


const getWhitelist = async (req, res) => {
    try {
        const networkId = req.body.networkId;
        const list = await whitelist.findAll({
            where: { networkId: networkId }
        })
        res.status(200).json(list)
    }
    catch (e) {
        console.log(e);
        res.status(400).json(e)
    }
}
const addToWhitelist = async (req, res) => {
    try {
        const { tokenAddress, tokenName, tokenSymbol, networkId, decimals } = req.body;
        const list = await whitelist.create({
            tokenAddress,
            tokenName,
            tokenSymbol,
            networkId,
            decimals
        });

        res.status(200).json({ message: "Token added to whitelist." })
    }
    catch (e) {
        console.log(e);
        res.json({ error: e })
    }
}

const removeFromWhitelist = async (req, res) => {
    try {
        const { tokenAddress, networkId } = req.body;
        console.log(tokenAddress, networkId);
        const list = await whitelist.destroy({
            where: { tokenAddress: tokenAddress, networkId: networkId }
        })
        console.log(list)
        if (list !== 0)
            res.status(200).json({ message: "Token removed from whitelist." })
    }
    catch (e) {
        console.log(e);
        res.json(e)
    }
}

const getWhitelistToken = async (req, res) => {
    try {
        const { networkId, tokenAddress } = req.body;
        const list = await whitelist.findAll({
            where: { networkId: networkId, tokenAddress: tokenAddress }
        })
        res.status(200).json(list)
    }
    catch (e) {
        console.log(e);
        res.status(200).json(e)
    }
}

module.exports = {
    addToWhitelist,
    getWhitelist,
    removeFromWhitelist,
    getWhitelistToken
}