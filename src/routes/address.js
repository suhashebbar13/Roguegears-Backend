const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { addAddress, getAddress } = require('../controller/address');
const router = express.Router();


router.post('/user/address/create',  addAddress);
router.post('/user/getaddress', requireSignin, userMiddleware, getAddress);

module.exports = router;