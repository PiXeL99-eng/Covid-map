const express = require('express')
const app = express()
const port = 3000
const path = require('path')

//because fetch is not defined in Node.js, we have to npm i node-fetch
const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));

//body-parser is required to utilize the request.body data from the HTML form input
const bodyParser = require('body-parser')
const multer = require('multer');
const upload = multer();

//set my view engine to Embedded JS
app.set('view engine', 'ejs');

//load static assets
app.use('/public', express.static(path.join(__dirname, '/public')))

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 


app.get('/', (req, res) => {
  res.render('index', {title: 'Covid Map'})
})

app.get('/search', (req, res) => {
    res.render('search', {title: 'Covid Vaccination Status', array: []})
})

app.post('/search', (req, res) => {

    const d = new Date();
    let date = d.getDate() ;
    let month = d.getMonth() +1;
    let year = d.getFullYear();

    if(month<10){
        month = '0' + `${month}`
    }

    fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${req.body.search}&date=${date}-${month}-${year}`).then((response) => response.json()).then((data) => {res.render("search", {title: 'Covid Vaccination Status', array: data.sessions})})

})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})