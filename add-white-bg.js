// DOM Elements
const DOM = {
    dropzone: document.getElementById('dropzone'),
    fileInput: document.getElementById('file-input'),
    imageList: document.getElementById('image-list'),
    bgColor: document.getElementById('bg-color'),
    padding: document.getElementById('padding'),
    format: document.getElementById('format'),
    quality: document.getElementById('quality'),
    btnProcess: document.getElementById('btn-process'),
    btnDownloadAll: document.getElementById('btn-download-all'),
    btnClear: document.getElementById('btn-clear'),
    autoRemove: document.getElementById('auto-remove'),
    aiStatus: document.getElementById('ai-status'),
    aiLoading: document.getElementById('ai-loading')
};

const CONFIG = {
    // Fetch pool from localStorage or initialize with default
    getPool: () => {
        const pool = JSON.parse(localStorage.getItem('remove_bg_pool') || '[]');
        if (pool.length === 0) {
            // Default key if pool is empty
            return [{ key: 'jsguBELu2ZyfGUCXF6qShDmR', limit: 50, used: 0, id: 'default' }];
        }
        return pool;
    },
    
    getActiveKeyData: () => {
        const pool = CONFIG.getPool();
        return pool.find(item => item.used < item.limit);
    },

    getAPIKey: () => {
        const active = CONFIG.getActiveKeyData();
        return active ? active.key : null;
    },

    incrementKeyUsage: (key) => {
        const pool = CONFIG.getPool();
        const index = pool.findIndex(item => item.key === key);
        if (index !== -1) {
            pool[index].used += 1;
            localStorage.setItem('remove_bg_pool', JSON.stringify(pool));
        }
    }
};

let filesData = [];

// Global scope functions
function updateGlobalActions() {
    if (DOM.btnProcess) DOM.btnProcess.disabled = filesData.length === 0;
    if (DOM.btnClear) DOM.btnClear.disabled = filesData.length === 0;
}

function removeFile(id) {
    filesData = filesData.filter(f => f.id !== id);
    const item = document.getElementById(`item-${id}`);
    if (item) item.remove();
    updateGlobalActions();
}

function downloadSingle(id) {
    const data = filesData.find(f => f.id === id);
    if (!data || !data.processedDataUrl) return;
    const ext = DOM.format.value.split('/')[1] === 'jpeg' ? 'jpg' : DOM.format.value.split('/')[1];
    const name = data.originalName.replace(/\.[^/.]+$/, "");
    const a = document.createElement('a');
    a.href = data.processedDataUrl;
    a.download = `${name}_white_bg.${ext}`;
    a.click();
}

async function removeBackgroundAI(img, itemId) {
    const key = CONFIG.getAPIKey();
    const statusLabel = document.querySelector(`#item-${itemId} .status-label`);
    
    if (!key) {
        if (statusLabel) {
            statusLabel.innerText = "No Credits Left";
            statusLabel.style.background = "#ef4444";
        }
        alert("All API keys are exhausted or missing. Please update keys in the Admin Panel.");
        DOM.autoRemove.checked = false;
        return img;
    }

    if (statusLabel) {
        statusLabel.innerText = "API Removing...";
        statusLabel.style.background = "var(--accent-color)";
    }

    // Convert image to blob for upload
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const formData = new FormData();
        formData.append('image_file', blob);
        formData.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: { 'X-Api-Key': key },
            body: formData
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.errors?.[0]?.title || 'API Error');
        }

        // Increment usage count on success
        CONFIG.incrementKeyUsage(key);

        const resultBlob = await response.blob();
        const resultImg = new Image();
        
        return new Promise((resolve, reject) => {
            resultImg.onload = () => {
                if (statusLabel) {
                    statusLabel.innerText = "AI Done";
                    statusLabel.style.background = "#10b981";
                }
                resolve(resultImg);
            };
            resultImg.onerror = reject;
            resultImg.src = URL.createObjectURL(resultBlob);
        });

    } catch (e) {
        console.error("Remove.bg API Error:", e);
        if (statusLabel) {
            statusLabel.innerText = e.message || "API Error";
            statusLabel.style.background = "#ef4444";
        }
        return img;
    }
}

async function processSingle(id) {
    const data = filesData.find(f => f.id === id);
    if (!data) return;

    const autoRemove = DOM.autoRemove.checked;
    let sourceImg = data.img;

    if (autoRemove) {
        sourceImg = await removeBackgroundAI(data.img, id);
    }

    const bgColor = DOM.bgColor.value;
    const padding = parseInt(DOM.padding.value) || 0;
    const format = DOM.format.value;
    const quality = parseInt(DOM.quality.value) / 100;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = sourceImg.width + (padding * 2);
    canvas.height = sourceImg.height + (padding * 2);
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(sourceImg, padding, padding);
    
    return new Promise(resolve => {
        canvas.toBlob(blob => {
            if (data.processedDataUrl) URL.revokeObjectURL(data.processedDataUrl);
            data.processedBlob = blob;
            data.processedDataUrl = URL.createObjectURL(blob);
            const previewImg = document.getElementById(`preview-${data.id}`);
            if (previewImg) previewImg.src = data.processedDataUrl;
            const dlBtn = document.getElementById(`btn-dl-${data.id}`);
            if (dlBtn) dlBtn.disabled = false;
            resolve();
        }, format, format === 'image/png' ? undefined : quality);
    });
}

