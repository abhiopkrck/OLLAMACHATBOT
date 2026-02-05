import sqlite3
import os

DB_DIR = "user_dbs"
os.makedirs(DB_DIR, exist_ok=True)


def get_db(user_id: str):
    path = os.path.join(DB_DIR, f"{user_id}.db")
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT,
            content TEXT
        )
    """)
    conn.commit()
    return conn


def save_message(user_id: str, role: str, content: str):
    conn = get_db(user_id)
    conn.execute(
        "INSERT INTO chats (role, content) VALUES (?, ?)",
        (role, content)
    )
    conn.commit()
    conn.close()


def get_chats(user_id: str):
    conn = get_db(user_id)
    cur = conn.execute(
        "SELECT role, content FROM chats ORDER BY id"
    )
    data = [{"role": r, "content": c} for r, c in cur.fetchall()]
    conn.close()
    return data


def clear_chats(user_id: str):
    path = os.path.join(DB_DIR, f"{user_id}.db")
    if os.path.exists(path):
        os.remove(path)
get_db()