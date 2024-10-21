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

/*

// ROUTE 1 - Fetch contacts and render them using the 'contacts' template
app.get('/contacts', async (req, res) => {
  const contactsURL = 'https://api.hubapi.com/crm/v3/objects/contacts?limit=10&archived=false';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  // https://app.hubspot.com/contacts/145537472/objects/2-134696617/views/all/list
  try {
    const response = await axios.get(contactsURL, { headers });
    const contacts = response.data.results;
    //res.json(response.data.results)
    res.render('contacts', { title: 'contacts | HubSpot APIs', contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error.response?.data || error.message);
    res.status(500).send('An error occurred while fetching contacts.');
  }
});


app.get('/', async (req, res) => {
  const contactsURL = 'https://api.hubapi.com/crm/v3/objects/contacts?limit=10&archived=false';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  // https://app.hubspot.com/contacts/145537472/objects/2-134696617/views/all/list
  try {
    const response = await axios.get(contactsURL, { headers });
    const contacts = response.data.results;
    //res.json(response.data.results)
    res.render('contacts', { title: 'contacts | HubSpot APIs', contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error.response?.data || error.message);
    res.status(500).send('An error occurred while fetching contacts.');
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});

*/
// * Localhost


// Define a route handler for the default home page
/*
app.get('/', (req, res) => {
    res.send('Hello Bachot Cholina');
  });
  */
app.listen(3000, () => console.log('Listening on http://localhost:3000'));