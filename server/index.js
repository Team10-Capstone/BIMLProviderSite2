const express = require("express");
const pool = require('./database');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const AWS = require("aws-sdk");
const fs = require("fs");
const multer = require("multer");
const upload = multer({dest: "uploads/"});

require("dotenv").config({ path: '../.env' });

const port = process.env.PORT || 3000;

//ensures only receiving requests from client server via .env file
const cors = require("cors");
const corsOptions = {
    origin: [process.env.CORS_ORIGIN],
    credentials: true
};

const s3 = new AWS.S3();
//applies above options
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.post('/tests3', async (req, res) => {
    try {
        await s3.putObject({
            Body: "hello world",
            Bucket: "biml-bucket",
            Key: "test/my-file.txt"
        }).promise();
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

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

//gets players that the therapist services
//takes the therapist id parameter
//returns an array of players
// ***needs to be updated, using test schema***
app.get('/therapists/patients/:id', async (req, res) => {
    const theraId = req.params.id;
    try {
        const result = await pool.query(
            `SELECT test.tbl_players.*
             FROM therapists.tbl_therapists INNER JOIN test.tbl_players
             ON fld_t_id_pk = fld_t_id_fk
             WHERE fld_t_id_fk = $1`, [theraId]
        );

        if (result.rows.length > 0) {
            res.json(result.rows)
        } else {
            console.log("running query:", `SELECT test.tbl_players.*
             FROM therapists.tbl_therapists INNER JOIN test.tbl_players
             ON fld_t_id_fk = ${theraId}`)
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
})

//gets players name using player id
//takes the patient id as a parameter
//returns name of player with matching player id
// ***needs to be updated, using test schema***
app.get('/patient/:id', async (req, res) => {
    const patientId = req.params.id;

    try {
        const result = await pool.query(
            `SELECT * FROM test.tbl_players WHERE fld_p_id_pk = $1`,
            [patientId]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            console.log("Running query:", `SELECT fld_p_name 
                FROM test.tbl_players 
                HERE fld_p_id_pk = ${patientId}`);
            res.status(404).json({ error: "Patient not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

//gets a patients recordings
//takes the patient id as a parameter
//returns the patients recordings as an array
app.get('/patient/recordings/:id', async (req, res) => {
    const patientId = req.params.id;

    try {
        const result = await pool.query(
            `SELECT test.tbl_recordings.* 
             FROM test.tbl_recordings INNER JOIN test.tbl_players
	         ON fld_p_id_pk = fld_p_id_fk
             WHERE fld_p_id_pk = $1`, [patientId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows)
        } else {
            console.log("Running Query: ", `SELECT test.tbl_recordings.* 
                FROM test.tbl_recordings INNER JOIN test.tbl_players
                ON fld_p_id_pk = fld_p_id_fk
                WHERE fld_p_id_pk = ${patientId}`);
                res.status(404).json({ error: "Recordings not found"});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

//gets players from tbl_players
//returns array of players
// ***needs to be updated, using test schema***
app.get('/patients', async (req, res) => {

    try {
        const result = await pool.query(
            "SELECT * FROM test.tbl_players"
        );

        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({ error: "Players not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

//gets players names from tbl_players
//returns array of players names
// ***needs to be updated, using test schema***
app.get('/patients/names', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT fld_p_name FROM test.tbl_players"
        );

        const playerNames = result.rows.map(row => row.fld_p_name);

        if (result.rows.length > 0) {
            res.json(playerNames);
        } else {
            res.status(404).json({ error: "Players not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

//registers email and password into database
//takes in req object that looks like
//{
//  id: "uxxx",
//  email: "xxxx@xxx.xxx",
//  pass: "xxxx"
//}
//**needs to be updated if table changes**
app.post('/users/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.pass, salt);

        const user = {
            id: req.body.id,
            email: req.body.email,
            password: hashedPassword
        };

        await pool.query(
            `INSERT INTO biml.login(useremail, userpassword)
                VALUES ($1, $2);`, [user.email, user.password]
        )

        res.status(201).send();
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
    
});

//takes in log in and verifies it if its in the database
//if credentials match, then an access and refresh token are made
//refresh token is stored in database using sendToken
//json object looks like this
//{
//  email: "xxxx@xxxx.xxx"
//  pass: "xxxx"
//}
//returns access and refresh token
//**statically assigns userid for token, needs to be updated!!**
app.post('/users/login', async (req, res) => {
    // const user = users.find(user => user.name === req.body.name)
    const u = await pool.query(
        `SELECT *
        FROM biml.login
        WHERE useremail = $1;`, [req.body.email]
    );

    if (u.rows.length > 0) {
        try {
            const user = u.rows[0]
            if (await bcrypt.compare(req.body.pass, user.userpassword)) {
                const accessToken = generateToken(user);
                const refreshToken = jwt.sign(user, process.env.SECRET_REFRESH_TOKEN)
                
                if (sendToken(req.body.tid, user.userid, refreshToken)) {
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        sameSite: 'Strict'
                    })
                    res.status(200).json({ accessToken: accessToken });
                } else
                    res.status(500).send('Failed to insert token to db');
            } else   
                res.status(401).send('nah gang');
        } catch (err){
            console.log(err);
            res.status(500).send(':(');
        }
    } else {
        return res.status(400).send('Cannot find user');
    }
})

//generates an access token, needs to be changed from 15s
function generateToken(user) {
    //CHANGE FROM 15 SECONDS
    return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '15s' });
}

//sends refresh token to database
//expiration date is set in database (30 days)
async function sendToken(tokenid, userid, token) {
    try {
        await pool.query(
            `INSERT INTO biml.tokens(useridfk, refreshtoken)
            VALUES  ($1, $2);`, [userid, token]
        );
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

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
app.post('/users/login/test', authenticateToken, (req, res) => {
    //req.user is given to us from middleware, which is the payload (user from database) extracted
    //from the token
    res.json(users.filter(user => user.email === req.user.useremail));
})

//verifies access token
//returns the user stored in token
function authenticateToken (req, res, next) {
    //validate token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null)
        return res.sendStatus(401);
    
    //verify token
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    })
}

//regenerate access token if expired
//checks if refresh token is valid
app.post('/users/token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    //is there a refresh token?
    if (refreshToken == null)
        return res.sendStatus(401)
    try {
        //is it a valid refresh?
        if (!(await validRefresh(refreshToken)))
            return res.status(403).send("not in list");

        jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, user) => {
            if (err)
                return res.status(403).send("not valid token");
            const accessToken = generateToken({ useremail: user.useremail })
            res.json({ accessToken: accessToken })
        })
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

//checks if refresh token is in db and not expired
//if expired, delete from database
async function validRefresh(token) {
    try {
        const dbToken = await pool.query(
            `SELECT *
            FROM biml.tokens
            WHERE refreshtoken = $1;`, [token]
        );

        if (dbToken.rows.length > 0) {
            const expiryDate = new Date(dbToken.rows[0].expireon);
            const currentDate = new Date();

            if (dbToken.rows[0].refreshtoken === token)
                if (expiryDate > currentDate)
                    return true;
                else {
                    deleteToken(token)
                    return false;
                }
            else
                return false;
        } else
            return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

//calls deleteToken function
app.delete('/users/logout', async (req, res) => {
    // refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    try {
        deleteToken(req.cookies.refreshToken);
        res.clearCookie('refreshToken', {httpOnly: true});
        res.sendStatus(204);
    } catch (err) {
        res.status(500).status("can't delete?");
    }
})

//deletes token from db
async function deleteToken(token) {
    try {
        const result = await pool.query(
            `DELETE FROM biml.tokens
            WHERE refreshtoken = $1;`, [token]
        );
        console.log(`Deleted ${result.rowCount} rows`);
    } catch (err) {
        console.error("Error deleting token: ", err);
    }
}

//checks if refreshtoken is in database
app.get('/users/check', async (req, res) => {
    try {
        const usrToken = req.body.token;
        const u = await pool.query(
            `SELECT *
            FROM biml.tokens
            WHERE refreshToken = $1;`, [req.body.token]
        );
        if (u.rows.length > 0) {
            const dbToken = u.rows[0].refreshtoken;
            if (usrToken === dbToken)
                res.status(200).send("drippy bruh");
            else
                res.sendStatus(401);
        } else
            res.status(403).send("nah");
    } catch (err) {
        console.log("4");
        res.status(500).send("my b");
    }
})

app.listen(port, () => {
    console.log("Server started on port " + `${port}`);
});