const fetch = require("node-fetch");
const flash = require("connect-flash");
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./storageToken");

// MY FUNCTIONS

// CRUD

// CREATE
exports.register = async (req, res) => {
  let reg = await fetch(`http://localhost:8030/api/users/register/`, {
    // Adding method type
    method: "POST",

    // Adding body or contents to send
    body: JSON.stringify({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      avatar: (req.file ? req.file.filename: "standard.jpg"),
      bio: req.body.bio,
    }),

    // Adding headers to the request
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())

    .then((json) => {
      if (json.success) {
        req.flash("success", "utilisateur crée avec succes connectez vous");
        res.redirect("/login");
      } else {
        res.render("register", json);
      }
    })

    .catch((err) => console.log(err));
};

// READ
exports.getMe = async (req, res) => {
  if (myProfil.success) {
    res.render("profil", { myProfil });
  } else {
    req.flash("success", "utilisateur introuvable veuillez vous connecter");
    res.redirect("/login");
  }
};

// UPDATE
exports.updateProfile = async (req, res) => {
  fetch(`http://localhost:8030/api/users/update/`, {
    // Adding method type
    method: "PUT",

    // Adding body or contents to send
    body: JSON.stringify({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      bio: req.body.bio,
      avatar: (req.file ? req.file.filename : myProfil.avatar)
    }),

    // Adding headers to the request
    headers: {
      "Content-type": "application/json",
      Authorization: localStorage.getItem("token"), //Token à récupérer
    },
  })
    // Converting to JSON
    .then((response) => response.json())

    .then((json) => {
      if (json.success) {
        myProfil = json;
        req.flash("success", "votre profil a été mis a jour");
        res.render("profil", { message: req.flash("success"), myProfil });
      } else {
        myProfil = json;
        res.render("profil", { myProfil });
      }
    });
};

// DELETE
exports.deleteProfil = async (req, res) => {
  // recupere les infos user
  const userDelete = await fetch(`http://localhost:8030/api/users/delete`, {
    method: "DELETE",

    headers: {
      Authorization: localStorage.getItem("token"), // Token à récupérer
    },
  });
  myProfil = await userDelete.json();
  if (myProfil.success) {
    req.flash("success", "Profil supprimé avec success");
    res.redirect("/register");
  } else {
    req.flash("success", "utilisateur introuvable veuillez vous connecter");
    res.redirect("/login");
  }
};

// AUTRES

// VERIFIER LE USER LOGGER
exports.isLog = async (req, res, next) => {
  // recupere les infos user
  const userInfo = await fetch(`http://localhost:8030/api/users/getMe/`, {
    headers: {
      Authorization: localStorage.getItem("token"), // Token à récupérer
    },
  });
  myProfil = await userInfo.json();
  next();
};

// AFFICHER LA PAGE HOME

exports.showHome = async (req, res) => {
  if (myProfil.success) {
    res.render("home",{myProfil});
  } else {
    req.flash("success", "pour acceder a toutes les infos de cette page veuillez vous connecter ou vous inscrire");
    res.render("home",{myProfil,message:req.flash('success'),message2:req.flash('successLogout')});
  }
}

// AFFICHER LA PAGE REGISTER
exports.showRegister = async (req, res) => {
  if (myProfil.success) {
    req.flash(
      "success",
      "Vous etes deja connecté pk se reinscrire ??? HEIN ???"
    );
    res.redirect('/feed')
  } else {
    res.render("register", { myProfil, message: req.flash("success") });
  }
};

// AFFICHER LA PAGE LOGIN
exports.showLogin = async (req, res) => {
  if (myProfil.success) {
    req.flash("success", "Vous etes deja connecté pk se login :)");
    res.redirect("/feed");
  } else{
    res.render("login", { myProfil, message: req.flash("success") });
  }
};

// SE LOGIN
exports.login = async (req, res) => {
  let log = await fetch(`http://localhost:8030/api/users/login/`, {
    // Adding method type
    method: "POST",

    // Adding body or contents to send
    body: JSON.stringify({
      email: req.body.email,
      password: req.body.password,
    }),

    // Adding headers to the request
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())

    .then((json) => {
      if (json.success || json.successAdmin) {
        localStorage.setItem("token", json.token);
        req.flash("success", "Vous êtes bien connecté");
        res.redirect("/feed");
      } else {
        res.render("login", json);
      }
    })

    .catch((err) => console.log(err));
};

// SE LOGOUT
exports.logout = async (req, res) => {
  localStorage.clear();
  req.flash("successLogout", "vous etes bien deconnecté");
  res.redirect("/");
};


//  GET USER BY ID OK
 exports.getUserByID = async (req,res)=>{
  const userById = await fetch(
    `http://localhost:8030/api/users/getUsersByID/${req.params.id}`,
    {
      method: "GET",

      headers: {
        Authorization: localStorage.getItem("token"), // Token à récupérer
      },
    }
  );
  myPost = await userById.json();
  res.render('profilById',myPost)

 }

