import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import { createBlog } from '../reducers/blogReducer';

const BlogForm = ({ user }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const createdBlog = { title: title, author: author, url: url };
    dispatch(createBlog(createdBlog, user));

    dispatch(
      setNotification(
        `you added '${createdBlog.title} by ${createdBlog.author}'`,
        5,
      ),
    );
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title
        <input
          type="text"
          data-testid="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="write title here"
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="write author here"
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="write url here"
        />
      </div>
      <button type="submit" name="create">
        create
      </button>
    </form>
  );
};

export default BlogForm;
