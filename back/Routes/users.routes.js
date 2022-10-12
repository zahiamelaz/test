// Imports

const express = require('express');
const usersCtrl = require('../Controllers/usersCtrl');
const postsCtrl = require('../Controllers/postsCtrl');
const commentsCtrl = require('../Controllers/commentsCtrl');
const likesCtrl = require('../Controllers/likesCtrl');
const path = require('path');
const multer = require('multer');

// Use of Multer
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/data/uploads/')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
const upload = multer({
    storage: storage
});

// Routes

exports.router = (() => {
    let apiRouter = express.Router();
    
    // Users Routes

    apiRouter.route('/users/register/').post(upload.single('image'),usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/update/').put(usersCtrl.update);
    apiRouter.route('/users/delete/').delete(usersCtrl.delete);
    apiRouter.route('/users/getUsersAll/').get(usersCtrl.getUsersAll);
    apiRouter.route('/users/getUsersByID/:id').get(usersCtrl.getUsersByID);
    apiRouter.route('/users/getMe/').get(usersCtrl.getUsersProfile);
    apiRouter.route('/users/getUsersPosts').get(usersCtrl.getAllUsersPosts);
    apiRouter.route('/users/getMyPosts').get(usersCtrl.getMyPosts);

    // Posts Routes

    apiRouter.route('/posts/new/').post(postsCtrl.createPost);
    apiRouter.route('/posts/all/').get(postsCtrl.listPosts);
    apiRouter.route('/posts/getPostByID/:id').get(postsCtrl.getPostByID);
    apiRouter.route('/posts/update/:id').put(postsCtrl.updatePost);
    apiRouter.route('/posts/delete/:id').delete(postsCtrl.deletePost);
    apiRouter.route('/posts/getCommentsPosts/:id').get(postsCtrl.getPostByIDCom);
    
    //TEST
    apiRouter.route('/users/getMyComments').get(usersCtrl.getMyComments);
    
    // Comments Routes

    apiRouter.route('/posts/:id/comments/new/').post(commentsCtrl.createComment);
    apiRouter.route('/posts/:id/comments/all/').get(commentsCtrl.listComments);
    apiRouter.route('/posts/:id/comments/update/:comId').put(commentsCtrl.updateComment);
    apiRouter.route('/posts/:id/comments/delete/:comId').delete(commentsCtrl.deleteComment);

    // Likes Routes
    
    apiRouter.route('/posts/:id/likes/like').post(likesCtrl.like);
    apiRouter.route('/posts/:id/likes/unlike').post(likesCtrl.unlike);
    // apiRouter.route('/posts/:id/likes/all').get(likesCtrl.listLikes);

    return apiRouter;
})();


