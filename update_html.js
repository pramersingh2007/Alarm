const fs = require('fs');

let heightOptions = '<option value="">Select</option>';
for (let f = 4; f <= 7; f++) {
    for (let i = 0; i < 12; i++) {
        if (f === 7 && i > 0) break;
        heightOptions += `<option value="${f}'${i}&quot;">${f}'${i}"</option>`;
    }
}

let weightOptions = '<option value="">Select</option>';
for (let w = 40; w <= 120; w++) {
    weightOptions += `<option value="${w}">${w} kg</option>`;
}

const newStr = `                            <div class="form-group"><label for="nationality">Nationality</label>
                                <select id="nationality"><option value="">Select</option><option value="Indian">Indian</option><option value="NRI">NRI</option><option value="Other">Other</option></select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label for="height">Height</label>
                                <select id="height">${heightOptions}</select>
                            </div>
                            <div class="form-group"><label for="weight">Weight (kg)</label>
                                <select id="weight">${weightOptions}</select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label for="religion">Religion</label>
                                <select id="religion"><option value="">Select</option><option value="Hindu">Hindu</option><option value="Muslim">Muslim</option><option value="Christian">Christian</option><option value="Sikh">Sikh</option><option value="Buddhist">Buddhist</option><option value="Jain">Jain</option><option value="Other">Other</option></select>
                            </div>
                            <div class="form-group"><label for="caste">Caste</label>
                                <input type="text" id="caste" placeholder="e.g. Brahmin, Rajput, etc.">
                            </div>
                        </div>`;

const files = ['/storage/emulated/0/bio/index.html', '/storage/emulated/0/bio/src/index.html'];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Using regex to match the exact block to replace
    const regex = /                            <div class="form-group"><label for="nationality">Nationality<\/label><input type="text" id="nationality" placeholder="e\.g\. Indian"><\/div>\s*<\/div>\s*<div class="form-row">\s*<div class="form-group"><label for="height">Height<\/label><input type="text" id="height" placeholder="e\.g\. 5'10&quot; or 178 cm"><\/div>\s*<div class="form-group"><label for="weight">Weight \(kg\)<\/label><input type="number" id="weight" placeholder="e\.g\. 70"><\/div>\s*<\/div>\s*<div class="form-row">\s*<div class="form-group"><label for="religion">Religion<\/label>\s*<select id="religion"><option value="">Select<\/option><option value="Hindu">Hindu<\/option><option value="Muslim">Muslim<\/option><option value="Christian">Christian<\/option><option value="Sikh">Sikh<\/option><option value="Buddhist">Buddhist<\/option><option value="Jain">Jain<\/option><option value="Other">Other<\/option><\/select>\s*<\/div>\s*<div class="form-group"><label for="caste">Caste<\/label>\s*<select id="caste"><option value="">Select<\/option><option value="General">General<\/option><option value="OBC">OBC<\/option><option value="SC">SC<\/option><option value="ST">ST<\/option><option value="Other">Other<\/option><\/select>\s*<\/div>\s*<\/div>/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, newStr);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find match in ${file}`);
    }
}
