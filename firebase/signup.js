import { app, database, auth,createUserWithEmailAndPassword, collection, addDoc } from "./config.js";

//............................REFERENCES............................//
const email = document.getElementById("email");
const pswrd = document.getElementById("password");
const cnfrmpswrd = document.getElementById("cnfrmpassword");
const submit = document.getElementById("register_btn");

//..................................VALIDATION.........................//
function validation() {
    let nameregex = /^[a-zA-Z\s]+$/;
    let emailregex =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!emailregex.test(email.value)) {
        alert("Enter a valid email");
        return false;
    }

    if (pswrd.value != cnfrmpswrd.value) {
        alert("passwords does not match");
        return false;
    }
    return true;
}

//...............................................REGISTER USER TO FIREBASE.........................................//
function RegisterUser() {
    if (!validation()) {
        return;
    }
    createUserWithEmailAndPassword(auth, email.value, pswrd.value)
        .then((userCredential) => {
            const user = userCredential.user;

            addDoc(collection(database, "friendchat"), {
                parentid: user.uid,
                friendids: []
            }).then((docRef) => {
                // console.log("Document written with ID:", docRef.id);
            })

            
            const currentdate = new Date();
            var lastlogindate = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear();
            addDoc(collection(database, "users"), {
                uid: user.uid,
                email: email.value,
                profilephotourl: 'https://firebasestorage.googleapis.com/v0/b/make-even-d50ab.appspot.com/o/user.png?alt=media&token=a9ed9591-caab-4743-999d-a68810177340',
                formsubmitted:false,
                lastlogin:lastlogindate,
            }).then((docRef) => {
                // console.log("Document written with ID: ", docRef.id);
                alert("Account created successfully");
                window.location.href='editprofile.html';
            });

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode, errorMessage);
        });
}

//..................................................ASSIGN THE EVENTS..............................//
submit.addEventListener("click", RegisterUser);
