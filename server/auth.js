const pool = require('./database');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//registers email and password into database
//takes in req object that looks like
//{
//  id: "uxxx",
//  email: "xxxx@xxx.xxx",
//  pass: "xxxx"
//}
//**needs to be updated if table changes**
async function userRegistration(req, res) {
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
}

//takes in log in and verifies it if its in the database
//if credentials match, then an access and refresh token are made
//refresh token is stored in database using sendToken
//json object looks like this
//{
//  email: "xxxx@xxxx.xxx"
//  pass: "xxxx"
//}
//returns access token as json object and refresh token as http only cookie
async function userLogin(req, res) {
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
}

//regenerate access token if expired
//checks if refresh token is valid
async function userRefreshToken(req, res) {
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
}

//checks if refreshtoken is in database
async function userCheckToken(req, res) {
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
}

//calls deleteToken function
async function userLogout(req, res) {
    // refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    try {
        deleteToken(req.cookies.refreshToken);
        res.clearCookie('refreshToken', {httpOnly: true});
        res.sendStatus(204);
    } catch (err) {
        res.status(500).status("can't delete?");
    }
}

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

//generates an access token, needs to be changed from 15s
function generateToken(user) {
    //CHANGE FROM 15 SECONDS
    return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '5m' });
}

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

module.exports = { 
    userRegistration, 
    userLogin, 
    userLogout, 
    userRefreshToken, 
    authenticateToken, 
    userCheckToken 
};