import express, { response, Router } from 'express'
import multer from 'multer'
import cors from 'cors'

import { generate, tokenMiddleware } from '../tokens'
import { db } from '../db_conn'
import * as images from '../images/bin_db'

import { User } from '../models/user.model'
import { Post } from '../models/post.model'

import { changeBio, checkPassword, follow, getUser, getUserById, unfollow } from '../controllers/user.controller'
import { addComment, deleteComment, deletePost, likePost, newPost, unlikePost } from '../controllers/post.controller'

export const router = Router()

const jsonMiddleware = express.json()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.use(cors())
router.use((req, res, next) => {
    console.log('json/form middleware')
    
    if (req.url.startsWith('/post') && req.method == 'POST') {
        upload.single('image')(req, res, next)
    } else {
        jsonMiddleware(req, res, next)
    }
})

router.use(async (req, res, next) => {
    console.log('authentication middlware')

    if (req.url.startsWith('/login')) {
        next()
    } else {
        await tokenMiddleware(req, res, next)
        // next()
    }
})


router.post('/login/:username', async (req, res) => {
    console.log({ loginBody: req.body })
    const username = req.params.username
    const password = req.body.password as string | undefined

    if (!password) {
        res.status(400)
        res.end()
        return
    }

    console.log({ password })

    try {
        if (await checkPassword(username, password)) {
            console.log({ getting: username })
            const user = await db?.collection('users').findOne({ username }) as User | null

            if (user) {
                const token = await generate({ id: user._id, username })
                res.send(token)
                res.end()
                return
            } else {
                res.status(404)
                res.end()
                return
            }
        } else {
            res.status(401)
            res.end()
            return
        }
    } catch(e) {
        console.error(e)
    }
})

router.post('/post', async (req, res) => {
    const username = (req as any).user?.username

    const body = req.body
    console.log({ body })

    const imageFile = (req as any).file as Buffer | undefined

    try {
        await newPost(username, body.contents, imageFile)
    } catch(e) {
        console.error(e)
        res.status(500)
    }

    res.end()
})

router.post('/textpost', async (req, res) => {
    const username = (req as any).user?.username

    const body = req.body
    console.log({ body })

    try {
        await newPost(username, body.contents)
    } catch(e) {
        console.error(e)
        res.status(500)
    }

    res.end()
})

router.delete('/post/:id', async (req, res) => {
    const username = (req as any).user?.username
    const id = req.params.id

    try {
        await deletePost(id)
    } catch(e) {
        console.error(e)
        res.status(500)
    }

    res.end()
})


router.post('/like/:id', async (req, res) => {
    const postId = req.params.id
    const user = (req as any).user.username
    if (!user) {
        res.status(401)
        res.end()
        return
    }

    try {
        await likePost(user, postId)
    } catch(e) {
        console.error(e)
        res.status(500)
    }

    res.end()
})

router.delete('/like/:id', async (req, res) => {
    const postId = req.params.id
    const user = (req as any).user.username
    if (!user) {
        res.status(401)
        res.end()
        return
    }

    try {
        await unlikePost(user, postId)
    } catch(e) {
        console.error(e)
        res.status(500)
    }

    res.end()
})

router.post('/follow/:username', async (req, res) => {
    const follower = (req as any).user.username!
    const followed = req.params.username

    try {
        await follow(follower, followed)
    } catch(e) {
        console.error(e)
        res.status(500)
    }

    res.end()
})

router.delete('/follow/:username', async (req, res) => {
    const follower = (req as any).user.username!
    const followed = req.params.username

    try {
        await unfollow(follower, followed)
    } catch(e) {
        console.error(e)
        res.status(500)
    }

    res.end()
})

router.post('/comments/:postId', async (req, res) => {
    const postId = req.params.postId
    const author = (req as any).user.username
    const contents = req.body.contents

    if (!author || !contents) {
        res.status(400)
        res.end()
        return
    }

    try {
        await addComment(postId, author, contents)
    } catch(e) {
        console.error(e)
        res.status(500)
    }

    res.end()
})

router.delete('/comments/:commentId', async (req, res) => {
    const commentId = req.params.commentId
    const author = (req as any).user.username
    // const contents = req.body.contents

    // if (!author || !contents) {
    //     res.status(400)
    //     res.end()
    //     return
    // }

    try {
        await deleteComment(commentId, author)
    } catch(e) {
        console.error(e)
        res.status(500)
    }

    res.end()
})

router.put('/bio', async (req, res) => {
    const user = (req as any).user.username!
    const newBio: string | undefined = req.body.bio

    if (!newBio) {
        res.status(400)
        res.end()
        return
    }

    changeBio(user, newBio)
})