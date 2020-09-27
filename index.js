const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;



const uri ="mongodb+srv://toufik6815:t0187755@cluster0.px7nq.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
    
})




client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  //Add
    app.get('/products', (req, res) => {
        productCollection.find({}) // .limit(2)
        .toArray((err, documents) => {
            res.send(documents);
        })
    });
  

    //Create Product
    app.post("/addProduct", (req, res) => {
      const product = req.body;
      productCollection.insertOne(product)
      .then(result =>{
          res.redirect('/');
      })
    });


    //Delete Product
    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result =>{
           res.send(result.deletedCount > 0);
        })
    });


    //Read Product
    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id)})
        .toArray((err, documents) =>{
            res.send(documents[0]);
        })
    });


    //Update Product
    app.patch('/update/:id', (req, res) => {
        console.log(req.body.price);
        productCollection.updateOne({ _id: ObjectId(req.params.id)}, 
        {
            $set: {price: req.body.price, quantity: req.body.quantity} 
        })

        .then(result =>{
             res.send(result.modifiedCount > 0);
        })
    })
});





 





app.listen(9000);
