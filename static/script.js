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

function startRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('此瀏覽器不支援語音識別功能，請使用 Google Chrome 或 Edge 瀏覽器進行測試。');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'zh-TW'; // 設定語言為繁體中文
    recognition.interimResults = false; // 禁用中間結果
    recognition.maxAlternatives = 1; // 返回一個最好的結果

    recognition.onstart = function() {
        document.getElementById('voiceButton').disabled = true; // 禁用按鈕
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript; // 獲取轉錄的文本
        document.getElementById('userInput').value = transcript; // 將文本插入輸入框
        // askQuestion(); // 自動提交問題
    };

    recognition.onerror = function(event) {
        console.error('語音識別發生錯誤:', event.error);
    };

    recognition.onend = function() {
        document.getElementById('voiceButton').disabled = false; // 啟用按鈕
    };

    recognition.start();
}


