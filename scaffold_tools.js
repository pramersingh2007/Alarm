const fs = require('fs');
const path = require('path');

const tools = [
    { id: 't00', name: 'Bio Data Maker', file: 'index.html', icon: 'fa-file-signature' },
    { id: 't01', name: 'Image Compressor', file: 'image-compressor.html', icon: 'fa-compress' },
    { id: 't02', name: 'Image Resize', file: 'image-resize.html', icon: 'fa-expand' },
    { id: 't03', name: 'Passport Photo Crop', file: 'passport-photo-crop.html', icon: 'fa-crop-simple' },
    { id: 't04', name: 'JPG → PDF', file: 'jpg-to-pdf.html', icon: 'fa-file-pdf' },
    { id: 't05', name: 'PDF to JPG', file: 'pdf-to-jpg.html', icon: 'fa-image' },
    { id: 't06', name: 'Image Merge', file: 'image-merge.html', icon: 'fa-object-group', prefix: 'fa-regular' },
    { id: 't07', name: 'PDF Merge', file: 'pdf-merge.html', icon: 'fa-object-group' },
    { id: 't08', name: 'OCR Tool', file: 'ocr-tool.html', icon: 'fa-file-lines' },
    { id: 't09', name: 'PDF Compressor', file: 'pdf-compressor.html', icon: 'fa-file-zipper' },
    { id: 't10', name: 'Copy PDF Text', file: 'copy-pdf-text.html', icon: 'fa-copy' },
    { id: 't11', name: 'Add White BG', file: 'add-white-bg.html', icon: 'fa-square' },
    { id: 't12', name: 'Background Remover', file: 'background-remover.html', icon: 'fa-eraser' }
];

const generateNavLinks = (currentFile) => {
    return tools.map(t => {
        const isActive = t.file === currentFile ? ' class="active"' : '';
        const prefix = t.prefix || 'fa-solid';
        return `                    <a href="${t.file}"${isActive}><i class="${prefix} ${t.icon}"></i> ${t.name}</a>`;
    }).join('\n');
};

const srcDir = '/storage/emulated/0/bio/src';
const rootIndex = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');

// Update links in root index
const dropdownRegex = /<div class="nav-dropdown-content" id="nav-dropdown-content">[\s\S]*?<\/div>/;

tools.forEach(tool => {
    let content;
    if (tool.file === 'index.html') {
        content = rootIndex;
        const newDropdown = `<div class="nav-dropdown-content" id="nav-dropdown-content">\n${generateNavLinks(tool.file)}\n                </div>`;
        content = content.replace(dropdownRegex, newDropdown);
        fs.writeFileSync(path.join(srcDir, tool.file), content);
    } else {
        // Create basic boilerplate for others
        const titleName = tool.name;
        const newDropdown = `<div class="nav-dropdown-content" id="nav-dropdown-content">\n${generateNavLinks(tool.file)}\n                </div>`;
        
        // Let's create a minimal shell for the other tools
        const htmlShell = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titleName} - Multi-Tool Suite</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link id="font-stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
    <style>
        .tool-container {
            padding: var(--spacing-xl);
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            overflow-y: auto;
        }
        .tool-header {
            margin-bottom: var(--spacing-xl);
            border-bottom: 1px solid var(--border-color);
            padding-bottom: var(--spacing-md);
        }
        .tool-header h1 {
            font-size: 1.8rem;
            color: var(--text-color);
            margin-bottom: 8px;
        }
        .tool-header p {
            color: var(--text-color);
            opacity: 0.7;
        }
    </style>
</head>
<body class="light-mode theme-inter layout-modern">
    <div class="app-wrapper">
        <!-- Global Navigation -->
        <nav class="global-nav">
            <div class="nav-dropdown">
                <button class="nav-brand" id="nav-dropdown-btn">
                    <i class="fa-solid fa-layer-group"></i> Multi-Tool Suite <i class="fa-solid fa-chevron-down" style="font-size: 0.8em; margin-left: 5px;"></i>
                </button>
                ${newDropdown}
            </div>
            
            <div class="nav-current-tool">
                <span>${titleName}</span>
            </div>
        </nav>
        
        <div class="app-container">
            <div class="tool-container">
                <header class="tool-header">
                    <h1>${titleName}</h1>
                    <p>Coming soon...</p>
                </header>
                <div class="tool-content" id="tool-content">
                    <!-- Tool UI will go here -->
                </div>
            </div>
        </div>
    </div>
    <script>
        // Basic nav toggle
        const navBtn = document.getElementById('nav-dropdown-btn');
        const navContent = document.getElementById('nav-dropdown-content');
        if(navBtn && navContent) {
            navBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navContent.classList.toggle('show');
            });
            window.addEventListener('click', () => {
                navContent.classList.remove('show');
            });
        }
    </script>
    <script src="${tool.file.replace('.html', '.js')}"></script>
</body>
</html>`;
        fs.writeFileSync(path.join(srcDir, tool.file), htmlShell);
        
        // Create an empty JS file
        const jsName = tool.file.replace('.html', '.js');
        fs.writeFileSync(path.join(srcDir, jsName), `// JS for ${titleName}\nconsole.log('${titleName} initialized');\n`);
    }
});

// Also create a new build.sh that copies all these files correctly for deployment
const newBuildSh = `#!/bin/bash
cd /storage/emulated/0/bio

# Array of all tool HTML files
FILES=("index.html" "image-compressor.html" "image-resize.html" "passport-photo-crop.html" "jpg-to-pdf.html" "pdf-to-jpg.html" "image-merge.html" "pdf-merge.html" "ocr-tool.html" "pdf-compressor.html" "copy-pdf-text.html" "add-white-bg.html" "background-remover.html")

for FILE in "\${FILES[@]}"; do
    echo "Building \$FILE..."
    # Create HTML header and inject CSS
    sed -n '1,/<link rel="stylesheet" href="styles.css">/p' "src/\$FILE" | grep -v '<link rel="stylesheet" href="styles.css">' > "\$FILE"
    echo "    <style>" >> "\$FILE"
    cat src/styles.css >> "\$FILE"
    echo "    </style>" >> "\$FILE"
    echo "</head>" >> "\$FILE"
    
    # Get body and JS
    JS_FILE="\${FILE%.html}.js"
    if [ "\$FILE" == "index.html" ]; then
        JS_FILE="app.js"
    fi
    
    sed -n '/<body/,/<\/body>/p' "src/\$FILE" | sed "/<script src=\"\$JS_FILE\"><\/script>/d" >> "\$FILE"
    sed -i 's/<\/body>/<script>\n<\/script>\n<\/body>/' "\$FILE"
    sed -e "/<script>/r src/\$JS_FILE" -i "\$FILE"
done

echo "Build complete. All tools built in /storage/emulated/0/bio/"
`;
fs.writeFileSync('/storage/emulated/0/bio/build.sh', newBuildSh);
fs.chmodSync('/storage/emulated/0/bio/build.sh', 0o755);

console.log("Scaffolding complete.");
