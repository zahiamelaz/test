const fetch = require("node-fetch");
const LocalStorage = require("node-localstorage").LocalStorage;
let localStorage = new LocalStorage("./storageToken");

// MY FUNCTIONS CRUD POSTS

//----------------------- CREATE
exports.newPost = async (req, res) => {
  await fetch(`http://localhost:8030/api/posts/new/`, {
    // Adding method type
    method: "POST",

    // Adding headers to the request
    headers: {
      Authorization: localStorage.getItem("token"),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",

    // Adding body or contents to send
    body: JSON.stringify({
      title: req.body.title,
      text: req.body.text,
      picture : (req.file ? req.file.filename : null)
    }),
  })
    // Converting to JSON
    .then((res) => {
      return res.json();
    })

    // Displaying results to console
    .then((json) => {
      if (json) {
        req.flash("success", "publication posté avec success");
        res.redirect("/feed");
      } else {
        res.redirect("/login");
      }
    })

    .catch((err) => {
      console.log("ERR ----", err);
    });
}; 

//----------------------------- READ
exports.getAllPosts = async (req, res) => {
  // recupereration de la liste des Post
  const postAll = await fetch(`http://localhost:8030/api/posts/all/`, {
    headers: {
      Authorization: localStorage.getItem("token"), // Token à récupérer
    },
  });
  posts = await postAll.json();

  // recuperation de la liste des Users
  const userAll = await fetch("http://localhost:8030/api/users/getUsersAll/", {
    headers: {
      Authorization: localStorage.getItem("token"), // Token à récupérer
    },
  });
  users = await userAll.json();
  if (myProfil.success) {
    res.render("feed", { posts, users, myProfil, message: req.flash("success") });
  } else {
    req.flash('success','utilisateur introuvable veuillez vous connecter')
    res.redirect("/login");
  }
  
}; 
exports.getPostById = async (req, res) => {
  // recuperation de la liste des Users
  const userAll = await fetch("http://localhost:8030/api/users/getUsersAll/", {
    headers: {
      Authorization: localStorage.getItem("token"), // Token à récupérer
    },
  });
  users = await userAll.json();

  // recupere les infos user
  const postById = await fetch(
    `http://localhost:8030/api/posts/getCommentsPosts/${req.params.id}`,
    {
      method: "GET",

      headers: {
        Authorization: localStorage.getItem("token"), // Token à récupérer
      },
    }
  );
  myPost = await postById.json();

  if (myProfil.success) {
    res.render("postById", {
      myPost,
      users,
      myProfil,
      message: req.flash("success"),
    })
  } else {
    req.flash('success','utilisateur introuvable veuillez vous connecter')
    res.redirect("/login");
  }
}; 

//-------------------------------- UPDATE
exports.updatePost = async (req, res) => {
  fetch(`http://localhost:8030/api/posts/update/${req.params.id}`, {
    // Adding method type
    method: "PUT",

    // Adding body or contents to send
    body: JSON.stringify({
      title: req.body.title,
      text: req.body.text,
      picture: (req.file ? req.file.filename : myPost.success.picture )
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
      req.flash("success", "Votre post a été modifié avec success");
      res.redirect(`/posts/${req.params.id}`);
    })
    .catch((err) => console.log(err));
};

//----------------------------DELETE
exports.deletePost = async (req, res) => {
  const postDelete = await fetch(
    `http://localhost:8030/api/posts/delete/${req.params.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"), // Token à récupérer
      },
    }
  );
  myDelete = await postDelete.json();
  req.flash("success", "supression du post avec succes");
  res.redirect("/feed");
}; 
