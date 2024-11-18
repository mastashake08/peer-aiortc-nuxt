<script setup>
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import Peer from 'peerjs';

// Reactive state variables
const peerId = ref('');
const remotePeerId = ref('');
const peer = ref(null);
const localStream = ref(null);
const localVideo = ref(null);

// Initialize PeerJS and handle events
onMounted(() => {
  // Create PeerJS instance
  peer.value = new Peer();

  // Listen for when the peer is open
  peer.value.on('open', (id) => {
    peerId.value = id;
  });

  // Handle incoming calls
  peer.value.on('call', (call) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.value = stream;
        localVideo.value.srcObject = stream;

        // Answer the call with our stream
        call.answer(stream);

        // Listen for the remote stream
        call.on('stream', (remoteStream) => {
          remoteVideo.value.srcObject = remoteStream;
        });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  });
});

// Call a remote peer
const callPeer = () => {
  if (!remotePeerId.value.trim()) {
    alert('Please enter a Peer ID');
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      localStream.value = stream;
      localVideo.value.srcObject = stream;

      const call = peer.value.call(remotePeerId.value, stream);
    })
    .catch((error) => {
      console.error('Error accessing media devices:', error);
    });
};
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-700">Nuxt 3 Video Call</h1>

    <!-- Your Peer ID -->
    <div class="mb-6">
      <p class="text-sm text-gray-500">Your Peer ID:</p>
      <input
        v-model="peerId"
        readonly
        class="p-2 border border-gray-300 rounded w-80 text-center bg-gray-50"
      />
    </div>

    <!-- Input to call another peer -->
    <div class="mb-6">
      <p class="text-sm text-gray-500 mb-2">Enter Peer ID to Call:</p>
      <input
        v-model="remotePeerId"
        placeholder="Remote Peer ID"
        class="p-2 border border-gray-300 rounded w-80 text-center mb-4"
      />
      <button
        @click="callPeer"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Call
      </button>
    </div>

    <!-- Video Streams -->
    <div class="flex space-x-8">
      <div>
        <p class="text-sm text-gray-500 text-center mb-2">Your Video:</p>
        <video
          ref="localVideo"
          autoplay
          muted
          class="w-64 h-48 border border-gray-300 rounded"
        ></video>
      </div>
    </div>
  </div>
</template>

<style>
/* Ensure video elements scale properly */
video {
  object-fit: cover;
}
</style>