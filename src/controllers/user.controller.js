const express= require("express");

const{body,validationResult} =require("express-validator");

const User= require("../models/user.model.js");
const transporter=require("../configs/mail");

const router=express.Router();

router.get("/",async (req, res) => {
    try {
        const page= +req.query.page || 1;
        const size = +req.query.size || 2;

        const skip=(page-1)*size;

        const users= await User.find({}).skip(skip).limit(size).lean().exec();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).json({message: err.message,error:"Failed"});
    }
})


router.post("/",
body("first_name").notEmpty().withMessage("first name is required"),
body("last_name").notEmpty().withMessage("last name is required"),
body("pincode").isNumeric().isLength({min:6,max:6}).withMessage("Pincode has to be 6 digits"),
body("email").isEmail().withMessage("please provide correct email"),
body("age").custom((value) => {
    const isNumber = /^[0-9]*$/.test(value);///regular  expression with test as in build
    if(!isNumber ||  value >= 100 || value<=0) {
        throw new Error("age between 1 to 100");
    }
    return true;
    
}),
body("gender").notEmpty().custom(async(value)=>{
    let arr=["male","female","others"];
    let count=0;
    //console.log(value)
    for(let i=0;i<3;i++){
       // console.log(arr[i])
         if(value==arr[i]){
            count++
         }
            
         }
       // console.log(count)
        if(count==0){
            throw new Error("enter valid gender like male female or other")

        }

}),
 async(req,res)=>{
     
    const errors= validationResult(req);
    if(!errors.isEmpty()) {
        let newErrors = errors.array().map(({msg,param,location})=>{
            return{
                [param]:msg,
            };
        });
        return res.status(400).json ({errors:newErrors});
    }
    

    
    
    try{
        const to_array=["z@z.com","y@y.com","x@x.com","u@u.com","v@v.com"];
        const to_string=to_array.join(",")
        const users=await User.create(req.body);
        const message = {
  from: "parag@server.com",
  to: `${req.body.email}@sender.com`,
  subject: `welcome to ABC system ${req.body.first_name +" "+req.body.last_name}`,
  text: `HI ${req.body.first_name} Please confirm your email address`,
  html: "<p>HTML version of the message</p>"
};

        




    
    const message2 = {
        from: "parag@server.com",
        to: to_string,
        subject: `crerated new user to ABC system ${req.body.first_name +" "+req.body.last_name}`,
        text: `please welcome ${req.body.first_name}`,
        html: "<p>HTML version of the message</p>"
      };
    

    transporter.sendMail(message2);
    transporter.sendMail(message);
    return res.status(201).json({users})
    }
    catch(e){
        return res.status(500).json({status:"failed", message:e.message});


    
}
});
module.exports=router;