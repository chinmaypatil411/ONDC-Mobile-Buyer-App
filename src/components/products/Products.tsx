import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useNetworkHandling from '../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, PRODUCT_SEARCH} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import Filters from './Filters';
import {skeletonList} from '../../utils/utils';
import ProductSkeleton from '../skeleton/ProductSkeleton';
import Product from '../../modules/main/provider/components/Product';

interface Products {
  providerId: any;
  customMenu: any;
  subCategories: any[];
}

const CancelToken = axios.CancelToken;

const Products: React.FC<Products> = ({
  providerId = null,
  customMenu = null,
  subCategories = [],
}) => {
  const productSearchSource = useRef<any>(null);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [productsRequested, setProductsRequested] = useState<boolean>(true);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedAttributes, setSelectedAttributes] = useState<any>({});
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const searchProducts = async (
    pageNumber: number,
    selectedProvider: any,
    selectedMenu: any,
    subCategoryIds: any,
    attributes: any,
  ) => {
    try {
      setProductsRequested(true);
      productSearchSource.current = CancelToken.source();
      let url = `${API_BASE_URL}${PRODUCT_SEARCH}?pageNumber=${pageNumber}&limit=${BRAND_PRODUCTS_LIMIT}`;
      url += selectedProvider ? `&providerIds=${selectedProvider}` : '';
      url += selectedMenu ? `&customMenu=${selectedMenu}` : '';
      url +=
        subCategoryIds.length > 0
          ? `&categoryIds=${subCategoryIds.join(',')}`
          : '';
      Object.keys(attributes).map(key => {
        url += `&${key}=${attributes[key].join(',')}`;
      });

      const {data} = await getDataWithAuth(
        url,
        productSearchSource.current.token,
      );
      setTotalProducts(data.response.count);
      setProducts(data.response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setProductsRequested(false);
    }
  };

  useEffect(() => {
    searchProducts(
      page,
      providerId,
      customMenu,
      subCategories,
      selectedAttributes,
    ).then(() => {});
  }, [page, providerId, customMenu, subCategories, selectedAttributes]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Filters
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          providerId={providerId}
          category={subCategories.length ? subCategories[0] : null}
        />
        <View style={styles.reorderContainer}>
          <TouchableOpacity
            onPress={() => setIsGridView(true)}
            style={[
              styles.reorderButton,
              isGridView
                ? styles.activeReorderButton
                : styles.defaultReorderButton,
            ]}>
            <Icon
              name={'reorder-vertical'}
              size={20}
              color={isGridView ? '#fff' : '#333'}
            />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            onPress={() => setIsGridView(false)}
            style={[
              styles.reorderButton,
              isGridView
                ? styles.defaultReorderButton
                : styles.activeReorderButton,
            ]}>
            <Icon
              name={'reorder-horizontal'}
              size={20}
              color={isGridView ? '#333' : '#fff'}
            />
          </TouchableOpacity>
        </View>
      </View>
      {productsRequested ? (
        <FlatList
          numColumns={2}
          data={skeletonList}
          renderItem={() => <ProductSkeleton />}
          contentContainerStyle={styles.listContainer}
          keyExtractor={item => item.id}
        />
      ) : isGridView ? (
        <FlatList
          key={'grid'}
          numColumns={2}
          data={products}
          renderItem={({item}) => (
            <Product product={item} isGrid={isGridView} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text variant={'bodyMedium'}>No products available</Text>
            </View>
          )}
          contentContainerStyle={products.length === 0 ? styles.emptyContainer : styles.listContainer}
          keyExtractor={item => item.id}
        />
      ) : (
        <FlatList
          key={'list'}
          data={products}
          renderItem={({item}) => (
            <Product product={item} isGrid={isGridView} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text variant={'bodyMedium'}>No products available</Text>
            </View>
          )}
          contentContainerStyle={
            products.length === 0 ? styles.emptyContainer : styles.listContainer
          }
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
      marginTop: 8,
    },
    reorderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    separator: {
      width: 9,
    },
    reorderButton: {
      padding: 6,
      borderRadius: 8,
      borderWidth: 1,
    },
    activeReorderButton: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    defaultReorderButton: {
      borderColor: '#E8E8E8',
    },
    listContainer: {
      paddingHorizontal: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default Products;