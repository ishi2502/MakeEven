import {
  auth,
  onAuthStateChanged,
  database,
  doc,
  collection,
  query,
  where,
  getDocs,
  signOut,
} from "./config.js";

const profileBtn = document.getElementById("profile-button");
const loginBtn = document.getElementById("Login_button");
const outBtn = document.getElementById("outBtn");
const startbtn = document.getElementsByClassName("start-btn")[0];
const startbtnn = document.getElementsByClassName("start-btn")[1];
//.......................................get current user.........................................//

const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const q = query(
      collection(database, "users"),
      where("uid", "==", user.uid)
    );
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((docdata) => {
        const docRef = doc(database, "users", docdata.id);
        const img = document.getElementById("profile-picture");
        img.src = docdata.data().profilephotourl;
      });
    });
    loginBtn.style.display = "none";
    profileBtn.style.display = "block";
    startbtn.addEventListener("click", () => {
      window.location.href = "search.html";
    });
    startbtnn.addEventListener("click", () => {
      window.location.href = "search.html";
    });
    // ...
  } else {
    // User is signed out
    // ...
    loginBtn.style.display = "block";
    profileBtn.style.display = "none";
    startbtn.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
    startbtnn.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }
});

function logout() {
  signOut(auth)
    .then(() => {
      //   alert("user logged out");
      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

outBtn.addEventListener("click", logout);
