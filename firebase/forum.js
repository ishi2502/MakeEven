import {
  database,
  auth,
  onAuthStateChanged,
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
} from "./config.js";

import {
  arrayUnion,
  onSnapshot,
  orderBy,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const list = document.querySelectorAll(".menu-items li a");
const forumlink = list[3];

forumlink.addEventListener("click", (e) => {
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
          window.location.href = "forum.html";
        }
      });
    });
  } else {
    alert("Please login to continue");
    window.location.href = "login.html";
  }
});

const plus = document.getElementsByClassName("plus")[0];
const questionSection = document.getElementById("questionSection");
let flag = false;
let addQuesbtn;
if (plus) {
  plus.innerHTML = "<i class='fa fa-plus' style='font-size:24px'>";
  plus.addEventListener("click", (e) => {
    if (flag == false) {
      plus.innerHTML = "<i class='fa fa-close' style='font-size:24px'></i>";
      let div1 = document.createElement("div");
      div1.classList.add("questioncard");
      let div2 = document.createElement("div");
      div2.style.marginRight = "20px";
      let img = document.createElement("img");
      const user = auth.currentUser;
      const q = query(
        collection(database, "users"),
        where("uid", "==", user.uid)
      );
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((docdata) => {
          img.src = docdata.data().profilephotourl;
        });
      });
      img.classList.add("qimg");
      div2.appendChild(img);
      div1.appendChild(div2);
      let div3 = document.createElement("div");
      div3.classList.add("addcontent");
      let data =
        "<input type='text' placeholder='Add question title' required><textarea placeholder='Add a brief introduction to the problem' cols='80' rows='10' maxlength='500' required></textarea ><div><button class='addQuesbtn'>Add Question</button></div>";
      div3.innerHTML = data;

      div1.appendChild(div3);
      if (questionSection.firstElementChild) {
        questionSection.firstElementChild.before(div1);
      } else {
        questionSection.appendChild(div1);
      }
      flag = true;
      addQuesbtn = document.querySelector(".addQuesbtn");
      const questiontitle = document.querySelector(".addcontent input");
      questiontitle.addEventListener("input", () => {
        if (questiontitle.value == "") {
          addQuesbtn.style.visibility = "hidden";
        } else {
          addQuesbtn.style.visibility = "visible";
        }
      });
      addQuesbtn.addEventListener("click", questionStore);
    } else {
      plus.innerHTML = "<i class='fa fa-plus' style='font-size:24px'>";
      questionSection.firstElementChild.remove();
      flag = false;
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const q = query(collection(database, "questions"), orderBy("time", "desc"));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((docdata) => {
        const div1 = document.createElement("div");
        div1.classList.add("questionElement");
        const div2 = document.createElement("div");
        div2.style.marginRight = "20px";
        const img1 = document.createElement("img");
        img1.classList.add("qimg");
        div2.appendChild(img1);
        div1.appendChild(div2);
        const div3 = document.createElement("div");
        const p1 = document.createElement("p");
        p1.classList.add("uname");
        p1.addEventListener("click", () => {
          window.location.href =
            "seeprofileonsearch.html?" + docdata.data().senderid;
        });
        const p2 = document.createElement("p");
        p2.classList.add("qTime");
        const p3 = document.createElement("p");
        p3.classList.add("qTitle");
        const p4 = document.createElement("p");
        p4.classList.add("qDesc");
        const p5 = document.createElement("p");
        p5.classList.add("qid");
        const q = query(
          collection(database, "users"),
          where("uid", "==", docdata.data().senderid)
        );
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((docdta) => {
            img1.src = docdta.data().profilephotourl;
            p1.innerHTML =
              docdta.data().firstname + " " + docdta.data().lastname;
          });
        });
        p2.innerHTML = docdata.data().time;
        p3.innerHTML = docdata.data().qtitle;
        p4.innerHTML = docdata.data().qdesc;
        p4.innerHTML = docdata.data().qdesc;
        p5.innerHTML = docdata.data().qid;
        p5.style.display = "none";
        div3.appendChild(p1);
        div3.appendChild(p2);
        div3.appendChild(p3);
        div3.appendChild(p4);
        div3.appendChild(p5);
        const div4 = document.createElement("div");
        const btn1 = document.createElement("button");
        btn1.innerHTML = "<i class='fa fa-wechat' style='font-size:15px'></i>";
        btn1
          .getElementsByClassName("fa-wechat")[0]
          .addEventListener("click", (e) => {
            e.stopPropagation();
            ansfunc(e);
          });
        div4.appendChild(btn1);
        const btn2 = document.createElement("button");
        btn2.classList.add("resbtn");
        btn2.addEventListener("click", (e) => {
          e.stopPropagation();
          resbtnfunc(e);
        });
        btn2.innerText = "Add Response";
        div4.appendChild(btn2);
        div4.classList.add("qeleBtn");
        div3.appendChild(div4);
        questionSection.appendChild(div1);
        div1.appendChild(div3);
        const del = document.createElement("div");
        del.classList.add("delbtn");
        del.addEventListener("click", (e) => {
          const qid =
            e.target.parentElement.parentElement.getElementsByClassName(
              "qid"
            )[0].innerText;
          deleteDoc(doc(database, "questions", qid));
          const ansd = e.target.parentElement.parentElement.nextElementSibling;
          e.target.parentElement.parentElement.remove();
          ansd.remove();
        });

        del.innerHTML = "<i class='fa fa-trash-o' style='font-size:24px;'></i>";
        del.style.position = "absolute";
        del.style.right = "3%";
        del.style.display = "none";
        div1.appendChild(del);
        const div5 = document.createElement("div");
        div5.classList.add("ansDisplay");
        div5.style.display = "none";
        questionSection.appendChild(div5);
        const answers = docdata.data().ans;
        for (let i = 0; i < answers.length; i++) {
          const divans1 = document.createElement("div");
          divans1.classList.add("ansElement");
          const divans2 = document.createElement("div");
          divans2.style.margin = "15px";
          const img = document.createElement("img");
          img.classList.add("qimg");
          img.style.width = "40px";
          img.style.height = "40px";
          divans2.appendChild(img);
          const divans3 = document.createElement("div");
          const pans1 = document.createElement("p");
          pans1.classList.add("anstext");
          const pans2 = document.createElement("p");
          pans2.classList.add("ansname");
          pans2.addEventListener("click", () => {
            window.location.href =
              "seeprofileonsearch.html?" + answers[i].ansid;
          });
          const pans3 = document.createElement("p");
          pans3.classList.add("anstime");
          pans3.innerText = answers[i].anstime;
          const q = query(
            collection(database, "users"),
            where("uid", "==", answers[i].ansid)
          );
          getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((docdta) => {
              pans2.innerText =
                docdta.data().firstname + " " + docdta.data().lastname;
              img.src = docdta.data().profilephotourl;
            });
          });
          divans3.style.flexGrow = "5";
          pans1.innerText = answers[i].ans;
          divans3.appendChild(pans2);
          divans3.appendChild(pans3);
          divans3.appendChild(pans1);
          divans1.appendChild(divans2);
          divans1.appendChild(divans3);
          div5.appendChild(divans1);
        }
      });
    });
    const quescoll = document.getElementsByClassName("questionElement");
    const q2 = query(
      collection(database, "questions"),
      where("senderid", "==", auth.currentUser.uid)
    );
    getDocs(q2).then((querySnapshot) => {
      querySnapshot.forEach((docdta) => {
        for (let i = 0; i < quescoll.length; i++) {
          if (
            quescoll[i].getElementsByClassName("qid")[0].innerText ==
            docdta.data().qid
          ) {
            // console.log(quescoll[i].getElementsByClassName("delbtn")[0]);
            quescoll[i].getElementsByClassName("delbtn")[0].style.display =
              "block";
          }
        }
      });
    });
  }
});

