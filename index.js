const app = require('express')();

const port = process.env.PORT || 3000
const {news} = require('./inshort')

app.get('/', news,async(req,res)=>{ 
    try{
       console.log("ok");
    }catch(err){
        console.error(err);
    }
})

app.listen(port);
