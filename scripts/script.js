/*get all nodes for Frames and buttons */
let themeSelect=document.getElementById("themeStyleSelectorId");
let frameSearchBar=document.getElementById("searchSectionBarId");
let frameSearch=document.getElementById("searchSectionId")
let frameSuggestion=document.getElementById("suggestionsSectionId");
let frameTrends=document.getElementById("trendSectionId");
let frameGifCreator=document.getElementById("gifCreatorId");
let frameMyGif=document.getElementById("myGifShowId");
let navBarFrame=document.getElementById("navBarContainerId");
let navBarItems=document.getElementById("navBarItemsId");
let logoType=document.getElementById("logoId");
let closeWinBnt=document.getElementById("closeWindowId");
let creationBarTimer=document.getElementById("creationBarTimerId");
let returnBtn=document.getElementById("returnArrowId");
let frameButtonSuggest=document.getElementById("searchTagsId");
let btnCreateGif=document.getElementById("btnCreateGifId");
let btnMyGifs=document.getElementById("btnMyGifsId");
let titleSearch=document.getElementById("searchResultTitleId");
let themeBtn=document.getElementById("themeSelectorId");
let dropDownlist=document.getElementById("dropDownListId");
let sDay=document.getElementById("sailorDayId");
let sNight=document.getElementById("sailorNightId");
let suggest=document.getElementById("suggestedContainerId");
let suggestTitle=document.getElementById("suggestedTitleId");
let searchBtn=document.getElementById("searchButtonid");            //Boton para comenzar las busquedas
let inputText=document.getElementById("searchBarId");               //Entrada de texto para las busquedas
let searchSuggestion=document.getElementById("searchSuggestionsId");//En este div se insertaran las sugerencias del autocompletar
let searchGrid=document.getElementById("searchGridId");
let trendGrid=document.getElementById("trendGridId");
//----------------------------------------------------------

logoType.addEventListener("click",reloadInit);
returnBtn.addEventListener("click",reloadInit);
closeWinBnt.addEventListener("click",reloadInit);
themeBtn.addEventListener('click',changeTheme);
sDay.addEventListener('click',getDayTheme);
sNight.addEventListener('click',getNightTheme);
inputText.addEventListener('input',getInputText);
searchBtn.addEventListener('click',startSearch);
btnCreateGif.addEventListener('click',createGif)
btnMyGifs.addEventListener('click',goToMyGif);

//----------------------------------

titleSearch.style.display="none";
frameGifCreator.style.display='none';
frameMyGif.style.display='none';
returnBtn.style.display='none';

/*Seleccion de temas de gifos*/
function getDayTheme(){
    logoType.src="./images/gifOF_logo.png"
    localStorage.setItem("ThemeSelector", "saylorDay");
    themeSelect.setAttribute('href', "./styles/StylesSD.css");
}

function getNightTheme(){
    logoType.src="./images/gifOF_logo_dark.png"
    localStorage.setItem("ThemeSelector", "saylorNight");
    themeSelect.setAttribute('href', "./styles/StylesSN.css");
}

function changeTheme(){
    if(dropDownlist.style.display==="none"){
        dropDownlist.style.display="block";
    }else{
        dropDownlist.style.display="none";
    }
}
document.addEventListener("keydown", e => {     /*Para cerrrar el dropDown con el escape*/
    if (e.key === "Escape") {
        dropDownlist.style.display="none";
    }
});

/*Este bloque se encarga de buscar las sugerencias y mostrarlas en el bloque de sugerencias*/
const suggestionTopics = [
    "bob+esponja",
    "rick+and+morty",
    "los+simpsons",
    "star+wars",
    "back+to+the+future",
    "metallica",
    "supernatural",
    "super+nintendo",
    "arcade",
    "cats",
    "dogs",
    "guitar",
    "nintendo",
    "steven+spielberg",
    "terminator",
    "south+park",
    "friends",
    "jim+carrey",
    "iron+man",
    "marvel",
    "x-men"
];