const q = query(collection(database, "questions"));
const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      //   console.log("New city: ", change.doc.data());
    }
    if (change.type === "modified") {
      //   console.log("Modified city: ", change.doc.data());
      if (change.doc.data().ans.length == 0) {
        questionDisplay(change.doc.data().time, change.doc.data().qid);
      } else {
        const anslen = change.doc.data().ans.length - 1;
        const q = query(
          collection(database, "users"),
          where("uid", "==", change.doc.data().ans[anslen].ansid)
        );
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((docdata) => {
            const imgsrc = docdata.data().profilephotourl;
            const ansl = change.doc.data().ans.length;
            const data = change.doc.data().ans[ansl - 1].ans;
            const time = change.doc.data().ans[ansl - 1].anstime;
            const id = change.doc.data().ans[ansl - 1].ansid;
            let ansdis;
            const allqid = document.querySelectorAll(".qid");
            for (let i = 0; i < allqid.length; i++) {
              if (allqid[i].textContent == change.doc.data().qid) {
                const ansinput =
                  allqid[i].parentElement.parentElement.nextElementSibling;
                if (ansinput.classList.contains("ansInput")) {
                  allqid[
                    i
                  ].parentElement.parentElement.nextElementSibling.remove();
                  allqid[i].parentElement.parentElement.getElementsByClassName(
                    "resbtn"
                  )[0].innerText = "Add Response";
                }
                ansdis =
                  allqid[i].parentElement.parentElement.nextElementSibling;
              }
            }
            const name =
              docdata.data().firstname + " " + docdata.data().lastname;
            ansDisplay(imgsrc, data, ansdis, name, time, id);
          });
        });
      }
    }
    if (change.type === "removed") {
      // console.log("Removed city: ", change.doc.data());
      const removedEle = change.doc.data().qid;
      const quesEle = document.getElementsByClassName("questionElement");
      for (let i = 0; i < quesEle.length; i++) {
        if (
          quesEle[i].getElementsByClassName("qid")[0].innerText == removedEle
        ) {
          quesEle[i].nextElementSibling.remove();
          if (quesEle[i].nextElementSibling.classList.contains("ansDisplay")) {
            quesEle[i].nextElementSibling.remove();
          }
          quesEle[i].remove();
        }
      }
    }
  });
});

