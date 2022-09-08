const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate('blogs', { user: 0 });
    response.json(users);
});

usersRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body;

    if (!username || username.length < 3 || !password || password.length < 3) {
        return response.status(400).json({
            error: "username and password are required and must be at least 3 characters",
        });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return response.status(400).json({
            error: "username must be unique",
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
});

usersRouter.put("/:id", async (request, response) => {
    console.log(`Put request: ${JSON.stringify(request.body)}`);
    const { name } = request.body;

    const updatedPerson = await User.findByIdAndUpdate(
        request.params.id,
        { name },
        { new: true, runValidators: true, context: "query" }
    );
    console.log(`Update result: ${JSON.stringify(updatedPerson)}`);
    if (updatedPerson) {
        response.status(200).json(updatedPerson);
    } else {
        response.status(404).end();
    }
});

usersRouter.delete("/:id", async (request, response) => {
    const result = await User.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

module.exports = usersRouter;
