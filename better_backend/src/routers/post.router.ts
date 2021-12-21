import express, { Router } from 'express'
import { body, validationResult } from 'express-validator'
import * as bcrypt from 'bcrypt'

import { allUsers, getUser, getUserById, newUser } from '../controllers/user.controller'
import { User } from '../models/user.model'
import { db } from '../db_conn'
import { ObjectID, ObjectId } from 'bson'
import { getPost, newPost } from '../controllers/post.controller'

const router = Router()
router.use(express.json())


router.get('/:id', async (req, res) => {
    const post = await getPost(req.params.id)
    res.json(post)
})

export {
    router,
}