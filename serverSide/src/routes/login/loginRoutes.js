const express = require('express')
const { getLoginData, addLoginData, verifySignature, generateNewAccessToken } = require('../../controller/login/loginController')
const router = express.Router()

router.post('/login', getLoginData)
router.post('/newLogin', addLoginData)
router.post('/authenticate', verifySignature)
router.post('/jwtauth', generateNewAccessToken)

module.exports = router;