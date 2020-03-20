import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, TouchableOpacity } from 'react-native';

const InitiateConversation = (props) => {

  // const [first, setFirst] = useState(true);
  const [convo, setConvo] = useState([]);
  const [text, setText] = useState("");
  const [mixedResArr, setMixedResArr] = useState([]);
  const poll_id = props.poll_id;
  const cell = props.voter["Cell Phone"];
  const token = props.token;
  const voter = props.voter;
  const voter_id = voter["Voter File VANID"];

  useEffect(() => {
    setMixedResArr([]);
    setText("");
  }, [props])

  const handleChange = (e) => {
    setText(e);
  };

  const handleInitiate = (e) => {
    e.persist();

    fetch("http://localhost:3000/initiatemessage", {
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
      const votername = json.votername;
      const name = json.name; // Agent name (Scott)
      const month = json.month;
      const day = json.day;
      const office = json.office;
      const primary = json.primary; // Boolean
      const candidates = json.candidates;
      const candidates_copy = [...candidates];
      const orgname = json.orgname;

      console.log("candidates pre mixed : ", candidates);
      // create mixed_res_arr
      const len = candidates.length;
      const cands0 = candidates.splice(len - 3, len - 1); // last three elements of array: ["Another candidate", "Unsure", "Not planning to vote"];
      // candidates is just an array of the named candidates, since `splice` changes the contents of the array it is called on

      let mixed_res_arr = []; // will be array of indexes: [1, 0, 2]
      // first put mixed_res_arr in order
      for (let l = 0; l < candidates.length; l++) {
        mixed_res_arr.push(l); // [0, 1, 2]
      }

      // second, mix mixed_res_arr
      for (let i = mixed_res_arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mixed_res_arr[i], mixed_res_arr[j]] = [mixed_res_arr[j], mixed_res_arr[i]];
      }
      // mixed_res_arr now mixed: [2, 0, 1]
      let message = "Hi " + votername + ",\nMy name is " + name + ", I'm with the " + orgname + " campaign, and we're conducting a poll on the ";
      message = primary ? message + "primary " : message;
      message = message + "race for " + office + ". If you have a moment to participate, we would very much appreciate it.\nPlease respond with your preference below.\n\n";


      for (let k = 0; k < candidates.length; k++) {
        const index = mixed_res_arr[k]; // will be a number like 2
        message = message + 'Reply "' + (k + 1) + '" if you are planning to vote for ' + candidates[index] + "\n";
      }

      message = message + 'Reply "' + (candidates.length + 1) + '" if you are planning to vote for a different candidate\n';
      message = message + 'Reply "' + (candidates.length + 2) + '" if you are Unsure/Undecided on who to vote for\n';
      message = message + 'Reply "' + (candidates.length + 3) + '" if you are not planning to vote\n';

      message += "\nIf you would like to stop receiving texts from us, you can simply reply 'STOP' and you will be removed from our list.\n\nThank you and have a good day.";

      // add last three responses (which will always be in same order) to mixed_res_arr
      for (let m = 0; m < 3; m++) {
        mixed_res_arr.push(mixed_res_arr.length); // [2, 0, 1, 3, 4, 5] <-- indexes of candidates arr (in Poll schema)
      }
      setMixedResArr(mixed_res_arr);
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
    const mixed_res_arr = mixedResArr;
    const initial_bool = true;
    // text_from will be picked up serverside
    setText("");

    fetch("http://localhost:3000/sendmessage", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, mixed_res_arr, text: t, voter_id, poll_id, text_to, initial_bool })
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });


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

export default InitiateConversation;
