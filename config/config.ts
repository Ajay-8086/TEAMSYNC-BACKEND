import mongoose from "mongoose";

// connecting to database 
async function dbConnect(){
    await mongoose.connect(process.env.MONGO_URI as string,{
        dbName:"teamsync"
    })
    .then(()=>{
        console.log('connected to mongo db');
    })
    .catch((err:any)=>{
        console.log("error while connecting mongo db ",err);
    })
}

export default dbConnect;