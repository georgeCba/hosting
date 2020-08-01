let myGifs;
let gifIDdownload;

let myGifsGrid=document.getElementById("myGifsGridId");
let createGuifoFrame=document.getElementById("step1Id");
let stepsFrame=document.getElementById("step2Id");
let creationBar=document.getElementById("step3Id");
let uploadRedoFrame=document.getElementById("step4Id");
let uploadingFrame=document.getElementById("step5Id");
let uploadOptionsFrame=document.getElementById("step6Id");
let timerr=document.getElementById("timerId");
let loadBar=document.getElementById("loadingBarId");
let videoCam = document.getElementById('videoFrameId');
let videoGifId = document.getElementById('gifFrameId');
//TRAIGO LOS IDS DE LOS BOTONES
let cancelBtn=document.getElementById("createGifCancelId");
let continueBtn=document.getElementById("createGifContinueId");
let startBtn = document.getElementById('startRecordingId');
let stopBtn = document.getElementById('readyStopBtnId');
let playBtn=document.getElementById('playBtnId');
let uploadBtn= document.getElementById('uploadGifId');
let btnRepeat=document.getElementById("repeatCaptureId");
let playBar=document.getElementById("timerLoadingId");
let gifPrev=document.getElementById("gifPreviewId");
let finishGifBtn=document.getElementById("finishGifCreationBtnId");
let copyBtn=document.getElementById("clipBoardCopyId");
let downloadBtn=document.getElementById("gifDownloadId");
//PONGO LOS EVENTOS EN LOS BOTONES
continueBtn.addEventListener('click',getVideoRecorder);
startBtn.addEventListener('click',startRecord);
stopBtn.addEventListener('click', stopRecording);
playBtn.addEventListener('click', playVideoRecorded); 
uploadBtn.addEventListener('click',uploadGif);
btnRepeat.addEventListener("click",startRecord);
finishGifBtn.addEventListener("click",finalStage);
cancelBtn.addEventListener("click",closeRecord);
copyBtn.addEventListener('click',copyToClipBoard);
downloadBtn.addEventListener('click',donloadImg);

btnCreateGif.addEventListener('click',function(){
    returnBtn.style.display='block';
    frameSuggestion.style.display='none';
    frameTrends.style.display='none';
    frameSearchBar.style.display='none';
    frameSearch.style.display='none';
    frameGifCreator.style.display='block';
    frameMyGif.style.display='block';
})

btnMyGifs.addEventListener('click',function(){
    frameSuggestion.style.display='none';
    frameTrends.style.display='none';
    frameSearchBar.style.display='none';
    frameSearch.style.display='none';
    frameGifCreator.style.display='none';
    frameMyGif.style.display='block';
})

/*aca vamos a codear las fuciones para la camara web*/
let videoConfig = { 
    audio: false, 
    video: { 
        facingMode: "user", 
        width: { min: 640},
        height: { min: 480} 
    } 
}; 
let formatConfig_gif ={
    type: 'gif',
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
};
let formatConfig_video ={
    type: 'video',          //Este es para mostrar la repeticion 
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
};

let gifRecorder;
let vidRecorder;
let gifBlob;
let videoBlob;
let Gifsize;

videoGifId.style.display="none";        
createGuifoFrame.style.display="block"               //paso 1 cuadro de dialogo para comenzar la captura y tomar el medio de video
stepsFrame.style.display="none";                    //paso 2 vista previa con boton capturar solo
creationBar.style.display="none"                        // paso 3 
uploadRedoFrame.style.display="none"                    // paso 4 
uploadingFrame.style.display="none";                //paso 5 subiendo gif    
uploadOptionsFrame.style.display="none";            //paso 6 opciones una vez subido el gif    

function closeRecord(){
    frameGifCreator.style.display='none';
}

function getVideoRecorder(){
    createGuifoFrame.style.display="none"
    stepsFrame.style.display="block";

    navigator.mediaDevices.getUserMedia(videoConfig)
    .then(function(mediaStreamObj) {
        
        videoCam.srcObject = mediaStreamObj;
        videoCam.play();
    
        gifRecorder = RecordRTC(mediaStreamObj, formatConfig_gif);
        vidRecorder = RecordRTC(mediaStreamObj, formatConfig_video);
    })
}

function startRecord(){
        
        reset()
        startStop();                            //funcion para el timer
        
        videoCam.style.display="block"; 
        videoGifId.style.display="none"

        stopBtn.style.display="block";
        creationBar.style.display="block";
        startBtn.style.display="none";
        playBar.style.display="none";

        timerr.style.display="block";
        uploadRedoFrame.style.display="none"

        gifRecorder.reset();
        vidRecorder.reset();
        gifRecorder.startRecording();
        vidRecorder.startRecording();
        console.log("El estado del gif recorder es: "+gifRecorder.state);
        console.log("El estado del video recorder es: "+vidRecorder.state);
};

