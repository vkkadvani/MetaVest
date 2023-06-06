const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')



const verifyToken = (req, res, next) => {
    try {
        const { accsessToken, secretkey } = req.body
        jwt.verify(accsessToken, secretkey, (err, decode) => {
            if (err) {
                res.status(400).json({ verify: false })
            }
            else {
                next()
            }
        })
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ error: e })
    }
}

module.exports = {
    verifyToken
}