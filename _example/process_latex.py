#!/usr/bin/env python3
"""
LaTeX to Markdown Converter

This script processes LaTeX files in the _example directory and converts them to markdown format
by stripping LaTeX syntax while preserving content structure and readability.

Rules followed:
- Convert sections and subsections to markdown headers with appropriate depth
- Strip inline typesetting (bold, italic, etc.)
- Preserve inline math equations for readability
- Remove labels and citations without replacement
- Replace equation blocks with <EQN HERE> placeholder
- Use best practices for any unmentioned cases
"""

import re
import os
import glob
from pathlib import Path

def process_latex_file(input_file, output_file):
    """
    Process a single LaTeX file and convert it to markdown format.
    
    Args:
        input_file (str): Path to input LaTeX file
        output_file (str): Path to output markdown file
    """
    print(f"Processing {input_file} -> {output_file}")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove LaTeX document structure
    content = re.sub(r'\\documentclass\[.*?\]\{.*?\}', '', content)
    content = re.sub(r'\\begin\{document\}', '', content)
    content = re.sub(r'\\end\{document\}', '', content)
    
    # Remove comments
    content = re.sub(r'%.*$', '', content, flags=re.MULTILINE)
    
    # Remove custom commands and placeholders
    content = re.sub(r'\\myCover\{.*?\}', '', content)
    content = re.sub(r'\\myChapterCover\{\}', '', content)
    content = re.sub(r'\\newpage', '', content)
    
    # Convert sections to markdown headers
    content = re.sub(r'\\section\{(.*?)\}\s*\\label\{.*?\}', r'# \1', content)
    content = re.sub(r'\\section\{(.*?)\}', r'# \1', content)
    
    content = re.sub(r'\\subsection\{(.*?)\}\s*\\label\{.*?\}', r'## \1', content)
    content = re.sub(r'\\subsection\{(.*?)\}', r'## \1', content)
    
    content = re.sub(r'\\subsubsection\{(.*?)\}\s*\\label\{.*?\}', r'### \1', content)
    content = re.sub(r'\\subsubsection\{(.*?)\}', r'### \1', content)
    
    # Remove labels without section headers
    content = re.sub(r'\\label\{.*?\}', '', content)
    
    # Remove citations
    content = re.sub(r'\\cite\{.*?\}', '', content)
    content = re.sub(r'~\\cite\{.*?\}', '', content)
    content = re.sub(r'\\Cref\{.*?\}', '', content)
    content = re.sub(r'\\cref\{.*?\}', '', content)
    
    # Replace equation blocks with placeholder
    content = re.sub(r'\\begin\{equation\}.*?\\end\{equation\}', '<EQN HERE>', content, flags=re.DOTALL)
    content = re.sub(r'\\begin\{align\}.*?\\end\{align\}', '<EQN HERE>', content, flags=re.DOTALL)
    content = re.sub(r'\\begin\{split\}.*?\\end\{split\}', '<EQN HERE>', content, flags=re.DOTALL)
    
    # Handle inline math - preserve for readability but clean up
    # Remove LaTeX commands within math but keep the mathematical content
    content = re.sub(r'\$([^$]*?)\$', lambda m: '$' + clean_math_content(m.group(1)) + '$', content)
    
    # Remove other LaTeX formatting
    content = re.sub(r'\\textit\{([^}]*)\}', r'\1', content)
    content = re.sub(r'\\textbf\{([^}]*)\}', r'\1', content)
    content = re.sub(r'\\text\{([^}]*)\}', r'\1', content)
    
    # Remove figure environments
    content = re.sub(r'\\begin\{figure\}.*?\\end\{figure\}', '', content, flags=re.DOTALL)
    
    # Remove table environments
    content = re.sub(r'\\begin\{table\}.*?\\end\{table\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\\begin\{tabulary\}.*?\\end\{tabulary\}', '', content, flags=re.DOTALL)
    
    # Remove other LaTeX commands
    content = re.sub(r'\\centering', '', content)
    content = re.sub(r'\\includegraphics\[.*?\]\{.*?\}', '', content)
    content = re.sub(r'\\caption\{.*?\}', '', content)
    content = re.sub(r'\\toprule', '', content)
    content = re.sub(r'\\midrule', '', content)
    content = re.sub(r'\\bottomrule', '', content)
    
    # Remove tensor notation and other LaTeX-specific formatting
    content = re.sub(r'\\tensor\[.*?\]\{.*?\}\{.*?\}', '', content)
    content = re.sub(r'\\mathbf\{([^}]*)\}', r'\1', content)
    content = re.sub(r'\\vec\{([^}]*)\}', r'\1', content)
    
    # Clean up extra whitespace and empty lines
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    content = re.sub(r'^\s+', '', content, flags=re.MULTILINE)
    content = re.sub(r'\s+$', '', content, flags=re.MULTILINE)
    
    # Remove any remaining LaTeX commands (catch-all)
    content = re.sub(r'\\[a-zA-Z]+\{.*?\}', '', content)
    content = re.sub(r'\\[a-zA-Z]+', '', content)
    
    # Final cleanup
    content = content.strip()
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Completed: {output_file}")

def clean_math_content(math_text):
    """
    Clean up mathematical content while preserving readability.
    
    Args:
        math_text (str): Raw mathematical content from LaTeX
        
    Returns:
        str: Cleaned mathematical content
    """
    # Remove LaTeX commands but keep the content
    math_text = re.sub(r'\\[a-zA-Z]+\{([^}]*)\}', r'\1', math_text)
    math_text = re.sub(r'\\[a-zA-Z]+', '', math_text)
    
    # Clean up common LaTeX math symbols
    math_text = re.sub(r'\\left', '', math_text)
    math_text = re.sub(r'\\right', '', math_text)
    math_text = re.sub(r'\\text\{([^}]*)\}', r'\1', math_text)
    
    return math_text.strip()

def main():
    """Main function to process all LaTeX files in the _example directory."""
    example_dir = Path("_example")
    
    if not example_dir.exists():
        print("Error: _example directory not found!")
        return
    
    # Find all .tex files
    tex_files = list(example_dir.glob("*.tex"))
    
    if not tex_files:
        print("No .tex files found in _example directory!")
        return
    
    print(f"Found {len(tex_files)} LaTeX files to process:")
    for tex_file in tex_files:
        print(f"  - {tex_file.name}")
    
    print("\nStarting conversion...")
    
    # Process each file
    for tex_file in tex_files:
        # Create output filename
        output_file = tex_file.with_suffix('.md')
        
        try:
            process_latex_file(str(tex_file), str(output_file))
        except Exception as e:
            print(f"Error processing {tex_file}: {e}")
    
    print(f"\n✓ Conversion complete! Processed {len(tex_files)} files.")
    print("Output files:")
    for tex_file in tex_files:
        output_file = tex_file.with_suffix('.md')
        print(f"  - {output_file.name}")

if __name__ == "__main__":
    main() 