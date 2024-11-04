from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv  
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
from langchain.schema import SystemMessage, HumanMessage
from langchain_openai import OpenAI  


load_dotenv()

app = Flask("Fitbot")

messages = [{"role": "assistant", "content": "How may I assist you today?"}]

def create_prompt_template():
    return ChatPromptTemplate.from_messages([
        SystemMessage(content="You are a health, fitness, and nutrition expert."),
        HumanMessage(content="{user_input}")
    ])

llm = OpenAI(model='gpt-3.5-turbo', openai_api_key=os.getenv('OPENAI_API_KEY')) 
llama_chain = LLMChain(
    llm=llm,
    prompt=create_prompt_template()
)

@app.route('/')
def index():
    return render_template('index.html', messages=messages)

@app.route('/process_user_input', methods=['POST'])
def process_user_input():
    user_input = request.form['user_input'].strip()

    if user_input.lower() == 'exit':
        return jsonify({'final_chat_history': messages})

    messages.append({"role": "user", "content": user_input})

    response = llama_chain.run(user_input=user_input)
    messages.append({"role": "assistant", "content": response})

    return jsonify({'messages': messages})

if __name__ == "__main__":
    app.run(debug=True)
