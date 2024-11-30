import { userLogin } from '../reducers/userReducer';
import { useDispatch } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import { useState } from 'react';

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await dispatch(userLogin(username, password));
      setUsername('');
      setPassword('');
      dispatch(setNotification(`logged in as ${user.name}`, 5));
      setUser(user);
    } catch (exception) {
      const errorMessage =
        exception.response?.data?.error || 'An error occurred';
      dispatch(setNotification(errorMessage, 5));
    }
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            data-testid="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" name="login">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
