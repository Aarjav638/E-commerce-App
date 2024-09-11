import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {RootStackParamList} from './Navigation/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAppSelector} from '../redux/hooks/customHook';

type HeaderProp = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Header = ({navigation}: HeaderProp) => {
  const {loading} = useAppSelector(state => state.product);
  const {cartItems} = useAppSelector(state => state.cart);
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headerText}>Home</Text>

      <View>
        <Icon
          name="cart-shopping"
          size={20}
          color="#fff"
          style={styles.iconStyle}
          disabled={loading}
          onPress={() => navigation.navigate('Cart')}
        />
        <Text style={styles.cartText}>{cartItems.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'darkcyan',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'white',
  },
  iconStyle: {
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  cartText: {
    color: 'white',
    position: 'absolute',
    top: 0,
    backgroundColor: 'red',
    right: 5,
    height: 20,
    width: 20,
    zIndex: 1,
    textAlign: 'center',
    borderRadius: 10,
  },
});

export default Header;
