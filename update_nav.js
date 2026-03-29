const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(srcDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
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

    let navHtml = '';
    coreLinks.forEach(link => {
        const activeClass = (file === link.file) ? ' class="active"' : '';
        navHtml += `                    <a href="${link.file}"${activeClass}><i class="fa-solid ${link.icon}"></i> ${link.text}</a>\n`;
    });

    // Replace Dropdown: ONLY Core Tools
    const dropdownPattern = /<div class="nav-dropdown-content" id="nav-dropdown-content">[\s\S]*?<\/div>/;
    html = html.replace(dropdownPattern, `<div class="nav-dropdown-content" id="nav-dropdown-content">\n${navHtml}                </div>`);

    // Replace Sidebar: ONLY Core Tools
    const sidebarPattern = /<div class="sidebar-links">[\s\S]*?<\/div>/;
    if (sidebarPattern.test(html)) {
        html = html.replace(sidebarPattern, `<div class="sidebar-links">\n${navHtml}                </div>`);
    }

    fs.writeFileSync(filePath, html, 'utf8');
});
