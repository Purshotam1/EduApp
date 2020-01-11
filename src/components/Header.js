import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';

export const LogoTitle = (props) => {
    const { navigation } = props;
    
    return (
        <Text style={{fontSize: 30}}>EduApp</Text>
    );
}

export const HeaderRight = (props) => {
    const { navigation } = props;
    const currentUser = navigation.getParam('currentUser', null);
    //console.log(navigation);
    if (currentUser) {
        return (
            <Icon
            reverse
            name='account-circle'
            color='#517fa4'
            onPress = {() => navigation.navigate('Account')}
            />
        );
    } else {
        return (
            <Button
                title="Login"
                raised
                onPress = {() => navigation.navigate('Login')}
                containerStyle={styles.headerRight}
            />
        );
    }
}

const styles = StyleSheet.create({
    headerRight: {
        marginRight: 10,
    }
});