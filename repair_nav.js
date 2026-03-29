const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(srcDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // 1. Repair Nav Dropdown
    // Match from the start of the dropdown content to the end of the nav tag, then we will re-insert correctly.
    // Actually, let's just find the start of the dropdown and remove everything until the nav-current-tool or </nav>
    
    const navStart = '<div class="nav-dropdown-content" id="nav-dropdown-content">';
    const navEnd = '</nav>';
    
    if (html.includes(navStart) && html.includes(navEnd)) {
        const parts = html.split(navStart);
        const preNav = parts[0];
        const rest = parts.slice(1).join(navStart); // Handle multiple navStart just in case
        
        const restParts = rest.split(navEnd);
        const postNav = restParts.slice(1).join(navEnd);
        
        // Construct a clean placeholder
        html = preNav + navStart + '\n                </div>\n            </nav>' + postNav;
    }

    // 2. Repair Sidebar Links
    const sidebarStart = '<div class="sidebar-links">';
    const sidebarEnd = '</div>'; // This is tricky if there are nested divs
    
    // If the sidebar is corrupted, it's usually between <div class="sidebar-links"> and the next </aside>
    if (html.includes(sidebarStart) && html.includes('</aside>')) {
        const sParts = html.split(sidebarStart);
        const preSidebar = sParts[0];
        const sRest = sParts.slice(1).join(sidebarStart);
        
        const sRestParts = sRest.split('</aside>');
        const postSidebar = sRestParts.slice(1).join('</aside>');
        
        html = preSidebar + sidebarStart + '\n                </div>\n            </aside>' + postSidebar;
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Repaired ${file}`);
});
