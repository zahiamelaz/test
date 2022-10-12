const fetch = require("node-fetch");
const LocalStorage = require("node-localstorage").LocalStorage;
let localStorage = new LocalStorage("./storageToken");


exports.newLike = async (req, res,next) => {
  await fetch(`http://localhost:8030/api/posts/${req.params.id}/likes/like`, {
    // Adding method type
    method: "POST",

    // Adding headers to the request
    headers: {
      Authorization: localStorage.getItem("token"),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  })
    // Converting to JSON
    .then((res) => {
      return res.json();
    })

    // Displaying results to console
    .then((json) => {
      if(json.success){
        req.flash('success','vous avez liker le post')
        res.redirect(`/posts/${req.params.id}`)
        }else{
        req.flash('success','vous avez deja liker ce post')
        res.redirect(`/posts/${req.params.id}`)
        }
    })

    .catch((err) => {
      console.log("ERR ----", err);
    });
};

exports.unLike = async (req, res,next) => {
  await fetch(`http://localhost:8030/api/posts/${req.params.id}/likes/unlike`, {
    // Adding method type
    method: "POST",

    // Adding headers to the request
    headers: {
      Authorization: localStorage.getItem("token"),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  })
    // Converting to JSON
    .then((res) => {
      return res.json();
    })

    // Displaying results to console
    .then((json) => {
      if(json.success){
        req.flash('success','vous avez unliker le post')
        res.redirect(`/posts/${req.params.id}`)
        }else{
        req.flash('success','vous devez liker ce post avant de pouvoir unlike')
        res.redirect(`/posts/${req.params.id}`)
        }
    })

    .catch((err) => {
      console.log("ERR ----", err);
    });
};