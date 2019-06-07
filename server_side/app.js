const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const Build = require('./models/build');

const app = express();

mongoose.connect('mongodb+srv://ankita:GBBKt3ypvfaq1vcS@cluster0-6lrx2.mongodb.net/build-catalogue?retryWrites=true&w=majority', {useNewUrlParser: true })
  .then(() => {
    console.log("Database connection successful!");
  })
  .catch(() => {
    console.log("Database connection failed...");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use('/images', express.static(path.join("server_side/images")));

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid) {
      error = null;
    }
    cb(null, "server_side/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.post('/api/builds', (req, res, next) => {
  const build = new Build({
    id: req.body.id,
    mapId: req.body.mapId,
    containerId: req.body.containerId,
    countryCode: req.body.countryCode,
    name: req.body.name,
    intelligence: req.body.intelligence,
    power: req.body.power,
    defense: req.body.defense,
    mobility: req.body.mobility,
    health: req.body.health,
    stealth: req.body.stealth,
    tier: req.body.tier,
    location: req.body.location,
    facts: req.body.facts,
    image: req.body.image
  });
  build.save().then(addedBuild => {
    res.status(201).json({
      message: 'Build added successfully!',
      buildId: addedBuild._id
    });
  });
});

app.get('/api/builds',(req, res, next) => {
  Build.find().then(documents => {
    res.status(200).json({
      message: "Builds fetched successfully!",
      builds: documents
    });
  });

});

app.get('/api/builds/:id',(req, res, next) => {
  Build.findById({_id: req.params.id}).then(documents => {
    console.log(documents);
    res.status(200).json({
      message: "Builds fetched successfully!",
      builds: [documents]
    });
  });

});

app.put('/api/builds/:id', (req, res, next) => {
  const build = new Build({
    _id: req.body.id,
    mapId: req.body.mapId,
    containerId: req.body.containerId,
    countryCode: req.body.countryCode,
    name: req.body.name,
    intelligence: req.body.intelligence,
    power: req.body.power,
    defense: req.body.defense,
    mobility: req.body.mobility,
    health: req.body.health,
    stealth: req.body.stealth,
    tier: req.body.tier,
    location: req.body.location,
    facts: req.body.facts,
    image: req.body.image
  });

  Build.updateOne({_id: req.params.id}, build).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Fact Added!"
    });
  });
})

app.patch('/api/builds/images/:id', multer({storage: storage}).single("buildImage") ,(req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log(req.body);

  Build.findOneAndUpdate({_id: req.params.id}, { image: url + "/images/" + req.file.filename}).then(result => {
    //result.image = url + "/images/" + req.file.filename;
    console.log(result);
    res.status(200).json({
      message: "Image Added!"
    });
  });
})

app.delete('/api/builds/:id', (req, res, next) => {
  Build.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Build deleted successfully!"
    });
  });

});

module.exports = app;
