#!/usr/bin/env python3
"""
QQ邮箱邮件检查脚本
用于替代 himalaya CLI 的 IMAP 读取功能
"""

import imaplib
import email
from email.header import decode_header
import sys
from datetime import datetime

def decode_str(s):
    """解码邮件头"""
    if s is None:
        return ""
    decoded = decode_header(s)
    result = ""
    for part, charset in decoded:
        if isinstance(part, bytes):
            result += part.decode(charset or 'utf-8', errors='ignore')
        else:
            result += part
    return result

def check_qq_email():
    """检查QQ邮箱新邮件"""
    
    # QQ邮箱配置
    IMAP_SERVER = "imap.qq.com"
    IMAP_PORT = 993
    EMAIL = "348270365@qq.com"
    # 使用授权码
    PASSWORD = "dqvhhglrptijbgij"
    
    try:
        # 连接到IMAP服务器
        print(f"正在连接 {IMAP_SERVER}...")
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        
        # 登录
        print(f"正在登录 {EMAIL}...")
        mail.login(EMAIL, PASSWORD)
        
        # 选择收件箱
        status, messages = mail.select("INBOX")
        if status != 'OK':
            print(f"无法选择收件箱: {messages}")
            return
        
        # 获取邮件数量
        msg_count = int(messages[0])
        print(f"\n📧 收件箱共有 {msg_count} 封邮件\n")
        
        if msg_count == 0:
            print("收件箱为空")
            return
        
        # 获取最新的10封邮件
        limit = min(10, msg_count)
        print(f"显示最新 {limit} 封邮件：")
        print("-" * 80)
        
        for i in range(msg_count, msg_count - limit, -1):
            try:
                status, msg_data = mail.fetch(str(i), '(RFC822)')
                if status != 'OK':
                    continue
                
                msg = email.message_from_bytes(msg_data[0][1])
                
                # 获取邮件信息
                subject = decode_str(msg.get("Subject", "无主题"))
                from_addr = decode_str(msg.get("From", "未知发件人"))
                date = msg.get("Date", "未知日期")
                
                # 简化显示
                print(f"\n【{msg_count - i + 1}】{subject}")
                print(f"    发件人: {from_addr}")
                print(f"    日期: {date}")
                
            except Exception as e:
                print(f"    [读取邮件 {i} 时出错: {e}]")
                continue
        
        print("\n" + "-" * 80)
        
        # 关闭连接
        mail.close()
        mail.logout()
        
    except imaplib.IMAP4.error as e:
        print(f"IMAP错误: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"错误: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_qq_email()