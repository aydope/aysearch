"use strict";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const autocompleteList = document.querySelector("#autocomplete-list");
const resetBtn = document.querySelector("#reset-btn");
const micBtn = document.querySelector("#mic-btn");
const micIcon = micBtn.firstElementChild;
const info = document.querySelector(".info");

const suggestions = [
  "Aydope",
  "AySearch",
  "Google Maps",
  "Google Translate",
  "Google Images",
  "YouTube",
  "ChatGPT",
  "Weather today",
  "News",
  "Football scores",
  "Stock market",
  "AI trends",
];

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  autocompleteList.innerHTML = "";
  if (!query) {
    autocompleteList.classList.add("hidden");
    resetBtn.classList.add("hidden");
    return;
  }
  resetBtn.classList.remove("hidden");

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(query));

  if (filtered.length > 0) {
    filtered.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.className =
        "px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-700 text-[15px] transition";
      li.addEventListener("click", () => {
        searchInput.value = item;
        autocompleteList.classList.add("hidden");
      });
      autocompleteList.appendChild(li);
    });
    autocompleteList.classList.remove("hidden");
  } else {
    autocompleteList.classList.add("hidden");
  }
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  resetBtn.classList.add("hidden");
  autocompleteList.classList.add("hidden");
  searchInput.focus();
});

document.addEventListener("click", (e) => {
  if (!searchForm.contains(e.target)) {
    autocompleteList.classList.add("hidden");
  }
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  const url = `https://www.google.com/search?q=${encodeURIComponent(
    query
  )}&ref=aydope`;
  window.location.href = url;
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "fa-IR";

  micBtn.addEventListener("click", () => {
    if (micIcon.classList.contains("fa-microphone")) recognition.start();
    else recognition.stop();
  });

  recognition.addEventListener("start", () => {
    micIcon.classList.replace("fa-microphone", "fa-microphone-slash");
    searchInput.focus();
  });

  recognition.addEventListener("end", () => {
    micIcon.classList.replace("fa-microphone-slash", "fa-microphone");
    searchInput.focus();
  });

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[event.resultIndex][0].transcript;
    if (transcript.toLowerCase().trim() === "stop recording")
      recognition.stop();
    else if (!searchInput.value) searchInput.value = transcript;
    else {
      if (transcript.toLowerCase().trim() === "go") searchForm.submit();
      else if (transcript.toLowerCase().trim() === "reset input")
        searchInput.value = "";
      else searchInput.value = transcript;
    }
  });

  info.textContent = 'Voice Commands: "stop recording", "reset input", "go"';
} else {
  info.textContent =
    "Your browser does not support Speech Recognition\n Try Google Chrome!";
}
