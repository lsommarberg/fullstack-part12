const User = require('../models/user');

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  const result = blogs.reduce((sum, currentItem) => {
    return sum + currentItem.likes;
  }, 0);

  return result;
};
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  const favorite = blogs.reduce((favorite, currentItem) => {
    const likes = 'likes';
    return currentItem[likes] > (favorite[likes] || -Infinity)
      ? currentItem
      : favorite;
  }, {});
  const result = {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
  return result;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  const authors = {};
  blogs.forEach((obj) => {
    const { author } = obj;
    if (authors[author]) {
      authors[author]++;
    } else {
      authors[author] = 1;
    }
  });

  let mostFrequentAuthor;
  let maxCount = 0;

  for (const author in authors) {
    if (authors[author] > maxCount) {
      maxCount = authors[author];
      mostFrequentAuthor = author;
    }
  }
  return {
    author: mostFrequentAuthor,
    blogs: maxCount,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  const authors = {};

  blogs.forEach((obj) => {
    const { author, likes } = obj;
    if (authors[author]) {
      authors[author] += likes;
    } else {
      authors[author] = likes;
    }
  });

  let mostLikesAuthor = null;
  let maxLikes = -1;
  for (const author in authors) {
    if (authors[author] > maxLikes) {
      maxLikes = authors[author];
      mostLikesAuthor = author;
    }
  }

  return {
    author: mostLikesAuthor,
    likes: maxLikes,
  };
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const userInDb = async () => {
  const user = await User.findOne({});
  return user ? user.toJSON() : null;
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  usersInDb,
  userInDb,
};
