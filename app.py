# app.py
from flask import Flask, request, render_template, jsonify
from pdf_processing import get_pdf_text, get_text_chunks, load_vector_store, summarize_data, user_input
import os
from werkzeug.utils import secure_filename

# Flask app setup
app = Flask(__name__)

# Home route
@app.route('/')
def index():
    return render_template('index1.html')

# Process PDF route
@app.route('/process_pdf', methods=['POST'])
def process_pdf():
    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['pdf_file']
    
    if file.filename == '' or not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Invalid file type. Only PDFs are allowed.'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads', filename)
        file.save(filepath)

        try:
            raw_text = get_pdf_text(filepath)
            text_chunks = get_text_chunks(raw_text)
            load_vector_store(text_chunks)
        except Exception as e:
            return jsonify({'error': f'Error processing PDF: {str(e)}'}), 500
        finally:
            # Cleanup: remove the uploaded PDF after processing
            os.remove(filepath)

        return jsonify({'message': 'PDF processed successfully'}), 200

# Summarize PDF route
@app.route('/summarize_pdf', methods=['POST'])
def summarize_pdf():
    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['pdf_file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads', filename)
        file.save(filepath)

        summary = summarize_data(filepath)
        return jsonify({'summary': summary}), 200

# Ask question route
@app.route('/ask_question', methods=['POST'])
def ask_question():
    data = request.get_json()
    user_question = data.get('question', '')
    if user_question:
        try:
            response = user_input(user_question)
            return jsonify({'response': response}), 200
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
    else:
        return jsonify({'error': 'No question provided'}), 400

# Main app logic
if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
