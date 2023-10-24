let mysql = require("mysql2/promise")
let express = require("express")
let bodyParser = require('body-parser')



let app = express();


app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


let mysqlPool = mysql.createPool({
    user:"mysqluser",
    password:"123",
    host:"localhost",
    database:"chat_msg"
})



app.get('/',(req,res)=>{
    res.send("hello world");
})






function sendMsg(id,msg,res){
    let QUERY = `INSERT INTO msgs(uid,msg) VALUES (${id},\'${msg}\');`

    mysqlPool.query(QUERY)
    .then(data=>console.log(data))
    .catch(err =>console.log("err: "+err))

     let info = {
        status:200,
        msg:"success"
}
    res.status(200)
    res.send(info)

    
   
}


async function getMsgs(res){
    let QUERY = "SELECT * FROM msgs;"

    let msgData;

    mysqlPool.query(QUERY)
    .then(data => {
        msgData = data;
        console.log(msgData[0]);
        return res.send(data[0])})
    .catch(err=>console.log("err getMsg: "+err))

    
    
}


function updateMsg(msgId,msg,res){
    let QUERY = `UPDATE msgs SET msg=\'${msg}\' WHERE id=${msgId}`;

    mysqlPool.query(QUERY)
    .then(data=>{
        console.log(data);
        let info ={
            status:200,
            msg:"success"
        }
        res.status(200);
        res.send(info);
    })
    .catch(err =>console.log("UpdateMsg err: "+err))
}


function deleteMsg(msgId,res){
    let QUERY = `DELET * FROM msgs WHERE id=${msgId};`

    mysqlPool.query(QUERY)
    .then(data=>{
        let info = {
            status:200,
            msg:"success"
        }
        res.status(200)
        res.send(info)
    })
    .catch(err=>console.log("deleteMsg err: "+err))
}




app.get('/msg',(req,res)=>{
    let id = parseInt(req.query.id);
    let msg = req.query.msg;
    console.log(msg);
    sendMsg(id,msg,res);
    
})


app.get("/getmsgs",(req,res)=>{
    getMsgs(res);

})


app.get("/updatemsg",(req,res)=>{
    let id = parseInt(req.query.id);
    let reqId = parseInt(req.query.eid);
    let msgId = parseInt(req.query.msgid);
    let msg = req.query.msg;

    if(id==reqId){
        updateMsg(msgId,msg,res);
    }else{
        res.status(401)
        let info ={
            status:401,
            msg:"Unauthorized Action."
        }
        
        res.send(info);
    }

});



app.get('/deletemsg',(req,res)=>{
    let id = parseInt(req.query.id);
    let reqId = parseInt(req.query.eid);
    let msgId = parseInt(req.query.msgid);
    
    if(id == reqId){
        deleteMsg(msgId,res);
    }else{
        res.status(401);
        let info = {
            status:401,
            msg:"Unauthorized Action."
        }
        res.send(info);
    }
    
})










app.listen(3002,()=>console.log("listening on Port 3002"));
