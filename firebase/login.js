import {auth,app,collection,where,doc, getDocs,database,onAuthStateChanged,signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, updateDoc,query } from './config.js';
//............................REFERENCES............................//
const email = document.getElementById("login_email");
const pswrd = document.getElementById("login_password");

const login = document.getElementById("login");
const loginbygoogle = document.getElementById("googlesignin");
const loginbyfb = document.getElementById("facebooksignin");

//...............................................login USER .........................................//   
function LoginUser() {
        signInWithEmailAndPassword(auth, email.value, pswrd.value)
        .then((userCredential) => {
            // Signed in 
            var uid = userCredential.user.uid;
            alert('Logged in successfully');
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode,errorMessage);
        });
        
}

//.....................................................Google login...........................................//
function googlelogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            // console.log(result);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log(errorMessage);
        });
}

//.................................................Facebook login...................................//
function facebooklogin() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;

            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;

            // console.log(result);
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = FacebookAuthProvider.credentialFromError(error);

            // ...
            console.log(errorMessage);
        });
}

//.......................................get current user.........................................//
const user = auth.currentUser;
onAuthStateChanged(auth, async(user) => {
    if (user) {
        const uid = user.uid;
        // console.log("current user: ", uid);
        const currentdate = new Date();
            var lastlogindate = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear();
        const q = await query(collection(database, "users"), where("uid", "==", uid));
        // console.log(q);
        await getDocs(q)
        .then((querySnapshot) => {
            // console.log("yo");
            // console.log(querySnapshot)
            querySnapshot.forEach((docdata) => {
                // console.log("yo");
                const docRef = doc(database, "users", docdata.id);
                updateDoc(docRef,{lastlogin:lastlogindate});
            })
        })
        .catch(err=>{
            console.log(err)
        })
        setTimeout(()=>{window.location.href="index.html";},400);
    } 
    else {
    }
});

//..................................................ASSIGN THE EVENTS..............................//   
login.addEventListener("click", LoginUser);
// loginbygoogle.addEventListener("click", googlelogin);
// loginbyfb.addEventListener("click", facebooklogin);