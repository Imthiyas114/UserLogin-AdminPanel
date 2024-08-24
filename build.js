const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Directory paths
const viewsDir = path.join(__dirname, 'views');
const outputDir = path.join(__dirname, 'dist');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Compile each .hbs file
fs.readdirSync(viewsDir).forEach(file => {
  if (path.extname(file) === '.hbs') {
    const template = fs.readFileSync(path.join(viewsDir, file), 'utf-8');
    const compileTemplate = handlebars.compile(template);
    const html = compileTemplate({ /* your data here */ });

    // Write the HTML to the output directory
    const outputFileName = path.basename(file, '.hbs') + '.html';
    fs.writeFileSync(path.join(outputDir, outputFileName), html);
  }
});
