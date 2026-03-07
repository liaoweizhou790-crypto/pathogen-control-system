#!/usr/bin/env python3
"""
使用reportlab生成PDF说明书
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import sys
import re

# 注册中文字体
try:
    pdfmetrics.registerFont(TTFont('SimSun', '/System/Library/Fonts/PingFang.ttc'))
    chinese_font = 'SimSun'
except:
    try:
        pdfmetrics.registerFont(TTFont('SimSun', '/System/Library/Fonts/STHeiti Light.ttc'))
        chinese_font = 'SimSun'
    except:
        chinese_font = 'Helvetica'

def markdown_to_pdf(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    doc = SimpleDocTemplate(
        output_file,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )
    
    styles = getSampleStyleSheet()
    
    # 自定义中文样式
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontName=chinese_font,
        fontSize=20,
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading1_style = ParagraphStyle(
        'CustomH1',
        parent=styles['Heading1'],
        fontName=chinese_font,
        fontSize=16,
        spaceAfter=12
    )
    
    heading2_style = ParagraphStyle(
        'CustomH2',
        parent=styles['Heading2'],
        fontName=chinese_font,
        fontSize=14,
        spaceAfter=10
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontName=chinese_font,
        fontSize=10,
        leading=16
    )
    
    story = []
    
    # 添加封面
    story.append(Spacer(1, 100))
    story.append(Paragraph("🧴 病原微生物防控系统", title_style))
    story.append(Spacer(1, 20))
    story.append(Paragraph("操作说明书", title_style))
    story.append(Spacer(1, 50))
    story.append(Paragraph("版本 V1.5.1", ParagraphStyle('Version', parent=normal_style, alignment=TA_CENTER)))
    story.append(Spacer(1, 100))
    story.append(Paragraph("柳州市疾病预防控制中心<br/>消毒与病媒生物防制所<br/><br/>2026年3月", 
                          ParagraphStyle('Footer', parent=normal_style, alignment=TA_CENTER)))
    story.append(PageBreak())
    
    # 处理内容
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            story.append(Spacer(1, 6))
            continue
            
        # 标题
        if line.startswith('# '):
            text = line[2:]
            story.append(Paragraph(text, heading1_style))
        elif line.startswith('## '):
            text = line[3:]
            story.append(Paragraph(text, heading2_style))
        elif line.startswith('### '):
            text = line[4:]
            story.append(Paragraph(text, ParagraphStyle('H3', parent=normal_style, fontSize=12, spaceAfter=6)))
        elif line.startswith('---'):
            story.append(Spacer(1, 12))
        else:
            # 处理粗体
            line = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', line)
            # 处理斜体
            line = re.sub(r'\*(.+?)\*', r'<i>\1</i>', line)
            # 处理代码
            line = re.sub(r'`(.+?)`', r'<code>\1</code>', line)
            story.append(Paragraph(line, normal_style))
    
    doc.build(story)
    print(f"PDF已生成: {output_file}")

if __name__ == '__main__':
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'pathogen-control-system/操作说明书.md'
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'pathogen-control-system/病原微生物防控系统_操作说明书.pdf'
    markdown_to_pdf(input_file, output_file)
