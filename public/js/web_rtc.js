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
		video: {width: {exact: 320}, height: {exact: 240}}
	},
	vga : {
		video: {width: {exact: 640}, height: {exact: 480}}
	},
	hd : {
		video: {width: {exact: 1280}, height: {exact: 720}}
	},
	fullHd : {
		video: {width: {exact: 1920}, height: {exact: 1080}}
	},
	fourK : {
		video: {width: {exact: 4096}, height: {exact: 2160}}
	},
	eightK : {
		video: {width: {exact: 7680}, height: {exact: 4320}}
	},
};

// Local stream that will be reproduced on the video.
let localStream;
// Video element where stream will be placed.
const localVideo = document.querySelector('#localVideo');
const errorElement = document.querySelector('#errorList');

function handleSuccess(mediaStream)
{
	localStream = mediaStream;
  	localVideo.srcObject = mediaStream;
  	document.querySelector('#startVideo').disabled=true;
  	document.querySelector('#stopVideo').disabled=false;
}

function handleError(error)
{
	if (error.name === 'ConstraintNotSatisfiedError') {
		let v = constraints.video;
		errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
	}
	else if (error.name === 'PermissionDeniedError') {
		errorMsg('Permissions have not been granted to use your camera and ' +
			'microphone, you need to allow the page access to your devices in ' +
			'order to work.');
	}
	errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error)
{
	errorElement.innerHTML += `<p>${msg}</p>`;
}

function initVideo(quality)
{
	let constraints = qualityConstraints[quality];
	console.log(constraints);
	navigator.mediaDevices.getUserMedia(constraints)
  		.then(handleSuccess).catch(handleError);
}

function stopVideo(event)
{
	document.querySelector('#startVideo').disabled=false;
	event.target.disabled = true;

	localStream.getTracks().forEach(track => {
    	track.stop();
    });
}

document.querySelector('#startVideo').addEventListener('click', (event) => {
	let quality = document.querySelector('#quaility').value;
	initVideo(quality);
});
document.querySelector('#stopVideo').addEventListener('click', (event) => stopVideo(event));