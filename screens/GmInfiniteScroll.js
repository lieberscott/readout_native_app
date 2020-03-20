import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';

import GmInfiniteScrollItem from '../components/GmInfiniteScrollItem';

const GmInfiniteScroll = ({ navigation }) => {

  const [values, setValues] = useState({
    first: true, // first time component is loading?
    voters: []
  });
  const [gmId, setGmId] = useState(props.gm_id)

  useEffect(() => {
    if (values.first == true) { // page is rendering for first time
      getResponses();
    }
    else {
      console.log("not first poll detail single scrollbox");
    }
  }, [values]);

  const getResponses = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
    }
    catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
      setError("Unable to access page. Please try logging in again.");
    }

    if (token) {
      const start = -1; // will be read by back end as start at 0 and no limit
      const gm_id = gmId; // "4382194314"

      fetch("https://readoutconsult.com/getvotersgm", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, start, gm_id })
      })
      .then((res) => res.json())
      .then((json) => {
        console.log("json : ", json);
        const voters = json.voters || [];
        setValues({ ...values, first: false, voters });
      })
    }
  }

  const handleInitiate = () => {
    console.log("handle Initiate");
  }

    return (
      <View>
        <Text>Your Conversations</Text>
        <TouchableOpacity><Button onPress={ handleInitiate } title="Initiate Mode" /></TouchableOpacity>
        <Text>Press button to enter Initiate Mode</Text>
        <FlatList
          data={voters}
          renderItem={({ voter }) => (
            <GmInfiniteScrollItem gm_id={ gmId } key={ voter["Voter File VANID"] } voter={ voter } />
          )}
        />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default GmInfiniteScroll;
