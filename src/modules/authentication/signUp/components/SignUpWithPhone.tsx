import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import InputField from '../../../../components/input/InputField';
import OrContainer from '../../common/OrContainer';
import GoogleLogin from '../../common/GoogleLogin';
import {showToastWithGravity} from '../../../../utils/utils';
import useStoreUserAndNavigate from '../../../../hooks/useStoreUserAndNavigate';
import {useAppTheme} from '../../../../utils/theme';
import {isIOS} from '../../../../utils/constants';
import AppleLogin from '../../common/AppleLogin';

const SignUpWithPhone = () => {
  const navigation = useNavigation<any>();
  const {storeDetails} = useStoreUserAndNavigate();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [googleLoginRequested, setGoogleLoginRequested] =
    useState<boolean>(false);
  const [appleLoginRequested, setAppleLoginRequested] =
    useState<boolean>(false);
  const [codeAvailable, setCodeAvailable] = useState<boolean>(false);
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [mobileError, setMobileError] = useState<string>('');
  const [codeError, setCodeError] = useState<string>('');
  // If null, no SMS has been sent
  const [confirmation, setConfirmation] = useState<any>(null);
  const [code, setCode] = useState('');

  const updateMobileNumber = (value: string) => {
    setMobileNumber(value);
    setMobileError(value.length !== 10 ? 'Enter valid mobile number' : '');
  };

  const updateName = (value: string) => {
    setName(value);
    setNameError(value.trim().length === 0 ? 'Enter valid full name' : '');
  };

  const updateCode = (value: string) => {
    setCode(value);
    setCodeError(value.length !== 6 ? 'Enter valid code' : '');
  };

  const verifyOtp = async () => {
    try {
      setApiInProgress(true);
      await confirmation.confirm(code);
      let user = auth()?.currentUser;
      const idTokenResult = await user?.getIdTokenResult();
      await auth()?.currentUser?.updateProfile({displayName: name});
      user = auth()?.currentUser;
      await storeDetails(idTokenResult, user);
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-verification-code':
          showToastWithGravity('Enter valid OTP');
          break;
        case 'auth/missing-verification-code':
          showToastWithGravity('Please enter OTP');
          break;
        case 'auth/quota-exceeded':
          showToastWithGravity('Limit exceed, please try after some time');
          break;
        case 'auth/session-expired':
          showToastWithGravity(
            'Entered OTP is expired, please request new OTP',
          );
          break;
        case 'auth/invalid-verification-id':
        case 'auth/too-many-requests':
          showToastWithGravity(
            'Something went wrong please try again after some time',
          );
          break;
        case 'auth/user-disabled':
          showToastWithGravity('Account is disabled, please contact admin');
          break;
      }
    } finally {
      setApiInProgress(false);
    }
  };

  const sendOtp = async () => {
    try {
      setApiInProgress(true);
      const confirm = await auth().signInWithPhoneNumber(`+91${mobileNumber}`);
      setConfirmation(confirm);
      setCodeAvailable(true);
    } catch (error: any) {
      if (error?.code === 'auth/invalid-phone-number') {
        showToastWithGravity('Please enter valid phone number');
      } else if (error?.code === 'auth/too-many-requests') {
        showToastWithGravity(
          'We have blocked all requests from this device due to unusual activity. Try again later',
        );
      } else {
        showToastWithGravity(error.message);
      }
    } finally {
      setApiInProgress(false);
    }
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <InputField
          inputMode={'text'}
          disabled={
            googleLoginRequested || appleLoginRequested || apiInProgress
          }
          name="name"
          value={name}
          required
          inputLabel="Full Name"
          placeholder="Enter full name"
          error={!!nameError}
          errorMessage={nameError ? nameError : null}
          onChangeText={updateName}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputField
          left={<TextInput.Affix text="+91" />}
          inputMode={'numeric'}
          disabled={
            codeAvailable ||
            googleLoginRequested ||
            appleLoginRequested ||
            apiInProgress
          }
          name="email"
          value={mobileNumber}
          required
          inputLabel="Phone No."
          placeholder="Enter phone no."
          error={!!mobileError}
          errorMessage={mobileError ? mobileError : null}
          onChangeText={updateMobileNumber}
          right={
            codeAvailable ? (
              <TextInput.Icon
                color={theme.colors.primary}
                icon={'pencil'}
                onPress={() => setCodeAvailable(false)}
              />
            ) : null
          }
        />
      </View>
      {codeAvailable && (
        <View style={styles.inputContainer}>
          <InputField
            disabled={
              googleLoginRequested || appleLoginRequested || apiInProgress
            }
            value={code}
            required
            inputLabel="OTP"
            placeholder="Enter OTP"
            secureTextEntry
            error={!!codeError}
            errorMessage={codeError ? codeError : null}
            onChangeText={updateCode}
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        {codeAvailable ? (
          <View>
            <Button
              labelStyle={[theme.fonts.bodyLarge]}
              style={styles.containedButton}
              contentStyle={styles.button}
              mode="contained"
              onPress={verifyOtp}
              loading={apiInProgress}
              disabled={
                googleLoginRequested || appleLoginRequested || apiInProgress
              }>
              Verify
            </Button>
            <View style={styles.dontReceiveContainer}>
              <Text variant={'bodyMedium'}>Didn’t receive OTP?</Text>
              <Text
                variant={'bodyLarge'}
                disabled={
                  googleLoginRequested || appleLoginRequested || apiInProgress
                }
                style={styles.resend}
                onPress={sendOtp}>
                Resend
              </Text>
            </View>
          </View>
        ) : (
          <Button
            labelStyle={[theme.fonts.bodyLarge]}
            style={styles.containedButton}
            contentStyle={styles.button}
            mode="contained"
            onPress={sendOtp}
            loading={apiInProgress}
            disabled={
              googleLoginRequested ||
              apiInProgress ||
              mobileNumber.length !== 10 ||
              mobileError.length > 0 ||
              nameError.length > 0 ||
              name.length === 0
            }>
            Send OTP
          </Button>
        )}
      </View>

      <OrContainer />
      <GoogleLogin
        loginRequested={
          googleLoginRequested || appleLoginRequested || apiInProgress
        }
        googleLoginRequested={googleLoginRequested}
        setGoogleLoginRequested={setGoogleLoginRequested}
      />
      {isIOS && (
        <AppleLogin
          setAppleLoginRequested={setAppleLoginRequested}
          loginRequested={
            googleLoginRequested || appleLoginRequested || apiInProgress
          }
          appleLoginRequested={appleLoginRequested}
        />
      )}
      <View style={styles.loginMessage}>
        <Text variant={'bodyMedium'} style={styles.dontHaveMessage}>
          Already have an account?
        </Text>
        <TouchableOpacity
          disabled={
            googleLoginRequested || appleLoginRequested || apiInProgress
          }
          onPress={() => navigation.navigate('Login')}>
          <Text variant={'bodyLarge'} style={styles.signUpText}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    inputContainer: {
      marginTop: 20,
    },
    forgotPasswordContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
    buttonContainer: {
      marginTop: 28,
    },
    containedButton: {
      borderRadius: 12,
    },
    button: {
      height: 44,
    },
    loginMessage: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    dontHaveMessage: {
      color: colors.neutral300,
    },
    signUpText: {color: colors.primary, paddingLeft: 8},
    dontReceiveContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    resend: {
      marginLeft: 4,
      color: colors.primary,
    },
  });

export default SignUpWithPhone;
