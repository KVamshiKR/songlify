console.log("Lets write JS");
let currentsong = new Audio();


function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}


async function getSongs(){
let a = await fetch("http://127.0.0.1:5500/files/songs/");
let response= await a.text();
let div = document.createElement("div")
div.innerHTML = response;
let anchors = div.getElementsByTagName("a")
let songs = []
for (let index = 0; index < anchors.length; index++) {
    const element = anchors[index];
if(element.href.endsWith(".mp3")){
    songs.push(element.href.split("/songs/")[1])
}
}
return songs;
}

const playmusic = (track, pause = false) => {

  currentsong.src = "/files/songs/" + track;
  if (!pause) {
    currentsong.play()
    play.src = "files/pause.svg"
    
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

 }


async function main() { 
    let songs = await getSongs();
    playmusic(songs[0], true);
    console.log(songs);
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML= songUL.innerHTML + ` <li>
        <img src="files/music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Song artist</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img src="files/playnow.svg" alt="">
        </div>
      </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => { 
      e.addEventListener("click", element => {
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playmusic(e.querySelector(".info").firstElementChild.innerHTML)
      })
     })

     play.addEventListener("click", () => {
      if (currentsong.paused) {
        currentsong.play()
        play.src = "files/pause.svg"
      }
      else{
        currentsong.pause()
        play.src = "files/play.svg"
      }
      })

      currentsong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${
          formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
          document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 +"%";
      })

      document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) *100
        document.querySelector(".circle").style.left = percent + "%";

        currentsong.currentTime = ((currentsong.duration) * percent)/100;
      })
    
    
} 

main();     