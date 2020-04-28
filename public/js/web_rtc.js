/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/
'use strict';

// Put variables in global scope to make them available to the browser console.
const qualityConstraints = {
	qvga : {
		video: {'max-width': '100%', width: {exact: 320}, height: {exact: 240}}
	},
	vga : {
		video: {'max-width': '100%', width: {exact: 640}, height: {exact: 480}}
	},
	hd : {
		video: {'max-width': '100%', width: {exact: 1280}, height: {exact: 720}}
	},
	fullHd : {
		video: {'max-width': '100%', width: {exact: 1920}, height: {exact: 1080}}
	},
	fourK : {
		video: {'max-width': '100%', width: {exact: 4096}, height: {exact: 2160}}
	},
	eightK : {
		video: {'max-width': '100%', width: {exact: 7680}, height: {exact: 4320}}
	},
};

// Set up to exchange only video.
const offerOptions = {
	offerToReceiveVideo: 1,
};

// Local stream that will be reproduced on the video.
let localStream;
let remoteStream;
let localPeerConnection;
let remotePeerConnection;
let startTime = null;

// Video element where stream will be placed.
const localVideo = document.querySelector('#localVideo');
const remoteVideo = document.querySelector('#remoteVideo');
const errorElement = document.querySelector('#errorList');

// Gets the "other" peer connection.
function getOtherPeer(peerConnection) {
  return (peerConnection === localPeerConnection) ? remotePeerConnection : localPeerConnection;
}

// Gets the name of a certain peer connection.
function getPeerName(peerConnection) {
	return (peerConnection === localPeerConnection) ? 'localPeerConnection' : 'remotePeerConnection';
}

function logMsg(msg, className='')
{
	errorElement.innerHTML += `<p class='${className}'>${msg}</p>`;
}

function handleSuccess(mediaStream)
{
	logMsg('Received local stream.');
	localStream = mediaStream;
  	localVideo.srcObject = mediaStream;
  	document.querySelector('#startButton').disabled=true;
  	document.querySelector('#closeButton').disabled=false;
  	document.querySelector('#callButton').disabled=false;
}

function gotRemoteMediaStream(event) {
	const mediaStream = event.stream;
	remoteVideo.srcObject = mediaStream;
	remoteStream = mediaStream;
	logMsg('Remote peer connection received remote stream.');
}

function handleError(error)
{
	logMsg(`getUserMedia error: ${error.toString()}.`,'text-danger');
}

function initLocalStream(quality)
{
	let constraints = qualityConstraints[quality];
	navigator.mediaDevices.getUserMedia(constraints)
  		.then(handleSuccess).catch(handleError);
}

function initRemoteStream(quaility)
{
	const servers = null;

	localPeerConnection = new RTCPeerConnection(servers);
	logMsg('Created local peer connection object localPeerConnection.');

	localPeerConnection.addEventListener('icecandidate', handleConnection);
	localPeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);

	remotePeerConnection = new RTCPeerConnection(servers);
	logMsg('Created remote peer connection object remotePeerConnection.');

	remotePeerConnection.addEventListener('icecandidate', handleConnection);
	remotePeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);

	remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

	// Add local stream to connection and create offer to connect.
	localPeerConnection.addStream(localStream);
	logMsg('Added local stream to localPeerConnection.');

	logMsg('localPeerConnection createOffer start.');
	localPeerConnection.createOffer(offerOptions).then(createdOffer).catch(setSessionDescriptionError);

	document.querySelector('#callButton').disabled=true;
	document.querySelector('#hangupButton').disabled=false;	
}

// Logs success when setting session description.
function setDescriptionSuccess(peerConnection, functionName)
{
	const peerName = getPeerName(peerConnection);
	logMsg(`${peerName} ${functionName} complete.`);
}

// Logs error when setting session description fails.
function setSessionDescriptionError(error)
{
	logMsg(`Failed to create session description: ${error.toString()}.`);
}

// Logs success when localDescription is set.
function setLocalDescriptionSuccess(peerConnection)
{
	setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

// Logs success when remoteDescription is set.
function setRemoteDescriptionSuccess(peerConnection)
{
	setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

// Logs offer creation and sets peer connection session descriptions.
function createdOffer(description)
{
	logMsg(`Offer from localPeerConnection:\n${description.sdp}`);

	logMsg('localPeerConnection setLocalDescription start.');
	localPeerConnection.setLocalDescription(description)
		.then(() => {
			setLocalDescriptionSuccess(localPeerConnection);
		})
		.catch(setSessionDescriptionError);

	logMsg('remotePeerConnection setRemoteDescription start.');
	remotePeerConnection.setRemoteDescription(description)
		.then(() => {
			setRemoteDescriptionSuccess(remotePeerConnection);
		})
		.catch(setSessionDescriptionError);

	logMsg('remotePeerConnection createAnswer start.');
	remotePeerConnection.createAnswer()
		.then(createdAnswer)
		.catch(setSessionDescriptionError);
}

// Logs answer to offer creation and sets peer connection session descriptions.
function createdAnswer(description)
{
	logMsg(`Answer from remotePeerConnection:\n${description.sdp}.`);

	logMsg('remotePeerConnection setLocalDescription start.');
	remotePeerConnection.setLocalDescription(description)
	.then(() => {
		setLocalDescriptionSuccess(remotePeerConnection);
	})
	.catch(setSessionDescriptionError);

	logMsg('localPeerConnection setRemoteDescription start.');
	localPeerConnection.setRemoteDescription(description)
	.then(() => {
		setRemoteDescriptionSuccess(localPeerConnection);
	})
	.catch(setSessionDescriptionError);
}

function handleConnection(event)
{
	const peerConnection = event.target;
	const iceCandidate = event.candidate;

	if (iceCandidate) {
		const newIceCandidate = new RTCIceCandidate(iceCandidate);
		const otherPeer = getOtherPeer(peerConnection);

		otherPeer.addIceCandidate(newIceCandidate)
		.then(() => {
			logMsg(`${getPeerName(peerConnection)} addIceCandidate success.`);
		}).catch((error) => {
			logMsg(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+ `${error.toString()}.`);
		});

		logMsg(`${getPeerName(peerConnection)} ICE candidate:\n` + `${event.candidate.candidate}.`);
	}
}

function handleConnectionChange(event)
{
	const peerConnection = event.target;
	logMsg(`${getPeerName(peerConnection)} ICE state: ` + `${peerConnection.iceConnectionState}.`);
}

function hangupLocalStream()
{
	localStream.getTracks().forEach(track => {
		track.stop();
	});
	document.querySelector('#startButton').disabled=false;
	document.querySelector('#closeButton').disabled=true;
}

function hangupRemoteStream()
{
	localPeerConnection.close();
	remotePeerConnection.close();
	localPeerConnection = null;
	remotePeerConnection = null;
	
	logMsg('Ending call.');
	document.querySelector('#startButton').disabled=false;
	document.querySelector('#callButton').disabled=true;
	document.querySelector('#hangupButton').disabled=true;
}

document.querySelector('#startButton').addEventListener('click', (event) => {
	let quality = document.querySelector('#quaility').value;
	initLocalStream(quality);
});

document.querySelector('#callButton').addEventListener('click', (event) => {
  	startTime = window.performance.now();
	logMsg('Starting call on '+startTime);

	let quality = document.querySelector('#quaility').value;
	initRemoteStream(quality);
});

document.querySelector('#closeButton').addEventListener('click', (event) => {
	hangupLocalStream();
});

document.querySelector('#hangupButton').addEventListener('click', (event) => {
	hangupRemoteStream();
});