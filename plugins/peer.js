// plugins/peer.js
import Peer from 'peerjs';

export default (context, inject) => {
  const peer = new Peer();
  inject('peer', peer);
};
