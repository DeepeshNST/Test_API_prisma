const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, prisma } = require('../src/index');
const { expect } = chai;

chai.use(chaiHttp);

describe('Usernames API', () => {
    before(async () => {
        await prisma.username.deleteMany(); 
    });

    after(async () => {
        await prisma.$disconnect();
    });

    describe('POST /usernames', () => {
        it('should create a new username', async () => {
            const res = await chai.request(app)
                .post('/usernames')
                .send({ username: 'test_user' });

            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('username', 'test_user');

            const user = await prisma.username.findFirst({
                where: { username: 'test_user' }
            });

            expect(user).to.not.be.null;
            expect(user).to.have.property('username', 'test_user');
        });
    });

    describe('GET /usernames', () => {
        it('should get all usernames', async () => {
            const res = await chai.request(app).get('/usernames');
            
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.above(0);

            const users = await prisma.username.findMany();
            expect(users).to.be.an('array');
            expect(users.length).to.be.above(0);
        });
    });

    describe('PUT /usernames/:id', () => {
        let userId;
        before(async () => {
            const user = await prisma.username.create({ data: { username: 'old_user' } });
            userId = user.id;
        });

        it('should update a username by id', async () => {
            const res = await chai.request(app)
                .put(`/usernames/${userId}`)
                .send({ username: 'updated_user' });

            expect(res).to.have.status(200);

            const updatedUser = await prisma.username.findUnique({
                where: { id: userId }
            });

            expect(updatedUser).to.have.property('username', 'updated_user');
        });
    });

    describe('DELETE /usernames/:id', () => {
        let userId;
        before(async () => {
            const user = await prisma.username.create({ data: { username: 'delete_user' } });
            userId = user.id;
        });

        it('should delete a username by id', async () => {
            const res = await chai.request(app).delete(`/usernames/${userId}`);
            
            expect(res).to.have.status(200);

            const deletedUser = await prisma.username.findUnique({
                where: { id: userId }
            });

            expect(deletedUser).to.be.null;
        });
    });
});
