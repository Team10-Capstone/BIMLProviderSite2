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
const { s3, archiver } = require('./s3');


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

//uploads file given to s3 and links up with patient id given in database
//does not require authentication (yet)
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

//gets all exercises associated with patient id given in zip file
//requires authentication
app.get('/exercises/:pid', auth.authenticateToken, async (req, res) => {
    const patientId = req.params.pid;

    const zipStream = archiver('zip', { zlib: {level: 9} });
    res.attachment('exercises.zip');
    zipStream.pipe(res);

    try {
        const result = await pool.query(
            `SELECT biml.exercises.s3_key
            FROM biml.exercises
            WHERE patient_id = $1`, [patientId]
        );

        if (result.rows.length > 0) {
            for (const row of result.rows) {
                const fileStream = s3.getObject({
                    Bucket: 'biml-bucket',
                    Key: row.s3_key
                }).createReadStream();

                zipStream.append(fileStream, { name: row.s3_key });
            }
            zipStream.finalize();
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/exercises/list/:pid', auth.authenticateToken, async (req, res) => {
    const patientId = req.params.pid;

    try {
        const result = await pool.query(
            `SELECT s3_key
            FROM biml.exercises
            WHERE patient_id = $1`, [patientId]
        );

        if (result.rows.length > 0) {
            const list = result.rows.map(row => {
                filename = row.s3_key.split('/').pop()
                const [ key, dateString ] = filename.split('_');
                return { key, date: new Date(parseInt(dateString)) };
            });

            res.status(200).json(list);
        } else
            res.sendStatus(404)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

//downloads image from s3, later will replace with deliverable for unity app
//requires authentication
app.get('/app/download', auth.authenticateToken, (req, res) => {
    try {
        const perms = {
            Bucket: 'biml-bucket',
            Key: 'test/meow.jpg',
            Expires: 60,
            ResponseCacheControl: 'no-cache',
            ResponseContentDisposition: 'attachment; filename="yahoooo.jpg"'
        };

        s3.getSignedUrl('getObject', perms, (err, url) => {
            if (err)
                return res.status(500).send('Error generating pre-signed URL');
            res.json({ url });
        });
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