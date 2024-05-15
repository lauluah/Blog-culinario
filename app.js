const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

require('dotenv').config();

mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.listen({
      host: '0.0.0.0',
      port: process.env.PORT ?? 3333,
    }, () => {
      console.log(`Server is running`);
    });
  })
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
