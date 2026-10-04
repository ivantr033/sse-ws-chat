import ChatAPI from './api/ChatAPI';
import Chat from './Chat';

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-modal-overlay');
    const loginForm = document.getElementById('login-modal-form');
    const nicknameInput = document.getElementById('nickname-input');
    const errorMsg = document.getElementById('login-error-message');
    const appWrapper = document.getElementById('chat-app-container');

    const chatApi = new ChatAPI();

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = nicknameInput.value.trim();
        if (!username) return;

        errorMsg.innerText = '';

        chatApi.create({ name: username }, (err, response) => {
            if (err || !response || response.status === 'error') {
                const fallbackMessage = (response && response.message) ? response.message : 'Никнейм занят или сервер недоступен!';
                errorMsg.innerText = fallbackMessage;
                nicknameInput.value = '';
                nicknameInput.focus();
            } else {
                loginOverlay.style.display = 'none';
                appWrapper.style.display = 'flex';

                const chatInstance = new Chat(appWrapper, chatApi, response.user);
                chatInstance.init();
            }
        });
    });
});
