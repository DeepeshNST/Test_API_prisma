const express = require('express');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.post('/usernames', async (req, res) => {
    const { username } = req.body;
    try {
        const newUser = await prisma.username.create({
            data: { username },
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/usernames', async (req, res) => {
    try {
        const users = await prisma.username.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('/usernames/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
    try {
        const updatedUser = await prisma.username.update({
            where: { id: parseInt(id, 10) },
            data: { username },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/usernames/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.username.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(200).send('Username deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { app, prisma };
