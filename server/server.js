const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const bodyparser = require('body-parser');
const path = require('path');
const connectDB = require('./server/database/connection');
// const csv = require("csvtojson"); 
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const authenticateToken = require('./server/middleware/authenticateToken');

const app = express();

app.use(express.json()); // to parse json data
app.use(cookieParser()); // to parse cookies
app.use(cors({ // to allow cross-origin requests
    origin: 'http://localhost:3000',
    credentials: true, // Enable credentials (cookies)
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}))


dotenv.config({ path: 'config.env' });
PORT = process.env.PORT || 8080;


app.use(morgan('tiny')); //print requests in terminal

connectDB();//connect to db

app.use(bodyparser.urlencoded({ extended: true })); // parse request to body-parser
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

app.set("view engine", "ejs") // dynamically render html pages with js logic


app.use('/css', express.static(path.resolve(__dirname, "public/css"))); //static css files
app.use('/js', express.static(path.resolve(__dirname, "public/js"))); //static js files


// load routers
app.use('/auth', require('./server/routes/authRoutes'));
app.use('/private', authenticateToken, require('./server/routes/privateRoutes'));
app.use('/', require('./server/routes/publicRoutes'));


app.get('/check-auth', (req, res) => {
    // console.log(req.user)
    // const token = req.cookies.token;
    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //     if (err) {
    //         return res.status(401).json({ message: 'Not Authenticated' });
    //     }
    //     return res.status(200).json({ message: 'Authenticated' });
    // });
    console.log(req.user)
    if(req.user){
        return res.status(200).json({ message: 'Authenticated' });
    }
    else{
        return res.status(401).json({ message: 'Not Authenticated' });
    }
});




// async function importData() {
//     await connectDB();
// csv()
//     .fromFile('airports.csv')
//     .then((jsonObj) => {
//         var army = [];
//         for (var i = 0; i < jsonObj.length; i++) {
//             var obj = {};
//             obj.airportId = jsonObj[i]['Airport ID'];
//             obj.name = jsonObj[i]['Name'];
//             obj.city = jsonObj[i]['City'];
//             obj.country = jsonObj[i]['Country'];
//             obj.iata = jsonObj[i]['IATA'];
//             obj.icao = jsonObj[i]['ICAO'];
//             army.push(obj);
//         }
//         airport.insertMany(army).then(function () {
//             console.log("Data inserted");
//         }).catch(function (error) {
//             console.log(error);
//         });
//     }).catch((error) => {
//         console.log(error);
//     })
// }
// importData();


app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
