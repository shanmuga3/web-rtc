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
			
		</div>
		<div class="row">
			<div class="col-md-6 mt-2">
				<div class="form-group">
					<select name="quaility" class="form-control quaility" id="quaility">
						<option value="qvga"> QVGA </option>
						<option value="vga"> VGA </option>
						<option value="hd"> HD </option>
						<option value="fullHd"> Full HD </option>
						<option value="fourK"> 4K </option>
						<option value="eightK"> 8K </option>
					</select>
				</div>
				<div class="form-group">
					<button class="btn btn-primary" id="startVideo">Open camera</button>
					<button class="btn btn-warning float-right" id="stopVideo" disabled>Close camera</button>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12 mt-2">
				<span class="logger text-danger" id="errorList"></span>
			</div>			
		</div>
	</div>
</div>
</main>
@endsection