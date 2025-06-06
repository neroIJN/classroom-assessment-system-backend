import {app} from "./app";
import connectDB from "./utils/db";

require("dotenv").config();


app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
    connectDB();
});