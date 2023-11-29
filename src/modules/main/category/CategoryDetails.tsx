import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Categories from './components/Categories';
import Header from '../dashboard/components/Header';
import SubCategories from './components/SubCategories';
import StoresNearMe from './components/StoresNearMe';
import {appStyles} from '../../../styles/styles';

interface CategoryDetails {
  route: any;
}

const CategoryDetails: React.FC<CategoryDetails> = ({route: {params}}) => {
  return (
    <View style={[appStyles.container, styles.container]}>
      <Header />
      <ScrollView style={appStyles.container}>
        <Categories currentCategory={params.category} />
        <SubCategories currentCategory={params.category} />
        <StoresNearMe domain={params.domain} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
});

export default CategoryDetails;