async function processAll() {
    if (filesData.length === 0) return;
    DOM.btnProcess.disabled = true;
    DOM.btnProcess.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    for (const data of filesData) {
        await processSingle(data.id);
    }
    DOM.btnProcess.innerHTML = '<i class="fa-solid fa-check"></i> Applied to All';
    setTimeout(() => {
        DOM.btnProcess.innerHTML = '<i class="fa-solid fa-bolt"></i> Re-Process All';
        DOM.btnProcess.disabled = false;
    }, 2000);
    DOM.btnDownloadAll.style.display = 'block';
}

function renderImageItem(id, src, name, width, height) {
    const item = document.createElement('div');
    item.className = 'image-item';
    item.id = `item-${id}`;
    item.innerHTML = `
        <div class="preview-box">
            <img src="${src}" id="preview-${id}">
            <div class="status-label" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); color: white; font-size: 0.65rem; padding: 4px 8px; border-radius: 20px; font-weight: 700; backdrop-filter: blur(4px);">Waiting...</div>
            <div style="position: absolute; bottom: 10px; left: 10px; background: rgba(255,255,255,0.9); color: #0f172a; font-size: 0.65rem; padding: 4px 8px; border-radius: 6px; font-weight: 800; border: 1px solid var(--border-color);">${width} x ${height} px</div>
        </div>
        <div style="font-size: 0.85rem; font-weight: 600; word-break: break-all; margin-bottom: 12px; color: var(--text-color); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
            ${name}
        </div>
        <div class="action-row">
            <button class="btn btn-danger btn-sm btn-remove" style="flex: 1; justify-content: center; height: 38px;">
                <i class="fa-solid fa-trash"></i> Remove
            </button>
            <button class="btn btn-primary btn-sm btn-download" id="btn-dl-${id}" disabled style="flex: 1; justify-content: center; height: 38px;">
                <i class="fa-solid fa-download"></i> Save
            </button>
        </div>
    `;
    item.querySelector('.btn-remove').addEventListener('click', () => removeFile(id));
    item.querySelector('.btn-download').addEventListener('click', () => downloadSingle(id));
    DOM.imageList.appendChild(item);
}

function processFiles(files) {
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (newFiles.length === 0) return;
    newFiles.forEach(file => {
        const id = 'img-' + Math.random().toString(36).substr(2, 9);
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                filesData.push({ id, img, originalName: file.name, processedBlob: null, processedDataUrl: null });
                renderImageItem(id, e.target.result, file.name, img.width, img.height);
                updateGlobalActions();
                processSingle(id);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
    DOM.fileInput.value = '';
}

async function downloadAll() {
    if (typeof JSZip === 'undefined') return;
    const zip = new JSZip();
    const ext = DOM.format.value.split('/')[1] === 'jpeg' ? 'jpg' : DOM.format.value.split('/')[1];
    filesData.forEach((f, i) => {
        if (f.processedBlob) {
            const name = f.originalName.replace(/\.[^/.]+$/, "");
            zip.file(`${name}_white_bg_${i+1}.${ext}`, f.processedBlob);
        }
    });
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = "images_white_bg.zip";
    a.click();
}

function clearAll() {
    filesData = [];
    DOM.imageList.innerHTML = '';
    DOM.btnDownloadAll.style.display = 'none';
    updateGlobalActions();
}

function setupEventListeners() {
    DOM.dropzone.addEventListener('click', () => DOM.fileInput.click());
    DOM.fileInput.addEventListener('change', (e) => processFiles(e.target.files));
    DOM.dropzone.addEventListener('dragover', (e) => { e.preventDefault(); DOM.dropzone.classList.add('dragover'); });
    DOM.dropzone.addEventListener('dragleave', () => DOM.dropzone.classList.remove('dragover'));
    DOM.dropzone.addEventListener('drop', (e) => {
        e.preventDefault(); DOM.dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
    });
    DOM.btnProcess.addEventListener('click', processAll);
    DOM.btnDownloadAll.addEventListener('click', downloadAll);
    DOM.btnClear.addEventListener('click', clearAll);
    
    [DOM.bgColor, DOM.padding, DOM.format, DOM.quality].forEach(el => {
        el.addEventListener('input', () => { if (filesData.length > 0) processAll(); });
    });
    DOM.autoRemove.addEventListener('change', () => { if (filesData.length > 0) processAll(); });
}

function init() {
    setupEventListeners();
    updateGlobalActions();
}

init();