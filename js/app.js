if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((reg) =>
      console.log("[Service worker registered with the scope]", reg.scope)
    )
    .catch((err) =>
      console.log("[Service worker was not installed successfully]", err)
    );
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  console.log("[beforeinstallprompt fired]");
  event.preventDefault();

  deferredPrompt = event;
  document.getElementById("install-btn").style.display = "inline-block";
});

document.getElementById("install-btn").addEventListener("click", (event) => {
  deferredPrompt.prompt();

  deferredPrompt.userChoice.then((choice) => {
    if (choice === "accepted") console.log("User accepted the install prompt");
    else console.log("User denied the install prompt");
  });
});

window.addEventListener("appinstalled", (event) =>
  console.log("Installed successfully")
);
