import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  Dimensions,
  Alert,
  FlatList,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import CardsSection from './CardsSection';

const {width} = Dimensions.get('window');

const App = () => {
  const [state, setState] = useState({
    visible: true,
    refreshing: false,
    data: [],
    page: 0,
    isLoading: false,
    searchModal: false,
    searchText: '',
    detailPage: false,
    detailsPageData: {},
  });

  // fetching data from an api
  const fetchingData = async () => {
    if (state.page === -1) {
      setState((prev) => ({...prev, page: 0}));
    } else {
      const URL = `https://hn.algolia.com/api/v1/search_by_date?tags=${
        state.searchText === '' ? 'story' : state.searchText
      }&page=${state.page}`;
      const headers = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      await axios
        .get(URL, headers)
        .then((response) => {
          console.log('#. fetchingData() : ', response.status, ' URL : ', URL);
          if (response.status === 200) {
            setState((prev) => ({
              ...prev,
              data: prev.data.concat(response.data.hits),
              visible: false,
              isLoading: false,
            }));
          } else {
            setState((prev) => ({
              ...prev,
              visible: false,
              isLoading: false,
            }));
            Alert.alert(
              'TestProject',
              ' ' + 'Something went wrong please try again!',
            );
          }
        })
        .catch((error) => {
          setState((prev) => ({
            ...prev,
            visible: false,
            isLoading: false,
          }));
          console.log('#. fetchingData() error : ', error);
          Alert.alert('TestProject', ' ' + error);
        });
    }
  };

  const renderCards = useCallback(
    ({item, index}) => (
      <TouchableOpacity
        key={index}
        style={style.itemContainer}
        onPress={() =>
          setState((prev) => ({
            ...prev,
            detailsPageData: item,
            detailPage: true,
          }))
        }>
        <Text style={style.title}>{`${index + 1}. ${item.title}`}</Text>
        <Text style={style.urldate}>{item.url}</Text>
        <Text style={style.urldate}>
          {moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')}
        </Text>
        <Text style={style.author}>{item.author}</Text>
      </TouchableOpacity>
    ),
    [],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const hitRefreshAPI = () => setState((prev) => ({...prev, page: -1}));

  const increasePageCount = () =>
    setState((prev) => ({...prev, page: state.page + 1, isLoading: true}));

  const renderFooter = () => {
    return state.isLoading ? (
      <View style={style.footer}>
        <ActivityIndicator animating size="large" color="#000" />
      </View>
    ) : null;
  };

  const handleChange = (e) => {
    setState((prev) => ({...prev, searchText: e}));
  };

  const goBack = () => setState((prev) => ({...prev, detailPage: false}));

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchingData();
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    fetchingData();
  }, [state.page]);

  return (
    <View style={style.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {state.visible ? (
        <View style={style.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <>
          {state.detailPage ? (
            <CardsSection item={state.detailsPageData} goBack={goBack}/>
          ) : (
            <>
              {!state.searchModal ? (
                <View style={style.headerContainer}>
                  <View style={style.headerContainer1} />
                  <Text style={style.title}>Home</Text>
                  <TouchableOpacity
                    style={style.headerContainer2}
                    onPress={() =>
                      setState((prev) => ({
                        ...prev,
                        searchModal: !prev.searchModal,
                      }))
                    }>
                    <Text style={style.author}>Search</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    ...style.headerContainer,
                    ...{justifyContent: 'center', height: 46},
                  }}>
                  <View style={style.hiddenSearchContainer} />
                  <TextInput
                    style={style.textinputStyle}
                    value={state.searchText}
                    autoCorrect={false}
                    onChangeText={(val) => handleChange(val)}
                    placeholder="enter text here..."
                    placeholderTextColor="rgba(0,0,0,0.6)"
                    returnKeyType="search"
                    onSubmitEditing={() => hitRefreshAPI()}
                  />
                  <TouchableOpacity
                    style={style.headerContainer2}
                    onPress={() =>
                      setState((prev) => ({
                        ...prev,
                        searchModal: !prev.searchModal,
                      }))
                    }>
                    <Text style={{...style.author, ...{marginBottom: 3}}}>
                      x
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <FlatList
                data={state.data}
                renderItem={renderCards}
                keyExtractor={keyExtractor}
                onEndReached={increasePageCount}
                onEndReachedThreshold={0.05}
                refreshing={state.refreshing}
                onRefresh={hitRefreshAPI}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={renderFooter}
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  activityIndicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    height: 40,
    width,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContainer1: {height: 40, width: 60},
  hiddenSearchContainer: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
  },
  headerContainer2: {
    height: 40,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinputStyle: {
    flex: 1,
    width: width / 1.5,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    marginBottom: 3,
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  itemContainer: {margin: 5, width},
  title: {fontSize: 16, fontWeight: 'bold'},
  urldate: {fontSize: 12},
  author: {fontSize: 14},
});

export default App;
