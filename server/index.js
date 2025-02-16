const express = require("express");
const app = express();

require("dotenv").config({path: '../.env'});

const cors = require("cors");
const corsOptions = {
    origin: [process.env.CORS_ORIGIN],
};

app.use(cors(corsOptions));

app.get("/api", (req, res) =>  {
    res.json({ fruits: ["apple", "orange", "meow"]});
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
