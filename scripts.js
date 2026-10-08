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


/* ---------- Live GitHub repos (projects.html) ---------- */
const repoList = document.getElementById("repo-list");
const repoStatus = document.getElementById("repo-status");

async function loadRepos() {
  if (!repoList) return; // this section doesn't exist on this page

  try {
    const response = await fetch(
      "https://api.github.com/users/Godscop/repos?sort=updated&per_page=6"
    );

    if (!response.ok) {
      throw new Error("GitHub API responded with " + response.status);
    }

    const repos = await response.json();
    repoStatus.hidden = true;

    repos.forEach((repo) => {
      const card = document.createElement("article");
      card.className = "repo-card";

      const name = document.createElement("h3");
      name.textContent = repo.name;

      const desc = document.createElement("p");
      desc.textContent = repo.description || "No description provided.";

      const meta = document.createElement("p");
      meta.className = "repo-meta";
      meta.textContent = (repo.language || "—") + " · ★ " + repo.stargazers_count;

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.textContent = "View repository";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "project-link";

      card.appendChild(name);
      card.appendChild(desc);
      card.appendChild(meta);
      card.appendChild(link);
      repoList.appendChild(card);
    });
  } catch (error) {
    repoStatus.textContent = "Couldn't load repositories right now — check back later.";
  }
}

loadRepos();

/* ---------- Live weather (index.html) ---------- */
const weatherStatus = document.getElementById("weather-status");

const weatherDescriptions = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Foggy", 51: "Light drizzle", 61: "Light rain",
  63: "Rain", 65: "Heavy rain", 80: "Rain showers", 95: "Thunderstorm",
};

async function loadWeather() {
  if (!weatherStatus) return; // this element doesn't exist on this page

  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-1.2921&longitude=36.8219&current_weather=true"
    );

    if (!response.ok) {
      throw new Error("Weather API responded with " + response.status);
    }

    const data = await response.json();
    const temp = Math.round(data.current_weather.temperature);
    const code = data.current_weather.weathercode;
    const description = weatherDescriptions[code] || "current conditions";

    weatherStatus.textContent = `Nairobi right now: ${temp}°C, ${description}`;
  } catch (error) {
    weatherStatus.textContent = "Weather unavailable right now.";
  }
}

loadWeather();