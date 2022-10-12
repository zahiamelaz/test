// Imports

const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const TEXT_LIMIT = 2;

// Routes

module.exports = {
    createComment: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let postId = req.params.id;
        let text = req.body.text;

        if (text == "") {
            return res.status(400).json({ error: "missing info" });
        }
        if (text.length < TEXT_LIMIT) {
            return res.status(400).json({ error: "invalid info" });
        }

        models.Users.findOne({
            where: { id: userId }
        })
        .then(function(userFound) {
            if (userFound) {
                models.comments.create({
                    postId: postId,
                    userId: userFound.id,
                    text: text
                })
                .then(function(newComment) {
                    return res.status(201).json({ successCom : newComment } );
                })
                .catch(function(error){
                    return res.status(500).json({ error: "cannot create comment" + error });
                })
            } else {
                return res.status(403).json({ error: "invalid user" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "unable to verify user" });
        })

    },

    updateComment: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let postId = req.params.id;
        let commentId = req.params.comId;
        let text = req.body.text;

        if (postId <= 0) {
            return res.status(400).json({ error: "invalid parameters" });
        }

        models.posts.findOne({
            where: { id: postId }
        })
        .then(function(postFound) {
            if (postFound) {
                models.Users.findOne({
                    where: { id: userId }
                })
                .then(function(userFound) {
                    if (userFound || userFound.isAdmin != null) {
                        models.comments.findOne({
                            where: { 
                                id: commentId,
                                userId: userFound.id,
                                postId: postId
                             }
                        })
                        .then(function(commentFound) {
                            if (commentFound || userFound.isAdmin != null) {
                                console.log(commentFound);
                                if (commentFound.dataValues.userId == userFound.id || userFound.isAdmin != null) {
                                    commentFound.update({
                                        text: ( text ? text : commentFound.text )
                                    })
                                    return res.status(200).json({ success: "your comment has been updated" });
                                } else {
                                    return res.status(403).json({ error: "you don't have the rights to update this comment" });
                                }
                            } else {
                                return res.status(404).json({ error: "comment not found" });
                            }
                        })
                        .catch(function(error) {
                            return res.status(500).json({ error: "unable to find comment" });
                        })
                    } else {
                        return res.status(403).json({ error: "invalid user" });
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ error: "unable to verify user" });
                })
            } else {
                return res.status(404).json({ error: "post not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "unable to find post" });
        })
    },

    deleteComment: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let postId = req.params.id;
        let commentId = req.params.comId;
        let text = req.body.text;

        if (postId <= 0) {
            return res.status(400).json({ error: "invalid parameters" });
        }

        models.posts.findOne({
            where: { id: postId }
        })
        .then(function(postFound) {
            if (postFound) {
                models.Users.findOne({
                    where: { id: userId }
                })
                .then(function(userFound) {
                    if (userFound || userFound.isAdmin != null) {
                        models.comments.findOne({
                            where: { 
                                id: commentId,
                                postId: postId
                             }
                        })
                        .then(function(commentFound) {
                            if (commentFound || userFound.isAdmin != null) {
                                if (commentFound.dataValues.userId == userFound.id || userFound.isAdmin != null) {
                                    models.comments.destroy({
                                        where: { id: commentId }
                                    })
                                    return res.status(200).json({ success: "your comment has been deleted" });
                                } else {
                                    return res.status(403).json({ error: "you don't have the rights to delete this comment" });
                                }
                            } else {
                                return res.status(404).json({ error: "comment not found" });
                            }
                        })
                        .catch(function(error) {
                            return res.status(500).json({ error: "unable to find comment" });
                        })
                    } else {
                        return res.status(403).json({ error: "invalid user" });
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ error: "unable to verify user" });
                })
            } else {
                return res.status(404).json({ error: "post not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "unable to find post" });
        })
    },

    listComments: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let postId = req.params.id;

        if (postId <= 0) {
            return res.status(400).json({ error: "invalid parameters" });
        }

        models.posts.findOne({
            where: { id: postId }
        })
        .then(function(postFound) {
            if (postFound) {
                models.Users.findOne({
                    where: { id: userId }
                })
                .then(function(userFound) {
                    if (userFound || userFound.isAdmin != null) {
                        models.comments.findAll({
                            attributes: ["id", "userId", "postId", "text","picture","createdAt", "updatedAt"],
                            where: { postId: postId }
                        })
                        .then(function(commentFound) {
                            if (commentFound || userFound.isAdmin != null) {
                                    return res.status(201).json({ success:commentFound });
                            } else {
                                return res.status(404).json({ error: "comment not found" });
                            }
                        })
                        .catch(function(error) {
                            return res.status(500).json({ error: "unable to find comment" });
                        })
                    } else {
                        return res.status(403).json({ error: "invalid user" });
                    }
                })
                .catch(function(error) {
                    return res.status(500).json({ error: "unable to verify user" });
                })
            } else {
                return res.status(404).json({ error: "post not found" });
            }
        })
        .catch(function(error) {
            return res.status(500).json({ error: "unable to find post" });
        })
    
        
    }
}