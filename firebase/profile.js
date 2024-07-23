import { app, database, auth, signOut, onAuthStateChanged, doc, collection, query, where, getDocs } from "./config.js";

const logoutBtn = document.querySelector("#Logout-btn")

const firstname = document.querySelector(".firstname");
const lastname = document.querySelector(".lastname");
const phoneno = document.querySelector(".phoneno");
const country = document.querySelector(".country");
const state = document.querySelector(".state");
const bio = document.querySelector(".bio");
const radioButtons = document.getElementsByName('age-group');
const img = document.getElementById('output');
const h2name = document.getElementById('your-name');

firstname.readOnly = true;
lastname.readOnly = true;
phoneno.readOnly = true;
country.readOnly = true;
state.readOnly = true;
bio.readOnly = true;
radioButtons.readOnly = true;


function viewDetails() {
    const user = auth.currentUser;
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const q = query(collection(database, "users"), where("uid", "==", user.uid));
            getDocs(q)
                .then((querySnapshot) => {
                    querySnapshot.forEach((docdata) => {
                        if (!docdata.data().formsubmitted) {
                            alert("Please create your profile to continue");
                            window.location.href = 'editprofile.html';
                        }
                        const docRef = doc(database, "users", docdata.id);
                        document.querySelector("#your-name").innerHTML = "Hi, " + docdata.data().firstname || '';
                        document.querySelector(".firstname").value = docdata.data().firstname || '';
                        document.querySelector(".lastname").value = docdata.data().lastname || '';
                        document.querySelector(".phoneno").value = docdata.data().phoneno || '';
                        document.querySelector(".country").value = docdata.data().country || '';
                        document.querySelector(".state").value = docdata.data().state || '';
                        document.querySelector(".bio").value = docdata.data().bio || '';

                        const radioButtons = document.getElementsByName('age-group');
                        const selectedValue = docdata.data().agegroup;
                        for (let i = 0; i < radioButtons.length; i++) {
                            if (radioButtons[i].value === selectedValue) {
                                radioButtons[i].checked = true;
                            }
                        }

                        const img = document.getElementById('output');
                        img.src = docdata.data().profilephotourl;
                    })
                })
        }
        else {
            // alert("User logged out");
            window.location.href = 'login.html';
        }
    })
}

function logout() {
    signOut(auth).then(() => {
        alert("User logged out");
        window.location.href = 'index.html';
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);

    });
}

logoutBtn.addEventListener("click", logout);
window.onload = viewDetails;