// ===============================================================================
// LOAD DATA
// ===============================================================================

const fs = require("fs");
var path = require("path");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const dbUrl = "./db/db.json";

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = (app) => {

    app.get("/api/notes", (req, res) => {
        readFileAsync(dbUrl, "utf8")
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
        readFileAsync(dbUrl, "utf8")
            .then((data) => {
                if (data) { // if any note exists
                    const jsonFormatted = JSON.parse(data);
                    jsonFormatted.forEach(element => notes.push(element)); // adds existing notes to the array

                    let id = jsonFormatted[jsonFormatted.length - 1].id; // gets the latest id

                    note = req.body;
                    note.id = ++id;
                    console.log(note)
                }
                else { // if no notes exist
                    note = req.body;
                    note.id = 1;
                }
                notes.push(note); // adds the new note to the array
                let notesJSON = updateDb(notes);
                res.json(notesJSON);
            })
            .catch(err => console.log(`Error: ${err}`));
    });

    app.delete("/api/delete/:id", (req, res) => {
        let id = req.params.id;
        const notes = new Array();
        readFileAsync(dbUrl, "utf8")
            .then((data) => {
                if (data) { // if any note exists
                    const jsonFormatted = JSON.parse(data);
                    jsonFormatted.forEach(item => {
                        if (item.id !== parseInt(id)) notes.push(item);
                    });
                    updateDb(notes);
                    res.json(`note with id: ${id} was deleted successfully!`);
                }
            })
            .catch(err => console.log(`Error: ${err}`));
    });

    function updateDb(notes) {
        const notesJSON = JSON.stringify(notes, null, 2);
        writeFileAsync(dbUrl, notesJSON);
        console.log("Note was updated successfully!")
        return notesJSON;
    }
}
