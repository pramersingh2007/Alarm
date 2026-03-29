const fs = require('fs');
const path = require('path');

// Configuration
const srcDir = path.join(__dirname, 'src');
const destDir = __dirname;
const baseUrl = 'https://parmartools.netlify.app';

// Load SEO Config
const seoConfigPath = path.join(__dirname, 'seo-config.json');
let seoConfig = {};
if (fs.existsSync(seoConfigPath)) {
    seoConfig = JSON.parse(fs.readFileSync(seoConfigPath, 'utf8'));
}

// Read global CSS
const stylesPath = path.join(srcDir, 'styles.css');
const styles = fs.readFileSync(stylesPath, 'utf8');

// Get all HTML files from src/
const htmlFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

const footerHtml = `
        <!-- Global Professional Footer -->
        <footer class="professional-footer">
            <div class="footer-container">
                <div class="footer-grid">
                    <!-- Brand Section -->
                    <div class="footer-brand-section">
                        <div class="footer-logo">
                            <i class="fa-solid fa-layer-group"></i>
                            <span>Multi-Tool Suite</span>
                        </div>
                        <p class="footer-tagline">Empowering your digital workflow with fast, private, and professional browser-based utilities.</p>
                        <div class="footer-social-links">
                            <a href="#" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                            <a href="#" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
                            <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                        </div>
                    </div>

                    <!-- Products: PDF -->
                    <div class="footer-links-column">
                        <h3 class="footer-heading">PDF Solutions</h3>
                        <ul class="footer-links-list">
                            <li><a href="pdf-merge.html">PDF Merger</a></li>
                            <li><a href="pdf-compressor.html">PDF Compressor</a></li>
                            <li><a href="pdf-to-jpg.html">PDF to JPG</a></li>
                            <li><a href="jpg-to-pdf.html">JPG to PDF</a></li>
                            <li><a href="copy-pdf-text.html">Extract PDF Text</a></li>
                        </ul>
                    </div>

                    <!-- Products: Images -->
                    <div class="footer-links-column">
                        <h3 class="footer-heading">Image Tools</h3>
                        <ul class="footer-links-list">
                            <li><a href="image-compressor.html">Compress Images</a></li>
                            <li><a href="background-remover.html">BG Remover</a></li>
                            <li><a href="passport-size-with-name.html">Passport Photo</a></li>
                            <li><a href="image-resize.html">Resize Images</a></li>
                            <li><a href="ocr-tool.html">OCR (Image to Text)</a></li>
                        </ul>
                    </div>

                    <!-- Company & Legal -->
                    <div class="footer-links-column">
                        <h3 class="footer-heading">Company</h3>
                        <ul class="footer-links-list">
                            <li><a href="about.html">About Us</a></li>
                            <li><a href="contact.html">Contact Support</a></li>
                            <li><a href="privacy.html">Privacy Policy</a></li>
                            <li><a href="terms.html">Terms of Service</a></li>
                            <li><a href="disclaimer.html">Usage Disclaimer</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-divider"></div>

                <div class="footer-bottom-row">
                    <div class="footer-copyright">
                        &copy; 2026 Multi-Tool Suite. Built for privacy.
                    </div>
                    <div class="footer-status">
                        <span class="status-indicator"></span>
                        All Systems Operational
                    </div>
                </div>
            </div>
        </footer>
`;

console.log(`Starting Final Build: Synchronizing Header/Footer across ${htmlFiles.length} files...`);

