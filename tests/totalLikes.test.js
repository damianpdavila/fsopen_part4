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
