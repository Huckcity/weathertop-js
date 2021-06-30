// Server setup
require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

// Database setup
const { MongoClient } = require('mongodb')
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

async function run() {
    try {
        await client.connect()

        const database = client.db('dev')
        const testes = database.collection('test')
        const recs = testes.countDocuments()
            .then(res => {
                console.log(res)
            })
    } catch (error) {
        console.log(error)
        client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('helllo there')
})

app.listen(port, () => {
    console.log(`Example app listening on http:/localhost:${port}`)
})