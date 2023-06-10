const express = require('express')
const { getLoginData, addLoginData, verifySignature, generateNewAccessToken, verifyResult } = require('../../controller/login/loginController')
const { verifyToken } = require('../../middleware/loginMiddleware')
const { addLogindataValidation } = require('../../../validation/validator/addLogindataValidator')
const router = express.Router()
const cookieParser = require('cookie-parser');

router.use(cookieParser())
router.post('/login', getLoginData)
router.post('/newLogin', addLogindataValidation, addLoginData)
router.post('/authenticate', verifySignature)
router.post('/jwtauth', generateNewAccessToken)
router.post('/verifyJWT', verifyToken, verifyResult)

module.exports = router;