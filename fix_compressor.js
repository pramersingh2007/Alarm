const fs = require('fs');

let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Compressor - Multi-Tool Suite</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link id="font-stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <link rel="stylesheet" href="styles.css">
    <style>
        .page-wrapper {
            background-color: var(--bg-color);
            min-height: calc(100vh - 55px);
            padding: var(--spacing-xl) 20px;
        }
        .content-container {
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .header-title {
            text-align: center;
            color: var(--text-color);
        }
        .header-title h1 { margin-bottom: 5px; color: var(--accent-color); }
        
        .settings-card {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .settings-card .full-width { grid-column: span 2; }
        
        .dropzone {
            border: 2px dashed var(--accent-color);
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            background-color: var(--panel-bg);
            cursor: pointer;
            transition: all 0.3s;
        }
        .dropzone:hover { background-color: rgba(37, 99, 235, 0.05); }
        .dropzone i { font-size: 3rem; color: var(--accent-color); margin-bottom: 10px; }
        .dropzone p { margin: 0; color: var(--text-color); font-size: 1.1rem; font-weight: 600; }
        .dropzone-hint { font-size: 0.85rem; opacity: 0.7; margin-top: 5px; font-weight: normal; }
        
        .file-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .file-item {
            background-color: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .file-item-header {
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid var(--border-color); padding-bottom: 10px;
        }
        .file-name { font-weight: 600; word-break: break-all; }
        .file-stats { display: flex; gap: 10px; font-size: 0.9rem; align-items: center; flex-wrap: wrap; }
        .stat-badge { background: var(--bg-color); padding: 4px 8px; border-radius: 4px; font-family: monospace; }
        .stat-badge.success { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
        
        .preview-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
            justify-content: center;
            background: var(--bg-color);
            padding: 15px;
            border-radius: 8px;
        }
        .preview-box { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 100%; }
        .preview-img { max-width: 100%; height: auto; max-height: 200px; object-fit: contain; border-radius: 4px; background: #e2e8f0; }
        body.dark-mode .preview-img { background: #334155; }
        
        @media (max-width: 600px) {
            .settings-card { grid-template-columns: 1fr; }
            .settings-card .full-width { grid-column: span 1; }
        }
        
        .range-value { display: flex; justify-content: space-between; margin-bottom: 5px; }
        input[type="range"] { width: 100%; margin-bottom: 15px; }
    </style>
</head>
<body class="light-mode theme-inter layout-modern">
    <div class="app-wrapper">
        <nav class="global-nav">
            <div class="nav-dropdown">
                <button class="nav-brand" id="nav-dropdown-btn">
                    <i class="fa-solid fa-layer-group"></i> Multi-Tool Suite <i class="fa-solid fa-chevron-down" style="font-size: 0.8em; margin-left: 5px;"></i>
                </button>
                <div class="nav-dropdown-content" id="nav-dropdown-content">
                    <a href="index.html"><i class="fa-solid fa-file-signature"></i> Bio Data Maker</a>
                    <a href="image-compressor.html" class="active"><i class="fa-solid fa-compress"></i> Image Compressor</a>
                    <a href="image-resize.html"><i class="fa-solid fa-expand"></i> Image Resize</a>
                    <a href="passport-photo-crop.html"><i class="fa-solid fa-crop-simple"></i> Passport Photo Crop</a>
                    <a href="jpg-to-pdf.html"><i class="fa-solid fa-file-pdf"></i> JPG → PDF</a>
                    <a href="pdf-to-jpg.html"><i class="fa-solid fa-image"></i> PDF to JPG</a>
                    <a href="image-merge.html"><i class="fa-regular fa-object-group"></i> Image Merge</a>
                    <a href="pdf-merge.html"><i class="fa-solid fa-object-group"></i> PDF Merge</a>
                    <a href="ocr-tool.html"><i class="fa-solid fa-file-lines"></i> OCR Tool</a>
                    <a href="pdf-compressor.html"><i class="fa-solid fa-file-zipper"></i> PDF Compressor</a>
                    <a href="copy-pdf-text.html"><i class="fa-solid fa-copy"></i> Copy PDF Text</a>
                    <a href="add-white-bg.html"><i class="fa-solid fa-square"></i> Add White BG</a>
                    <a href="background-remover.html"><i class="fa-solid fa-eraser"></i> Background Remover</a>
                </div>
            </div>
            <div class="nav-current-tool"><span>Image Compressor</span></div>
        </nav>
        
        <div class="page-wrapper">
            <div class="content-container">
                
                <div class="header-title">
                    <h1><i class="fa-solid fa-compress"></i> Compress Images</h1>
                    <p>Reduce file size without losing quality</p>
                </div>

                <div class="settings-card">
                    <div>
                        <div class="range-value">
                            <label for="quality">Image Quality</label>
                            <span id="quality-val">80%</span>
                        </div>
                        <input type="range" id="quality" min="1" max="100" value="80">
                    </div>
                    <div>
                        <label for="format" style="display: block; margin-bottom: 5px;">Output Format</label>
                        <select id="format" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color);">
                            <option value="image/jpeg">JPEG (Lossy, Smallest)</option>
                            <option value="image/webp">WebP (Modern, Balanced)</option>
                            <option value="image/png">PNG (Lossless, Larger)</option>
                        </select>
                    </div>
                    <div>
                        <label for="target-size" style="display: block; margin-bottom: 5px;">Target Size (Optional, KB)</label>
                        <input type="number" id="target-size" placeholder="e.g. 200" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color);">
                    </div>
                    <div style="display: flex; gap: 10px; align-items: flex-end;">
                        <button id="btn-download-all" class="btn btn-primary" style="flex: 1;" disabled><i class="fa-solid fa-download"></i> Download</button>
                        <button id="btn-clear" class="btn btn-danger" style="flex: 1;" disabled><i class="fa-solid fa-trash-can"></i> Clear</button>
                    </div>
                </div>

                <!-- UPLOAD BUTTON / DROPZONE -->
                <div class="dropzone" id="dropzone">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <p>Drag & Drop Images Here</p>
                    <p class="dropzone-hint">or click to browse (JPG, PNG, WebP, GIF)</p>
                    <input type="file" id="file-input" multiple accept="image/*" style="display: none;">
                </div>

                <!-- PREVIEW SECTION (FILE LIST) -->
                <div class="file-list" id="file-list">
                    <!-- File items will be rendered here -->
                </div>

            </div>
        </div>
    </div>
    
    <script>
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
    <script src="image-compressor.js"></script>
</body>
</html>`;

fs.writeFileSync('/storage/emulated/0/bio/src/image-compressor.html', html, 'utf8');
console.log('Fixed compressor HTML layout');
