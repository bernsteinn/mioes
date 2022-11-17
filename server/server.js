const express = require("express")
const app = express()
const url = "mongodb://127.0.0.1:2029/";
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
var ObjectId = require("mongodb").ObjectId
var bcrypt = require("bcrypt")
const session = require('express-session'); 
const path  = require("path")
const { createServer } = require("http");
const { Server } = require("socket.io");
const useragent = require("express-useragent")
const fileupload = require("express-fileupload");
const fs= require("fs");
const translate = require("translate")
const passport = require("passport");
const { Domain } = require("domain");
const { privateDecrypt } = require("crypto");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const stripe = require("stripe")('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' ,{apiVersion: '2020-08-27'})
const sharp = require('sharp');
var request = require('request').defaults({ encoding: null });
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

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
    origin: ["https://mioes.app"],
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
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

app.use(express.static(__dirname + "/static"))
app.use(express.static(__dirname + "/client"))
app.use(fileupload());

app.use(express.json({verify: function (req, res, buf) {
  if (req.originalUrl.startsWith("/webhook")) {
    req.rawBody = buf.toString();
  }
}}))
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

passport.use(new GoogleStrategy({
  clientID: '602261944879-tvn5dfe1f32ajlht7dnab2bgjlo51jfh.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "https://mioes.app/auth/google/callback",
  passReqToCallback   : true
},
async (request, accessToken, refreshToken, profile, done) => {
  try {
      var newUser = {
        method: 'google',
        ident: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      };
      MongoClient.connect(url, function(err, db) {
        if (err){res.json({status:false, err:"Algo no ha ido bien, intentalo de nuevo"}); return}
        var dbo = db.db("mioes");
        dbo.collection("appUsers").find({method: 'google', ident: profile.id }).toArray((err, result) =>{
          if(result.length == 0){
            dbo.collection("appUsers").insertOne(newUser, (err, resullt) => {
              if(resullt.acknowledged == true){
                return done(null, newUser);  
              }
            })
            return done(null, newUser);  
          }
          return done(null, newUser);  
        });
      })
    } catch (error) {
      console.log(error)
  }
}
));


