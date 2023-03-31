const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.use(bodyParser.urlencoded({exteded:true}));

app.post("/" ,function(req,res){
    const firstName = req.body.fName;
    const lastName =  req.body.lName;
    const email = req.body.e_mail;

    const data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                 }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    console.log(jsonData);

    const url = `https://us21.api.mailchimp.com/3.0/lists/2e984e5e9a`;

    const options ={
        method:'POST',
        auth:"achu:df07b2f000af63bf79376e115fbe54be-us21"
    }

    const request= https.request(url,options,function(response){
       
        const statusCode = response.statusCode; 
        if(statusCode === 200){
            res.sendFile(__dirname+"/sucess.html")
        }else{
            res.sendFile(__dirname+"/faliure.html");
        }
               
        response.on("data",function(data){
            console.log(response);
            console.log(response.statusCode);
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/faliure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server started at port 3000");
});

