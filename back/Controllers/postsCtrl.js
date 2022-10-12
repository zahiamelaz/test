// Imports

const models = require("../models");
const jwtUtils = require("../utils/jwt.utils");
const TITLE_LIMIT = 2;
const TEXT_LIMIT = 3;

// Routes

module.exports = {
  createPost: function (req, res) {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    let title = req.body.title;
    let text = req.body.text;
    let picture = req.body.picture

    if (title == "" || text == "") {
      return res.status(400).json({ error: "missing info" });
    }
    if (title.length <= TITLE_LIMIT || text.length <= TEXT_LIMIT) {
      return res.status(400).json({ error: "invalid info" });
    }

    models.Users.findOne({
      where: { id: userId },
    })
      .then(function (userFound) {
        if (userFound || userFound.isAdmin != null) {
          models.posts
            .create({
              title: title,
              text: text,
              picture:picture,
              likesCount: 0,
              userId: userFound.id,
            })
            .then(function (newPost) {
              return res.status(201).json({ success: newPost });
            })
            .catch(function (error) {
              return res.status(500).json({ error: "cannot create post" });
            });
        } else {
          return res.status(403).json({ error: "invalid user" });
        }
      })
      .catch(function (error) {
        return res.status(500).json({ error: "unable to verify user" });
      });
  },

  listPosts: function (req, res) {
    // let fields = req.body.fields;
    // let limit = parseInt(req.query.limit);
    // let offset = parseInt(req.query.offset);
    // let order = req.query.order;
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    models.Users.findOne({
      where: { id: userId },
    })
      .then(function (userFound) {
        if (userFound || userFound.isAdmin != null) {
          models.posts
            .findAll({
              attributes: ["id", "userId", "title", "text","picture","likesCount"],
            })
            .then(function (postFound) {
              if (postFound || userFound.isAdmin != null) {
                return res.status(200).json({
                  success: postFound,
                });
              } else {
                return res.status(404).json({ error: "no posts found" });
              }
            })
            .catch(function (error) {
              return res.status(500).json({ error: "invalid fields" });
            });
        } else {
          return res.status(403).json({ error: "invalid user" });
        }
      })
      .catch(function (error) {
        return res.status(500).json({ error: "unable to verify user" });
      });
  },

  updatePost: function (req, res) {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    let title = req.body.title;
    let text = req.body.text;
    let picture = req.body.picture
    let postId = req.params.id;

    models.Users.findOne({
      where: { id: userId },
    })
      .then(function (userFound) {
        if (userFound || userFound.isAdmin != null) {
          models.posts
            .findOne({
              attributes: ["id", "userId", "title", "text","picture"],
              where: { id: postId },
            })
            .then(function (postFound) {
              if (userFound.id == postFound.dataValues.userId || userFound.isAdmin != null ) {
                postFound.update({
                  title: title ? title : postFound.title,
                  text: text ? text : postFound.text,
                  picture: picture ? picture : postFound.picture,
                });
                return res
                  .status(200)
                  .json({ success: "your post has been updated" });
              } else {
                return res.status(403).json({
                  error: "you don't have the rights to update this post",
                });
              }
            })
            .catch(function (error) {
              return res.status(404).json({ error: "post not found" });
            });
        } else {
          return res.status(403).json({ error: "invalid user" });
        }
      })
      .catch(function (error) {
        return res.status(500).json({ error: "unable to verify user" });
      });
  },

  deletePost: function (req, res) {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    let postId = req.params.id;

    models.Users.findOne({
      where: { id: userId },
    })
      .then(function (userFound) {
        if (userFound || userFound.isAdmin != null) {
          models.posts
            .findOne({
              attributes: ["id", "userId", "title", "text","picture"],
              where: { id: postId },
            })
            .then(function (postFound) {
              if (userFound.id == postFound.dataValues.userId || userFound.isAdmin != null) {
                models.posts.destroy({
                  where: { id: postId },
                });
                return res
                  .status(200)
                  .json({ success: "Your post has been deleted" });
              } else {
                return res.status(403).json({
                  error: "you don't have the rights to delete this post",
                });
              }
            })
            .catch(function (error) {
              return res.status(404).json({ error: "post not found" });
            });
        } else {
          return res.status(403).json({ error: "invalid user" });
        }
      })
      .catch(function (error) {
        return res.status(500).json({ error: "unable to verify user" });
      });
  },

  getPostByID: (req, res) => {
    let headerAuth = req.headers["authorization"];
    let userLoggedId = jwtUtils.getUserId(headerAuth);

    let postId = req.params.id;

    models.Users.findOne({
      where: { id: userLoggedId },
    })
      .then(function (userLoggedFound) {
        if (userLoggedFound || userFound.isAdmin != null) {
          models.posts
            .findOne({
              attributes: ["id", "userId", "title", "text","picture", "likesCount"],
              where: { id: postId },
            })
            .then(function (postFound) {
              if (postFound || userFound.isAdmin != null) {
                return res.status(200).json({ success: postFound });
              } else {
                return res.status(404).json({ error: "post not found" });
              }
            })
            .catch(function (error) {
              return res.status(500).json({ error: "cannot fetch post" });
            });
        } else {
          return res.status(403).json({ error: "invalid post" });
        }
      })
      .catch(function (error) {
        return res.status(500).json({ error: "cannot verify user" });
      });
  },

  getPostByIDCom: (req, res) => {
    let headerAuth = req.headers["authorization"];
    let userLoggedId = jwtUtils.getUserId(headerAuth);

    let postId = req.params.id;

    models.Users.findOne({
      where: { id: userLoggedId },
    })
      .then(function (userLoggedFound) {
        if (userLoggedFound || userFound.isAdmin != null) {
          models.posts
            .findOne({
              attributes: ["id", "userId", "title", "text","picture", "likesCount"],
              where: { id: postId },
              include : {model:models.comments}
            })
            .then(function (postFound) {
              if (postFound || userFound.isAdmin != null) {
                return res.status(200).json({ success: postFound });
              } else {
                return res.status(404).json({ error: "post not found" });
              }
            })
            .catch(function (error) {
              return res.status(500).json({ error: "cannot fetch post" });
            });
        } else {
          return res.status(403).json({ error: "invalid post" });
        }
      })
      .catch(function (error) {
        return res.status(500).json({ error: "cannot verify user" });
      });
  },
  
};
