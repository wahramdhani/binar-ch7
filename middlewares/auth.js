const jwt = require('jsonwebtoken');
const User = require('../models').User

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        let payload = await jwt.verify(token, 'rahasia');
        req.user = await User.findByPk(payload.id)
        next();
    } catch (error) {
        res.status(500);
        next(new Error('wrong token'))
    }
}