const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const MONGO_URI = process.env.MONGO_URI;

const connnectDB = async ()=>{
    try {
        const conn = await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log('MongoDB Connected',conn.connection.host)
        
    } catch (error) {
        console.log(error.message ,"chall haatt")
    }
}
module.exports = connnectDB