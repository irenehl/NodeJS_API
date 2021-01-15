const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const mailer = require('../Utilities/SendgridMailer')
const User = require('../../Models/UserModel')
const { registerValidator, loginValidator, updateValidator } = require('./Validator')

const UserController = {
    register: async (req, res) => {
        try {
            await registerValidator(req.body)
            
            const notUnique = await User.find({ $or: [{username: req.body.username}, {email: req.body.email}]})

            if(notUnique.length != 0)
                throw "Email or username already exits"

            let hashedPassword = await bcrypt.hash(req.body.password, 10)

            let newUser = new User({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                phone: req.body.phone,
                dob: req.body.dob,
            })

            await newUser.save()
            return res.status(201).json({error: false, message: "Registered/Created"})
        }
        catch(err) {
            console.log(err);
            return res.status(400).json({error: true, message: err.details != null ? err.details[0].message : err})
        }
    },

    loginUser: async (req, res) =>  {
        try{
            await loginValidator(req.body)
    
            const user = (req.body.email == null) ? await User.findOne({username: req.body.username}) : 
                await user.findOne({email: req.body.email})
    
            if(!user)
                throw {error: true, message: "Wrong username or email"}
    
            console.log(user);
    
            var logged = await bcrypt.compare(req.body.password, user.password)
    
            if(!logged)
                throw {error: true, message: "Wrong password"}
    
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY)
            return res.status(200).json({error: false, message: "Ok", token: token})
        }
        catch(err) {
            console.log(err);
            return res.status(400).json({error: true, message: err.details != null ? err.details[0].message : JSON.stringify(err)})
        }
    },

    updateUser: async (req, res) =>  {
        try {
            await updateValidator(req.body)

            var actualUser = await User.findOne({_id: req.user._id})
            const matchUsers = await User.find({ $or: [{username: req.body.username}, {email: req.body.email}] })

            var unique = true
            if(matchUsers.length != 0)
                matchUsers.forEach(u => {
                    if(req.user._id != u._id)
                        if(u.username == req.body.username || u.email == req.body.email)
                            unique = false
                })

            if(!unique)
                throw {error: true, message: "Email or username already exits"}

            var hashedPassword = req.body.password == null ? null : 
                await bcrypt.hash(req.body.password, parseInt(process.env.SALT))

            actualUser = {
                name: req.body.name || actualUser.name,
                username: req.body.username || actualUser.username,
                email: req.body.email || actualUser.email,
                phone: req.body.phone || actualUser.phone,
                dob: req.body.dob || actualUser.dob,
                password: hashedPassword || actualUser.password
            }

            await User.findOneAndUpdate({_id: req.user._id}, actualUser)
            return res.status(200).json({error: false, message: "Updated"})
        }
        catch(err) {
            return res.status(400).json(err.details != null ? err.details[0].message : err)
        }
    },

    recoverPassword: async (req, res) =>  {
        try {
            var user = await User.findOne({email: req.body.email})
            
            if(!user)
                throw {error: true, message: "Email not found"}

            const token = jwt.sign({_id: user._id}, process.env.TOKEN_RESET_KEY, {expiresIn: '15m'})
            
            const recoverEmail = {
                to: req.body.email,
                from: process.env.MAIL,
                subject: "Elaniin Test: Recovering password",
                html:
                `
                    <h2>Hi ${user.name}</h2>
                    <p>If you want to recover your password, please enter in this link:</p>
                    <a href="${process.env.CLIENT_URL}/${token}" target="_blank">Recover</a>
                    <p></b>If you need help, send us a email ${process.env.DEVELOPER_EMAIL}</p>
                    <h3>Elaniin team</h3>
                `
            }

            await User.findOneAndUpdate({_id: user._id}, {recoveryToken: token})
            await mailer(recoverEmail)
            return res.header('Authorize', token).status(200).json({error: false, message: "Email sent"})
        }
        catch(err) {
            console.log(err);
            return res.status(500).json(err)
        }
    },

    requestPasswordHandler: async(req, res) => {
        try {
            const token = req.header('Authorize')

            if(!token)
                throw {error: true, message: "Access denied"}

            const verified = jwt.verify(token, process.env.TOKEN_RESET_KEY)

            if(!verified)
                throw {error: true, message: "Invalid token"}
            
            var user = await User.findOne({_id: verified._id})

            user.password = await bcrypt.hash(req.body.newPassword, 10)

            await User.findOneAndUpdate({_id: user._id},
                {password: user.password})

            return res.status(200).json({error: false, message: "Updated password, try login in"})
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({message: JSON.stringify(err)})
        }
    },

    getAllUsers: async (req, res) =>  {
        try{
            console.log(req.query);
            const { page = 1, limit = 12 } = req.query

            const users = await User.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const count = await User.countDocuments()

            return res.status(200).json({
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                users
            })
        }
        catch(err) {
            console.log(err);
            return res.status(500).json({error: true, message: "Ups, something went wrong"})
        }
    },

    getCurrentUser: async (req, res) =>  {
        const user = await User.findOne({_id: req.user._id})

        return res.status(200).json(user)
    },

    deleteUser: async (req, res) => {
        try {
            await User.findOneAndDelete({ _id: req.user._id})

            return res.status(200).json({error: false, message: "Deleted successfully"})
        }
        catch(err) {
            console.log(err);
            return res.status(400).json({error: true, message: "Ups! Something went wrong"})
        }
    }
}

module.exports = UserController