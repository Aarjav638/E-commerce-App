import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, TextInput} from 'react-native-paper';
import {formSchema, RegistrationFormState} from '../schema/formSchema';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TextInputWithErrorProps = {
  label: string;
  value: string | number;
  autoComplete?: 'off' | 'email' | 'name' | 'password' | 'tel';
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

type FormProps = {setSaved: React.Dispatch<React.SetStateAction<boolean>>};

const Form: React.FC<FormProps> = ({setSaved}) => {
  const [formAtom, setFormAtom] = useState<RegistrationFormState>({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrationFormState, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    key: keyof RegistrationFormState,
    value: string | number,
  ) => {
    setFormAtom(prev => ({
      ...prev,
      [key]: value,
    }));
    validateField(key, value);
  };

  const validateField = (
    key: keyof RegistrationFormState,
    value: string | number,
  ) => {
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

  const handleSubmit = async () => {
    if (validateForm()) {
      console.log('Form is valid');
      setLoading(true);

      try {
        const storedUsers = await AsyncStorage.getItem('User');
        let users = storedUsers ? JSON.parse(storedUsers) : [];

        const userExists = users.some(
          (user: RegistrationFormState) => user.email === formAtom.email,
        );

        if (userExists) {
          Alert.alert('Error', 'User with this email already exists');
        } else {
          users.push(formAtom);

          await AsyncStorage.setItem('User', JSON.stringify(users));

          setSaved(true);
          Alert.alert('Success', 'Form submitted successfully');
          setFormAtom({
            name: '',
            email: '',
            password: '',
            phone: '',
          });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to save the form');
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form is invalid');
    }
  };

  const {name, email, phone, password} = formAtom;
  const {
    name: nameError,
    email: emailError,
    password: passwordError,
    phone: phoneError,
  } = errors;

  return (
    <View style={Styles.mainContainer}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Styles.container}>
        <Text style={Styles.Header}>Registration Form</Text>

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
          label="Password"
          value={password}
          autoComplete="password"
          error={passwordError}
          secureTextEntry={!showPassword}
          rightIcon={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={handleShowPassword}
            />
          }
          onChangeText={text => handleChange('password', text)}
        />

        <TextInputWithError
          label="Phone"
          value={phone}
          autoComplete="tel"
          error={phoneError}
          onChangeText={text => handleChange('phone', text)}
          maxLength={10}
        />
      </KeyboardAwareScrollView>

      {/* Show ActivityIndicator while loading */}
      {loading && <ActivityIndicator size="large" color="darkcyan" />}

      <Button
        rippleColor="cyan"
        mode="elevated"
        textColor="white"
        icon="arrow-right"
        style={Styles.button}
        contentStyle={Styles.buttonContent}
        onPress={handleSubmit}
        disabled={loading} // Disable button while loading
      >
        {loading ? 'Saving...' : 'Save Details'}
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
