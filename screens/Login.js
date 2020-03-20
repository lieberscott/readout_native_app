import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, AsyncStorage, Alert } from 'react-native';

const Login = (props) => {

  const [values, setValues] = useState({
    username: "",
    password: ""
  });
  const [redirect, setRedirect] = useState(false);

  const handleUsername = (input) => {
    setValues((values) => ({ ...values, username: input }));
  };

  const handlePass = (input) => {
    setValues((values) => ({ ...values, password: input }));
  };


  const login = (e) => {
    let email = values.username;
    let pass = values.password;
    console.log("login");

    console.log("email: ", email);
    console.log("pass : ", pass);

    let formData = new FormData();

    formData.append('username', email);
    formData.append('password', [pass]);

    console.log("formData :: ", formData);

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: email, password: pass })
    })
    .then((res) => {
      if (res.redirected) {
        Alert.alert("Incorrect email or password", "Please try again", { text: "OK", style: "cancel", onPress: () => { props.navigator.navigate("Login") } } );
        return;
      }
      else {
        return res.json()
      }
    })
    .then(async (json) => {
      console.log("json : ", json);
      if (json.error) {
        Alert.alert(json.error);
      }
      else if (json.token) {
        let token = json.token;
        try {
          await AsyncStorage.setItem("token", token);
          props.getLogin();
        }
        catch (error) {
          console.log('AsyncStorage Error: ' + error.message);
        }
      }
    })
    .catch((err) => {
      console.log("Login err :: ", err);
    });
  };

  if (redirect) {
    return <Redirect to="/allpolls" />
  }

  return (
    <View style={ styles.login }>
      <Text for="username">Email Address</Text>
      <TextInput style={ styles.input } type="email" name="username" onChangeText={ handleUsername } value={ values.username } required />
      <Text for="password">Password</Text>
      <TextInput style={ styles.input } type="password" name="password" onChangeText={ handlePass } value={ values.password } required />
      <Button onPress={ login } title="Login" />
      <Button title="Forgot Password" />
    </View>
  );
};

const styles = StyleSheet.create({
  login: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 60
  },
  input: {
    borderBottomColor: "black",
    borderBottomWidth: 1
  }
});

export default Login;
