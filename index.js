/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import rootReducer from './src/redux/reducers/rootReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(rootReducer); // Crea lo store Redux utilizzando il rootReducer

const Main = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Main);
