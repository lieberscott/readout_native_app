import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';

const AllPolls = ({ navigation }) => {

  const [first, setFirst] = useState(true);
  const [polls, setPolls] = useState([]);
  const [gms, setGms] = useState([]);
  const [token, setToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (first == true) {
      populate();
    }
    else {
      // do nothing
    }

  }, [polls]);

  const populate = async () => {
    let t;
    try {
      t = await AsyncStorage.getItem("token");
    }
    catch (e) {
      console.log('AsyncStorage Error: ' + e.message);
    }

    if (t) {
      fetch("http://localhost:3000/allpolls", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: t })
      })
      .then((res) => res.json())
      .then((json) => {
        const polls = json.polls || [];
        const gms = json.gms || [];
        setPolls(polls);
        setGms(gms);
        setToken(token);
        setFirst(false);
        setRefreshing(false);
      })
      .catch((err) => {
        console.log("err : ", err);
        setRefreshing(false);
      });
    }
  }

  const handleRefresh = () => {
    setValues({ ...values, refreshing: true }, () => populate());
  }

  if (first) {
    return <View><Text>Loading...</Text></View>
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
            <TouchableOpacity key={ item.poll_id } onPress={ () => navigation.navigate("PollInfiniteScroll", { poll_id: item.poll_id, token })}>
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
          refreshing={ refreshing }
          onRefresh={ handleRefresh }
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
