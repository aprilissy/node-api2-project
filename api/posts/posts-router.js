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

router.post('/:id', async (req, res) => {
try{ const id = Number(req.params.id)
  const checkL = await Poster.findById(id)
  if( checkL.length < 1) {
    res.status(404).json({ message: "The post with the specified ID does not exist." })
  } else if (!req.body.text){
    res.status(400).json({ errorMessage: "Please provide text for the comment." })
  } else {
    const comment = {post_id:id, ...req.body}
    const posted = await Poster.insertComment(comment)
    res.status(201).json(posted)
  }
} catch(error){
    console.trace("CREATE ERROR: ", error)
    res.status(500).json({ errorMessage: "There was an error while saving the comment to the database." })
  }
})

module.exports = router