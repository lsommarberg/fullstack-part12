import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

test('renders title', () => {
  const blog = {
    title: 'Component Testing',
    author: 'Test Author',
    url: 'example.com/exampleblog',
    likes: 1,
    user: { id: '123', name: 'User Name' },
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText(/Component Testing/);

  expect(element).toBeDefined();
});

test('blog visible shows the additional info', () => {
  const blog = {
    title: 'Component Testing',
    author: 'Test Author',
    url: 'example.com/exampleblog',
    likes: 1,
    user: { id: '123', name: 'User Name' },
  };

  render(<Blog blog={blog} visible={true} />);

  const url = screen.getByText('example.com/exampleblog');
  const likes = screen.getByText('1 likes');
  const user = screen.getByText('User Name');

  expect(url).toBeDefined();
  expect(likes).toBeDefined();
  expect(user).toBeDefined();
});

test('clicking the like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'Component Testing',
    author: 'Test Author',
    url: 'example.com/exampleblog',
    likes: 1,
    user: { id: '123', name: 'User Name' },
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} visible={true} handleLike={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText('like');
  await user.click(button);
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
