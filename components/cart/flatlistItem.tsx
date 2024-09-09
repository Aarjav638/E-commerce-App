import {View, Image, Text, StyleSheet} from 'react-native';
import {Product} from '../../redux/constants/type';
import React from 'react';
import {useAppSelector} from '../../redux/hooks/customHook';
import Icon from 'react-native-vector-icons/FontAwesome6';
type ItemProps = {
  item: Product;
  handleAddToCart: (item: any) => void;
  quantity: number;
  handleRemoveFromCart: (item: any) => void;
};
const Item = ({
  item,
  handleAddToCart,
  handleRemoveFromCart,
  quantity,
}: ItemProps) => {
  const {cartItems} = useAppSelector(state => state.cart);
  return (
    <View style={styles.productMainContainer}>
      <View style={styles.productContainer}>
        <Image
          style={{height: '70%', width: '40%'}}
          source={{uri: item.image}}
          resizeMode="contain"
        />
        <View style={styles.productInfo}>
          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.RatingText}>Price: ${item.price.toFixed(2)}</Text>

          <View style={styles.quantityContainer}>
            {cartItems.find(cartItem => cartItem.id === item.id) && (
              <Icon
                name="trash"
                color={'red'}
                size={20}
                onPress={() => handleRemoveFromCart(item)}
              />
            )}

            <Text style={styles.Quantity}>{quantity}</Text>
            <Icon
              name="cart-plus"
              color={'grey'}
              size={20}
              onPress={() => handleAddToCart(item)}
            />
          </View>
          <Text style={styles.RatingText}>
            Total: ${(item.price * quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default Item;
const styles = StyleSheet.create({
  productMainContainer: {
    justifyContent: 'space-around',
    width: '100%',
    height: 230,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    marginVertical: 16,
    padding: 10,
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
  },
  Quantity: {
    fontSize: 16,
    color: 'grey',
    borderWidth: 1,
    borderColor: 'grey',
    padding: 5,
    borderRadius: 5,
    width: 50,
    textAlign: 'center',
  },
  productContainer: {
    gap: 10,
    height: '90%',
    flexDirection: 'row',
  },
  productInfo: {
    flexDirection: 'column',
    overflow: 'visible',
    gap: 15,
    padding: 10,
    flex: 1,
    height: '70%',
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
});
