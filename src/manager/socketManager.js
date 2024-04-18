import io from 'socket.io-client';
import { IP_SERVER_APP } from '../constant/constants';

const socket = io(IP_SERVER_APP, {
    query: { clientId: "rect-native-12" }
});


export default socket;