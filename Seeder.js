require('dotenv').config()
const fs = require('fs')
const casual = require('casual')
const mongoose = require('mongoose')
const { hash } = require('bcrypt')

const User = require('./Models/UserModel')

casual.define('customUser', function(hashedPassword) {
    return new User({
        name: casual.name,
        username: casual.username,
        email: casual.email,
        phone: casual.numerify('########'),
        dob: new Date().toISOString(),
        password: hashedPassword
    })
})

async function seedDatabase() {
    await User.collection.drop()

    var storedUsers = []

    for(let i = 0; i < 25; i++) {
        let password = casual.password
        let hashedPassword = await hash(password, 10)
        let user = casual.customUser(hashedPassword)
        
        await user.save()
        user.password = password
        storedUsers.push(user)
    }
    
    fs.writeFileSync('users.json', JSON.stringify(storedUsers))
    console.log('Completed')
    process.exit()
}

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
        seedDatabase()
    })
    .catch(err => {
        console.log(err)
    })
