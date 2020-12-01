const express = require('express');
const Poster = require('../../data/db');
const router = express.Router();

router.post('/', (req, res) => {
  if(!req.body.title || !req.body.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }
  Poster.insert(req.body)
    .then((post) => {
      console.log('newPost', post);
      
      res.status(201).json(post)
    })
    .catch(error => {
      console.log('New Post Error',error)      
      res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

module.exports = router