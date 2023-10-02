const axios = require("axios");
const { memoize, filter } = require("lodash");

/* Cache invalidator function. Invalidates cache afte a minute */
function invalidator(...args) {
  const now = new Date();

  // create unique keys
  const key = `${now.getDate()}-${now.getMonth()}-${now.getFullYear()}-${now.getHours()}-${now.getMinutes()}-${
    args[0] ?? "blogs"
  }`;
  return key;
}

const searchBlogs = memoize(async (query) => {
  try {
    const data = await getBlogs();
    const blogs = data.blogs;

    let queried_blogs = filter(blogs, (blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );

    return queried_blogs;
  } catch (error) {
    throw error;
  }
}, invalidator);

const getBlogs = memoize(async () => {
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret": `${process.env.ADMIN_SECRET}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}, invalidator);

module.exports = {
  getBlogs,
  searchBlogs,
};
