const socket = io();

// DOM elements
const senderSelect = document.getElementById('sender');
const receiverSelect = document.getElementById('receiver');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages');
const createUserBtn = document.getElementById('create-user-btn');
const userModal = document.getElementById('user-modal');
const closeModal = document.querySelector('.close');
const usernameInput = document.getElementById('username');
const submitUserBtn = document.getElementById('submit-user');
const errorMessage = document.getElementById('error-message');

// Variables
let currentSender = '';
let currentReceiver = '';

// Event listeners
senderSelect.addEventListener('change', handleUserSelection);
receiverSelect.addEventListener('change', handleUserSelection);
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// User creation modal
createUserBtn.addEventListener('click', () => {
  userModal.style.display = 'block';
  usernameInput.focus();
});

closeModal.addEventListener('click', () => {
  userModal.style.display = 'none';
  errorMessage.textContent = '';
});

window.addEventListener('click', (e) => {
  if (e.target === userModal) {
    userModal.style.display = 'none';
    errorMessage.textContent = '';
  }
});

submitUserBtn.addEventListener('click', createUser);
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') createUser();
});

// Socket events
socket.on('message', (message) => {
  // Only display messages relevant to current chat
  if ((message.sender === currentSender && message.receiver === currentReceiver) ||
      (message.sender === currentReceiver && message.receiver === currentSender)) {
    displayMessage(message);
  }
});

// Functions
function handleUserSelection() {
  currentSender = senderSelect.value;
  currentReceiver = receiverSelect.value;
  
  // Enable/disable message input based on selection
  if (currentSender && currentReceiver && currentSender !== currentReceiver) {
    messageInput.disabled = false;
    sendBtn.disabled = false;
    loadMessages();
  } else {
    messageInput.disabled = true;
    sendBtn.disabled = true;
    if (currentSender === currentReceiver && currentSender !== '') {
      messagesContainer.innerHTML = '<p class="info-message">You cannot send messages to yourself</p>';
    } else {
      messagesContainer.innerHTML = '';
    }
  }
}

async function loadMessages() {
  try {
    const response = await fetch(`/messages/${currentSender}/${currentReceiver}`);
    const messages = await response.json();
    
    // Clear previous messages
    messagesContainer.innerHTML = '';
    
    // Display messages
    messages.forEach(message => {
      displayMessage(message);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } catch (err) {
    console.error('Error loading messages:', err);
  }
}

function displayMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  
  // Determine if message is sent or received
  if (message.sender === currentSender) {
    messageDiv.classList.add('sent');
  } else {
    messageDiv.classList.add('received');
  }
  
  messageDiv.textContent = message.content;
  messagesContainer.appendChild(messageDiv);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
  const content = messageInput.value.trim();
  
  if (!content) return;
  
  try {
    const message = {
      sender: currentSender,
      receiver: currentReceiver,
      content
    };
    
    // Send to server
    const response = await fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
    
    const data = await response.json();
    
    // Emit message to all clients
    socket.emit('chatMessage', data);
    
    // Clear input
    messageInput.value = '';
    messageInput.focus();
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

async function createUser() {
  const username = usernameInput.value.trim();
  
  if (!username) {
    errorMessage.textContent = 'Username cannot be empty';
    return;
  }
  
  try {
    const response = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });
    
    if (response.status === 400) {
      const data = await response.json();
      errorMessage.textContent = data.msg;
      return;
    }
    
    // Refresh page to update user lists
    window.location.reload();
  } catch (err) {
    console.error('Error creating user:', err);
    errorMessage.textContent = 'Server error. Please try again.';
  }
}