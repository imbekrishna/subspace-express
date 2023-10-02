const express = require("express");
const router = express.Router();
const { map, maxBy, uniqBy, filter, size, lowerCase } = require("lodash");
const { getBlogs, searchBlogs } = require("../services/blog.js");

router.get("/blog-stat", analyse, (req, res) => {
  try {
    const analytics = req.analytics;
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message, code: error.status });
  }
});

router.get("/blog-search", async (req, res) => {
  try {
    let query = req.query.query;
    let data = await getBlogs();

    if (query) {
      let queried_blogs = await searchBlogs(query);
      res.json({ blogs: queried_blogs });
    } else {
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ message: error.message, code: error.status });
  }
});

async function analyse(req, res, next) {
  try {
    const data = await getBlogs();

    const titles = map(data.blogs, "title");
    const longestTitle = maxBy(titles, size);
    const privacyCount = filter(titles, (item) =>
      item.toLowerCase().includes("privacy")
    ).length;

    const unique_titles = uniqBy(titles, lowerCase);

    const analytics = {
      blogs_count: data.blogs.length,
      longest_title: longestTitle,
      titles_with_privacy: privacyCount,
      unique_titles: unique_titles,
    };
    req.analytics = analytics;

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = router;
