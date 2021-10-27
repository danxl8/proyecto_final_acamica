import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

let firebaseConfig = {
	apiKey: "AIzaSyCJRfoHyjYbkWs3wQklq5iHBEv9jdIAPu0",
    authDomain: "proyecto-prueba-27ce6.firebaseapp.com",
    projectId: "proyecto-prueba-27ce6",
    storageBucket: "proyecto-prueba-27ce6.appspot.com",
    messagingSenderId: "387009076963",
    appId: "1:387009076963:web:1f6b228ffc5ae1f4a7efd6",
    measurementId: "G-5J32ZRB7F7"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// Exporta la funcionalidad de la DB
export const firestore = firebase.firestore()

//El módulo de autenticación
export const auth=firebase.auth();

//El proveedor de autenticación
export const loginConGoogle = () => auth.signInWithPopup(provider);

//La utilidad para hacer logout
export const logout = () => auth.signOut();

// exporta el paquete de firebase para poder usarlo
export default firebase