// ===============================================================================
// LOAD DATA
// ===============================================================================

const fs = require("fs");
var path = require("path");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = (app) => {

    app.get("/api/notes", (req, res) => {
        readFileAsync("./db/db.json", "utf8")
            .then((data) => {
                if (data) {
                    const notes = JSON.parse(data);
                    return res.json(notes);
                }
            })
            .catch(err => console.log(`Error: ${err}`));
    });


    // Gets the latest id from DB file and adds 1 to it for the new inserted data (note)
    app.post("/api/notes", (req, res) => {
        const notes = []; // notes array acts as a buffer
        let note;
        readFileAsync("./db/db.json", "utf8")
            .then((data) => {
                if (data) { // if any note exists
                    const jsonFormatted = JSON.parse(data);
                    let id = jsonFormatted[jsonFormatted.length - 1].id;
                    note = req.body;
                    note.id = ++id;
                    jsonFormatted.forEach(element => notes.push(element)); // adds existing notes to the array
                }
                else { // if no notes exist
                    note = req.body;
                    note.id = 1;
                }
                notes.push(note); // adds the new note to the array
            })
            .catch(err => console.log(`Error: ${err}`));

        const notesJSON = JSON.stringify(notes, null, 2);
        writeFileAsync("./db/db.json", notesJSON);
        res.json(notesJSON);
    });

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
