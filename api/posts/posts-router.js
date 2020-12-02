const express = require('express');
const Poster = require('../../data/db');
const router = express.Router();

router.post('/', (req, res) => {
  if(!req.body.title || !req.body.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }
  Poster.insert(req.body)
    .then((post) => {
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

router.get('/', async (req, res) => {
  try{
    const allPosts = await Poster.find()
    res.status(200).json(allPosts)
  }
  catch{
    res.status(500).json({ message: "The post with the specified ID does not exist." })
  }
})

router.get('/:id', async (req, res) => {
  try {
   const post = await Poster.findById(req.params.id)
    if (post.length > 0) {
      res.status(200).json(post)
    }else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  } catch {
    res.status(500).json({ error: "The post information could not be retrieved." })
  }
})

router.get('/:id/comments', async (req, res) => {
  try {
    const id = req.params.id
    const post = await Poster.findById(id)
    if (post.length < 1) {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
      const comments = await Poster.findPostComments(id)
      console.log('comments',comments)
      res.status(200).json(comments)
    }
  } catch {
    res.status(500).json({ error: "The comments information could not be retrieved." })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    console.log('id',id);
    
    const post = await Poster.findById(id)
    console.log('post',post);
    
    if (post.length < 1) {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
      const del = await Poster.remove(id)
      console.log('delete',del)
      if (del === 1){
        res.status(200).json(post)
      } else {
        res.status(500).json({ error: "The post could not be removed" })
      }
    }
  } catch {
    res.status(500).json({ error: "The post could not be removed" })
  }
})

module.exports = router