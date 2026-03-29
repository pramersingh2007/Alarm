const fs = require('fs');

// 1. Fix src/index.html
let html = fs.readFileSync('/storage/emulated/0/bio/src/index.html', 'utf8');

// Remove Father and Mother details preview sections completely
html = html.replace(/<!-- Father's Details -->\s*<div class="preview-section" id="preview-father-section" style="display:none;">\s*<h3 class="section-title">Father's Details<\/h3>\s*<table class="personal-details-table" id="preview-father-table">\s*<tbody><\/tbody>\s*<\/table>\s*<\/div>\s*<!-- Mother's Details -->\s*<div class="preview-section" id="preview-mother-section" style="display:none;">\s*<h3 class="section-title">Mother's Details<\/h3>\s*<table class="personal-details-table" id="preview-mother-table">\s*<tbody><\/tbody>\s*<\/table>\s*<\/div>/, '');

// Change Mother & Father input sections to match the root index.html structure
const newInputs = `                        <div class="form-row">
                            <div class="form-group"><label for="father-name">Father's Name</label><input type="text" id="father-name" placeholder="Name"></div>
                            <div class="form-group"><label for="father-occ">Father's Occupation</label><input type="text" id="father-occ" placeholder="Occupation"></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label for="mother-name">Mother's Name</label><input type="text" id="mother-name" placeholder="Name"></div>
                            <div class="form-group"><label for="mother-occ">Mother's Occupation</label><input type="text" id="mother-occ" placeholder="Occupation"></div>
                        </div>
                        <div class="form-group"><label for="siblings">Siblings Details</label><textarea id="siblings" rows="2" placeholder="e.g. 1 elder brother (Software Engineer), 1 younger sister"></textarea></div>
                    </div>
                </section>`;

// Replace old Father/Mother sections in the aside panel with the combined one
html = html.replace(/<div class="form-group"><label for="siblings">Siblings Details<\/label><textarea id="siblings" rows="2" placeholder="e\.g\. 1 elder brother \(Software Engineer\), 1 younger sister"><\/textarea><\/div>\s*<\/div>\s*<\/section>\s*<!-- Father's Details -->\s*<section class="form-section card">\s*<h2><i class="fa-solid fa-user-tie"><\/i> Father's Details<\/h2>\s*<div class="form-group"><label for="father-name">Father's Name<\/label><input type="text" id="father-name" placeholder="Name"><\/div>\s*<div class="form-group"><label for="father-occ">Father's Occupation<\/label><input type="text" id="father-occ" placeholder="Occupation"><\/div>\s*<\/section>\s*<!-- Mother's Details -->\s*<section class="form-section card">\s*<h2><i class="fa-solid fa-user"><\/i> Mother's Details<\/h2>\s*<div class="form-group"><label for="mother-name">Mother's Name<\/label><input type="text" id="mother-name" placeholder="Name"><\/div>\s*<div class="form-group"><label for="mother-occ">Mother's Occupation<\/label><input type="text" id="mother-occ" placeholder="Occupation"><\/div>\s*<\/section>/, newInputs);

fs.writeFileSync('/storage/emulated/0/bio/src/index.html', html, 'utf8');

// 2. Fix src/app.js
let js = fs.readFileSync('/storage/emulated/0/bio/src/app.js', 'utf8');

// Remove DOM references
js = js.replace(/,\s*previewFatherSection: document\.getElementById\('preview-father-section'\),\s*previewFatherTableBody: document\.querySelector\('#preview-father-table tbody'\),\s*previewMotherSection: document\.getElementById\('preview-mother-section'\),\s*previewMotherTableBody: document\.querySelector\('#preview-mother-table tbody'\)/, '');

// Update the preview rendering logic to merge them back into personal details
js = js.replace(/\{ label: 'Siblings', val: DOM\.siblings\.value \}\s*\]\.filter\(f => f\.val\);\s*DOM\.previewPersonalTableBody\.innerHTML = pFields\.map\(f => `\s*<tr><td>\$\{escapeHTML\(f\.label\)\}<\/td><td>\$\{escapeHTML\(f\.val\)\}<\/td><\/tr>\s*`\)\.join\(''\);\s*DOM\.previewPersonalSection\.style\.display = pFields\.length \? 'block' : 'none';\s*const fFields = \[\s*\{ label: "Father's Name", val: DOM\.fatherName\.value \},\s*\{ label: "Father's Occupation", val: DOM\.fatherOcc\.value \}\s*\]\.filter\(f => f\.val\);\s*DOM\.previewFatherTableBody\.innerHTML = fFields\.map\(f => `\s*<tr><td>\$\{escapeHTML\(f\.label\)\}<\/td><td>\$\{escapeHTML\(f\.val\)\}<\/td><\/tr>\s*`\)\.join\(''\);\s*DOM\.previewFatherSection\.style\.display = fFields\.length \? 'block' : 'none';\s*const mFields = \[\s*\{ label: "Mother's Name", val: DOM\.motherName\.value \},\s*\{ label: "Mother's Occupation", val: DOM\.motherOcc\.value \}\s*\]\.filter\(f => f\.val\);\s*DOM\.previewMotherTableBody\.innerHTML = mFields\.map\(f => `\s*<tr><td>\$\{escapeHTML\(f\.label\)\}<\/td><td>\$\{escapeHTML\(f\.val\)\}<\/td><\/tr>\s*`\)\.join\(''\);\s*DOM\.previewMotherSection\.style\.display = mFields\.length \? 'block' : 'none';\s*\} else \{\s*DOM\.previewPersonalSection\.style\.display = 'none';\s*DOM\.previewFatherSection\.style\.display = 'none';\s*DOM\.previewMotherSection\.style\.display = 'none';\s*\}/g, `{ label: "Father's Name", val: DOM.fatherName.value },
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

fs.writeFileSync('/storage/emulated/0/bio/src/app.js', js, 'utf8');
console.log('src files synced to root state.');
