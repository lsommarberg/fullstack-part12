import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addLike(state, action) {
      const blogToChange = action.payload;
      const updatedBlogs = state.map((blog) =>
        blog.id !== blogToChange.id ? blog : blogToChange,
      );
      const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes);
      return sortedBlogs;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

export const { addLike, appendBlog, setBlogs, removeBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogInfo, user) => {
  return async (dispatch) => {
    const createdBlog = await blogService.create(blogInfo);
    const newBlog = {
      ...createdBlog,
      user: {
        id: user.id,
        name: user.name,
      },
    };
    dispatch(appendBlog(newBlog));
  };
};

export const updateBlog = (id) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    const blog = blogs.find((b) => b.id === id);
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    const returnedBlog = await blogService.update(id, updatedBlog);
    dispatch(addLike(returnedBlog));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    const deletedBlog = await blogService.remove(id);
    dispatch(removeBlog(deletedBlog.id));
  };
};

export default blogSlice.reducer;
