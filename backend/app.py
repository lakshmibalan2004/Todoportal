from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db_connection, create_table

app = Flask(__name__)
CORS(app,origins="https://todoportal.netlify.app")  # Enable CORS

# Create table if not exists
create_table()

@app.route("/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    return jsonify([dict(task) for task in tasks])


@app.route("/tasks", methods=["POST"])
def add_task():
    new_task = request.json.get("task")
    if not new_task:
        return jsonify({"error": "Task content required"}), 400
    conn = get_db_connection()
    conn.execute("INSERT INTO tasks (task) VALUES (?)", (new_task,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task added"}), 201


@app.route("/tasks/<int:id>", methods=["PUT"])
def complete_task(id):
    conn = get_db_connection()
    conn.execute("UPDATE tasks SET completed = 1 WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task marked as completed"})


@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    conn = get_db_connection()
    conn.execute("DELETE FROM tasks WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task deleted"})


@app.route("/", methods=["GET"])
def home():
    return "Todo API is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