function resbtnfunc(e) {
  const ansDisplays = document.querySelectorAll(".ansDisplay");
  for (let i = 0; i < ansDisplays.length; i++) {
    ansDisplays[i].style.display = "none";
  }
  if (e.target.textContent == "Add Response") {
    e.target.innerText = "Cancel";
    const questionElement = e.target.parentElement.parentElement.parentElement;
    const div1 = document.createElement("div");
    div1.classList.add("ansInput");
    const div2 = document.createElement("div");
    const img = document.createElement("img");
    const user = auth.currentUser;
    const q = query(
      collection(database, "users"),
      where("uid", "==", user.uid)
    );
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((docdta) => {
        img.src = docdta.data().profilephotourl;
      });
    });
    img.classList.add("qimg");
    div2.appendChild(img);
    div1.appendChild(div2);
    const div3 = document.createElement("div");
    const textarea = document.createElement("textarea");
    textarea.placeholder = "Add your answer here";
    textarea.cols = "80";
    textarea.rows = "5";
    textarea.setAttribute("max-length", "500");
    div1.appendChild(div3);
    const div4 = document.createElement("div");
    div4.classList.add("ansBtn");
    const btn = document.createElement("button");
    btn.classList.add("ansSub");
    btn.innerText = "SUBMIT";
    btn.style.visibility = "hidden";
    textarea.addEventListener("input", () => {
      if (textarea.value == "") {
        btn.style.visibility = "hidden";
      } else {
        btn.style.visibility = "visible";
      }
    });
    btn.addEventListener("click", (e) => {
      const ansdis1 = e.target.parentElement.parentElement.nextElementSibling;
      ansStore(e);
      ansdis1.style.display = "block";
    });
    div4.appendChild(btn);
    div3.appendChild(textarea);
    div1.appendChild(div4);
    questionElement.after(div1);
  } else {
    e.target.innerText = "Add Response";
    const questionElement = e.target.parentElement.parentElement.parentElement;
    questionElement.nextSibling.remove();
  }
}

