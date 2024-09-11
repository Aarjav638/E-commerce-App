import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from '../../screens/miniApp/Home';
import Mart from '../../screens/miniApp/Mart';
import {Icon} from 'react-native-paper';
import {StatusBar} from 'react-native';
export type BottomTabParamList = {
  MiniHome: undefined;
  Mart: undefined;
};
const TabNavigator = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        translucent={true}
        backgroundColor={'transparent'}
      />
      <TabNavigator.Navigator
        screenOptions={{
          headerShown: false,

          tabBarShowLabel: false,
        }}>
        <TabNavigator.Screen
          name="MiniHome"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <Icon
                source="home"
                color={focused ? 'darkcyan' : 'grey'}
                size={focused ? 30 : 20}
              />
            ),
          }}
        />
        <TabNavigator.Screen
          name="Mart"
          component={Mart}
          options={{
            tabBarIcon: ({focused}) => (
              <Icon
                source="store"
                color={focused ? 'darkcyan' : 'grey'}
                size={focused ? 30 : 20}
              />
            ),
          }}
        />
      </TabNavigator.Navigator>
    </>
  );
};
export default BottomTabNavigator;
