import { ObjectId, ObjectID } from 'bson'
import * as bcrypt from 'bcrypt'

import { db } from '../db_conn'
import { User } from '../models/user.model'
import { Post, Comment } from '../models/post.model'
import * as images from '../images/bin_db'
import { getUser } from './user.controller'

export async function getPost(id: string): Promise<Post | null> {
    const postId = new ObjectID(id);

    const user = await db?.collection('posts').findOne({ _id: postId }) as Post | null
    return user
}

export async function newPost(author: string, contents: string, image?: Buffer) {
    const user = await db?.collection('users').findOne({ username: author }) as User | null
    if (!user) {
        throw `user not found: ${author}`
    }

    const post: Post = {
        author: user._id!,
        pubblished: new Date(),
        likes: [],
        contents: contents,
        comments: [],
    }

    if (image) {
        console.log('image was uploaded: adding to db')
        try {
            const id = await images.store(image)
            post.image = id
        } catch(e) {
            throw e
        }
    }

    const insertedPost = await db?.collection('posts').insertOne(post)
    if (!insertedPost?.insertedId) {
        throw "can't insert post"
    }

    await db?.collection('users').updateOne({ _id: user._id! }, { $addToSet: { posts: insertedPost?.insertedId }})
}

export async function deletePost(id: string) {
    const postId = new ObjectID(id)

    const post = await getPost(id)
    if (!post) {
        throw "can't find post"
    }

    const authorId = post.author

    const postDeletionResult = await db?.collection('posts').deleteOne({ _id: postId })
    const userDeletionResult = await db?.collection('users').updateOne({ _id: authorId }, { $pull: { posts: postId }})
}

export async function likePost(liker: string, id: string) {
    const user = await db?.collection('users').findOne({ username: liker }) as User | null
    if (!user) {
        throw `can't find user ${liker}`
    }
    
    const postId = new ObjectID(id)
    const poster = await db?.collection('posts').findOne({ _id: postId }) as Post | null
    if (!poster) {
        throw `can't find find poster: ${postId}`
    }

    await db?.collection('posts').updateOne({ _id: postId }, { $addToSet: { likes: user._id }})
    await db?.collection('users').updateOne({ _id: user._id }, { $push: { likes: postId }})
}

export async function unlikePost(liker: string, id: string) {
    const user = await getUser(liker)
    if (!user) {
        throw `can't find user ${liker}`
    }
    
    const postId = new ObjectID(id)
    const poster = await db?.collection('posts').findOne({ _id: postId }) as Post | null
    if (!poster) {
        throw `can't find find poster`
    }

    await db?.collection('posts').updateOne({ _id: postId }, { $pull: { likes: user._id }})
    await db?.collection('users').updateOne({ _id: user._id }, { $pull: { likes: postId }})
}

export async function addComment(on: string, authorUsername: string, contents: string) {
    const post = await getPost(on)
    const author = await getUser(authorUsername)
    if (!post || !author) {
        throw 'post or author not foound'
    }

    const commentId = new ObjectID()
    
    const comment: Comment = {
        _id: commentId,
        author: author._id!,
        contents,
        post: post._id!,
        pubblished: new Date(),
    }

    await db?.collection('posts').updateOne(
        { _id: post._id },
        { $push: { comments: comment }}
    )
}

// TODO: only delete comment if you're the author
export async function deleteComment(id: string, author?: string) {
    const commentId = new ObjectID(id)

    await db?.collection('posts').updateOne(
        { 'comments._id': commentId },
        { $pull: { comments: { _id: commentId }} }
    )
}
