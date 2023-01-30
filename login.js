const usernameElement = document.getElementById("username");
const passwordElement = document.getElementById("password");
const loginButton = document.getElementById("submitForm");
const loginErrorMsg = document.getElementById("login-error-msg");

localStorage.setItem("username", "droy");
localStorage.setItem("password", "test123");

window.history.forward();

function noBack() {
    window.history.forward();
}

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = usernameElement.value;
    const password = passwordElement.value;

    if (username === localStorage.getItem("username") && password === localStorage.getItem("password")) {
        location.href = './resume.html';
    } else {
        loginErrorMsg.style.opacity = 1;
    }
})