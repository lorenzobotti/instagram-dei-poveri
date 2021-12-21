import  { MongoClient, Db } from 'mongodb'

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

const dbUri = `mongodb://db:27017/instagram`

let db: Db | undefined;


// export interface User {
//     _id?: ObjectId,

//     username: string,
//     fullName: string,
//     email: string,
//     password: string,

//     joinedDate: Date

//     follows: ObjectId[]
//     followers: ObjectId[]
//     posts: Post[]
// }


async function connect() {
    const client = new MongoClient(dbUri)
    await client.connect()

    db = await client.db('instagram')
    
    console.log('adding index')
    const res = await db?.collection('users').createIndex({ 'username': 1, 'email': 1 }, { unique: true })
    console.log({ res })
    
    // const deletion = await db?.collection('users').deleteOne({ username: 'mathik' })
    // console.log({ deletion })
}



export {
    db,
    connect,
}