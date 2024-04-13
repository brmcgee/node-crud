const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));


const path = require('path');

const port = 3000;

// var mysql = require('mysql');
// global.myConnect = {
//   host: "127.0.0.1",
//   user: "root",
//   password: "",
//   database: "boxcar"
// };

// get data from myModule at bData.js 
const myModule = require('./bData');
const books = myModule.data;

app.get('/', (req, res) => {
  let html_segment = '';

  html_segment += myModule.head_section();
  html_segment += myModule.navBar();
  html_segment += myModule.close_section();

  res.send(html_segment);
});


app.get('/new', function (req, res) {
    res.sendFile(path.join(__dirname,"create.html"));
  });

  
// Create a Book
app.post('/blogs', (req, res) => {
  
    // const id = req.body.id;
    // const purpose = req.body.purpose;
    // const category = req.body.category;
    // const title = req.body.title;
    // const date = req.body.date;
    // const author = req.body.author;
    // const avatar = req.body.avatar;
    // const content = req.body.content;
    // const img1 = req.body.img1;
    // const img2 = req.body.img2;
    // const project = req.body.project;
    // const isHero = req.body.isHero;

    const { id, purpose, category, title, date, author, avatar, content, img1, img2, project, isHero } = req.body;
 
    if (!title || !author) {
      return res.status(400).send('Missing fields...');
    }
  
    const newBook = { id: books.length + 1, purpose, category, title, date, author, avatar, content, img1, img2, project, isHero};
    books.push(newBook);
    res.status(201).send(newBook);
});


// Get All Books
app.get('/blogs', (req, res) => {
  res.json(books);
});

// Get a Single Book
app.get('/blogs/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).send(myModule.head_section() + `<div class="p-2 bg-light rounded">Blog <strong>${req.params.id}</strong> not found!` + '<br><a href="/">Home</a></div>');
  }
  res.json(book);
});



// Get a Single Book to Post
app.get('/posts/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).send(myModule.head_section() + `<div class="p-2 bg-light rounded">Blog <strong>${req.params.id}</strong> not found!` + '<br><a href="/">Home</a></div>');
  }
  const { id, isHero, purpose, category, date, author, avatar, title, body, img1, img2, project } = book;
  

  res.send(myModule.head_section() + myModule.makePost(title, body, img1, avatar, author, category, id) + myModule.close_section());
});

app.get('/posts', (req, res) => {

  let html = myModule.head_section();

  books.forEach(b => {
    const { id, isHero, purpose, category, date, author, avatar, title, body, img1, img2, project } = b;
    html += myModule.makePost(title, body, img1, avatar, author, category, id) + '<br>';
  })
  html += myModule.close_section();
  res.send(html);
});


// errors 
app.get('*', function (req, res) {

  response = myModule.head_section();
  response += `
  
  <div class="page-wrap d-flex flex-row align-items-center mt-5">
   <div class="container">
     <div class="row justify-content-center">
       <div class="col-md-12 text-center">
         <span class="display-1 d-block">404</span>
         <div class="mb-4 lead">The page you are looking for was not found.</div>
           <a href="https://brm.boxcar.site" class="btn btn-link">Back to Home</a>
         </div>
       </div>
     </div>
   </div>
  `;
  response += myModule.close_section();

  res.end((response));
});









// Update a Book
app.put('/blogs/:id', (req, res) => {

    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
      return res.status(404).send('Book not found');
    }
  
    const { id, purpose, category, title, date, author, avatar, content, img1, img2, project, isHero } = req.body;
    book.title = title || book.title;
    book.author = author || book.author;
  
    res.send(book);
  });




// Delete a Book
app.delete('/blogs/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) {
      return res.status(404).send('Book not found');
    }
  
    books.splice(bookIndex, 1);
    res.status(204).send();
  });












app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});