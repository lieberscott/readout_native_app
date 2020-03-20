import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';

const PollInfiniteScroll = ({ navigation }) => {

  const [values, setValues] = useState({
    first: true, // first time component is loading?
    voters: [],
    refreshing: false
  });
  const token = navigation.getParam("token");
  const poll_id = navigation.getParam("poll_id");

  useEffect(() => {
    if (values.first == true) { // page is rendering for first time
      getResponses();
    }
    else {
      console.log("not first poll detail single scrollbox");
    }
  }, [values]);

  const getResponses = () => {

    if (token) {
      let start = -1; // will be read by back end as start at 0 and no limit

      fetch("http://localhost:3000/getvoters", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, start, poll_id })
      })
      .then((res) => res.json())
      .then((json) => {
        console.log("json : ", json);
        let voters = json.voters || [];
        setValues({ ...values, first: false, refreshing: false, voters });
      })
      .catch((err) => {
        console.log("Err : ", err);
        setValues({ ...values, refreshing: false });
      });
    }
  }

  const handleRefresh = () => {
    setValues({ ...values, refreshing: true }, () => getResponses());
  }

  if (values.first) {
    return <Text>Loading....</Text>
  }

  else {
    return (
      <View>
        <TouchableOpacity>
          <Button onPress={ () => navigation.navigate("InitiatePage", { poll_id, token })} title="Initiate Mode"/>
        </TouchableOpacity>
        <Text>Press the button above to quickly cycle through your list to populate and send your first outgoing message.</Text>
        <Text>Or tap a name below to open the conversation.</Text>
        <FlatList
          keyExtractor={ (item, key) => "v" + item["Voter File VANID"] }
          data={values.voters}
          renderItem={({ item }) => {
            const poll_index = item.polls.findIndex((el) => poll_id == el.poll_id);
            return (
              <TouchableOpacity onPress={ () => navigation.navigate("Conversation", { poll_id, voter: item, token }) }>
                <Text>{ item.polls[poll_index].messages.length ? item.polls[poll_index].messages[0].read ? "" : "Blue dot" : "" }</Text>
                <Text>{ item.FirstName + " " + item.LastName }</Text>
                <Text>{ item.polls[poll_index].messages.length ? item.polls[poll_index].messages[0].content.slice(0, 20) : "Tap to initiate conversation" }</Text>
                <Text>{ item.date_of_last_message }</Text>
              </TouchableOpacity>
            )}
          }
          refreshing={ values.refreshing }
          onRefresh={ handleRefresh }
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

export default PollInfiniteScroll;
