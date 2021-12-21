import { Router } from 'express'
import proxy from 'express-http-proxy'

import * as images from '../images/bin_db'


export const router = Router()

router.use('/', proxy(images.storageUrl))