function ansfunc(e) {
  let upper = e.target.parentElement.parentElement.parentElement.parentElement;
  while (upper.classList.contains("ansDisplay") != true) {
    upper = upper.nextElementSibling;
  }
  if (upper.style.display == "block") {
    upper.style.display = "none";
  } else {
    upper.style.display = "block";
  }
}

function ansStore(e) {
  const data =
    e.target.parentElement.parentElement.getElementsByTagName("textarea")[0]
      .value;
  const quesqid =
    e.target.parentElement.parentElement.previousElementSibling.getElementsByClassName(
      "qid"
    )[0].textContent;
  var now = new Date();
  var tym =
    now.getMonth() +
    1 +
    "/" +
    now.getDate() +
    "/" +
    now.getFullYear() +
    " " +
    now.getHours() +
    ":" +
    (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) +
    ":" +
    (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const docRef = doc(database, "questions", quesqid);
      updateDoc(docRef, {
        ans: arrayUnion({ ansid: user.uid, ans: data, anstime: tym }),
      });
    }
  });
  e.target.parentElement.parentElement.previousElementSibling.getElementsByClassName(
    "resbtn"
  )[0].innerText = "Add Response";
  e.target.parentElement.parentElement.remove();
  //ansDisplay(imgsrc, data, ansdis, name,tym);
}

function ansDisplay(imgsrc, data, ansdis, name, tym, id) {
  const div1 = document.createElement("div");
  div1.classList.add("ansElement");
  const div2 = document.createElement("div");
  div2.style.margin = "15px";
  const img = document.createElement("img");
  img.classList.add("qimg");
  img.src = imgsrc;
  img.style.width = "40px";
  img.style.height = "40px";
  div2.appendChild(img);
  const div3 = document.createElement("div");
  const p1 = document.createElement("p");
  p1.classList.add("anstext");
  const p3 = document.createElement("p");
  p3.classList.add("anstime");
  p3.innerText = tym;
  div3.style.flexGrow = "5";
  p1.innerText = data;
  const p2 = document.createElement("p");
  p2.classList.add("ansname");
  p2.innerText = name;
  p2.addEventListener("click", () => {
    window.location.href = "seeprofileonsearch.html?" + id;
  });
  div3.appendChild(p2);
  div3.appendChild(p3);
  div3.appendChild(p1);
  div1.appendChild(div2);
  div1.appendChild(div3);
  ansdis.prepend(div1);
}

