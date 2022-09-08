const blogsRouter = require("express").Router();
const { update } = require("../models/blog");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
    if ( !request.body.hasOwnProperty("title") && !request.body.hasOwnProperty("url") ) {
        response.status(400).end();
    }
    if (!request.body.hasOwnProperty("likes")) {
        request.body["likes"] = 0;
    }
    const user = await User.findById(request.body.user)

    console.log('post user: ', JSON.stringify(user))

    const blog = new Blog(request.body);

    const savedBlog = await blog.save();

    console.log('saved blog: ', JSON.stringify(savedBlog));

    user.blogs = user.blogs.concat(savedBlog._id)

    console.log('post user after update: ', JSON.stringify(user))

    await user.save();

    response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
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
