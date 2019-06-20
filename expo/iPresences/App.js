import React from "react";
import { StyleSheet, View, TouchableOpacity, StatusBar, Dimensions, Image, Alert } from "react-native";
import CameraView from './components/Camera';
import SectionHeader from './components/Header';
import Card from './components/Card';

export default class App extends React.Component {

  touch = () => {
    if (this.camera.state.name != "" && this.camera.state.name != "Không nhận diện được") {
      Alert.alert(
        'Xác nhận',
        'Bạn có chắc chắn mình có mặt tại lớp CS406.J21?',
        [
          {
            text: 'Sai tên',
            onPress: () => this.camera.resetCamera(),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => this.camera.resetCamera() },
        ],
        { cancelable: true },
      );
    }
    else {
      Alert.alert(
        'Cảnh báo',
        'Không nhận diện được bạn',
        [
          { text: 'Huỷ bỏ' },
          { text: 'Thử lại', onPress: () => this.camera.resetCamera() },
        ],
        { cancelable: false },
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="blue" barStyle="light-content" hidden={true} />
        <SectionHeader time={true} title="Điểm danh" />

        <CameraView ref={ref => {
          this.camera = ref;
        }} />

        <Card
          title="CS406.J21"
          content={`Thời gian: 13:30

Lớp: Xử lý ảnh và ứng dụng
Mã lớp: CS406.J21
Giảng viên: Đỗ Văn Tiến
            `}
        />

        <TouchableOpacity onPress={this.touch} style={styles.card} >
          <Image style={styles.checkImage} source={require("./assets/images/shield.png")} />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    // paddingBottom: 0,
    // paddingLeft: 5,
    // paddingRight: 5,

  },
  card: {
    padding: 10,
    width: Dimensions.get('window').width * 0.2,
    backgroundColor: '#fff',

    borderRadius: 16,

    shadowOffset: { width: 10, height: 10 },
    shadowColor: '#000',
    shadowRadius: 12,
    shadowOpacity: 0.25,
    position: 'absolute',
    right: 20,
    bottom: 20,
    textAlign: 'center'

  },
  checkImage: {
    width: 50,
    height: 50,
    marginTop: 30,
    marginBottom: 30,
  }
});
