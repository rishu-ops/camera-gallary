let db ;
let openrequest = indexedDB.open("mydatabse");
openrequest.addEventListener("success"  , (e)=>{
    console.log("db sucess")
    db = openrequest.result;
})

openrequest.addEventListener("error"  , (e)=>{
    console.log("db error" )
})

openrequest.addEventListener("upgradeneeded" , (e)=>{
    console.log("db upgraded and also updated to db")
    db = openrequest.result;

    db.createObjectStore("video" , {keyPath : "id"});
    db.createObjectStore("image" , {keyPath : "id"});
 
    
})