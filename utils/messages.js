const moment=require('moment');

function messageBox(username,text){
    return{
        username,
        text,
        time:moment().format("YYYY:MM:DD h:mm a")
    };
}
module.exports=messageBox;