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
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-19/274780090_159438849761471_7371793005368998181_n.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=kIdyNKV0ZV0AX8s1P_C&tn=Db0hpeV57mFux8Qw&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT82eKVlYo7KXrD5s_ALET-VUdSuYCKH6HpScwoz63HtBQ&oe=6249B1FB&_nc_sid=7bff83',
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
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-19/16585455_697733803734680_1110860812567707648_a.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=l58r4NGGTdEAX9PuPGo&tn=Db0hpeV57mFux8Qw&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT9e74aI0qlsCd3EhGNfDR4VYw9pXiUg6mtL8tR1m2bbkg&oe=624929A4&_nc_sid=7bff83',
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
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-19/127413157_372900680481401_5972264633973779004_n.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=ohR2ehRthjIAX_brbmO&tn=Db0hpeV57mFux8Qw&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT9n00fbjito-neZA-xJUAaKi_l1CQoFTqagOE5KKX8Cpg&oe=62482FF0&_nc_sid=7bff83',
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
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277443259_757453168505754_7751590657412126682_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=L90AY_ejVWQAX8f4OrC&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT_0_sOeWHkKquI0aYLIk8Z1rq634lUux5ezTnOh8FrClg&oe=624A469D&_nc_sid=7bff83',
        caption: 'These fact were bought two you by you\'re truly.'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277453765_132898195979298_2612047626344966303_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=iOxoREKtDh0AX_LjHwq&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT_X3d0PhbUiizlRV8-fQI6KmiyXf-tIYv416_lz-R2sOw&oe=624A0699&_nc_sid=7bff83',
        caption: 'Smaller feet were considered more desirable for marriage.'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277417268_753236778936129_4415792898691112968_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=RAwfoEdj_gwAX_xLhEc&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT8ATfr7huw4ywUqzSFWU1Bk5nS452CwJKYxDNL1kAbzMg&oe=6249D439&_nc_sid=7bff83',
        caption: 'What is your first language?'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277453663_158997583175303_6382159863414819958_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=KBovS8eUpCoAX_BOynE&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT9N5fj5ZyDuVAln_D1CCjyttLXDr4zRlOX9dLgTEutPag&oe=6249AF4A&_nc_sid=7bff83',
        caption: 'Because Tolkien\'s son used to play with a toy known as Bingo Bear Koala.'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277435954_1085329988700389_8748074042433026173_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=N3T6nrk_pJQAX912H3E&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT98SoNE0KF4ZEGHqp5ytLV2VUu2jmwWAVUBFDXicI9Slg&oe=62493A18&_nc_sid=7bff83',
        caption: 'SteppenWolf'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277332499_683764409437059_7441880725875596964_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=uWSz9ZJqhXgAX-8CN6I&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT_uHE5Xg0IAnQtf8ulkkncg2jMUy-SQV6PNf2inyvXHZA&oe=62499EC1&_nc_sid=7bff83',
        caption: 'Ferrero gets these hazelnuts from Turkey, Italy, and Chile.'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277047266_418562530074568_7028952945274143780_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=ht29ro8AJa0AX8Mv4OZ&tn=Db0hpeV57mFux8Qw&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT-iT9Gmxn9Uxg2JEnfLezB8hutPDKJmDFk_2HE33xv6eg&oe=624A2EBC&_nc_sid=7bff83',
        caption: 'Inmates had to defend a point of view with which they fiercely disagreed: “Resolved: Public schools in the United States should have the ability to deny enrollment to undocumented students.”'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/276985590_998388811070600_4785170048069716444_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=qKAygkhpPR0AX93T6TK&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT8dimMU419r5H7H_oX3jTeKmATAf1ExbFQON0sdXHEqCw&oe=6249D126&_nc_sid=7bff83',
        caption: 'I never considered Ackbar “ugly”'
    },
    {
        user: {
            connect: {
                id: 6
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277062546_276931164608743_733245906703891307_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=hjqDLPlahd4AX8ZNZyu&edm=APU89FABAAAA&ccb=7-4&oh=00_AT8vsHW67H4T3AEsqHlqfKv-3k8rHzc0ctxtjqxZuat4Cg&oe=624A9DC0&_nc_sid=86f79a',
        caption: 'Fair enough.'
    },

    {
        user: {
            connect: {
                id: 5
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277414237_1506975223038704_6981696663255683755_n.jpg?stp=dst-jpg_e35&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=YQHBrqQA_y8AX86C9gj&edm=ALQROFkBAAAA&ccb=7-4&ig_cache_key=MjgwMzcwNzk1OTcyMjMyNzkyMQ%3D%3D.2-ccb7-4&oh=00_AT9ODilM9Lc9BYxd0o4NHjMam2gibr45r4hDxmUU5FAVHg&oe=6249CCA1&_nc_sid=30a2ef',
        caption: 'When the joke is so good they high five your face'
    },
    {
        user: {
            connect: {
                id: 5
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277479037_977525152897115_7315674363477577381_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=8_IwbrIbCWkAX8rOF79&edm=APU89FABAAAA&ccb=7-4&oh=00_AT-P6qOj0PfOeGG-HfscrmJW1WWmhCsd4X18Xi7QBJy28g&oe=624A27B4&_nc_sid=86f79a',
        caption: 'Are you suggesting my music taste is bad?😒'
    },
    {
        user: {
            connect: {
                id: 5
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277292631_156388510102621_1899804391540999454_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=TsRnAgICWUMAX8cRszL&edm=APU89FABAAAA&ccb=7-4&oh=00_AT-sa4VBXR-RUAkak8RNepCQV3v0F7t-dmlgKPJIqHL_WQ&oe=62496337&_nc_sid=86f79a',
        caption: 'The grass is always greener on the other side'
    },

    {
        user: {
            connect: {
                id: 7
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/277457769_3284389631840749_896158257125187806_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=Z2DLCgD0OmMAX8rR4Rm&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT8McvVdMIY8RrggJOtL69ZmdqLjy_932Fw8X88hIp4qmA&oe=62497746&_nc_sid=7bff83',
        caption: 'Will Smith slapped Chris Rock at the 2022 Oscars to defend his wife, Jada Pinkett Smith.'
    },
    {
        user: {
            connect: {
                id: 7
            }
        },
        image: 'https://instagram.fprn13-1.fna.fbcdn.net/v/t51.2885-15/275899333_164971689214262_1721862882842370329_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=instagram.fprn13-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=QNKfhd_WYt8AX8AjrZC&edm=APU89FABAAAA&ccb=7-4&oh=00_AT8Dz_nP0UajcO0v7FBk0kwEame-bufWgWzF6OPUMosx-A&oe=624A0D01&_nc_sid=86f79a',
        caption: 'A 67-year-old Asian woman was punched more than 100 times and stomped and spat on while entering her apartment building in Yonkers, New York.'
    },
    {
        user: {
            connect: {
                id: 1
            }
        },
        image: 'https://images.pexels.com/photos/8685171/pexels-photo-8685171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    },
    {
        user: {
            connect: {
                id: 2
            }
        },
        image: 'https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        user: {
            connect: {
                id: 3
            }
        },
        image: 'https://images.pexels.com/photos/11090150/pexels-photo-11090150.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
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