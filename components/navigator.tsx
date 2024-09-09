import {Provider} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

import {store, persistor} from '../redux/store/store';
import {StatusBar} from 'react-native';
import Cart from '../screens/Cart';
import Home from '../screens/Home';
import {PersistGate} from 'redux-persist/lib/integration/react';
export type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={true}
          />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen
              name="Cart"
              component={Cart}
              options={{
                headerShown: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default Navigator;
