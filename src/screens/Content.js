import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase';
import { HeaderRight } from '../components/Header'
import jsrecommender from 'js-recommender';
import { db } from '../config'
import YouTube from 'react-native-youtube';

export default class Content extends Component {
    _isMounted = false;
    
    constructor() {
        super();

    }

    state = {
        isLoading: false,
        currentUser: null,
        content: null,
        subjects: null,
        isReady: false,
        status: '',
        error: '',
        quality: ''
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
                const topic = this.props.navigation.getParam('topic', null);

                db.ref('class/'+classNumber+"/"+subject+"/"+chapter+"/"+topic).once('value', (data) => {
                    this.setState({
                        isLoading: false,
                        currentUser: user,
                        content: data.val()
                    });
                })

                db.ref('class/'+classNumber).once('value', (data) => {
                    this.setState({
                        isLoading: false,
                        currentUser: user,
                        subjects: data.val()
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

    getExamples = () => {

        this.setState({
            isLoading: true
        })

        const { content, currentUser } = this.state;
        const examples = content['Examples'];

        var recommender = new jsrecommender.Recommender();
        var table = new jsrecommender.Table();

        const classNumber = this.props.navigation.getParam('classNumber', null);
        const subjects = this.state.subjects;
        console.log(subjects);
        const subjects_keys = Object.keys(subjects);

        subjects_keys.map((sk, si) => {
            const chapters_keys = Object.keys(subjects[sk]);
            const chapters = subjects[sk];
            chapters_keys.map((ck, ci) => {
                const topics_keys = Object.keys(chapters[ck]);
                const topics = chapters[ck];

                topics_keys.map((tk, ti) => {
                    const examples = topics[tk]['Examples'];
                    const examples_keys = Object.keys(examples);

                    examples_keys.map((ek, ei) => {
                        const ratings = examples[ek]['Rating'];
                        const ratings_keys = (ratings) ? (Object.keys(ratings)): ([]);
                        console.log(ratings);
                        ratings_keys.map((rk, ri) => {

                            table.setCell(classNumber+"_"+sk+"_"+ck+"_"+tk+"_"+ek, rk, ratings[rk]);
                        })

                    })
                })
            })
        })

        console.log(table);

        var model =  recommender.fit(table);
        console.log(model);

        var predicted_table =  recommender.transform(table);
        console.log(predicted_table);

        let sorted_example = {};

        const examples_keys = Object.keys(examples);
        const subject = this.props.navigation.getParam('subject', null);
        const chapter = this.props.navigation.getParam('chapter', null);
        const topic = this.props.navigation.getParam('topic', null);

        examples_keys.map((k, i) => {
            sorted_example[k] =predicted_table.getCell(classNumber+"_"
            +subject+"_"+chapter+"_"+topic+"_"+k, currentUser.uid);
            console.log(currentUser.uid);
        })

        console.log(sorted_example);
        this.setState({
            isLoading: false
        })
        this.props.navigation.navigate('Examples', {ref: "class/"+classNumber+"/"+subject+"/"+chapter+"/"+topic,examples, sorted_example});
    }

    render() {
        const { content, isLoading } = this.state;

        if (isLoading) {
            return (<ActivityIndicator style={{marginTop: 'auto', marginBottom: 'auto'}} size='large' />);
        }

        return (
            (content) ? (
                <View style={styles.container}>
                    {
                        (content['Video_id']) ? (
                            <YouTube
                        apiKey="AIzaSyCnbx0r9s4O4x3f4q3-SdoqvrpzXJuTA8k"
                        videoId={content['Video_id']} // The YouTube video ID
                        play={false} // control playback of video with true/false
                        onReady={e => this.setState({ isReady: true })}
                        onChangeState={e => this.setState({ status: e.state })}
                        onChangeQuality={e => this.setState({ quality: e.quality })}
                        onError={e => this.setState({ error: e.error })}
                        style={{ alignSelf: 'stretch', height: 300 }}
                        />
                        ) : (null)
                    }
                <Text>{content['Description']}</Text>
                <Button 
                    title="Examples" 
                    onPress={this.getExamples} 
                    raised
                    containerStyle={styles.buttonContainer}/>

                {
                    (this.props.navigation.getParam('topic', null) == 'Skull Anatomy') ? (
                        <Button
                    containerStyle={{width: 100, alignSelf: 'center', marginTop: 10}}
                    title="AR"
                    onPress={() => this.props.navigation.navigate('Camera_2')}
                />
                    ) : (
                        <Button
                    containerStyle={{width: 100, alignSelf: 'center', marginTop: 10}}
                    title="AR"
                    onPress={() => this.props.navigation.navigate('Camera_1')}
                />
                    )
                }
            </View>
            ) : (null)
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