let urlBaseSuggestions="https://api.giphy.com/v1/gifs/search?q="
let apiKey="&api_key=4OLPtRyw3qeOejkVEW1ye74AGXqek4oc"

let lim=4;
let limit="&limit="+lim;

function getRandomElement(array) {
    return Math.floor(Math.random() * array.length);
}

async function fetchGifSuggestion() {
    const suggestion = getRandomElement(suggestionTopics);
    const gifsSuggestions = await fetch(urlBaseSuggestions+suggestionTopics[suggestion]+apiKey+limit);
    const jsonResult= await gifsSuggestions.json();
    suggestTitle.innerHTML="Hoy te sugerimos: "+ suggestionTopics[suggestion].split('+').join(' ');
    return jsonResult;
}

let data = fetchGifSuggestion();
data.then(function(res){
    for(i=0;i<lim;i++){
        suggest.innerHTML+=
        '<div class="gifSuggested">\n'+
            '<div class="gifSuggestedHeader">\n'+
            '<button class="windowElementClose"></button>\n'+
            res.data[i].title+'\n'+
            '</div>\n'+
            '<div class="gifSuggestedContent">\n'+
                '<img class="gifContent" id="suggestedCardImageId" src='+res.data[i].images.original.url+'>\n'+
                '<a href="'+res.data[i].bitly_url+'" target="_blank" type="button" class="btnMore"><span class="btnMoreAction">Ver más...</span></a>\n'+
            '</div>\n'+
        '</div>\n';
    }
})
/*--------------------------------------------------------------------------------------------------*/
/*Este bloque de codigo se encarga de la seccion de busquedas*/
let autoCompletBaseApi='https://api.giphy.com/v1/gifs/search/tags?';
let autoTam=6;
let autoLimit='&limit='+autoTam;
let text;
let query;

let botonesAuto=[autoTam];                                          //Es la cantidad de sugerencias del autocompletar

