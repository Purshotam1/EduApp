import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase';
import { HeaderRight } from '../components/Header'
import { db } from '../config';

export default class Subject extends Component {
    _isMounted = false;
    
    state = {
        isLoading: false,
        currentUser: null,
        subjects: null
    };

    static navigationOptions = ({ navigation }) => {
        //console.log(navigation);
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

                const classNumber = this.props.navigation.getParam('classNumber', null);
                this.props.navigation.setParams({currentUser: user});
                db.ref('class/'+classNumber).once('value', (data) => {
                    this.setState({
                        isLoading: false,
                        currentUser: user,
                        subjects: Object.keys(data.val())
                    })
                })
                console.log(this.state.subjects);
            } else {
                this.setState({
                    isLoading: false
                });
                this.props.navigation.navigate('Login');
            }
            //console.log(user);
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getChapters = (k) => {
        const params = {
            classNumber: this.props.navigation.getParam('classNumber', null),
            subject: k,
        }
        //console.log(chapters);
        this.props.navigation.navigate('Chapters', params);
    } 

    render() {
        const { isLoading } = this.state;
        const subjects = (this.state.subjects) ? (this.state.subjects) : ([]);

        if (isLoading) {
            return (<ActivityIndicator style={{marginTop: 'auto', marginBottom: 'auto'}} size='large' />);
        }
        
        return (
            <View style={styles.container}>
                <Text style={{alignSelf: 'center', marginBottom: 10, fontSize: 30}}>Subjects</Text>
                {
                    subjects.map((k, i) => {
                        return (
                            <Button
                                key={i}
                                title={k}
                                type="outline" 
                                raised
                                containerStyle={styles.buttonContainer}
                                onPress={() => this.getChapters(k)}
                            />
                        );
                    })
                }
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
    buttonContainer: {
        alignSelf: 'center', 
        width: 300, 
        backgroundColor: '#fff',
        marginTop: 8
    }
});