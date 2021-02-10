const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(req.url.toString());

    res.setHeader('Content-Type', 'text/html');
    let url = '../views/';

    if (req.url == '/'){
        url += 'index.html';
        res.statusCode == 200;
    }else if(req.url == '/about'){
        url += 'about.html';
        res.statusCode == 200;
    }
    else if(req.url == '/contact'){
        url += 'contactUs.html';
        res.statusCode == 200;
    }else{
        url += '404.html';
        res.statusCode == 404;
    }
    fs.readFile(url, (err, data) =>{
        if(err) {
            console.log(err);
            res.end();
        }
        else{
            res.write(data);
            res.end();
        }
    });
});

server.listen(3000, 'localhost', () => {
    console.log('listening on port 3000');
});