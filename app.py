from flask import Flask, render_template, request, jsonify
import asyncio
import socket

app = Flask(__name__)

# Route to serve the form page (HTML)
@app.route('/')
def index():
    return render_templates('index.html')

# Asynchronous function to send TCP requests
async def send_tcp_request(ip, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)  # Set a timeout for the connection
        sock.connect((ip, port))
        sock.sendall(b"TCP Request")
        sock.close()
    except Exception as e:
        return str(e)
    return None

# Route to handle the sending of TCP requests
@app.route('/send', methods=['POST'])
async def send_request():
    data = request.get_json()
    ip = data['ip']
    port = data['port']
    protocol = data['protocol']
    total_requests = int(data['total_requests'])

    if not ip or not port or not total_requests:
        return jsonify({"status": "error", "message": "Invalid input"}), 400

    # Simulate TCP request sending asynchronously
    errors = []
    tasks = []
    for _ in range(total_requests):
        tasks.append(send_tcp_request(ip, port))

    # Run the tasks asynchronously and await their completion
    results = await asyncio.gather(*tasks)

    for result in results:
        if result:
            errors.append(result)

    if errors:
        return jsonify({"status": "error", "message": "Some requests failed", "errors": errors}), 500
    return jsonify({"status": "completed", "message": "All requests have been sent"})

# Main function to run the Flask app
if __name__ == '__main__':
    # Use the appropriate ASGI server for async support
    app.run(debug=True, use_reloader=False)
