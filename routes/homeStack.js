import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import AllPolls from '../screens/AllPolls';
import PollInfiniteScroll from '../screens/PollInfiniteScroll';
import InitiatePage from '../screens/InitiatePage';
import Conversation from '../screens/Conversation';
import GmInfiniteScroll from '../screens/GmInfiniteScroll';
import GmInitiatePage from '../screens/GmInitiatePage';
import GmConversation from '../screens/GmConversation';

const screens = {
  AllPolls: {
    screen: AllPolls
  },
  PollInfiniteScroll: {
    screen: PollInfiniteScroll
  },
  InitiatePage: {
    screen: InitiatePage
  },
  Conversation: {
    screen: Conversation
  },
  GmInfiniteScroll: {
    screen: PollInfiniteScroll
  },
  GmInitiatePage: {
    screen: InitiatePage
  },
  GmConversation: {
    screen: Conversation
  }
}

const HomeStack = createStackNavigator(screens)

export default createAppContainer(HomeStack);
