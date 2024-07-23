import { app, database, auth, onAuthStateChanged, doc, collection, query, where, getDocs, updateDoc, getStorage, ref, uploadString, getDownloadURL, deleteObject, addDoc } from "./config.js";
const user = auth.currentUser;
import { arrayUnion, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

var queryString = location.search.substring(1);
var a = queryString.split("|"); //taken from chatusers.js
var sid = a[0];
var rid = a[1];
var sname = a[2];

const msgb = document.getElementById("chat");

const q = query(collection(database, "chats"), where("chatid", "==", sid + rid));
const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            // console.log("New city: ", change.doc.data());
            var obj = change.doc.data().chat;
            var len = obj.length;
            var msgval = obj[len - 1].msg;
            var time = obj[len - 1].time;
            if (sid == obj[len - 1].sender) {
                sendsendermsg(msgval, time);
            }
            else {
                sendreceivermsg(msgval, time);
            }
        }
        if (change.type === "modified") {
            // console.log("Modified city: ", change.doc.data());
            var obj = change.doc.data().chat;
            var len = obj.length;
            var msgval = obj[len - 1].msg;
            var time = obj[len - 1].time;
            if (sid == obj[len - 1].sender) {
                sendsendermsg(msgval, time);
            }
            else {
                sendreceivermsg(msgval, time);
            }

        }
        if (change.type === "removed") {
            // console.log("Removed city: ", change.doc.data());
        }
        // console.log(msgb.scrollHeight);
        msgb.scrollTop = msgb.scrollHeight;
    });
});


function getchatbody(senderid, rcvrid) {

    const msgbody = document.getElementById("chat");
    msgbody.innerHTML = "";

    var chat = senderid + rcvrid;

    const q1 = query(collection(database, "chats"), where("chatid", "==", chat));
    // console.log(q1.empty())
    // console.log(q1);

    // console.log(q1);
    getDocs(q1).then((snap) => {
        if (!snap.empty) {
            snap.forEach((docdata) => {
                var chat = docdata.data().chat
                var len = docdata.data().chat.length;
                for (let i = 0; i < len; i++) {
                    var msgval = chat[i].msg;
                    var time = chat[i].time;
                    if (senderid == chat[i].sender) {
                        sendsendermsg(msgval, time);
                    }
                    else {
                        sendreceivermsg(msgval, time);
                    }
                }
            })
        }
    })
    // console.log(msgb.scrollHeight);
    // msgb.scrollTop=msgb.scrollHeight;
}

var url;
const q1 = await query(collection(database, "users"), where("uid", "==", rid));
await getDocs(q1)
    .then((snap) => {
        snap.forEach((doc) => {
            // console.log(doc.data());
            url = doc.data().profilephotourl;
        })
    })

const nm = document.getElementById("rcvr_name");
nm.innerText = sname;
const pic = document.getElementById("rcvr_pic");
pic.src = url;


const send_msg = document.getElementById("send_msg_icon");
getchatbody(sid, rid);

send_msg.addEventListener("click", () => handler(sname, sid, rid));

const input = document.getElementById("write_msg");
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        send_msg.click();
    }
})

const dchat = document.getElementById("dchat");
dchat.addEventListener("click", () => deletechat(sid, rid))
const vprofile = document.getElementById("vprofile");
vprofile.addEventListener("click", () => viewprofile(rid))


async function viewprofile(rcvrid) {
    window.location.href = "seeprofile.html?" + rcvrid;
}

async function deletechat(senderid, rcvrid) {
    var chat = senderid + rcvrid;

    const q1 = query(collection(database, "chats"), where("chatid", "==", chat));

    await getDocs(q1).then((snap) => {
        snap.forEach(async (docdata) => {
            const docRef = doc(database, "chats", docdata.id);
            const dataa = {
                chat: []
            }
            await updateDoc(docRef, dataa)
                .then(docRef => {
                    // console.log("t");
                })
                .catch(error => {
                    console.log(error);
                })

        })
    })
    getchatbody(senderid, rcvrid);

}


async function handler(name, senderid, rcvrid) {
    // console.log("event listen");
    const msg = document.getElementById("write_msg");
    let msgval = msg.value;
    if (msgval.length == 0) {
        // console.log("message is empty");
    } else {
        // console.log(msgval);
        await storemsg(senderid, rcvrid, msgval);
    }
    msg.value = "";
    // send_msg.removeEventListener("click",handler);
}

async function storemsg(senderid, rcvrid, msgval) {
    var now = new Date();
    var timenow = ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
    var chat = []
    chat.push(senderid + rcvrid)
    chat.push(rcvrid + senderid)

    const q1 = query(collection(database, "chats"), where("chatid", "in", chat));

    // console.log("in function");
    await getDocs(q1).then(async (snap) => {
        // console.log("getdoc");
        // console.log(snap);
        if (snap.empty) {
            // console.log('no documents found');
            // console.log("create new doc");
            //one for sender
            await addDoc(collection(database, "chats"), {
                chatid: senderid + rcvrid,
                senderid: senderid,
                receiverid: rcvrid,
                chat: [{ sender: senderid, msg: msgval, time: timenow }]
            }).then((docRef) => {
                // console.log("Document written with ID:", docRef.id);
            })

            //one for receiver
            await addDoc(collection(database, "chats"), {
                chatid: rcvrid + senderid,
                senderid: rcvrid,
                receiverid: senderid,
                chat: [{ sender: senderid, msg: msgval, time: timenow }]
            }).then((docRef) => {
                // console.log("Document written with ID:", docRef.id);
            })

        } else {
            // do something with the data
            await snap.forEach(async (docdata) => {
                // console.log("in then");
                // console.log(docdata.exists())
                if (docdata.exists()) {
                    // console.log("exists");
                    const docRef = await doc(database, "chats", docdata.id);
                    // console.log(docRef);
                    const dataa = {
                        chat: arrayUnion({ sender: senderid, msg: msgval, time: timenow })
                    }
                    await updateDoc(docRef, dataa)
                        .then(docRef => {
                            // console.log("t");
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    // console.log(docdata.data().chats)

                }
            })
        }

    })
    // send_msg.removeEventListener("click", handler);
}
function formatStr(str, n) {
    var a = [], start = 0;
    while (start < str.length) {
        a.push(str.slice(start, start + n));
        a.push(" ");
        start += n;
    }
}

function sendsendermsg(msgval, t) {
    const msgbody = document.getElementById("chat");
    const msgdiv = document.createElement('div');
    msgdiv.setAttribute("id", "sender_msg");
    const msg = document.createElement('span');
    msg.setAttribute("id", "msg");
    msg.innerText = msgval;
    const time = document.createElement('span');
    time.setAttribute("id", "time");
    time.innerText = t;
    msgdiv.appendChild(msg);
    msgdiv.appendChild(time);
    msgbody.appendChild(msgdiv);

    msgb.scrollTop = msgb.scrollHeight;
}
function sendreceivermsg(msgval, t) {
    const msgbody = document.getElementById("chat");
    const msgdiv = document.createElement('div');
    msgdiv.setAttribute("id", "rcvr_msg");
    const msg = document.createElement('span');
    msg.setAttribute("id", "msg");
    msg.innerText = msgval;
    const time = document.createElement('span');
    time.setAttribute("id", "time");
    time.innerText = t;
    msgdiv.appendChild(msg);
    msgdiv.appendChild(time);
    msgbody.appendChild(msgdiv);

    msgb.scrollTop = msgb.scrollHeight;
}
















