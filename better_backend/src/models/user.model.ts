import { ObjectID } from 'bson'
import { Post } from './post.model'

export interface User {
    _id?: ObjectID,

    username: string,
    fullName: string,
    email: string,
    password: string,

    bio: string,
    profilePic?: string,

    joinedDate: Date

    follows: ObjectID[]
    followers: ObjectID[]
    likes: ObjectID[]
    posts: ObjectID[]
}