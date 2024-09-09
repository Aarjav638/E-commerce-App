import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {Product} from '../redux/constants/type';
import {useAppDispatch, useAppSelector} from '../redux/hooks/customHook';
import {fetchProductsAsync} from '../redux/middleWare/thunkMiddleWare';
import {RootState} from '../redux/store/store';
import {addToCart, removeFromCart} from '../redux/features/cart/cartSlice';
import Item from './FlatListItem';
import {filterData} from '../redux/helpers/filterData';
import useDebounce from '../hooks/useDebounce';

const FlatListSearch = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  const {loading, error} = useAppSelector((state: RootState) => state.product);
  const [searchQuery, setSearchQuery] = useState<string>('');
  // const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const handleAddToCart = useCallback(
    (product: any) => {
      dispatch({type: addToCart.type, payload: product});
    },
    [dispatch],
  );

  const filteredData = useAppSelector((state: RootState) =>
    filterData(state, debouncedSearchQuery),
  );
  const handleRemoveFromCart = useCallback(
    (product: any) => {
      dispatch({type: removeFromCart.type, payload: product});
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({item}: {item: Product}) => {
      return (
        <Item
          item={item}
          handleAddToCart={handleAddToCart}
          handleRemoveFromCart={handleRemoveFromCart}
        />
      );
    },
    [handleAddToCart, handleRemoveFromCart],
  );

  // const handleEndReached = useCallback(() => {
  //   if (!loadingMore) {
  //     setLoadingMore(true);
  //     setTimeout(() => {
  //       setLoadingMore(false);
  //     }, 1500);
  //   }
  // }, [loadingMore]);

  // const renderFooter = () => {
  //   if (!loadingMore) {
  //     return null;
  //   }
  //   return <ActivityIndicator size="small" color="black" />;
  // };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  if (error) {
    return <Text>Error loading data {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        placeholderTextColor={'grey'}
      />
      <Text style={styles.searchResult}>
        Showing {filteredData.length} results
      </Text>

      {filteredData && filteredData.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          // ListFooterComponent={renderFooter}
          // onEndReached={handleEndReached}
          // onEndReachedThreshold={0.1}
        />
      )}
    </View>
  );
};

export default FlatListSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchResult: {
    marginVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  searchInput: {
    height: 40,
    borderWidth: 0.5,
    color: 'black',

    borderColor: 'grey',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
