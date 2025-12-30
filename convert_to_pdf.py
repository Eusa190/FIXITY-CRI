import markdown

# Read the markdown file
with open('README.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Convert markdown to HTML
html_content = markdown.markdown(
    md_content,
    extensions=['tables', 'fenced_code', 'codehilite', 'nl2br']
)

# Add professional CSS styling
html_with_style = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FIXITY - Civic Risk Index Documentation</title>
    <style>
        @media print {{
            @page {{
                size: A4;
                margin: 1.5cm;
            }}
            body {{
                font-size: 10pt;
            }}
            h1 {{
                page-break-before: always;
            }}
            h1:first-of-type {{
                page-break-before: avoid;
            }}
            pre, table {{
                page-break-inside: avoid;
            }}
        }}
        
        body {{
            font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.7;
            color: #1a1a1a;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #ffffff;
        }}
        
        h1 {{
            color: #1e3a8a;
            font-size: 32pt;
            font-weight: 700;
            border-bottom: 4px solid #3b82f6;
            padding-bottom: 12px;
            margin: 40px 0 25px 0;
        }}
        
        h1:first-of-type {{
            margin-top: 0;
            font-size: 38pt;
            text-align: center;
            border-bottom: none;
        }}
        
        h2 {{
            color: #1e40af;
            font-size: 22pt;
            font-weight: 600;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 10px;
            margin: 35px 0 20px 0;
        }}
        
        h3 {{
            color: #3b82f6;
            font-size: 16pt;
            font-weight: 600;
            margin: 25px 0 15px 0;
        }}
        
        h4 {{
            color: #475569;
            font-size: 13pt;
            font-weight: 600;
            margin: 20px 0 10px 0;
        }}
        
        p {{
            margin: 12px 0;
            text-align: justify;
        }}
        
        code {{
            background-color: #f1f5f9;
            color: #dc2626;
            padding: 3px 6px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 10pt;
        }}
        
        pre {{
            background-color: #1e293b;
            color: #e2e8f0;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 9pt;
            line-height: 1.5;
            margin: 15px 0;
            border-left: 4px solid #3b82f6;
        }}
        
        pre code {{
            background-color: transparent;
            color: #e2e8f0;
            padding: 0;
        }}
        
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        
        th {{
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }}
        
        td {{
            border: 1px solid #e2e8f0;
            padding: 10px;
        }}
        
        tr:nth-child(even) {{
            background-color: #f8fafc;
        }}
        
        ul, ol {{
            margin: 12px 0 12px 25px;
            padding-left: 0;
        }}
        
        li {{
            margin: 8px 0;
        }}
        
        blockquote {{
            border-left: 5px solid #3b82f6;
            background-color: #eff6ff;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 0 6px 6px 0;
        }}
        
        a {{
            color: #2563eb;
            text-decoration: none;
            border-bottom: 1px dotted #2563eb;
        }}
        
        a:hover {{
            color: #1e40af;
            border-bottom: 1px solid #1e40af;
        }}
        
        strong {{
            color: #1e293b;
            font-weight: 600;
        }}
        
        hr {{
            border: none;
            border-top: 2px solid #e2e8f0;
            margin: 30px 0;
        }}
        
        .header {{
            text-align: center;
            padding: 30px 0 40px 0;
            border-bottom: 3px solid #3b82f6;
            margin-bottom: 40px;
        }}
        
        .footer {{
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 10pt;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>FIXITY</h1>
        <p style="font-size: 14pt; color: #64748b;">Civic Risk Index (CRI) System - Technical Documentation</p>
    </div>
    
    {html_content}
    
    <div class="footer">
        <p><strong>FIXITY - Civic Risk Index System</strong></p>
        <p>Version 1.0.0 | December 2025</p>
    </div>
</body>
</html>
"""

# Save the HTML file
output_file = 'FIXITY-CRI-Documentation.html'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_with_style)

print(f"✅ HTML documentation created: {output_file}")
print(f"")
print(f"To convert to PDF:")
print(f"1. Open '{output_file}' in your browser")
print(f"2. Press Ctrl+P (or Cmd+P on Mac)")
print(f"3. Select 'Save as PDF' as the printer")
print(f"4. Click 'Save'")
print(f"")
print(f"✅ The file is ready for professional printing!")
