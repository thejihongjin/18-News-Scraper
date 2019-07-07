var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    text: String
    // text: String,
    // article: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Article"
    // }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;