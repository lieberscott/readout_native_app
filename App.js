import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, Alert } from 'react-native';

import { AppLoading } from 'expo';
import Navigator from './routes/homeStack';
import Login from './screens/Login';

const getFonts = () => {
  console.log("get fonts");
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(async () => {
  //   // check if there is a token on AsyncStorage
  //   let token;
  //   console.log("hellooo");
  //   try {
  //     token = await AsyncStorage.getItem("token");
  //   }
  //   catch (error) {
  //     console.log('AsyncStorage Error: ' + error.message);
  //     setError("Unable to access page. Please try logging in again.");
  //   }
  //
  //   let formData = new FormData();
  //
  //   formData.append('token', token);
  //
  //   if (token) {
  //     console.log("token check");
  //     fetch("http://localhost:3000/protected", {
  //       method: "POST",
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ token })
  //     })
  //     .then(async (res) => {
  //       console.log("res : ", res);
  //       if (res.status == 403) {
  //           await AsyncStorage.removeItem("token");
  //           return false;
  //         }
  //       else {
  //         return true;
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(" App.js err : ", err);
  //       return false;
  //     });
  //   }
  // }, [loaded]);
  //
  const getLogin = () => {
    setLoggedIn(true);
  }

  if (loaded) {
    return loggedIn ? <Navigator /> : <Login getLogin={ getLogin }/>;
  }

  else {
    return (
      <AppLoading
        startAsync={ getFonts }
        onFinish={ (response) => {
          console.log("response : ", response);
          return setLoaded(true)
        } }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