function getInputText(){                                                    /*Tiene un comportamiento extraño cuando no encuentra valores*/
    searchBtn.disabled=false;                                   
    let word=inputText.value;
    checkEmpty(word);
    text=word.split(' ').join('+');                                     //Si el texto no esta vacio entonces reemplazo los espacios por signos +
    if(text!==''){
        searchSuggestion.style.display='block';
        query='&q='+text;
        let autoCurl=autoCompletBaseApi+apiKey+autoLimit+query;
        async function getAuto(){
            let data= await fetch(autoCurl);
            let jsonData=await data.json();
            return jsonData;
        }
        let autoSg=getAuto();
        autoSg.then(function(resx){       
            if(resx.pagination.count===0){
                searchSuggestion.style.display='none';
                console.log("Entro aca!!!");
            }                                                        /*Lo bueno de esto es que a medida que creo los elementos les puedo ir agregando un eventlistener*/
            searchSuggestion.innerHTML='';                          /*La clave de esto fue el uso de event.target.id */
            for(i=0;i<resx.pagination.count;i++){
                botonesAuto[i]=document.createElement("button");
                botonesAuto[i].setAttribute("id","btnSuggestTextId"+i);
                botonesAuto[i].setAttribute("class","searchElement");
                botonesAuto[i].textContent=resx.data[i].name;
                botonesAuto[i].addEventListener('click',getText);
                searchSuggestion.appendChild(botonesAuto[i]);
            }
        })
    }
}
function checkEmpty(word){
    if(word===''){
        searchBtn.disabled=true;
        searchSuggestion.style.display='none';                           //Si el input text esta vacio entonces ocultamos el div y deshabilitamos el boton de busquedas
    }
}
function getText(){
    inputText.value=document.getElementById(event.target.id).innerHTML;
    searchSuggestion.style.display='none';
    startSearch();
}
function startSearch(){
    
function setElementsShow() {
    return new Promise(resolve => {
        console.log("Habilitando barra de titulo......");  
        frameSuggestion.style.display='none';                       //Esconde las sugerencias
        frameTrends.style.display='none';                           //Esconde los trends    
        frameGifCreator.style.display='none';                       //Esconde la seccion de creacion de videos
        frameMyGif.style.display='none';                            //Estonde la seccion de mis gifs
        searchSuggestion.style.display='none';                      //Esconde la el div con las sugerencias del autocompletar.
        titleSearch.style.display="block";                          //Muestro la barra de titulo de la busqueda
        frameSearch.style.display='block';
        frameButtonSuggest.style.display='block';
        resolve('Se habilitaron los elementos');
    });
  }

async function gotoSearch(){
   const result = await setElementsShow();
    return result;
}
gotoSearch().then(function(res){
    //window.location.href="#gifImageId",true;
    console.log("windows location executed: "+res);
})

    let textSearch=inputText.value;                             //Guardo el valor actual del input text de busquedas
    let searchWord=textSearch.split(" ").join("+");             /*Para poder meter los resultados - aca va a servir el mismo codigo del scroll infinito del */
    saveHistoryToLocalStorage(searchWord);
    titleSearch.innerHTML="Resultados de busqueda: "+textSearch;                                                            /*trending gifs*/
    
    let endPointSearch='https://api.giphy.com/v1/gifs/search?';
    let tamSearch=4*4;
    let searchLim='&limit='+tamSearch;
    let searchQ='&q='+searchWord;
    let urlSearch=endPointSearch+searchQ+searchLim+apiKey;

    historySeach = getHistoryToLocalStorage();
    getMyHistory(historySeach);
    
    searchGrid.innerHTML='';

    async function getSearch() {
        const response = await fetch(urlSearch);
        const json = await response.json();
        return json;
    }

    let search = getSearch();
    
    search.then(function(resul){
        for(i=0;i<tamSearch;i++){
            let titleSearch='#'+(resul.data[i].title).split(' ').join(' #');
            //console.log(i+": "+res.data[i].images.original.width+ "  "+res.data[i].images.original.height);
            searchGrid.innerHTML+=
                '<div class="gifSimple" id="gifSimpleId">\n'+  //style="width:100px;height: 60px" 
                '<a href="'+resul.data[i].bitly_url+'" target="_blank">\n'+
                        '<img class="gifSimpleContent" id="gifImageId" src="'+resul.data[i].images.original.url+'">\n'+
                        '<div class="gifSimpleHeader" id="gifCardId">\n'+
                        titleSearch+'\n'+
                        '</div>\n'+
                    '</a>\n'+
                '</div>\n'
        }
    });
}
/*-----------------------------------------------------------------------------------------*/
async function saveHistoryToLocalStorage(searchedText) {
    var reg = Date.now();
    localStorage.setItem(`SearchHistory-${reg}`, searchedText);
}

let historySeach;   //variable para obtener el historial de busquedas

function getHistoryToLocalStorage() {
    const historySeach = {};
    for(var keyVal in localStorage){
        if(keyVal.startsWith("SearchHistory-")){
            historySeach[keyVal] = localStorage.getItem(keyVal);
        }else{
            null;
        }
    };
    return historySeach;
}

function getMyHistory(historySeach) {    
    let seachArray=[];
    let searched = Object.values(historySeach);
    let buttonList=[10];
    
    for(i=0;i<searched.length;i++){
        seachArray[i]=searched[i];
    }

    const newSeachArray = seachArray.filter((j, index) => seachArray.indexOf(j) === index)  //Con esto filtro para que no aparezcan dos busquedas iguales ya hechas
    let cleanedArray=cleanArray(newSeachArray); //Borro busquedas vacias

    frameButtonSuggest.innerHTML='';
    for(i=0;i<cleanedArray.length;i++){
        buttonList[i]=document.createElement("button");
        buttonList[i].setAttribute("id","btnSuggestListId"+i);
        buttonList[i].setAttribute("class","btnSuggest");
        buttonList[i].textContent=cleanedArray[i].split('+').join(' ');
        buttonList[i].addEventListener('click',getText);
        frameButtonSuggest.appendChild(buttonList[i]);
    }
}
 
