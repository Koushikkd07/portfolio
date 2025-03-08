import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import pandas as pd
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
db = client['portfolio_db']
contacts_collection = db['contacts']

# Email configuration
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SENDER_EMAIL = os.getenv('EMAIL_ADDRESS')
SENDER_PASSWORD = os.getenv('EMAIL_PASSWORD')  # App-specific password
RECEIVER_EMAIL = 'koushikdas0527@gmail.com'

# Excel file path
EXCEL_FILE = 'contacts_data.xlsx'

def send_email(contact_data):
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = f"New Contact Form Submission: {contact_data['subject']}"

        # Email body
        body = f"""
        New contact form submission:
        
        Name: {contact_data['name']}
        Email: {contact_data['email']}
        Subject: {contact_data['subject']}
        Message: {contact_data['message']}
        
        Submitted on: {contact_data['timestamp']}
        """

        msg.attach(MIMEText(body, 'plain'))

        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)

        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def save_to_excel(contact_data):
    try:
        # Create DataFrame for new data
        new_data = pd.DataFrame([contact_data])
        
        # If file exists, append to it; otherwise create new file
        if os.path.exists(EXCEL_FILE):
            existing_data = pd.read_excel(EXCEL_FILE)
            updated_data = pd.concat([existing_data, new_data], ignore_index=True)
        else:
            updated_data = new_data
        
        # Save to Excel
        updated_data.to_excel(EXCEL_FILE, index=False)
        return True
    except Exception as e:
        print(f"Error saving to Excel: {e}")
        return False

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.json
        
        # Prepare contact data
        contact_data = {
            'name': data['name'],
            'email': data['email'],
            'subject': data['subject'],
            'message': data['message'],
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        # Save to MongoDB
        contacts_collection.insert_one(contact_data)

        # Save to Excel
        save_to_excel(contact_data)

        # Send email notification
        send_email(contact_data)

        return jsonify({
            'success': True,
            'message': 'Form submitted successfully'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 