const express = require("express");
const pool = require('./database');
const app = express();

require("dotenv").config({ path: '../.env' });

const port = process.env.PORT || 3000;

//ensures only receiving requests from client server via .env file
const cors = require("cors");
const corsOptions = {
    origin: [process.env.CORS_ORIGIN],
};
//applies above options
app.use(cors(corsOptions));

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

app.listen(port, () => {
    console.log("Server started on port " + `${port}`);
});
