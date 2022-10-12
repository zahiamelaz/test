// import des modules de npm
const express = require("express");

// import des fonctions des autres fichiers
const postCtrl = require("../controllers/postCtrlF");
const userCtrl = require("../controllers/userCtrlF");
const upload = require("../middleware/multerConfig").upload;

exports.router = (() => {
  let postRouter = express.Router();

  // ---------------------------------- CREATE POST (CREATE)
  postRouter.route("/newPost").post(upload.single("picture"), postCtrl.newPost);
  //--------------------------------------------------------------CREATE POST ???

  //----------------------------------------- GET ALLPOSTS (READ)
  postRouter.route("/feed").get(userCtrl.isLog, postCtrl.getAllPosts);
  // -------------------------------------------- GET ALL POSTS OK !

  //----------------------------------------- GET PostByID (READ)
  postRouter.route("/posts/:id").get(userCtrl.isLog, postCtrl.getPostById);
  // -------------------------------------------- GET PostByID OK !

  //----------------------------------------- UPDATE POST (UPDATE)
  postRouter
    .route("/posts/:id")
    .post(upload.single("picture"), postCtrl.updatePost);
  // -------------------------------------------- UPDATE POST not OK !!!!!

  // --------------------------------------------DELETE POSTE (DELETE)
  postRouter.route("/delete:id").post(postCtrl.deletePost);
  //-----------------------------------------------------DELETE POST NOT OK !!!!

  return postRouter;
})();
