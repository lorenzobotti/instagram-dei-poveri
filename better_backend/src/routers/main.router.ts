import { router as usersRouter } from './user.router'
import { router as postsRouter } from './post.router'
import { router as privateRouter } from './private.router'
import { router as imageRouter } from './image.router'

import express, { Router } from 'express'
import morgan from 'morgan'
import cors from 'cors'

export const router = Router()
router.use(morgan('tiny'))
router.use(cors())

router.use('/users', usersRouter)
router.use('/posts', postsRouter)
router.use('/images', imageRouter)
router.use('/private', privateRouter)
router.post('/checkpayload', (req, res) => {
    res.json(req.body)
    console.log({ body: req.body })
    res.end()
})