import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Picker, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import {db} from '../config';
import validator from 'validator';
export default class SignUp extends Component {

    state = {
        isLoading: false,
        name: '',
        email: '',
        password: '',
        errorMessage: '',
        region: '',
        interest: ''
    };

    componentDidMount() {
        this.setState({
            name: '',
            email: '',
            password: '',
            errorMessage: ''
        })
    }

    onChangeName = e => {
        this.setState({
            name: e.nativeEvent.text
        });
    }

    onChangeEmail = e => {
        this.setState({
            email: e.nativeEvent.text
        });
    }

    onChangePassword = e => {
        this.setState({
            password: e.nativeEvent.text
        });
    }

    handleSignUp = () => {
        this.setState({
            isLoading: true
        });

        const { name, email, password } = this.state;
        if ((!validator.isEmpty(name)) && validator.isEmail(email) && (!validator.isEmpty(password))) {
            firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.addProfile();
            })
            .then(() => this.props.navigation.navigate('Main'))
            .catch(error => this.setState({
                isLoading: false, 
                errorMessage: error.message
            }))
        } else {
            this.setState({
                isLoading: false, 
                errorMessage: 'Name or Email or Password is invalid'
            });
        }
        
        console.log('handleSignUp');
    }

    addProfile() {

        var d = new Date();
        var userId = firebase.auth().currentUser.uid;
        const { 
            name,
            region, 
            interest
        } = this.state;

        var userProfile = {
          created: d,
          name,
          region, 
          interest
        };
        console.log(userProfile);
        db.ref('profiles/'+userId).set(userProfile);
      
      }

    render() {
        const { 
            isLoading,
            errorMessage,
            name,
            email,
            password, 
            region, 
            interest
        } = this.state;

        if (isLoading) {
            return (<ActivityIndicator style={{marginTop: 'auto', marginBottom: 'auto'}} size='large' />);
        }
        
        return (
            <ScrollView style={styles.container}>
                <Text style={{alignSelf: 'center', fontSize: 50}}>SignUp</Text>
                {<Text>{errorMessage}</Text> &&
                    <Text style={{ color: 'red' }}>
                        {errorMessage}
                    </Text>}
                <TextInput
                    placeholder="Name"
                    autoCapitalize="none"
                    style = {styles.textInput}
                    onChange = {this.onChangeName}
                    value = {name}
                />
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    style = {styles.textInput}
                    onChange = {this.onChangeEmail}
                    value = {email}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style = {styles.textInput}
                    onChange = {this.onChangePassword}
                    value = {password}
                />

                <Picker
                    selectedValue={region}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({region: itemValue})
                    }
                >
                    <Picker.Item label="Select Region" value="0" />
                    <Picker.Item label="A" value="A" />
                    <Picker.Item label="B" value="B" />
                    <Picker.Item label="C" value="C" />
                    <Picker.Item label="D" value="D" />
                </Picker>

                <Picker
                    selectedValue={interest}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({interest: itemValue})
                    }
                >
                    <Picker.Item label="Select Interest" value="0" />
                    <Picker.Item label="A" value="A" />
                    <Picker.Item label="B" value="B" />
                    <Picker.Item label="C" value="C" />
                    <Picker.Item label="D" value="D" />
                </Picker>
                
                <Button
                    containerStyle={{width: 200, marginBottom: 10, marginTop: 10, alignSelf: 'center'}}
                    raised title="Sign Up" onPress={this.handleSignUp} />
                
                <Button
                    containerStyle={{width: 300, alignSelf: 'center'}}
                    type="outline" 
                    title="Already have an account? Login"
                    onPress={() => this.props.navigation.navigate('Login')}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignContent: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        alignSelf: 'center'
    },
    picker: {
        width: 300,
        alignSelf: 'center',
    }
});