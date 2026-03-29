const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(srcDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Tool name logic for nav-current-tool
    let toolName = file.replace('.html', '').replace(/-/g, ' ');
    if (file === 'index.html') toolName = 'Home';
    else if (file === 'bio-data-maker.html') toolName = 'Bio Data Maker';

    // 1. Tool Nav (global-nav)
    const toolNav = `        <nav class="global-nav">
            <div class="nav-dropdown">
                <button class="nav-brand" id="nav-dropdown-btn">
                    <i class="fa-solid fa-layer-group"></i> Multi-Tool Suite <i class="fa-solid fa-chevron-down" style="font-size: 0.8em; margin-left: 5px;"></i>
                </button>
                <div class="nav-dropdown-content" id="nav-dropdown-content">
                </div>
            </div>
            <div class="nav-current-tool">
                <span>${toolName}</span>
            </div>
        </nav>`;

    if (file === 'index.html') {
        // Special case for Home: We use <header class="landing-header">
        // Ensure the dropdown content area is clean
        const dropdownStart = '<div class="nav-dropdown-content" id="nav-dropdown-content">';
        const dropdownEnd = '</div>';
        if (html.includes(dropdownStart)) {
            const parts = html.split(dropdownStart);
            const rest = parts[1].split(dropdownEnd);
            rest.shift();
            html = parts[0] + dropdownStart + '\n                ' + dropdownEnd + rest.join(dropdownEnd);
        }
    } else {
        // Standard Tool Nav
        const navRegex = /<nav class="global-nav">[\s\S]*?<\/nav>/;
        if (navRegex.test(html)) {
            html = html.replace(navRegex, toolNav);
        } else {
            // Try to find the wrapper and inject
            html = html.replace('<div class="app-wrapper">', '<div class="app-wrapper">\n' + toolNav);
        }
    }

    // 2. Ensure Sidebar is clean
    if (file !== 'index.html' && html.includes('<aside class="left-panel">')) {
        const sidebarLinksRegex = /<div class="sidebar-links">[\s\S]*?<\/div>/;
        if (sidebarLinksRegex.test(html)) {
            html = html.replace(sidebarLinksRegex, '<div class="sidebar-links"></div>');
        } else {
            html = html.replace('</aside>', '            <div class="sidebar-links"></div>\n        </aside>');
        }
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Master repaired ${file}`);
});