function cleanArray( actual ){                              //Funcion para eliminar elementos vacios de un array
    var newArray = new Array();
    for( var i = 0, j = actual.length; i < j; i++ ){
        if ( actual[ i ] ){
          newArray.push( actual[ i ] );
      }
    }
    return newArray;
  }

function setTheme() {
    const theme =[];
    let found;
    for(var keyVal in localStorage){
        if(keyVal.startsWith("ThemeSelector")){
            theme[keyVal]= localStorage.getItem(keyVal);
            found=true;
        }else{
            null;
        }
    }

    if(found){
        if(theme.ThemeSelector =="saylorDay"){
            getDayTheme();
        }else{
            getNightTheme();
        }
    }else{
        console.log("Seteando el tema first time....")
        localStorage.setItem("ThemeSelector", "saylorDay");
        getDayTheme();
        //Si no esta lo seteamos por primera vez y cargamos
    }
}
setTheme();

/*----------------------------------------------------------------------------------------------------------------------------*/
/*Esta parte del codigo trae el trending de gifs*/
let endPointTrending='https://api.giphy.com/v1/gifs/trending?';
let tam=4*4;
let trendLim='&limit='+tam;

let urlTrending=endPointTrending+apiKey+trendLim;
let trendingCount=tam;
let trendingTotalCount=0;
let trendingOffset=0
    
async function getTrending() {
        const response = await fetch(urlTrending);
        const json = await response.json();
        return json;
    }

let trending = getTrending();
trending.then(function(resu){

    for(i=0;i<tam;i++){
        let titleTrend='#'+(resu.data[i].title).split(' ').join(' #');
        //console.log(i+": "+res.data[i].images.original.width+ "  "+res.data[i].images.original.height);
        trendGrid.innerHTML+=
            '<div class="gifSimple" id="gifSimpleId">\n'+  //style="width:100px;height: 60px" 
            '<a href="'+resu.data[i].bitly_url+'" target="_blank">\n'+
                    '<img class="gifSimpleContent" id="gifImageId" src="'+resu.data[i].images.original.url+'">\n'+
                    '<div class="gifSimpleHeader" id="gifCardId">\n'+
                    titleTrend+'\n'+
                    '</div>\n'+
                '</a>\n'+
            '</div>\n'
    }
});

function reloadInit(){
    returnBtn.style.display='none';
    navBarItems.style.display='flex';
    frameSuggestion.style.display='block';
    frameTrends.style.display='block';
    frameSearchBar.style.display='block';
    frameSearch.style.display='none';
    frameGifCreator.style.display='none';
    frameMyGif.style.display='none';
    frameButtonSuggest.style.display='none';
}

function createGif(){
    
    frameGifCreator.style.display='block';
    createGuifoFrame.style.display="block"               //paso 1 cuadro de dialogo para comenzar la captura y tomar el medio de video
    stepsFrame.style.display="none";                    //paso 2 vista previa con boton capturar solo
    creationBar.style.display="none"                        // paso 3 
    uploadRedoFrame.style.display="none"                    // paso 4 
    uploadingFrame.style.display="none";                //paso 5 subiendo gif    
    uploadOptionsFrame.style.display="none";            //paso 6 opciones una vez subido el gif    
    videoCam.style.display="block"; 
    videoGifId.style.display="none";
    startBtn.style.display="flex";
    navBarItems.style.display='none';
    frameSuggestion.style.display='none';
    frameTrends.style.display='none';
    frameSearchBar.style.display='none';
    frameSearch.style.display='none';
    frameMyGif.style.display='block';
}

function goToMyGif(){
    returnBtn.style.display='block';
    frameSuggestion.style.display='none';
    frameTrends.style.display='none';
    frameSearchBar.style.display='none';
    frameSearch.style.display='none';
    frameGifCreator.style.display='none';
    frameMyGif.style.display='block';
}
