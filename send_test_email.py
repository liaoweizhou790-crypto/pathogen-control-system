#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
发送测试邮件到163邮箱
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# 邮件配置
SMTP_SERVER = "smtp.163.com"
SMTP_PORT = 465
SENDER_EMAIL = "lwz4814507@163.com"
# 需要使用163邮箱的授权码，不是登录密码
# 获取方式：163邮箱设置 -> POP3/SMTP/IMAP -> 客户端授权密码
SENDER_PASSWORD = "UAUNJVKXMDGLSPKX"  # 授权码

RECEIVER_EMAIL = "lwz4814507@163.com"

def send_test_email():
    try:
        # 创建邮件
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"✅ 病原微生物防控系统 V1.5.1 部署测试报告 - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        
        # HTML内容
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }}
                .header h1 {{ margin: 0; font-size: 24px; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .section {{ margin-bottom: 25px; }}
                .section h2 {{ color: #667eea; border-left: 4px solid #667eea; padding-left: 10px; font-size: 18px; }}
                .success {{ color: #27ae60; font-weight: bold; }}
                .info {{ background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #1976d2; }}
                .footer {{ text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }}
                ul {{ padding-left: 20px; }}
                li {{ margin-bottom: 8px; }}
                .badge {{ display: inline-block; background: #27ae60; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; margin-left: 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧬 病原微生物防控系统</h1>
                    <p>部署测试报告</p>
                </div>
                <div class="content">
                    <div class="section">
                        <h2>测试状态 <span class="badge">成功</span></h2>
                        <p class="success">✅ 所有部署任务已完成并通过测试</p>
                        <p><strong>测试时间：</strong>{datetime.now().strftime('%Y年%m月%d日 %H:%M:%S')}</p>
                    </div>
                    
                    <div class="section">
                        <h2>📦 本次更新内容 (V1.5.1)</h2>
                        <ul>
                            <li>✅ 代码模块化分离（CSS、数据、功能模块分离）</li>
                            <li>✅ 添加系统免责声明</li>
                            <li>✅ 调整空气消毒方案（移除含氯消毒剂）</li>
                            <li>✅ 为22种传染病添加呕吐物/排泄物消毒方案</li>
                            <li>✅ 所有含氯消毒剂显示添加"有效氯含量"标注</li>
                            <li>✅ 二氧化氯归类调整为"氧化物类"</li>
                            <li>✅ 鼠疫防护等级调整为三级+灭鼠灭蚤提示</li>
                            <li>✅ 配比计算模块默认浓度优化</li>
                            <li>✅ 目标浓度设为必填项</li>
                            <li>✅ 醇类消毒剂改为75%乙醇</li>
                        </ul>
                    </div>
                    
                    <div class="section">
                        <h2>🗂️ 代码结构优化</h2>
                        <div class="info">
                            <p><strong>分离前：</strong>index.html (4000+行)</p>
                            <p><strong>分离后：</strong></p>
                            <ul>
                                <li>index.html (206行) - 页面结构</li>
                                <li>css/style.css (247行) - 样式</li>
                                <li>js/data/*.js - 数据文件</li>
                                <li>js/modules/*.js - 功能模块</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>📱 APK版本管理</h2>
                        <ul>
                            <li>✅ 创建 apk-versions 版本管理文件夹</li>
                            <li>✅ V1.5.1 APK已生成 (4.1MB)</li>
                            <li>✅ GitHub Actions自动构建配置更新</li>
                            <li>✅ 每次推送自动保存APK到版本文件夹</li>
                        </ul>
                    </div>
                    
                    <div class="section">
                        <h2>🔗 GitHub仓库</h2>
                        <p><strong>仓库地址：</strong>https://github.com/liaoweizhou790-crypto/disinfectant-calc</p>
                        <p><strong>最新提交：</strong>代码分离与版本管理优化</p>
                        <p><strong>构建状态：</strong>✅ 通过</p>
                    </div>
                    
                    <div class="section">
                        <h2>📋 文件位置</h2>
                        <ul>
                            <li><strong>最新APK：</strong>~/.openclaw/workspace/病原微生物防控系统_v1.5.1.apk</li>
                            <li><strong>版本管理：</strong>pathogen-control-system/apk-versions/v1.5.1/</li>
                            <li><strong>架构方案：</strong>pathogen-control-system/科室多人使用架构方案.md</li>
                        </ul>
                    </div>
                    
                    <div class="footer">
                        <p>此邮件由系统开发-病原微生物 AI助手自动发送</p>
                        <p>柳州市疾病预防控制中心 消毒与病媒生物防制所</p>
                        <p>{datetime.now().strftime('%Y年%m月%d日')}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        # 添加HTML内容
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))
        
        # 连接SMTP服务器
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        
        print("✅ 邮件发送成功！")
        return True
        
    except Exception as e:
        print(f"❌ 邮件发送失败: {e}")
        return False

if __name__ == "__main__":
    send_test_email()
