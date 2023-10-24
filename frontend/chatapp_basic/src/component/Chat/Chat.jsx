import {React,useState,useEffect} from 'react'



import axios from "axios";

import "./chat.css"


let uid = Math.floor(Math.random()*(999-100+1)+100);

function Chat() {
  const [readMsg,setReadMsg] = useState(true);
  const [msgs, setMsgs] = useState([]);




  const HOST = "http://localhost:3002/";



  useEffect(()=>{
    axios.get(HOST+'getmsgs')
    .then(res=>{
      setMsgs(res.data)
      console.log(msgs)
    })
  },[readMsg])

  
  const handleMsg = ()=>{
    let msgId = document.getElementById("sendMsg").value;
    
    axios.get(HOST+`msg?id=${uid}&msg=${msgId}`)
    .then(res=>res.data)
    .then(res=>{
      alert(res.msg)
      setReadMsg(!readMsg);
    })
  }



  return (
    <>
      <div className="main-container">


        <div className="chat-container">
          <div className="msgs">
            <div className="msg-container" key={1}>
              <p className="userId">User 201</p>
              <p className="msg">Hi</p>
            </div>

            {msgs.map(info=>{
              return(

              <div className="msg-container" key={info.id}>
              <p className="userId" id={info.uid}>User {info.uid}</p>
              <p className="msg">{info.msg}</p>
            </div>
              );

            })}
            
            
          </div>

          <div className="send-msgs">
            <textarea  name="msg" id="sendMsg" required rows={3} cols={50} maxLength={500}/>
            <button className="btn" onClick={handleMsg} type="submit">send</button>
          </div>
        </div>
        <button className="btn refresh-btn" onClick={()=>setReadMsg(!readMsg)}>Refresh</button>
      </div>
    </>
  )
}

export default Chat