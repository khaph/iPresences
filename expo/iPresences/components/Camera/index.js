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
            countdownTime: 0,
            isReceived: false,
            isFirstTime: true,
            loading: false,
            bounding: {
                width: 100,
                height: 100,
            }
        };
    }

    sendBase64 = (b64, isLandscape) => {
        let data = {
            code: b64,
            isLandscape: isLandscape,
        }
        let url = `http://10.10.69.34:1997/api/recognize`;
        let header = {
            'Content-Type': 'application/json',
        }
        this.setState({ loading: true })
        fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(data)
        }).then(res => { return res.json() })
            .then(res => {
                this.setState({ name: res.name, isReceived: true, loading: false })
            })
    }

    snap = async () => {
        if (this.camera) {
            let photo = await this.camera.takePictureAsync({ base64: true });
            await this.camera.pausePreview();
            // let bounding = this.detectFaces(photo.uri)
            // console.log(bounding.faces)
            let _bou = {
                width: 200,
                height: 200,
            }
            this.setState({ face: photo.uri, bounding: _bou })
            this.sendBase64(photo.base64)
        }
    };

    readyToSnap = async () => {
        let { countdownTime } = this.state;
        if (countdownTime == 0) {
            this.snap();
        } else {
            await this.setState({ countdownTime: countdownTime - 1 })

            setTimeout(this.readyToSnap, 1000)
        }
    }

    setupSnap = async () => {
        if (this.state.isFirstTime) {
            await this.setState({ isFirstTime: false })
            return
        }
        if (!this.state.detected) {
            await this.setState({ countdownTime: 4, detected: true, isFirstTime: false }, this.readyToSnap)
        }
    }

    resetCamera = async () => {
        await this.camera.resumePreview();
        await this.setState({ detected: false, isReceived: false, name: "", countdownTime: 0, isFirstTime: false, loading: false, bounding: { width: 100, height: 100 } })
    }

    detectFaces = async (imageUri) => {
        const options = { mode: FaceDetector.Constants.Mode.fast };
        return await FaceDetector.detectFacesAsync(imageUri, options);
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
        // await this.resetCamera();
    }

    render() {
        let { countdownTime, name, bounding, loading } = this.state;
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
                            onFacesDetected={this.setupSnap}
                            faceDetectorSettings={{
                                mode: FaceDetector.Constants.Mode.fast,
                                detectLandmarks: FaceDetector.Constants.Landmarks.none,
                                runClassifications: FaceDetector.Constants.Classifications.none,
                            }}
                            onFaceDetectionError={() => { alert(1) }}
                        >
                            <TouchableOpacity onPress={this.resetCamera} >
                                <Image style={{ width: bounding.width, height: bounding.height }} source={require("../../assets/images/focus.png")} />
                            </TouchableOpacity>
                            {countdownTime != 0 ? <Text style={styles.countdownTime}>{countdownTime}</Text> : null}
                        </Camera>
                        {name != "" ?
                            <Text style={styles.name}>
                                {name}
                            </Text> : null
                        }
                        {loading ?
                            <View style={styles.loadingStyle}>
                                <Image style={styles.loadingImage} source={require("../../assets/images/loading.gif")} />
                            </View> : null
                        }
                    </View>
                </View >
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
        fontSize: 25,
        color: 'black',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    loadingImage: {
        width: 30,
        height: 30,
        marginTop: 10,
        marginBottom: 10,
    },
    loadingStyle: {
        alignItems: 'center',
    }
});
