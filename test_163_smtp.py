#!/usr/bin/env python3
import smtplib
import ssl
from email.mime.text import MIMEText
from datetime import datetime

SMTP_SERVER = "smtp.163.com"
SMTP_PORT = 465
EMAIL = "lwz4814507@163.com"
PASSWORD = "UAUNJVKXMDGLSPKX"

try:
    msg = MIMEText(f"这是163邮箱测试邮件\n时间：{datetime.now()}", 'plain', 'utf-8')
    msg['Subject'] = '测试邮件 - 163邮箱'
    msg['From'] = EMAIL
    msg['To'] = EMAIL
    
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, EMAIL, msg.as_string())
    print("✅ 163邮箱发送成功")
except Exception as e:
    print(f"❌ 失败: {e}")
