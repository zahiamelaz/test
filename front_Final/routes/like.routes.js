// import des modules de npm
const express = require("express");

// import des fonctions des autres fichiers
const postCtrl = require("../controllers/postCtrlF");
const userCtrl = require("../controllers/userCtrlF");
const commentCtrl = require("../controllers/commentCtrlF")
const likeCtrl = require("../controllers/likeCtrlF")

exports.router = (() => {
    let likeRouter = express.Router();


    likeRouter.route('/post/like/:id').post(likeCtrl.newLike)
    likeRouter.route('/post/unlike/:id').post(likeCtrl.unLike)
   
    
    return likeRouter;
  })();