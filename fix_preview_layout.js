const fs = require('fs');

let html = fs.readFileSync('/storage/emulated/0/bio/src/image-compressor.html', 'utf8');

// I am modifying the `.right-panel-content` block so the dropzone and list display in a single clean column, allowing the lists to grow below it.
const newStyle = `
        .right-panel {
            background-color: var(--bg-color) !important;
            background-image: none !important;
            display: block !important;
            flex: 1;
            padding: var(--spacing-xl);
            overflow-y: auto;
        }
        .right-panel-content {
            padding: var(--spacing-xl);
            max-width: 1000px;
            margin: 0 auto;
            width: 100%;
        }`;

html = html.replace(/        \.right-panel-content \{[\s\S]*?width: 100%;\s*\}/, newStyle);

fs.writeFileSync('/storage/emulated/0/bio/src/image-compressor.html', html, 'utf8');
