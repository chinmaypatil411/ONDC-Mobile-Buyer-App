import React, {useCallback} from 'react';
import {Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from '../../utils/theme';
import useStatusBarColor from '../../hooks/useStatusBarColor';
import useBackHandler from '../../hooks/useBackHandler';

interface Page {
  label: string;
  search?: boolean;
  wishlist?: boolean;
  cart?: boolean;
}

const HeaderWithActions: React.FC<Page> = ({label, search, wishlist, cart}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation: any = useNavigation();
  const {goBack} = useBackHandler();
  useStatusBarColor('dark-content', theme.colors.white);

  const openSearch = useCallback(() => {
    navigation.navigate('SearchProducts');
  }, [navigation]);

  const openWishlist = useCallback(() => {
    navigation.navigate('WishList');
  }, [navigation]);

  const openCart = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  return (
    <View style={styles.header}>
      <View style={styles.headerTitle}>
        <TouchableOpacity onPress={goBack}>
          <MaterialIcons
            name={'arrow-back'}
            size={24}
            color={theme.colors.neutral400}
          />
        </TouchableOpacity>
        <Text variant={'titleLarge'} style={styles.pageTitle} numberOfLines={1}>
          {label}
        </Text>
      </View>

      <View style={styles.actionContainer}>
        {search && (
          <TouchableOpacity onPress={openSearch}>
            <MaterialIcons
              name={'search'}
              size={24}
              color={theme.colors.neutral400}
            />
          </TouchableOpacity>
        )}
        {wishlist && (
          <TouchableOpacity onPress={openWishlist}>
            <MaterialCommunityIcons
              name={'heart-outline'}
              size={24}
              color={theme.colors.neutral400}
            />
          </TouchableOpacity>
        )}
        {cart && (
          <TouchableOpacity onPress={openCart}>
            <MaterialCommunityIcons
              name={'cart-outline'}
              size={24}
              color={theme.colors.neutral400}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    header: {
      height: 48,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.white,
      gap: 20,
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      flex: 1,
    },
    pageTitle: {
      color: colors.neutral400,
      flex: 1,
    },
    actionContainer: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  });

export default HeaderWithActions;
