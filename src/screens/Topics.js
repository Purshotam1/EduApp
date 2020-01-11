import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase';
import { HeaderRight } from '../components/Header'
import { db } from '../config'

export default class Topics extends Component {
    _isMounted = false;
    
    state = {
        isLoading: false,
        currentUser: null,
        topics: null
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
                this.props.navigation.setParams({currentUser: user});

                const classNumber = this.props.navigation.getParam('classNumber', null);
                const subject = this.props.navigation.getParam('subject', null);
                const chapter = this.props.navigation.getParam('chapter', null);

                db.ref('class/'+classNumber+"/"+subject+"/"+chapter).once('value', (data) => {
                    this.setState({
                        isLoading: false,
                        currentUser: user,
                        topics: Object.keys(data.val())
                    });
                })
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

    getContent = (k) => {
        const params = {
            classNumber: this.props.navigation.getParam('classNumber', null),
            subject: this.props.navigation.getParam('subject', null),
            chapter: this.props.navigation.getParam('chapter', null),
            topic: k
        }
        //console.log(content);
        this.props.navigation.navigate('Content', params);
    } 

    render() {
        const { isLoading } = this.state;
        const topics = (this.state.topics) ? (this.state.topics) : ([]);

        if (isLoading) {
            return (<ActivityIndicator style={{marginTop: 'auto', marginBottom: 'auto'}} size='large' />);
        }

        return (
            <View style={styles.container}>
                <Text style={{alignSelf: 'center', marginBottom: 10, fontSize: 30}}>Topics</Text>
                {
                    topics.map((k, i) => {
                        return (
                            <Button
                                key={i}
                                title={k}
                                type="outline" 
                                raised
                                containerStyle={styles.buttonContainer}
                                onPress={() => this.getContent(k)}
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