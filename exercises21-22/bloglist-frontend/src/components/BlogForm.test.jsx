import { render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup();
  const addBlog = vi.fn();

  render(<BlogForm addBlog={addBlog} />);

  const titleInput = screen.getByPlaceholderText('write title here');
  const authorInput = screen.getByPlaceholderText('write author here');
  const urlInput = screen.getByPlaceholderText('write url here');

  const sendButton = screen.getByText('create');

  await user.type(titleInput, 'Example title');
  await user.type(authorInput, 'Example author');
  await user.type(urlInput, 'exampleurl');

  await user.click(sendButton);

  console.log(addBlog.mock.calls);

  expect(addBlog.mock.calls[0][0].title).toBe('Example title');
  expect(addBlog.mock.calls[0][0].author).toBe('Example author');
  expect(addBlog.mock.calls[0][0].url).toBe('exampleurl');
});
