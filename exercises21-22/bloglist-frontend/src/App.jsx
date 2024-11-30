import { useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';
import { initializeBlogs } from './reducers/blogReducer';
import { userLogout, setUser } from './reducers/userReducer';
import LoginForm from './components/LoginForm';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(userLogout());
  };

  return (
    <div>
      <h1>Blogs</h1>
      <Notification />

      <div>
        {!user && <LoginForm setUser={(user) => dispatch(setUser(user))} />}
        {user && (
          <div>
            <p>
              {user.name} logged in{' '}
              <button onClick={handleLogout}>Log out</button>
            </p>
            <Togglable buttonLabel="create" name="create">
              <BlogForm user={user} />
            </Togglable>
          </div>
        )}
      </div>

      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} user={user} />
        ))}
      </div>
    </div>
  );
};

export default App;
