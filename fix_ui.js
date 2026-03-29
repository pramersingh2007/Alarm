const fs = require('fs');

let css = fs.readFileSync('/storage/emulated/0/bio/src/image-compressor.html', 'utf8');

// Enhancing UI styles
const newCss = `
        .right-panel {
            background-color: var(--bg-color);
            overflow-y: auto;
            position: relative;
        }
        .dropzone {
            border: 2px dashed var(--accent-color);
            border-radius: 12px;
            padding: 50px 30px;
            text-align: center;
            background-color: var(--panel-bg);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            margin-bottom: var(--spacing-xl);
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
            position: relative;
            overflow: hidden;
        }
        .dropzone::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--accent-color);
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 0;
        }
        .dropzone.dragover {
            border-color: var(--accent-color);
            transform: scale(1.02);
        }
        .dropzone.dragover::before {
            opacity: 0.05;
        }
        .dropzone-content {
            position: relative;
            z-index: 1;
        }
        .dropzone i {
            font-size: 3.5rem;
            color: var(--accent-color);
            margin-bottom: 15px;
            transition: transform 0.3s;
        }
        .dropzone:hover i {
            transform: translateY(-5px);
        }
        .dropzone p {
            margin: 0;
            color: var(--text-color);
            font-size: 1.2rem;
            font-weight: 600;
        }
        .dropzone-hint {
            font-size: 0.9rem !important;
            opacity: 0.6;
            margin-top: 8px !important;
            font-weight: normal !important;
        }
        
        .file-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
            padding-bottom: 40px;
        }
        
        .file-item {
            background-color: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .file-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.06);
        }
        
        .file-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 12px;
        }
        
        .file-name {
            font-weight: 600;
            font-size: 1.05rem;
            word-break: break-all;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .file-name i {
            color: var(--accent-color);
        }
        
        .file-stats {
            display: flex;
            gap: 10px;
            font-size: 0.85rem;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .stat-badge {
            background: var(--bg-color);
            padding: 5px 10px;
            border-radius: 6px;
            font-family: 'Inter', monospace;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .stat-badge.success {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }
        body.dark-mode .stat-badge.success {
            background: rgba(34, 197, 94, 0.1);
            color: #4ade80;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .preview-container {
            display: flex;
            gap: 15px;
            align-items: center;
            justify-content: center;
            margin-top: 5px;
            background: var(--bg-color);
            padding: 15px;
            border-radius: 8px;
        }
        
        .preview-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: 50%;
        }
        
        .preview-img {
            max-width: 100%;
            height: 140px;
            object-fit: contain;
            border-radius: 6px;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="10" height="10" fill="%23e2e8f0"/><rect x="10" width="10" height="10" fill="%23f8fafc"/><rect y="10" width="10" height="10" fill="%23f8fafc"/><rect x="10" y="10" width="10" height="10" fill="%23e2e8f0"/></svg>');
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        body.dark-mode .preview-img {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="10" height="10" fill="%23334155"/><rect x="10" width="10" height="10" fill="%231e293b"/><rect y="10" width="10" height="10" fill="%231e293b"/><rect x="10" y="10" width="10" height="10" fill="%23334155"/></svg>');
        }
        
        .preview-label {
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-color);
            opacity: 0.7;
        }
        
        .action-row {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 5px;
        }
        
        .right-panel-content {
            padding: var(--spacing-xl);
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
        }
        
        @media (max-width: 900px) {
            .file-list {
                grid-template-columns: 1fr;
            }
        }`;

css = css.replace(/\.dropzone \{[\s\S]*?\.range-value \{/g, newCss + '\n        .range-value {');

// Fix dropzone html
const oldDropzone = `<div class="dropzone" id="dropzone">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <p>Drag & Drop Images Here</p>
                        <p class="dropzone-hint">or click to browse (JPG, PNG, WebP, GIF)</p>
                        <input type="file" id="file-input" multiple accept="image/*" style="display: none;">
                    </div>`;

const newDropzone = `<div class="dropzone" id="dropzone">
                        <div class="dropzone-content">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                            <p>Drag & Drop Images Here</p>
                            <p class="dropzone-hint">or click to browse files (JPG, PNG, WebP, GIF)</p>
                        </div>
                        <input type="file" id="file-input" multiple accept="image/*" style="display: none;">
                    </div>`;

css = css.replace(oldDropzone, newDropzone);

fs.writeFileSync('/storage/emulated/0/bio/src/image-compressor.html', css, 'utf8');

// Update JS for icons in filename
let js = fs.readFileSync('/storage/emulated/0/bio/src/image-compressor.js', 'utf8');
js = js.replace(/<div class="file-name">\$\{fileData\.originalName\}<\/div>/, '<div class="file-name"><i class="fa-regular fa-image"></i> ${fileData.originalName}</div>');
js = js.replace(/<span class="stat-badge">Original: \$\{\(fileData\.originalSize \/ 1024\)\.toFixed\(1\)\} KB<\/span>/, '<span class="stat-badge"><i class="fa-solid fa-hard-drive"></i> ${(fileData.originalSize / 1024).toFixed(1)} KB</span>');
js = js.replace(/<span class="stat-badge">Original: \$\{\(f\.originalSize \/ 1024\)\.toFixed\(1\)\} KB<\/span>/, '<span class="stat-badge"><i class="fa-solid fa-hard-drive"></i> ${(f.originalSize / 1024).toFixed(1)} KB</span>');
js = js.replace(/<span class="stat-badge \$\{isSmaller \? 'success' : ''\}">\s*New: \$\{\(fileData\.compressedSize \/ 1024\)\.toFixed\(1\)\} KB \s*\(\$\{isSmaller \? '-' : '\+'\}\$\{Math\.abs\(reduction\)\\}%\)\s*<\/span>/, `<span class="stat-badge \${isSmaller ? 'success' : ''}">
                <i class="fa-solid fa-bolt"></i> \${(fileData.compressedSize / 1024).toFixed(1)} KB 
                (\${isSmaller ? '-' : '+'}\${Math.abs(reduction)}%)
            </span>`);
fs.writeFileSync('/storage/emulated/0/bio/src/image-compressor.js', js, 'utf8');
