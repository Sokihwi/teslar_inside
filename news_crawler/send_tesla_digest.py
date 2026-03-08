"""
=============================================================================
📧 send_tesla_digest.py - 테슬라 뉴스 다이제스트 이메일 발송
Gmail API를 통해 최신 다이제스트를 자동 전송
=============================================================================
"""

import os
import base64
import glob
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
import datetime

# Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DIGEST_DIR = os.path.join(SCRIPT_DIR, "digests")
TOKEN_FILE = os.path.join(SCRIPT_DIR, "token.json")
SENDER_EMAIL = "davinchisteve@gmail.com"
RECIPIENTS = ["davinchisteve@gmail.com"]
SCOPES = ['https://www.googleapis.com/auth/gmail.send']


def get_latest_digest():
    """digests 폴더에서 가장 최근 HTML 파일을 찾습니다."""
    pattern = os.path.join(DIGEST_DIR, "tesla_digest_*.html")
    files = glob.glob(pattern)
    if not files:
        return None
    return max(files, key=os.path.getmtime)


def get_gmail_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing token...")
            try:
                creds.refresh(Request())
                with open(TOKEN_FILE, 'w') as token:
                    token.write(creds.to_json())
            except Exception as e:
                print(f"Error refreshing token: {e}")
                return None
        else:
            print("Error: Valid token.json not found. Please ensure token.json is in this folder.")
            return None

    return build('gmail', 'v1', credentials=creds)


def create_message(sender, to, subject, message_text_html):
    message = MIMEMultipart("alternative")
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject

    part = MIMEText(message_text_html, "html")
    message.attach(part)

    return {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}


def send_email():
    digest_file = get_latest_digest()
    if not digest_file:
        print("❌ No digest file found in digests/ folder.")
        return

    print(f"📄 Using digest: {os.path.basename(digest_file)}")

    with open(digest_file, "r", encoding="utf-8") as f:
        html_content = f.read()

    service = get_gmail_service()
    if not service:
        print("❌ Failed to get Gmail service.")
        return

    today = datetime.date.today().strftime("%Y-%m-%d")
    subject = f"🚗 Tesla Inside - News Digest ({today})"

    print(f"📧 Sending email from {SENDER_EMAIL} to {RECIPIENTS}...")

    for recipient in RECIPIENTS:
        try:
            message = create_message(SENDER_EMAIL, recipient, subject, html_content)
            sent_message = service.users().messages().send(userId="me", body=message).execute()
            print(f"  ✅ Message Id: {sent_message['id']} sent to {recipient}")
        except Exception as e:
            print(f"  ❌ Error sending to {recipient}: {e}")


if __name__ == "__main__":
    send_email()
