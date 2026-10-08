let dotenv = require("dotenv");
dotenv.config();

let express = require('express');
let cors = require('cors');
var cookieParser = require('cookie-parser')
const ConnectDB = require("./Config/dbConfig");

const UserRouter = require("./Routes/UserRoutes");
const ProductRouter = require("./Routes/ProductRoutes");
const CategoryRouter = require("./Routes/CategoryRoutes");
const EnquiryRouter = require("./Routes/EnquiryRoutes");


let app = express();
let Port = process.env.PORT;

app.use(express.json());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((url) => url.trim());
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin not allowed by CORS"));
    },
    credentials:true
}));
app.use(cookieParser());



app.get("/",(req,res)=>{
    res.json({message: "Test Route hit"})
})

app.use("/api/user", UserRouter);
app.use("/api/product", ProductRouter)
app.use("/api/categories", CategoryRouter);
app.use("/api/enquiries", EnquiryRouter);

app.listen(Port, ()=>{
    console.log('Server is Runnig on port '+ Port);
    ConnectDB();
})
