import {BackHandler, Alert, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {
  CompositeNavigationProp,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '../../components/Navigation/BottomTabNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/Navigation/StackNavigator';
import Form from './component/RegistrationForm';
import {RegistrationFormState} from './schema/formSchema';
import LoginForm from './component/LoginForm';

type MiniHomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'MiniHome'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const Home = () => {
  const [users, setUsers] = React.useState<RegistrationFormState[]>([]);
  const [saved, setSaved] = React.useState(false);
  const navigation = useNavigation<MiniHomeNavigationProp>();
  const currentRoute = useNavigationState(
    state => state.routes[state.index].name,
  );

  const fetchUsersFromStorage = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('User');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      }
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    fetchUsersFromStorage();
  }, [saved]);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, currentRoute]);

  useEffect(() => {
    if (users.length > 0) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [users]);

  const handleBackButton = () => {
    if (currentRoute === 'MiniHome') {
      if (saved) {
        Alert.alert(
          'Warning',
          'You are existing the instaMart.Are you Sure to Exit',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => navigation.navigate('Home'),
            },
          ],
        );

        return true;
      }
      Alert.alert('Warning', 'You have unsaved data. Are you sure to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
      return true;
    } else {
      navigation.goBack();
      return true;
    }
  };

  console.log('User', users);
  console.log('Saved', saved);

  return (
    <SafeAreaView style={styles.container}>
      {users.length === 0 ? <Form setSaved={setSaved} /> : <LoginForm />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Home;
