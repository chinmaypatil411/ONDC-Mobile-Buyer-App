import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text, useTheme} from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import Actions from './Actions';
import DownloadIcon from '../../../../../assets/download.svg';
import ProviderDetails from './ProviderDetails';
import ItemDetails from './ItemDetails';
import PaymentMethod from './PaymentMethod';
import RaiseIssue from './RaiseIssue';
import CancelOrderButton from './CancelOrderButton';
import ReturnOrderButton from './ReturnOrderButton';

const NonCancelledOrder = ({
  orderDetails,
  getOrderDetails,
}: {
  orderDetails: any;
  getOrderDetails: () => void;
}) => {
  const navigation = useNavigation<any>();
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.orderDetails}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name={'arrow-back'} size={24} color={'#fff'} />
          </TouchableOpacity>
          <Text variant={'titleSmall'} style={styles.orderDetailsTitle}>
            Order Details
          </Text>
          <View style={styles.empty} />
        </View>
        <Text variant={'titleMedium'} style={styles.orderStatus}>
          Order {orderDetails?.state}
        </Text>
      </View>
      <ScrollView style={styles.pageContainer}>
        <Actions onUpdateOrder={getOrderDetails} />
        <View style={styles.creationHeader}>
          <SimpleLineIcons name={'bag'} color={colors.primary} size={24} />
          <Text variant={'bodyMedium'} style={styles.creationDate}>
            Order placed on{' '}
            {moment(orderDetails?.createdAt).format('DD MMM hh:mm a')}
          </Text>
        </View>
        <View style={styles.orderIdContainer}>
          <Text variant={'titleSmall'} style={styles.orderId}>
            {orderDetails?.id}
          </Text>
          {!!orderDetails?.documents && (
            <TouchableOpacity
              onPress={() => Linking.openURL(orderDetails?.documents[0]?.url)}>
              <DownloadIcon width={24} height={24} />
            </TouchableOpacity>
          )}
        </View>
        <ProviderDetails provider={orderDetails?.provider} />
        <ItemDetails
          items={orderDetails?.items}
          fulfillments={orderDetails?.fulfillments}
        />
        <PaymentMethod
          payment={orderDetails?.payment}
          address={orderDetails?.fulfillments[0]?.end?.location?.address}
          contact={orderDetails?.fulfillments[0]?.end?.contact}
        />
        <RaiseIssue />
        <CancelOrderButton />
        <ReturnOrderButton />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    orderDetails: {
      flex: 1,
    },
    header: {
      backgroundColor: colors.primary,
      paddingBottom: 10,
    },
    headerRow: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    orderDetailsTitle: {
      color: '#fff',
    },
    orderStatus: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: 8,
    },
    empty: {
      width: 24,
      height: 24,
    },
    pageContainer: {
      flex: 1,
      backgroundColor: '#FAFAFA',
    },
    creationHeader: {
      flexDirection: 'row',
      marginVertical: 22,
      alignItems: 'center',
      marginHorizontal: 16,
    },
    orderIdContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
    },
    orderId: {
      color: '#686868',
    },
    creationDate: {
      marginLeft: 8,
      color: '#686868',
    },
  });

export default NonCancelledOrder;
