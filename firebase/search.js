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

const list = document.querySelectorAll(".menu-items li a");
const searchlink = list[1];
const mainDiv = document.getElementById("elements");
const inp = document.querySelector("#myInput");

searchlink.addEventListener("click", (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (user) {
    const q = query(
      collection(database, "users"),
      where("uid", "==", user.uid)
    );
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((docdata) => {
        if (!docdata.data().formsubmitted) {
          alert("Please create your profile to continue");
          window.location.href = "editprofile.html";
        } else {
          window.location.href = "search.html";
        }
      });
    });
  } else {
    alert("Please login to continue");
    window.location.href = "login.html";
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const q = query(
      collection(database, "users"),
      where("uid", "==", user.uid)
    );

    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((docdata) => {
        let qu;
        if (docdata.data().agegroup == "old") {
          qu = query(
            collection(database, "users"),
            where("agegroup", "==", "young")
          );
        } else {
          qu = query(
            collection(database, "users"),
            where("agegroup", "==", "old")
          );
        }

        const docsSnap = getDocs(qu);
        docsSnap.then((snap) => {
          snap.forEach((doc) => {
            let d = document.createElement("div");
            d.classList.add("element");
            let d1 = document.createElement("div");
            d1.classList.add("div1");
            let img = document.createElement("img");
            img.src = doc.data().profilephotourl;
            d1.appendChild(img);
            let d2 = document.createElement("div");
            d2.classList.add("search-content");
            let p1 = document.createElement("p");
            let p2 = document.createElement("p");
            let btn = document.createElement("button");
            btn.textContent = "CHAT";
            btn.setAttribute("class", "chatbtn");
            p1.setAttribute("class", "name");
            p1.innerText = doc.data().firstname + " " + doc.data().lastname;
            p2.innerText = doc.data().uid;
            p2.setAttribute("class", "uid");
            d2.appendChild(p1);
            d2.appendChild(p2);
            d2.append(btn);
            d.append(d1);
            d.append(d2);
            mainDiv.appendChild(d);

            btn.addEventListener("click", async() => {
              const fid = doc.data().uid;
              // console.log("A");
              await chat_option(user.uid, fid);
              // console.log("B");
              await chat_option(fid,user.uid);
              // console.log("C");
              
              setTimeout(()=>{window.location.href="chat.html";},400);
              
            })

            img.addEventListener("click",async()=>{
              window.location.href="seeprofileonsearch.html?"+doc.data().uid;
            })
          });
        });
      });
    });
  }
});

inp.addEventListener("keyup", (e) => {
  let filter = e.target.value.toUpperCase();
  let list = document.querySelectorAll("#elements .element");
  for (var i = 0; i < list.length; i++) 
  {
    let match = list[i]
      .getElementsByTagName("div")[1]
      .getElementsByTagName("p")[0];
    let textValue = match.textContent || match.innerHTML;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      list[i].style.display = "";
    } else {
      list[i].style.display = "none";
    }
  }
});
let fname;

//adding friend ids in firestore collection "friendchat"
const chat_option=async(fid, userid)=> {
  // console.log("in function");
  const q = await query(collection(database, "friendchat"), where("parentid", "==", userid));
  // console.log("query");
  await getDocs(q)
    .then(async(querySnapshot) => {
      // console.log("getdoc");
      await querySnapshot.forEach(async(docdata) => {
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
        await getDocs(q).then(async(querySnapshot) => {
          // console.log("getdoc for name");
          await querySnapshot.forEach(async(docd) => {
            fname = await docd.data().firstname;
            // console.log(fname);

            // if friend already exists and they have changed their name, updating it in the friend chat database
            for (let i = 0; i < fids.length; i++) {

              if (fids[i].fid == fid) {
                flag = 1;
                // console.log(fname);
                // console.log(docdata.data().friendids[i].fname);
                fids[i].fname=fname;
                // console.log(fids);
                // console.log("update doc");
                await updateDoc(docRef, {
                  friendids: fids
                })
                break;
              }
            }
            if (flag == 0) {
              // console.log("update doc");
              await updateDoc(docRef, {
                friendids: arrayUnion({ fid, fname })
              })
            }
          })
        })


      })
    })
  // console.log("function end");
}

