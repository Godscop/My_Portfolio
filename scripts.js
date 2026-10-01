const starInputs = document.querySelectorAll(".star-rating input");
const starRating = document.querySelector(".star-rating");
const toast = document.querySelector(".toast");

let awaitingRetry = false;
let toastTimeoutId;

function playAudio(src) {
    if(!src) return;
    const audio = new Audio(src);
    audio.play().catch(() => {
        // Fails silently - e.g. if audio file hasn't been recorded/added yet.
    });
}

function flyToastToStars() {
    const starsRect = starRating.getBoundingClientRect();
    const targetX = starsRect.left + starsRect.width / 2;
    const targetY = starsRect.top + starsRect.height / 2;
    const dx = targetX - window.innerWidth / 2;
    const dy = targetY - window.innerHeight / 2;

    toast.style.setProperty("--dx", dx + "px");
    toast.style.setProperty("--dy", dy + "px");
    toast.classList.add("fly-out");
    toast.classList.remove("show");
}

function showToast(message, duration, audioSrc, flyOut){
    clearTimeout(toastTimeoutId);
    toast.classList.remove("fly-out");
    toast.textContent = message;
    toast.classList.add("show");

    if(audioSrc){
        playAudio(audioSrc);
    }

    toastTimeoutId = setTimeout(() => {
        if(flyOut){
            flyToastToStars();
        } else {
            toast.classList.remove("show");
        }
    }, duration);
}

function lockStars(seconds){
    starInputs.forEach((s) => {
        s.disabled = true;
    });
    setTimeout(() => {
        starInputs.forEach((s) => {
            s.disabled = false;
        });
    }, seconds*1000);
}

function launchConfetti() {
    const colors = ["#d9b36a", "#ff5c8a", "#5cc8ff", "#8dff5c", "#ffb347"];

        for(let i = 0; i < 200; i++){
         const piece = document.createElement("div");
          piece.className = "confetti-piece";
          piece.style.setProperty("--dx", (Math.random() - 0.5) * window.innerWidth + "px");
          piece.style.setProperty("--dy", (Math.random() - 0.5) * window.innerHeight + "px");
          piece.style.setProperty("--rotation", Math.random() * 1080 + "deg");
          piece.style.background = colors[Math.floor(Math.random() * colors.length)];
          piece.style.animationDuration = 1.4 + Math.random() * 0.8 + "s";
          piece.style.animationDelay = Math.random() * 0.15 + "s";
          document.body.appendChild(piece);

          setTimeout(() => piece.remove(), 2400);
    }
}

starInputs.forEach((input) => {
  input.addEventListener("click", () => {
    const stars = input.value;

    // Second time picking 1 star in a row — the finale
    if (stars === "1" && awaitingRetry) {
      awaitingRetry = false;
      launchConfetti();
      showToast(
        "You really had to do it. Thanks for being a party pooper.",
        4000,
        "assets/audio/party-pooper.mp3",
        false
      );
      return;
    }

    // First time picking 1 star — the teasing sequence
    if (stars === "1") {
      awaitingRetry = true;
      showToast(
        "Hmmm... you really had to do it. Let's try that again.",
        3000,
        "assets/audio/teaser.mp3",
        true
      );
      lockStars(10);

      setTimeout(() => {
        showToast("Go on, rate me again.", 4000, "assets/audio/nudge.mp3", false);
      }, 6000);

      return;
    }

    // Any normal rating (2–5 stars)
    awaitingRetry = false;
    showToast(`Thanks for the ${stars}-star rating!`, 5000, "assets/audio/thanks.mp3", false);
  });
});