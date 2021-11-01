
import './App.css';
import React, { useEffect, useState } from "react";
import { firestore, loginConGoogle, auth, logout } from "./firebase";


export default function App() {
  const [tweets, setTweets] = useState([]);
  const [tweet, setTweet] = useState({
    tweet: "",
    autor: "",
    id: ""
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const desuscribir = firestore
      .collection("prueba")
      .onSnapshot((snapshot) => {
          const tweetsData = snapshot.docs.map((doc) => {
            return {
              tweet: doc.data().tweet,
              autor: doc.data().autor,
              id: doc.id
            };
          });


          setTweets(tweetsData);

      });

      auth.onAuthStateChanged((user) => {
        setUser(user);
        console.log(user);
      });
      return () => desuscribir();

  }, []);

  const sendTweet = (e) => {
    e.preventDefault();

    // Paso 1: Guardar el tweet como dato en la BBDD Firestore
    let enviarTweet = firestore.collection("prueba").add(tweet);

    // Paso 2: Luego de guardar el tweet en la BBDD, Obtener la referencia del documento (TweetRef)
    let solicitarDocumento = enviarTweet.then((docRef) => {
      return docRef.get();
    });

    // Paso 3: En base a la referencia, traer el tweet en sí e insertarlo en el estado
    solicitarDocumento.then((doc) => {
      let nuevoTweet = {
        tweet: doc.data().tweet,
        autor: doc.data().autor,
        id: doc.id
      };
      setTweets([nuevoTweet, ...tweets]);
    });
  };

  const deleteTweet = (id) => {
    // borramos el tweet en firebase
    firestore.doc(`prueba/${id}`).delete();
  };

  // Handler único for inputs (2 inputs: tweet y autor), gracias al e.target.name. Ya no es necesario hacer un handler por c/input
  const handleChange = (e) => {
    let nuevoTweet = {
      ...tweet,
      [e.target.name]: e.target.value
    };
    setTweet(nuevoTweet);
  };

  return (
    <div className="App">

{user ? (
        <>
          <div className="user-profile">
            <img className="user-profile-pic" src={user.photoURL} alt="" />
            <p>¡Hola {user.displayName}!</p>
            <button onClick={logout}>Log out</button>
          </div>
        </>
      ) : (
        <button className="login-btn" onClick={loginConGoogle}>
          Login con google
        </button>
      )}

      <form className="formulario">
        <textarea
          name="tweet"
          onChange={handleChange}
          value={tweet.tweet}
          cols="30"
          rows="5"
          placeholder="escribe un tweet..."
        />
        <div className="input-group">
          <input
            name="autor"
            onChange={handleChange}
            value={tweet.autor}
            type="text"
            placeholder="persona autora"
          />
          <button onClick={sendTweet}>Enviar tweet</button>
        </div>
      </form>
      <h1>Tweets:</h1>
      {tweets.map((tweet) => {
        return (
          <div className="card" key={tweet.id}>
            <h4 className="autor">{tweet.autor}</h4>
            <h2 className="tweet">{tweet.tweet}</h2>
            <span onClick={() => deleteTweet(tweet.id)} className="delete">
                  X
                </span>
          </div>
        );
      })}
    </div>
  );
}

