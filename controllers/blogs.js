const blogsRouter = require("express").Router();
const { update } = require("../models/blog");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
    console.log("request token: ", request.token);

    const user = request.user;

    if (
        !request.body.hasOwnProperty("title") &&
        !request.body.hasOwnProperty("url")
    ) {
        response.status(400).end();
    }
    if (!request.body.hasOwnProperty("likes")) {
        request.body["likes"] = 0;
    }

    const blog = new Blog(request.body);
    blog.user = user.id;
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {

    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() != user.id) {
      response.status(403).json({ error: "user not authorized" });
    }

    const result = await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
    console.log(`Put request: ${JSON.stringify(request.body)}`);
    const { likes } = request.body;

    const updatedPerson = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes },
        { new: true, runValidators: true, context: "query" }
    );
    console.log(`Update result: ${JSON.stringify(updatedPerson)}`);
    if (updatedPerson) {
        response.status(200).json(updatedPerson);
    } else {
        response.status(404).end();
    }
});

module.exports = blogsRouter;
