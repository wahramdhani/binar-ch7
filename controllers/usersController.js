const User = require('../models').User
const bcrypt = require('bcrypt')
const passport = require('passport')



const format = (user) => {
    const {id, username, role} = user
    console.log(user);
    return {
        id,
        username,
        role,
        accessToken: user.generateToken()
    }
}

const createUser = async (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt)
    try {
        const { username, role} = req.body;
        const cekusername = await User.findOne({
            where: {
                username: username
            },
        });
        if (cekusername) {
            return res.status(400).json({
                status: 'failed',
                message: 'username already exist!'
            })
        }
            const register = await User.create({
                username,
                password: hash,
                role
            });
            return res.status(200).json({
                status: 'success',
                message: 'username created',
                data: {
                    data: register
                }
            })

        }
        catch (error) {
            res.status(400).json({
                status: 'failed',
                error: [err.message]
            })
        }
};

const login = async(req, res) => {
    const {username, password} = req.body
    let user = {}
    try {
        user = await User.findOne({
            where: {
                username: username
            }
        })
        if(!user) {
            return res.status(400).json({
                status: 'failed',
                message: "username doesn't exists"
            })
        }
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                status: 'failed',
                message: 'wrong password'
            })
        }
        res.cookie('jwt', user.generateToken())
        return res.status(200).json({
            status: 'success',
            message: 'user logged in',
        }), format(user)
    } catch (error) {
        return res.status(400).json({
            status: 'failed',
            message: 'internal server error'
        })
    }
}

const loginPage = async(req, res) => {
    try {
        const user = await User.authenticate(req.body)
        return res.status(200).json({
            status: 'success',
            message : 'user logged in'
        }), user
    } catch (error) {
        return res.status(400).json({
            status: 'failed',
            message: "internal server error"
        })
    }
}

const getLoginPage = (req, res) => {
    res.render('login')
}


module.exports = {
    createUser,
    login,
    getLoginPage,
    loginPage
}

