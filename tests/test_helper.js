const Blog = require("../models/blog")

const initialBlogs = [
    {
        title: "COBOL in Recovery",
        author: "Old Fart",
        url: "https://cobolrecovery.com",
        likes: 5,
    },
    {
        title: "A Blog",
        author: "Prolific Author",
        url: "https://prolific.com",
        likes: 1,
    },
    {
        title: "Love in the Time of Cholera",
        author: "Gabriel Garcia Marquez",
        url: "https://theclassics.com",
        likes: 12,
    },
    {
        title: "JCL is a 4 Letter Word",
        author: "Old Fart",
        url: "https://cobolrecovery.com",
        likes: 8,
    },
    {
        title: "B Blog",
        author: "Prolific Author",
        url: "https://prolific.com",
        likes: 2,
    },
    {
        title: "The Title",
        author: "Papi Chulo",
        url: "https://eljefe.com",
        likes: 3,
    },
    {
        title: "C Blog",
        author: "Prolific Author",
        url: "https://prolific.com",
        likes: 3,
    },
    {
        title: "D Blog",
        author: "Prolific Author",
        url: "https://prolific.com",
        likes: 2,
    },
];

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', author: 'willremovethissoon' })
    await blog.save()
    await blog.remove()
  
    return blog._id.toString()
  }

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }
  
  module.exports = {
    initialBlogs, nonExistingId, blogsInDb
  }
  