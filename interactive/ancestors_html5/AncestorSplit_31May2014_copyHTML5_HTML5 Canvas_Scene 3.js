(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_1", frames: [[0,0,906,938],[0,940,906,938],[908,0,906,938],[908,940,725,795]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_2", frames: [[802,0,1086,370],[802,372,1086,370],[0,744,1086,370],[0,1116,1086,370],[0,1488,1086,370],[0,0,800,600]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_3", frames: [[0,0,1086,367],[0,369,1086,367],[0,738,1086,367],[0,1107,1086,367],[0,1476,1086,365],[1088,0,650,540]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4", frames: [[806,609,183,95],[302,662,204,56],[995,602,259,266],[0,0,1086,290],[1651,602,187,283],[1840,602,157,236],[519,292,236,315],[0,292,300,399],[995,434,70,94],[757,292,236,315],[995,292,83,140],[1088,0,500,600],[0,693,70,90],[662,609,142,190],[1256,602,175,362],[72,693,70,90],[1433,602,216,266],[432,720,70,86],[1996,0,44,84],[519,609,141,213],[1590,0,404,600],[144,693,70,90],[216,693,70,90],[806,706,70,90],[878,706,70,90],[1996,86,43,84],[1996,172,41,47],[302,292,215,368],[288,720,70,90],[360,720,70,90]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_21 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.aleksej_kirilovics = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.Aleksej_on_Andrej = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.AleksejRazumovskij1748 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.AleksejRazumovskij_small1748 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.Andreas_razumovsky = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.baby_small = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.beethoven_cutout = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.BirutaAkerbergs_small1947 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.child1 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.child2_vasilij = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.Europecountries = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.Hansen_small1983 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.Kiril_medium = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.KirilRazumovskij_small1728 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.left_foot = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.marija = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.MichailZemcuznikov1788 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.MichailZemcuznikov_small1788 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.NataljaRozum_small1678 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.NikolajAzbelev_small1857 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.OlgaSott_small1921 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.paperbg2_600x800 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.right_foot = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.tree_branch = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.tree_clear_small = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.VeraAzbeleva_small1883 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.ViktorArcimovic_small1820 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Tween94 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Count Vasily\nAlekseievich\nPerovsky", "bold 17px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 23;
	this.text.lineWidth = 156;
	this.text.parent = this;
	this.text.setTransform(0,-33.5);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-79.7,-35.5,159.5,70);


(lib.Tween93 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Count Vasily\nAlekseievich\nPerovsky", "bold 17px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 23;
	this.text.lineWidth = 156;
	this.text.parent = this;
	this.text.setTransform(0,-33.5);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-79.7,-35.5,159.5,70);


(lib.Tween92 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(-45.7,-24,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.7,-24,91.5,47.5);


(lib.Tween91 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Aleksei\nPerovsky", "bold 17px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 23;
	this.text.parent = this;
	this.text.setTransform(0,-22);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.7,-24,91.4,47.3);


(lib.Tween90 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.child2_vasilij();
	this.instance.setTransform(-87.5,-181);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-87.5,-181,175,362);


(lib.Tween89 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.child2_vasilij();
	this.instance.setTransform(-87.5,-181);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-87.5,-181,175,362);


(lib.Tween88 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.baby_small();
	this.instance.setTransform(205.4,-72.35);

	this.instance_1 = new lib.baby_small();
	this.instance_1.setTransform(150.6,-71);

	this.instance_2 = new lib.baby_small();
	this.instance_2.setTransform(94.05,-69.3);

	this.instance_3 = new lib.baby_small();
	this.instance_3.setTransform(42.55,-67.6);

	this.instance_4 = new lib.baby_small();
	this.instance_4.setTransform(-12.35,-69.3);

	this.instance_5 = new lib.baby_small();
	this.instance_5.setTransform(-63.75,-70.95);

	this.instance_6 = new lib.baby_small();
	this.instance_6.setTransform(-116.85,-70.9);

	this.instance_7 = new lib.baby_small();
	this.instance_7.setTransform(-166.6,-69.35);

	this.instance_8 = new lib.baby_small();
	this.instance_8.setTransform(-223.2,-69.25);

	this.instance_9 = new lib.baby_small();
	this.instance_9.setTransform(-288.35,-70.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-288.3,-72.3,576.7,144.7);


(lib.Tween87 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.baby_small();
	this.instance.setTransform(186.85,-56.85,1,1,-14.9983);

	this.instance_1 = new lib.baby_small();
	this.instance_1.setTransform(135.75,-68.65);

	this.instance_2 = new lib.baby_small();
	this.instance_2.setTransform(79.2,-66.95);

	this.instance_3 = new lib.baby_small();
	this.instance_3.setTransform(27.7,-65.25);

	this.instance_4 = new lib.baby_small();
	this.instance_4.setTransform(-27.2,-66.95);

	this.instance_5 = new lib.baby_small();
	this.instance_5.setTransform(-78.6,-68.6);

	this.instance_6 = new lib.baby_small();
	this.instance_6.setTransform(-131.7,-68.55);

	this.instance_7 = new lib.baby_small();
	this.instance_7.setTransform(-181.45,-67);

	this.instance_8 = new lib.baby_small();
	this.instance_8.setTransform(-238.05,-66.9);

	this.instance_9 = new lib.baby_small();
	this.instance_9.setTransform(-303.2,-68.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-303.2,-78.3,606.5,156.7);


(lib.Tween86 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.baby_small();
	this.instance.setTransform(205.4,-70);

	this.instance_1 = new lib.baby_small();
	this.instance_1.setTransform(150.6,-71.7);

	this.instance_2 = new lib.baby_small();
	this.instance_2.setTransform(94.05,-70);

	this.instance_3 = new lib.baby_small();
	this.instance_3.setTransform(42.55,-68.3);

	this.instance_4 = new lib.baby_small();
	this.instance_4.setTransform(-12.35,-70);

	this.instance_5 = new lib.baby_small();
	this.instance_5.setTransform(-63.75,-71.65);

	this.instance_6 = new lib.baby_small();
	this.instance_6.setTransform(-116.85,-71.6);

	this.instance_7 = new lib.baby_small();
	this.instance_7.setTransform(-166.6,-70.05);

	this.instance_8 = new lib.baby_small();
	this.instance_8.setTransform(-223.2,-69.95);

	this.instance_9 = new lib.baby_small();
	this.instance_9.setTransform(-288.35,-71.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-288.3,-71.7,576.7,143.4);


(lib.Tween85 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_20();
	this.instance.setTransform(-51,-14.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51,-14,102,28);


(lib.Tween83 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.tree_clear_small();
	this.instance.setTransform(-107.5,-184);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-107.5,-184,215,368);


(lib.Tween82 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.tree_clear_small();
	this.instance.setTransform(-107.5,-184);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-107.5,-184,215,368);


(lib.Tween81 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.tree_branch();
	this.instance.setTransform(-31.95,50.85);

	this.instance_1 = new lib.tree_branch();
	this.instance_1.setTransform(165.15,175.35,0.8293,1.0441,0,-74.6679,-29.9986);

	this.instance_2 = new lib.tree_branch();
	this.instance_2.setTransform(209,159.25,1,1,-29.9992);

	this.instance_3 = new lib.tree_branch();
	this.instance_3.setTransform(69.05,154.85,1,1.164,0,30.7843,0);

	this.instance_4 = new lib.tree_branch();
	this.instance_4.setTransform(103.7,161.85,0.5341,0.7659,59.9996);

	this.instance_5 = new lib.tree_branch();
	this.instance_5.setTransform(58.65,148.2,1,1,45);

	this.instance_6 = new lib.tree_branch();
	this.instance_6.setTransform(-31.15,148.55,1,1.451,59.9998);

	this.instance_7 = new lib.tree_branch();
	this.instance_7.setTransform(-83.3,149.25,1,1,45);

	this.instance_8 = new lib.tree_branch();
	this.instance_8.setTransform(-215.5,156.05,1,1,-74.9998);

	this.instance_9 = new lib.tree_branch();
	this.instance_9.setTransform(-244.9,127.25,1.1309,1,0,-74.9998,-47.1609);

	this.instance_10 = new lib.tree_branch();
	this.instance_10.setTransform(-267.95,-15.45,1.7805,1,-45);

	this.instance_11 = new lib.tree_branch();
	this.instance_11.setTransform(-205.95,-184.15);

	this.instance_12 = new lib.tree_branch();
	this.instance_12.setTransform(-164.55,-143.6,1,1,-135);

	this.instance_13 = new lib.tree_branch();
	this.instance_13.setTransform(-64.55,-159.15,1,1,-120.0004);

	this.instance_14 = new lib.tree_branch();
	this.instance_14.setTransform(40.05,-165.15,0.4634,1,-90);

	this.instance_15 = new lib.tree_branch();
	this.instance_15.setTransform(93,-21.15,1.5366,1);

	this.instance_16 = new lib.tree_branch();
	this.instance_16.setTransform(85.4,94.5,1,0.7,-135.0009);

	this.instance_17 = new lib.tree_branch();
	this.instance_17.setTransform(20.15,51.9,1.6415,1,14.9983);

	this.instance_18 = new lib.tree_branch();
	this.instance_18.setTransform(81.95,-2.7,1,1,-83.995);

	this.instance_19 = new lib.tree_branch();
	this.instance_19.setTransform(63.4,-178.75,1,1,-45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-267.9,-218.1,535.9,436.29999999999995);


(lib.Tween80 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.tree_branch();
	this.instance.setTransform(-31.95,50.85);

	this.instance_1 = new lib.tree_branch();
	this.instance_1.setTransform(165.15,175.35,0.8293,1.0441,0,-74.6679,-29.9986);

	this.instance_2 = new lib.tree_branch();
	this.instance_2.setTransform(209,159.25,1,1,-29.9992);

	this.instance_3 = new lib.tree_branch();
	this.instance_3.setTransform(69.05,154.85,1,1.164,0,30.7843,0);

	this.instance_4 = new lib.tree_branch();
	this.instance_4.setTransform(103.7,161.85,0.5341,0.7659,59.9996);

	this.instance_5 = new lib.tree_branch();
	this.instance_5.setTransform(58.65,148.2,1,1,45);

	this.instance_6 = new lib.tree_branch();
	this.instance_6.setTransform(-31.15,148.55,1,1.451,59.9998);

	this.instance_7 = new lib.tree_branch();
	this.instance_7.setTransform(-83.3,149.25,1,1,45);

	this.instance_8 = new lib.tree_branch();
	this.instance_8.setTransform(-215.5,156.05,1,1,-74.9998);

	this.instance_9 = new lib.tree_branch();
	this.instance_9.setTransform(-244.9,127.25,1.1309,1,0,-74.9998,-47.1609);

	this.instance_10 = new lib.tree_branch();
	this.instance_10.setTransform(-267.95,-15.45,1.7805,1,-45);

	this.instance_11 = new lib.tree_branch();
	this.instance_11.setTransform(-205.95,-184.15);

	this.instance_12 = new lib.tree_branch();
	this.instance_12.setTransform(-164.55,-143.6,1,1,-135);

	this.instance_13 = new lib.tree_branch();
	this.instance_13.setTransform(-64.55,-159.15,1,1,-120.0004);

	this.instance_14 = new lib.tree_branch();
	this.instance_14.setTransform(40.05,-165.15,0.4634,1,-90);

	this.instance_15 = new lib.tree_branch();
	this.instance_15.setTransform(93,-21.15,1.5366,1);

	this.instance_16 = new lib.tree_branch();
	this.instance_16.setTransform(85.4,94.5,1,0.7,-135.0009);

	this.instance_17 = new lib.tree_branch();
	this.instance_17.setTransform(20.15,51.9,1.6415,1,14.9983);

	this.instance_18 = new lib.tree_branch();
	this.instance_18.setTransform(81.95,-2.7,1,1,-83.995);

	this.instance_19 = new lib.tree_branch();
	this.instance_19.setTransform(63.4,-178.75,1,1,-45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-267.9,-218.1,535.9,436.29999999999995);


(lib.Tween79 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_19();
	this.instance.setTransform(-226.4,-234.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-226.4,-234.5,453,469);


(lib.Tween78 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_18();
	this.instance.setTransform(-226.4,-234.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-226.4,-234.5,453,469);


(lib.Tween77 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("....", "italic bold 47px 'Verdana'", "#554732");
	this.text.textAlign = "center";
	this.text.lineHeight = 59;
	this.text.parent = this;
	this.text.setTransform(208.55,147.1);

	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(-246,-207.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-246,-207.6,490.7,413.79999999999995);


(lib.Tween76 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("....", "italic bold 47px 'Verdana'", "#554732");
	this.text.textAlign = "center";
	this.text.lineHeight = 59;
	this.text.parent = this;
	this.text.setTransform(208.55,147.1);

	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(-246,-207.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-246,-207.6,490.7,413.79999999999995);


(lib.Tween75 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Hansen_small1983();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween74 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Hansen_small1983();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween73 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.BirutaAkerbergs_small1947();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween72 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.BirutaAkerbergs_small1947();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween71 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.OlgaSott_small1921();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween70 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.OlgaSott_small1921();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween69 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.VeraAzbeleva_small1883();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween68 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.VeraAzbeleva_small1883();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween67 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.NikolajAzbelev_small1857();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween66 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.NikolajAzbelev_small1857();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween65 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.ViktorArcimovic_small1820();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween64 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.ViktorArcimovic_small1820();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween63 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.MichailZemcuznikov_small1788();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween62 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.MichailZemcuznikov_small1788();
	this.instance.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-45,70,90);


(lib.Tween61 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Aleksej Razumovskij -- 1748", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 299;
	this.text.parent = this;
	this.text.setTransform(-149.5,-11);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-151.5,-13,303,25.9);


(lib.Tween60 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Aleksej Razumovskij -- 1748", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 299;
	this.text.parent = this;
	this.text.setTransform(-149.5,-11);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-151.5,-13,303,25.9);


(lib.Tween59 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.AleksejRazumovskij_small1748();
	this.instance.setTransform(-35,-47);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-47,70,94);


(lib.Tween58 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.AleksejRazumovskij_small1748();
	this.instance.setTransform(-35,-47);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-47,70,94);


(lib.Tween20 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.KirilRazumovskij_small1728();
	this.instance.setTransform(-35,-43);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-43,70,86);


(lib.Tween3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.NataljaRozum_small1678();
	this.instance.setTransform(-35,-41.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-41.5,70,90);


(lib.marijaMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.marija();
	this.instance.setTransform(-70.5,-106.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.marijaMC, new cjs.Rectangle(-70.5,-106.5,141,213), null);


(lib.map_europeMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Europecountries();
	this.instance.setTransform(-325,-270);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.map_europeMC, new cjs.Rectangle(-325,-270,650,540), null);


(lib.child1MC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.child1();
	this.instance.setTransform(-71,-95);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.child1MC, new cjs.Rectangle(-71,-95,142,190), null);


(lib.beethovenMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.beethoven_cutout();
	this.instance.setTransform(-250,-300);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.beethovenMC, new cjs.Rectangle(-250,-300,500,600), null);


(lib.AndrejMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Andreas_razumovsky();
	this.instance.setTransform(-118,-157.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.AndrejMC, new cjs.Rectangle(-118,-157.5,236,315), null);


(lib.aleksej_noFrame = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.aleksej_kirilovics();
	this.instance.setTransform(-78.5,-118);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.aleksej_noFrame, new cjs.Rectangle(-78.5,-118,157,236), null);


(lib.aleksej_blackwhiteMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Aleksej_on_Andrej();
	this.instance.setTransform(-118,-157.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.aleksej_blackwhiteMC, new cjs.Rectangle(-118,-157.5,236,315), null);


(lib.kiril_mediumMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Kiril_medium();
	this.instance.setTransform(-108,-133);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.kiril_mediumMC, new cjs.Rectangle(-108,-133,216,266), null);


(lib.Michail_largeMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.MichailZemcuznikov1788();
	this.instance.setTransform(-202,-300);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Michail_largeMC, new cjs.Rectangle(-202,-300,404,600), null);


(lib.Aleksej_largeMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.AleksejRazumovskij1748();
	this.instance.setTransform(-150,-199.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Aleksej_largeMC, new cjs.Rectangle(-150,-199.5,300,399), null);


(lib.buttonS = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(3,1,1).moveTo(12,-12.1).curveTo(17,-7,17,0).curveTo(17,7.1,12,12).curveTo(7.1,17,0,17).curveTo(-7,17,-12.1,12).curveTo(-17,7.1,-17,0).curveTo(-17,-7,-12.1,-12.1).curveTo(-7,-17,0,-17).curveTo(7.1,-17,12,-12.1).closePath();
	this.shape.setTransform(2,3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.beginFill("#990000").beginStroke().moveTo(-12.1,12).curveTo(-17,7.1,-17,-0).curveTo(-17,-7.1,-12.1,-12.1).curveTo(-7,-17,-0,-17).curveTo(7,-17,12,-12.1).curveTo(17,-7.1,17,-0).curveTo(17,7.1,12,12).curveTo(7,17,-0,17).curveTo(-7,17,-12.1,12).closePath();
	this.shape_1.setTransform(2,3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.beginFill("#FFFF00").beginStroke().moveTo(-12.1,12).curveTo(-17,7.1,-17,-0).curveTo(-17,-7.1,-12.1,-12.1).curveTo(-7,-17,-0,-17).curveTo(7,-17,12,-12.1).curveTo(17,-7.1,17,-0).curveTo(17,7.1,12,12).curveTo(7,17,-0,17).curveTo(-7,17,-12.1,12).closePath();
	this.shape_2.setTransform(2,3);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.beginFill("#000000").beginStroke().moveTo(-12.1,12).curveTo(-17,7.1,-17,-0).curveTo(-17,-7.1,-12.1,-12.1).curveTo(-7,-17,-0,-17).curveTo(7,-17,12,-12.1).curveTo(17,-7.1,17,-0).curveTo(17,7.1,12,12).curveTo(7,17,-0,17).curveTo(-7,17,-12.1,12).closePath();
	this.shape_3.setTransform(2,3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_2},{t:this.shape}]},1).to({state:[{t:this.shape_3},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-16.5,-15.5,37,37);


(lib.button_nar1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(28.5,28.5).lineTo(-28.5,28.5).lineTo(-28.5,-28.5).lineTo(28.5,-28.5).closePath();
	this.shape.setTransform(0.5,2.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.beginFill("#996600").beginStroke().moveTo(-28.5,28.5).lineTo(-28.5,-28.5).lineTo(28.5,-28.5).lineTo(28.5,28.5).closePath();
	this.shape_1.setTransform(0.5,2.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.beginFill().beginStroke("#000000").setStrokeStyle(35,1,1).moveTo(28.5,-28.5).lineTo(28.5,28.5).lineTo(-28.5,28.5).lineTo(-28.5,-28.5).closePath();
	this.shape_2.setTransform(0.5,2.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.beginFill().beginStroke("#000000").setStrokeStyle(7.6,1,1).moveTo(-28.5,-28.5).lineTo(28.5,-28.5).lineTo(28.5,28.5).lineTo(-28.5,28.5).closePath();
	this.shape_3.setTransform(0.5,2.5);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.beginFill("#999900").beginStroke().moveTo(-28.5,28.5).lineTo(-28.5,-28.5).lineTo(28.5,-28.5).lineTo(28.5,28.5).closePath();
	this.shape_4.setTransform(0.5,2.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_1},{t:this.shape_2}]},1).to({state:[{t:this.shape_4},{t:this.shape_3}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-45.4,-43.4,91.9,91.9);


// stage content:
(lib.AncestorSplit_31May2014_copyHTML5_HTML5Canvas_Scene3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {nar3:0,wrong_nar3:839,continue_nar3:844,wrongbranch_nar3:1570};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,99,101,838,839,844,1565,1570,1725];
	this.streamSoundSymbolsList[101] = [{id:"stringQuartetBeethovenNo7Borromeo_short",startFrame:101,endFrame:1553,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}
	this.frame_99 = function() {
		playSound("nar3_pt1");
	}
	this.frame_101 = function() {
		var soundInstance = playSound("stringQuartetBeethovenNo7Borromeo_short",0);
		this.InsertIntoSoundStreamData(soundInstance,101,1553,1);
		soundInstance.volume = 0.5;
	}
	this.frame_838 = function() {
		this.stop();
		
		this.button3.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar3");
		}
		
		
		this.button3_wrong.addEventListener("click", fl_WrongClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_WrongClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("wrongbranch_nar3");
		}
		
		
		/*import flash.events.Event;
		
		button3.addEventListener(MouseEvent.MOUSE_UP, continue_nar3);
		
		function continue_nar3(e:Event):void {
			button3.removeEventListener(MouseEvent.MOUSE_UP, continue_nar3);
			gotoAndPlay("continue_nar3");
		}
		
		button3_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar3);
		
		function wrong_nar3(e:Event):void {
			button3_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar3);
			gotoAndPlay("wrongbranch_nar3");
		}
		*/
	}
	this.frame_839 = function() {
		this.stop();
		
		this.button4.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar4");
		}
		
		/*import flash.events.Event;
		
		button3.addEventListener(MouseEvent.MOUSE_UP, continue_nar3a);
		
		function continue_nar3a(e:Event):void {
			button3.removeEventListener(MouseEvent.MOUSE_UP, continue_nar3);
			gotoAndPlay("continue_nar3");
		}
		
		button3_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar3a);
		
		function wrong_nar3a(e:Event):void {
			button3_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar3);
			gotoAndPlay("wrongbranch_nar3");
		}
		*/
	}
	this.frame_844 = function() {
		playSound("nar3_pt2");
	}
	this.frame_1565 = function() {
		/* gotoAndPlay("tree","Scene 1");*/
		
		window.open("AncestorSplit_31May2014_copyHTML5_HTML5_Canvas.html?18596", "_self");
	}
	this.frame_1570 = function() {
		playSound("nar3_wrongbranch");
	}
	this.frame_1725 = function() {
		this.gotoAndStop("wrong_nar3");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(99).call(this.frame_99).wait(2).call(this.frame_101).wait(737).call(this.frame_838).wait(1).call(this.frame_839).wait(5).call(this.frame_844).wait(721).call(this.frame_1565).wait(5).call(this.frame_1570).wait(155).call(this.frame_1725).wait(1));

	// text_nar3
	this.text = new cjs.Text("Aleksej Razumovskij -- 1748", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 299;
	this.text.parent = this;
	this.text.setTransform(191.1,23.9);

	this.instance = new lib.Tween60("synched",0);
	this.instance.setTransform(340.6,34.9);
	this.instance._off = true;

	this.instance_1 = new lib.Tween61("synched",0);
	this.instance_1.setTransform(172.65,51.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text}]}).to({state:[{t:this.instance}]},45).to({state:[{t:this.instance_1}]},59).to({state:[{t:this.instance_1}]},255).to({state:[]},1).wait(1366));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(45).to({_off:false},0).to({_off:true,x:172.65,y:51.9},59).wait(1622));

	// aleksej_large
	this.instance_2 = new lib.Aleksej_largeMC();
	this.instance_2.setTransform(336.1,246.55,0.1667,0.1666,0,0,0,0,-2.4);
	this.instance_2.alpha = 0;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(14).to({_off:false},0).to({regX:-0.3,regY:-12.7,scaleX:2.1967,scaleY:2.1954,x:335.4,y:327.95,alpha:1},31).to({x:-335,y:176.15,alpha:0},54).to({_off:true},1).wait(1626));

	// _NR1678
	this.instance_3 = new lib.Tween3("synched",0);
	this.instance_3.setTransform(333.6,342.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(90).to({startPosition:0},0).to({alpha:0},9).to({_off:true},1).wait(1626));

	// _KR1728
	this.instance_4 = new lib.Tween20("synched",0);
	this.instance_4.setTransform(509.15,383.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(90).to({startPosition:0},0).to({alpha:0},9).to({_off:true},1).wait(1626));

	// _AR1748
	this.instance_5 = new lib.Tween58("synched",0);
	this.instance_5.setTransform(510.55,237.05);

	this.instance_6 = new lib.Tween59("synched",0);
	this.instance_6.setTransform(332.4,250.9);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).to({_off:true,x:332.4,y:250.9},29).wait(1697));
	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({_off:false},29).wait(62).to({startPosition:0},0).to({alpha:0},8).to({_off:true},1).wait(1626));

	// _MZ1788
	this.instance_7 = new lib.MichailZemcuznikov_small1788();
	this.instance_7.setTransform(350.95,114);

	this.instance_8 = new lib.Tween62("synched",0);
	this.instance_8.setTransform(385.95,159);
	this.instance_8._off = true;

	this.instance_9 = new lib.Tween63("synched",0);
	this.instance_9.setTransform(385.95,159);
	this.instance_9.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_7}]}).to({state:[{t:this.instance_8}]},90).to({state:[{t:this.instance_9}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(90).to({_off:false},0).to({_off:true,alpha:0},9).wait(1627));

	// _VA1820
	this.instance_10 = new lib.ViktorArcimovic_small1820();
	this.instance_10.setTransform(232,113);

	this.instance_11 = new lib.Tween64("synched",0);
	this.instance_11.setTransform(267,158);
	this.instance_11._off = true;

	this.instance_12 = new lib.Tween65("synched",0);
	this.instance_12.setTransform(267,158);
	this.instance_12.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_10}]}).to({state:[{t:this.instance_11}]},90).to({state:[{t:this.instance_12}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(90).to({_off:false},0).to({_off:true,alpha:0},9).wait(1627));

	// _NA1857
	this.instance_13 = new lib.NikolajAzbelev_small1857();
	this.instance_13.setTransform(117,184);

	this.instance_14 = new lib.Tween66("synched",0);
	this.instance_14.setTransform(152,229);
	this.instance_14._off = true;

	this.instance_15 = new lib.Tween67("synched",0);
	this.instance_15.setTransform(152,229);
	this.instance_15.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_13}]}).to({state:[{t:this.instance_14}]},90).to({state:[{t:this.instance_15}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(90).to({_off:false},0).to({_off:true,alpha:0},9).wait(1627));

	// _VA1883
	this.instance_16 = new lib.VeraAzbeleva_small1883();
	this.instance_16.setTransform(109,329);

	this.instance_17 = new lib.Tween68("synched",0);
	this.instance_17.setTransform(144,374);
	this.instance_17._off = true;

	this.instance_18 = new lib.Tween69("synched",0);
	this.instance_18.setTransform(144,374);
	this.instance_18.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_16}]}).to({state:[{t:this.instance_17}]},90).to({state:[{t:this.instance_18}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(90).to({_off:false},0).to({_off:true,alpha:0},9).wait(1627));

	// _OS1921
	this.instance_19 = new lib.OlgaSott_small1921();
	this.instance_19.setTransform(200.1,466.45);

	this.instance_20 = new lib.Tween70("synched",0);
	this.instance_20.setTransform(235.1,511.45);
	this.instance_20._off = true;

	this.instance_21 = new lib.Tween71("synched",0);
	this.instance_21.setTransform(235.1,511.45);
	this.instance_21.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_19}]}).to({state:[{t:this.instance_20}]},90).to({state:[{t:this.instance_21}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(90).to({_off:false},0).to({_off:true,alpha:0},9).wait(1627));

	// _BA1947
	this.instance_22 = new lib.BirutaAkerbergs_small1947();
	this.instance_22.setTransform(349.05,467);

	this.instance_23 = new lib.Tween72("synched",0);
	this.instance_23.setTransform(384.05,512);
	this.instance_23._off = true;

	this.instance_24 = new lib.Tween73("synched",0);
	this.instance_24.setTransform(384.05,512);
	this.instance_24.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_22}]}).to({state:[{t:this.instance_23}]},90).to({state:[{t:this.instance_24}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(90).to({_off:false},0).to({_off:true,alpha:0},9).wait(1627));

	// _0H1983
	this.instance_25 = new lib.Hansen_small1983();
	this.instance_25.setTransform(490.1,462.7);

	this.instance_26 = new lib.Tween74("synched",0);
	this.instance_26.setTransform(525.1,507.7);
	this.instance_26._off = true;

	this.instance_27 = new lib.Tween75("synched",0);
	this.instance_27.setTransform(525.1,507.7);
	this.instance_27.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_25}]}).to({state:[{t:this.instance_26}]},90).to({state:[{t:this.instance_27}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(90).to({_off:false},0).to({_off:true,alpha:0},9).wait(1627));

	// arrows
	this.text_1 = new cjs.Text("....", "italic bold 47px 'Verdana'", "#554732");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 59;
	this.text_1.parent = this;
	this.text_1.setTransform(606.05,474.7);

	this.instance_28 = new lib.CachedBmp_17();
	this.instance_28.setTransform(151.45,120,0.5,0.5);

	this.instance_29 = new lib.Tween76("synched",0);
	this.instance_29.setTransform(397.5,327.6);
	this.instance_29._off = true;

	this.instance_30 = new lib.Tween77("synched",0);
	this.instance_30.setTransform(397.5,327.6);
	this.instance_30.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_28},{t:this.text_1}]}).to({state:[{t:this.instance_29}]},90).to({state:[{t:this.instance_30}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_29).wait(90).to({_off:false},0).to({_off:true,alpha:0},9).wait(1627));

	// vine
	this.instance_31 = new lib.CachedBmp_2();
	this.instance_31.setTransform(88.1,62.4,0.5,0.5);

	this.instance_32 = new lib.Tween78("synched",0);
	this.instance_32.setTransform(314.5,296.9);
	this.instance_32._off = true;

	this.instance_33 = new lib.Tween79("synched",0);
	this.instance_33.setTransform(314.5,296.9);
	this.instance_33.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_31}]}).to({state:[{t:this.instance_32}]},90).to({state:[{t:this.instance_33}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_32).wait(90).to({_off:false},0).to({_off:true,alpha:0},9).wait(1627));

	// branches
	this.instance_34 = new lib.tree_branch();
	this.instance_34.setTransform(345.5,382.5);

	this.instance_35 = new lib.tree_branch();
	this.instance_35.setTransform(542.6,507,0.8293,1.0441,0,-74.6679,-29.9986);

	this.instance_36 = new lib.tree_branch();
	this.instance_36.setTransform(586.45,490.9,1,1,-29.9992);

	this.instance_37 = new lib.tree_branch();
	this.instance_37.setTransform(446.5,486.5,1,1.164,0,30.7843,0);

	this.instance_38 = new lib.tree_branch();
	this.instance_38.setTransform(481.15,493.5,0.5341,0.7659,59.9996);

	this.instance_39 = new lib.tree_branch();
	this.instance_39.setTransform(436.1,479.85,1,1,45);

	this.instance_40 = new lib.tree_branch();
	this.instance_40.setTransform(346.3,480.2,1,1.451,59.9998);

	this.instance_41 = new lib.tree_branch();
	this.instance_41.setTransform(294.15,480.9,1,1,45);

	this.instance_42 = new lib.tree_branch();
	this.instance_42.setTransform(161.95,487.7,1,1,-74.9998);

	this.instance_43 = new lib.tree_branch();
	this.instance_43.setTransform(132.55,458.9,1.1309,1,0,-74.9998,-47.1609);

	this.instance_44 = new lib.tree_branch();
	this.instance_44.setTransform(109.5,316.2,1.7805,1,-45);

	this.instance_45 = new lib.tree_branch();
	this.instance_45.setTransform(171.5,147.5);

	this.instance_46 = new lib.tree_branch();
	this.instance_46.setTransform(212.9,188.05,1,1,-135);

	this.instance_47 = new lib.tree_branch();
	this.instance_47.setTransform(312.9,172.5,1,1,-120.0004);

	this.instance_48 = new lib.tree_branch();
	this.instance_48.setTransform(417.5,166.5,0.4634,1,-90);

	this.instance_49 = new lib.tree_branch();
	this.instance_49.setTransform(470.45,310.5,1.5366,1);

	this.instance_50 = new lib.tree_branch();
	this.instance_50.setTransform(462.85,426.15,1,0.7,-135.0009);

	this.instance_51 = new lib.tree_branch();
	this.instance_51.setTransform(397.6,383.55,1.6415,1,14.9983);

	this.instance_52 = new lib.tree_branch();
	this.instance_52.setTransform(459.4,328.95,1,1,-83.995);

	this.instance_53 = new lib.tree_branch();
	this.instance_53.setTransform(440.85,152.9,1,1,-45);

	this.instance_54 = new lib.Tween80("synched",0);
	this.instance_54.setTransform(377.45,331.65);
	this.instance_54._off = true;

	this.instance_55 = new lib.Tween81("synched",0);
	this.instance_55.setTransform(368.95,331.65);
	this.instance_55.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_53},{t:this.instance_52},{t:this.instance_51},{t:this.instance_50},{t:this.instance_49},{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_41},{t:this.instance_40},{t:this.instance_39},{t:this.instance_38},{t:this.instance_37},{t:this.instance_36},{t:this.instance_35},{t:this.instance_34}]}).to({state:[{t:this.instance_54}]},90).to({state:[{t:this.instance_55}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_54).wait(90).to({_off:false},0).to({_off:true,x:368.95,alpha:0},9).wait(1627));

	// tree
	this.instance_56 = new lib.tree_clear_small();
	this.instance_56.setTransform(214.5,138);

	this.instance_57 = new lib.Tween82("synched",0);
	this.instance_57.setTransform(322,322);
	this.instance_57._off = true;

	this.instance_58 = new lib.Tween83("synched",0);
	this.instance_58.setTransform(322,322);
	this.instance_58.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_56}]}).to({state:[{t:this.instance_57}]},90).to({state:[{t:this.instance_58}]},9).to({state:[]},1).wait(1626));
	this.timeline.addTween(cjs.Tween.get(this.instance_57).wait(90).to({_off:false},0).to({_off:true,alpha:0},9).wait(1627));

	// beethoven
	this.instance_59 = new lib.beethovenMC();
	this.instance_59.setTransform(904.95,457);
	this.instance_59.alpha = 0;
	this.instance_59._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_59).wait(229).to({_off:false},0).to({x:451,y:291,alpha:1},95).to({x:307.65,y:210.15,alpha:0},75).to({_off:true},215).wait(1112));

	// beethoven_overlay
	this.instance_60 = new lib.beethovenMC();
	this.instance_60.setTransform(451,291);
	this.instance_60.alpha = 0;
	this.instance_60.compositeOperation = "overlay";
	this.instance_60._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_60).wait(324).to({_off:false},0).to({x:263,y:205,alpha:1},75).to({x:-256.95,y:85,alpha:0},120).to({_off:true},95).wait(1112));

	// kiril
	this.instance_61 = new lib.kiril_mediumMC();
	this.instance_61.setTransform(516.95,144);
	this.instance_61._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_61).wait(102).to({_off:false},0).to({_off:true},512).wait(1112));

	// text_kiril
	this.text_2 = new cjs.Text("Kiril", "bold 19px 'Verdana'");
	this.text_2.lineHeight = 25;
	this.text_2.parent = this;
	this.text_2.setTransform(488.95,287);
	this.text_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_2).wait(104).to({_off:false},0).to({_off:true},510).wait(1112));

	// andrej
	this.instance_62 = new lib.AndrejMC();
	this.instance_62.setTransform(458.95,368);
	this.instance_62.alpha = 0;
	this.instance_62._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_62).wait(100).to({_off:false},0).to({x:275.85,y:403.75,alpha:0.6211},38).to({x:165,y:405,alpha:1},73).wait(249).to({alpha:0},59).to({_off:true},95).wait(1112));

	// text_2
	this.instance_63 = new lib.Tween93("synched",0);
	this.instance_63.setTransform(904.95,713.05);
	this.instance_63._off = true;

	this.instance_64 = new lib.Tween94("synched",0);
	this.instance_64.setTransform(-127.55,333.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_63}]},1279).to({state:[{t:this.instance_64}]},199).to({state:[]},1).wait(247));
	this.timeline.addTween(cjs.Tween.get(this.instance_63).wait(1279).to({_off:false},0).to({_off:true,x:-127.55,y:333.5},199).wait(248));

	// child2
	this.instance_65 = new lib.Tween89("synched",0);
	this.instance_65.setTransform(901.75,567.55);
	this.instance_65._off = true;

	this.instance_66 = new lib.Tween90("synched",0);
	this.instance_66.setTransform(-102.95,187.85);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_65}]},1279).to({state:[{t:this.instance_66}]},199).to({state:[]},1).to({state:[]},201).wait(46));
	this.timeline.addTween(cjs.Tween.get(this.instance_65).wait(1279).to({_off:false},0).to({_off:true,x:-102.95,y:187.85},199).wait(248));

	// text_1
	this.instance_67 = new lib.Tween91("synched",0);
	this.instance_67.setTransform(-44.05,565.15);
	this.instance_67._off = true;

	this.instance_68 = new lib.Tween92("synched",0);
	this.instance_68.setTransform(909.2,30.85);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_67}]},1279).to({state:[{t:this.instance_68}]},199).to({state:[]},1).wait(247));
	this.timeline.addTween(cjs.Tween.get(this.instance_67).wait(1279).to({_off:false},0).to({_off:true,x:909.2,y:30.85},199).wait(248));

	// child1
	this.instance_69 = new lib.child1MC();
	this.instance_69.setTransform(-71,636.15);
	this.instance_69._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_69).wait(1279).to({_off:false},0).to({x:883.05,y:101.15},199).to({_off:true},1).wait(247));

	// baby
	this.instance_70 = new lib.baby_small();
	this.instance_70.setTransform(16.8,362.1);

	this.instance_71 = new lib.baby_small();
	this.instance_71.setTransform(16.8,362.1);

	this.instance_72 = new lib.baby_small();
	this.instance_72.setTransform(16.8,362.1);

	this.instance_73 = new lib.baby_small();
	this.instance_73.setTransform(16.8,362.1);

	this.instance_74 = new lib.baby_small();
	this.instance_74.setTransform(16.8,362.1);

	this.instance_75 = new lib.baby_small();
	this.instance_75.setTransform(16.8,362.1);

	this.instance_76 = new lib.baby_small();
	this.instance_76.setTransform(16.8,362.1);

	this.instance_77 = new lib.baby_small();
	this.instance_77.setTransform(16.8,362.1);

	this.instance_78 = new lib.baby_small();
	this.instance_78.setTransform(16.8,362.1);

	this.instance_79 = new lib.baby_small();
	this.instance_79.setTransform(16.8,362.1);

	this.instance_80 = new lib.Tween86("synched",0);
	this.instance_80.setTransform(305.15,433.75);
	this.instance_80._off = true;

	this.instance_81 = new lib.Tween87("synched",0);
	this.instance_81.setTransform(320,430.7);
	this.instance_81._off = true;

	this.instance_82 = new lib.Tween88("synched",0);
	this.instance_82.setTransform(305.15,433.05);
	this.instance_82._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_70,p:{x:16.8,y:362.1}}]},940).to({state:[{t:this.instance_71,p:{x:16.8,y:362.1}},{t:this.instance_70,p:{x:81.95,y:363.8}}]},4).to({state:[{t:this.instance_72,p:{x:16.8,y:362.1}},{t:this.instance_71,p:{x:81.95,y:363.8}},{t:this.instance_70,p:{x:138.55,y:363.7}}]},5).to({state:[{t:this.instance_73,p:{x:16.8,y:362.1}},{t:this.instance_72,p:{x:81.95,y:363.8}},{t:this.instance_71,p:{x:138.55,y:363.7}},{t:this.instance_70,p:{x:188.3,y:362.15}}]},5).to({state:[{t:this.instance_74,p:{x:16.8,y:362.1}},{t:this.instance_73,p:{x:81.95,y:363.8}},{t:this.instance_72,p:{x:138.55,y:363.7}},{t:this.instance_71,p:{x:188.3,y:362.15}},{t:this.instance_70,p:{x:241.4,y:362.1}}]},5).to({state:[{t:this.instance_75,p:{x:16.8,y:362.1}},{t:this.instance_74,p:{x:81.95,y:363.8}},{t:this.instance_73,p:{x:138.55,y:363.7}},{t:this.instance_72,p:{x:188.3,y:362.15}},{t:this.instance_71,p:{x:241.4,y:362.1}},{t:this.instance_70,p:{x:292.8,y:363.75}}]},5).to({state:[{t:this.instance_76,p:{x:16.8,y:362.1}},{t:this.instance_75,p:{x:81.95,y:363.8}},{t:this.instance_74,p:{x:138.55,y:363.7}},{t:this.instance_73,p:{x:188.3,y:362.15}},{t:this.instance_72,p:{x:241.4,y:362.1}},{t:this.instance_71,p:{x:292.8,y:363.75}},{t:this.instance_70,p:{x:347.7,y:365.45}}]},5).to({state:[{t:this.instance_77,p:{x:16.8,y:362.1}},{t:this.instance_76,p:{x:81.95,y:363.8}},{t:this.instance_75,p:{x:138.55,y:363.7}},{t:this.instance_74,p:{x:188.3,y:362.15}},{t:this.instance_73,p:{x:241.4,y:362.1}},{t:this.instance_72,p:{x:292.8,y:363.75}},{t:this.instance_71,p:{x:347.7,y:365.45}},{t:this.instance_70,p:{x:399.2,y:363.75}}]},5).to({state:[{t:this.instance_78,p:{x:16.8,y:362.1}},{t:this.instance_77,p:{x:81.95,y:363.8}},{t:this.instance_76,p:{x:138.55,y:363.7}},{t:this.instance_75,p:{x:188.3,y:362.15}},{t:this.instance_74,p:{x:241.4,y:362.1}},{t:this.instance_73,p:{x:292.8,y:363.75}},{t:this.instance_72,p:{x:347.7,y:365.45}},{t:this.instance_71,p:{x:399.2,y:363.75}},{t:this.instance_70,p:{x:455.75,y:362.05}}]},5).to({state:[{t:this.instance_79},{t:this.instance_78,p:{x:81.95,y:363.8}},{t:this.instance_77,p:{x:138.55,y:363.7}},{t:this.instance_76,p:{x:188.3,y:362.15}},{t:this.instance_75,p:{x:241.4,y:362.1}},{t:this.instance_74,p:{x:292.8,y:363.75}},{t:this.instance_73,p:{x:347.7,y:365.45}},{t:this.instance_72,p:{x:399.2,y:363.75}},{t:this.instance_71,p:{x:455.75,y:362.05}},{t:this.instance_70,p:{x:510.55,y:363.75}}]},5).to({state:[{t:this.instance_80}]},30).to({state:[{t:this.instance_81}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[{t:this.instance_82}]},10).to({state:[]},305).to({state:[]},201).wait(46));
	this.timeline.addTween(cjs.Tween.get(this.instance_80).wait(1014).to({_off:false},0).to({_off:true,x:320,y:430.7},10).wait(702));
	this.timeline.addTween(cjs.Tween.get(this.instance_81).wait(1014).to({_off:false},10).to({_off:true,x:305.15,y:433.05},10).wait(692));
	this.timeline.addTween(cjs.Tween.get(this.instance_82).wait(1024).to({_off:false},10).to({scaleY:1.0452,skewX:16.9133},10).to({scaleY:1,skewX:0},10).to({scaleY:1.0826,skewX:-22.5217},10).to({scaleY:1,skewX:0.2369},10).to({scaleX:1.006,skewX:0.2369,skewY:6.531},10).to({scaleX:1,skewY:0.0289},10).to({scaleX:1.0121,skewY:-8.6415},10).to({scaleX:1,skewY:0.0682},10).to({scaleY:1.269,skewX:0.2363,skewY:0.0682},10).to({scaleY:1.0059,skewX:0.2364},10).to({scaleY:0.2044,skewX:0.2353},10).to({scaleY:0.9697,skewX:-179.7647},10).to({scaleY:0.4443,skewX:-179.7639},10).to({scaleY:0.9792,skewX:0.2357},10).to({_off:true},305).wait(247));

	// arrow
	this.instance_83 = new lib.Tween85("synched",0);
	this.instance_83.setTransform(357.45,289.5,0.0293,1);
	this.instance_83._off = true;

	this.shape = new cjs.Shape();
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(7.8,1,1).moveTo(-42.9,0).lineTo(42.9,0);
	this.shape.setTransform(351.5,204.05);

	this.instance_84 = new lib.CachedBmp_3();
	this.instance_84.setTransform(304.75,200.15,0.5,0.5);

	this.instance_85 = new lib.CachedBmp_4();
	this.instance_85.setTransform(64.95,200.15,0.5,0.5);

	this.instance_86 = new lib.CachedBmp_5();
	this.instance_86.setTransform(64.95,200.15,0.5,0.5);

	this.instance_87 = new lib.CachedBmp_6();
	this.instance_87.setTransform(64.95,200.15,0.5,0.5);

	this.instance_88 = new lib.CachedBmp_7();
	this.instance_88.setTransform(64.95,200.15,0.5,0.5);

	this.instance_89 = new lib.CachedBmp_8();
	this.instance_89.setTransform(64.95,200.15,0.5,0.5);

	this.instance_90 = new lib.CachedBmp_9();
	this.instance_90.setTransform(64.95,200.15,0.5,0.5);

	this.instance_91 = new lib.CachedBmp_10();
	this.instance_91.setTransform(64.95,200.15,0.5,0.5);

	this.instance_92 = new lib.CachedBmp_11();
	this.instance_92.setTransform(64.95,200.15,0.5,0.5);

	this.instance_93 = new lib.CachedBmp_12();
	this.instance_93.setTransform(64.95,200.15,0.5,0.5);

	this.instance_94 = new lib.CachedBmp_13();
	this.instance_94.setTransform(64.95,200.15,0.5,0.5);

	this.instance_95 = new lib.CachedBmp_14();
	this.instance_95.setTransform(64.95,200.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_83}]},138).to({state:[{t:this.instance_83}]},73).to({state:[]},403).to({state:[{t:this.shape}]},281).to({state:[{t:this.instance_84}]},20).to({state:[{t:this.instance_85}]},20).to({state:[{t:this.instance_86}]},5).to({state:[{t:this.instance_87}]},4).to({state:[{t:this.instance_88}]},5).to({state:[{t:this.instance_89}]},5).to({state:[{t:this.instance_90}]},5).to({state:[{t:this.instance_91}]},5).to({state:[{t:this.instance_92}]},5).to({state:[{t:this.instance_93}]},5).to({state:[{t:this.instance_94}]},5).to({state:[{t:this.instance_95}]},5).to({state:[]},495).to({state:[]},87).wait(160));
	this.timeline.addTween(cjs.Tween.get(this.instance_83).wait(138).to({_off:false},0).to({scaleX:1},73).to({_off:true},403).wait(1112));

	// text_andrej
	this.text_3 = new cjs.Text("Andrej Razumovskij", "bold 22px 'Verdana'");
	this.text_3.lineHeight = 29;
	this.text_3.parent = this;
	this.text_3.setTransform(339,533);
	this.text_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_3).wait(161).to({_off:false},0).to({_off:true},358).wait(965).to({_off:false,x:135.15,y:13,text:"Michail\nZemchuznikov",font:"bold 27px 'Verdana'",textAlign:NaN,lineHeight:34.8,lineWidth:219},0).to({_off:true},80).wait(162));

	// aleksej2
	this.instance_96 = new lib.aleksej_blackwhiteMC();
	this.instance_96.setTransform(164.6,404.7);
	this.instance_96.alpha = 0;
	this.instance_96._off = true;

	this.instance_97 = new lib.aleksej_noFrame();
	this.instance_97.setTransform(-97.75,180);
	this.instance_97._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_96).wait(460).to({_off:false},0).to({alpha:1},59).wait(15).to({y:226.2},80).wait(5).to({alpha:0},30).to({_off:true},176).wait(901));
	this.timeline.addTween(cjs.Tween.get(this.instance_97).wait(856).to({_off:false},0).to({x:232.05},39).to({_off:true},584).wait(247));

	// aleksej_invert
	this.instance_98 = new lib.aleksej_blackwhiteMC();
	this.instance_98.setTransform(493.55,226.25,1,1.0506,0,0,180,0,-0.4);
	this.instance_98.alpha = 0;
	this.instance_98._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_98).wait(619).to({_off:false},0).to({alpha:1},30).to({_off:true},176).wait(901));

	// text_aleksej
	this.text_4 = new cjs.Text("Aleksej Razumovskij", "bold 22px 'Verdana'");
	this.text_4.lineHeight = 29;
	this.text_4.parent = this;
	this.text_4.setTransform(44.8,28.9);
	this.text_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_4).wait(519).to({_off:false},0).to({_off:true},306).wait(901));

	// right_foot
	this.instance_99 = new lib.right_foot();
	this.instance_99.setTransform(121.5,366.1,1,1,45);

	this.instance_100 = new lib.right_foot();
	this.instance_100.setTransform(121.5,366.1,1,1,45);

	this.instance_101 = new lib.right_foot();
	this.instance_101.setTransform(121.5,366.1,1,1,45);

	this.instance_102 = new lib.right_foot();
	this.instance_102.setTransform(121.5,366.1,1,1,45);

	this.instance_103 = new lib.right_foot();
	this.instance_103.setTransform(121.5,366.1,1,1,45);

	this.instance_104 = new lib.right_foot();
	this.instance_104.setTransform(121.5,366.1,1,1,45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_99,p:{x:121.5,y:366.1,rotation:45}}]},670).to({state:[{t:this.instance_100,p:{x:121.5,y:366.1,rotation:45}},{t:this.instance_99,p:{x:214.45,y:311.1,rotation:45}}]},30).to({state:[{t:this.instance_101,p:{x:121.5,y:366.1,rotation:45}},{t:this.instance_100,p:{x:214.45,y:311.1,rotation:45}},{t:this.instance_99,p:{x:340.1,y:283.1,rotation:105.0002}}]},30).to({state:[{t:this.instance_102,p:{x:121.5,y:366.1,rotation:45}},{t:this.instance_101,p:{x:214.45,y:311.1,rotation:45}},{t:this.instance_100,p:{x:340.1,y:283.1,rotation:105.0002}},{t:this.instance_99,p:{x:351.5,y:381,rotation:180}}]},30).to({state:[{t:this.instance_103,p:{x:121.5,y:366.1}},{t:this.instance_102,p:{x:214.45,y:311.1,rotation:45}},{t:this.instance_101,p:{x:340.1,y:283.1,rotation:105.0002}},{t:this.instance_100,p:{x:351.5,y:381,rotation:180}},{t:this.instance_99,p:{x:260.25,y:409.95,rotation:-97.7663}}]},30).to({state:[{t:this.instance_104},{t:this.instance_103,p:{x:214.45,y:311.1}},{t:this.instance_102,p:{x:340.1,y:283.1,rotation:105.0002}},{t:this.instance_101,p:{x:351.5,y:381,rotation:180}},{t:this.instance_100,p:{x:260.25,y:409.95,rotation:-97.7663}},{t:this.instance_99,p:{x:203.05,y:366.6,rotation:-68.4782}}]},30).to({state:[]},5).to({state:[]},855).wait(46));

	// left_foot
	this.instance_105 = new lib.left_foot();
	this.instance_105.setTransform(35,398);

	this.instance_106 = new lib.left_foot();
	this.instance_106.setTransform(35,398);

	this.instance_107 = new lib.left_foot();
	this.instance_107.setTransform(35,398);

	this.instance_108 = new lib.left_foot();
	this.instance_108.setTransform(35,398);

	this.instance_109 = new lib.left_foot();
	this.instance_109.setTransform(35,398);

	this.instance_110 = new lib.left_foot();
	this.instance_110.setTransform(35,398);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_105,p:{rotation:0,x:35,y:398}}]},655).to({state:[{t:this.instance_106,p:{rotation:0,x:35,y:398}},{t:this.instance_105,p:{rotation:14.9983,x:148.65,y:326.7}}]},30).to({state:[{t:this.instance_107,p:{rotation:0,x:35,y:398}},{t:this.instance_106,p:{rotation:14.9983,x:148.65,y:326.7}},{t:this.instance_105,p:{rotation:59.9996,x:250.35,y:260.95}}]},30).to({state:[{t:this.instance_108,p:{rotation:0,x:35,y:398}},{t:this.instance_107,p:{rotation:14.9983,x:148.65,y:326.7}},{t:this.instance_106,p:{rotation:59.9996,x:250.35,y:260.95}},{t:this.instance_105,p:{rotation:150.0008,x:391.1,y:310.35}}]},29).to({state:[{t:this.instance_109,p:{rotation:0,x:35,y:398}},{t:this.instance_108,p:{rotation:14.9983,x:148.65,y:326.7}},{t:this.instance_107,p:{rotation:59.9996,x:250.35,y:260.95}},{t:this.instance_106,p:{rotation:150.0008,x:391.1,y:310.35}},{t:this.instance_105,p:{rotation:-150.0016,x:354.05,y:452.35}}]},31).to({state:[{t:this.instance_110},{t:this.instance_109,p:{rotation:14.9983,x:148.65,y:326.7}},{t:this.instance_108,p:{rotation:59.9996,x:250.35,y:260.95}},{t:this.instance_107,p:{rotation:150.0008,x:391.1,y:310.35}},{t:this.instance_106,p:{rotation:-150.0016,x:354.05,y:452.35}},{t:this.instance_105,p:{rotation:-71.4509,x:178.2,y:406.5}}]},30).to({state:[]},20).to({state:[]},855).wait(46));

	// map_europe
	this.instance_111 = new lib.map_europeMC();
	this.instance_111.setTransform(332.25,284.35);
	this.instance_111.alpha = 0;
	this.instance_111._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_111).wait(619).to({_off:false},0).to({x:330.6,alpha:1},30).to({_off:true},176).wait(901));

	// wrong
	this.instance_112 = new lib.CachedBmp_15();
	this.instance_112.setTransform(184.1,410.15,0.5,0.5);

	this.text_5 = new cjs.Text("Wrong Answer!", "italic bold 25px 'Verdana'", "#FF0000");
	this.text_5.lineHeight = 32;
	this.text_5.parent = this;
	this.text_5.setTransform(146.4,544.25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_5},{t:this.instance_112}]},839).to({state:[]},5).to({state:[]},836).wait(46));

	// text_question
	this.text_6 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_6.textAlign = "center";
	this.text_6.lineHeight = 56;
	this.text_6.parent = this;
	this.text_6.setTransform(186.1,48);

	this.text_7 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_7.textAlign = "center";
	this.text_7.lineHeight = 56;
	this.text_7.parent = this;
	this.text_7.setTransform(186.1,48);

	this.text_8 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_8.textAlign = "center";
	this.text_8.lineHeight = 56;
	this.text_8.parent = this;
	this.text_8.setTransform(186.1,48);

	this.text_9 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_9.textAlign = "center";
	this.text_9.lineHeight = 56;
	this.text_9.parent = this;
	this.text_9.setTransform(186.1,48);

	this.text_10 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_10.textAlign = "center";
	this.text_10.lineHeight = 56;
	this.text_10.parent = this;
	this.text_10.setTransform(186.1,48);

	this.text_11 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_11.textAlign = "center";
	this.text_11.lineHeight = 56;
	this.text_11.parent = this;
	this.text_11.setTransform(186.1,48);

	this.text_12 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_12.textAlign = "center";
	this.text_12.lineHeight = 56;
	this.text_12.parent = this;
	this.text_12.setTransform(186.05,48);

	this.text_13 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_13.textAlign = "center";
	this.text_13.lineHeight = 56;
	this.text_13.parent = this;
	this.text_13.setTransform(186.1,48);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_6,p:{x:186.1,text:"How",lineWidth:110,y:48}}]},825).to({state:[{t:this.text_7,p:{x:186.1,text:"How",lineWidth:110,y:48}},{t:this.text_6,p:{x:343.7,text:"many",lineWidth:136,y:48}}]},1).to({state:[{t:this.text_8,p:{x:186.1,text:"How",lineWidth:110,y:48,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_7,p:{x:533.1,text:"children",lineWidth:201,y:48}},{t:this.text_6,p:{x:343.7,text:"many",lineWidth:136,y:48}}]},1).to({state:[{t:this.text_9,p:{x:186.1,text:"How",lineWidth:110,y:48,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_8,p:{x:533.1,text:"children",lineWidth:201,y:48,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_7,p:{x:191.1,text:"did",lineWidth:77,y:123}},{t:this.text_6,p:{x:343.7,text:"many",lineWidth:136,y:48}}]},1).to({state:[{t:this.text_10,p:{x:186.1,text:"How",lineWidth:110,y:48}},{t:this.text_9,p:{x:533.1,text:"children",lineWidth:201,y:48,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_8,p:{x:191.1,text:"did",lineWidth:77,y:123,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_7,p:{x:348.1,text:"Aleksej",lineWidth:181,y:123}},{t:this.text_6,p:{x:343.7,text:"many",lineWidth:136,y:48}}]},1).to({state:[{t:this.text_11,p:{x:186.1,text:"How",lineWidth:110,y:48}},{t:this.text_10,p:{x:533.1,text:"children",lineWidth:201,y:48}},{t:this.text_9,p:{x:191.1,text:"did",lineWidth:77,y:123,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_8,p:{x:348.1,text:"Aleksej",lineWidth:181,y:123,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_7,p:{x:343.7,text:"many",lineWidth:136,y:48}},{t:this.text_6,p:{x:541.1,text:"have?",lineWidth:146,y:123}}]},1).to({state:[{t:this.text_12,p:{x:186.05,text:"How",lineWidth:110}},{t:this.text_11,p:{x:533.05,text:"children",lineWidth:201,y:48}},{t:this.text_10,p:{x:191.05,text:"did",lineWidth:77,y:123}},{t:this.text_9,p:{x:348.05,text:"Aleksej",lineWidth:181,y:123,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_8,p:{x:252.3,text:"He didn't \nhave\nany children",lineWidth:243,y:247.7,font:"bold 35px 'Verdana'",color:"#993333",lineHeight:44.55}},{t:this.text_7,p:{x:345.2,text:"many",lineWidth:136,y:48}},{t:this.text_6,p:{x:542.6,text:"have?",lineWidth:146,y:123}}]},1).to({state:[{t:this.text_13},{t:this.text_12,p:{x:533.1,text:"children ",lineWidth:216}},{t:this.text_11,p:{x:191.1,text:"did",lineWidth:77,y:123}},{t:this.text_10,p:{x:348.1,text:"Aleksej",lineWidth:181,y:123}},{t:this.text_9,p:{x:250.7,text:"He didn't \nhave\nany children",lineWidth:243,y:247.75,font:"bold 35px 'Verdana'",color:"#993333",lineHeight:44.55}},{t:this.text_8,p:{x:549.5,text:"He had ten\nchildren ",lineWidth:214,y:247.75,font:"bold 35px 'Verdana'",color:"#993333",lineHeight:44.55}},{t:this.text_7,p:{x:541.1,text:"have?",lineWidth:146,y:123}},{t:this.text_6,p:{x:343.7,text:"many",lineWidth:136,y:48}}]},1).to({state:[]},12).to({state:[]},836).wait(46));

	// button_wrong
	this.button3_wrong = new lib.button_nar1();
	this.button3_wrong.name = "button3_wrong";
	this.button3_wrong.setTransform(248.7,474.5);
	this.button3_wrong._off = true;
	new cjs.ButtonHelper(this.button3_wrong, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button3_wrong).wait(834).to({_off:false},0).to({_off:true},10).wait(882));

	// button
	this.button3 = new lib.button_nar1();
	this.button3.name = "button3";
	this.button3.setTransform(545.5,474.55);
	this.button3._off = true;
	new cjs.ButtonHelper(this.button3, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button3).wait(836).to({_off:false},0).to({_off:true},8).wait(882));

	// marija
	this.instance_113 = new lib.marijaMC();
	this.instance_113.setTransform(876.15,180.05);
	this.instance_113._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_113).wait(856).to({_off:false},0).to({x:463.65},39).to({_off:true},584).wait(247));

	// michail_zem
	this.instance_114 = new lib.Michail_largeMC();
	this.instance_114.setTransform(348.35,341.95,0.2005,0.2004,0,0,0,0.8,-2.8);
	this.instance_114._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_114).wait(1474).to({_off:false},0).to({regX:0.3,regY:-8.7,scaleX:1,scaleY:0.9912,x:400.3,y:291.6},10).to({_off:true},80).wait(162));

	// numbers
	this.text_14 = new cjs.Text("1", "bold 64px 'Verdana'", "#CC0000");
	this.text_14.textAlign = "center";
	this.text_14.lineHeight = 80;
	this.text_14.parent = this;
	this.text_14.setTransform(400,439.4);
	this.text_14._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_14).wait(1670).to({_off:false},0).wait(3).to({text:"2"},0).wait(3).to({text:"3"},0).wait(3).to({text:"4"},0).wait(3).to({text:"5"},0).wait(3).to({text:"6"},0).wait(3).to({text:"7"},0).wait(3).to({text:"8"},0).wait(3).to({text:"9"},0).wait(3).to({text:"10",lineWidth:91},0).wait(29));

	// aleksej
	this.instance_115 = new lib.AleksejRazumovskij1748();
	this.instance_115.setTransform(250,27.95);
	this.instance_115._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_115).wait(1620).to({_off:false},0).wait(106));

	// background
	this.instance_116 = new lib.paperbg2_600x800();

	this.timeline.addTween(cjs.Tween.get(this.instance_116).wait(1726));

	// stageBackground
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.beginFill().beginStroke("rgba(0,0,0,0)").setStrokeStyle(1,1,1,3,true).moveTo(-410,-310).lineTo(410,-310).lineTo(410,310).lineTo(-410,310).closePath();
	this.shape_1.setTransform(400,300);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.beginFill("#FFFF99").beginStroke().moveTo(-410,310).lineTo(-410,-310).lineTo(410,-310).lineTo(410,310).closePath();
	this.shape_2.setTransform(400,300);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).wait(1726));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-263.8,66.1,1418.8,727.8);
// library properties:
lib.properties = {
	id: '8F01B3D0D2EDF7458131381499D00DA4',
	width: 800,
	height: 600,
	fps: 24,
	color: "#FFFF99",
	opacity: 1.00,
	manifest: [
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_1.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_1"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_2.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_2"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_3.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_3"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3_atlas_4"},
		{src:"sounds/nar3_pt1.mp3", id:"nar3_pt1"},
		{src:"sounds/nar3_pt2.mp3", id:"nar3_pt2"},
		{src:"sounds/nar3_wrongbranch.mp3", id:"nar3_wrongbranch"},
		{src:"sounds/stringQuartetBeethovenNo7Borromeo_short.mp3", id:"stringQuartetBeethovenNo7Borromeo_short"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['8F01B3D0D2EDF7458131381499D00DA4'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;