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
    test("succeeds with a status code 201", async () => {
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
        };

        await api.post("/api/users").send(newUser).expect(400);

        const usersAfterAdd = await helper.usersInDb();
        expect(usersAfterAdd).toHaveLength(helper.initialUsers.length);
    });

    test("fails with status code 400 if no username", async () => {
        const newUser = {
            name: "No Username",
            password: "111111111",
        };

        await api.post("/api/users").send(newUser).expect(400);

        const usersAfterAdd = await helper.usersInDb();
        expect(usersAfterAdd).toHaveLength(helper.initialUsers.length);
    });

    test("fails with status code 400 if short username", async () => {
        const newUser = {
            name: "Short username",
            username: "AA",
            password: "111111111",
        };

        await api.post("/api/users").send(newUser).expect(400);

        const usersAfterAdd = await helper.usersInDb();
        expect(usersAfterAdd).toHaveLength(helper.initialUsers.length);
    });

    test("fails with status code 400 if short password", async () => {
        const newUser = {
            name: "Short password",
            username: "goodusername",
            password: "12",
        };

        await api.post("/api/users").send(newUser).expect(400);

        const usersAfterAdd = await helper.usersInDb();
        expect(usersAfterAdd).toHaveLength(helper.initialUsers.length);
    });

    test("fails with status code 400 if username exists", async () => {
        const newUser = helper.initialUsers[0]

        await api.post("/api/users").send(newUser).expect(400);

        const usersAfterAdd = await helper.usersInDb();
        expect(usersAfterAdd).toHaveLength(helper.initialUsers.length);
    });

});

describe("deleting a user", () => {
    test("succeeds with status code 204 if id is valid", async () => {
        const newUser = {
            username: "tobedeleted",
            name: "Added to be Deleted User",
            password: "100000000000",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const usersAfterAdd = await helper.usersInDb();
        expect(usersAfterAdd).toHaveLength(helper.initialUsers.length + 1);

        // Delete it
        const id = usersAfterAdd.filter(
            (user) => user.username === "tobedeleted"
        )[0].id;

        await api.delete(`/api/users/${id}`).expect(204);

        // Double-check it
        //await api.get(`/api/users/${id}`).expect(404);
    });
});

describe("updating a user", () => {
    test("updating the name succeeds with status code 200 if user exists", async () => {
        const getAll = await api.get("/api/users");
        const idToUpdate = getAll.body[0].id;

        console.log("id to update: ", idToUpdate);
        console.log("all users: ", JSON.stringify(getAll.body));

        const nameUpdate = {
            name: "Updated Name",
        };

        const response = await api
            .put(`/api/users/${idToUpdate}`)
            .send(nameUpdate)
            .expect(200);
    });

    test("updating the name fails with status code 404 if user does not exist", async () => {
        const idToUpdate = "000000000000000000000000";

        const nameUpdate = {
            name: "Updated Name",
        };

        const response = await api
            .put(`/api/users/${idToUpdate}`)
            .send(nameUpdate)
            .expect(404);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
