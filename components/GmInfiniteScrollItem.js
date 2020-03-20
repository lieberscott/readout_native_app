import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const GmInfiniteScrollItem = (props) => {

  const [redirect, setRedirect] = useState(false);

  const handleRedirect = (e) => {
    let convo = e.target.getAttribute("poll_id");
    setRedirect(true);
  }

  const voter = props.navigation.getParam("voter");
  const poll_index = voter.polls.findIndex((el) => props.poll_id == el.poll_id);

  if (redirect) {
    return <View to={{
            pathname: '/gmconversation',
            state: { voter_id: props.voter["Voter File VANID"], gm_id: props.gm_id, cell: props.voter["Cell Phone"] }
        }}/>
  }
  return (
    <View onPress={ handleRedirect }>
      <Text>{ voter.polls[poll_index].messages.length ? voter.polls[poll_index].messages[0].read ? "" : "Blue dot" : "" }</Text>
      <Text>{ voter.FirstName + " " + voter.LastName }</Text>
      <Text>{ voter.polls[poll_index].messages.length ? voter.polls[poll_index].messages[0].content.slice(0, 20) : "Tap to initiate conversation" }</Text>
      <Text>{ voter.date_of_last_message }</Text>
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

export default GmInfiniteScrollItem;
