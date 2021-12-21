import { ObjectID } from 'bson'
import express from 'express'

import { connect, db } from './db_conn'
import { router } from './routers/main.router'



const app = express()

app.use('/', router)

main()
async function main() {
    await connect()


    app.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`)
    })
}





