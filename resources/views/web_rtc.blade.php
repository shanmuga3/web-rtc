@extends('layouts.app')
@section('main')
<main role="main">
	<div class="container mt-4 pt-4" >
		<div class="row">
			<div class="col-md-6">
				<div class="card align-items-center">
					<video class="video-container" id="localVideo" autoplay playsinline>
					</video>
				</div>
			</div>
			<div class="col-md-6">
				<div class="card align-items-center">
					<video class="video-container" id="remoteVideo" autoplay playsinline>
					</video>
				</div>
			</div>
		</div>
		{{--
		<div class="row mt-2">
			<div class="col-md-6">
				<div class="card align-items-center">
					<textarea name="senderMessage" id="dataChannelSend" rows="5" class="w-100 form-control"></textarea>
				</div>
				<button class="btn btn-primary mt-2" id="sendButton"> Send </button>
			</div>
			<div class="col-md-6">
				<div class="card align-items-center">
					<textarea name="receiverMessage" id="dataChannelReceive" rows="5" class="w-100 form-control"></textarea>
				</div>
			</div>
		</div>
		--}}
		<div class="row">
			<div class="col-md-6 mt-2">
				<div class="form-group">
					<select name="quaility" class="form-control custom-select quaility" id="quaility">
						<option value="qvga"> QVGA </option>
						<option value="vga" selected> VGA </option>
						<option value="hd"> HD </option>
						<option value="fullHd"> Full HD </option>
						<option value="fourK"> 4K </option>
						<option value="eightK"> 8K </option>
					</select>
				</div>
				<div class="form-group">
					<button class="btn btn-primary" id="startButton"> Start </button>
					<button class="btn btn-danger" id="closeButton" disabled> Close </button>
					<button class="btn btn-secondary" id="callButton" disabled> Call </button>
					<button class="btn btn-warning" id="hangupButton" disabled> Hang Up </button>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12 mt-2">
				<span class="logger" id="errorList"></span>
			</div>			
		</div>
	</div>
</div>
</main>
@endsection