require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

// Express.js Middleware
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the HubSpot Private App Access Token from environment variables
const PRIVATE_APP_ACCESS = process.env.hubspot;

// ROUTE 1 - Fetch books and render them using the 'homepage' template
app.get('/', async (req, res) => { 
    const booksURL = 'https://api.hubapi.com/crm/v3/objects/2-134696617?limit=10&archived=false&properties=book_name,book_type,author,price';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };
    try {
        const response = await axios.get(booksURL, { headers });
        const books = response.data.results;
        res.render('homepage', { title: 'Books | HubSpot APIs', books });
    } catch (error) {
        console.error('Error fetching books:', error.response?.data || error.message);
        res.status(500).send('An error occurred while fetching books.');
    }
});

// Route to render the create book form
app.get('/create', (req, res) => {
    res.render('create', { title: 'Add New Book' });
});

// POST route to handle new book creation
app.post('/create', async (req, res) => {
    const newBook = {
        properties: {
            "book_name": req.body.book_name,
            "book_type": req.body.book_type,
            "author": req.body.author,
            "price": req.body.price,
        },
    };

    const createBookURL = 'https://api.hubapi.com/crm/v3/objects/2-134696617';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    try {
        await axios.post(createBookURL, newBook, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while creating the book.');
    }
});

// GET route to render the update book form
app.get('/update', async (req, res) => {
    const id = req.query.id;
    const getBookURL = `https://api.hubapi.com/crm/v3/objects/2-134696617/${id}?properties=book_name,book_type,author,price`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await axios.get(getBookURL, { headers });
      const book = response.data;
      res.render('update', { title: 'Update Book', book });
    } catch (error) {
      console.error('Error fetching book:', error.response?.data || error.message);
      res.status(500).send('An error occurred while fetching the book.');
    }
});

// POST route to handle book updates
app.post('/update', async (req, res) => {
    const update = {
      properties: {
        "book_name": req.body.book_name,
        "book_type": req.body.book_type,
        "author": req.body.author,
        "price": req.body.price,
      },
    };
  
    const id = req.body.hs_object_id;
    const updateBookURL = `https://api.hubapi.com/crm/v3/objects/2-134696617/${id}`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json',
    };
  
    try {
      await axios.patch(updateBookURL, update, { headers });
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while updating the book.');
    }
});
app.listen(3000, () => console.log('Listening on http://localhost:3000'));