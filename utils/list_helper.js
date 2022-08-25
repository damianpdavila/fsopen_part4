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
module.exports = {
    dummy, totalLikes
}