function questionDisplay(timenow, qid) {
  const div1 = document.createElement("div");
  div1.classList.add("questionElement");
  const div2 = document.createElement("div");
  div2.style.marginRight = "20px";
  const img1 = document.createElement("img");
  img1.classList.add("qimg");
  div2.appendChild(img1);
  div1.appendChild(div2);
  const div3 = document.createElement("div");
  const p1 = document.createElement("p");
  p1.classList.add("uname");
  const p2 = document.createElement("p");
  p2.classList.add("qTime");
  const p3 = document.createElement("p");
  p3.classList.add("qTitle");
  const p4 = document.createElement("p");
  p4.classList.add("qDesc");
  const p5 = document.createElement("p");
  p5.classList.add("qid");
  p5.style.display = "none";

  const q1 = query(collection(database, "questions"), where("qid", "==", qid));
  getDocs(q1).then((querySnapshot) => {
    querySnapshot.forEach((docdata) => {
      p1.addEventListener("click", () => {
        window.location.href =
          "seeprofileonsearch.html?" + docdata.data().senderid;
      });
      p3.innerHTML = docdata.data().qtitle;
      p4.innerHTML = docdata.data().qdesc;
      const q = query(
        collection(database, "users"),
        where("uid", "==", docdata.data().senderid)
      );
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((docdata) => {
          img1.src = docdata.data().profilephotourl;
          p1.innerHTML =
            docdata.data().firstname + " " + docdata.data().lastname;
          p2.innerHTML = timenow;
          p5.innerHTML = qid;
        });
      });
    });
  });

  div3.appendChild(p1);
  div3.appendChild(p2);
  div3.appendChild(p3);
  div3.appendChild(p4);
  div3.appendChild(p5);
  const div4 = document.createElement("div");
  const btn1 = document.createElement("button");
  btn1.innerHTML = "<i class='fa fa-wechat' style='font-size:15px'></i>";
  btn1.getElementsByClassName("fa-wechat")[0].addEventListener("click", (e) => {
    e.stopPropagation();
    ansfunc(e);
  });
  div4.appendChild(btn1);
  const btn2 = document.createElement("button");
  btn2.classList.add("resbtn");
  btn2.addEventListener("click", (e) => {
    e.stopPropagation();
    resbtnfunc(e);
  });
  btn2.innerText = "Add Response";
  div4.appendChild(btn2);
  div4.classList.add("qeleBtn");
  div3.appendChild(div4);
  if (questionSection.firstElementChild.classList.contains("questioncard")) {
    questionSection.firstElementChild.remove();
  }
  const div5 = document.createElement("div");
  div5.classList.add("ansDisplay");
  div5.style.display = "none";
  questionSection.prepend(div5);
  questionSection.prepend(div1);
  div1.appendChild(div3);
  plus.innerHTML = "<i class='fa fa-plus' style='font-size:24px'></i>";
  const del = document.createElement("div");
  del.classList.add("delbtn");
  del.addEventListener("click", (e) => {
    const qid =
      e.target.parentElement.parentElement.getElementsByClassName("qid")[0]
        .innerText;
    deleteDoc(doc(database, "questions", qid));
    e.target.parentElement.parentElement.nextElementSibling.remove();
    e.target.parentElement.parentElement.remove();
  });

  del.innerHTML = "<i class='fa fa-trash-o' style='font-size:24px;'></i>";
  del.style.position = "absolute";
  del.style.right = "3%";
  del.style.display = "none";
  div1.appendChild(del);
  setTimeout(async () => {
    const quescoll = document.getElementsByClassName("questionElement");
    const q2 = await query(
      collection(database, "questions"),
      where("senderid", "==", auth.currentUser.uid)
    );
    await getDocs(q2).then((querySnapshot) => {
      querySnapshot.forEach((docdta) => {
        // console.log(docdta.data().qid);
        for (let i = 0; i < quescoll.length; i++) {
          if (
            quescoll[i].getElementsByClassName("qid")[0].innerText ==
            docdta.data().qid
          ) {
            quescoll[i].getElementsByClassName("delbtn")[0].style.display =
              "block";
          }
        }
      });
    });
  }, 1000);
  flag = false;
}

function questionStore() {
  const questiontitle = document.querySelector(".addcontent input");
  const questiondesc = document.querySelector(".addcontent textarea");
  let titleVal = questiontitle.value;
  let descVal = questiondesc.value;
  var now = new Date();
  var timenow =
    now.getMonth() +
    1 +
    "/" +
    now.getDate() +
    "/" +
    now.getFullYear() +
    " " +
    now.getHours() +
    ":" +
    (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) +
    ":" +
    (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
  onAuthStateChanged(auth, (user) => {
    if (user) {
      addDoc(collection(database, "questions"), {
        qid: "",
        time: timenow,
        senderid: user.uid,
        qtitle: titleVal,
        qdesc: descVal,
        ans: [],
      }).then((docRef) => {
        // console.log("Document written with ID:", docRef.id);
        const dataa = {
          qid: docRef.id,
        };
        updateDoc(docRef, dataa)
          .then((docRef) => {
            // console.log("question id changed");
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  });
}
