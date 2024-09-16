import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import BrandSkeleton from '../../../../components/skeleton/BrandSkeleton';
import FBProducts from './FBProducts';
import OutletDetails from './OutletDetails';

interface FBBrandDetails {
  provider: any;
  outlet: any;
  apiRequested: boolean;
}

const FBBrandDetails: React.FC<FBBrandDetails> = ({
  provider,
  outlet,
  apiRequested,
}) => {
  const styles = makeStyles();

  if (apiRequested) {
    return <BrandSkeleton />;
  }

  return (
    <View style={styles.container}>
      <OutletDetails
        provider={provider}
        outlet={outlet}
        apiRequested={apiRequested}
      />
      <View style={{flex: 1}}>
        <FBProducts
          provider={provider}
          domain={provider?.domain}
          location={outlet?.id}
          isOpen={outlet?.isOpen || false}
        />
      </View>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });

export default FBBrandDetails;
