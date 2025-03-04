const express = require('express');
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const app = express();

const CONTENT_DIR = path.join(__dirname, 'content'); // Your markdown folder

// Middleware to serve static files
app.use(express.static('public'));

// Function to get all markdown files recursively
function getFiles(dir, fileList = []) {
    fs.readdirSync(dir).forEach(file => {
        let filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else if (file.endsWith('.md')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// Route to list available markdown files
app.get('/', (req, res) => {
    const files = getFiles(CONTENT_DIR).map(f => f.replace(CONTENT_DIR, '').replace(/\\/g, '/'));
    res.send(`<h1>Markdown Files</h1><ul>${files.map(f => `<li><a href="/view${f}">${f}</a></li>`).join('')}</ul>`);
});

// Route to render markdown files as HTML
app.get('/view/*', (req, res) => {
    const filePath = path.join(CONTENT_DIR, req.params[0]);
    if (fs.existsSync(filePath) && filePath.endsWith('.md')) {
        const content = fs.readFileSync(filePath, 'utf8');
        res.send(`<html><head><title>${req.params[0]}</title></head><body>${marked.parse(content)}</body></html>`);
    } else if(!filePath.endsWith('.md') && fs.existsSync(filePath+".md"))  {
        const content = fs.readFileSync(filePath+".md", 'utf8');
        res.send(`<html><head><title>${req.params[0]}</title></head><body>${marked.parse(content)}</body></html>`);
    } else if(!filePath.endsWith('.md') && fs.existsSync(filePath+"/root.md"))  {
        const content = fs.readFileSync(filePath+"/root.md", 'utf8');
        res.send(`<html><head><title>${req.params[0]}</title></head><body>${marked.parse(content)}</body></html>`);
    } else {
        res.status(404).send('File not found');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
