
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const fileupload = require('express-fileupload');
const multer = require('multer');

var app = express();
app.set('port', 3000);

const upload = multer({dest:"uploads"});
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
      cb(null, "uploads");
  },
  filename: (req, file, cb) =>{
      cb(null, file.originalname);
  }
});
app.use(multer({storage:storageConfig}).single("filedata"));


http.createServer(app).listen(app.get('port'), () =>{})


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

global.fileName;

app.get('/delete', (req, res, next) =>{
  req.url = 'index.html';
  if(fileName){
    fs.unlinkSync(`./uploads/${fileName}`);
    fileName = null;
  }
  next();
});

app.get('/', (req, res) =>{
  fileName = null;
  sendFile('index.html', 'text/html', res);
});



app.post('/upload', (req, res) =>{

  if(req.file){
    fileName = req.file.originalname;
    res.send('file upload');
  }
});

app.get('/viewing', (req, res) =>{

  sendFile('result.html', 'text/html', res);
});

app.get('/parse', (req, res) =>{
  let disciplines = sorting();
  res.end(JSON.stringify(disciplines));
});

app.use((req, res) =>{
  sendFile(req.url, getContentType(req.url), res);
});

function sendFile(url, contentType, res){
  let file = path.join(__dirname + '/static/', url);
  fs.readFile(file, (err, content) =>{
      if(err){
        res.writeHead(404);
        res.end('file not found');
      }
      else{
        res.writeHead(200, {'Content-Type' : contentType});
        res.write(content);
        res.end();
      }
  });
}

function getContentType(url){
  switch(path.extname(url)){
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
  }
}

let sorting = () =>{
  const sorting = require('./sort');

  let dis = sorting.groups;
  delete require.cache[require.resolve('./sort')];
  return dis;
};
