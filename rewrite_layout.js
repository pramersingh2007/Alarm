const fs = require('fs');

let html = fs.readFileSync('/storage/emulated/0/bio/src/image-compressor.html', 'utf8');

const newContainer = `        <div class="app-container" style="display: block; overflow-y: auto; padding: var(--spacing-xl); background-color: var(--bg-color);">
            <div style="max-width: 800px; margin: 0 auto; width: 100%;">
                <header style="margin-bottom: 20px; text-align: center;">
                    <h1 style="color: var(--text-color); font-size: 2rem;"><i class="fa-solid fa-compress" style="color: var(--accent-color);"></i> Compress Images</h1>
                    <p style="color: var(--text-color); opacity: 0.7;">Reduce file size without losing quality</p>
                </header>

                <div class="card" style="margin-bottom: 20px; background: var(--panel-bg); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <h2 style="font-size: 1.2rem; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Settings & Actions</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <div class="range-value" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <label for="quality">Image Quality</label>
                                <span id="quality-val">80%</span>
                            </div>
                            <input type="range" id="quality" min="1" max="100" value="80" style="width: 100%;">
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
                            <button id="btn-download-all" class="btn btn-primary" style="flex: 1;" disabled>
                                <i class="fa-solid fa-download"></i> Download All
                            </button>
                            <button id="btn-clear" class="btn btn-danger" style="flex: 1;" disabled>
                                <i class="fa-solid fa-trash-can"></i> Clear All
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="dropzone" id="dropzone">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <p>Drag & Drop Images Here</p>
                    <p class="dropzone-hint">or click to browse (JPG, PNG, WebP, GIF)</p>
                    <input type="file" id="file-input" multiple accept="image/*" style="display: none;">
                </div>
                
                <div class="file-list" id="file-list">
                    <!-- File items will be rendered here -->
                </div>
            </div>
        </div>`;

// Replace content of app-container
const appContainerRegex = /<div class="app-container">[\s\S]*?<\/main>\s*<\/div>/;
if (appContainerRegex.test(html)) {
    html = html.replace(appContainerRegex, newContainer);
    fs.writeFileSync('/storage/emulated/0/bio/src/image-compressor.html', html, 'utf8');
    console.log("Successfully rewrote layout");
} else {
    console.log("Could not find regex match!");
}
