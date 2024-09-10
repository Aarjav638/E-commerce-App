import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../components/Navigator';

type PaymentProps = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const Payment = ({route}: PaymentProps) => {
  const params = route.params.Address;
  return (
    <SafeAreaView style={styles.container}>
      {params.map((item, index) => (
        <>
          <Text key={index}>{item.name}</Text>
          <Text key={index + 1}>{item.email}</Text>
          <Text key={index + 2}>{item.street}</Text>
          <Text key={index + 3}>{item.city}</Text>

          <Text key={index + 4}>{item.state}</Text>
          <Text key={index + 5}>{item.zip}</Text>
        </>
      ))}
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
