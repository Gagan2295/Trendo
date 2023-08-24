const mongoose = require("mongoose");


const dbconn = async () => {
    let uri = "mongodb+srv://gagan:gagandeep@cluster0.tqmyqbz.mongodb.net/project1?retryWrites=true&w=majority";
    try {
        await mongoose.connect(uri);
        console.log("DB is Connected")
    } catch (error) {
        console.log(error)
    }
};

module.exports = dbconn;