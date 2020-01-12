import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { HeaderRight, LogoTitle } from '../components/Header'
import {db} from '../config';

export default class Main extends Component {
    _isMounted = false;

    state = {
        isLoading: false,
        currentUser: null,
        classNumber: 0,
        errorMessage: '',
        camera: false,
    };

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <LogoTitle />,
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

    getSubjects = () => {
        this.setState({
            isLoading: true
        });

        const { classNumber, currentUser } = this.state;
        if (!currentUser) {
            this.props.navigation.navigate('Login');
            this.setState({
                isLoading: false,
                errorMessage: ''
            })
        } else if (classNumber == 0) {
            this.setState({
                isLoading: false,
                errorMessage: 'Please Select Class'
            })
        } else {
            // this.props.navigation.setParams({ classNumber });
            // this.props.navigation.navigate('Subject');
            // db.ref("class/"+classNumber).once('value', (data) => {
            //     this.props.navigation.navigate('Subject', {subjects: data.val(), classNumber,  currentUser: this.state.currentUser});
            // });
            this.props.navigation.navigate('Subject', {classNumber, currentUser: this.state.currentUser});
            this.setState({
                isLoading: false,
                errorMessage: ''
            })
        }
    }

    render() {
        const { isLoading, errorMessage, classNumber, camera } = this.state;

        if (isLoading) {
            return (<ActivityIndicator style={{marginTop: 'auto', marginBottom: 'auto'}} size='large' />);
        }
        
        return (
            <View style={styles.container}>
                <View style={styles.subject}>
                    <Text style={{ color: 'red' }}>
                        {errorMessage && errorMessage}
                    </Text>
                    <Picker
                        selectedValue={classNumber}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({classNumber: itemValue})
                        }
                    >
                        <Picker.Item label="Select Class" value="0" />
                        <Picker.Item label="Class 1" value="1" />
                        <Picker.Item label="Class 2" value="2" />
                        <Picker.Item label="Class 3" value="3" />
                        <Picker.Item label="Class 4" value="4" />
                        <Picker.Item label="Class 5" value="5" />
                        <Picker.Item label="Class 6" value="6" />
                        <Picker.Item label="Class 7" value="7" />
                        <Picker.Item label="Class 8" value="8" />
                        <Picker.Item label="Class 9" value="9" />
                        <Picker.Item label="Class 10" value="10" />
                    </Picker>
                    
                    <Button
                        raised
                        containerStyle={{width: 200, marginBottom: 'auto', marginTop: 8, alignSelf: 'center'}} 
                        title="Get Subjects" onPress={this.getSubjects} 
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    subject:{
        flex: 4,
        flexDirection: 'column'
    },
    picker: {
        height: 50,
        width: 200,
        alignSelf: 'center',
        marginTop: 'auto',
    }
});