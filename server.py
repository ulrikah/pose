'''
Usage:
open 'http://localhost:5050/index.html' && python server.py
'''

import time, json, os
from flask import Flask, jsonify, request, send_from_directory
from pathlib import Path


app = Flask(__name__, static_folder='.')
poses = []
recordings_dir = "recordings"


@app.route('/api/pose', methods=['POST'])
def post_pose():
    poses.append(request.json)
    return jsonify({'status': 'ok'})


@app.route('/api/save', methods=['POST'])
def save_poses():
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    recording_file = f'recording_{timestamp}.json'
    Path(recording_file).touch()
    with open(os.path.join(recordings_dir, recording_file), 'w') as file:
        json.dump(poses, file)
    poses.clear()
    return jsonify({'status': 'ok'})

@app.route('/api/pose', methods=['GET'])
def get_pose():
    return jsonify({'status': 'ok'})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    print(path)
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=1)