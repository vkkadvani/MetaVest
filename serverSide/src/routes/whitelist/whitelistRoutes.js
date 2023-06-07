const express = require('express')
const { getWhitelist, addToWhitelist, removeFromWhitelist, getWhitelistToken } = require('../../controller/whitelist/whitelistController')
const router = express.Router()

router.post('/whitelist', getWhitelist)

router.post('/whitelistToken', getWhitelistToken)
router.post('/addWhitelist', addToWhitelist)
router.delete('/removeWhitelist', removeFromWhitelist)

module.exports = router;