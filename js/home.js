const firebaseConfig = {
  apiKey: "AIzaSyDgPLImBJOyDhZ2M6jO7I4FomdLEMlAoSs",
  authDomain: "newyorktimes-c1a3e.firebaseapp.com",
  projectId: "newyorktimes-c1a3e",
  storageBucket: "newyorktimes-c1a3e.firebasestorage.app",
  messagingSenderId: "92835308280",
  appId: "1:92835308280:web:24bc0699395c09258b910d",
  measurementId: "G-LSDQ4GMG86",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig); // Inicializaar app Firebase
const db = firebase.firestore(); // db representa mi BBDD //inicia Firestore

const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};

const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`);
      alert(`se ha registrado ${user.email} ID:${user.uid}`);
      
      // Guardar el usuario en Firestore
      createUser({
        email: user.email,
        id: user.uid, // Cambiado de user.id a user.uid
      });

      // Guardar el usuario en localStorage
      localStorage.setItem("user", JSON.stringify({ email: user.email }));

      // Redirigir a index.html
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.log(
        "Error en el sistema" + error.message,
        "Error: " + error.code
      );
    });
};

const signInUser = (email, password) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha logado ${user.email} ID:${user.uid}`);
      alert(`se ha logado ${user.email} ID:${user.uid}`);
      console.log("USER", user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
};


const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

document.getElementById("singup").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email.value;
  let pass = event.target.elements.password.value;
  let pass2 = event.target.elements.password1.value;
  let error="";
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.,-])[A-Za-z\d@$!%*?&_.,-]{8,}$/;

  if (emailRegex.test(email)) {
  } else {
    alert((error += "Formato email incorrecto\n"));
  
  }
  if (passwordRegex.test(pass)) {
  } else {
    alert((error += "Formato contraseña incorrecto\n"));
  }
  
  pass === pass2 ? signUpUser( email, pass) : alert("error password");
});

document.getElementById("singin").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email2.value;
  let password = event.target.elements.password.value;

  // Llamar a la función de inicio de sesión
  signInUser(email, password)
    .then(() => {
      // Guardar el usuario en localStorage
      localStorage.setItem("user", JSON.stringify({ email }));
      // Redirigir a index.html
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error);
    });
});


// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(`Está en el sistema:${user.email} ${user.uid}`);
  } else {
    console.log("no hay usuarios en el sistema");
  }
});
