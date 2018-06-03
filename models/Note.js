// Require mongoose
var mongoose = require("mongoose");
// Schema class
var Schema = mongoose.Schema;

// Create the Note schema
var NoteSchema = new Schema({
    body: {
        type: String
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
});

// Create, export model
var Note = mongoose.model("Note", NoteSchema);
module.exports = Note;