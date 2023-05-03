require('dotenv').config()
const express=require("express")
const bodyParser=require("body-parser")

const app=express()
const serverless = require('serverless-http')


const cors = require('cors');
// app.use(cors({ origin: true }));
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));

app.use(express.json())


const mongoose=require("mongoose");

mongoose.connect(process.env.Address,{useNewUrlParser:true})
    .then(async ()=>{console.log("connected with database")})

const Schema= mongoose.Schema({
    name:{
        type:String,
        required:[true,'Must provide name'],
        maxlength:[20,'should not be more than 20 words']
    },
    rating:{
        type:Number,
        required:[true,'Must provide rating']
    },
    review:{
        type:String,
        required:[true,'Must provide review']
    }
})

const Review= mongoose.model("review",Schema);


app.get("/data",async (req,res)=>{
    await Review.find({rating:{$gt:3.9}}).sort({rating:-1})
    .then(async (found)=>{
        // console.log(found);
        let namearray=[];
        let ratingarray=[];
        let reviewarray=[];
        found.forEach(element => {
            namearray.push(element.name);
            ratingarray.push(element.rating);
            reviewarray.push(element.review);
        });
        // console.log(namearray,ratingarray,reviewarray);
        // res.render("home",{names:namearray,rates:ratingarray,reviews:reviewarray});
        res.json({"names":namearray,"rates":ratingarray,"reviews":reviewarray})
    })
})

app.post("/data",async (req,res)=>{
    let userName=req.body.name;
    let userRating=req.body.rating;
    let userReview=req.body.message;
    const item = new Review({
        name:userName,
        rating:userRating,
        review:userReview
    });
    await item.save();
    // await Review.find({rating:{$gt:3.0}}).sort({rating:-1})
    // .then(async (found)=>{
    //     let namearray1=[];
    //     let ratingarray1=[];
    //     let reviewarray1=[];
    //     found.forEach(element => {
    //         namearray1.push(element.name);
    //         ratingarray1.push(element.rating);
    //         reviewarray1.push(element.review);
    //     });
        // res.render("home",{names:namearray1,rates:ratingarray1,reviews:reviewarray1});
        res.redirect("/");
    })

app.listen(5000,(req,res)=>{
    console.log("Server live on port 3000");
})

module.exports.handler=serverless(app);