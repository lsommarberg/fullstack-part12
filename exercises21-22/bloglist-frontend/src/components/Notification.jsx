import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notifications);

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div>
      {notification !== null && <div style={style}>{notification}</div>}
    </div>
  );
};

export default Notification;
