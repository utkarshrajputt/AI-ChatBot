document.getElementById('user_input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInputElement = document.getElementById('user_input');
    const user_input = userInputElement.value.trim();
    if (user_input.toLowerCase() === 'exit') {
        displayFinalChatHistory();
    } else if (user_input) {
        document.getElementById('waiting_message').style.display = 'block';

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/process_user_input', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                updateChatHistory(response.messages);
                userInputElement.value = '';
                document.getElementById('waiting_message').style.display = 'none';
            }
        };
        xhr.send('user_input=' + encodeURIComponent(user_input));
    }
}

function displayFinalChatHistory() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/process_user_input', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            updateChatHistory(response.final_chat_history);
        }
    };
    xhr.send('user_input=exit');
}

function updateChatHistory(messages) {
    const chatHistory = document.getElementById('chat_history');
    chatHistory.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message['role']);
        messageElement.innerHTML = `<strong>${message['role'] === 'user' ? 'You' : 'FitBot'}:</strong> ${message['content']}`;
        chatHistory.appendChild(messageElement);
    });
    chatHistory.scrollTop = chatHistory.scrollHeight;
}