function stopRecording(){

        videoCam.style.display="none"; 
        videoGifId.style.display="block"

        stopBtn.style.display="none";
        playBar.style.display="flex";
        uploadRedoFrame.style.display="block"

        startStop();    
        videoGifId.srcObject=null;

        gifRecorder.stopRecording(function(blob){
            gifBlob=gifRecorder.getBlob();
            Gifsize = bytesToSize(gifBlob.size);
            //alert(Gifsize); //Esto puede ser util para chequear si el gif pesa mas de 100MB
        });
            
        vidRecorder.stopRecording(function(){
            videoBlob=vidRecorder.getBlob();
            videoGifId.src= URL.createObjectURL(videoBlob);  
        });       
       
        console.log(gifRecorder.state);
        console.log("El gifblob es: "+gifBlob);
        console.log("El videoBlob es: "+videoBlob);
};

function playVideoRecorded(){
        if(videoGifId.paused){
            videoGifId.play();
        }else{
            videoGifId.pause();
        }
};

function finalStage(){
    // reset Recorder's state & clear the memory
		vidRecorder.reset();
		vidRecorder.destroy();
		gifRecorder.reset();
        gifRecorder.destroy();
		gifRecorder = null;
        vidRecorder = null;
        console.log("Liberando la memoria de los elementos de video!")
        reloadInit();
}

function uploadGif(){
    startLoad();    //comienza la animacion de la barra de carga del gif
    let urlBaseId="http://api.giphy.com/v1/gifs/";

    stepsFrame.style.display="none";
    uploadingFrame.style.display="block";                //paso 5 subiendo gif    

    async function postGif(){
        console.log("***Upload started***");        
        const formData = new FormData();                    // Creo el objeto FormData
        formData.append("file", gifBlob, "myGif.gif");      // le hago el append del blob generado
    
        const params = {                                    //Parametros para configurar el Fetch para el post
            method: "POST",
            body: formData,
            json: true
        };

        const data = await fetch('https://upload.giphy.com/v1/gifs?'+apiKey, params);
        let jdata = await data.json();
        return jdata;
    }
    let check=postGif();
    check.then(function(resultado){
       

        if(resultado.meta.status === 200){

            uploadingFrame.style.display="none";                //paso 5 subiendo gif    
            uploadOptionsFrame.style.display="block"; 
            let gifIdUploaded=resultado.data.id;
            stopLoad(); //Detengo la animacion de la barra de carga

            console.log("El id del gif es: "+gifIdUploaded);
            gifIDdownload=gifIdUploaded;
            saveGifToLocalStorage(gifIdUploaded);
            let urlMyGif=urlBaseId+gifIdUploaded+'?'+apiKey;

            async function uploadedGifById(){
                let getGifData=await fetch(urlMyGif);
                let jsonGif= await getGifData.json();
                return jsonGif;
            }
            let myGif=uploadedGifById();
            myGif.then(function(gifResult){
                gifPreviewId.src=gifResult.data.images.original.url;
            })
                        
            setTimeout(function(){
                myGifs = getGifFromLocalStorage()
                getMyGifs(myGifs);
            },500);
        }else{
            console.log("Ha ocurrido un Error!");
        }
    })
    .catch(function(err) { 
        console.log(err.name, err.message);     //Error del getMedia
    });
}

function copyToClipBoard() {
    var copyTextarea = document.getElementById("copyToCbId");
    copyTextarea.value=gifPreviewId.src;
    copyTextarea.focus();
    copyTextarea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
  }

async function saveGifToLocalStorage(gif) {
    const response = await fetchURL(`https://api.giphy.com/v1/gifs/${gif}?`+apiKey);
    const data = response.data;
    const gifID = data.id;
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem(`gifoID-${gifID}`, stringifiedData);
}

async function fetchURL(url, params = null) {
	try {
		const fetchData = await fetch(url, params);
		const response = await fetchData.json();
		return response;
	} catch (error) {
		if (error.name !== "AbortError") {
			console.log("Error al obtener resultados");
		}
		return error;
	}
}

async function donloadImg() {
    const downloadUrl = `https://media.giphy.com/media/${gifIDdownload}/giphy.gif`;
    const fetchedGif = fetch(downloadUrl);
    const blobGif = (await fetchedGif).blob();
    const urlGif = URL.createObjectURL(await blobGif);
    const saveImg = document.createElement("a");
    saveImg.href = urlGif;
    saveImg.download = "downloaded-guifo.gif";
    saveImg.style = 'display: "none"';
    document.body.appendChild(saveImg);
    saveImg.click();
    document.body.removeChild(saveImg);
}

myGifs = getGifFromLocalStorage()
getMyGifs(myGifs);

//-----------------------------------------------------------------------------------------
function getGifFromLocalStorage() {
    const myGifs = {};
    for(var keyVal in localStorage){
        if(keyVal.startsWith("gifoID-")){
            myGifs[keyVal] = localStorage.getItem(keyVal);
        }else{
            null;
        }
    };
    return myGifs;
}

function getMyGifs(myGifs) {
    myGifsGrid.innerHTML='';
    for (let gifId in myGifs) {
        const parsedGifData = JSON.parse(myGifs[gifId]);
        myGifsGrid.innerHTML+=
        '<div class="gifSimple" id="gifSimpleId">\n'+   
        '<a href="'+parsedGifData.bitly_url+'" target="_blank">\n'+
                '<img class="gifSimpleContent" id="gifImageId" src="'+parsedGifData.images.original.url+'">\n'+
                '<div class="gifSimpleHeader" id="gifCardId">\n'+
                "Gifo ID: "+parsedGifData.id+'\n'+
                '</div>\n'+
            '</a>\n'+
        '</div>\n'
    }
}