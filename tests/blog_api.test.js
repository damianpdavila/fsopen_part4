const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const { findById } = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog);
        await blogObject.save();
    }
});

describe("when there are initially some blogs saved", () => {
    test("blogs are returned as json", async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    }, 100000);

    test("all blogs are returned", async () => {
        const response = await api.get("/api/blogs");

        expect(response.body).toHaveLength(helper.initialBlogs.length);
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

});

describe("adding a new blog", () => {
    test("succeeds with a valid userid and data", async () => {
        const response = await api.get("/api/users");
        const aUser = response.body[0];

        console.log("test user: ", JSON.stringify(aUser));

        const newBlog = {
            title: "Added Blog",
            author: "Prolific Author",
            url: "https://prolific.com",
            likes: 1,
            user: aUser.id,
        };

        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const blogsAfterAdd = await helper.blogsInDb();
        expect(blogsAfterAdd).toHaveLength(helper.initialBlogs.length + 1);

        const titles = blogsAfterAdd.map((b) => b.title);
        expect(titles).toContain("Added Blog");
    });

    test("succeeds with no likes passed", async () => {
        const response = await api.get("/api/users");
        const aUser = response.body[0];

        console.log(JSON.stringify(aUser));

        const newBlog = {
            title: "No Likes Blog",
            author: "Not Popular",
            url: "https://struggling.com",
            user: aUser.id,
        };

        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const blogsAfterAdd = await helper.blogsInDb();
        const titles = blogsAfterAdd.map((b) => b.title);

        console.log("blog titles after add: ", JSON.stringify(titles));
        console.log("# of blogs: ", blogsAfterAdd.length);

        expect(blogsAfterAdd).toHaveLength(helper.initialBlogs.length + 1);
        expect(titles).toContain("No Likes Blog");
    });

    test("fails with status code 400 if no url and no title passed", async () => {
        const newBlog = {
            author: "Not Popular",
            likes: 1,
        };

        await api.post("/api/blogs").send(newBlog).expect(400);

        const blogsAfterAdd = await helper.blogsInDb();
        expect(blogsAfterAdd).toHaveLength(helper.initialBlogs.length);
    });
});

describe("deleting a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
        // Add a blog and get the resulting id

        const response = await api.get("/api/users");
        const aUser = response.body[0];

        console.log("test user: ", JSON.stringify(aUser));

        const newBlog = {
            title: "Blog to be Deleted",
            author: "Shortlived Author",
            url: "https://shorttimer.com",
            likes: 1,
            user: aUser.id,            
        };

        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        // Delete it
        const getAll = await helper.blogsInDb();
        const id = getAll.filter(
            (blog) => blog.title === "Blog to be Deleted"
        )[0].id;

        await api.delete(`/api/blogs/${id}`).expect(204);

        // Double-check it
        await api.get(`/api/blogs/${id}`).expect(404);
    });
});

describe("updating a blog", () => {
    test("updating like count succeeds with status code 200 if blog exists", async () => {
        const getAll = await api.get("/api/blogs");
        const idToUpdate = getAll.body[0].id;

        const likeUpdate = {
            likes: 99,
        };

        const response = await api
            .put(`/api/blogs/${idToUpdate}`)
            .send(likeUpdate)
            .expect(200);
    });

    test("updating like count fails with status code 404 if blog does not exist", async () => {
        const idToUpdate = "000000000000000000000000";

        const likeUpdate = {
            likes: 99,
        };

        const response = await api
            .put(`/api/blogs/${idToUpdate}`)
            .send(likeUpdate)
            .expect(404);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
