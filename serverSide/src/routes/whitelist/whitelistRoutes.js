const express = require('express')
const { getWhitelist, addToWhitelist, removeFromWhitelist, getWhitelistToken } = require('../../controller/whitelist/whitelistController')
const { verifyToken } = require('../../middleware/loginMiddleware')
const router = express.Router()

router.post('/whitelist', getWhitelist)

router.post('/whitelistToken', verifyToken, getWhitelistToken)
router.post('/addWhitelist', verifyToken, addToWhitelist)
router.delete('/removeWhitelist', verifyToken, removeFromWhitelist)

module.exports = router;