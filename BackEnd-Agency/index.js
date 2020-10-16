const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0oz1r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const port = 50001;

app.get('/',(req,res)=>{
    res.send('i m shakil')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("agencyStore").collection("service");
  const orderCollection = client.db("agencyStore").collection("orderService");
  const reviewCollection = client.db("agencyStore").collection("review");
  const adminCollection = client.db("agencyStore").collection("admin");
  console.log('data base connectservice');

  // add service
  app.post('/addService',(req,res)=>{
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    console.log(title,file,description);
          
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    const image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };
    serviceCollection.insertOne({title, description, image})
    .then(result => {
        res.send(result.insertedCount > 0);
    })
})
//get service
app.get('/services', (req, res) => {
    serviceCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
// add admin
app.post('/addAdmin',(req,res)=>{
    const addAdmin=req.body;
    adminCollection.insertOne(addAdmin)
    .then(result => {
      res.send(result.insertedCount > 0)
  })
})
app.get('/admin', (req,res) => {
    const userEmail=req.query.email;
    adminCollection.find({email:userEmail})
        .toArray((err, documents) => {
            res.send(documents);
        })
       
})
  //order service
  app.post('/orderService',(req,res)=>{
      const orderservice=req.body;
      orderCollection.insertOne(orderservice)
      .then(result => {
        res.send(result.insertedCount > 0)
    })
  })
  //get user single service
  app.get('/singleService',(req, res) => {
      const userEmail=req.query.email;
      console.log(userEmail)
    orderCollection.find({Email:userEmail})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
     
  //user service
  app.get('/userService', (req, res) => {
    orderCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
       
})
 //add review
app.post('/addreview',(req,res)=>{
    const userReview=req.body;
    console.log(userReview);
    reviewCollection.insertOne(userReview)
    .then(result => {
      res.send(result.insertedCount > 0)
      console.log(result.insertedCount);
  })
})
//user review
app.get('/userReview', (req, res) => {
    reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
//   client.close();
});








app.listen(process.env.PORT || port)

//shakil agency project