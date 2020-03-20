import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';

const GmInfiniteScroll = ({ navigation }) => {

  const [values, setValues] = useState({
    first: true, // first time component is loading?
    voters: [],
    refreshing: false
  });
  const gm_id = navigation.getParam("gm_id");
  const token = navigation.getParam("token");

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
      const start = -1; // will be read by back end as start at 0 and no limit

      fetch("http://localhost:3000/getvotersgm", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, start, gm_id })
      })
      .then((res) => res.json())
      .then((json) => {
        console.log("json.voters[0] : ", json.voters[0]);
        const voters = json.voters || [];
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
    return <Text>Loading...</Text>
  }

  else {
    return (
      <View>
        <TouchableOpacity>
          <Button onPress={ () => navigation.navigate("GmInitiatePage", { gm_id, token })} title="Initiate Mode"/>
        </TouchableOpacity>
        <Text>Press the button above to quickly cycle through your list to populate and send your first outgoing message.</Text>
        <Text>Or tap a name below to open the conversation.</Text>
        <FlatList
          keyExtractor={ (item, key) => "v" + item["Voter File VANID"] }
          data={values.voters}
          renderItem={({ item }) => {
            const gm_index = item.gms.findIndex((el) => gm_id == el.gm_id);
            return (
              <TouchableOpacity onPress={ () => navigation.navigate("GmConversation", { gm_id, voter: item, token }) }>
                <Text>{ item.gms[gm_index].messages.length ? item.gms[gm_index].messages[0].read ? "" : "Blue dot" : "" }</Text>
                <Text>{ item.FirstName + " " + voter.LastName }</Text>
                <Text>{ item.gms[gm_index].messages.length ? item.gms[gm_index].messages[0].content.slice(0, 20) : "Tap to initiate conversation" }</Text>
                <Text>{ item.date_of_last_message }</Text>
              </TouchableOpacity>
            )
          })}
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

export default GmInfiniteScroll;
