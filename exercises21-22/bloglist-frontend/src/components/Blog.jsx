import React from 'react';
import { deleteBlog, updateBlog } from '../reducers/blogReducer';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const Blog = ({ blog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const toggleBlogVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    dispatch(updateBlog(blog.id));
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${blog.title}?`)) {
      dispatch(deleteBlog(blog.id));
    }
  };

  return (
    <div style={blogStyle}>
      <li>
        <span>
          {' '}
          {blog.title} {blog.author}{' '}
        </span>
        <button onClick={toggleBlogVisibility} name="view">
          {visible ? 'hide' : 'view'}
        </button>
      </li>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            {blog.likes} likes{' '}
            <button onClick={handleLike} name="like">
              like
            </button>
          </p>
          <p>{blog.user.name}</p>
          {user && blog.user && user.id === blog.user.id && (
            <button onClick={handleDelete} name="delete">
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
