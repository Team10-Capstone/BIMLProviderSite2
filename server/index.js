const express = require("express");
const app = express();

//npm modules
const cookieParser = require('cookie-parser');
const multer = require("multer");
const upload = multer({dest: "uploads/"});

//my modules
const auth = require('./auth');
const graves = require('./graveyard');
const s3 = require('./s3');


require("dotenv").config({ path: '../.env' });

//ensures only receiving requests from client server via .env file
const cors = require("cors");
const corsOptions = {
    origin: [process.env.CORS_ORIGIN],
    credentials: true
};

//applies above options
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//graveyard endpoints
app.get('/therapists/patients/:id', graves.getPatientsByTherapistId)
app.get('/patient/:id', graves.getPatientById);
app.get('/patient/recordings/:id', graves.getPatientRecordingsById);
app.get('/patients', graves.getPatients);
app.get('/patients/names', graves.getPatientNames);
app.post('/tests3', graves.testS3);

//auth endpoints
app.post('/users/register', auth.userRegistration);
app.post('/users/login', auth.userLogin);
app.post('/users/token', auth.userRefreshToken);
app.delete('/users/logout', auth.userLogout);
app.get('/users/check', auth.userCheckToken);

//s3 endpoints
app.post('/uploadcsv', auth.authenticateToken, upload.single("exercise"), s3.uploadCSV);
app.get('/app/download', auth.authenticateToken, s3.downloadApp);
app.get('/exercises', auth.authenticateToken, s3.downloadExercises);
app.get('/exercise/*', auth.authenticateToken, s3.downloadExercise)
app.get('/exercises/list', auth.authenticateToken, s3.getExercises)

//for testing purposes
const users = [
    {
        email: 'meow@gmail.com'
    },
    {
        email: 'RAWR@gmail.com'
    }
]

//for to test authenticateToken middleware
app.post('/users/login/test', auth.authenticateToken, (req, res) => {
    //req.user is given to us from middleware, which is the payload (user from database) extracted
    //from the token
    res.json(users.filter(user => user.email === req.user.useremail));
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server started on port " + `${port}`);
});