const express = require("express");
const app = express();

//npm modules
const cookieParser = require('cookie-parser');

const fs = require("fs");
const multer = require("multer");
const upload = multer({dest: "uploads/"});

//my modules
const pool = require('./database');
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

app.post('/uploadcsv', upload.single("exercise"), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).send("No file uploaded");
        
        const file = fs.readFileSync(req.file.path);

        const user = JSON.parse(req.body.user);
        const key = `test/${user.exercisename}_${Date.now()}.csv`;

        const result = await pool.query(
            `INSERT INTO biml.exercises(s3_key, patient_id, name)
            VALUES ($1, $2, $3)`, [key, user.pid, user.exercisename]
        );

        await s3.putObject({
            Body: file,
            Bucket: "biml-bucket",
            Key: key,
            ContentType: 'text/csv'
        }).promise();

        fs.unlinkSync(req.file.path);

        console.log("successful..?");

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// app.post('/uploadcsv', async (req, res) => {
//     try {
//         console.log('Current working directory:', process.cwd());
//         const file = fs.readFileSync("/app/Test_Squat_Correct_Format.csv");

//         await s3.putObject({
//             Body: file,
//             Bucket: "biml-bucket",
//             Key: "test/ianTest.csv",
//             ContentType: 'text/csv'
//         }).promise();

//         console.log("successful..?");

//         res.sendStatus(200);
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(500);
//     }
// });

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