htmlFiles.forEach(file => {
    console.log(`Processing: ${file}`);
    let html = fs.readFileSync(path.join(srcDir, file), 'utf8');
    
    // 1. Swap Header Focus (On index.html)
    if (file === 'index.html') {
        // Change "About/Contact" in landing header to "Tools" shortcuts
        const landingHeaderNavRegex = /<nav style="display: flex; gap: 20px;" class="desktop-only">[\s\S]*?<\/nav>/;
        const newLandingNav = `
                <nav style="display: flex; gap: 20px;" class="desktop-only">
                    <a href="bio-data-maker.html" style="text-decoration: none; color: var(--text-color); font-weight: 500;">Bio Data</a>
                    <a href="image-compressor.html" style="text-decoration: none; color: var(--text-color); font-weight: 500;">Images</a>
                    <a href="pdf-merge.html" style="text-decoration: none; color: var(--text-color); font-weight: 500;">PDF</a>
                </nav>`;
        html = html.replace(landingHeaderNavRegex, newLandingNav);
    }

    // 2. Performance & SEO
    if (seoConfig[file]) {
        const seo = seoConfig[file];
        const pageUrl = `${baseUrl}/${file === 'index.html' ? '' : file}`;
        
        let faqSchema = '';
        if (seo.faqs) {
            const mainEntity = seo.faqs.map(f => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }));
            faqSchema = `<script type="application/ld+json">{"@context": "https://schema.org","@type": "FAQPage","mainEntity": ${JSON.stringify(mainEntity)}}</script>`;
        }

        const seoBlock = `
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <meta name="keywords" content="${seo.keywords}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${pageUrl}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    <script type="application/ld+json">{"@context": "https://schema.org","@type": "${seo.toolType || 'SoftwareApplication'}","name": "${seo.title.split(' - ')[0]}","description": "${seo.description}","url": "${pageUrl}","offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }}</script>${faqSchema}`;

        html = html.replace(/<title>.*?<\/title>/i, seoBlock.trim());
    }

    // 3. Inject/Update SEO Content
    if (seoConfig[file] && seoConfig[file].faqs) {
        const seo = seoConfig[file];
        let contentHtml = `
                <section class="seo-rich-content card">
                    <div class="seo-grid">
                        <div>
                            <h2 style="color: var(--accent-color); margin-bottom: 15px;"><i class="fa-solid fa-star"></i> Key Features</h2>
                            <ul class="seo-feature-list">
                                ${seo.features ? seo.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('') : '<li>Free and Fast</li>'}
                            </ul>
                        </div>
                        <div>
                            <h2 style="color: var(--accent-color); margin-bottom: 15px;"><i class="fa-solid fa-shield-halved"></i> 100% Private & Secure</h2>
                            <p style="color: var(--text-muted); font-size: 0.95rem;">All processing happens locally in your browser. Your files are <strong>never uploaded</strong> to any server.</p>
                        </div>
                    </div>
                    <div class="faq-section">
                        <h2 style="color: var(--accent-color); margin-bottom: 20px;"><i class="fa-solid fa-circle-question"></i> Frequently Asked Questions</h2>
                        <div class="faq-grid">
                            ${seo.faqs.map(f => `<div class="faq-card"><h3>${f.q}</h3><p>${f.a}</p></div>`).join('')}
                        </div>
                    </div>
                </section>`;

        // Cleanup old SEO section first to avoid duplicates
        html = html.replace(/<section class="seo-rich-content[\s\S]*?<\/section>/, '');
        
        if (html.includes('</main>')) {
            html = html.replace('</main>', `${contentHtml}\n</main>`);
        }
    }

    // 4. Inject Global Footer (Remove existing one if it exists)
    html = html.replace(/<footer class="professional-footer">[\s\S]*?<\/footer>/, '');
    if (html.includes('</div>\n    </div>\n\n    <script>')) {
        html = html.replace('</div>\n    </div>\n\n    <script>', `</div>\n${footerHtml}\n    </div>\n\n    <script>`);
    } else if (html.includes('</body>')) {
        html = html.replace('</body>', `${footerHtml}\n</body>`);
    }

    // 5. Final Inlining
    html = html.replace(/<link\s+rel="stylesheet"\s+href="styles\.css">/i, `<style>\n${styles}\n</style>`);
    
    const jsFile = (file === 'index.html') ? 'index.js' : file.replace('.html', '.js');
    const jsPath = path.join(srcDir, jsFile);
    if (fs.existsSync(jsPath)) {
        const js = fs.readFileSync(jsPath, 'utf8');
        html = html.replace(new RegExp(`<script\\s+src="${jsFile}"></script>`, 'i'), `<script>\n${js}\n</script>`);
    } else if (file === 'bio-data-maker.html') {
        const js = fs.readFileSync(path.join(srcDir, 'bio-data-maker.js'), 'utf8');
        html = html.replace('<script src="bio-data-maker.js"></script>', `<script>\n${js}\n</script>`);
    }

    fs.writeFileSync(path.join(destDir, file), html, 'utf8');
});

console.log('Build complete! Header and Footer logic swapped and synchronized.');
