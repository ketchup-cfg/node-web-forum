const postsRouter = require('express').Router();
const Post = require('../models/post');

postsRouter.get('/', async (_request, response) => {
  const posts = await Post.find({});
  response.json(posts);
});

postsRouter.get('/:id', async (request, response) => {
  const post = await Post.findById(request.params.id);

  if (post) {
    response.json(post);
  } else {
    response.status(404).end();
  }
});

postsRouter.post('/', async (request, response) => {
  const { body } = request;

  const post = new Post({
    title: body.title,
    content: body.content,
  });

  const savedPost = await post.save();
  response.status(201).json(savedPost);
});

postsRouter.delete('/:id', async (request, response) => {
  await Post.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

postsRouter.put('/:id', async (request, response) => {
  const { body } = request;

  const post = {
    title: body.title,
    content: body.content,
  };

  const updatedPost = await Post.findByIdAndUpdate(
    request.params.id,
    post,
    { new: true, runValidators: true },
  );
  response.json(updatedPost);
});

module.exports = postsRouter;
