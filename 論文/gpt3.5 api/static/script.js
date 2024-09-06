const socket = io();

socket.on('response', function(data) {
    console.log("Received response:", data); // 確認前端接收到的訊息
    const chatContainer = document.getElementById('chatContainer');

    // 創建包含機器人回應和按鈕的容器
    const responseContainer = document.createElement('div');
    responseContainer.className = 'chat-response-container';

    // 創建並顯示機器人回應
    const botResponse = document.createElement('div');
    botResponse.className = 'chat-message bot';
    botResponse.innerText = data.text;
    responseContainer.appendChild(botResponse);

    // 這裡可以添加按鈕
    // const button = document.createElement('button');
    // button.innerText = '選項1';
    // responseContainer.appendChild(button);

    // 將整個容器添加到聊天容器中，而不是只添加 botResponse
    chatContainer.appendChild(responseContainer);

    // 清空輸入框
    document.getElementById('userInput').value = '';

    // 確保最新訊息在視野內
    chatContainer.scrollTop = chatContainer.scrollHeight;
});

function askQuestion() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === '') return;

    const chatContainer = document.getElementById('chatContainer');

    // 創建並顯示使用者問題
    const userQuestion = document.createElement('div');
    userQuestion.className = 'chat-message user';
    userQuestion.innerText = userInput;
    chatContainer.appendChild(userQuestion);

    console.log("Asking question:", userInput); // 確認發送的問題
    socket.emit('ask', { question: userInput });

    // 清空輸入框
    document.getElementById('userInput').value = '';

    // 確保最新訊息在視野內
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 隱藏問題按鈕（如果有需要）
    // document.querySelector('.questions').style.display = 'none';
}
