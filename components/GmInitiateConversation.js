import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';

const GmInitiateConversation = (props) => {

  // const [first, setFirst] = useState(true);
  const [convo, setConvo] = useState([]);
  const [text, setText] = useState("");

  const voter = props.voter;
  const voter_id = voter["Voter File VANID"];
  const gm_id = props.gm_id;
  const cell = voter["Cell Phone"];
  const token = props.token;

  useEffect(() => {
    setText("");
  }, [props])

  const handleChange = (e) => {
    e.persist();
    setText(e.target.value);
  };

  const handleInitiate = (e) => {
    e.persist();

    fetch("http://localhost:3000/initiatemessagegm", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, voter_id, gm_id })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      const votername = json.votername;
      const name = json.name; // Agent name (Scott)
      const orgname = json.orgname;
      const text = json.text;

      let message = "Hi " + votername + ",\nMy name is " + name + ", I'm with the " + orgname + " campaign. " + text;
      setText(message);
    })
    .catch((err) => {
      console.log("err : ", err);
    });
  };

  const handleSend = (e) => {
    e.persist();
    const t = text;
    const text_to = cell;
    setText("");

    fetch("http://localhost:3000/sendmessagegm", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, text: t, voter_id, gm_id, text_to })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      let message = json.message;
      console.log("before increment");
      props.increment();
    })
    .catch((err) => {
      console.log("err : ", err);
    });
  };

  return (
    <View>
      <Text>{ voter.FirstName } { voter.LastName }</Text>
      <Text>{ cell }</Text>
      <FlatList
        keyExtractor={ (item, key) => "msg" + key }
        data={convo}
        renderItem={({ item }) => <Text>{ item.content }</Text> }
      />
      <TouchableOpacity>
        <Button onPress={ handleInitiate } title="Initiate" />
      </TouchableOpacity>
      <Text>Press Initiate, then Send, to initiate conversation</Text>
      <TextInput
        multiline={ true }
        numberOfLines={ 2 }
        borderBottomColor="black"
        borderBottomWidth={ 1 }
        name="text"
        onChangeText={ handleChange }
        value={ text || "" }
        />
      <Button onPress={ handleSend } title="Send" />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GmInitiateConversation;
