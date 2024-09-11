import {Provider} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {store, persistor} from '../../redux/store/store';
import {StatusBar} from 'react-native';
import Cart from '../../screens/Cart';
import Home from '../../screens/Home';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {PaperProvider} from 'react-native-paper';
import Checkout from '../../screens/Checkout';
import Payment from '../../screens/Payment';
import {FormState} from '../../atoms/FormAtom';
import Splash from '../../screens/miniApp/Splash';
import BottomTabNavigator from './BottomTabNavigator';
export type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Checkout: {
    totalPayableAmount: number | undefined;
  };
  Payment: {
    Address: FormState[];
  };
  OnBoarding: undefined;
  miniApp: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
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
              <Stack.Screen
                name="Checkout"
                component={Checkout}
                options={{
                  headerShown: true,
                }}
              />
              <Stack.Screen name="Payment" component={Payment} />
              <Stack.Screen name="OnBoarding" component={Splash} />
              <Stack.Screen name="miniApp" component={BottomTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default Navigator;
