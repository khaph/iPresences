import React from "react";
import { StyleSheet, Text, View, Res, TouchableOpacity, Image, Dimensions, Modal, ScrollView, TouchableHighlight } from "react-native";
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as FaceDetector from 'expo-face-detector';
import Card from '../Card'
import $ from 'jquery';

export default class CameraView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.front,
            detected: false,
            name: "",
            modalVisible: false,
            countdownTime: -1,
            isReceived: false,
            isFirstTime: true
        };
    }

    sendBase64 = (b64, isLandscape) => {
        let data = {
            code: b64,
            isLandscape: isLandscape,
        }
        let url = `http://192.168.0.108:1997/api/recognize`;
        let header = {
            'Content-Type': 'application/json',
        }
        fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(data)
        }).then(res => { return res.json() })
            .then(res => {
                this.setState({ name: res.name, isReceived: true })
            })
    }

    snap = async () => {
        if (this.camera && !this.state.detected) {
            this.setState({ detected: true });
            let photo = await this.camera.takePictureAsync({ base64: true });
            await this.camera.pausePreview();
            this.setState({ face: photo.uri })
            this.sendBase64(photo.base64)
        }
    };

    readyToSnap = () => {
        let { countdownTime } = this.state;
        this.setState({ countdownTime: 3 })
        var c = null;

        if (countdownTime > 0) {
            c = setInterval(this.countdown)
        } else {
            clearInterval(c)
            this.snap()
        }
    }

    countdown = () => {
        this.setState({ countdownTime: this.state.countdownTime - 1 })
    }

    resetCamera = async () => {
        await this.camera.resumePreview();
        this.setState({ detected: false, isReceived: false, name: "", countdownTime: -1, isFirstTime: false })
    }

    ready = () => {
        this.setState({ ready: true });
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
        this.resetCamera();
    }

    render() {
        let { countdownTime, name, isFirstTime } = this.state;
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return (
                <View>
                    <Text>No access to camera</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.card}>
                        <Camera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            style={styles.camera}
                            type={this.state.type}
                            onFacesDetected={isFirstTime ? null : this.readyToSnap}
                            faceDetectorSettings={{
                                mode: FaceDetector.Constants.Mode.fast,
                                detectLandmarks: FaceDetector.Constants.Landmarks.none,
                                runClassifications: FaceDetector.Constants.Classifications.none,
                            }}
                        >
                            <TouchableOpacity onPress={this.resetCamera} >
                                <Image style={styles.focusImage} source={require("../../assets/images/focus.png")} />
                            </TouchableOpacity>
                            {countdownTime != -1 ? <Text style={styles.countdownTime}>{countdownTime}</Text> : null}
                        </Camera>
                        {name != "" ? <Text style={styles.name}>{name}</Text> : null}
                    </View>

                    {/* <Modal
                        style={styles.modal}
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        presentationStyle="overFullScreen"
                    >
                        <View style={styles.modal}>
                            <View>
                                <Text>Hello World!</Text>

                                <TouchableHighlight
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}>
                                    <Text>Hide Modal</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>

                    <TouchableHighlight
                        onPress={() => {
                            this.setModalVisible(true);
                        }}>
                    </TouchableHighlight> */}
                </View>
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "flex-start",
    },
    camera: {
        flex: 1,
        width: Dimensions.get('window').width - 20,
        flexDirection: 'row',
        backgroundColor: "white",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    focusImage: {
        width: 100,
        height: 100,
    },
    modal: {
        backgroundColor: 'white',
        height: 100,
        flex: 0,
        bottom: 0,
        position: 'absolute',
        width: "100%",
        opacity: 0.8,
    },
    card: {
        flex: 1,
        margin: 10,
        padding: 10,
        backgroundColor: '#fff',

        borderRadius: 16,

        shadowOffset: { width: 10, height: 10 },
        shadowColor: '#000',
        shadowRadius: 12,
        shadowOpacity: 0.25,
    },
    countdownTime: {
        fontWeight: '700',
        fontSize: 34,
        color: 'white',
        textAlign: 'center',
        position: 'absolute',
    },
    name: {
        fontWeight: '700',
        fontSize: 30,
        color: 'black',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    }
});
