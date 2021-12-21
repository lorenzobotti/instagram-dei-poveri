import express, { Router } from 'express'
import { body, validationResult } from 'express-validator'
import * as bcrypt from 'bcrypt'

import { allUsers, getUser, getUserById, newUser } from '../controllers/user.controller'
import { User } from '../models/user.model'
import { db } from '../db_conn'

const router = Router()
router.use(express.json())

router.get('/', async (req, res) => {
    const users = await allUsers()
    if (users) {
        res.send(users)
    }

    res.end()
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const user = await getUserById(id)
    if (user) {
        res.json(user)
        res.end()
        return
    } else {
        res.status(404)
        res.end()
        return
    }
})

router.get('/username/:username', async (req, res) => {
    const username = req.params.username
    const user = await getUser(username)
    if (user) {
        res.json(user)
        res.end()
        return
    } else {
        res.status(404)
        res.end()
        return
    }
})

const saltRounds = 10
router.post(
    '/', 
    // body('username').isLength({ min: 5 }),
    // body('fullName').isLength({ min: 5 }),
    // body('password').not().isEmpty(),
    // body('email').isEmail(),
    async (req, res) => {
        // const errors = validationResult(req)
        // if (errors) {
        //     console.error({ errors })
        //     res.status(400)
        //     res.end()
        //     return
        // }

        const username = req.body.username
        const fullName = req.body.fullName
        const password = req.body.password
        const email = req.body.email

        console.log({ username, fullName, password, email })
        
        try {
            await newUser(username, fullName, email, password)
        } catch(e) {
            console.error(e)
            res.status(500)
        }

        res.end()
    }
)

export {
    router,
}

