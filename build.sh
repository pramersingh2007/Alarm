#!/bin/bash
cd /storage/emulated/0/bio

# Array of all tool HTML files
FILES=("index.html" "image-compressor.html" "image-resize.html" "passport-photo-crop.html" "jpg-to-pdf.html" "pdf-to-jpg.html" "image-merge.html" "pdf-merge.html" "ocr-tool.html" "pdf-compressor.html" "copy-pdf-text.html" "add-white-bg.html" "background-remover.html")

for FILE in "${FILES[@]}"; do
    echo "Building $FILE..."
    # Create HTML header and inject CSS
    sed -n '1,/<link rel="stylesheet" href="styles.css">/p' "src/$FILE" | grep -v '<link rel="stylesheet" href="styles.css">' > "$FILE"
    echo "    <style>" >> "$FILE"
    cat src/styles.css >> "$FILE"
    echo "    </style>" >> "$FILE"
    echo "</head>" >> "$FILE"
    
    # Get body and JS
    JS_FILE="${FILE%.html}.js"
    if [ "$FILE" == "index.html" ]; then
        JS_FILE="app.js"
    fi
    
    sed -n '/<body/,/</body>/p' "src/$FILE" | sed "/<script src="$JS_FILE"></script>/d" >> "$FILE"
    sed -i 's/</body>/<script>
</script>
</body>/' "$FILE"
    sed -e "/<script>/r src/$JS_FILE" -i "$FILE"
done

echo "Build complete. All tools built in /storage/emulated/0/bio/"
