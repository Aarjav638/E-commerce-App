import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, TextInput} from 'react-native-paper';
import {LoginFormState, LoginFormSchema} from '../schema/formSchema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabParamList} from '../../../components/Navigation/BottomTabNavigator';
import {RootStackParamList} from '../../../components/Navigation/StackNavigator';

type TextInputWithErrorProps = {
  label: string;
  value: string | number;
  autoComplete?: 'off' | 'email' | 'password';
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
type MiniHomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'MiniHome'>,
  NativeStackNavigationProp<RootStackParamList>
>;
const LoginForm: React.FC = () => {
  const navigation = useNavigation<MiniHomeNavigationProp>();
  const [formAtom, setFormAtom] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormState, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof LoginFormState, value: string | number) => {
    setFormAtom(prev => ({
      ...prev,
      [key]: value,
    }));
    validateField(key, value);
  };

  const validateField = (key: keyof LoginFormState, value: string | number) => {
    try {
      const result = (LoginFormSchema.shape as any)[key].safeParse(value);
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
      LoginFormSchema.parse(formAtom);
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
        if (storedUsers) {
          const users: {email: string; password: string}[] =
            JSON.parse(storedUsers);

          const foundUser = users.find(user => user.email === formAtom.email);

          if (foundUser) {
            const passwordValidation = LoginFormSchema.shape.password.safeParse(
              formAtom.password,
            );

            if (
              passwordValidation.success &&
              foundUser.password === formAtom.password
            ) {
              Alert.alert('Success', 'Login successful', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Mart'),
                },
              ]);
            } else {
              Alert.alert('Error', 'Invalid email or password');
            }
          } else {
            Alert.alert('Error', 'Invalid email or password');
          }
        } else {
          Alert.alert('Error', 'No registered users found');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to login user');
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form is invalid');
    }
  };

  const {email, password} = formAtom;
  const {email: emailError, password: passwordError} = errors;

  return (
    <View style={Styles.mainContainer}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Styles.container}>
        <Text style={Styles.Header}>Login Form</Text>

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
      </KeyboardAwareScrollView>

      {loading && <ActivityIndicator size="large" color="darkcyan" />}

      <Button
        rippleColor="cyan"
        mode="elevated"
        textColor="white"
        icon="arrow-right"
        style={Styles.button}
        contentStyle={Styles.buttonContent}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
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

export default LoginForm;
