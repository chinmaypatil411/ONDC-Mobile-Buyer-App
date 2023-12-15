import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmptyCart = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const styles = makeStyles();
  return (
    <View style={styles.emptyCart}>
      <View style={styles.emptyCartDetails}>
        <Icon name={'information-outline'} color={'#F9C51B'} size={90} />
        <Text variant={'titleSmall'}>Your Cart is Empty. Please add items</Text>
        <Text variant="bodyMedium" style={styles.emptyDescription}>
          Explore our wide selection and find something you like
        </Text>
        <Button
          mode={'outlined'}
          onPress={() => navigation.navigate('Dashboard')}>
          Explore Now
        </Button>
      </View>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    emptyCart: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyCartDetails: {
      alignItems: 'center',
      paddingHorizontal: 25,
    },
    emptyDescription: {
      marginVertical: 8,
    },
  });

export default EmptyCart;