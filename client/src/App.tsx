import React from "react";
import "./App.css";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ExampleDataViewer from "./ExampleDataViewer";

const App: React.FC = () => {
  const [user, initialising] = useAuthState(firebase.auth());
  const login = async () => {
    // firebase.auth().signInWithEmailAndPassword("test@test.com", "password");
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    await firebase.auth().signInWithPopup(provider);
  };
  const logout = () => {
    firebase.auth().signOut();
  };

  if (initialising) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        {/* <p>Current User: {user.email}</p> */}
        <ExampleDataViewer user={user.uid} />
        <button onClick={logout}>Log out</button>
      </div>
    );
  }
  return <button onClick={login}>Log in</button>;
};

export default App;
