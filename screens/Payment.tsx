import {StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../components/Navigation/StackNavigator';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RegistrationFormState} from './miniApp/schema/formSchema';

type PaymentProps = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const Payment = ({navigation}: PaymentProps) => {
  const [users, setUsers] = React.useState<RegistrationFormState[]>([]);
  React.useEffect(() => {
    getStoredData();
  }, []);
  const getStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('User');
      if (storedData !== null) {
        console.log(storedData);
        setUsers(JSON.parse(storedData));
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Button
        onPress={() =>
          navigation.navigate(users.length > 0 ? 'miniApp' : 'OnBoarding')
        }>
        GO to Mini App
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Payment;
