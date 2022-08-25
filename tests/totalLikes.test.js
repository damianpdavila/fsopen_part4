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
            "title": "COBOL in Recovery",
            "author": "Old Fart",
            "url": "https://cobolrecovery.com",
            "likes": 12
        },
        {
            "title": "COBOL in Recovery",
            "author": "Old Fart",
            "url": "https://cobolrecovery.com",
            "likes": 3
        }

    ]

    test("for one blog equal the likes for that blog", () => {
        const result = listHelper.totalLikes(oneBlog);
        expect(result).toBe(5);
    });
    test("for one 3 blogs that total 20 likes", () => {
        const result = listHelper.totalLikes(threeBlog20TotalLikes);
        expect(result).toBe(20);
    });

});
