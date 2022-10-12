// import des modules de npm 
const express = require('express')
const path = require('path')
const session = require('express-session');
const flash = require('connect-flash');
//////

// import des fonctions des autres fichiers
const userRouter = require('./routes/user.routes').router
const postRouter = require('./routes/post.routes').router
const comRouter = require('./routes/comment.routes').router
const likeRouter = require('./routes/like.routes').router
//

// instantiate server
const app = express()
//

// middleware

// Parser config
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// SET VIWES ENGINE
app.set("view engine", "ejs");
 
app.set("views", path.join(__dirname, "views"));
app.set('/img', path.join(__dirname, '/public'));
app.set('/css', path.join(__dirname, '/public'));
app.use(express.static(__dirname + '/public'))

///// Gestion des session et des message flash
app.use(session({
    secret: 'AyoubeLoniadas92',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());
/////



// USERS ROUTES
app.use(userRouter)

// POSTS ROUTES
app.use(postRouter)

// COMS ROUTES
app.use(comRouter)


// LIKES ROUTES
app.use(likeRouter)


app.listen(4000,()=>{
    console.log("http://localhost:4000");
})