
export function render(){
}

//TOPPLISTOR OCH LIKNANDE SOM SKA VISAS DIREKT
const toplistEl = document.getElementById("toplist");

window.onload = init;

function init(){
    getNewReleases();
}

//KONVERTERA DATUM TILL RÄTT FORMAT
function convertDate(){
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).substr(-2);
  const day = ('0' + date.getDate()).substr(-2);
  const dateStr = [year, month, day].join('');
    return dateStr;
}

//HÄMTA RELEASER SOM FINNS PÅ NÅGON AV DE LISTADE TJÄNSTERNA
async function getNewReleases(){
    let todaysDate = convertDate();
    let url = `https://api.watchmode.com/v1/releases/?apiKey=x9qDINJNIc1MPsajH51j0H0c7AWebXMdUXHKru2C&start_date=${todaysDate}`;
    const response = await fetch(url, {method: 'Get'});
    const result = await response.json();
  
    let viewable = result.releases;
    let onlyUS = [];
 
    viewable.forEach((res) => {
      if(res.source_name === "Netflix" || res.source_name === "discovery+" || 
      res.source_name === "Hulu" || res.source_name === "Bravo" || 
      res.source_name === "Paramount+" || res.source_name === "Amazon Prime Video" 
      || res.source_name ===  "HBO Max"){
        if(res.poster_url !== ""){
        onlyUS.push(res);
        return onlyUS;
        }      
      }
    })  
   showReleases(onlyUS);
}

//VISA RELEASERNA AUOTMATISKT VID LADDNING AV SIDAN, 
async function showReleases(onlyUS){
    let newStreaming = onlyUS;

    toplistEl.innerHTML = "";

    for(let i = 0; i < newStreaming.length; i++){
             //Skapa div med class och id
        let listOfNewsEl = document.createElement("div");
        listOfNewsEl.dataset.id = newStreaming[i].imdb_id;
        listOfNewsEl.classList.add("toplist-items");
        let streamingPoster = newStreaming[i].poster_url;

        listOfNewsEl.innerHTML = `<div class="new-item-img">
        <img src = ${streamingPoster}></div>
        <div class="new-item-info">
        <h4>${newStreaming[i].title}</h4>
        <h5>${newStreaming[i].source_release_date}</h5>
        <h5>${newStreaming[i].source_name}</h5>
        </div>
        `;

        toplistEl.appendChild(listOfNewsEl);
    };   
    
}

