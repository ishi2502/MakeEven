import {
  app,
  database,
  auth,
  onAuthStateChanged,
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "./config.js";
import { arrayUnion } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

var queryString = location.search.substring(1);
var a = queryString.split("|"); //taken from search.js
var rid = a[0];

// console.log(rid);

const firstname = document.querySelector(".firstname");
const lastname = document.querySelector(".lastname");
const country = document.querySelector(".country");
const state = document.querySelector(".state");
const bio = document.querySelector(".bio");
const img = document.getElementById("output");
const nooffriends = document.getElementById("friends");

firstname.readOnly = true;
lastname.readOnly = true;
country.readOnly = true;
state.readOnly = true;
bio.readOnly = true;
img.readOnly = true;

const q = query(
  collection(database, "friendchat"),
  where("parentid", "==", rid)
);
// console.log("hi");
// console.log(rid);
var friendcount;
getDocs(q).then((querySnapshot) => {
  // console.log("hi");
  querySnapshot.forEach((docdata) => {
    friendcount = docdata.data().friendids.length;
  });
});

function viewDetails() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q = query(collection(database, "users"), where("uid", "==", rid));
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((docdata) => {
          if (!docdata.data().formsubmitted) {
            alert("Please create your profile to continue");
            window.location.href = "editprofile.html";
          }
          const docRef = doc(database, "users", docdata.id);
          document.querySelector(".firstname").value =
            docdata.data().firstname + docdata.data().lastname || "";
          document.querySelector(".fullname").innerHTML =
            docdata.data().firstname + docdata.data().lastname;
          document.querySelector(".country").value =
            docdata.data().country || "";
          document.querySelector(".state").value = docdata.data().state || "";
          document.querySelector(".bio").value =
            docdata.data().bio || "No bio availaible";
          document.querySelector("#friends").innerHTML =
            "Friends: " + friendcount;
          document.querySelector("#logintime").innerHTML =
            "Last active on: " + docdata.data().lastlogin;
          const img = document.getElementById("output");
          img.src = docdata.data().profilephotourl;
        });
      });
    } else {
      alert("Please login to continue");
      window.location.href = "login.html";
    }
  });
}

window.onload = viewDetails;
const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
  // console.log(user);
  // console.log(user.uid);
  const btn = document.getElementById("chatbtn");
  btn.addEventListener("click", async () => {
    const q = await query(
      collection(database, "users"),
      where("uid", "==", rid)
    );
    chat_option(user.uid, rid);
    chat_option(rid, user.uid);

    setTimeout(() => {
      window.location.href = "chat.html";
    }, 400);
  });
});
let fname;
const chat_option = async (fid, userid) => {
//   console.log("in function");
  const q = await query(
    collection(database, "friendchat"),
    where("parentid", "==", userid)
  );
//   console.log("query");
  await getDocs(q).then(async (querySnapshot) => {
    // console.log("getdoc");
    await querySnapshot.forEach(async (docdata) => {
      const docRef = await doc(database, "friendchat", docdata.id);
      const fids = docdata.data().friendids;
      // console.log(fids);
      let flag = 0;
      const q = await query(
        collection(database, "users"),
        where("uid", "==", fid)
      );
      // console.log("qe");
      //to update fname if changed in profile
      await getDocs(q).then(async (querySnapshot) => {
        // console.log("getdoc for name");
        await querySnapshot.forEach(async (docd) => {
          fname = await docd.data().firstname;
        //   console.log(fname);

          for (let i = 0; i < fids.length; i++) {
            if (fids[i].fid == fid) {
              flag = 1;
            //   console.log(fname);
              // console.log(docdata.data().friendids[i].fname);
              fids[i].fname = fname;
            //   console.log(fids);
            //   console.log("update doc");
              await updateDoc(docRef, {
                friendids: fids,
              });
              break;
            }
          }
          if (flag == 0) {
            // console.log("update doc");
            await updateDoc(docRef, {
              friendids: arrayUnion({ fid, fname }),
            });
          }
        });
      });
    });
  });
  // console.log("function end");
};
