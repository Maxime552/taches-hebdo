function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("login-error");

  const users = {
    "admin": "admin123",
    "utilisateur": "user123"
  };

  if (users[username] && users[username] === password) {
    const isAdmin = username === "admin";
    sessionStorage.setItem("isAdmin", isAdmin);

    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app").style.display = "block";

    initApp();
  } else {
    error.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
  }
}

function initApp() {
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  // Remplir #app avec ton interface principale
  const app = document.getElementById("app");
  app.innerHTML = `
    <h2>Bienvenue ${isAdmin ? 'Admin' : 'Utilisateur'} !</h2>
    <p>Ici s'affichera ton calendrier et les tâches.</p>
  `;

  // Tu peux ensuite insérer ton code de calendrier/tâches/Firebase ici
}
