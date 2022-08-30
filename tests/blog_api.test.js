const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

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

beforeEach(async () => {
    await Blog.deleteMany({});
    for (let blog of initialBlogs) {
        let blogObject = new Blog(blog);
        await blogObject.save();
    }
});

test("notes are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
}, 100000);

test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const blogTitles = response.body.map((blog) => blog.title);
    expect(blogTitles).toContain("COBOL in Recovery");
});

test("the id field exists", async () => {
    const response = await api.get("/api/blogs");

    const blogs = response.body;
    expect(blogs[0].id).toBeDefined();
});

test("a valid blog can be added", async () => {
    const newBlog = {
        title: "Added Blog",
        author: "Prolific Author",
        url: "https://prolific.com",
        likes: 1,
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const contents = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(contents).toContain("Added Blog");
});

test("a blog with no likes can be added", async () => {
    const newBlog = {
        title: "No Likes Blog",
        author: "Not Popular",
        url: "https://struggling.com",
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const contents = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(contents).toContain("No Likes Blog");
});

test("a blog with no title and no url cannot be added", async () => {
    const newBlog = {
        author: "Not Popular",
        likes: 1,
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400);

});

afterAll(() => {
    mongoose.connection.close();
});
