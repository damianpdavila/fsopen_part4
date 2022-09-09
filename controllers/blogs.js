const blogsRouter = require("express").Router();
const { update } = require("../models/blog");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
    const token = getTokenFrom(request)  
    const decodedToken = jwt.verify(token, process.env.SECRET)  
    
    if (!decodedToken.id) {    
      return response.status(401).json({ error: 'token missing or invalid' })  
    }  
    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'token invalid' })  
    }

    if ( !request.body.hasOwnProperty("title") && !request.body.hasOwnProperty("url") ) {
        response.status(400).end();
    }
    if (!request.body.hasOwnProperty("likes")) {
        request.body["likes"] = 0;
    }

    const blog = new Blog(request.body);
    blog.user = user.id;
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id)
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
