const fs = require('fs');
let html = fs.readFileSync('/storage/emulated/0/bio/index.html', 'utf8');

// Update JavaScript block inside root index.html
html = html.replace(/,\s*previewFatherSection: document\.getElementById\('preview-father-section'\),\s*previewFatherTableBody: document\.querySelector\('#preview-father-table tbody'\),\s*previewMotherSection: document\.getElementById\('preview-mother-section'\),\s*previewMotherTableBody: document\.querySelector\('#preview-mother-table tbody'\)/, '');

html = html.replace(/\{ label: 'Siblings', val: DOM\.siblings\.value \}\s*\]\.filter\(f => f\.val\);\s*DOM\.previewPersonalTableBody\.innerHTML = pFields\.map\(f => `\s*<tr><td>\$\{escapeHTML\(f\.label\)\}<\/td><td>\$\{escapeHTML\(f\.val\)\}<\/td><\/tr>\s*`\)\.join\(''\);\s*DOM\.previewPersonalSection\.style\.display = pFields\.length \? 'block' : 'none';\s*const fFields = \[\s*\{ label: "Father's Name", val: DOM\.fatherName\.value \},\s*\{ label: "Father's Occupation", val: DOM\.fatherOcc\.value \}\s*\]\.filter\(f => f\.val\);\s*DOM\.previewFatherTableBody\.innerHTML = fFields\.map\(f => `\s*<tr><td>\$\{escapeHTML\(f\.label\)\}<\/td><td>\$\{escapeHTML\(f\.val\)\}<\/td><\/tr>\s*`\)\.join\(''\);\s*DOM\.previewFatherSection\.style\.display = fFields\.length \? 'block' : 'none';\s*const mFields = \[\s*\{ label: "Mother's Name", val: DOM\.motherName\.value \},\s*\{ label: "Mother's Occupation", val: DOM\.motherOcc\.value \}\s*\]\.filter\(f => f\.val\);\s*DOM\.previewMotherTableBody\.innerHTML = mFields\.map\(f => `\s*<tr><td>\$\{escapeHTML\(f\.label\)\}<\/td><td>\$\{escapeHTML\(f\.val\)\}<\/td><\/tr>\s*`\)\.join\(''\);\s*DOM\.previewMotherSection\.style\.display = mFields\.length \? 'block' : 'none';\s*\} else \{\s*DOM\.previewPersonalSection\.style\.display = 'none';\s*DOM\.previewFatherSection\.style\.display = 'none';\s*DOM\.previewMotherSection\.style\.display = 'none';\s*\}/g, `{ label: "Father's Name", val: DOM.fatherName.value },
                { label: "Father's Occupation", val: DOM.fatherOcc.value },
                { label: "Mother's Name", val: DOM.motherName.value },
                { label: "Mother's Occupation", val: DOM.motherOcc.value },
                { label: 'Siblings', val: DOM.siblings.value }
            ].filter(f => f.val);

            DOM.previewPersonalTableBody.innerHTML = pFields.map(f => \`
                <tr><td>\${escapeHTML(f.label)}</td><td>\${escapeHTML(f.val)}</td></tr>
            \`).join('');
            DOM.previewPersonalSection.style.display = pFields.length ? 'block' : 'none';
        } else {
            DOM.previewPersonalSection.style.display = 'none';
        }`);

fs.writeFileSync('/storage/emulated/0/bio/index.html', html, 'utf8');
console.log('Root JS synced.');
