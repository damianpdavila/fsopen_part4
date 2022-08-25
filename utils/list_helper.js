logger = require('./logger')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let total = 0;
    blogs.map( blog => {
        total+=Number(blog.likes)
    })
    return total
}

const favoriteBlog = (blogs) => {
    let favIdx = 0;
    let favLikes = 0;

    blogs.map( (blog, index) => {
        if (blog.likes > favLikes) {
            favLikes =  blog.likes
            favIdx = index
        }
    })
    return {
        title: blogs[favIdx]['title'],
        author: blogs[favIdx]['author'],
        url: blogs[favIdx]['url'],
        likes: blogs[favIdx]['likes']
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog
}