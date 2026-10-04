export default class Chat {
  constructor(appContainer, chatApi, currentUser) {
    this.container = appContainer;
    this.api = chatApi;
    this.user = currentUser;
    this.ws = null;

    this.usersListContainer = null;
    this.messagesViewport = null;
    this.inputElement = null;
  }

  init() {
    this.usersListContainer = this.container.querySelector('#users-list-box');
    this.messagesViewport = this.container.querySelector('#chat-messages-box');
    this.inputElement = this.container.querySelector('#chat-message-input');

    this.sendBtn = this.container.querySelector('#chat-send-btn');

    this.ws = new WebSocket('ws://localhost:3000/ws');

    this.bindEvents();
  }

  bindEvents() {
    this.ws.addEventListener('open', () => {
      this.ws.send(JSON.stringify({
        type: 'login',
        user: {
          name: this.user.name
        }
      }));
    });

    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);

      if (Array.isArray(data)) {
        this.renderUsersSidebar(data);
      } else if (data.type === 'send') {
        this.renderMessageBubble(data);
      }
    });

    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.sendMessageToServer();
      }
    });

    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => {
        this.sendMessageToServer();
      });
    }

    window.addEventListener('beforeunload', () => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'exit',
          user: {
            name: this.user.name
          }
        }));
      }
    });
  }

  sendMessageToServer() {
    const text = this.inputElement.value.trim();
    if (!text) return;

    const payload = {
      type: 'send',
      message: text,
      user: {
        id: this.user.id,
        name: this.user.name
      }
    };

    this.ws.send(JSON.stringify(payload));
    this.inputElement.value = '';
  }

  renderUsersSidebar(usersArray) {
    this.usersListContainer.innerHTML = '';

    usersArray.forEach(u => {
      const row = document.createElement('div');
      row.className = 'user-item-row';

      const isItMe = u.id === this.user.id;
      const displayName = isItMe ? 'You' : u.name;

      row.innerHTML = `
        <div class="user-avatar-circle"></div>
        <div class="user-name-label ${isItMe ? 'is-me' : ''}">${displayName}</div>
      `;
      this.usersListContainer.appendChild(row);
    });
  }

  renderMessageBubble(msgObj) {
    const bubbleWrapper = document.createElement('div');

    const senderId = msgObj.user ? msgObj.user.id : null;
    const senderName = msgObj.user ? msgObj.user.name : 'Участник';

    const isItMe = senderId === this.user.id;

    const dateObj = msgObj.timestamp ? new Date(msgObj.timestamp) : new Date();
    const timeStr = `${dateObj.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} ${dateObj.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

    if (isItMe) {
      bubbleWrapper.className = 'message-bubble-wrapper right';
      bubbleWrapper.innerHTML = `
        <div class="message-meta-info"><span class="meta-user is-me-label">You</span>, ${timeStr}</div>
        <div class="message-text-content">${msgObj.message}</div>
      `;
    } else {
      bubbleWrapper.className = 'message-bubble-wrapper left';
      bubbleWrapper.innerHTML = `
        <div class="message-meta-info"><span class="meta-user">${senderName}</span>, ${timeStr}</div>
        <div class="message-text-content">${msgObj.message}</div>
      `;
    }

    this.messagesViewport.appendChild(bubbleWrapper);

    this.messagesViewport.scrollTop = this.messagesViewport.scrollHeight;
  }

}
