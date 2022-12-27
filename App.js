/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';

import RNSimplePeer from "react-native-simple-peer";
import { mediaDevices, MediaStream, RTCView, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, } from "react-native-webrtc"


import {
  SafeAreaView,
  View,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';

const peer = new RNSimplePeer({ 
  debugConsole: true,
  trickle: false,
  initiator: false, 
  webRTC: { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription },
})

peer.on("signal", (data: any) => { 
  console.log(JSON.stringify(data).replace(/\n/g, "/\r/\n"));
});



const App: () => Node = () => {

  const [text, setText] = useState('');
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  peer.on('stream', stream => {
    // console.log("[ON STREAM EVENT]", peerStream.toURL())
    setRemoteStream(stream)
  });

  peer.on("connect", (data: any) => { 
    console.log("[CONNECT]"); 
    peer.send('hello');
  })
  
  const gotMedia = (stream) => {
    console.log('[gotMedia]')
    peer.addStream(stream);
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rtcview}>
        {remoteStream && (
          <RTCView style={styles.rtc} streamURL={remoteStream.toURL()} />
        )}
      </View>
      <View style={styles.control}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          onChangeText={newText => setText(newText)}
          defaultValue={text}
        />
        <Button onPress={() => { peer.signal(text); setText(""); }} title="send signal" />
        <Button onPress={() => {
          const facing = true ? 'front' : 'back';
          // const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
          const facingMode = true ? 'user' : 'environment';
          const constraints = {
            audio: true,
            video: {
              mandatory: {
                minWidth: 500, // Provide your own width, height and frame rate here
                minHeight: 300,
                minFrameRate: 30,
              },
              facingMode,
              optional: [],
              // optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
            },
          };
          mediaDevices.getUserMedia(constraints)
            .then(gotMedia)
            .catch((err) => {console.log(err)})
        }} title="turn on video" />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  rtcview: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
    width: '100%',
    backgroundColor: 'black',
  },
  rtc: {
    width: '100%',
    height: '100%',
  },
  control: {
    width: '100%',
    backgroundColor: "white",
  },
});


export default App;
