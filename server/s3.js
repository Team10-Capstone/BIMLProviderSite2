const fs = require("fs");

const pool = require('./database');
const AWS = require("aws-sdk");
const archiver = require('archiver');

require("dotenv").config({path: '../.env'});

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
});

//uploads file given to s3 and links up with patient id given in database
//requires authentication
async function uploadCSV(req, res) {
    try {
        if (!req.file)
            return res.status(400).send("No file uploaded");

        const file = fs.readFileSync(req.file.path);

        const userResult = await pool.query(
            `SELECT patientid_fk FROM biml.login
             WHERE useremail = $1`, [req.user.useremail]
        );

        if (userResult.rows.length === 0)
            return res.status(403).send("Unauthorized");

        const patient_id = userResult.rows[0].patientid_fk;
        const user = JSON.parse(req.body.userData);
        const key = `test/${user.exercisename}_${Date.now()}.csv`;

        const result = await pool.query(
            `INSERT INTO biml.exercises(s3_key, patient_id, name)
            VALUES ($1, $2, $3)`, [key, patient_id, user.exercisename]
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
}

//downloads image from s3, later will replace with deliverable for unity app
//requires authentication
function downloadApp(req, res) {
    try {
        const perms = {
            Bucket: 'biml-bucket',
            Key: 'test/STRIDE Setup (x64).exe',
            Expires: 60,
            ResponseCacheControl: 'no-cache',
            ResponseContentDisposition: 'attachment; filename="STRIDE Setup (x64).exe"'
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
}

//gets all exercises associated with user thats logged in
// returns in zip file
//requires authentication
async function downloadExercises(req, res) {
    const zipStream = archiver('zip', { zlib: { level: 9 } });
    res.attachment('exercises.zip');
    zipStream.pipe(res);

    try {
        const user = await pool.query(
            `SELECT patientid_fk FROM biml.login
             WHERE useremail = $1`, [req.user.useremail]
        );
        if (user.rows.length === 0)
            return res.status(403).send("Unauthorized");

        const patientId = user.rows[0].patientid_fk;

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
        } else {
            res.status(404).send(":(");
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

//downloads exercise given s3 key
//requires authentication
async function downloadExercise(req, res) {
    try {
        key = req.params[0];

         const userResult = await pool.query(
            `SELECT patientid_fk FROM biml.login
             WHERE useremail = $1`, [req.user.useremail]
        );

        if (userResult.rows.length === 0)
            return res.status(403).send("Unauthorized");

        const patientId = userResult.rows[0].patientid_fk;

        const fileCheck = await pool.query(
            `SELECT * FROM biml.exercises
             WHERE s3_key = $1 AND patient_id = $2`, [key, patientId]
        );

        const s3Stream = s3.getObject({
            Bucket: 'biml-bucket',
            Key: key
        }).createReadStream();

        // Set headers so the browser knows it's a CSV file download
        res.setHeader('Content-Disposition', `attachment; filename="${key.split('/').pop()}"`);
        res.setHeader('Content-Type', 'text/csv');

        // Pipe S3 stream directly to response
        s3Stream.pipe(res).on('error', (err) => {
            console.error("S3 Stream Error:", err);
            res.sendStatus(500);
        });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

//gets exercise names for user thats logged in
//requires authentication
async function getExercises(req, res) {
    try {
        const user = await pool.query(
            `SELECT patientid_fk FROM biml.login
             WHERE useremail = $1`, [req.user.useremail]
        );
        
        if (user.rows.length === 0) 
            return res.status(403).send("Unauthorized");

        const patientId = user.rows[0].patientid_fk;

        const result = await pool.query(
            `SELECT s3_key
            FROM biml.exercises
            WHERE patient_id = $1`, [patientId]
        );

        if (result.rows.length > 0) {
            const list = result.rows.map(row => {
                filename = row.s3_key.split('/').pop()
                const [ key, dateString ] = filename.split('_');
                return { key, date: new Date(parseInt(dateString)), exercise: row.s3_key };
            });

            res.status(200).json(list);
        } else
            res.sendStatus(404)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = { 
    s3, 
    archiver,
    uploadCSV,
    downloadApp,
    downloadExercises,
    downloadExercise,
    getExercises
};