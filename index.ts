import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient({ log: ['error', 'query', 'info', 'warn'] })
const app = express()
app.use(express.json())
app.use(cors())
const PORT = 4000;

function generateToken(id: number) {
    //@ts-ignore
    const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: '1day' })
    return token;
}

async function getUserFromToken(token: string) {
    //@ts-ignore
    const userId = jwt.verify(token, process.env.SECRET)
    //@ts-ignore
    const user = await prisma.user.findUnique({ where: { id: userId.id } })
    return user;
}

app.post('/login', async (req, res) => {
    const { email_username, password } = req.body
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: email_username
                    },
                    {
                        username: email_username
                    }
                ]
            }
        })

        if (user) {
            const decrypted = bcrypt.compareSync(password, user.password)
            const token = generateToken(user.id)
            if (decrypted) {
                res.status(200).send({ user, token })
            } else {
                res.status(400).send({ error: 'username,email/password invalid' })
            }


        } else {
            res.status(404).send({ error: 'User not found!' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/signup', async (req, res) => {
    const { username, email, firstName, lastName, password } = req.body
    try {
        const encryptedPassword = bcrypt.hashSync(password, 8)
        const newUser = await prisma.user.create({ data: { username, email, firstName, lastName, password: encryptedPassword } })
        const token = generateToken(newUser.id)
        res.status(200).send({ user: newUser, token })
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/validate', async (req, res) => {
    const token = req.headers.authorization || ''
    try {
        const user = await getUserFromToken(token)
        if (user) {
            res.status(200).send(user)
        } else {
            throw Error('Invalid token')
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/posts', async (req, res) => {
    const token = req.headers.authorization || ''
    try {
        const user = await getUserFromToken(token)
        if (user) {
            const followers = await prisma.user.findMany({
                where: { id: user.id }, include: {
                    following: {
                        include: {
                            posts: true
                        }
                    }
                }
            })
            res.status(200).send(followers)
        } else {
            throw Error('Invalid token')
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})