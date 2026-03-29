const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

const coreLinks = [
    { file: 'index.html', icon: 'fa-house', text: 'Home' },
    { file: 'bio-data-maker.html', icon: 'fa-file-signature', text: 'Bio Data Maker' },
    { file: 'image-compressor.html', icon: 'fa-compress', text: 'Image Compressor' },
    { file: 'image-resize.html', icon: 'fa-expand', text: 'Image Resize' },
    { file: 'passport-photo-crop.html', icon: 'fa-crop-simple', text: 'Passport Photo Crop' },
    { file: 'passport-size-with-name.html', icon: 'fa-id-badge', text: 'Passport Photo with Name' },
    { file: 'jpg-to-pdf.html', icon: 'fa-file-pdf', text: 'JPG → PDF' },
    { file: 'pdf-to-jpg.html', icon: 'fa-image', text: 'PDF to JPG' },
    { file: 'image-merge.html', icon: 'fa-regular fa-object-group', text: 'Image Merge' },
    { file: 'pdf-merge.html', icon: 'fa-solid fa-object-group', text: 'PDF Merge' },
    { file: 'ocr-tool.html', icon: 'fa-solid fa-file-lines', text: 'OCR Tool' },
    { file: 'pdf-compressor.html', icon: 'fa-solid fa-file-zipper', text: 'PDF Compressor' },
    { file: 'copy-pdf-text.html', icon: 'fa-solid fa-copy', text: 'Copy PDF Text' },
    { file: 'add-white-bg.html', icon: 'fa-solid fa-square', text: 'Add White BG' },
    { file: 'background-remover.html', icon: 'fa-solid fa-eraser', text: 'Background Remover' }
];

const infoLinks = [
    { file: 'about.html', icon: 'fa-circle-info', text: 'About Us' },
    { file: 'privacy.html', icon: 'fa-user-shield', text: 'Privacy Policy' },
    { file: 'terms.html', icon: 'fa-file-contract', text: 'Terms of Service' },
    { file: 'disclaimer.html', icon: 'fa-triangle-exclamation', text: 'Disclaimer' },
    { file: 'contact.html', icon: 'fa-envelope', text: 'Contact Us' }
];

files.forEach(file => {
    const filePath = path.join(srcDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // 1. Determine Tool Name for display
    let toolName = coreLinks.find(l => l.file === file)?.text || infoLinks.find(l => l.file === file)?.text || "Tool";

    // 2. Build the exact Nav HTML
    let dropdownHtml = '';
    coreLinks.forEach(link => {
        const activeClass = (file === link.file) ? ' class="active"' : '';
        dropdownHtml += `                    <a href="${link.file}"${activeClass}><i class="fa-solid ${link.icon}"></i> ${link.text}</a>\n`;
    });
    // We only add core tools to dropdown to keep it clean, or we can add separator
    dropdownHtml += '                    <span class="nav-separator"></span>\n';
    infoLinks.forEach(link => {
        const activeClass = (file === link.file) ? ' class="active"' : '';
        dropdownHtml += `                    <a href="${link.file}"${activeClass}><i class="fa-solid ${link.icon}"></i> ${link.text}</a>\n`;
    });

    const cleanNavBlock = `
        <!-- Global Navigation -->
        <nav class="global-nav">
            <div class="nav-dropdown">
                <button class="nav-brand" id="nav-dropdown-btn">
                    <i class="fa-solid fa-layer-group"></i> Multi-Tool Suite <i class="fa-solid fa-chevron-down" style="font-size: 0.8em; margin-left: 5px;"></i>
                </button>
                <div class="nav-dropdown-content" id="nav-dropdown-content">
${dropdownHtml}                </div>
            </div>
            <div class="nav-current-tool">
                <span>${toolName}</span>
            </div>
        </nav>`;

    // 3. WIPE everything between <div class="app-wrapper"> and <div class="app-container"> (or </nav> and container)
    // First, let's normalize the wrapper
    if (html.includes('<div class="app-wrapper">')) {
        const parts = html.split('<div class="app-wrapper">');
        const preWrapper = parts[0];
        const rest = parts.slice(1).join('<div class="app-wrapper">');
        
        let contentStart = rest.indexOf('<div class="app-container">');
        if (contentStart === -1) contentStart = rest.indexOf('<main'); // For index.html
        
        const postNavContent = rest.substring(contentStart);
        
        html = preWrapper + '<div class="app-wrapper">' + cleanNavBlock + '\n        ' + postNavContent;
    }

    // 4. Update Sidebar inside the content
    if (file !== 'index.html' && html.includes('<aside class="left-panel">')) {
        const sidebarHtml = `            <div class="sidebar-links">\n${dropdownHtml}            </div>\n`;
        
        // Remove any existing sidebar-links div
        html = html.replace(/<div class="sidebar-links">[\s\S]*?<\/div>/, '');
        
        // Inject at the end of left-panel (just before </aside>)
        html = html.replace('</aside>', sidebarHtml + '        </aside>');
    }

    // 5. Final ID check: If somehow there are still duplicates, we'll log it.
    // (The above logic should replace the whole blocks, effectively removing duplicates)

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Finalized ${file}`);
});
