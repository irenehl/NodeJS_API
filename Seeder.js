require('dotenv').config()
const fs = require('fs')
const casual = require('casual')
const mongoose = require('mongoose')
const { hash } = require('bcrypt')

const User = require('./Models/UserModel')
const Product = require('./Models/ProductModel')

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

casual.define('customProduct', function() {
    return new Product({
        SKU: casual.numerify('#-#-####'),
        name: casual.word,
        stock: casual.numerify('###'),
        price: casual.integer(1, 100),
        description: casual.description,
        img: 'https://picsum.photos/200/300'
    })
})

async function seedDatabase(limit) {
    await User.collection.drop()

    var storedUsers = []

    for(let i = 0; i < limit; i++) {
        let password = casual.password
        let hashedPassword = await hash(password, 10)
        let user = casual.customUser(hashedPassword)
        
        await user.save()
        console.log(`Seeding user ${i + 1} of ${limit}`)
        user.password = password
        storedUsers.push(user)
    }
    
    fs.writeFileSync('users.json', JSON.stringify(storedUsers))
    console.log('Completed')
}

async function seedDatabaseProduct(limit) {
    await Product.collection.drop()

    var storedProducts = []

    for(let i = 0; i < limit; i++) {
        let product = casual.customProduct
        await product.save()
        console.log(`Seeding product ${i + 1} of ${limit}`)
        storedProducts.push(product)
    }
    
    fs.writeFileSync('product.json', JSON.stringify(storedProducts))
    console.log('Completed')
}

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(async () => {
        await seedDatabase(25)
        console.log()
        await seedDatabaseProduct(25)
        process.exit()
    })
    .catch(err => {
        console.log(err)
    })
