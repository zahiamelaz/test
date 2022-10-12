// import des modules de npm
const express = require("express");

// import des fonctions des autres fichiers
const postCtrl = require("../controllers/postCtrlF");
const userCtrl = require("../controllers/userCtrlF");
const commentCtrl = require("../controllers/commentCtrlF")

exports.router = (() => {
    let comRouter = express.Router();

    comRouter.route('/newCom/:id').post(userCtrl.isLog,commentCtrl.newCom)
    comRouter.route('/delete/post/:id/com/:comId').post(commentCtrl.deleteCom)
    comRouter.route('/update/post/:id/com/:comId').post(commentCtrl.updateCom)
    
    return comRouter;
  })();