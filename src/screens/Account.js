import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { db } from '../config';

export default class Account extends Component {
    _isMounted = false;
    
    state = {
        currentUser: null,
        email: '',
        name: '',
        interest: '',
        isLoading: false
    };
    componentDidMount() {
        this._isMounted = true;
        this.setState({
            isLoading: true
        });
        firebase.auth().onAuthStateChanged(user => {
            //console.log(user);
            if (user) {
                db.ref('profiles/' + user.uid)
                .once('value', (data) => {
                    this.setState({
                        currentUser: user,
                        email: user.email,
                        name: data.val().name,
                        interest: data.val().interest,
                        isLoading: false
                    });
                })
            } else {
                this.setState({
                    isLoading: false,
                    currentUser: null
                });
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onLogOut = () => {
        this.setState({
            isLoading: true
        });
        firebase
        .auth()
        .signOut()
        .then(() => {
            this.setState({
                isLoading: false,
                currentUser: null
            });
            this.props.navigation.navigate('Main');
        })
        .catch(error => {});
    }

    render() {
        const { currentUser, email, name, interest, isLoading } = this.state;

        if (isLoading) {
            return (<ActivityIndicator style={{marginTop: 'auto', marginBottom: 'auto'}} size='large' />);
        }
        //console.log(currentUser);
        return (
            <View style={styles.container}>
                <Text style={styles.infoText}>Name: {currentUser && name}</Text>
                <Text style={styles.infoText}>Email: {currentUser && email}</Text>
                <Text style={styles.infoText}>Interest: {currentUser && interest}</Text>
                <Button
                    containerStyle={styles.logoutButton}
                    raised
                    title="LogOut"
                    onPress={this.onLogOut}
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
    logoutButton: {
        alignSelf: 'center', 
        width: 150, 
        backgroundColor: '#fff',
        marginTop: 8
    },
    infoText: {
        alignSelf: 'center'
    }
});