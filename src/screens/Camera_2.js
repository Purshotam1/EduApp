import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button, Image } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { HeaderRight } from '../components/Header'
import {db} from '../config';
import { RNCamera } from 'react-native-camera';
import Video from 'react-native-video';

const PendingView = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Waiting</Text>
    </View>
  );

export default class Camera_2 extends Component {
    _isMounted = false;

    state = {
        isLoading: false,
        currentUser: null,
        classNumber: 0,
        errorMessage: '',
        faceDetected: false,
        left: null,
        right: null,
        top: null,
        bottom: null,
        x: null,
        y: null,
        width: null,
        height: null
    };

    static navigationOptions = ({ navigation }) => {
        return {
          headerRight: () => <HeaderRight navigation={navigation} />
        };
      };

    componentDidMount() {
        this._isMounted = true;
        this.setState({
            isLoading: true
        });

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    isLoading: false, 
                    currentUser: user
                });
                this.props.navigation.setParams({currentUser: user});
            } else {
                this.setState({
                    isLoading: false,
                    currentUser: null
                });
                this.props.navigation.setParams({currentUser: null});
            }
            console.log(user);
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    faceDetected = e => {
        if (e.faces.length > 0) {
            console.log(e.faces[0], 'faceDetected');
            this.setState({
                faceDetected: true,
                left: e.faces[0].bounds.origin.x-((e.faces[0].bounds.size.width)),
                right: e.faces[0].bounds.origin.x+((e.faces[0].bounds.size.width)/2),
                top: e.faces[0].bounds.origin.y,
                bottom: e.faces[0].bounds.origin.y-((e.faces[0].bounds.size.height)/2),
                x:  e.faces[0].bounds.origin.x,
                y: e.faces[0].bounds.origin.y,
                width: e.faces[0].bounds.size.width,
                height: e.faces[0].bounds.size.height
            })
        } else {
            this.setState({
                faceDetected: false
            });
        }
        //console.log(e.faces, 'faceDetected');
    }

    faceDetectedError = e => {
        console.log(e, 'faceDetectedError');
    }

    onBuffer = () => {
        console.log('onBuffer');
    }

    videoError = () => {
        console.log('videoError');
    }

    render() {
        const { isLoading, width, height, x, y, left, right, top, bottom, faceDetected } = this.state;

        if (isLoading) {
            return (<ActivityIndicator style={{marginTop: 'auto', marginBottom: 'auto'}} size='large' />);
        }
        
        return (
            <View style={styles.container}>
                
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                    title: 'Permission to use audio recording',
                    message: 'We need your permission to use your audio',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                    }}

                    //type={RNCamera.Constants.Type.front}
                    faceDetectionLandmarks={"all"}
                    
                    autoFocus={RNCamera.Constants.AutoFocus.on}

                    onFacesDetected={this.faceDetected}
                    onFaceDetectionError={this.faceDetectedError}
                    faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
                >
                    {
                        (faceDetected) ? (
                            ({ camera, status, recordAudioPermissionStatus }) => {
                                if (status !== 'READY') return <PendingView />;
                                return (
                                    <View>
                                    {/* <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                                        <Text style={{ fontSize: 14 }}> SNAP </Text>
                                    </TouchableOpacity> */}
                                        <View style={{position:"relative",flex:1,left:left,top:top-30,right:right,bottom:bottom}}>
                                            <Image source={require('./face.gif')} style={{ width: width+20, height: height+20 }} />
                                        </View>
                                        {/* <Image style={{height: 10, width: 10, left:x, right:x, top: y, bottom: y}} /> */}
                                        {/* <View >
                                            <Image source={require('./human.gif')} style={{width: 1.5*(width+50), 
                                                        height: (2)*(height+50), 
                                                        marginLeft: 'auto',
                                                        marginRight: 'auto',
                                                        marginBottom: 160
                                                        }}  />
                                        </View> */}
                                    </View>
                                    // <View style={{position:"relative",flex:1,left:2*left, right:2*right, top: 2*top,bottom: 2*bottom}}>
                                    //     <Video source={require("./respiratory_crop.mp4")}   // Can be a URL or a local file.
                                    //         ref={(ref) => {
                                    //             this.player = ref
                                    //         }}                                      // Store reference
                                    //         onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                    //         onError={this.videoError}
                                    //         repeat={true}
                                    //         resizeMode={"contain"}               // Callback when video cannot be loaded
                                    //         style={{width: 2*(right-left), height: 2*(top-2*bottom)}} />
                                    // </View>
                                );
                                }
                        ) : (null)
                    }
                    
                </RNCamera>
                
            </View>
        );
    }

    takePicture = async function(camera) {
        const options = { quality: 0.5, base64: true };
        const data = await camera.takePictureAsync(options);
        //  eslint-disable-next-line
        console.log(data.uri);
      };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    picker: {
        height: 50,
        width: 200,
        alignSelf: 'center',
        marginBottom: 300,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    backgroundVideo: {
        width: 200,
        height: 200
    },
});