import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

const CoinList = () => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCoins = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://coingeko.burjx.com/coin-prices-all?currency=usd&page=${page}&pageSize=10`
      );
      const newData = response.data.data;

      if (newData.length > 0) {
        setCoins((prevCoins) => {
          const updated = [...prevCoins, ...newData];
          filterCoins(searchTerm, updated);
          return updated;
        });
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, searchTerm]);

  const filterCoins = (term, sourceCoins = coins) => {
    if (!term) {
      setFilteredCoins(sourceCoins);
      return;
    }

    const filtered = sourceCoins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(term.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredCoins(filtered);
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    filterCoins(text);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const renderItem = ({ item }) =>
  (
    <View style={styles.coinContainer}>
      <View style={styles.coinContainer22}>
        <Image source={{ uri: item.image }} style={styles.coinImage} />
        <View style={styles.coinInfo}>
          <Text style={styles.coinPrice}>
            {item.symbol.toUpperCase()}
          </Text>
          <Text style={[styles.coinPrice, { color: "#9A9A9A" }]}>
            {item.name}
          </Text>
        </View>
      </View>
      <View style={styles.coinInfo}>
        <Text style={styles.coinPrice}>
          ${item.currentPrice.toLocaleString()}
        </Text>
        <Text
          style={[
            styles.coinChange,
            {
              color:
                item.priceChangePercentage24h >= 0 ? '#BAE609' : 'red',
            },
          ]}
        >
          {item.priceChangePercentage24h.toFixed(2)}%
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        value={searchTerm}
        onChangeText={handleSearch}
        style={styles.searchInput}
        placeholderTextColor="#999"
      />

      <Text style={{ color: "#9A9A9A" , marginVertical:20, fontSize: 14}}>
        All Coins
      </Text>
      <FlatList
        data={filteredCoins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={fetchCoins}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#9A9A9A" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 50,
    backgroundColor: '#353535',
  },
  searchInput: {
    marginTop:20,
    height: 45,
    // borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#fff',
    backgroundColor: '#404040',
  },
  coinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#353535',
    borderRadius: 25,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderColor: "#646464",
    borderWidth: 0.5
  },
  coinContainer22: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  coinImage: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 30
  },
  coinInfo: {
    // flex: 1,
  },
  coinName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',

  },
  coinPrice: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  coinChange: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default CoinList;
