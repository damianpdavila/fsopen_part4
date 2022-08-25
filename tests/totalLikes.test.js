const listHelper = require("../utils/list_helper");

describe("total likes", () => {

    const oneBlog = [
        {
            "title": "COBOL in Recovery",
            "author": "Old Fart",
            "url": "https://cobolrecovery.com",
            "likes": 5
        }
    ]

    const threeBlog20TotalLikes = [
        {
            "title": "COBOL in Recovery",
            "author": "Old Fart",
            "url": "https://cobolrecovery.com",
            "likes": 5
        },
        {
            "title": "Love in the Time of Cholera",
            "author": "Gabriel Garcia Marquez",
            "url": "https://theclassics.com",
            "likes": 12
        },
        {
            "title": "The Title",
            "author": "Papi Chulo",
            "url": "https://eljefe.com",
            "likes": 3
        }
    ]

    test("for one blog equal the likes for that blog", () => {
        const result = listHelper.totalLikes(oneBlog);
        expect(result).toBe(5);
    });
    test("for 3 blogs that total 20 likes", () => {
        const result = listHelper.totalLikes(threeBlog20TotalLikes);
        expect(result).toBe(20);
    });

});

describe("most likes", () => {

    const secondBlogHasMostLikes = [
        {
            "title": "COBOL in Recovery",
            "author": "Old Fart",
            "url": "https://cobolrecovery.com",
            "likes": 5
        },
        {
            "title": "Love in the Time of Cholera",
            "author": "Gabriel Garcia Marquez",
            "url": "https://theclassics.com",
            "likes": 12
        },
        {
            "title": "The Title",
            "author": "Papi Chulo",
            "url": "https://eljefe.com",
            "likes": 3
        }
    ]

    test("for 3 blogs with most likes in 2nd item", () => {
        const result = listHelper.favoriteBlog(secondBlogHasMostLikes);
        expect(result).toEqual(
            {
                "title": "Love in the Time of Cholera",
                "author": "Gabriel Garcia Marquez",
                "url": "https://theclassics.com",
                "likes": 12
            }
        );
    });

});

describe("most blogs", () => {

    const secondAuthorHasMostBlogs = [
        {
            "title": "COBOL in Recovery",
            "author": "Old Fart",
            "url": "https://cobolrecovery.com",
            "likes": 5
        },
        {
            "title": "A Blog",
            "author": "Prolific Author",
            "url": "https://prolific.com",
            "likes": 1
        },
        {
            "title": "Love in the Time of Cholera",
            "author": "Gabriel Garcia Marquez",
            "url": "https://theclassics.com",
            "likes": 12
        },
        {
            "title": "B Blog",
            "author": "Prolific Author",
            "url": "https://prolific.com",
            "likes": 2
        },
        {
            "title": "The Title",
            "author": "Papi Chulo",
            "url": "https://eljefe.com",
            "likes": 3
        },
        {
            "title": "C Blog",
            "author": "Prolific Author",
            "url": "https://prolific.com",
            "likes": 3
        },
        {
            "title": "D Blog",
            "author": "Prolific Author",
            "url": "https://prolific.com",
            "likes": 2
        }

    ]

    test("by author", () => {
        const result = listHelper.mostBlogs(secondAuthorHasMostBlogs);
        expect(result).toEqual(
            {
                "author": "Prolific Author",
                "blogs": 4
            }
        );
    });

});
