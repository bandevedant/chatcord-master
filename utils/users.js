const users=[];

function userJoin(username,room,id){
    const user ={username,room,id};
    users.push(user);

    return user;
}
function getCurrentuser(id){
   return users.find(user=>user.id===id);

}
function userLeave(id){
    const index=users.findIndex(user=>user.id===id);
   if(index!==-1)
   return users.splice(index,1)[0];//assuming 2 users in room one left so the only remaining one...
}
function getRoomUsers(room){
return users.filter(user=>user.room===room);
}

module.exports={userJoin,getCurrentuser,userLeave,getRoomUsers};