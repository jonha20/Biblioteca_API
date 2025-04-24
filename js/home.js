const firebaseConfig = {
  apiKey: "AIzaSyDgPLImBJOyDhZ2M6jO7I4FomdLEMlAoSs",
  authDomain: "newyorktimes-c1a3e.firebaseapp.com",
  projectId: "newyorktimes-c1a3e",
  storageBucket: "newyorktimes-c1a3e.firebasestorage.app",
  messagingSenderId: "92835308280",
  appId: "1:92835308280:web:662f1403849072f08b910d",
  measurementId: "G-5WY7TLPRR6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig); // Inicializaar app Firebase
const db = firebase.firestore(); // db representa mi BBDD //inicia Firestore

const createUser = (user) => {
  db.collection("users") // Asegúrate de que la colección se llame "users"
    .doc(user.email) // Usar el email como ID del documento
    .set(user) // Guardar los datos del usuario
    .then(() => console.log("Usuario creado con éxito:", user.email))
    .catch((error) => console.error("Error al crear el usuario en Firestore:", error));
};

const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Usuario registrado
      let user = userCredential.user;
      console.log(`Se ha registrado ${user.email} ID:${user.uid}`);
      
      db.collection("users").doc(user.email).set({
        email: user.email,
        id: user.uid, // UID del usuario
        favorites: []
      }).then(() => alert("Usuario creado con éxito:", user.email))
      .catch((error) => alert("Error al crear el usuario en Firestore:", error));

      // Guardar el usuario en Firestore
      // createUser({
      //   email: user.email,
      //   id: user.uid, // UID del usuario
      //   favorites: [] // Inicializar favoritos como un array vacío
      // });

      // Guardar el usuario en localStorage
      localStorage.setItem("user", JSON.stringify({ email: user.email }));

      // Redirigir a index.html
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.error("Error al registrar el usuario:", error);
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
