import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';

const AllPolls = ({ navigation }) => {

  const [first, setFirst] = useState(true);
  const [polls, setPolls] = useState([]);
  const [gms, setGms] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (first == true) {
      populate();
    }
    else {
      // do nothing
    }

  }, [polls]);

  const populate = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
    }
    catch (e) {
      console.log('AsyncStorage Error: ' + e.message);
    }

    if (token) {
      fetch("http://localhost:3000/allpolls", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })
      .then((res) => res.json())
      .then((json) => {
        const polls = json.polls || [];
        const gms = json.gms || [];
        setPolls(polls);
        setGms(gms);
        setToken(token);
        setFirst(false);
      })
      .catch((err) => {
        console.log("err : ", err)
      });
    }
  }

  if (first) {
    return <View><Text>Loading still...</Text></View>
  }

  else {
    return (
      <View>
        <Button title="Your account" />
        <Text>Your Polls</Text>
        <FlatList
          keyExtractor={ (item, key) => item.poll_id }
          data={polls}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={ () => navigation.navigate("PollInfiniteScroll", { poll_id: item.poll_id, token })}>
              <Text>{ item.orgname }</Text>
              <Text>Start date: { item.poll_start }</Text>
            </TouchableOpacity>
          )}
        />
        <Text>Messaging Campaigns</Text>
        <FlatList
          keyExtractor={ (item, key) => item.gm_id }
          data={gms}
          renderItem={({ item }) => (
            <TouchableOpacity key={ item.gm_id } onPress={ () => navigation.navigate("GmInfiniteScroll", { gm_id: item.gm_id, token })}>
              <Text>{ item.orgname }</Text>
              <Text>Start date: { item.gm_start }</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )}
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AllPolls;
