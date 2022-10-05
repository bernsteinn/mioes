const express = require("express")
const app = express()
const url = "mongodb://localhost:27017/"
const cors = require("cors")
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require("mongodb").ObjectId
var bcrypt = require("bcrypt")
const session = require('express-session'); 
const path  = require("path")
const { createServer } = require("http");
const { Server } = require("socket.io");
const useragent = require("express-useragent")
const fileupload = require("express-fileupload");
const fs= require("fs");


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

const httpServer = createServer(app);
const io = new Server(httpServer, 
  {cors: {
    origin: ["https://sandbox.mioes.app", "https://mioes.app"],
    methods: ["GET", "POST"],
    credentials: true
  }});
  const sessionMiddleware = session({ 
    name: "session",
    secret: "ao9o3nni9kc2992-92998jfjfmsaoc-29199ks",
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure:false,
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000,
      httpOnly: true,
    }})
io.on("connection", (socket) => {
  socket.on("updateMe", () => {
    socket.emit("update", {liveJobs:  1})
  })
});


app.use(express.static(__dirname + "/static"))
app.use(express.static(__dirname + "/client"))
app.use(fileupload());

app.use(express.json())
app.set('view engine', 'ejs')
const whitelist = ['https://sandbox.mioes.app', 'https://mioes.app', 'https://admin.mioes.app' , 'https://api.mioes.app']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('?'))
    }
  }
}
app.use(cors())
app.use(sessionMiddleware);

app.get("/" , (req, res) => {
  var source = req.headers['user-agent']
  var ua = useragent.parse(source);
  var isMobile = ua.isMobile
  if(isMobile){
    res.render("mobile-index")
  }else{
    res.render("index")
  }
})
app.get("/scanqr" ,(req, res) => {
    res.render("scanqr")
})
app.get("/foryou", (req,res) => {
  res.render("foryou")
})
app.get("/search", (req, res) => {
  res.render("search")
})

app.post("/app/search", (req, res) => {
  var query  = req.body.query.toString()
  MongoClient.connect(url, function(err, db) {
    if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."}); return}
    var dbo = db.db("mioes");
    dbo.collection("restaurants").find({searchQuery:query}).toArray(function(err, result) {
      if (err){res.json({status:false, err:"Algo ha ido mal. Vuelvelo a intentar"}); return}
      var searchResults = []
      result.forEach(element => {
        searchResults.push(element)
      });
      res.json({status:true, results: searchResults})
      db.close();
    });
  })
})
app.get("/restaurant", (req, res) => {
  const id = req.query.id
  var query = {_id: ObjectId(id.toString())}
  MongoClient.connect(url, function(err, db) {
      if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."}); return}
      var dbo = db.db("mioes");
      dbo.collection("restaurants").find(query).toArray(function(err, result) {
        if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."}); return}
        res.render("restaurant", {restaurant_of_the_week: {"status": true, name: result[0].name, address: result[0].address, rating: result[0].rating ,img: result[0].img, info: result[0].description, food: result[0].tipo, chef: result[0].chef ,pricerange: result[0].pricerange ,long: result[0].longitude, lat: result[0].latitude, menuElements: result[0].menuElements, menuCategories: result[0].menuCategories}})
        db.close();
      });
    }); 
  })

