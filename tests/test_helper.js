const Post = require('../models/post');

const initialPosts = [
  {
    title: 'Good news',
    content: 'not much',
  },
  {
    title: 'Death Penalty: JavaScript to be Executed',
    content: 'More like JavaRIP',
  },
];

const nonExistingId = async () => {
  const post = new Post({ title: 'we don\' exist', content: 'AHHHHHHH' });
  await post.save();
  await post.remove();

  return post._id.toString();
};

const PostsInDb = async () => {
  const posts = await Post.find({});
  return posts.map((post) => post.toJSON());
};

module.exports = {
  initialPosts,
  nonExistingId,
  PostsInDb,
};
