import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';

const {width} = Dimensions.get('window');

const CardsSection = ({item, goBack}) => {
  return (
    <View style={{flex: 1}}>
      <View style={style.headerContainer}>
        <TouchableOpacity
          style={style.headerContainer2}
          onPress={() => goBack()}>
          <Text style={style.author}>x</Text>
        </TouchableOpacity>
        <Text style={style.title}>Details</Text>
        <View style={style.headerContainer1} />
      </View>
      <Text style={{width: width / 1.12, fontSize: 15}}>{item.title}</Text>
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

export default CardsSection;
