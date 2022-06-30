const postsRouter = require('express').Router();
const middleware = require('../utils/middleware');
const Post = require('../models/post');

postsRouter.get('/', async (_request, response) => {
  const posts = await Post
    .find({})
    .populate('user', {
      username: 1,
      name: 1,
    });

  response.json(posts);
});

postsRouter.get('/:id', async (request, response) => {
  const post = await Post
    .findById(request.params.id)
    .populate('user', {
      username: 1,
      name: 1,
    });

  if (post) {
    response.json(post);
  } else {
    response.status(404).end();
  }
});

postsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { body } = request;
  const { user } = request;

  const post = new Post({
    title: body.title,
    content: body.content,
    user: user._id,
  });

  const newPost = await post.save();
  user.posts = user.posts.concat(newPost._id);
  await user.save();

  response.status(201).json(newPost);
});

postsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  await Post.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

postsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const { body } = request;

  const post = {
    title: body.title,
    content: body.content,
  };

  const updatedPost = await Post.findByIdAndUpdate(
    request.params.id,
    post,
    {
      new: true,
      runValidators: true,
    },
  );

  response.json(updatedPost);
});

module.exports = postsRouter;
