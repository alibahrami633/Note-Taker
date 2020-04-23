// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

const fs = require("fs");

let rawdata = fs.readFileSync("../db/db.json"); // sync for get and post
let notes = JSON.parse(rawdata);
// console.log(notes);


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = (app) => {
    // API GET Requests
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link
    // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
    // ---------------------------------------------------------------------------

    app.get("/api/notes", (req, res) => {
        res.json(notes);
    });

    // API POST Requests
    // Below code handles when a user submits a form and thus submits data to the server.
    // In each of the below cases, when a user submits form data (a JSON object)
    // ...the JSON is pushed to the appropriate JavaScript array
    // (ex. User fills out a reservation request... this data is then sent to the server...
    // Then the server saves the data to the tableData array)
    // ---------------------------------------------------------------------------

    app.post("/api/notes", (req, res) => {
        // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
        // req.body is available since we're using the body parsing middleware
        notes.push(req.body);
        res.json(true);
    });

    // ---------------------------------------------------------------------------
    // I added this below code so you could clear out the table while working with the functionality.
    // Don"t worry about it!

    app.delete("/api/delete/:id", (req, res) => {
        let id = req.params.id;
        // async for delete
        fs.readFile("../db/db.json", 'utf8', (err, data) => {
            data = JSON.parse(data);

            delete data[id];

            console.log(JSON.stringify(data));
            res.status(200);

            return res.send("Removed");
        });
    });
}
