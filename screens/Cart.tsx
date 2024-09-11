import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks/customHook';
import Item from '../components/cart/FlatListItem';
import {Product} from '../redux/constants/type';
import {addToCart, removeFromCart} from '../redux/features/cart/cartSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../components/Navigation/StackNavigator';

type CartProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const Cart = ({navigation}: CartProps) => {
  const dispatch = useAppDispatch();
  const {cartItems} = useAppSelector(state => state.cart);
  const totalPrice = Number(
    cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2),
  );
  const discount = 0;
  const tax = 0;
  const delivery = 0;
  const totalPayableAmount = totalPrice + discount + tax + delivery;
  const handleAddToCart = useCallback(
    (product: any) => {
      dispatch({type: addToCart.type, payload: product});
    },
    [dispatch],
  );

  const handleRemoveFromCart = useCallback(
    (product: any) => {
      dispatch({type: removeFromCart.type, payload: product});
    },
    [dispatch],
  );

  const groupedCartItems = useMemo(() => {
    const groupedItems: Record<string, {item: Product; quantity: number}> = {};
    cartItems.forEach(cartItem => {
      if (groupedItems[cartItem.id]) {
        groupedItems[cartItem.id].quantity += 1;
      } else {
        groupedItems[cartItem.id] = {item: cartItem, quantity: 1};
      }
    });
    return Object.values(groupedItems);
  }, [cartItems]);

  const renderItem = useCallback(
    ({item}: {item: {item: Product; quantity: number}}) => {
      return (
        <Item
          item={item.item}
          quantity={item.quantity}
          handleAddToCart={handleAddToCart}
          handleRemoveFromCart={handleRemoveFromCart}
        />
      );
    },
    [handleAddToCart, handleRemoveFromCart],
  );

  if (!cartItems.length) {
    return (
      <View style={styles.EmptyContainer}>
        <Text style={styles.RatingText}>Cart</Text>
        <Text style={styles.RatingText}>No items in cart</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Total Items: {cartItems.length}</Text>

      <FlatList
        keyExtractor={item => item.item.id.toString()}
        data={groupedCartItems}
        renderItem={renderItem}
        ListFooterComponent={
          <View style={styles.priceDetails}>
            <Text style={styles.priceDetailsText}>Price BreakUp</Text>

            <Text style={styles.total}>Total Items: {cartItems.length}</Text>
            <Text style={styles.total}>Total Price: ${totalPrice}</Text>
            <Text style={styles.total}>
              Total Discount: ${discount.toFixed(2)}
            </Text>
            <Text style={styles.total}>Total Tax: ${tax.toFixed(2)}</Text>
            <Text style={styles.total}>
              Delivery Charges: ${delivery.toFixed(2)}
            </Text>
            <Text style={styles.total}>
              Total Payable Amount: ${totalPayableAmount.toFixed(2)}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Checkout', {
            totalPayableAmount: Number(totalPayableAmount.toFixed(2)),
          })
        }>
        <Text style={styles.buttonText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  EmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'grey',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
    textAlign: 'right',
    marginRight: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    padding: 15,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 10,
  },
  RatingText: {
    fontSize: 14,
    color: 'grey',
  },
  buttonText: {color: 'white'},
  priceDetails: {
    gap: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    borderRadius: 10,
    height: 250,
  },
  priceDetailsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
  },
});
