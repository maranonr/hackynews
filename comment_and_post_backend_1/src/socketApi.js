import socketIOClient from 'socket.io-client';
import {update_post_success} from './slices/posts';

const connect = (url, store) => {
  const io = socketIOClient(url);
  console.log('socket connected');

  io.on('SINGLE_POST', data => {
    store.dispatch(update_post_success(data));
  });
};

export default connect;