app.post("/qr-results", (req, res) => {
    try{ var qrResult = Buffer.from(req.body.data, "base64")} catch (e){res.json({status:false, err: "Algo ha ido mal. Vuelve a escanear el QR porfavor."}); return}
    const qrResultToJson = JSON.parse(qrResult.toString());
    var query = {_id: ObjectId(qrResultToJson.restaurantId.toString())}
    MongoClient.connect(url, function(err, db) {
        if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."}); return}
        var dbo = db.db("mioes");
        dbo.collection("restaurants").find(query).toArray(function(err, result) {
          if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."}); return}
          res.json({status:true, id:result[0]._id})
          db.close();
        });
      }); 
    })

    app.post("/search", (req, res) => {
      const restaurantId = req.body.restaurantId
      var query = {_id: ObjectId(restaurantId.toString())}
      MongoClient.connect(url, function(err, db) {
        if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."}); return}
          if (err) throw err;
          var dbo = db.db("mioes");
          dbo.collection("restaurants").find(query).toArray(function(err, result) {
            if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."}); return}
            res.json({"status": true, name: result[0].name, address: result[0].address, img: result[0].img, description: result[0].description, tipo: result[0].tipo, long: result[0].longitude, lat: result[0].latitude, menuElements: result[0].menuElements, menuCategories: result[0].menuCategories})
            db.close();
          });
        });   
    })
  app.get("/session", (req, res) => {
    if(req.session.loggedin != true){res.json({loggedin:false});return}
    res.json({loggedin: true})
  })
  app.post("/admin/session/login", (req, res) => {
    var adminUser = req.body.username.toString()
    var adminPassword = req.body.password.toString()
    MongoClient.connect(url, (err, db) => {
      if (err) {res.json({status:false, err:"Algo ha ido mal, porfavor, vuelve a iniciar sesión en unos segundos."}); return}
      var dbo = db.db("mioes")
      var query = {username: adminUser}
      dbo.collection("adminUsers").find(query).toArray(function(err, result){
        if (err) {res.json({status:false, err:"Algo ha ido mal, porfavor, vuelve a iniciar sesión en unos segundos."}); return}
        if(result.length > 0){
          //check password valid
          if(!bcrypt.compareSync(adminPassword, result[0].password)){
            res.json({status:false, err: {msg:"Contraseña incorrecta", code: 1}})
            db.close()
            return
          }
          if(result[0].accountSetUpCompleted != true){
            req.session.restaurantId = result[0]._id
            req.session.restaurantName = result[0].name
            req.session.loggedin = true
            res.json({status:true, msg: "Sesión iniciada con éxito!", code: 44})
            db.close()
            return;
          }
          //implement 2fa? login succesful.
          req.session.restaurantId = result[0]._id
          req.session.restaurantName = result[0].name
          req.session.restaurantProfilePic = result[0].profile_pic
          req.session.loggedin = true
          res.json({status:true, msg: "Sesión iniciada con éxito!"})
          db.close()
          return
        }
        res.json({status:false, err:{msg:"Usuario no existente", code: 2}})
        db.close()
      })
    })
  })
  app.post("/admin/session/setup", (req, res) => {
    if(req.session.loggedin != true){res.json({status:false, err: "Inicia sesión para hacer esto"}); return}
    let img = req.files.img;
    let name = req.body.name
    let address = req.body.address
    var randomString = makeid(5)
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    try{
    var dir = `./client/images/social/userImages`
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive: true});
    }
    img.mv(dir +"/"+ `profile${randomString}.png`);
    var completePath = `/images/social/userImages/` + `profile${randomString}.png`
  } catch(err){
    console.log(err)
    res.json({status:false})
  }
  MongoClient.connect(url, function(err, db) {
    if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
      if (err) throw err;
      var dbo = db.db("mioes");
      var profileData = {name: name, address: address, profile_pic: completePath, accountSetUpCompleted: true}
      dbo.collection("adminUsers").updateOne({_id: ObjectId(req.session.restaurantId)}, {$set: profileData}, function(err, result) {
        if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
        if(result.acknowledged == true){
          req.session.restaurantName = name.toString()
          req.session.profile_pic = completePath
          res.send({status: true, msg:"¡Perfil configurado con éxito!"});
          return
        }
        else{
          res.send({status: false, msg:"Algo ha ido mal. Porfavor, vuelvelo a intentar en unos instantes."});
        }
        db.close()
    })
  })
})
  app.get("/admin/*", (req, res) => {
    res.sendFile(path.join(__dirname+'/static/admin/index.html'));
  })
  app.get("/posts", (req, res) => {
    MongoClient.connect(url, function(err, db) {
      if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
        if (err) throw err;
        var dbo = db.db("mioes");
        dbo.collection("posts").find({}).toArray(function(err, result) {
          if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
          var arr = [];
          while(arr.length < result.length){
            var r = Math.floor(Math.random() * result.length);
            if(arr.indexOf(r) === -1) arr.push(r);
          }
          var postsArray = []
          result.every(post => {
            if(post == result[50]){
              return false
            }
            postsArray.push({"status": true, id: post.id, profile_pic: post.profile_pic ,author: post.author, img: post.img, body:post.body, title: post.title, date: post.date, rating: post.rating, stars: post.stars})
            return true
          });
          res.json({posts: postsArray})
          db.close();
        });
      });   

  })
  app.post("/admin/session/register", (req, res) => {
      var u = req.body.username.toString()
      var p = req.body.password.toString()
      var e = req.body.email.toString()
      MongoClient.connect(url, function(err, db) {
        if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
          if (err) throw err;
          var dbo = db.db("mioes");
          dbo.collection("adminUsers").find({email: e}).toArray(function(err, result) {
            if(result.length > 0){
              res.json({status:false, err:"Este email ya esta en uso."}); 
              db.close()
              return;
            }
            dbo.collection("adminUsers").find({username: u}).toArray(function(err, result){
              if(result.length > 0){
                res.json({status:false, err:"Este usuario ya esta en uso."}); 
                db.close()
                return;
              }
              var newUser = {username: u, password: bcrypt.hashSync(p, 10), email: e, accountSetUpCompleted: false}
              dbo.collection("adminUsers").insertOne(newUser, function(err, result){
                if(err){res.json({status:false, msg: "Algo ha ido mal, vuelve a provar en unos momentos"}); return}
                res.json({status:true, msg: "Te has registrado con éxito, redirigiendo al inicio de sesión..."})
                db.close()
              })
            })
          })
        })
  

  })
  app.post("/newpost", async (req, res) => {  
    if(!req.session.loggedin){
      res.json({status:false, err:"Porfavor inicia sesión para hacer esto"})
      return;
    }
    try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          let img = req.files.postImage;
          var randomString = makeid(5)
          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          try{
          var dir = `./client/images/social/${req.session.restaurantName}-posts`
          if (!fs.existsSync(dir)){
              fs.mkdirSync(dir, {recursive: true});
          }
          img.mv(dir +"/"+ `post${randomString}.png`);
          var completePath = `/images/social/${req.session.restaurantName}-posts`+ "/" + `post${randomString}.png`
        } catch(err){
          console.log(err)
        }
        MongoClient.connect(url, function(err, db) {
          if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
            if (err) throw err;
            var dbo = db.db("mioes");
            var date = new Date()
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            var postCreated = {rating: "5", id: makeid(5), stars: "<i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i>", img: completePath.toString(), profile_pic:req.session.restaurantProfilePic,title: req.body.title.toString(), body: req.body.msg.toString(), author: req.session.restaurantName, date: date.toLocaleDateString('es-ES', options)}
            dbo.collection("posts").insertOne(postCreated, function(err, result) {
              if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
              if(result.acknowledged == true){
                res.send({status: true, msg:"¡Publicación creada con éxito!"});
              }
              else{
                res.send({status: false, msg:"Algo ha ido mal. Porfavor, vuelvelo a intentar en unos instantes."});
              }
              db.close()
            })
          })
          }
  } catch (err) {
      res.status(500).json({status:false, err:"Algo ha ido mal. Vuelvelo a provar en unos momentos porfavor"});
  }
  })
app.get("/*", (req, res) => {
    res.redirect("/")
})

httpServer.listen(80)