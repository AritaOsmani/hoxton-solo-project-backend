import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import fileUpload from 'express-fileupload'

const prisma = new PrismaClient({ log: ['error', 'query', 'info', 'warn'] })
const app = express()
app.use(express.json())
app.use(cors())
app.use(fileUpload())
const PORT = 4000;

app.use(express.static('images'))

app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    //@ts-ignore
    const file = req.files.file;
    //@ts-ignore
    file.mv(`C:/Users/Admin/OneDrive/Desktop/Hoxton/Practice/hoxton-solo-project-backend/images/` + file.name, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        //@ts-ignore
        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    })
})



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

app.post('/createPost', async (req, res) => {
    const token = req.headers.authorization || ''
    const { image, caption } = req.body
    try {
        const user = await getUserFromToken(token)
        if (user) {
            const newPost = await prisma.post.create({ data: { image, caption, userId: user.id } })
            res.status(200).send(newPost)
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

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
            const followers = await prisma.user.findMany({ where: { id: user.id }, include: { following: true } })
            const followersIndexes: number[] = []
            for (const index of followers[0].following) {
                followersIndexes.push(index.id)
            }
            const posts = await prisma.post.findMany({
                where: {
                    userId: {
                        in: followersIndexes
                    }
                },
                include: {
                    user: true,
                    comments: {
                        include: {
                            user: true
                        }
                    },
                    likes: {
                        include: {
                            user: true
                        }
                    },
                    _count: {
                        select: { comments: true, likes: true }
                    }
                },

            })
            res.send(posts)
        } else {
            throw Error('Invalid token')
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany({ include: { following: true, followedBy: true } })
    res.status(200).send(users)
})

app.get('/users/:username', async (req, res) => {
    const username = req.params.username
    try {
        const userMatches = await prisma.user.findUnique({
            where: { username }, include: { followedBy: true, following: true, posts: true, _count: { select: { followedBy: true, following: true, posts: true } } }
        })
        if (userMatches) {
            res.status(200).send(userMatches)
        } else {
            res.status(404).send({ error: 'User not found' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/suggestions', async (req, res) => {
    const token = req.headers.authorization || ''
    try {
        const user = await getUserFromToken(token)
        if (user) {
            const userFollowing = await prisma.user.findMany({ where: { id: user.id }, include: { following: true } })
            let response = await prisma.user.findMany()
            for (const u of userFollowing[0].following) {
                response = response.filter(acc => acc.id !== u.id)
            }
            response = response.filter(r => r.id !== user.id)
            res.status(200).send({ suggested: response })
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/followedBy', async (req, res) => {
    const token = req.headers.authorization || ''
    const { username } = req.body
    try {
        const userLogged = await getUserFromToken(token)
        if (userLogged) {
            const userLoggedFollowing = await prisma.user.findUnique({ where: { id: userLogged.id }, include: { following: true } })
            const otherUserFollowers = await prisma.user.findUnique({ where: { username }, include: { followedBy: true } })
            //@ts-ignore
            let mutual = userLoggedFollowing.following.filter(item => {
                //@ts-ignore
                let found = otherUserFollowers.followedBy.filter(i => i.id === item.id)
                if (found.length !== 0) {
                    return true
                }
            })
            res.status(200).send(mutual)
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/comments/:postId', async (req, res) => {
    const postId = Number(req.params.postId)
    try {
        const comments = await prisma.comment.findMany({ where: { postId }, include: { user: true, replies: { include: { user: true } } } })
        res.status(200).send(comments)

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/comments', async (req, res) => {
    const token = req.headers.authorization || ''
    const { content, postId } = req.body
    try {
        const user = await getUserFromToken(token)
        if (user) {
            //check if the post exists:
            const postExists = await prisma.post.findUnique({ where: { id: postId } })
            if (postExists) {
                const newComment = await prisma.comment.create({ data: { content, userId: user.id, postId: postId }, include: { user: true } })
                res.status(200).send(newComment)
            } else {
                res.status(404).send({ error: 'Post not found!' })
            }

        } else {
            res.status(400).send({ error: 'Invalid token' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/like', async (req, res) => {
    const token = req.headers.authorization || ''
    const { postId } = req.body
    try {
        const user = await getUserFromToken(token)
        if (user) {
            //Check if the post exists:
            const postExists = await prisma.post.findUnique({ where: { id: postId } })
            if (postExists) {
                //Check if the user has already liked the post:
                const alreadyLiked = await prisma.like.findFirst({ where: { userId: user.id, postId: postId } })
                if (alreadyLiked) {
                    res.status(400).send({ error: 'You already liked this post' })
                } else {
                    const newLike = await prisma.like.create({ data: { postId, userId: user.id }, include: { user: true } })
                    res.status(200).send(newLike)
                }
            } else {
                res.status(404).send({ error: 'Post does not exist' })
            }
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/dislike', async (req, res) => {
    const token = req.headers.authorization || ''
    const { postId } = req.body
    try {
        const user = await getUserFromToken(token)
        if (user) {
            //Check if the post exists:
            const postExists = await prisma.post.findUnique({ where: { id: postId } })
            if (postExists) {
                //Check if the user liked the post:
                const likedPost = await prisma.like.findFirst({ where: { userId: user.id, postId: postId } })
                if (likedPost) {
                    const likedRemoved = await prisma.like.delete({ where: { id: likedPost.id } })
                    res.status(200).send(likedRemoved)
                } else {
                    res.status(400).send({ error: 'You can\'t dislike this post!' })
                }
            } else {
                res.status(404).send({ error: 'Post not found' })
            }
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/likes/:postId', async (req, res) => {
    const postId = Number(req.params.postId)
    try {
        const likes = await prisma.like.findMany({ where: { postId }, include: { user: true } })
        res.status(200).send(likes)
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.patch('/follow', async (req, res) => {
    const token = req.headers.authorization || ''
    const { userToFollowUsername } = req.body
    try {
        const user = await getUserFromToken(token)
        if (user) {
            const updatedUser = await prisma.user.update({ where: { id: user.id }, data: { following: { connect: { username: userToFollowUsername } } }, include: { following: true } })
            res.status(200).send(updatedUser)
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.patch('/unfollow', async (req, res) => {
    const token = req.headers.authorization || ''
    const { username } = req.body
    try {
        const user = await getUserFromToken(token)
        if (user) {
            const userWithNewFollowing = await prisma.user.update({ where: { id: user.id }, data: { following: { disconnect: { username } } }, include: { following: true } })
            res.status(200).send(userWithNewFollowing)
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/getUserFollowers/:username', async (req, res) => {
    const username = req.params.username
    try {
        const userMatch = await prisma.user.findUnique({ where: { username }, include: { followedBy: true } })
        if (userMatch) {
            const followers = userMatch.followedBy
            res.status(200).send(followers)
        } else {
            res.status(404).send({ error: 'User not found' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/getUserFollowing/:username', async (req, res) => {
    const username = req.params.username
    try {
        const userMatch = await prisma.user.findUnique({ where: { username }, include: { following: true } })
        if (userMatch) {
            const following = userMatch.following
            res.status(200).send(following)
        } else {
            res.status(404).send({ error: 'User not found' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/post/:id', async (req, res) => {
    const id = Number(req.params.id)
    try {
        const post = await prisma.post.findUnique({ where: { id }, include: { comments: true, likes: true, user: true, _count: { select: { comments: true, likes: true } } } })
        if (post) {
            res.status(200).send(post)
        } else {
            res.status(404).send({ error: 'Post not found!' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/checkIfLiked', async (req, res) => {
    const token = req.headers.authorization || ''
    const { postId } = req.body
    try {
        const user = await getUserFromToken(token)
        if (user) {
            const liked = await prisma.like.findFirst({ where: { userId: user.id, postId: postId } })
            if (liked) {
                res.status(200).send(liked)
            } else {
                res.status(404).send({ error: 'Not liked' })
            }
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }


    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })

    }
})

app.get('/getUserPosts/:username', async (req, res) => {
    const username = req.params.username
    try {
        const user = await prisma.user.findUnique({ where: { username } })
        if (user) {
            const posts = await prisma.post.findMany({ where: { userId: user.id }, include: { comments: true, likes: true } })
            res.status(200).send(posts)
        } else {
            res.status(404).send({ error: 'User not found!' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/stories', async (req, res) => {
    const token = req.headers.authorization || ''
    try {
        const user = await getUserFromToken(token)
        if (user) {
            const followers = await prisma.user.findMany({ where: { id: user.id }, include: { following: true } })
            const followersIndexes: number[] = []
            for (const index of followers[0].following) {
                followersIndexes.push(index.id)
            }
            const stories = await prisma.story.findMany({
                where: {
                    userId: {
                        in: followersIndexes
                    }
                },
                include: { user: true },
                orderBy: { status: 'asc' }
            })
            res.status(200).send(stories)
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/stories/:id', async (req, res) => {
    const id = Number(req.params.id)
    try {
        const story = await prisma.story.findUnique({ where: { id }, include: { user: true } })
        const updateStatus = await prisma.story.update({ where: { id }, data: { status: 'passive' } })
        res.status(200).send(story)

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/passive', async (req, res) => {
    try {
        const stories = await prisma.story.findMany({ where: { status: 'passive' }, include: { user: true } })
        res.status(200).send(stories)
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/addReply', async (req, res) => {
    const token = req.headers.authorization || ''
    const { content, commentId } = req.body
    try {
        const user = await getUserFromToken(token)
        if (user) {
            const newReply = await prisma.reply.create({ data: { content: content, userId: user.id, commentId }, include: { user: true } })
            res.status(200).send(newReply)
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/commentReplies/:commentId', async (req, res) => {
    const commentId = Number(req.params.commentId)
    try {
        const replies = await prisma.reply.findMany({ where: { commentId }, include: { user: true } })
        res.status(200).send(replies)
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.patch('/search', async (req, res) => {
    const token = req.headers.authorization || ''
    const { search } = req.body
    try {
        const user = await getUserFromToken(token)
        if (user) {
            const updateUser = await prisma.user.update({ where: { id: user.id }, data: { searching: { connect: { username: search } } }, include: { searching: true } })
            res.status(200).send(updateUser)
        } else {
            res.status(400).send({ error: 'Invalid token' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/accountsBySearch', async (req, res) => {
    const { searchInput } = req.body
    try {
        const account = await prisma.user.findMany({ where: { username: { contains: searchInput } } })
        if (account) {
            res.status(200).send(account)
        } else {
            res.status(404).send({ error: 'User not found' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.get('/recents', async (req, res) => {
    const token = req.headers.authorization || ''
    try {
        const user = await getUserFromToken(token)
        if (user) {
            const userSearches = await prisma.user.findUnique({ where: { id: user.id }, include: { searching: true } })
            if (userSearches) {
                res.status(200).send(userSearches.searching)
            } else {
                res.status(404).send({ error: 'Not found' })
            }

        } else {
            res.status(400).send({ error: 'Invalid token' })
        }

    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})