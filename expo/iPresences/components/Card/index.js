import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import moment from 'moment';
// import PropTypes from 'prop-types';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {
            time,
            title,
            content,
        } = this.props;
        return (
            <View style={[styles.host, false && styles.host__border]}>
                <Text style={styles.title}>
                    {title}
                    <Image source={require('../../assets/images/online.png')} style={styles.statusIcon} />
                </Text>
                <Text style={styles.label}>
                    {content}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    host: {
        marginBottom: 10,
        width: Dimensions.get('window').width,
        padding: 10,

    },

    card: {
        padding: 10,
        width: Dimensions.get('window').width * 0.65,
        backgroundColor: '#fff',
        marginBottom: 30,

        borderRadius: 16,

        shadowOffset: { width: 10, height: 10 },
        shadowColor: '#000',
        shadowRadius: 12,
        shadowOpacity: 0.25,
    },

    host__border: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#CDCDCF',
    },

    label: {
        fontWeight: '500',
        fontSize: 13,
        color: '#8F8E94',
        letterSpacing: -0.075,
        marginBottom: 3,
    },

    title: {
        fontWeight: '700',
        fontSize: 34,
        color: 'black',
        letterSpacing: -0.2,
        marginRight: 10,
    },

    icon: {
        position: 'absolute',
        bottom: 15,
        right: 10,
        tintColor: '#0077FD',
    },
    statusIcon: {
        width: 30,
        height: 30,
    }

});