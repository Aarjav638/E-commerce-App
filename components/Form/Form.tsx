import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAtom} from 'jotai';
import {
  FormAtom,
  //   addAddress,
  //   fetchaddress,
  FormState,
  AddressAtom,
} from '../../atoms/FormAtom';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, TextInput} from 'react-native-paper';
import {formSchema} from '../../schema/formSchema';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../Navigator';

type TextInputWithErrorProps = {
  label: string;
  value: string | number;
  autoComplete?:
    | 'cc-number'
    | 'off'
    | 'address-line1'
    | 'address-line2'
    | 'cc-exp'
    | 'email'
    | 'name'
    | 'postal-code'
    | 'street-address'
    | 'tel';
  error?: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  rightIcon?: React.ReactNode;
  maxLength?: number;
};

const TextInputWithError: React.FC<TextInputWithErrorProps> = ({
  label,
  value,
  autoComplete,
  error,
  secureTextEntry = false,
  onChangeText,
  rightIcon = null,
  maxLength,
}) => (
  <>
    <TextInput
      mode="outlined"
      autoComplete={autoComplete ? autoComplete : 'off'}
      label={label}
      style={Styles.textInput}
      value={String(value)}
      outlineStyle={Styles.outlineStyle}
      outlineColor="grey"
      activeOutlineColor="darkcyan"
      error={!!error}
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
      right={rightIcon}
      maxLength={maxLength}
    />
    {error && <Text style={Styles.errorText}>{error}</Text>}
  </>
);

type CheckoutProps = NativeStackScreenProps<RootStackParamList, 'Checkout'>;
const Form: React.FC<CheckoutProps> = ({navigation}: CheckoutProps) => {
  const [formAtom, setFormAtom] = useAtom<FormState>(FormAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [addressAtom, setAddressAtom] = useAtom(AddressAtom);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const handleChange = (key: keyof FormState, value: string | number) => {
    setFormAtom(prev => ({
      ...prev,
      [key]: value,
    }));
    validateField(key, value);
  };

  const validateField = (key: keyof FormState, value: string | number) => {
    try {
      const result = (formSchema.shape as any)[key].safeParse(value);
      if (result.success) {
        setErrors(prev => ({
          ...prev,
          [key]: '',
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          [key]: result.error.errors[0]?.message || 'Invalid input',
        }));
      }
    } catch {
      setErrors(prev => ({
        ...prev,
        [key]: 'Validation error',
      }));
    }
  };

  const validateForm = () => {
    try {
      formSchema.parse(formAtom);
      setErrors({});
      return true;
    } catch (err) {
      const formattedErrors = (err as any).formErrors.fieldErrors;
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleSubmit = () => {
    if (validateForm()) {
      setAddressAtom(prev => [...prev, formAtom]);
      navigation.navigate('Payment', {Address: addressAtom});
    } else {
      console.log('Form is invalid');
    }
  };
  const {name, email, street, city, state, zip, phone, card, expiry, cvv} =
    formAtom;
  const {
    name: nameError,
    email: emailError,
    street: streetError,
    city: cityError,
    state: stateError,
    zip: zipError,
    phone: phoneError,
    card: cardError,
    expiry: expiryError,
    cvv: cvvError,
  } = errors;

  return (
    <View style={Styles.mainContainer}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Styles.container}>
        <Text style={Styles.Header}>Checkout Form</Text>

        <TextInputWithError
          label="Name"
          value={name}
          autoComplete="name"
          error={nameError}
          onChangeText={text => handleChange('name', text)}
        />

        <TextInputWithError
          label="Email"
          value={email}
          autoComplete="email"
          error={emailError}
          onChangeText={text => handleChange('email', text)}
        />

        <TextInputWithError
          label="Street"
          autoComplete="address-line1"
          value={street}
          error={streetError}
          onChangeText={text => handleChange('street', text)}
        />

        <TextInputWithError
          label="City"
          value={city}
          autoComplete="address-line2"
          error={cityError}
          onChangeText={text => handleChange('city', text)}
        />

        <TextInputWithError
          label="State"
          value={state}
          error={stateError}
          onChangeText={text => handleChange('state', text)}
        />

        <TextInputWithError
          label="Zip"
          value={zip}
          autoComplete="postal-code"
          error={zipError}
          onChangeText={text => handleChange('zip', text)}
        />

        <TextInputWithError
          label="Phone"
          value={phone}
          autoComplete="tel"
          error={phoneError}
          onChangeText={text => handleChange('phone', text)}
          maxLength={10}
        />

        <TextInputWithError
          label="Card"
          value={card}
          error={cardError}
          autoComplete="cc-number"
          onChangeText={text => handleChange('card', text)}
        />

        <TextInputWithError
          label="Expiry"
          value={expiry}
          error={expiryError}
          autoComplete="cc-exp"
          onChangeText={text => handleChange('expiry', text)}
        />

        <TextInputWithError
          label="CVV"
          value={cvv}
          error={cvvError}
          secureTextEntry={!showPassword}
          maxLength={3}
          rightIcon={
            <TextInput.Icon
              icon="eye"
              color={showPassword ? 'darkcyan' : 'grey'}
              onPress={handleShowPassword}
            />
          }
          onChangeText={text => handleChange('cvv', text)}
        />
      </KeyboardAwareScrollView>

      <Button
        rippleColor="cyan"
        mode="elevated"
        textColor="white"
        icon="arrow-right"
        style={Styles.button}
        contentStyle={Styles.buttonContent}
        onPress={handleSubmit}>
        Continue To Pay
      </Button>
    </View>
  );
};

const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  textInput: {
    marginVertical: 10,
  },
  outlineStyle: {
    borderRadius: 10,
  },
  Header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'darkcyan',
    marginTop: 20,
  },
  buttonContent: {
    height: 50,
    justifyContent: 'center',
    flexDirection: 'row-reverse',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 5,
  },
});

export default Form;
