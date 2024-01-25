let video = document.querySelector("video");
let recordbtncont  =  document.querySelector(".record-btn-cont")
let recordbtn  =  document.querySelector(".record-button")
let capturebtncont = document.querySelector(".capture-btn-cont")
let capturebtn = document.querySelector(".capture-button")
let timer = document.querySelector(".timer")
let trasnprancolor = "transparent"

let recordflag = false;

let recoder;
let chunks = [];

let constraints = {
    video: true,
    audio: true
};

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;

        recoder = new MediaRecorder(stream);
        recoder.addEventListener("start" , (e) => {
             chunks = [];
        })  

        recoder.addEventListener("dataavailable" ,(e) => {
              chunks.push(e.data);       
        })
        
         recoder.addEventListener("stop" , (e) => {
            let blob = new Blob(chunks , { type: "video/mp4"});        
           
            if ( db ){
                 let videoid = shortid();
                 let dbtransection = db.transaction("video" , "readwrite");
                 let vediostore = dbtransection.objectStore("video");
                 let vedioentery = {
                     
                    id : `vid-${videoid}` , 
                    blobdata : blob  
                 }
                vediostore.add(vedioentery);
            }
            // let a = document.createElement("a");
            // a.href = vediourl;
            // a.download = "stream.mp4";
            // a.click();
        })
    })
    
    recordbtn.addEventListener("click" , (e) => {
        if ( !recoder ) return ;
        recordflag = !recordflag;
        
        if (recordflag) {
             recoder.start(); 
             recordbtn.classList.add("scale-record");
             starttimer();
        }else {
            recoder.stop();
            recordbtn.classList.remove("scale-record")   
            stoptimer(); 

        }

    })

    capturebtn.addEventListener("click"  ,  (e) => {
        capturebtn.classList.add("scale-capture")

         let canvas = document.createElement("canvas");
         canvas.width = video.videoWidth;
         canvas.height = video.videoHeight;

         let tool = canvas.getContext("2d");
         tool.drawImage(video , 0 , 0 , canvas.width , canvas.height);
         tool.fillStyle = trasnprancolor;
         tool.fillRect(0 , 0 , canvas.width , canvas.height);
        
        let imageurl = canvas.toDataURL();
       
        if ( db ) {
             let imageid = shortid();
             let dbtransection = db.transaction("image" , "readwrite");
             let imagestore = dbtransection.objectStore("image");
             let imageentry = {
                 id :  `img${imageid}`,
                 url : imageurl
             }
             imagestore.add(imageentry);
        }
        setTimeout(() => {
            capturebtn.classList.remove("scale-capture")
        }, 500);
    })

   let timerid ;
   let cnt = 0;
    function starttimer () {
        timer.style.display = "block";
        function displaytiner() {
           
            let toatalsec = cnt;
            let hrs = Number.parseInt(cnt / 3600);
            toatalsec = toatalsec % 3600 ;

            let minute = Number.parseInt(toatalsec / 60);
            toatalsec = toatalsec % 60;

            let sec = toatalsec;
            hrs = (hrs < 10) ? `0${hrs}` : hrs; 
            minute = (minute < 10) ? `0${minute}` : minute; 
            sec = (sec < 10) ? `0${sec}` : sec; 
            timer.innerText = `${hrs}:${minute}:${sec}`; 
            cnt++;
        }
        timerid = setInterval(displaytiner , 1000)
    }

    
    function stoptimer () {
        clearInterval(timerid); 
        timer.innerText = "00.00.00" ;
        timer.style.display = "none";
    }
    
    let filterlayer = document.querySelector(".filter-layer");
    let allfilter = document.querySelectorAll(".filter");
    allfilter.forEach((filterle) => {
         filterle.addEventListener("click" , (e) => {
             trasnprancolor = getComputedStyle(filterle).getPropertyValue("background-color");
             filterlayer.style.backgroundColor = trasnprancolor;
         })
    })