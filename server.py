'''
Usage:
open 'http://localhost:5050/index.html' && python server.py
'''

import json, random, os
from flask import Flask, jsonify, request, send_from_directory
app = Flask(__name__, static_folder='.')

@app.route('/api/pose', methods=['GET', 'POST'])
def get_pose():
  print(request.json)
  return jsonify({'status': 'ok'})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
  print(path)
  return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5050, debug=1)