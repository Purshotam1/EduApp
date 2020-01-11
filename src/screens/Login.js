import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import validator from 'validator';
export default class Login extends Component {

    state = {
        isLoading: false,
        email: '',
        password: '',
        errorMessage: ''
    };

    componentDidMount() {
        this.setState({
            email: '',
            password: '',
            errorMessage: ''
        })
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

    handleLogin = () => {
        this.setState({
            isLoading: true
        });

        const { email, password } = this.state;
        if (validator.isEmail(email) && (!validator.isEmpty(password))) {
            firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('Main'))
            .catch(error => this.setState({
                isLoading: false, 
                errorMessage: error.message 
            }));
        } else {
            this.setState({
                isLoading: false,
                errorMessage: 'Email or Password is invalid'
            });
        }
        
        console.log('handleSignUp');
    }

    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return (<ActivityIndicator style={{marginTop: 'auto', marginBottom: 'auto'}} size='large' />);
        }

        return (
            <View style={styles.container}>
                <Text style={{alignSelf: 'center', fontSize: 50}}>Login</Text>
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage && this.state.errorMessage}
                </Text>
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    style = {styles.textInput}
                    onChange = {this.onChangeEmail}
                    value = {this.state.email}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style = {styles.textInput}
                    onChange = {this.onChangePassword}
                    value = {this.state.password}
                />
                
                <Button 
                    containerStyle={{width: 200, marginBottom: 10, marginTop: 10, alignSelf: 'center'}} 
                    raised title="Login" onPress={this.handleLogin} />
                
                <Button 
                    containerStyle={{width: 300, alignSelf: 'center'}}
                    type="outline" 
                    title="Don't have an account? SignUp"
                    onPress={() => this.props.navigation.navigate('SignUp')}
                />
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
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        alignSelf: 'center'
    }
});