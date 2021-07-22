# Users and Products API

## Summary 
[Description](#Description)\
[Installation](#Installation)\
[Database seeding](#Seeding)\
[Environment](#Environment)\
[Entities/Schemas](#Entities)\
[Endpoints](#Endpoints)

## Description

This API was create in NodeJS with express web framework. 

## Installation

+ Read [dependencies](#Dependencies) section.
+ Clone repository.
+ Install every dependency run `npm install`
+ Create a *dotenv* file with the variables specified in [environment seccion](#Environment).
+ To test in development mode run `npm run devStart` script.

## Dependencies

Listed on [package.json](https://github.com/irenehl/NodeJS_API/blob/master/package.json)

## Seeding

To seed: `npm run seed` script. 
The seeding process execution consists of a casual (npm module) 
instance creating mockup data for every document field after deleting every existing collection.

## Environment

The API needs the next enverionment variables. There are in a dotenv file

| Variable         |
|------------------|
| PORT             |
| MONGO_URI        |
| TOKEN_KEY        |
| TOKEN_RESET_KEY  |
| SENDGRID_API_KEY |
| MAIL             |
| DEVELOPER_EMAIL  |
| CLIENT_URL       |
| AWS_BUCKET       |
| AWS_KEY_ID       |
| AWS_KEY          |

## Entities

The base of the API are ***products and users*** so, these are the schemas that are handled on mongoose

### Product Schema
    SKU: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    img: String
    
### User Schema
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    dob: Date

## Endpoints

Endpoints are documented and handled in **Insomnia** client, refer to [Insomnia JSON file](https://github.com/irenehl/NodeJS_API/blob/master/Docs/Insomnia_2021-01-14.json) and import it to client.

