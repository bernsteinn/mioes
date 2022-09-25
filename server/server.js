const express = require("express")
const app = express()
const url = "mongodb://mongo-db.mioes.app:5454/"
const cors = require("cors")
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require("mongodb").ObjectId
app.use(express.static(__dirname + "/static"))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(cors())

app.get("/" , (req, res) => {
    res.render("index")
})
app.post("/qr-results", (req, res) => {
    try{ var qrResult = Buffer.from(req.body.data, "base64")} catch (e){res.json({status:false, err: "Algo ha ido mal. Vuelve a escanear el QR porfavor."}); return}
    const qrResultToJson = JSON.parse(qrResult.toString());
    var query = {_id: ObjectId(qrResultToJson.restaurantId.toString())}
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mioes");
        dbo.collection("restaurants").find(query).toArray(function(err, result) {
          if (err) res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."})
          console.log(result);
          res.json({"status": true, name: result[0].name, address: result[0].address, img: result[0].img, description: result[0].description, tipo: result[0].tipo})
          db.close();
        });
      }); 
    })

    app.post("/search", (req, res) => {
      const restaurantId = req.body.restaurantId
      var query = {_id: ObjectId(restaurantId.toString())}
      MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("mioes");
          dbo.collection("restaurants").find(query).toArray(function(err, result) {
            if (err) res.json({status:false, err:"Algo no ha ido bien, por favor, vuelve a escanear el código QR."})
            console.log(result);
            res.json({"status": true, name: result[0].name, address: result[0].address, img: result[0].img, description: result[0].description, tipo: result[0].tipo})
            db.close();
          });
        });   
    })

app.get("/*", (req, res) => {
    res.redirect("/")
})

app.listen(80)