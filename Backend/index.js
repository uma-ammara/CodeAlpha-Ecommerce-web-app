// define port on which our server will be running 
const port = 4000;

// import express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// database connection

// API CREATION
app.get("/", (req, res) => {
  res.send("Hello World");
});

// image storage engine
const storage = multer.diskStorage({
  destination: './uploads/images',   // make sure this folder exists
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// serving static files
app.use('/images', express.static(path.join(__dirname, 'uploads/images')));

// creating upload point for image upload 
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});


//Schema for crearing products 

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        
        unique: true
    },
    name:{
        type : String,
        required: true
    },
    image:{
        type : String,
        required: true
    },
    category:{
        type : String,
        required: true
    },
    new_price:{
        type : Number,
        required: true
    },
    old_price:{
        type:Number,
        required: true
    },
    date:
    {
        type:Date,
        default:Date.now
    },
    available:{
        type:Boolean,
        default:true
    },
})

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
        console.log("last id was " + last_product.id);
    } 
    else{
        id=1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        available: req.body.available
    });
    console.log(product);
    await product.save();
    console.log("saved");
    
    res.json({
        success: true,
        name:req.body.name
    });
    
})

// creating api for deleting producrts

app.post('/removeproduct', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.body.id);  // ✅ use _id
    console.log("Removed product:", req.body.id);
    res.json({
      success: true,
      id: req.body.id
    });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, error: "Failed to remove product" });
  }
});



// create api gor getting all products

app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("all products fetched");
    res.send(products);
    
})

// creating  schema for user

const user = mongoose.model('User',{
  
      name:{
        type:String,
      },
      email:{
        type:String,
        unique:true,
      },
    password:{
        type:String,
    },
    cartData:{
      type:Object
    },
    date:{
        type:Date,
        default:Date.now
    }
})
// creating endpoint for registaring user

app.post('/signup', async (req, res) => {
  try {
    console.log("Incoming signup data:", req.body);

    let check = await user.findOne({ email: req.body.email }); 

    if (check) {
      return res.status(400).json({ success: false, error: "Existing user found with same email address" });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const newUser = new user({   //  match your model name
      name: req.body.username,    // or req.body.name depending on frontend
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });

    await newUser.save();

    const data = {
      user: {
        id: newUser.id,
      },
    };

    const token = jwt.sign(data, 'secret-ecom');
    res.json({ success: true, authtoken: token });

  } catch (err) {
    console.error("Signup error:", err);  
    res.status(500).json({ success: false, error: err.message });
  }
});
  // creating endpoit for login user 

  app.post('/login', async (req, res) => {
  try {
    // find user by email
    let loginuser = await user.findOne({ email: req.body.email });  

    if (loginuser) {
      // compare passwords (for now plain text, later use bcrypt)
      const passCompare = req.body.password === loginuser.password;

      if (passCompare) {

        const data = {
          user: {
            id: loginuser.id,   
          }
        };

        const token = jwt.sign(data, 'secret-ecom');
        res.json({ success: true, token });
      } else {
        res.json({ success: false, error: "Wrong password" });
      }

    } else {
      res.json({ success: false, error: "Wrong email id" });
    }

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});   

//creating endpoint for newcollection data

 app.get('/newcollections', async (req,res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("new collection fetched ");
  res.send(newcollection);
  

 })


 // creating endpoint for popular in women section
 app.get('/popularinwomen', async (req, res) => {
  try {
    // get only products where category is "women"
    let products = await Product.find({ category: "women" }); 

    let popular_in_women = products.slice(0, 4); // first 4 products
    console.log("popular in women fetched");
    res.json(popular_in_women);  //always send JSON
  } catch (error) {
    console.error("Error fetching popular products:", error);
    res.status(500).json({ error: "Failed to fetch popular products" });
  }
});
 
//creating middleware to etch user

const fetchUSer = async (req,res)=>{
  const token = req.header('auth-token');
  if(!token){
    res.status(401).send({errors:"please authenticate using valid token "})

  }
  else{
    try{
      const data = jwt.verify(token,'secret_ecom');
        req.user=data.user;
        next();
    } catch(error){
      res.status(401).send({errors:"please authenticate usinf valid token"})
    }




  }

}

//creating endpoint  for adding products in cart data

app.post('/addtocart',fetchUSer,async (req,res)=>{
   console.log("added",req.body.itemId);
  
  let userData = await user.findOne({_id:req.user.id});
  userData.cartData[req.body.itemId]+=1;
  await user.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Added")

})
// creating endpoint to remove product from cart data

app.post('/removefromcart',fetchUSer,async(req,res)=>{
  console.log("removed",req.body.itemId);
  
   let userData = await user.findOne({_id:req.user.id});
   if( userData.cartData[req.body.itemId]>0)
  userData.cartData[req.body.itemId]-=1;
  await user.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("removed")
})


// creating endpoint to get cartdata

app.post('/getcart',fetchUSer,async(req,res)=>{
  console.log("get cart");
  let userData = await user.findOne({_id:req.user.id})
  res.json(userData.cartData);

  
})
  ///
app.listen(port, (error) => {
  if (!error) {
    console.log("server is running on port " + port);
  } else {
    console.log("something went wrong " + error);
  }
});
