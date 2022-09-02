const bcrypt = require('bcrypt')
const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});

    for (let user of helper.initialUsers) {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(user.password, saltRounds)
      
        const userObject = new User({
          username: user.username,
          name: user.name,
          passwordHash: passwordHash
        })
    
        await userObject.save();
    }
});

describe("when there are initially some users saved", () => {
    test("users are returned as json", async () => {
        await api
            .get("/api/users")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    }, 100000);

    test("all users are returned", async () => {
        const response = await api.get("/api/users");

        expect(response.body).toHaveLength(helper.initialUsers.length);
    });

    test("a specific user is within the returned users", async () => {
        const response = await api.get("/api/users");

        const userNames = response.body.map((user) => user.name);
        expect(userNames).toContain("Gabriela A. Davila");
    });

    test("the id field exists", async () => {
        const response = await api.get("/api/users");

        const users = response.body;
        expect(users[0].id).toBeDefined();
    });
});

describe("adding a new user", () => {
    test("succeeds with a valid password", async () => {
        const newUser = {
            username: "addeduser",
            name: "Added User",
            password: "100000000000",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const usersAfterAdd = await helper.usersInDb();
        expect(usersAfterAdd).toHaveLength(helper.initialUsers.length + 1);

        const contents = usersAfterAdd.map((b) => b.name);
        expect(contents).toContain("Added User");
    });

    test("fails with status code 400 if no password", async () => {
        const newUser = {
            username: "nopassword",
            name: "No Password",
            password: "",
        };

        await api.post("/api/users").send(newUser).expect(400);

        const usersAfterAdd = await helper.usersInDb();
        expect(usersAfterAdd).toHaveLength(helper.initialUsers.length);
    });
});

describe("deleting a user", () => {
    test("succeeds with status code 204 if id is valid", async () => {
        // Add a user and get the resulting id
        const newUser = {
            title: "User to be Deleted",
            author: "Shortlived Author",
            url: "https://shorttimer.com",
            likes: 1,
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        // Delete it
        const getAll = await helper.usersInDb();
        const id = getAll.filter(
            (user) => user.title === "User to be Deleted"
        )[0].id;

        await api.delete(`/api/users/${id}`).expect(204);

        // Double-check it
        await api.get(`/api/users/${id}`).expect(404);
    });
});

describe("updating a user", () => {
    test("updating like count succeeds with status code 200 if user exists", async () => {
        const getAll = await api.get("/api/users");
        const idToUpdate = getAll.body[0].id;

        const likeUpdate = {
            likes: 99,
        };

        const response = await api
            .put(`/api/users/${idToUpdate}`)
            .send(likeUpdate)
            .expect(200);
    });

    test("updating like count fails with status code 404 if user does not exist", async () => {
        const idToUpdate = "000000000000000000000000";

        const likeUpdate = {
            likes: 99,
        };

        const response = await api
            .put(`/api/users/${idToUpdate}`)
            .send(likeUpdate)
            .expect(404);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
