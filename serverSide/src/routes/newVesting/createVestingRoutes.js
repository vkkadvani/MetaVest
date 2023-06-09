const express = require('express')
const { crateVesting, getVesting, getAllVesting, updateVesting } = require('../../controller/newVesting/createVestingController')
const { verifyToken } = require('../../middleware/loginMiddleware')
const { vestingCreationValidation } = require('../../../validation/validator/createVestingValidation')
const router = express.Router()

router.post('/vesting', verifyToken, getVesting)
router.post('/vestings', verifyToken, getAllVesting)
router.post('/createVesting', vestingCreationValidation, verifyToken, crateVesting)
router.post('/updateVesting', verifyToken, updateVesting)




// router.delete('/removeWhitelist', removeFromWhitelist)

module.exports = router;