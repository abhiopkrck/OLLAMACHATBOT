from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import requests
import json
import os
from dotenv import load_dotenv
load_dotenv()
from db import save_message, get_chats, clear_chats

OLLAMA_URL = os.getenv("OLLAMA_URL")
MODEL = os.getenv("MODEL")

app = FastAPI()

# ---------------- SERVE REACT BUILD ----------------
if os.path.exists("frontend/build"):
    app.mount(
        "/static",
        StaticFiles(directory="frontend/build/static"),
        name="static"
    )


@app.get("/")
def index():
    return FileResponse("frontend/build/index.html")


# ---------------- CHAT HISTORY ----------------
@app.get("/history")
def history(user_id: str):
    return get_chats(user_id)


# ---------------- CLEAR CHAT ----------------
@app.post("/clear")
def clear(user_id: str):
    clear_chats(user_id)
    return {"status": "cleared"}


# ---------------- STREAMING CHAT ----------------
@app.post("/chat")
async def chat(req: Request):
    body = await req.body()            # ✅ FIX HERE
    data = json.loads(body)

    user_id = data["user_id"]
    message = data["message"]

    save_message(user_id, "user", message)

    payload = {
        "model": MODEL,
        "prompt": message,
        "stream": True
    }

    def stream():
        response = requests.post(
            OLLAMA_URL,
            json=payload,
            stream=True
        )

        full_reply = ""

        for line in response.iter_lines():
            if not line:
                continue

            chunk = json.loads(line.decode())
            token = chunk.get("response", "")
            full_reply += token
            yield token

        save_message(user_id, "assistant", full_reply)

    return StreamingResponse(stream(), media_type="text/plain")
