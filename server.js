import http from "http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { faker } from "@faker-js/faker";

function getListDataMessage() {
    return {
        id: faker.string.uuid(),
        from: faker.internet.email(),
        subject: "Hello from " + faker.internet.userName(),
        body: faker.lorem.sentence(),
        received: Date.now(),
    };
}

let messages = [];
setInterval(() => {
    const random = Math.floor(Math.random() * 5)

    while (messages.length < random) {
        messages.push(getListDataMessage());
    }
}, 5000);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});
app.get("/messages/unread", async (request, response) => {
    const res = {
        status: "ok",
        timestamp: Date.now(),
        messages: messages,
    };
    response.status(200).send(JSON.stringify(res)).end();
    messages = [];
});

const server = http.createServer(app);

const port = process.env.PORT || 3000;
const bootstrap = async () => {
    try {
        server.listen(port, () =>
            console.log(`Server has been started on http://localhost:${port}`)
        );
    } catch (error) {
        console.error(error);
    }
};

bootstrap();