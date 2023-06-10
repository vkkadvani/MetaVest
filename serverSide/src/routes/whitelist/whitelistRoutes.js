const express = require('express')
const { getWhitelist, addToWhitelist, removeFromWhitelist, getWhitelistToken } = require('../../controller/whitelist/whitelistController')
const { verifyToken } = require('../../middleware/loginMiddleware')
const { addWhitelistValidation } = require('../../../validation/validator/addWhitelistValidation')
const router = express.Router()

router.post('/whitelist', verifyToken, getWhitelist)
router.post('/whitelistToken', verifyToken, getWhitelistToken)
router.post('/addWhitelist', addWhitelistValidation, verifyToken, addToWhitelist)
router.delete('/removeWhitelist', verifyToken, removeFromWhitelist)

module.exports = router;