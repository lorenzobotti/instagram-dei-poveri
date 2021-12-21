import { ObjectID } from 'bson';

export interface Post {
    _id?: ObjectID
    author: ObjectID,

    contents: string,
    image?: string,
    pubblished: Date

    likes: ObjectID[]
    comments: Comment[]
}

export interface Comment {
    _id?: ObjectID,

    author: ObjectID,
    post: ObjectID,

    contents: string,
    pubblished: Date,
}