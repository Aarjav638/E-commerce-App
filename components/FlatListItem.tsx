import {View, Image, Text, Button, StyleSheet} from 'react-native';
import {Rating} from 'react-native-ratings';
import {Product} from '../redux/constants/type';
import React from 'react';
import {useAppSelector} from '../redux/hooks/customHook';
type ItemProps = {
  item: Product;
  handleAddToCart: (item: any) => void;
  handleRemoveFromCart: (item: any) => void;
};
const Item = ({item, handleAddToCart, handleRemoveFromCart}: ItemProps) => {
  const {cartItems} = useAppSelector(state => state.cart);
  return (
    <View style={styles.productMainContainer}>
      <View style={styles.productContainer}>
        <Image
          style={{height: '100%', width: '40%'}}
          source={{uri: item.image}}
          resizeMode="contain"
        />
        <View style={styles.productInfo}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.rating}>
            <Rating imageSize={14} readonly startingValue={item.rating.rate} />
            <Text style={styles.RatingText}>({item.rating.count})</Text>
          </View>
          <Text style={styles.RatingText}>$ {item.price.toFixed(2)}</Text>

          <Button title="Add to Cart" onPress={() => handleAddToCart(item)} />

          {cartItems.find(cartItem => cartItem.id === item.id) && (
            <Button
              title="Remove from Cart"
              onPress={() => handleRemoveFromCart(item)}
            />
          )}
        </View>
      </View>
      <Text style={styles.category}>{item.category}</Text>
    </View>
  );
};
export default Item;
const styles = StyleSheet.create({
  productMainContainer: {
    justifyContent: 'space-around',
    width: '100%',
    height: 300,
    marginVertical: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    flex: 1,
  },
  productContainer: {
    gap: 10,
    height: '80%',
    flexDirection: 'row',
  },
  productInfo: {
    flexDirection: 'column',
    overflow: 'visible',
    gap: 10,
    padding: 10,
    flex: 1,
    height: '100%',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
  },
  RatingText: {
    fontSize: 14,
    color: 'grey',
  },
  category: {
    fontSize: 12,
    color: 'grey',
    borderWidth: 0.3,
    width: '35%',
    padding: 8,
    borderRadius: 10,
    alignSelf: 'center',
    textAlign: 'center',
    borderColor: 'grey',
  },
});
