const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Create a new HeadlineSchema object

const ArticleSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String,
        required: true,
        unique: true
    },
    // `link` is required and of type String
    link: {
        type: String,
        required: true
    },
    // `img` is required and of type String
    img: {
        type: String,
        required: true
    },
    //'saved' is required, of type Boolean, and has a default value of false.
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    // `note` is an object that stores a Note id
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;

