import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, TextInput, Alert } from 'react-native';

import { db } from '../config';

let addItem = item => {
    db.ref('/items').push({
        name: item
    });
    this.setState({
        name: ''
    });
};

export default class AddItem extends Component {

    state = {
        name: ''
    };

    handleChange = e => {
        this.setState({
            name: e.nativeEvent.text
        });
    };

    handleSubmit = () => {
        addItem(this.state.name);
        Alert.alert('Item saved successfully');
    };


    render() {
        return (
            <View>
                <Text>Add Item</Text>
                <TextInput onChange={this.handleChange} />
                <TouchableHighlight
                    underlayColor="white"
                    onPress={this.handleSubmit}
                >
                    <Text>Add</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

