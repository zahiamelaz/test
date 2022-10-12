// import des modules de npm
const express = require("express");

// import des fonctions des autres fichiers
const userCtrl = require("../controllers/userCtrlF");
const upload = require('../middleware/multerConfig').upload


// ROUTES
exports.router = (() => {
  let userRouter = express.Router();

  // MISE EN PLACE DES ROUTES
  userRouter.route("/").get(userCtrl.isLog,userCtrl.showHome)
  
  //----------------------------CRUD USER------------------------------------------




  // ----------------------------------------------REGISTER (CREATE)--------------
  userRouter.route("/register").get(userCtrl.isLog,userCtrl.showRegister);
  userRouter.route("/register").post(upload.single("avatar"),userCtrl.register);
  //--------------------------------------------- REGISTER OK -------------------




  // -------------------------------------LOGIN-------------------
  userRouter.route("/login").get(userCtrl.isLog,userCtrl.showLogin)
  userRouter.route("/login").post(userCtrl.login);
  //-------------------------------  LOGIN OK------------------------
 
  // --------------------- LOGOUT
  userRouter.route('/logout').post(userCtrl.logout)
  //--------------------------------- LOGOUT OOOOK



  // --------------------------GET PROFIL (READ)-----------------
  userRouter.route("/profil").get(userCtrl.isLog,userCtrl.getMe);
  
  //----------------------------GET PROFIL OK -------------



  // -------------------------------------UPDATE profil (UPDATE)---------------
  userRouter.route("/profil").post(upload.single('avatar'),userCtrl.updateProfile);
  //----------------------------------------UPDATE OK -------------------------




  // --------------------------------DELETE profil (DELETE)---------------
  userRouter.route("/profil/delete").post(userCtrl.deleteProfil);
  //------------------------------------DELETE OK------------------------------



  //------------------------------------------------------------------CRUD USER OK

// TEST

userRouter.route("/profil/:id").get(userCtrl.isLog,userCtrl.getUserByID );

  return userRouter;
})();
