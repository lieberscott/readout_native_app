import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const GmInitiateConversation = (props) => {

  // const [first, setFirst] = useState(true);
  const [convo, setConvo] = useState([]);
  const [cell, setCell] = useState("");
  const [text, setText] = useState("");
  const [voterId, setVoterId] = useState("");
  const [gmId, setGmId] = useState("");

  useEffect(() => {
    setCell(props.voter["Cell Phone"]);
    setVoterId(props.voter["Voter File VANID"]);
    setGmId(props.gm_id);
    setText("");
  }, [props])

  const handleChange = (e) => {
    e.persist();
    setText(e.target.value);
  };

  const handleInitiate = (e) => {
    e.persist();

    const token = localStorage.getItem("token");
    const voter_id = voterId;
    const gm_id = gmId;

    fetch("https://readoutconsult.com/initiatemessagegm", {
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
    const token = localStorage.getItem("token");
    const t = text;
    const gm_id = gmId;
    const text_to = cell;
    setText("");

    fetch("https://readoutconsult.com/sendmessagegm", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, text: t, voter_id: voterId, gm_id, text_to })
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
      <Text>{ props.voter.FirstName } { props.voter.LastName }</Text>
      <Text>{ props.voter["Cell Phone"] }</Text>
      { convo.length ? convo.map((c, i) => {
        return (
          <View>
            <Text>{c.content}</Text>
          </View>
        )
      }) : <div><Button onClick={ handleInitiate }>Initiate</Button><div>Press initiate, then Send, to initiate conversation</div></div> }
      <Input type="textarea" name="text" onChange={ handleChange } value={ text || "" }  />
      <Button onClick={ handleSend }>Send</Button>
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
