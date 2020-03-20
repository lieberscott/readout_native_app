import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, FlatList } from 'react-native';

const Conversation = ({ navigation }) => {

  const [first, setFirst] = useState(true);
  const [convo, setConvo] = useState([]);
  const [text, setText] = useState("");

  const voter = navigation.getParam("voter");
  const cell = voter["Cell Phone"];
  const voter_id = voter["Voter File VANID"];
  const poll_id = navigation.getParam("poll_id");
  const token = navigation.getParam("token");

  useEffect(() => {
    if (first == true) {
      console.log("voter : ", voter);
      console.log("voter_id : ", voter_id);
      console.log("poll_id : ", poll_id);
      console.log("cell : ", cell);
      populate();
    }
    else {
      // do nothing
    }

  }, [convo]);

  const populate = () => {
    console.log("token : ", token);
    console.log("voter_id : ", voter_id);

    fetch("http://localhost:3000/getconvo", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, voter_id, poll_id })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      let messages = json.voter.polls[0].messages || [];
      console.log("messages : ", messages);
      setConvo(messages);
      setFirst(false);
    })
    .catch((err) => {
      console.log("err : ", err)
    });
  }

  const handleChange = (input) => {
    setText(input);
  };

  const handleSend = (e) => {
    e.persist();
    let t = text;
    let text_to = cell;
    // text_from will be picked up serverside
    setText("");

    fetch("http://localhost:3000/sendmessage", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, text: t, vanid: voter_id, poll_id, text_to, initiate_message: false })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      let message = json.message;
      setConvo(convo.push(message));
    })
    .catch((err) => {
      console.log("err : ", err);
    });

  };

  if (first) {
    return <Text>Loading...</Text>
  }

  else {
    return (
      <View>
        <Text>Conversation</Text>
        <Text>{ voter.FirstName } { voter.LastName }, { cell }</Text>
        <FlatList
          keyExtractor={ (item, key) => "msg" + key }
          data={convo}
          renderItem={({ item }) => <Text>{ item.content }</Text> }
        />
        <TextInput
          multiline={ true }
          numberOfLines={ 2 }
          borderBottomColor="black"
          borderBottomWidth={ 1 }
          name="text"
          onChangeText={ handleChange }
          value={ text || "" }
          />
        <TouchableOpacity><Button onPress={ handleSend } title="Send" /></TouchableOpacity>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Conversation;
