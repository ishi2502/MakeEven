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

const submitbtn = document.getElementById("submit-btn");
const removebtn = document.getElementById("removeimg");

document.getElementById("fileToUpload").onchange = function (event) {
  var image = document.getElementById("output");
  image.src = URL.createObjectURL(event.target.files[0]);
};

const radioButtons = document.getElementsByName("age-group");
radioButtons.forEach(function (radioButton) {
  radioButton.addEventListener("change", function () {
    radioButtons.forEach(function (rb) {
      rb.disabled = true;
    });
  });
});

function validateform() {
  const firstname = document.querySelector(".firstname").value;
  const country = document.querySelector(".country").value;
  const state = document.querySelector(".state").value;
  const radioButtons = document.getElementsByName("age-group");
  let flag = false;
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked == true) {
      flag = true;
    }
  }

  if (!firstname || !country || !state || !flag) {
    return false;
  }
  return true;
}

function userdetails(e) {
  e.preventDefault();
  const user = auth.currentUser;
  onAuthStateChanged(auth, (user) => {
    const q = query(
      collection(database, "users"),
      where("uid", "==", user.uid)
    );
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((docdata) => {
        const docRef = doc(database, "users", docdata.id);
        document.querySelector(".firstname").value =
          docdata.data().firstname || "";
        document.querySelector(".lastname").value =
          docdata.data().lastname || "";
        document.querySelector(".phoneno").value = docdata.data().phoneno || "";
        document.querySelector(".country").value = docdata.data().country || "";
        document.querySelector(".state").value = docdata.data().state || "";
        document.querySelector(".bio").value = docdata.data().bio || "";

        const radioButtons = document.getElementsByName("age-group");
        const selectedValue = docdata.data().agegroup;
        for (let i = 0; i < radioButtons.length; i++) {
          if (radioButtons[i].value === selectedValue) {
            radioButtons[i].checked = true;
          }
        }

        const img = document.getElementById("output");
        img.src = docdata.data().profilephotourl;
      });
    });
  });
}

function saveuserdetails(e) {
  e.preventDefault();
  const firstname = document.querySelector(".firstname");
  const lastname = document.querySelector(".lastname");
  const phoneno = document.querySelector(".phoneno");
  const country = document.querySelector(".country");
  const state = document.querySelector(".state");
  const bio = document.querySelector(".bio");
  let agegroup;
  if (document.getElementById("young").checked) {
    agegroup = "young";
  } else {
    agegroup = "old";
  }
  const user = auth.currentUser;

  const q = query(collection(database, "users"), where("uid", "==", user.uid));
  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((docdata) => {
      const docRef = doc(database, "users", docdata.id);
      let file = document.querySelector("input[type=file]").files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const imageData = event.target.result;
          const userProfileDocRef = docRef;
          const storageRef = getStorage();
          const profilePhotoRef = ref(
            storageRef,
            `users/${user.uid}/profile-photo.jpg`
          );
          const uploadTask = uploadString(
            profilePhotoRef,
            imageData,
            "data_url"
          ).then(() => {
            getDownloadURL(profilePhotoRef).then((url) => {
              updateDoc(userProfileDocRef, { profilephotourl: url });
            });
          });
        };
      } else {
        const url =
          "https://firebasestorage.googleapis.com/v0/b/make-even-d50ab.appspot.com/o/user.png?alt=media&token=a9ed9591-caab-4743-999d-a68810177340";
        const img = document.getElementById("output");
        img.src = url;
        updateDoc(docRef, { profilephotourl: url });
      }

      const dataa = {
        firstname: firstname.value,
        lastname: lastname.value,
        phoneno: phoneno.value,
        country: country.value,
        state: state.value,
        agegroup: agegroup,
        bio: bio.value,
        formsubmitted: true,
      };
      updateDoc(docRef, dataa)
        .then((docRef) => {
          // console.log(
          //   "A New Document Field has been added to an existing document"
          // );
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
  submitbtn.removeEventListener("click", saveuserdetails);
}

function removeprofileimg(e) {
  e.preventDefault();
  const user = auth.currentUser;
  const q = query(collection(database, "users"), where("uid", "==", user.uid));
  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((docdata) => {
      const docRef = doc(database, "users", docdata.id);
      const storageRef = getStorage();
      const profilePhotoRef = ref(
        storageRef,
        `users/${user.uid}/profile-photo.jpg`
      );
      deleteObject(profilePhotoRef)
        .then(() => {
          // File deleted successfully
          updateDoc(docRef, {
            profilephotourl:
              "https://firebasestorage.googleapis.com/v0/b/make-even-d50ab.appspot.com/o/user.png?alt=media&token=a9ed9591-caab-4743-999d-a68810177340",
          });
          // userdetails();
          // saveuserdetails(e);
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });
    });
  });
}

submitbtn.addEventListener("click", (e) => {
  if (!validateform()) alert("Please fill all required fields");
  else saveuserdetails(e);
});
removebtn.addEventListener("click", (e) => {
  removeprofileimg(e);
});
window.onload = (e) => {
  userdetails(e);
};
