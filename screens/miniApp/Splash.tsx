import {View, StyleSheet} from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import {StatusBar} from 'react-native';
import {Button} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/Navigation/StackNavigator';

type SplashProps = NativeStackScreenProps<RootStackParamList, 'OnBoarding'>;

const Splash = ({navigation}: SplashProps) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        translucent={true}
        backgroundColor={'transparent'}
      />
      <Video
        source={require('../../assets/video/background.mp4')}
        resizeMode="cover"
        style={styles.backgroundVideo}
        muted={true}
        repeat={true}
      />
      <View style={styles.subContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('miniApp')}
          style={styles.button}>
          Continue To InstaMart
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  button: {backgroundColor: 'rgba(0,0,0,0.5)', margin: 20},
  subContainer: {
    height: '10%',
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
});

export default Splash;
