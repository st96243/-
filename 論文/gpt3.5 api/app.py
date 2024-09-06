from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import openai
from dotenv import load_dotenv
import os

# 加載環境變量
load_dotenv()

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = '123456'
socketio = SocketIO(app, cors_allowed_origins="*")

# 設置 OpenAI API 密鑰
openai.api_key = os.getenv('OPENAI_API_KEY')

# 系統提示：只在對話開始時設置
system_prompt = (                                           
        "你是一位真心關心朋友的人，當對方分享他們的不開心時，你會用很自然的語氣去安慰和理解，"
        "並且通過傾聽和簡單的問句來表達支持。不要過於正式或過度解釋，只需像朋友一樣陪伴對方，"
        "盡量透過相關的關心問句延續話題"
        "保持對話輕鬆、貼心，不提供解決方案，只專注於共情和理解。"
    )
        # "之後，自然地將話題轉向其他輕鬆的事情，幫助對方轉移注意力，比如問對方最近的計劃或愛好，"
        # "例如：'我們聊點別的吧，比如你最近有什麼好玩的計劃或者看到的有趣的電影？'"
        # "話題轉向和通過傾聽和簡單的問句來表達支持不要在一句話出現，請判斷使用者情緒不高時再轉向" 
# 對話上下文，用於記錄對話歷史
conversation_context = [
    {"role": "system", "content": system_prompt}  # 只在對話開始時設置 system prompt
]

@socketio.on('ask')
def handle_question(data):
    global conversation_context
    user_input = data['question']
    
    # 添加用戶輸入到對話上下文
    conversation_context.append({"role": "user", "content": user_input})
    
    # 呼叫 OpenAI API 生成回應
    response = openai.ChatCompletion.create(
        model="gpt-4",  # 使用 gpt-4
        messages=conversation_context,
        max_tokens=500,
        temperature=0.7,  # 調整溫度以控制創意程度
    )

    # 解析並記錄模型的回應
    answer = response['choices'][0]['message']['content']
    print(f"Generated answer: {answer}")  # 添加日誌

    # 添加 AI 回應到對話上下文
    conversation_context.append({"role": "assistant", "content": answer})
    
    # 發送回應到前端
    emit('response', {'text': answer})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, debug=True)
