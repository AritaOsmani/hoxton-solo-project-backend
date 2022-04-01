import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'


const prisma = new PrismaClient()


const users: Prisma.UserCreateInput[] = [
    {
        username: 'arita',
        email: 'arita@email.com',
        firstName: 'Arita',
        lastName: 'Osmani',
        image: 'https://avatars.dicebear.com/api/avataaars/Arita.svg',
        password: bcrypt.hashSync('arita', 8),
        accountStatus: 'private',
        verified: false
    },
    {
        username: 'artiola',
        email: 'artiola@email.com',
        firstName: 'Artiola',
        lastName: 'Caka',
        password: bcrypt.hashSync('artiola', 8),
        image: `https://avatars.dicebear.com/api/avataaars/Artiola.svg`,
        accountStatus: 'private',
        verified: false
    },
    {
        username: 'desintila',
        email: 'desintila@email.com',
        firstName: 'Desintila',
        lastName: 'Luzi',
        password: bcrypt.hashSync('desintila', 8),
        following: {
            connect: [{
                id: 1
            },
            {
                id: 2
            }
            ]
        }
    },
    {
        username: 'nicolas',
        email: 'nicolas@email.com',
        firstName: 'Nicolas',
        lastName: 'Marcora',
        image: 'https://avatars.dicebear.com/api/avataaars/Nicolas.svg',
        password: bcrypt.hashSync('nicolas', 8),
        following: {
            connect: [
                {
                    id: 1
                },
                {
                    id: 2
                },
                {
                    id: 3
                }
            ]
        },
        searchedFor: {
            connect: {
                id: 1
            }
        }
    },
    {
        username: '9gag',
        email: '9gag@email.com',
        firstName: '9gag',
        password: bcrypt.hashSync('9gag', 8),
        verified: true,
        bio: 'Building Memeland, one meme at a time',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/9gag_logo.svg/1200px-9gag_logo.svg.png',
        followedBy: {
            connect: [{
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            },
            {
                id: 4
            }
            ]
        }
    },
    {
        username: '8fact',
        email: '8fact@email.com',
        firstName: '8fact',
        password: bcrypt.hashSync('8fact', 8),
        verified: true,
        bio: 'Get Your Facts Straight.',
        image: 'data:image/png;base64,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',
        following: {
            connect: {
                id: 5
            }
        },
        followedBy: {
            connect: [
                {
                    id: 1,
                },
                {
                    id: 2
                },
                {
                    id: 3
                }
            ]
        }
    },
    {
        username: 'impact',
        email: 'impact@email.com',
        firstName: 'impact',
        password: bcrypt.hashSync('impact', 8),
        bio: 'Your friends already follow us for digestible and socially-impactful content. You should too.',
        image: 'https://impact.site/assets/images/image01.png?v=a9b33076',
        verified: true,
        followedBy: {
            connect: [
                {
                    id: 2
                },
                {
                    id: 3
                }
            ]
        }
    }
]

const posts: Prisma.PostCreateInput[] = [
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'post_1.jpg',
        caption: 'These fact were bought two you by you\'re truly.'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'post_2.jpg',
        caption: 'Smaller feet were considered more desirable for marriage.'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'post_3.jpg',
        caption: 'What is your first language?'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'post_4.jpg',
        caption: 'Because Tolkien\'s son used to play with a toy known as Bingo Bear Koala.'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'post_5.jpg',
        caption: 'SteppenWolf'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'post_6.jpg',
        caption: 'Ferrero gets these hazelnuts from Turkey, Italy, and Chile.'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'post_7.jpg',
        caption: 'Inmates had to defend a point of view with which they fiercely disagreed: “Resolved: Public schools in the United States should have the ability to deny enrollment to undocumented students.”'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'post_8.jpg',
        caption: 'I never considered Ackbar “ugly”'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'post_9.jpg',
        caption: 'Fair enough.'
    },

    {
        user: {
            connect: {
                id: 5
            }
        },
        image: 'post_10.jpg',
        caption: 'When the joke is so good they high five your face'
    },
    {
        user: {
            connect: {
                id: 5
            }
        },
        image: 'post_11.jpg',
        caption: 'Are you suggesting my music taste is bad?😒'
    },
    {
        user: {
            connect: {
                id: 5
            }
        },
        image: 'post_12.jpg',
        caption: 'The grass is always greener on the other side'
    },

    {
        user: {
            connect: {
                id: 7
            }
        },
        image: 'post_13.jpg',
        caption: 'Will Smith slapped Chris Rock at the 2022 Oscars to defend his wife, Jada Pinkett Smith.'
    },
    {
        user: {
            connect: {
                id: 7
            }
        },
        image: 'post_14.jpg',
        caption: 'A 67-year-old Asian woman was punched more than 100 times and stomped and spat on while entering her apartment building in Yonkers, New York.'
    },
    {
        user: {
            connect: {
                id: 1
            }
        },
        image: 'pexel-photo-1.jpeg'
    },
    {
        user: {
            connect: {
                id: 2
            }
        },
        image: 'pexels-photo-2.jpeg'
    },
    {
        user: {
            connect: {
                id: 3
            }
        },
        image: 'pexel-photo-3.jpeg'
    }
]

async function createStuff() {
    for (const user of users) {
        await prisma.user.create({ data: user })
    }
    for (const post of posts) {
        await prisma.post.create({ data: post })
    }
}

createStuff()