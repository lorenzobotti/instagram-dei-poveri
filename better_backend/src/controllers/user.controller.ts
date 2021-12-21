import { ObjectID } from 'bson'
import * as bcrypt from 'bcrypt'

import { db } from '../db_conn'
import { User } from '../models/user.model'

const usersCollection = db?.collection('users')


export async function getUserById(id: string): Promise<User | undefined> {
    // return await db?.collection('users').findOne({ _id: new ObjectID(id) }) as User
    return await queryUser({ _id: new ObjectID(id) })
}

export async function getUser(username: string): Promise<User | undefined> {
    // return await db?.collection('users').findOne({ username }) as User
    return await queryUser({ username })
}

async function queryUser(query: any): Promise <User | undefined> {
    const result = await db?.collection('users').aggregate([
        { $match: query },
        { $lookup: {
            from: 'users',
            localField: 'follows',
            foreignField: '_id',
            as: 'follows'
        }},
        { $lookup: {
            from: 'users',
            localField: 'followers',
            foreignField: '_id',
            as: 'followers'
        }},
        { $lookup: {
            from: 'posts',
            localField: 'posts',
            foreignField: '_id',
            as: 'posts'
        }},
        { $project: { password: 0 }}
    ]).toArray()
    
    console.log({ result })
    
    return result?.pop() as User | undefined
}

export async function allUsers(): Promise<User[]> {
    // return await db?.collection('users').find({}).toArray() as User[]
    return await db?.collection('users').aggregate([
        { $lookup: {
            from: 'users',
            localField: 'follows',
            foreignField: '_id',
            as: 'follows'
        }},
        { $lookup: {
            from: 'users',
            localField: 'followers',
            foreignField: '_id',
            as: 'followers'
        }},
        { $lookup: {
            from: 'posts',
            localField: 'posts',
            foreignField: '_id',
            as: 'posts'
        }},
        { $project: { password: 0 }},
    ]).toArray() as User[]
}

export async function checkPassword(username: string, password: string): Promise<boolean> {
    const user = await db?.collection('users').findOne({ username }) as User
    if (!user) {
        return false
    }

    console.log({ user })

    const savedPassword = user.password
    console.log({ savedPassword })
    return await bcrypt.compare(password, savedPassword)
}

export async function newUser(username: string, fullName: string, email: string, passwordRaw: string) {
    const password = await bcrypt.hash(passwordRaw, 10)

    const user: User = {
        username,
        fullName,
        email,
        password,

        bio: "",
        joinedDate: new Date,
        
        followers: [],
        follows: [],
        likes: [],
        posts: [],
    }

    console.log({ user })

    const added = await db?.collection('users').insertOne(user)
    console.log({ added })
}

export async function changeBio(username: string, bio: string) {
    await db?.collection('users').updateOne({ username }, { bio })
}

export async function follow(followerUsername: string, followedUsername: string) {
    const follower = await db?.collection('users').findOne({ username: followerUsername }) as User | null
    const followed = await db?.collection('users').findOne({ username: followedUsername }) as User | null

    if (!follower || !followed) {
        throw `could not find followed or follower`
    }

    await db?.collection('users').updateOne(
        { username: followerUsername },
        { $addToSet: { follows: followed._id }}    
    )
    
    await db?.collection('users').updateOne(
        { username: followedUsername },
        { $addToSet: { followers: follower._id }}    
    )   
}

export async function unfollow(followerUsername: string, followedUsername: string) {
    const follower = await db?.collection('users').findOne({ username: followerUsername }) as User | null
    const followed = await db?.collection('users').findOne({ username: followedUsername }) as User | null

    if (!follower || !followed) {
        throw `could not find followed or follower`
    }

    await db?.collection('users').updateOne(
        { username: followerUsername },
        { $pullAll: { follows: [followed._id] }}    
    )
    
    await db?.collection('users').updateOne(
        { username: followedUsername },
        { $pullAll: { followers: [follower._id] }}    
    )   
}
