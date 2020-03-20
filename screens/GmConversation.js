import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';

const GmConversation = (props) => {

  const [first, setFirst] = useState(true);
  const [convo, setConvo] = useState([]);
  const [voter, setVoter] = useState({

  });
  const [cell, setCell] = useState(props.location.state ? props.location.state.cell : "");
  const [text, setText] = useState("");
  const [voterId, setVoterId] = useState(props.location.state ? props.location.state.voter_id : "");
  const [gmId, setGmId] = useState(props.location.state ? props.location.state.gm_id : "");
  const [rsvps_boolean, setRsvps_boolean] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    if (first == true) {
      populate();
    }
    else {
      // do nothing
    }

  }, []);

  const populate = () => {
    const token = localStorage.getItem("token");
    const voter_id = voterId;
    const gm_id = gmId;

    fetch("https://readoutconsult.com/getconvogm", {
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
      const messages = json.voter.general_messages.messages || [];
      const first = json.voter.FirstName;
      const last = json.voter.LastName;
      const cell = json.voter["Cell Phone"];
      const rsvps_boolean = json.rsvps_boolean;
      setConvo(messages);
      setVoter({...voter, first, last, cell });
      setRsvps_boolean(rsvps_boolean);
      setFirst(false);
    })
    .catch((err) => {
      console.log("err : ", err)
    });
  }

  const handleChange = (e) => {
    e.persist();
    setText(e.target.value);
  };

  const handleSend = (e) => {
    e.persist();
    const token = localStorage.getItem("token");
    const t = text;
    const gm_id = gmId;
    const text_to = cell;
    // text_from will be picked up serverside
    setText("");

    fetch("https://readoutconsult.com/sendmessagegm", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, text: t, vanid: voterId, gm_id, text_to })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      const message = json.message;
      setConvo(convo.push(message));
    })
    .catch((err) => {
      console.log("err : ", err);
    });
  };

  const rsvpYes = () => {
    const token = localStorage.getItem("token");
    const gm_id = gmId;
    const voter_id = voterId;

    fetch("https://readoutconsult.com/rsvpyes", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, gm_id, voter_id })
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.error) {
        setError(json.error);
        setSuccess("");
      }
      else {
        setError("");
        setSuccess(json.success);
      }
    })
    .catch((err) => {
      setError(json.error);
      setSuccess("");
      console.log("err : ", err);
    });
  }

  const rsvpNo = () => {
    const token = localStorage.getItem("token");
    const gm_id = gmId;
    const voter_id = voterId;

    fetch("https://readoutconsult.com/rsvpno", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, gm_id, voter_id })
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.error) {
        setError(json.error);
        setSuccess("");
      }
      else {
        setError("");
        setSuccess(json.success);
      }
    })
    .catch((err) => {
      setError(json.error);
      setSuccess("");
      console.log("err : ", err);
    });
  }


  if (first) {
    return <Text>Loading...</Text>
  }

  else {
    return (
      <View>
        { error ? <Alert color="danger">{ error }</Alert> : "" }
        { success ? <Alert color="success">{ success }</Alert> : "" }
        <TouchableOpacity><Button>Your account</Button></TouchableOpacity>
        <Text>Conversation</Text>
        <Text>{ voter.first } { voter.last }, { voter.cell }</Text>
        { convo.length ? convo.map((c, i) => {
          return (
            <Text>{c.content}</Text>
          )
        }) : "" }
        <TextInput type="textarea" name="text" onChange={ handleChange } value={ text || "" }  />
        <TouchableOpacity><Button onClick={ handleSend }>Send</Button></TouchableOpacity>
        { rsvps_boolean ? <View><TouchableOpacity><Button onClick={ rsvpYes }>RSVP Yes</Button></TouchableOpacity><TouchableOpacity><Button onClick={ rsvpNo }>RSVP No</Button></TouchableOpacity></View> : "" }
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

export default GmConversation;
