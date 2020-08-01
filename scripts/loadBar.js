videoGifId.addEventListener('timeupdate', function() {
    var time = this.currentTime;
    var timeDuration=this.duration;

    var percent=((time*100)/timeDuration).toFixed(2);
    changeProgress("loadBarId",percent);
});

function changeProgress(progressBarId, progressValue, animDurPerStep = 15) {
    var progressBar = document.getElementById(progressBarId);
    var oldProgressValue = -parseInt(
      window.getComputedStyle(progressBar).getPropertyValue("background-position")
    );
    if (progressValue > 100) progressValue = 100;
    else if (progressValue < 0) progressValue = 0;
    else progressValue = Math.round(progressValue / 10) * 10;
  
    var steps = Math.abs(oldProgressValue - progressValue) / 10;
    var totalAnimDur = animDurPerStep * steps;
  
    progressBar.style.transition = totalAnimDur + "ms steps(" + steps + ")";
    progressBar.style.backgroundPosition = -progressValue + "%";
  }

let timeUp;
let increment=0;

function startLoad() {
  timeUp = setInterval(showUpload, 200);
} /* Start */

function stopLoad() {
  clearInterval(timeUp);
} /* Stop */

function showUpload(){
  if(increment<100){
    increment+=10;
    changeProgress("uploadBarId",increment);
  }else{
    increment=0;
  }
}