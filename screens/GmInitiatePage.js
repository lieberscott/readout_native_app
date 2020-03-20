import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import GmInitiateConversation from '../components/GmInitiateConversation';

const GmInitiatePage = ({ navigation }) => {

  const [values, setValues] = useState({
    first: true, // first time component is loading?
    voters: []
  });
  const [i, setI] = useState(0);
  const gm_id = navigation.getParam("gm_id");
  const token = navigation.getParam("token");

  useEffect(() => {
    if (values.first == true) { // page is rendering for first time
      getVoters();
    }
    else {
      console.log("not first poll detail single scrollbox");
    }
  }, [values]);

  const getVoters = () => {
    console.log("get uninitiated voters");

    fetch("http://localhost:3000/getvotersinitiategm", { // only voters for whom there is no messages, 1000 at a time
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, gm_id })
    })
    .then((res) => res.json())
    .then((json) => {
      const voters = json.voters || [];
      setValues({ ...values, first: false, voters });
    })
  }

  const increment = () => {
    console.log("increment called");
    setI(i + 1);
  }

  if (values.first == true) {
    return <Text>Loading...</Text>
  }

  else if (values.voters.length == 0) {
    return <Text>All voters have been initiated! Congratulations! Now await responses!</Text>
  }

  else if (i > values.voters.length - 1) {
    return <Text>You have completed this batch of 1000. Refresh to get a new batch of another 1000 :)</Text>
  }

  else {
    console.log("values.voters[i] : ", values.voters[i]);
    return (
      <View>
        <GmInitiateConversation
          gm_id={ gm_id }
          voter={ values.voters[i] }
          increment={ () => increment() }
          token={ token }
        />
      </View>
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

export default GmInitiatePage;
