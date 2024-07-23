import {auth,sendPasswordResetEmail } from './config.js'

const email = document.getElementById("login_email");
const resetbutton = document.getElementById("reset_btn");

function forgetpass() {
    sendPasswordResetEmail(auth, email.value)
        .then(() => {
            // Password reset email sent!
            // ..
            alert(
                "Password reset email has been sent, Please check you mail"
            );
            window.location = "login.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            alert(errorMessage);
        });
}
resetbutton.addEventListener("click", forgetpass);
