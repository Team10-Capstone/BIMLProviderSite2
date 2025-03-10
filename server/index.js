const express = require("express");
const pool = require('./database');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require("dotenv").config({ path: '../.env' });

const port = process.env.PORT || 3000;

//ensures only receiving requests from client server via .env file
const cors = require("cors");
const corsOptions = {
    origin: [process.env.CORS_ORIGIN],
};
//applies above options
app.use(cors(corsOptions));
app.use(express.json());

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
            `INSERT INTO biml.login(userid, useremail, userpassword)
                VALUES ($1, $2, $3);`, [user.id, user.email, user.password]
        )

        res.status(201).send();
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
    
});

//takes in log in and verifies it if its in the database
//json object looks like this
//{
//  email: "xxxx@xxxx.xxx"
//  pass: "xxxx"
//}
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
                refreshTokens.push(refreshToken);
                res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken}); //start here
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

function generateToken(user) {
    //CHANGE FROM 15 SECONDS
    return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '15s' });
}

const users = [
    {
        email: 'meow@gmail.com'
    },
    {
        email: 'RAWR@gmail.com'
    }
]

let refreshTokens = [];

app.post('/users/login/test', authenticateToken, (req, res) => {
    //req.user is given to us from middleware, which is the payload (user from database) extracted
    //from the token
    res.json(users.filter(user => user.email === req.user.useremail));
})

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

app.post('/users/token', (req, res) => {
    const refreshToken = req.body.token
    //is there a refresh token?
    if (refreshToken == null)
        return res.sendStatus(401)
    //was this refreshtoken a previous one?
    if (!refreshTokens.includes(refreshToken))
        return res.status(403).send("not previous one");

    jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, user) => {
        if(err)
            return res.status(403).send("bruh");
        console.log(user.useremail);
        const accessToken = generateToken({ useremail: user.useremail})
        res.json({ accessToken: accessToken})
    })
})

app.delete('/users/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

app.listen(port, () => {
    console.log("Server started on port " + `${port}`);
});
