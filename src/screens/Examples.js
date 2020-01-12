import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase';
import { HeaderRight } from '../components/Header'
import { Rating, AirbnbRating } from 'react-native-elements';
import { db } from '../config';

export default class Examples extends Component {
    _isMounted = false;
    
    state = {
        isLoading: false,
        currentUser: null,
        examples: null,
        examples_key: null,
        rating: 0
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

                const examples_key = this.props.navigation.getParam('sorted_example', null);

                var items = Object.keys(examples_key).map(function(key) {
                    return [key, examples_key[key]];
                });
                
                // Sort the array based on the second element
                items.sort(function(first, second) {
                    return second[1] - first[1];
                });
                
                // Create a new array with only the first 5 items
                const keys = [];
                for (var i=0; i<items.length ;i++) {
                    keys.push(items[i][0]);
                }
                console.log(keys);
                const ref = this.props.navigation.getParam('ref', null);

                db.ref(ref+"/Examples").once('value', (data) => {
                    this.setState({
                        isLoading: false, 
                        currentUser: user,
                        examples:  data.val(),
                        examples_key: keys
                    });
                })
                this.props.navigation.setParams({currentUser: user});
                console.log(this.props.navigation);
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

    ratingCompleted = (rating) => {
        console.log("Rating is: " + rating)
        this.setState({rating});
    }

    submitFeedback = (k) => {
        
        const ref = this.props.navigation.getParam('ref', null);
        const { currentUser, rating } = this.state;
        db.ref(ref+"/Examples/"+k+"/Rating/"+currentUser.uid).set(rating);
        Alert.alert('Feedback Recorded');
        console.log(ref);
    }

    render() {
        const { examples, examples_key, isLoading, currentUser } = this.state;
        console.log(examples);
        if (isLoading) {
            return (<ActivityIndicator style={{marginTop: 'auto', marginBottom: 'auto'}} size='large' />);
        }

        return (
            <View style={styles.container}>
                {
                    (examples_key) ? (
                        examples_key.map((k, i) => {
                            return (
                                <View style={styles.example} key={i}>
                                    <Text>Example {i+1}</Text>
                                    <Text>{examples[k]['Content']}</Text>
                                    <Rating
                                        fractions={1}
                                        startingValue={
                                            (examples[k]['Rating'] && examples[k]['Rating'][currentUser.uid]) ? 
                                            (examples[k]['Rating'][currentUser.uid]) : (0)
                                        }
                                        showRating
                                        onFinishRating={this.ratingCompleted}
                                        style={{ paddingVertical: 10 }}
                                    />
                                    <Button
                                        title="Submit Feedback" 
                                        containerStyle={styles.buttonContainer}
                                        raised
                                        onPress={() => this.submitFeedback(k)}
                                    />
                                </View>
                            );
                        })
                    ) : (null)
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
        width: 250, 
        backgroundColor: '#fff',
        marginTop: 8
    },
    example: {
        marginBottom: 40
    }
});