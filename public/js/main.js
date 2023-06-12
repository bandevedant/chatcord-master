const socket=io();
const chatForm=document.getElementById('chat-form');
const roomName=document.getElementById('room-name');
const usersList=document.getElementById('users');

const {username,room}=Qs.parse(location.search,{
  ignoreQueryPrefix:true
  })
console.log(username,room)  

socket.emit('joinroom',{username,room})

socket.on('roomUsers',({users,room})=>{
  outputRoomName(room);
  outputUsers(users);
})


const chatMessages=document.querySelector('.chat-messages');
socket.on('message',message=>{
  console.log(message);
  outputMessage(message);
chatMessages.scrollTop=chatMessages.scrollHeight;

})

chatForm.addEventListener('submit',e=>{
   e.preventDefault();
   const msg=e.target.elements.msg.value;
   socket.emit('chatMessage',msg);
   e.target.elements.msg.value="";
   e.target.elements.msg.focus();
  
})

function outputMessage(message){
  const div=document.createElement('div');
  div.classList.add('message');
  div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomName.innerText=room;
}

function outputUsers(users){
    usersList.innerHTML=`${
      users.map(user=>`<li>${user.username}</li>`).join('')
    }`;
}