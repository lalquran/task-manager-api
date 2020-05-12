const request = require('supertest')
const app = require('../src/app')
const { userOne, userOneId, setupDatabase} = require('./fixtures/db')
const User = require('../src/models/user')

beforeEach(setupDatabase)

test('Should signup a new user', async ()  => {
    const response = await request(app).post('/users').send({
        name: 'Laith',
        email: 'Lmalquran@example.com',
        password: 'passwor'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Laith',
            email: 'lmalquran@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('passwor')
})

test('Should not signup user with invalid name', async () => {
    const response = await request(app).post('/users').send({
        name: '',
        email: 'Lmalquran@example.com',
        password: 'passwor'
    }).expect(400)
})

test('Should not signup user with invalid email', async () => {
    const response = await request(app).post('/users').send({
        name: 'Laith',
        email: 'Lmalquranexample.com',
        password: 'passwor'
    }).expect(400)
})

test('Should not signup user with duplicate email', async () => {
    const response = await request(app).post('/users').send({
        name: 'Laith',
        email: 'Laith@example.com',
        password: 'passwor'
    }).expect(400)
})

test('Should not signup user with invalid password', async () => {
    const response = await request(app).post('/users').send({
        name: 'Laith',
        email: 'lmalquran@example.com',
        password: 'passwr'
    }).expect(400)
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        token: user.tokens[1].token
    })
})

test('Should not login nonexistent user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'wrongPass'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Frank'
        })
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.name).toBe('Frank')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Frank'
        })
        .expect(400)
})

test('Should not update user if unauthenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Frank'
        })
        .expect(401)
})

test('Should not update user with invalid name', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: ''
        })
        .expect(400)
})

test('Should not update user with invalid email', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: ''
        })
        .expect(400)
})

test('Should not update user with duplicate email', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'laith@example.com'
        })
        .expect(400)
})

test('Should not update user with invalid password', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: ''
        })
        .expect(400)
})