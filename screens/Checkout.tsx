import {StyleSheet, View} from 'react-native';
import React from 'react';
import Form from '../components/Form/Form';
import {RootStackParamList} from '../components/Navigation/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type CheckoutProps = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const Checkout = ({route, navigation}: CheckoutProps) => {
  const params = route.params.totalPayableAmount;
  console.log(params);
  return (
    <View style={styles.container}>
      <Form navigation={navigation} route={route} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Checkout;
