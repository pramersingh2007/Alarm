const fs = require('fs');

let html = fs.readFileSync('/storage/emulated/0/bio/index.html', 'utf8');

// Remove extra empty preview sections if they exist in the root index.html
html = html.replace(/<!-- Father's Details -->\s*<div class="preview-section" id="preview-father-section" style="display:none;">\s*<h3 class="section-title">Father's Details<\/h3>\s*<table class="personal-details-table" id="preview-father-table">\s*<tbody><\/tbody>\s*<\/table>\s*<\/div>\s*<!-- Mother's Details -->\s*<div class="preview-section" id="preview-mother-section" style="display:none;">\s*<h3 class="section-title">Mother's Details<\/h3>\s*<table class="personal-details-table" id="preview-mother-table">\s*<tbody><\/tbody>\s*<\/table>\s*<\/div>/, '');

// Clean up any remaining empty blocks left by the build script
html = html.replace(/<div class="preview-section" id="preview-personal-section" style="display:none;">\s*<h3 class="section-title">Personal Details<\/h3>\s*<table class="personal-details-table" id="preview-personal-table">\s*<tbody><\/tbody>\s*<\/table>\s*<\/div>\s*<!-- Skills -->/g, '<div class="preview-section" id="preview-personal-section" style="display:none;">\n                                <h3 class="section-title">Personal Details</h3>\n                                <table class="personal-details-table" id="preview-personal-table">\n                                    <tbody></tbody>\n                                </table>\n                            </div>\n\n                            <!-- Skills -->');

// Replace any trailing father/mother sections in the left panel
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

html = html.replace(/<div class="form-group"><label for="siblings">Siblings Details<\/label><textarea id="siblings" rows="2" placeholder="e\.g\. 1 elder brother \(Software Engineer\), 1 younger sister"><\/textarea><\/div>\s*<\/div>\s*<\/section>\s*<!-- Father's Details -->\s*<section class="form-section card">\s*<h2><i class="fa-solid fa-user-tie"><\/i> Father's Details<\/h2>\s*<div class="form-group"><label for="father-name">Father's Name<\/label><input type="text" id="father-name" placeholder="Name"><\/div>\s*<div class="form-group"><label for="father-occ">Father's Occupation<\/label><input type="text" id="father-occ" placeholder="Occupation"><\/div>\s*<\/section>\s*<!-- Mother's Details -->\s*<section class="form-section card">\s*<h2><i class="fa-solid fa-user"><\/i> Mother's Details<\/h2>\s*<div class="form-group"><label for="mother-name">Mother's Name<\/label><input type="text" id="mother-name" placeholder="Name"><\/div>\s*<div class="form-group"><label for="mother-occ">Mother's Occupation<\/label><input type="text" id="mother-occ" placeholder="Occupation"><\/div>\s*<\/section>/, newInputs);

fs.writeFileSync('/storage/emulated/0/bio/index.html', html, 'utf8');
console.log('Root HTML synced.');
