const aws = require('aws-sdk'), multer = require('multer')

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY
})

const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, '')
    }
})

const uploaderObject = {
    uploadMulter: multer({storage}),
    uploaderMethod: async function(file, location) {
        console.log('Ejecutando metodo');
        console.log(file)
        try{
            const params = {
                Bucket: process.env.AWS_BUCKET,
                Key: `${location}/${new Date().toISOString()}_${file.originalname}`,
                Body: file.buffer,
                ACL: 'public-read'
            }
    
            var { Location } = await s3.upload(params).promise()

            return Location
        }
        catch(err) {
            console.log(err)
        }
    }
}

module.exports = uploaderObject