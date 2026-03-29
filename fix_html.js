const fs = require('fs');

let html = fs.readFileSync('/storage/emulated/0/bio/src/image-compressor.html', 'utf8');

// The original CSS
const originalCSS = `        .dropzone {
            border: 2px dashed var(--accent-color);
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            background-color: rgba(37, 99, 235, 0.05);
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: var(--spacing-lg);
        }
        .dropzone.dragover {
            background-color: rgba(37, 99, 235, 0.15);
            border-color: #1d4ed8;
        }
        .dropzone i {
            font-size: 3rem;
            color: var(--accent-color);
            margin-bottom: 10px;
        }
        .dropzone p {
            margin: 0;
            color: var(--text-color);
            font-size: 1.1rem;
        }
        .dropzone-hint {
            font-size: 0.85rem;
            opacity: 0.7;
            margin-top: 5px;
        }
        
        .file-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .file-item {
            background-color: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .file-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 10px;
        }
        
        .file-name {
            font-weight: 600;
            word-break: break-all;
        }
        
        .file-stats {
            display: flex;
            gap: 15px;
            font-size: 0.9rem;
            align-items: center;
        }
        
        .stat-badge {
            background: var(--bg-color);
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
        }
        
        .stat-badge.success {
            background: #dcfce7;
            color: #166534;
        }
        body.dark-mode .stat-badge.success {
            background: #14532d;
            color: #4ade80;
        }
        
        .preview-container {
            display: flex;
            gap: 15px;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
        }
        
        .preview-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            width: 45%;
        }
        
        .preview-img {
            max-width: 100%;
            height: 150px;
            object-fit: contain;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="10" height="10" fill="%23ccc"/><rect x="10" width="10" height="10" fill="%23eee"/><rect y="10" width="10" height="10" fill="%23eee"/><rect x="10" y="10" width="10" height="10" fill="%23ccc"/></svg>');
        }
        
        .preview-label {
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .action-row {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        }
        
        .right-panel-content {
            padding: var(--spacing-xl);
            max-width: 1000px;
            margin: 0 auto;
            width: 100%;
        }
        
        .range-value {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        
        input[type="range"] {
            width: 100%;
            margin-bottom: 15px;
        }`;

html = html.replace(/<style>[\s\S]*?<\/style>/, `<style>\n${originalCSS}\n    </style>`);

// Fix original Dropzone HTML
const originalDropzone = `                    <div class="dropzone" id="dropzone">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <p>Drag & Drop Images Here</p>
                        <p class="dropzone-hint">or click to browse (JPG, PNG, WebP, GIF)</p>
                        <input type="file" id="file-input" multiple accept="image/*" style="display: none;">
                    </div>`;
html = html.replace(/<div class="dropzone" id="dropzone">[\s\S]*?<\/div>/, originalDropzone);

fs.writeFileSync('/storage/emulated/0/bio/src/image-compressor.html', html, 'utf8');

// Fix JS
let js = fs.readFileSync('/storage/emulated/0/bio/src/image-compressor.js', 'utf8');
js = js.replace(/<div class="file-name"><i class="fa-regular fa-image"><\/i> \$\{fileData\.originalName\}<\/div>/g, '<div class="file-name">${fileData.originalName}</div>');
js = js.replace(/<span class="stat-badge"><i class="fa-solid fa-hard-drive"><\/i> \$\{\(fileData\.originalSize \/ 1024\)\.toFixed\(1\)\} KB<\/span>/g, '<span class="stat-badge">Original: ${(fileData.originalSize / 1024).toFixed(1)} KB</span>');
js = js.replace(/<span class="stat-badge"><i class="fa-solid fa-hard-drive"><\/i> \$\{\(f\.originalSize \/ 1024\)\.toFixed\(1\)\} KB<\/span>/g, '<span class="stat-badge">Original: ${(f.originalSize / 1024).toFixed(1)} KB</span>');
js = js.replace(/<span class="stat-badge \$\{isSmaller \? 'success' : ''\}">\s*<i class="fa-solid fa-bolt"><\/i> \$\{\(fileData\.compressedSize \/ 1024\)\.toFixed\(1\)\} KB \s*\(\$\{isSmaller \? '-' : '\+'\}\$\{Math\.abs\(reduction\)\\}%\)\s*<\/span>/, `<span class="stat-badge \${isSmaller ? 'success' : ''}">
                New: \${(fileData.compressedSize / 1024).toFixed(1)} KB 
                (\${isSmaller ? '-' : '+'}\${Math.abs(reduction)}%)
            </span>`);

fs.writeFileSync('/storage/emulated/0/bio/src/image-compressor.js', js, 'utf8');
