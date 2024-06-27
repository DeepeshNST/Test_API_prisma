const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, prisma } = require('../src/index');
const { expect } = chai;

chai.use(chaiHttp);

describe('Usernames API', () => {
    before(async () => {
        await prisma.username.deleteMany(); // Clear the table before running tests
    });

    after(async () => {
        await prisma.$disconnect();
    });

    describe('POST /usernames', () => {
        it('should create a new username', (done) => {
            chai.request(app)
                .post('/usernames')
                .send({ username: 'test_user' })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('username', 'test_user');
                    done();
                });
        });
    });

    describe('GET /usernames', () => {
        it('should get all usernames', (done) => {
            chai.request(app)
                .get('/usernames')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.above(0);
                    done();
                });
        });
    });

    describe('PUT /usernames/:id', () => {
        let userId;
        before(async () => {
            const user = await prisma.username.create({ data: { username: 'old_user' } });
            userId = user.id;
        });

        it('should update a username by id', (done) => {
            chai.request(app)
                .put(`/usernames/${userId}`)
                .send({ username: 'updated_user' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    chai.request(app)
                        .get('/usernames')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            const updatedUser = res.body.find(user => user.id === userId);
                            expect(updatedUser).to.have.property('username', 'updated_user');
                            done();
                        });
                });
        });
    });

    describe('DELETE /usernames/:id', () => {
        let userId;
        before(async () => {
            const user = await prisma.username.create({ data: { username: 'delete_user' } });
            userId = user.id;
        });

        it('should delete a username by id', (done) => {
            chai.request(app)
                .delete(`/usernames/${userId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    chai.request(app)
                        .get('/usernames')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            const deletedUser = res.body.find(user => user.id === userId);
                            expect(deletedUser).to.be.undefined;
                            done();
                        });
                });
        });
    });
});
