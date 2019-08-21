const http = require('http');
const path = require('path');
const fs = require('fs');

const makeHeader = (extname) => {
    switch(extname){
        case '.js':
            return 'text/javascript';
        case '.css':
            return 'text/css';
        case '.json':
            return 'application/json';
        case '.png':
            return 'image/png';
        case '.jpg':
            return 'image/jpg';
        case '.html':
            return 'text/html';
    }
};

const server = http.createServer((req, res) => {
    // Build file path
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    // Extension of file
    let extname = path.extname(filePath);

    // Initila content type
    let contentType =  makeHeader(extname);

    // Read File
    fs.readFile(filePath, (err, content) => {
        console.log(filePath);
        if(err){
            if(err.code == 'ENOENT'){
                // Page not found
                fs.readFile(path.join(__dirname, 'public', 'notfound.html'),
                (err, content) => {
                    if(err) throw err;
                    res.writeHead(200, { 'Content-Type': 'text/html'});
                    res.end(content, 'utf8')
                });
            }else{
                // Some server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`)
            }
        }else{
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));