app.get("/" , (req, res) => {
  var source = req.headers['user-agent']
  try{
  var ua = useragent.parse(source);
  var isMobile = ua.isMobile
  if(isMobile){
    res.render("mobile-index", {bestRestaurant: '/r/elcingle', bestRating: '/r/colmado1917', bestWeekly: '/r/s3ntidos', weeklyRestaurant: '/r/mumcuinaevocativa'})
  }else{
    if(req.session.loggedin == true) {res.redirect("/admin"); return}
    res.render("index")
  
  }
}catch(e){
  res.render("mobile-index")
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
app.get("/categories" ,(req, res) => {
  res.render("categories")
})
app.post("/users/login", (req, res) => {
  var username = req.body.user.toString()
  var password = req.body.pass.toString()
  MongoClient.connect(url, function(err, db) {
    if (err){res.json({status:false, err:"Algo no ha ido bien, intentalo de nuevo"}); return}
    var dbo = db.db("mioes");
    dbo.collection("appUsers").find({user: username}).toArray((err, result) =>{
      if (err){res.json({status:false, err:"Algo ha ido mal. Vuelvelo a intentar" + err}); return}
      if(bcrypt.compareSync(password, result[0].password)){
        req.session.user = true
        req.session.username = username
        res.json({status:true})
        db.close();  
        return
      }
      res.json({status:false})
    });
  })
})
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));
app.get("/auth/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    req.session.email = req.user.email
    req.session.user = true
    req.session.name = req.user.name
    res.redirect("/")
});
app.post("/users/register", (req, res) => {
  var username = req.body.user
  var password = req.body.pass
  MongoClient.connect(url, function(err, db) {
    if (err){res.json({status:false, err:"Algo no ha ido bien, intentalo de nuevo"}); return}
    var dbo = db.db("mioes");
    dbo.collection("appUsers").find({user: username}).toArray((err, result) => {
      if(result.length == 0){
        dbo.collection("appUsers").insertOne({user: username, password: bcrypt.hashSync(password, 10)}, (err, result) =>{
          if (err){res.json({status:false, err:"Algo ha ido mal. Vuelvelo a intentar" + err}); return}
          res.json({status:true})
        });    
        return
      }
      res.json({status:false, msg: "Este correo electrónico ya está en uso."})
    })
  })
})
const DOMAIN = "https://mioes.app/admin/premium"
app.get('/create-checkout-session', async (req, res) => {
  try{
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: req.query.product.toString(),
        // For metered billing, do not pass quantity
        quantity: 1,

      },
    ],
    success_url: `${DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
}catch (e) {
  res.status(400);
  return res.send({
    status:false,
    error: {
      message: e.message,
    }
  });
}
});
app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const payload = request.body;
  const sig = request.headers['stripe-signature'];

  let event;
  const endpointSecret = "whsec_2K6BwYfMx52My3rlFP2V02FjIR7RRH82"
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'customer.subscription.created') {
    const session = event.data.object;
    MongoClient.connect(url, function(err, db) {
      if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."}); return}
      var dbo = db.db("mioes");
      dbo.collection("adminUsers").updateOne({_id: request.session.restaurantId}, {$set: {subscribed: true}}, function(err, result) {
        if (err){res.json({status:false, err:"Algo ha ido mal. Vuelvelo a intentar"}); return}
        res.json({status:true})
        db.close();
      });
    })
  
  }
});
app.post('/create-portal-session', async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});
app.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

app.get("/users/session" ,(req,res) => {
  console.log(req.session)
  if(req.session.user == true){
    res.json({status:true, loggeddin: true})
    return
  }
  res.json({status:true, loggeddin:false})
  
})
app.post("/admin/generateqr", (req, res) => {
  request.get(`https://api.qrserver.com/v1/create-qr-code/?size=525x525&data=${req.body.url}`, async function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var qrImg = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
        const qrLocation  = `./tmp/qr${makeid(5)}.png`
        var qrProcessedLocation = `./tmp/qrProcessed${makeid(5)}.png`
        var data = qrImg.replace(/^data:image\/png;base64,/, '');
        fs.writeFile(qrLocation, data, 'base64', function(err) {
          if (err) {res.json({status:false}); return}
        });
        const templateImg = "./client/images/template/3333.png"
        const finalLocation = `./tmp/merged${makeid(5)}.png`
        try{
          await new Promise(r => setTimeout(r, 250));
        await sharp(qrLocation).resize(525, 525).png().toFile(qrProcessedLocation)
        }catch(e){
          console.log(e)
          res.json({status:false})
          fs.unlinkSync(qrLocation)
          return
        }
        try{
        await sharp(templateImg)
             .composite([{input: qrProcessedLocation, top: 325, left: 235}]).toFile(finalLocation);
        }catch(e){
          res.json({status:false})
          fs.unlinkSync(qrLocation)
          fs.unlinkSync(qrProcessedLocation)
          console.log(e)
          return
        }
        var imageAsBase64 = fs.readFileSync(finalLocation, 'base64');
        res.json({status: true, img: imageAsBase64})
        setTimeout(() => {
          fs.unlinkSync(qrLocation)
          fs.unlinkSync(finalLocation)
          fs.unlinkSync(qrProcessedLocation)
        }, 5000)
      
    }
});
})
app.get("/menu/chooselanguage", (req, res) => {
  const restaurant = req.query.r
  res.render("chooselanguage", {
    languages: {
      catala: `window.location = '/carta/${restaurant}?lang=cat'`,
      english: `window.location = '/carta/${restaurant}?lang=eng'`,
      espanol: `window.location = '/carta/${restaurant}?lang=es'`,
      francais: `window.location = '/carta/${restaurant}?lang=fr'`,
    }
  })
})
app.get("/carta/:restaurant", (req, res) => {
  const restaurant = req.params.restaurant.toString()
  const lang = req.query.lang.toString()
  const query = {id: restaurant}
  if(restaurant == undefined) {
    res.render("menu", {status:false, err: "Porfavor, proporciona un restaurante."})
    return
  }
  MongoClient.connect(url, function(err, db){
    if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
    var dbo = db.db("mioes")
    dbo.collection("adminUsers").find(query).toArray(async (err, result) => {
      if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
      if(result.length > 0 && result[0].menu.length > 0){
        if(lang == "es"){
          res.render("menu", {status:true, menu : result[0].menu, color: result[0].color, font: result[0].font, titleMenu: result[0].titleMenu})
          db.close()
          return
        }
        if(lang == "cat"){
          translate.engine = "google"
          translate.key = "AIzaSyCUjkH_o3ew3hiatWtOlYME8bB-a2jiRO8"
          const titleTranslated = await translate(result[0].titleMenu, {from: 'es', to: 'cat'});
          var translatedMenu = []
          var translatedProducts = []
          var translating = new Promise((resolve, reject) => {
            result[0].menu.forEach(async (category, index, array) => {
              category.products.forEach(async (product) => {
                var productTranslated = {name: await translate(product.name, {from: 'es', to: 'cat'}), price: product.price, img: product.img, productId: product.productId}
                translatedProducts.push(productTranslated)
                await delay(300);
              })
              var categoryTranslated = {name: await translate(category.name, {from: 'es', to: 'cat'}), img: category.img, id: category.id, products: translatedProducts}
              translatedMenu.push(categoryTranslated)
              translatedProducts = []
              if (index === array.length -1){await delay(1000); resolve()}
            })            
          })
          translating.then(() => {
            res.render("menu", {status:true, menu : translatedMenu, color: result[0].color, font: result[0].font, titleMenu: titleTranslated})
            db.close()
            return    
          })  
          return      
        }
        if(lang == "eng"){
          translate.engine = "google"
          translate.key = "AIzaSyCUjkH_o3ew3hiatWtOlYME8bB-a2jiRO8"
          const titleTranslated = await translate(result[0].titleMenu, {from: 'es', to: 'en'});
          var translatedMenu = []
          var translatedProducts = []
          var translating = new Promise((resolve, reject) => {
            result[0].menu.forEach(async (category, index, array) => {
              category.products.forEach(async (product) => {
                var productTranslated = {name: await translate(product.name, {from: 'es', to: 'en'}), price: product.price, img: product.img, productId: product.productId}
                translatedProducts.push(productTranslated)
                await delay(300);
              })
              var categoryTranslated = {name: await translate(category.name, {from: 'es', to: 'en'}), img: category.img, id: category.id, products: translatedProducts}
              translatedMenu.push(categoryTranslated)
              translatedProducts = []
              if (index === array.length -1){await delay(800); resolve()}
            })            
          })
          translating.then(() => {
            res.render("menu", {status:true, menu : translatedMenu, color: result[0].color, font: result[0].font, titleMenu: titleTranslated})
            db.close()
            return    
          })
          return
        }
        if(lang == "fr"){
          translate.engine = "google"
          translate.key = "AIzaSyCUjkH_o3ew3hiatWtOlYME8bB-a2jiRO8"
          const titleTranslated = await translate(result[0].titleMenu, {from: 'es', to: 'fr'});
          var translatedMenu = []
          var translatedProducts = []
          var translating = new Promise((resolve, reject) => {
            result[0].menu.forEach(async (category, index, array) => {
              category.products.forEach(async (product) => {
                var productTranslated = {name: await translate(product.name, {from: 'es', to: 'fr'}), price: product.price, img: product.img, productId: product.productId}
                translatedProducts.push(productTranslated)
                await delay(300);
              })
              var categoryTranslated = {name: await translate(category.name, {from: 'es', to: 'fr'}), img: category.img, id: category.id, products: translatedProducts}
              translatedMenu.push(categoryTranslated)
              translatedProducts = []
              if (index === array.length -1){await delay(1000); resolve()}
            })            
          })
          translating.then(() => {
            res.render("menu", {status:true, menu : translatedMenu, color: result[0].color, font: result[0].font, titleMenu: titleTranslated})
            db.close()
            return    
          })  
          return      
        }
      }
      res.render("menu", {status:false, err: "Este restaurante no existe"})
      db.close()
    })
  })

})
app.post("/app/search", (req, res) => {
  var query  = req.body.query.toString()
  const projection = {
    _id: 0,
    title: 1,
    address: 1,
    name: 1,
    profile_pic: 1,
    url: 1,
    pricerange: 1
  };
  MongoClient.connect(url, function(err, db) {
    if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."}); return}
    var dbo = db.db("mioes");
    dbo.collection("adminUsers").find({$text:{$search: query}}).project(projection).toArray(function(err, result) {
      if (err){res.json({status:false, err:"Algo ha ido mal. Vuelvelo a intentar"}); return}
      var searchResults = []
      console.log(result)
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
      if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a intentarlo"}); return}
      var dbo = db.db("mioes");
      dbo.collection("adminUsers").find(query).toArray(function(err, result) {
        if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a intentarlo"}); return}
        res.render("restaurant", {restaurant_of_the_week: {"status": true,name: result[0].name, address: result[0].address, rating: result[0].rating ,img: result[0].profile_pic, info: result[0].info, food: result[0].food, chef: result[0].chef ,pricerange: result[0].pricerange ,long: result[0].longitude, lat: result[0].latitude, menuElements: result[0].menuElements, menuCategories: result[0].menuCategories}})
        db.close();
      });
    }); 
  })
  app.get("/r/:restaurant", (req, res) => {
    const restaurantName = req.params.restaurant.toString().toLowerCase()
    var query = {id: restaurantName}
    console.log(query)
    MongoClient.connect(url, function(err, db){
      if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a intentarlo"}); return}
      var dbo = db.db("mioes");
      dbo.collection("adminUsers").find(query).toArray(function(err, result) {
        if (err){res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a intentarlo"}); return}
        if(result.length < 1){
          res.json({status:false, err: null})
          return
        }
        var url = `/menu/chooselanguage?r=${result[0].id}`
        fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${result[0].name}&sensor=true&key=AIzaSyDfBMjWMG1GbWaOTJR56Ji62aDy-lfANzg`).then((r) => r.json()).then((reviews) => {
            res.render("restaurant", {link: url, restaurant_of_the_week: {"status": true, name: result[0].name,insta: result[0].instagram, face: result[0].facebook, phone: result[0].phone, color: result[0].color, address: result[0].address, rating: reviews.results[0].rating ,img: result[0].profile_pic, info: result[0].info, food: result[0].food, chef: result[0].chef ,pricerange: result[0].pricerange ,long: result[0].longitude, lat: result[0].latitude, menuElements: result[0].menuElements, menuCategories: result[0].menuCategories}})        
            db.close()    
          })
      })

    })
  })
  app.get("/admin/session/menu", (req, res) => {
    if(req.session.loggedin != true){res.json({state:false, err: "Inicia sesión para hacer esto"}); return}
    const query = {_id: ObjectId(req.session.restaurantId.toString())}
    MongoClient.connect(url, function(err, db){
      if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
      var dbo = db.db("mioes")
      dbo.collection("adminUsers").find(query).toArray((err, result) => {
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
        if(result.length > 0){
          res.json({status:true, menu : result[0].menu, color: result[0].menuColor, font: result[0].font, titleMenu: result[0].titleMenu})
          db.close()
          return
        }
        res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde"})
        db.close()
      })
    })
  })
  app.post("/admin/session/menu/editcategory", (req, res) => {
    if(req.session.loggedin != true){
      res.json({status:false, err: "Porfavor inicia sesión"})
      return
    }
    const name = req.body.name.toString()
    const oldName = req.body.oldName.toString()
    const query = {_id: ObjectId(req.session.restaurantId.toString()), "menu.name": oldName}
    MongoClient.connect(url, function(err, db){
      if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
      var dbo = db.db("mioes")
      dbo.collection("adminUsers").updateOne(query, {$set: {"menu.$.name": name}}, function(err, result){
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
        res.send({status:true})
      })
    })
  })
  app.post("/admin/session/menu/editproduct", (req, res) => {
    if(req.session.loggedin != true){
      res.json({status:false, err: "Porfavor inicia sesión"})
      return
    }
    var img;
    try{var img = req.files.img}catch(err){
      var img = req.body.img
    };
    const name = req.body.oldTitle.toString()
    const newName = req.body.title.toString()
    const productId = req.body.productId.toString()
    const category = req.body.category.toString()
    const newPrice = req.body.price
    if(typeof img == "string"){
      const query = {_id: ObjectId(req.session.restaurantId.toString()), "menu.name": category}
      MongoClient.connect(url, function(err, db){
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde (26)"}); return}
        var dbo = db.db("mioes")
        dbo.collection("adminUsers").updateOne(query, {$pull:{"menu.$.products":{name: name}}}, function(err, result){
          if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
          if(result.modifiedCount == 1){
            dbo.collection("adminUsers").updateOne(query, {$push:{"menu.$.products":{name: newName, price: newPrice, img: img, productId: productId}}}, function(err, result){
              if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde (20)" + err});db.close();return}
              if(result.acknowledged == true){
                res.json({status:true})
                db.close()
                return
              }
              res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde"})
              db.close()
            })
            return
          }
          res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde"})
          db.close()
        })  
      })
      return
    }
    try{
      var randomString = makeid(5)
      var dir = `./client/images/menu/products`
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, {recursive: true});
      }
      img.mv(dir +"/"+ `product${randomString}.png`);
      var completePath = `/images/menu/products/` + `product${randomString}.png`
    } catch(err){
      res.json({status:false})
    }
    const query = {_id: ObjectId(req.session.restaurantId.toString()), "menu.name": category}
    MongoClient.connect(url, function(err, db){
      if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
      var dbo = db.db("mioes")
      dbo.collection("adminUsers").find(query).toArray(function(err, result){
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
        result[0].menu.forEach((category) => {
          category.products.forEach((product) => {
            if(product.name == name){
              fs.unlinkSync(`client${product.img}`)
            }
          })
        })
        dbo.collection("adminUsers").updateOne(query, {$pull:{"menu.$.products":{name: name}}}, function(err, result){
          if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
          if(result.modifiedCount == 1){
            dbo.collection("adminUsers").updateOne(query, {$push:{"menu.$.products":{name: newName, price: newPrice, img: completePath, productId: productId}}}, function(err, result){
              if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
              if(result.acknowledged == true){
                res.json({status:true})
                db.close()
                return
              }
              res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde"})
              db.close()
            })    
          }
        })
      })
    })


  })
  app.post("/admin/session/menu/updatecolor", (req, res) => {
    const color = req.body.color
    if(req.session.loggedin != true){
      res.json({status:false, err: "Porfavor inicia sesión"})
      return
    }  
    const query = {_id: ObjectId(req.session.restaurantId.toString())}
    MongoClient.connect(url, function(err, db){
      if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
      var dbo = db.db("mioes")
      dbo.collection("adminUsers").updateOne(query, {$set:{menuColor: color}}, function(err, result){
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
        if(result.modifiedCount == 1){
          res.json({status:true})
          db.close()
          return
        }
        res.json({status:true})
        db.close()
      })
    })
  })
  app.post("/admin/session/menu/updatefont", (req,res) => {
    const font = req.body.font
    if(req.session.loggedin != true){
      res.json({status:false, err: "Porfavor inicia sesión"})
      return
    }  
    const query = {_id: ObjectId(req.session.restaurantId.toString())}
    MongoClient.connect(url, function(err, db){
      if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
      var dbo = db.db("mioes")
      dbo.collection("adminUsers").updateOne(query, {$set:{font: font}}, function(err, result){
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
        if(result.modifiedCount == 1){
          res.json({status:true})
          db.close()
          return
        }
        res.json({status:true})
        db.close()
      })
    })
  })
  app.post("/admin/session/menu/deleteproduct", (req, res) => {
    const name = req.body.name
    console.log(name)
    if(req.session.loggedin != true){
      res.json({status:false, err: "Porfavor inicia sesión"})
      return
    }  
    const query = {_id: ObjectId(req.session.restaurantId.toString()), "menu.name": req.body.category}
    MongoClient.connect(url, function(err, db){
      if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
      var dbo = db.db("mioes")
      dbo.collection("adminUsers").find(query).toArray((err, result) => {
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
        if(result.length == 0){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
        result[0].menu.forEach((category) => {
          category.products.forEach((product) => {
            if(product.name == name){
              try{
                fs.unlinkSync(`./client${product.img}`)
              }catch(e){
                res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return
              }
              dbo.collection("adminUsers").updateOne(query, {$pull:{"menu.$.products":{name: name}}}, function(err, result){
                if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
                console.log(result)
                if(result.modifiedCount == 1){
                  res.json({status:true})
                  db.close()
                  return
                }
                res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde"})
                db.close()
              })
            }
          })
        })
      })
    })
  })
  app.post("/admin/session/menu/newcategory", (req, res) => {
    if(req.session.loggedin != true){
      res.json({status:false, err: "Porfavor inicia sesión"})
      return
    }
    try{
      let img = req.files.img;
      var randomString = makeid(5)  
      var dir = `./client/images/menu/categories`
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, {recursive: true});
      }
      img.mv(dir +"/"+ `category${randomString}.png`);
      var completePath = `/images/menu/categories/` + `category${randomString}.png`
    } catch(err){
      res.json({status:false})
    }
    const query = {_id: ObjectId(req.session.restaurantId.toString())}
    MongoClient.connect(url, function(err, db){
      if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
      var dbo = db.db("mioes")
      dbo.collection("adminUsers").updateOne(query, {$push: {menu: {name: req.body.categoryName, img: completePath, id: req.body.categoryName.toString().toLowerCase().replace(/\s+/g, '') , products: []}}}, function(err, result){
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
        if(result.length > 0){
          res.json({status:true, menu : result[0].menu})
          db.close()
          return
        }
        res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde"})
        db.close()
      })
    })
  })
  app.post("/admin/session/menu/newproduct", (req, res) => {
    if(req.session.loggedin != true){
      res.json({status:false, err: "Porfavor inicia sesión"})
      return
    }
    let img = req.files.img;
    var randomString = makeid(5)
    try{
      var dir = `./client/images/menu/products`
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, {recursive: true});
      }
      img.mv(dir +"/"+ `product${randomString}.png`);
      var completePath = `/images/menu/products/` + `product${randomString}.png`
    } catch(err){
      console.log(err)
      res.json({status:false})
    }
    var name = String(req.body.name.toString())
    const query = {_id: ObjectId(req.session.restaurantId.toString()), "menu.name": req.body.category}
    MongoClient.connect(url, function(err, db){
      if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
      var dbo = db.db("mioes")
      dbo.collection("adminUsers").updateOne(query, {$push:{"menu.$.products":{name: name, price: req.body.price, img: completePath, productId: makeid(10)}}}, function(err, result){
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();return}
        if(result.acknowledged == true){
          res.json({status:true})
          db.close()
          return
        }
        res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde"})
        db.close()
      })
    })

  })
  app.post("/admin/session/menu/updatetitle", (req, res) => {
    if(req.session.loggedin != true){
      res.json({status:false, err: "Porfavor inicia sesión"})
      return
    }
    const title = req.body.newTitle.toString()
    const query = {_id: ObjectId(req.session.restaurantId.toString())}
    MongoClient.connect(url, function(err, db){
      if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde (76)"}); return}
      var dbo = db.db("mioes")
      dbo.collection("adminUsers").updateOne(query, {$set:{titleMenu: title}}, function(err, result){
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde (982)"});db.close();return}
        console.log(result)
        if(result.modifiedCount == 1){
          res.json({status:true})
          db.close()
          return
        }
        res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde (10)" + JSON.stringify(result)})
        db.close()
      })
    })


  })
  app.post("/menu/products", (req,res) => {
      var category = req.body.category
      var products;
      const query = {_id: ObjectId(req.session.restaurantId.toString()), "menu.id": category}
      MongoClient.connect(url, function(err, db){
        if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."}); return}
        var dbo = db.db("mioes")
        dbo.collection("adminUsers").find(query).toArray(function(err, result){
          if(err){res.json({status:false, err: "Algo ha ido mal, porfavor intentalo más tarde."});db.close();console.log(err);return}
          if(result.length > 0){
            result[0].menu.forEach((cat) => {
              if(cat.id == category){
                products = cat.products
              }
            })
            if(products.length < 1){
              res.json({status:false, err: "No hay productos"})
              db.close()
              return;
            }  
            res.json({status:true, products: products})
            db.close()
            return
          }
          res.json({status:false, err: "Esta categoría no contiene ningún producto."});
          db.close();
          return
        })
      })
  
  })
app.get("/admin/restaurant", (req, res) => {
  if(req.session.loggedin != true){res.json({status:false}); return}
    const id = req.session.restaurantId
    var query = {_id: ObjectId(id.toString())}
    MongoClient.connect(url, function(err, db) {
        if (err){res.json({status:false, err:"Algo no ha ido bien, vuelvelo a intentar en unos momentos porfavor"}); return}
        var dbo = db.db("mioes");
        dbo.collection("adminUsers").find(query).toArray(function(err, result) {
          if (err){res.json({status:false, err:"Algo no ha ido bien, vuelvelo a intentar en unos momentos porfavor"}); return}
          if(result.length > 0){
            res.json({"status": true, name: result[0].name, address: result[0].address, rating: result[0].rating ,img: result[0].img,insta: result[0].instagram, face: result[0].facebook, phone: result[0].phone, info: result[0].info, food: result[0].food, chef: result[0].chef ,pricerange: result[0].pricerange ,long: result[0].longitude, lat: result[0].latitude, menuElements: result[0].menuElements, menuCategories: result[0].menuCategories, color: result[0].color})
            db.close()
            return
          }
          res.json({status: false})
          db.close();
        });
      }); 
    })
app.post("/admin/restaurant" ,(req, res) => {
  const sessionId = req.session.restaurantId
  var id = ObjectId(sessionId.toString())
  const data = {name: req.body.name ,address: req.body.address , pricerange: req.body.pricerange , chef: req.body.chef , food: req.body.food , info: req.body.description, instagram: req.body.instagram, facebook: req.body.facebook, phone:req.body.telf, color: req.body.color}
  MongoClient.connect(url, function(err, db) {
      if (err){res.json({status:false, err:"Algo no ha ido bien, vuelvelo a intentar en unos momentos porfavor"}); return}
      var dbo = db.db("mioes");
      dbo.collection("adminUsers").updateOne({_id: id}, {$set: data}, function(err, result) {
        if (err){res.json({status:false, err:"Algo no ha ido bien, vuelvelo a intentar en unos momentos porfavor"}); return}
        if(result.acknowledged == true){
          res.json({status:true})
          db.close()
          return
        }
        res.json({status: false})
        db.close();
      });
    }); 
  })
  app.get("/session", (req, res) => {
    if(req.session.loggedin != true){res.json({loggedin:false});return}
    res.json({loggedin: true, img: req.session.restaurantProfilePic , name: req.session.restaurantName , user: req.session.user})
  })
  app.get("/admin/session/id", (req, res) => {
    if(req.session.loggedin != true){res.json({status:false}); return}
    var url = req.session.link
    res.json({status:true, id: url, url: url})
  })
  app.get("/admin/session/logout", (req, res) => {
    try{
      req.session.destroy()
      res.redirect("/")
    }catch(e){
      res.redirect("/")
    }
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
            req.session.restaurantProfilePic = result[0].profile_pic
            req.session.user = result[0].username
            res.json({status:true, msg: "Sesión iniciada con éxito!", code: 44})
            db.close()
            return;
          }
          //implement 2fa? login succesful.
          req.session.restaurantId = result[0]._id
          req.session.restaurantName = result[0].name
          req.session.link =`${result[0].url}`
          req.session.restaurantProfilePic = result[0].profile_pic
          req.session.loggedin = true
          req.session.user = result[0].username
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
  var url1 = name.toString().toLowerCase()
  var link = url1.replace(/\s/g, '')
  MongoClient.connect(url, function(err, db) {
    if (err){console.log(err);res.json({status:false, err:"Algo no ha ido bien."}); return}
      if (err) throw err;
      var dbo = db.db("mioes");
      var id = name.toLowerCase().replace(/\s/g, '')
      var profileData = {name: name, id: id, titleMenu: name ,address: address, profile_pic: completePath, accountSetUpCompleted: true, rating: 5, url: `https://mioes.app/r/${link.toString()}`}
      dbo.collection("adminUsers").find({id:id}).toArray((err, result) => {
        if(err){res.json({status :false, err:"Algo ha ido mal, vuelvelo a intentar más tarde."}); return}
        if(result.length == 0){
          dbo.collection("adminUsers").updateOne({_id: ObjectId(req.session.restaurantId)}, {$set: profileData}, function(err, result) {
            if (err){res.json({status:false, err:"Ha habido un error."}); return}
            if(result.acknowledged == true){
              req.session.restaurantName = name.toString()
              req.session.restaurantProfilePic = completePath
              req.session.link = `https://mioes.app/r/${link.toString()}`
              res.send({status: true, msg:"¡Perfil configurado con éxito!"});
              return
            }
            else{
              res.send({status: false, msg:"Algo ha ido mal. Porfavor, vuelvelo a intentar en unos instantes"});
            }
            db.close()
        })
        return
        }
        res.json({status:false, err:"Ya existe un restaurante con este nombre, porfavor inicia sesión o corrige el nombre"})
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
          var postsArray = []
          try{
          result.forEach((post) => {
            postsArray.push({url:post.url, "status": true, id: post.id, profile_pic: post.profile_pic ,author: post.author, img: post.img, body:post.body, video: post.video, title: post.title, date: post.date, rating: post.rating, stars: post.stars})
          })
          res.json({posts: postsArray})
          db.close();
        }catch(e){
          res.json({status:false})
          db.close()
        }
        });
      });   

  })
  app.post("/posts/following", (req, res) => {
    const following = JSON.parse(req.body.following)
    if(following.length == 0){
      res.json({posts: []})
      return
    }
    var searchFollowing = new Promise((resolve, reject) => {
      following.forEach((restaurant) => {
        MongoClient.connect(url, function(err, db) {
          if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
            if (err) throw err;
            var dbo = db.db("mioes");
            dbo.collection("posts").find({author: restaurant}).toArray(function(err, result) {
              if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
              var arr = [];
              var postsArray = []
              try{
              result.forEach((post) => {
                postsArray.push({url:post.url, "status": true, id: post.id, profile_pic: post.profile_pic ,author: post.author, img: post.img, body:post.body, title: post.title, date: post.date, rating: post.rating, stars: post.stars})
              })
              db.close();
              resolve(postsArray)
            }catch(e){
              reject(e)
            }
            });
          });   
      })
    })
    searchFollowing.then((e) => {res.json({posts: e})}, (error) => {res.json({status:false})})
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
            if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
            if(result.length > 0){
              res.json({status:false, err:"Este email ya esta en uso."}); 
              db.close()
              return;
            }
            dbo.collection("adminUsers").find({username: u}).toArray(function(err, result){
              if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
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
              msg: 'No file uploaded'
          });
      } else {
        if(req.body.video){
          res.json({status:true})
          let vid = req.files.postVideo
          var randomString = makeid(5)
          try{
            var dir = `./client/media/social/${req.session.restaurantName.toLowerCase().replace(/\s/g, '')}-posts`
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, {recursive: true});
            }
            vid.mv(dir +"/"+ `post${randomString}.mp4`);
            var completePathToSave = `/media/social/${req.session.restaurantName.toLowerCase().replace(/\s/g, '')}-posts`+ "/" + `post${randomString}-e.mp4`
            var completePath = `./client/media/social/${req.session.restaurantName.toLowerCase().replace(/\s/g, '')}-posts`+ "/" + `post${randomString}.mp4`
            var completePathCompressed = `./client/media/social/${req.session.restaurantName.toLowerCase().replace(/\s/g, '')}-posts`+ "/" + `post${randomString}-e.mp4`
            function command (input, output, bitrate) {
              return new Promise((resolve, reject) => {
                ffmpeg(input)
                  .outputOptions(['-c:v libx264', `-b:v ${bitrate}k`, '-c:a aac', '-b:a 58k'])
                  .output(output)
                  .on('start', (command) => {
                    console.log('TCL: command -> command', command)
                  })
                  .on('error', (error) => reject(error))
                  .on('end', () => resolve())
                  .run()
              })
            }
            function whatBitrate (bytes) {
              const ONE_MB = 1000000
              const BIT = 28 // i found that 28 are good point fell free to change it as you feel right
              const diff = Math.floor(bytes / ONE_MB)
              if (diff < 5) {
                return 128
              } else {
                return Math.floor(diff * BIT * 1.1)
              }
            }
            function metadata (path) {
              return new Promise((resolve, reject) => {
                ffmpeg.ffprobe(path, (err, metadata) => {
                  if (err) {
                    reject(err)
                  }
                  resolve(metadata)
                })
              })
            }
            async function compress () {
              const outputPath = completePathCompressed
              const inputMetadata = await metadata(completePath)
              const bitrate = whatBitrate(inputMetadata.format.size)
              await command(completePath, outputPath, bitrate)
              const outputMetadata = await metadata(outputPath)
            
              return { old_size: inputMetadata.format.size, new_size: outputMetadata.format.size }
            }    
            compress().then(data => {
              fs.unlinkSync(completePath); 
              MongoClient.connect(url, function(err, db) {
                if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
                  if (err) throw err;
                  var dbo = db.db("mioes");
                  var date = new Date()
                  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                  dbo.collection("adminUsers").find({_id:ObjectId(req.session.restaurantId)}).toArray((err, result) => {
                    var postCreated = {url: `/r/${req.session.restaurantName.toLowerCase().replace(/\s/g, '')}` ,rating: "5", id: makeid(5), stars: "<i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i>", video: true, img: completePathToSave.toString(), profile_pic:result[0].profile_pic,title: req.body.title.toString(), body: req.body.msg.toString(), author: req.session.restaurantName, date: date.toLocaleDateString('es-ES', options)}
                    dbo.collection("posts").insertOne(postCreated, function(err, result) {
                      if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
                      if(result.acknowledged == true){
                        io.emit("update", {progress: 100});
                      }
                      else{
                        io.emit("update", {progress: 0, status: false});
                      }
                      db.close()
                    })
                  })
                })
      
            }).catch(err => io.emit("update", {progress: 0, status: false}))
          } catch(err){
            res.json({status:false})
          }
        return
        
        }
          let img = req.files.postImage;
          var randomString = makeid(5)
          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          try{
          var dir = `./client/images/social/${req.session.restaurantName.toLowerCase().replace(/\s/g, '')}-posts`
          if (!fs.existsSync(dir)){
              fs.mkdirSync(dir, {recursive: true});
          }
          img.mv(dir +"/"+ `post${randomString}.png`);
          var completePath = `/images/social/${req.session.restaurantName.toLowerCase().replace(/\s/g, '')}-posts`+ "/" + `post${randomString}.png`
        } catch(err){
          console.log(err)
        }
        MongoClient.connect(url, function(err, db) {
          if (err){res.json({status:false, err:"Algo no ha ido bien."}); return}
            if (err) throw err;
            var dbo = db.db("mioes");
            var date = new Date()
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dbo.collection("adminUsers").find({_id:ObjectId(req.session.restaurantId)}).toArray((err, result) => {
              var postCreated = {url: `/r/${req.session.restaurantName.toLowerCase().replace(/\s/g, '')}` ,video: false,rating: "5", id: makeid(5), stars: "<i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i><i class='color-theme opacity-60 fa fa-star font-12 pe-1'></i>", img: completePath.toString(), profile_pic:result[0].profile_pic,title: req.body.title.toString(), body: req.body.msg.toString(), author: req.session.restaurantName, date: date.toLocaleDateString('es-ES', options)}
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
          })
          }
  } catch (err) {
      res.json({status:false, err:"Algo ha ido mal. Vuelvelo a provar en unos momentos porfavor"});
  }
  })
app.get("/*", (req, res) => {
    res.redirect(404, "/")
})

httpServer.listen(80)