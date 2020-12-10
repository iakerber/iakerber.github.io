(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_1", frames: [[0,0,906,938],[0,940,906,938],[908,0,906,938],[908,940,725,1000]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2", frames: [[744,1498,284,218],[1030,1518,284,218],[254,1131,180,140],[1394,1839,180,140],[1772,1739,169,176],[1223,1747,169,176],[1576,1839,147,160],[298,1868,147,160],[0,1131,252,151],[1518,1686,252,151],[718,1718,161,230],[881,1738,161,230],[1552,1427,257,257],[1210,602,788,210],[1210,814,717,210],[499,1096,628,210],[0,1308,525,188],[744,1308,416,188],[1162,1328,388,188],[418,1678,298,188],[0,1810,148,188],[727,602,481,492],[0,0,725,795],[499,797,200,227],[1044,1738,177,200],[1709,1026,300,399],[1935,142,70,94],[1811,1427,207,310],[0,1498,207,310],[1935,0,83,140],[1935,238,70,90],[1935,330,70,90],[1210,1026,497,300],[1935,514,70,86],[150,1810,146,187],[1529,0,404,600],[1935,422,70,90],[1929,814,70,90],[1929,906,70,90],[1129,1096,70,90],[727,0,800,600],[0,797,497,332],[2007,142,41,47],[527,1308,215,368],[1129,1188,70,90],[1552,1328,70,90],[209,1498,207,310],[1316,1518,200,227]]}
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



(lib.CachedBmp_49 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.aleksej_michailsson = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.aleksej_michailsson_cutout = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.AleksejRazumovskij1748 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.AleksejRazumovskij_small1748 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.Anna_viktorwife_whole = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.Anna_whole = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.baby_small = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.BirutaAkerbergs_small1947 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.Hansen_small1983 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.horses_alone = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.KirilRazumovskij_small1728 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.lev_michailsson = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.lev_michailsson_whole_smaller = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.MichailZemcuznikov1788 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.MichailZemcuznikov_small1788 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.NataljaRozum_small1678 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.NikolajAzbelev_small1857 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.OlgaSott_small1921 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.paperbg2_600x800 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.snow_alone = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.tree_branch = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.tree_clear_small = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.VeraAzbeleva_small1883 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.ViktorArcimovic_small1820 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.Viktors_framed = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.vlad_michailsson = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"]);
	this.gotoAndStop(47);
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


(lib.Tween173 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.horses_alone();
	this.instance.setTransform(-248.5,-150);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-248.5,-150,497,300);


(lib.Tween172 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.horses_alone();
	this.instance.setTransform(-248.5,-150);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-248.5,-150,497,300);


(lib.Tween171 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.horses_alone();
	this.instance.setTransform(-248.5,-150);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-248.5,-150,497,300);


(lib.Tween170 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.horses_alone();
	this.instance.setTransform(-248.5,-150);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-248.5,-150,497,300);


(lib.Tween169 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.horses_alone();
	this.instance.setTransform(-248.5,-150);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-248.5,-150,497,300);


(lib.Tween168 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.horses_alone();
	this.instance.setTransform(-248.5,-150);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-248.5,-150,497,300);


(lib.Tween167 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.horses_alone();
	this.instance.setTransform(-248.5,-150);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-248.5,-150,497,300);


(lib.Tween156 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_39();
	this.instance.setTransform(-40.2,-57.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-40.2,-57.5,80.5,115);


(lib.Tween155 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_38();
	this.instance.setTransform(-40.2,-57.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-40.2,-57.5,80.5,115);


(lib.Tween154 = function(mode,startPosition,loop,reversed) {
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
	this.shape = new cjs.Shape();
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.5,1,1).moveTo(-4.6,-137.1).curveTo(-17.6,-125.7,-17,-109.5).curveTo(-16.4,-93.4,-33.5,-42.8).curveTo(-50.7,7.8,-69.4,38.6).curveTo(-113.1,111.6,-104.4,127.2).curveTo(-95.8,142.8,-44.2,133.9).curveTo(7.4,125,24.2,111.1).curveTo(80,109.9,104.4,97.4).curveTo(105.2,97,105.9,96.6);
	this.shape.setTransform(-20.6215,0.0198);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.5,1,0,3).moveTo(-75.8,-116.9).curveTo(-54.7,-114.3,-33.2,-116.1).curveTo(-3.9,-113.7,40.3,-116.6).curveTo(84.4,-119.5,73.8,-56.1).curveTo(69.2,-28.8,67.5,-5.8).curveTo(65.6,21.1,67.6,42.1).curveTo(67.9,44.9,68.2,47.6).curveTo(73.3,87.8,66.2,97.5).curveTo(59.1,107.2,34.6,116.9);
	this.shape_1.setTransform(50.6271,-20.225);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.beginFill("rgba(85,71,50,0)").beginStroke().moveTo(-121.7,127.3).curveTo(-130.4,111.7,-86.7,38.7).curveTo(-68,7.8,-50.8,-42.7).curveTo(-34.3,-91.7,-34.3,-108.4).lineTo(-34.3,-109.5).lineTo(-34.4,-110.9).curveTo(-34.4,-126.1,-21.9,-137.1).lineTo(-21.3,-137).lineTo(-20.9,-137).lineTo(-20.6,-136.9).curveTo(-8.9,-135.6,3,-135.6).lineTo(3,-135.6).lineTo(3,-135.6).curveTo(11.4,-135.6,19.8,-136.3).lineTo(20.4,-136.3).lineTo(20.7,-136.3).curveTo(60.2,-131.5,89.3,-97.5).curveTo(115.6,-66.7,121.5,-26).curveTo(123.2,-14.3,123.2,-1.8).curveTo(123.2,10.4,121.6,21.9).curveTo(120.5,11.1,120.5,-1.4).curveTo(120.5,-13,121.5,-26).curveTo(120.5,-13,120.5,-1.4).curveTo(120.5,11.1,121.6,21.9).curveTo(115.8,62.9,89.3,93.9).curveTo(86.1,97.6,87.1,97.5).lineTo(88.6,96.7).curveTo(53.1,129.8,6.9,111.1).curveTo(62.7,109.9,87.1,97.5).curveTo(62.7,109.9,6.9,111.1).curveTo(-9.9,125,-61.5,133.9).curveTo(-80.3,137.1,-93.4,137.1).curveTo(-116.2,137.1,-121.7,127.3).closePath().moveTo(-108.2,-1.8).curveTo(-108.2,-57.8,-74.4,-97.5).curveTo(-54.7,-120.5,-21.9,-137.1).curveTo(-34.4,-126.1,-34.4,-110.9).lineTo(-34.3,-109.5).lineTo(-34.3,-108.4).curveTo(-34.3,-91.7,-50.8,-42.7).curveTo(-68,7.8,-86.7,38.7).curveTo(-108.2,12.2,-108.2,-1.8).closePath().moveTo(121.6,21.9).lineTo(121.6,21.9).closePath().moveTo(3,-135.6).curveTo(-8.9,-135.6,-20.6,-136.9).lineTo(-20.9,-137).lineTo(-21.3,-137).lineTo(-21.9,-137.1).lineTo(7.5,-137.1).curveTo(14.2,-137.1,20.7,-136.3).lineTo(20.4,-136.3).lineTo(19.8,-136.3).curveTo(11.4,-135.6,3,-135.6).lineTo(3,-135.6).lineTo(3,-135.6).closePath().moveTo(-21.9,-137.1).lineTo(-21.9,-137.1).closePath();
	this.shape_2.setTransform(-3.3215,-0.0052);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-128.7,-139.4,257.4,278.8);


(lib.Tween153 = function(mode,startPosition,loop,reversed) {
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
	this.shape = new cjs.Shape();
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.5,1,1).moveTo(-4.6,-137.1).curveTo(-17.6,-125.7,-17,-109.5).curveTo(-16.4,-93.4,-33.5,-42.8).curveTo(-50.7,7.8,-69.4,38.6).curveTo(-113.1,111.6,-104.4,127.2).curveTo(-95.8,142.8,-44.2,133.9).curveTo(7.4,125,24.2,111.1).curveTo(80,109.9,104.4,97.4).curveTo(105.2,97,105.9,96.6);
	this.shape.setTransform(-20.5824,0.0171);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.5,1,0,3).moveTo(-75.8,-116.9).curveTo(-54.7,-114.3,-33.2,-116.1).curveTo(-3.9,-113.7,40.3,-116.6).curveTo(84.4,-119.5,73.8,-56.1).curveTo(69.2,-28.8,67.5,-5.9).curveTo(65.6,21.1,67.6,42.1).curveTo(67.9,44.9,68.2,47.6).curveTo(73.3,87.8,66.2,97.5).curveTo(59.1,107.2,34.6,116.9);
	this.shape_1.setTransform(50.669,-20.225);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.beginFill("rgba(85,71,50,0)").beginStroke().moveTo(-121.7,127.2).curveTo(-130.4,111.7,-86.7,38.7).curveTo(-108.2,12.2,-108.2,-1.8).curveTo(-108.2,-57.8,-74.4,-97.5).curveTo(-54.7,-120.5,-21.9,-137.1).curveTo(-34.3,-126.2,-34.3,-111).lineTo(-34.3,-109.5).lineTo(-34.3,-108.3).curveTo(-34.3,-91.5,-50.8,-42.8).curveTo(-68,7.8,-86.7,38.7).curveTo(-68,7.8,-50.8,-42.8).curveTo(-34.3,-91.5,-34.3,-108.3).lineTo(-34.3,-109.5).lineTo(-34.3,-111).curveTo(-34.3,-126.2,-21.9,-137.1).lineTo(-21.3,-137).curveTo(-9.2,-135.6,3,-135.6).lineTo(3,-135.6).lineTo(3,-135.6).curveTo(11.4,-135.6,19.8,-136.3).lineTo(20.1,-136.3).lineTo(20.7,-136.3).curveTo(60.2,-131.5,89.3,-97.5).curveTo(115.6,-66.7,121.5,-26.1).curveTo(120.5,-13,120.5,-1.4).curveTo(120.5,11,121.6,21.9).curveTo(120.5,11,120.5,-1.4).curveTo(120.5,-13,121.5,-26.1).curveTo(123.2,-14.3,123.2,-1.8).curveTo(123.2,10.4,121.6,21.9).curveTo(115.8,62.9,89.3,93.9).curveTo(86.1,97.6,87.1,97.4).lineTo(88.6,96.7).curveTo(53.1,129.8,6.9,111.1).curveTo(62.7,109.9,87.1,97.4).curveTo(62.7,109.9,6.9,111.1).curveTo(-9.9,125,-61.5,133.9).curveTo(-80.2,137.1,-93.3,137.1).curveTo(-116.2,137.1,-121.7,127.2).closePath().moveTo(121.5,-26.1).lineTo(121.5,-26.1).closePath().moveTo(3,-135.6).curveTo(-9.2,-135.6,-21.3,-137).lineTo(-21.9,-137.1).lineTo(7.5,-137.1).curveTo(14.2,-137.1,20.7,-136.3).lineTo(20.1,-136.3).lineTo(19.8,-136.3).curveTo(11.4,-135.6,3,-135.6).lineTo(3,-135.6).lineTo(3,-135.6).closePath().moveTo(-21.9,-137.1).lineTo(-21.9,-137.1).closePath();
	this.shape_2.setTransform(-3.2824,-0.0079);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-128.6,-139.4,257.29999999999995,278.8);


(lib.Tween152 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("Olga Perovskaya", "38px 'Arial'", "#554732");
	this.text.lineHeight = 44;
	this.text.parent = this;
	this.text.setTransform(-158.85,-23);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-25,293.6,46.5);


(lib.Tween151 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("Olga Perovskaya", "38px 'Arial'", "#554732");
	this.text.lineHeight = 44;
	this.text.parent = this;
	this.text.setTransform(-158.8,-23);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-160.8,-25,293.70000000000005,46.5);


(lib.Tween146 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-52.05,62.55,1,1,-109.5511);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-79.8,-62.5,159.7,125.1);


(lib.Tween145 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-52.05,62.55,1,1,-109.5511);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-79.8,-62.5,159.7,125.1);


(lib.Tween144 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween143 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(56.9,-58.2,1,1,75.0015);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78.3,-58.2,156.7,116.4);


(lib.Tween142 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(78.4,-21.95,1,1,105.0002);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78.3,-58.2,156.7,116.4);


(lib.Tween141 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween140 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-80.7,-10.45,1,1,-51.9466);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-80.7,-75.8,161.4,151.7);


(lib.Tween139 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-70.95,-39.85,1,1,-29.9992);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70.9,-81.3,141.9,162.7);


(lib.Tween138 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween137 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-70.95,-39.85,1,1,-30.0004);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70.9,-81.3,141.9,162.7);


(lib.Tween136 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween135 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween134 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(58.2,56.9,1,1,165.0017);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-58.2,-78.3,116.4,156.7);


(lib.Tween133 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween132 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween131 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(39.9,-70.95,1,1,59.9992);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-81.3,-70.9,162.7,141.9);


(lib.Tween130 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(20.15,-78.85,1,1,45);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78.8,-78.8,157.7,157.7);


(lib.Tween129 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween128 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(78.85,20.15,1,1,135);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78.8,-78.8,157.7,157.7);


(lib.Tween127 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(78.85,20.15,1,1,135);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78.8,-78.8,157.7,157.7);


(lib.Tween126 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween125 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween124 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween123 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween122 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween121 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween120 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween119 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-41.5,-70);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.5,-70,83,140);


(lib.Tween118 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween117 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween116 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween115 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween114 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-226.4,-234.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-226.4,-234.5,453,469);


(lib.Tween113 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_36();
	this.instance.setTransform(-226.4,-234.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-226.4,-234.5,453,469);


(lib.Tween112 = function(mode,startPosition,loop,reversed) {
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

	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(-246,-207.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-246,-207.6,490.7,413.79999999999995);


(lib.Tween111 = function(mode,startPosition,loop,reversed) {
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

	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(-246,-207.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-246,-207.6,490.7,413.79999999999995);


(lib.Tween110 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween109 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween108 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween107 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween106 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween105 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween104 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween103 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween102 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween101 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween100 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween99 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween98 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("Michail Zemchuznikov -- 1788", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 312;
	this.text.parent = this;
	this.text.setTransform(-155.9,-11);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-157.9,-13,315.9,25.9);


(lib.Tween97 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("Michail Zemchuznikov -- 1788", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 312;
	this.text.parent = this;
	this.text.setTransform(-155.9,-11);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-157.9,-13,315.9,25.9);


(lib.Tween96 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween95 = function(mode,startPosition,loop,reversed) {
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


(lib.viktors_framedMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Viktors_framed();
	this.instance.setTransform(-103.5,-155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.viktors_framedMC, new cjs.Rectangle(-103.5,-155,207,310), null);


(lib.Anna_viktorwifeMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Anna_viktorwife_whole();
	this.instance.setTransform(-103.5,-155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Anna_viktorwifeMC, new cjs.Rectangle(-103.5,-155,207,310), null);


(lib.Anna_daughterMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Anna_whole();
	this.instance.setTransform(-103.5,-155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Anna_daughterMC, new cjs.Rectangle(-103.5,-155,207,310), null);


(lib.vladMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.vlad_michailsson();
	this.instance.setTransform(-100,-113.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.vladMC, new cjs.Rectangle(-100,-113.5,200,227), null);


(lib.snowMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.snow_alone();
	this.instance.setTransform(-248.5,-166);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.snowMC, new cjs.Rectangle(-248.5,-166,497,332), null);


(lib.lev2MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.lev_michailsson();
	this.instance.setTransform(-73,-93.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev2MC, new cjs.Rectangle(-73,-93.5,146,187), null);


(lib.lev1MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.lev_michailsson_whole_smaller();
	this.instance.setTransform(-362.5,-500);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev1MC, new cjs.Rectangle(-362.5,-500,725,1000), null);


(lib.aleksej2MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.aleksej_michailsson();
	this.instance.setTransform(-100,-113.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.aleksej2MC, new cjs.Rectangle(-100,-113.5,200,227), null);


(lib.aleksej_michailovicsMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.aleksej_michailsson_cutout();
	this.instance.setTransform(-88.5,-100);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.aleksej_michailovicsMC, new cjs.Rectangle(-88.5,-100,177,200), null);


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


(lib.Tween158 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_41();
	this.instance.setTransform(-30.9,-13.35,0.5,0.5);

	this.instance_1 = new lib.Tween156("synched",0);
	this.instance_1.setTransform(-54.7,-4.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-94.9,-62.2,190,124.4);


(lib.Tween157 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(-30.9,-13.35,0.5,0.5);

	this.instance_1 = new lib.Tween156("synched",0);
	this.instance_1.setTransform(-54.7,-4.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-94.9,-62.2,190,124.4);


(lib.Tween160 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_43();
	this.instance.setTransform(43.6,-45.05,0.5,0.5);

	this.instance_1 = new lib.Tween158("synched",0);
	this.instance_1.setTransform(-22.2,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-117.1,-62.2,234.2,124.4);


(lib.Tween159 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_42();
	this.instance.setTransform(43.6,-45.05,0.5,0.5);

	this.instance_1 = new lib.Tween158("synched",0);
	this.instance_1.setTransform(-22.2,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-117.1,-62.2,234.2,124.4);


(lib.Tween162 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_45();
	this.instance.setTransform(-32.6,-69.9,0.5,0.5);

	this.instance_1 = new lib.Tween160("synched",0);
	this.instance_1.setTransform(0,7.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-117.1,-69.9,234.2,139.7);


(lib.Tween161 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_44();
	this.instance.setTransform(-32.6,-69.9,0.5,0.5);

	this.instance_1 = new lib.Tween160("synched",0);
	this.instance_1.setTransform(0,7.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-117.1,-69.9,234.2,139.7);


(lib.Tween164 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_47();
	this.instance.setTransform(-170.3,108.55,0.5,0.5);

	this.instance_1 = new lib.Tween162("synched",0);
	this.instance_1.setTransform(53.2,-108.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-170.3,-178.4,340.6,357);


(lib.Tween163 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_46();
	this.instance.setTransform(-170.3,108.55,0.5,0.5);

	this.instance_1 = new lib.Tween162("synched",0);
	this.instance_1.setTransform(53.2,-108.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-170.3,-178.4,340.6,357);


(lib.Tween166 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_49();
	this.instance.setTransform(-43.8,79.65,0.5,0.5);

	this.instance_1 = new lib.Tween164("synched",0);
	this.instance_1.setTransform(0,-10.15);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-170.3,-188.5,340.6,377.2);


(lib.Tween165 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_48();
	this.instance.setTransform(-43.8,79.65,0.5,0.5);

	this.instance_1 = new lib.Tween164("synched",0);
	this.instance_1.setTransform(0,-10.15);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-170.3,-188.5,340.6,377.2);


// stage content:
(lib.AncestorSplit_31May2014_copyHTML5_HTML5Canvas_Scene4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {nar4:0,wrong_nar4:755,continue_nar4:759,wrongbranch_nar4:1359};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,99,337,754,755,759,923,929,1354,1359,1375,1574];
	this.streamSoundSymbolsList[337] = [{id:"giggles_bounce",startFrame:337,endFrame:1579,loop:1,offset:0}];
	this.streamSoundSymbolsList[923] = [{id:"galloping_bounce",startFrame:923,endFrame:1579,loop:1,offset:0}];
	this.streamSoundSymbolsList[929] = [{id:"galloping_bounce",startFrame:929,endFrame:1579,loop:1,offset:0}];
	this.streamSoundSymbolsList[1375] = [{id:"giggles_shorter_bounce",startFrame:1375,endFrame:1579,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}
	this.frame_99 = function() {
		playSound("nar4_pt1");
	}
	this.frame_337 = function() {
		var soundInstance = playSound("giggles_bounce",0);
		this.InsertIntoSoundStreamData(soundInstance,337,1579,1);
		soundInstance.volume = 0.5;
	}
	this.frame_754 = function() {
		this.stop();
		
		this.button4.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar4");
		}
		
		
		this.button4_wrong.addEventListener("click", fl_WrongClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_WrongClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("wrongbranch_nar4");
		}
		
		/*import flash.events.Event;
		
		button4.addEventListener(MouseEvent.MOUSE_UP, continue_nar4);
		
		function continue_nar4(e:Event):void {
			button4.removeEventListener(MouseEvent.MOUSE_UP, continue_nar4);
			gotoAndPlay("continue_nar4");
		}
		
		button4_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar4);
		
		function wrong_nar4(e:Event):void {
			button4_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar4);
			gotoAndPlay("wrongbranch_nar4");
		}
		*/
	}
	this.frame_755 = function() {
		this.stop();
		
		this.button4.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar4");
		}
		
		/*import flash.events.Event;
		
		button4.addEventListener(MouseEvent.MOUSE_UP, continue_nar4a);
		
		function continue_nar4a(e:Event):void {
			button4.removeEventListener(MouseEvent.MOUSE_UP, continue_nar4);
			gotoAndPlay("continue_nar4");
		}
		
		button4_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar4a);
		
		function wrong_nar4a(e:Event):void {
			button4_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar4);
			gotoAndPlay("wrongbranch_nar4");
		}
		*/
	}
	this.frame_759 = function() {
		playSound("nar4_pt26db");
	}
	this.frame_923 = function() {
		var soundInstance = playSound("galloping_bounce",0);
		this.InsertIntoSoundStreamData(soundInstance,923,1579,1);
		soundInstance.volume = 0.5;
	}
	this.frame_929 = function() {
		var soundInstance = playSound("galloping_bounce",0);
		this.InsertIntoSoundStreamData(soundInstance,929,1579,1);
		soundInstance.volume = 0.5;
	}
	this.frame_1354 = function() {
		/* gotoAndPlay("tree","Scene 1");*/
		
		window.open("AncestorSplit_31May2014_copyHTML5_HTML5_Canvas.html?18596", "_self");
	}
	this.frame_1359 = function() {
		playSound("nar4_wrongbranch");
	}
	this.frame_1375 = function() {
		var soundInstance = playSound("giggles_shorter_bounce",0);
		this.InsertIntoSoundStreamData(soundInstance,1375,1579,1);
		soundInstance.volume = 0.5;
	}
	this.frame_1574 = function() {
		this.gotoAndStop("wrong_nar4");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(99).call(this.frame_99).wait(238).call(this.frame_337).wait(417).call(this.frame_754).wait(1).call(this.frame_755).wait(4).call(this.frame_759).wait(164).call(this.frame_923).wait(6).call(this.frame_929).wait(425).call(this.frame_1354).wait(5).call(this.frame_1359).wait(16).call(this.frame_1375).wait(199).call(this.frame_1574).wait(5));

	// text_nar4
	this.text = new cjs.Text("Michail Zemchuznikov -- 1788", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 312;
	this.text.parent = this;
	this.text.setTransform(174.1,23.9);

	this.instance = new lib.Tween97("synched",0);
	this.instance.setTransform(330,34.9);
	this.instance._off = true;

	this.instance_1 = new lib.Tween98("synched",0);
	this.instance_1.setTransform(175.35,34.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text}]}).to({state:[{t:this.instance}]},45).to({state:[{t:this.instance_1}]},59).to({state:[]},190).to({state:[]},86).wait(1199));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(45).to({_off:false},0).to({_off:true,x:175.35},59).wait(1475));

	// michail_large
	this.instance_2 = new lib.Michail_largeMC();
	this.instance_2.setTransform(330,265.05,0.0842,0.0841,0,0,0,0,-0.6);
	this.instance_2.alpha = 0;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(14).to({_off:false},0).to({regX:0.1,regY:-9.2,scaleX:1.037,scaleY:1.0356,x:330.15,y:305,alpha:1},30).to({x:-213.25,y:265.5,alpha:0},55).to({_off:true},1).wait(1479));

	// _NR1678
	this.instance_3 = new lib.Tween3("synched",0);
	this.instance_3.setTransform(333.6,342.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(89).to({startPosition:0},0).to({alpha:0},10).to({_off:true},1).wait(1479));

	// _KR1728
	this.instance_4 = new lib.Tween20("synched",0);
	this.instance_4.setTransform(509.15,383.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(89).to({startPosition:0},0).to({alpha:0},10).to({_off:true},1).wait(1479));

	// _AR1748
	this.instance_5 = new lib.Tween58("synched",0);
	this.instance_5.setTransform(510.55,237.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(89).to({startPosition:0},0).to({alpha:0},10).to({_off:true},1).wait(1479));

	// _MZ1788
	this.instance_6 = new lib.Tween95("synched",0);
	this.instance_6.setTransform(385.95,159);

	this.instance_7 = new lib.Tween96("synched",0);
	this.instance_7.setTransform(330.15,251.6);
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({_off:true,x:330.15,y:251.6},29).wait(1550));
	this.timeline.addTween(cjs.Tween.get(this.instance_7).to({_off:false},29).wait(60).to({startPosition:0},0).to({alpha:0},10).to({_off:true},1).wait(1479));

	// _VA1820
	this.instance_8 = new lib.ViktorArcimovic_small1820();
	this.instance_8.setTransform(232,113);

	this.instance_9 = new lib.Tween99("synched",0);
	this.instance_9.setTransform(267,158);
	this.instance_9._off = true;

	this.instance_10 = new lib.Tween100("synched",0);
	this.instance_10.setTransform(267,158);
	this.instance_10.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8}]}).to({state:[{t:this.instance_9}]},89).to({state:[{t:this.instance_10}]},10).to({state:[]},1).wait(1479));
	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(89).to({_off:false},0).to({_off:true,alpha:0},10).wait(1480));

	// _NA1857
	this.instance_11 = new lib.NikolajAzbelev_small1857();
	this.instance_11.setTransform(117,184);

	this.instance_12 = new lib.Tween101("synched",0);
	this.instance_12.setTransform(152,229);
	this.instance_12._off = true;

	this.instance_13 = new lib.Tween102("synched",0);
	this.instance_13.setTransform(152,229);
	this.instance_13.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_11}]}).to({state:[{t:this.instance_12}]},89).to({state:[{t:this.instance_13}]},10).to({state:[]},1).wait(1479));
	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(89).to({_off:false},0).to({_off:true,alpha:0},10).wait(1480));

	// _VA1883
	this.instance_14 = new lib.VeraAzbeleva_small1883();
	this.instance_14.setTransform(109,329);

	this.instance_15 = new lib.Tween103("synched",0);
	this.instance_15.setTransform(144,374);
	this.instance_15._off = true;

	this.instance_16 = new lib.Tween104("synched",0);
	this.instance_16.setTransform(144,374);
	this.instance_16.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_14}]}).to({state:[{t:this.instance_15}]},89).to({state:[{t:this.instance_16}]},10).to({state:[]},1).wait(1479));
	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(89).to({_off:false},0).to({_off:true,alpha:0},10).wait(1480));

	// _OS1921
	this.instance_17 = new lib.OlgaSott_small1921();
	this.instance_17.setTransform(200.1,466.45);

	this.instance_18 = new lib.Tween105("synched",0);
	this.instance_18.setTransform(235.1,511.45);
	this.instance_18._off = true;

	this.instance_19 = new lib.Tween106("synched",0);
	this.instance_19.setTransform(235.1,511.45);
	this.instance_19.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_17}]}).to({state:[{t:this.instance_18}]},89).to({state:[{t:this.instance_19}]},10).to({state:[]},1).wait(1479));
	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(89).to({_off:false},0).to({_off:true,alpha:0},10).wait(1480));

	// _BA1947
	this.instance_20 = new lib.BirutaAkerbergs_small1947();
	this.instance_20.setTransform(349.05,467);

	this.instance_21 = new lib.Tween107("synched",0);
	this.instance_21.setTransform(384.05,512);
	this.instance_21._off = true;

	this.instance_22 = new lib.Tween108("synched",0);
	this.instance_22.setTransform(384.05,512);
	this.instance_22.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_20}]}).to({state:[{t:this.instance_21}]},89).to({state:[{t:this.instance_22}]},10).to({state:[]},1).wait(1479));
	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(89).to({_off:false},0).to({_off:true,alpha:0},10).wait(1480));

	// _0H1983
	this.instance_23 = new lib.Hansen_small1983();
	this.instance_23.setTransform(490.1,462.7);

	this.instance_24 = new lib.Tween109("synched",0);
	this.instance_24.setTransform(525.1,507.7);
	this.instance_24._off = true;

	this.instance_25 = new lib.Tween110("synched",0);
	this.instance_25.setTransform(525.1,507.7);
	this.instance_25.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_23}]}).to({state:[{t:this.instance_24}]},89).to({state:[{t:this.instance_25}]},10).to({state:[]},1).wait(1479));
	this.timeline.addTween(cjs.Tween.get(this.instance_24).wait(89).to({_off:false},0).to({_off:true,alpha:0},10).wait(1480));

	// arrows
	this.text_1 = new cjs.Text("....", "italic bold 47px 'Verdana'", "#554732");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 59;
	this.text_1.parent = this;
	this.text_1.setTransform(606.05,474.7);

	this.instance_26 = new lib.CachedBmp_35();
	this.instance_26.setTransform(151.45,120,0.5,0.5);

	this.instance_27 = new lib.Tween111("synched",0);
	this.instance_27.setTransform(397.5,327.6);
	this.instance_27._off = true;

	this.instance_28 = new lib.Tween112("synched",0);
	this.instance_28.setTransform(397.5,327.6);
	this.instance_28.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_26},{t:this.text_1}]}).to({state:[{t:this.instance_27}]},89).to({state:[{t:this.instance_28}]},10).to({state:[]},1).wait(1479));
	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(89).to({_off:false},0).to({_off:true,alpha:0},10).wait(1480));

	// vine
	this.instance_29 = new lib.CachedBmp_23();
	this.instance_29.setTransform(88.1,62.4,0.5,0.5);

	this.instance_30 = new lib.Tween113("synched",0);
	this.instance_30.setTransform(314.5,296.9);
	this.instance_30._off = true;

	this.instance_31 = new lib.Tween114("synched",0);
	this.instance_31.setTransform(314.5,296.9);
	this.instance_31.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_29}]}).to({state:[{t:this.instance_30}]},89).to({state:[{t:this.instance_31}]},10).to({state:[]},1).wait(1479));
	this.timeline.addTween(cjs.Tween.get(this.instance_30).wait(89).to({_off:false},0).to({_off:true,alpha:0},10).wait(1480));

	// branches
	this.instance_32 = new lib.tree_branch();
	this.instance_32.setTransform(345.5,382.5);

	this.instance_33 = new lib.tree_branch();
	this.instance_33.setTransform(542.6,507,0.8293,1.0441,0,-74.6679,-29.9986);

	this.instance_34 = new lib.tree_branch();
	this.instance_34.setTransform(586.45,490.9,1,1,-29.9992);

	this.instance_35 = new lib.tree_branch();
	this.instance_35.setTransform(446.5,486.5,1,1.164,0,30.7843,0);

	this.instance_36 = new lib.tree_branch();
	this.instance_36.setTransform(481.15,493.5,0.5341,0.7659,59.9996);

	this.instance_37 = new lib.tree_branch();
	this.instance_37.setTransform(436.1,479.85,1,1,45);

	this.instance_38 = new lib.tree_branch();
	this.instance_38.setTransform(346.3,480.2,1,1.451,59.9998);

	this.instance_39 = new lib.tree_branch();
	this.instance_39.setTransform(294.15,480.9,1,1,45);

	this.instance_40 = new lib.tree_branch();
	this.instance_40.setTransform(161.95,487.7,1,1,-74.9998);

	this.instance_41 = new lib.tree_branch();
	this.instance_41.setTransform(132.55,458.9,1.1309,1,0,-74.9998,-47.1609);

	this.instance_42 = new lib.tree_branch();
	this.instance_42.setTransform(109.5,316.2,1.7805,1,-45);

	this.instance_43 = new lib.tree_branch();
	this.instance_43.setTransform(171.5,147.5);

	this.instance_44 = new lib.tree_branch();
	this.instance_44.setTransform(212.9,188.05,1,1,-135);

	this.instance_45 = new lib.tree_branch();
	this.instance_45.setTransform(312.9,172.5,1,1,-120.0004);

	this.instance_46 = new lib.tree_branch();
	this.instance_46.setTransform(417.5,166.5,0.4634,1,-90);

	this.instance_47 = new lib.tree_branch();
	this.instance_47.setTransform(470.45,310.5,1.5366,1);

	this.instance_48 = new lib.tree_branch();
	this.instance_48.setTransform(462.85,426.15,1,0.7,-135.0009);

	this.instance_49 = new lib.tree_branch();
	this.instance_49.setTransform(397.6,383.55,1.6415,1,14.9983);

	this.instance_50 = new lib.tree_branch();
	this.instance_50.setTransform(459.4,328.95,1,1,-83.995);

	this.instance_51 = new lib.tree_branch();
	this.instance_51.setTransform(440.85,152.9,1,1,-45);

	this.instance_52 = new lib.Tween115("synched",0);
	this.instance_52.setTransform(377.45,331.65);
	this.instance_52._off = true;

	this.instance_53 = new lib.Tween116("synched",0);
	this.instance_53.setTransform(377.45,331.65);
	this.instance_53.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_51},{t:this.instance_50},{t:this.instance_49},{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_41},{t:this.instance_40},{t:this.instance_39},{t:this.instance_38},{t:this.instance_37},{t:this.instance_36},{t:this.instance_35},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32}]}).to({state:[{t:this.instance_52}]},89).to({state:[{t:this.instance_53}]},10).to({state:[]},1).wait(1479));
	this.timeline.addTween(cjs.Tween.get(this.instance_52).wait(89).to({_off:false},0).to({_off:true,alpha:0},10).wait(1480));

	// tree
	this.instance_54 = new lib.tree_clear_small();
	this.instance_54.setTransform(214.5,138);

	this.instance_55 = new lib.Tween117("synched",0);
	this.instance_55.setTransform(322,322);
	this.instance_55._off = true;

	this.instance_56 = new lib.Tween118("synched",0);
	this.instance_56.setTransform(322,322);
	this.instance_56.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_54}]}).to({state:[{t:this.instance_55}]},89).to({state:[{t:this.instance_56}]},10).to({state:[]},1).wait(1479));
	this.timeline.addTween(cjs.Tween.get(this.instance_55).wait(89).to({_off:false},0).to({_off:true,alpha:0},10).wait(1480));

	// aleksej
	this.instance_57 = new lib.Aleksej_largeMC();
	this.instance_57.setTransform(156,222);
	this.instance_57.alpha = 0;
	this.instance_57._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_57).wait(290).to({_off:false},0).to({alpha:1},22).wait(218).to({alpha:0},24).to({_off:true},1).wait(1024));

	// baby10
	this.instance_58 = new lib.Tween144("synched",0);
	this.instance_58.setTransform(510,658);
	this.instance_58._off = true;

	this.instance_59 = new lib.Tween145("synched",0);
	this.instance_59.setTransform(536.7,509.95,1,1,14.9983);
	this.instance_59._off = true;

	this.instance_60 = new lib.Tween146("synched",0);
	this.instance_60.setTransform(536.7,519.95,1,1,-14.9983);
	this.instance_60._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_58).wait(427).to({_off:false},0).to({_off:true,rotation:14.9983,x:536.7,y:509.95},12).wait(1140));
	this.timeline.addTween(cjs.Tween.get(this.instance_59).wait(427).to({_off:false},12).to({_off:true,rotation:-14.9983,y:519.95},5).wait(1135));
	this.timeline.addTween(cjs.Tween.get(this.instance_60).wait(439).to({_off:false},5).wait(53).to({startPosition:0},0).to({y:510.95},4).to({y:520.95},3).to({y:490.95},4).to({y:515.95},3).wait(26).to({startPosition:0},0).to({alpha:0},17).to({_off:true},1).wait(1024));

	// baby9
	this.instance_61 = new lib.Tween141("synched",0);
	this.instance_61.setTransform(413,666.95);
	this.instance_61._off = true;

	this.instance_62 = new lib.Tween142("synched",0);
	this.instance_62.setTransform(453.65,455.45);
	this.instance_62._off = true;

	this.instance_63 = new lib.Tween143("synched",0);
	this.instance_63.setTransform(453.65,461.5,1,1,14.9983);
	this.instance_63._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_61).wait(412).to({_off:false},0).to({_off:true,x:453.65,y:455.45},12).wait(1155));
	this.timeline.addTween(cjs.Tween.get(this.instance_62).wait(412).to({_off:false},12).to({_off:true,rotation:14.9983,y:461.5},3).wait(1152));
	this.timeline.addTween(cjs.Tween.get(this.instance_63).wait(424).to({_off:false},3).wait(65).to({startPosition:0},0).to({y:451.5},3).to({y:461.5},4).wait(10).to({startPosition:0},0).to({y:433.5},4).to({y:451.5},4).wait(21).to({startPosition:0},0).to({alpha:0},17).to({_off:true},1).wait(1023));

	// baby8
	this.instance_64 = new lib.Tween138("synched",0);
	this.instance_64.setTransform(450,671);
	this.instance_64._off = true;

	this.instance_65 = new lib.Tween139("synched",0);
	this.instance_65.setTransform(575.9,349.8);
	this.instance_65._off = true;

	this.instance_66 = new lib.Tween140("synched",0);
	this.instance_66.setTransform(575.9,380.8);
	this.instance_66._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_64).wait(401).to({_off:false},0).to({_off:true,x:575.9,y:349.8},8).wait(1170));
	this.timeline.addTween(cjs.Tween.get(this.instance_65).wait(401).to({_off:false},8).to({_off:true,y:380.8},3).wait(1167));
	this.timeline.addTween(cjs.Tween.get(this.instance_66).wait(409).to({_off:false},3).wait(73).to({startPosition:0},0).to({y:370.8},5).to({y:380.8},4).wait(21).to({startPosition:0},0).to({y:355.8},4).to({y:372.8},4).wait(16).to({startPosition:0},0).to({alpha:0},17).to({_off:true},1).wait(1022));

	// baby7
	this.instance_67 = new lib.Tween135("synched",0);
	this.instance_67.setTransform(198,644.95);
	this.instance_67._off = true;

	this.instance_68 = new lib.Tween136("synched",0);
	this.instance_68.setTransform(363.15,390.95);
	this.instance_68._off = true;

	this.instance_69 = new lib.Tween137("synched",0);
	this.instance_69.setTransform(363.2,407);
	this.instance_69._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_67).wait(387).to({_off:false},0).to({_off:true,x:363.15,y:390.95},12).wait(1180));
	this.timeline.addTween(cjs.Tween.get(this.instance_68).wait(387).to({_off:false},12).to({_off:true,x:363.2,y:407},3).wait(1177));
	this.timeline.addTween(cjs.Tween.get(this.instance_69).wait(399).to({_off:false},3).wait(77).to({startPosition:0},0).to({y:397},5).to({y:407},5).wait(32).to({startPosition:0},0).to({y:382},4).to({y:398},5).to({regX:-0.1,regY:0.1,scaleX:2.1705,scaleY:2.1705,x:236.9,y:381.25},24).wait(1).to({startPosition:0},0).to({regX:0,regY:0,scaleX:3.6505,scaleY:3.6504,x:-261.8,y:397.95,alpha:0},150).to({_off:true},639).wait(235));

	// baby6
	this.instance_70 = new lib.Tween132("synched",0);
	this.instance_70.setTransform(468.95,674);
	this.instance_70._off = true;

	this.instance_71 = new lib.Tween133("synched",0);
	this.instance_71.setTransform(479.35,344.95);
	this.instance_71._off = true;

	this.instance_72 = new lib.Tween134("synched",0);
	this.instance_72.setTransform(479.3,349.9,1,1,-134.9975);
	this.instance_72._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_70).wait(376).to({_off:false},0).to({_off:true,x:479.35,y:344.95},8).wait(1195));
	this.timeline.addTween(cjs.Tween.get(this.instance_71).wait(376).to({_off:false},8).to({_off:true,rotation:-134.9975,x:479.3,y:349.9},5).wait(1190));
	this.timeline.addTween(cjs.Tween.get(this.instance_72).wait(384).to({_off:false},5).wait(86).to({startPosition:0},0).to({y:339.9},2).to({y:349.9},3).wait(48).to({startPosition:0},0).to({y:332.9},4).to({y:341.9},5).wait(3).to({startPosition:0},0).to({alpha:0},17).to({_off:true},1).wait(1021));

	// baby5
	this.instance_73 = new lib.Tween129("synched",0);
	this.instance_73.setTransform(457.95,655.95);
	this.instance_73._off = true;

	this.instance_74 = new lib.Tween130("synched",0);
	this.instance_74.setTransform(549.95,229.95);
	this.instance_74._off = true;

	this.instance_75 = new lib.Tween131("synched",0);
	this.instance_75.setTransform(549.95,257.95);
	this.instance_75._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_73).wait(365).to({_off:false},0).to({_off:true,x:549.95,y:229.95},9).wait(1205));
	this.timeline.addTween(cjs.Tween.get(this.instance_74).wait(365).to({_off:false},9).to({_off:true,y:257.95},3).wait(1202));
	this.timeline.addTween(cjs.Tween.get(this.instance_75).wait(374).to({_off:false},3).wait(91).to({startPosition:0},0).to({y:248.95},3).to({y:258.95},2).wait(61).to({startPosition:0},0).to({y:245.95},5).to({y:255.95},4).to({alpha:0},15).to({_off:true},1).wait(1020));

	// baby4
	this.instance_76 = new lib.Tween126("synched",0);
	this.instance_76.setTransform(423.95,677.1);
	this.instance_76._off = true;

	this.instance_77 = new lib.Tween127("synched",0);
	this.instance_77.setTransform(400.5,234.95,1,1,-82.2239);
	this.instance_77._off = true;

	this.instance_78 = new lib.Tween128("synched",0);
	this.instance_78.setTransform(400.5,274.95);
	this.instance_78._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_76).wait(355).to({_off:false},0).to({_off:true,rotation:-82.2239,x:400.5,y:234.95},9).wait(1215));
	this.timeline.addTween(cjs.Tween.get(this.instance_77).wait(355).to({_off:false},9).to({_off:true,rotation:0,y:274.95},3).wait(1212));
	this.timeline.addTween(cjs.Tween.get(this.instance_78).wait(364).to({_off:false},3).wait(112).to({startPosition:0},0).to({y:264.95},4).to({y:274.95},4).wait(54).to({startPosition:0},0).to({y:260.95},4).to({y:274.95},5).to({alpha:0},9).to({_off:true},1).wait(1019));

	// baby3
	this.instance_79 = new lib.Tween123("synched",0);
	this.instance_79.setTransform(433.95,673.95);
	this.instance_79._off = true;

	this.instance_80 = new lib.Tween124("synched",0);
	this.instance_80.setTransform(563.95,116.95);
	this.instance_80._off = true;

	this.instance_81 = new lib.Tween125("synched",0);
	this.instance_81.setTransform(563.95,144.95);
	this.instance_81._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_79).wait(344).to({_off:false},0).to({_off:true,x:563.95,y:116.95},10).wait(1225));
	this.timeline.addTween(cjs.Tween.get(this.instance_80).wait(344).to({_off:false},10).to({_off:true,y:144.95},3).wait(1222));
	this.timeline.addTween(cjs.Tween.get(this.instance_81).wait(354).to({_off:false},3).wait(115).to({startPosition:0},0).to({y:134.95},2).to({y:144.95},3).wait(71).to({startPosition:0},0).to({y:133.95},3).to({y:143.95},4).to({alpha:0},5).to({_off:true},1).wait(1018));

	// baby2
	this.instance_82 = new lib.Tween121("synched",0);
	this.instance_82.setTransform(423.95,647);
	this.instance_82._off = true;

	this.instance_83 = new lib.Tween122("synched",0);
	this.instance_83.setTransform(452.95,61);
	this.instance_83._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_82).wait(336).to({_off:false},0).to({_off:true,x:452.95,y:61},8).wait(1235));
	this.timeline.addTween(cjs.Tween.get(this.instance_83).wait(336).to({_off:false},8).to({y:90},3).wait(119).to({startPosition:0},0).to({y:80},3).to({y:89.3},3).wait(82).to({y:90},0).to({y:77},5).to({y:86},4).to({alpha:0},2).to({_off:true},1).wait(1013));

	// baby1
	this.instance_84 = new lib.Tween119("synched",0);
	this.instance_84.setTransform(370,649.95);
	this.instance_84._off = true;

	this.instance_85 = new lib.Tween120("synched",0);
	this.instance_85.setTransform(359,90.95);
	this.instance_85._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_84).wait(324).to({_off:false},0).to({_off:true,x:359,y:90.95},10).wait(1245));
	this.timeline.addTween(cjs.Tween.get(this.instance_85).wait(324).to({_off:false},10).to({y:164.95},2).wait(128).to({startPosition:0},0).to({y:145.95},4).to({y:164.95},3).wait(90).to({startPosition:0},0).to({y:149.95},4).to({y:158.95},4).to({alpha:0},2).to({_off:true},1).wait(1007));

	// olga_text
	this.text_2 = new cjs.Text("Olga", "38px 'Arial'", "#554732");
	this.text_2.lineHeight = 44;
	this.text_2.parent = this;
	this.text_2.setTransform(315,312);

	this.instance_86 = new lib.Tween151("synched",0);
	this.instance_86.setTransform(473.8,335);
	this.instance_86._off = true;

	this.instance_87 = new lib.Tween152("synched",0);
	this.instance_87.setTransform(-164.15,335);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_2}]},519).to({state:[{t:this.instance_86}]},13).to({state:[{t:this.instance_86}]},76).to({state:[{t:this.instance_87}]},97).to({state:[]},34).to({state:[]},605).wait(235));
	this.timeline.addTween(cjs.Tween.get(this.instance_86).wait(532).to({_off:false},0).to({x:193.55},76).to({_off:true,x:-164.15},97).wait(874));

	// arrow
	this.shape = new cjs.Shape();
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.5,1,0,3).moveTo(-31.5,0.5).lineTo(-20.5,11.5).moveTo(31.5,0.5).lineTo(-28.5,0.5).moveTo(-29.5,-1.5).lineTo(-19.5,-11.5);
	this.shape.setTransform(149.5,402.5);
	this.shape._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(665).to({_off:false},0).to({_off:true},74).wait(840));

	// Pavluku_text
	this.text_3 = new cjs.Text("To Pavlovku", "38px 'Arial'");
	this.text_3.lineHeight = 44;
	this.text_3.parent = this;
	this.text_3.setTransform(194,381);
	this.text_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_3).wait(625).to({_off:false},0).to({_off:true},114).wait(840));

	// flower_giant
	this.instance_88 = new lib.CachedBmp_24();
	this.instance_88.setTransform(284.25,150.3,0.5,0.5);
	this.instance_88._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_88).wait(705).to({_off:false},0).to({_off:true},32).wait(842));

	// flowers_stationary
	this.instance_89 = new lib.CachedBmp_25();
	this.instance_89.setTransform(320.85,301.75,0.5,0.5);

	this.instance_90 = new lib.CachedBmp_26();
	this.instance_90.setTransform(245.55,301.75,0.5,0.5);

	this.instance_91 = new lib.CachedBmp_27();
	this.instance_91.setTransform(200.8,301.75,0.5,0.5);

	this.instance_92 = new lib.CachedBmp_28();
	this.instance_92.setTransform(186.9,301.75,0.5,0.5);

	this.instance_93 = new lib.CachedBmp_29();
	this.instance_93.setTransform(132.05,301.75,0.5,0.5);

	this.instance_94 = new lib.CachedBmp_30();
	this.instance_94.setTransform(80.9,301.75,0.5,0.5);

	this.instance_95 = new lib.CachedBmp_31();
	this.instance_95.setTransform(36.15,301.75,0.5,0.5);

	this.instance_96 = new lib.CachedBmp_32();
	this.instance_96.setTransform(0.7,301.75,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_89}]},625).to({state:[{t:this.instance_90}]},10).to({state:[{t:this.instance_91}]},10).to({state:[{t:this.instance_92}]},10).to({state:[{t:this.instance_93}]},10).to({state:[{t:this.instance_94}]},10).to({state:[{t:this.instance_95}]},10).to({state:[{t:this.instance_96}]},10).to({state:[]},44).to({state:[]},605).wait(235));

	// flowers
	this.instance_97 = new lib.Tween155("synched",0);
	this.instance_97.setTransform(379.8,96.45);
	this.instance_97._off = true;

	this.instance_98 = new lib.Tween157("synched",0);
	this.instance_98.setTransform(394.5,101.15);
	this.instance_98._off = true;

	this.instance_99 = new lib.Tween159("synched",0);
	this.instance_99.setTransform(380.7,101.15);
	this.instance_99._off = true;

	this.instance_100 = new lib.Tween161("synched",0);
	this.instance_100.setTransform(346.7,93.5);
	this.instance_100._off = true;

	this.instance_101 = new lib.Tween163("synched",0);
	this.instance_101.setTransform(252.5,202);
	this.instance_101._off = true;

	this.instance_102 = new lib.Tween165("synched",0);
	this.instance_102.setTransform(222.5,212.15);
	this.instance_102._off = true;

	this.instance_103 = new lib.Tween166("synched",0);
	this.instance_103.setTransform(198.5,212.15);
	this.instance_103._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_97).wait(565).to({_off:false},0).to({x:344.4,y:100.5},6).to({_off:true,x:394.5,y:101.15},1).wait(1007));
	this.timeline.addTween(cjs.Tween.get(this.instance_98).wait(571).to({_off:false},1).to({x:363},7).to({_off:true,x:380.7},1).wait(999));
	this.timeline.addTween(cjs.Tween.get(this.instance_99).wait(579).to({_off:false},1).to({x:350.95},7).to({_off:true,x:346.7,y:93.5},1).wait(991));
	this.timeline.addTween(cjs.Tween.get(this.instance_100).wait(587).to({_off:false},1).to({x:309.1},11).to({_off:true,x:252.5,y:202},1).wait(979));
	this.timeline.addTween(cjs.Tween.get(this.instance_101).wait(599).to({_off:false},1).to({x:226.25},7).to({_off:true,x:222.5,y:212.15},1).wait(971));
	this.timeline.addTween(cjs.Tween.get(this.instance_102).wait(607).to({_off:false},1).to({_off:true,x:198.5},7).wait(964));
	this.timeline.addTween(cjs.Tween.get(this.instance_103).wait(608).to({_off:false},7).to({x:-167.5},90).to({_off:true},34).wait(840));

	// michail
	this.instance_104 = new lib.Michail_largeMC();
	this.instance_104.setTransform(345,303);
	this.instance_104.alpha = 0;
	this.instance_104._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_104).wait(104).to({_off:false},0).to({x:400,alpha:1},34).to({_off:true},152).wait(154).to({_off:false,regY:-3.1,scaleX:0.3589,scaleY:0.3588,x:460.9,y:196.85,alpha:0},0).to({alpha:1},20).wait(97).to({regY:-1.8,scaleY:0.3589,y:197.3},0).to({x:-81.1,y:200.3},144).to({_off:true},34).wait(840));

	// rope
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.beginFill().beginStroke("rgba(0,0,0,0.047)").setStrokeStyle(4.5,1,1).moveTo(-4.6,-137.1).curveTo(-17.6,-125.7,-17,-109.5).curveTo(-16.4,-93.4,-33.5,-42.8).curveTo(-50.7,7.8,-69.4,38.6).curveTo(-113.1,111.6,-104.4,127.2).curveTo(-95.8,142.8,-44.2,133.9).curveTo(7.4,125,24.2,111.1).curveTo(80,109.9,104.4,97.4).curveTo(105.2,97,105.9,96.6);
	this.shape_1.setTransform(392.9176,226.4671);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.beginFill().beginStroke("rgba(0,0,0,0.047)").setStrokeStyle(4.5,1,0,3).moveTo(-75.8,-116.9).curveTo(-54.7,-114.3,-33.2,-116.1).curveTo(-3.9,-113.7,40.3,-116.6).curveTo(84.4,-119.5,73.8,-56.1).curveTo(69.2,-28.8,67.5,-5.9).curveTo(65.6,21.1,67.6,42.1).curveTo(67.9,44.9,68.2,47.6).curveTo(73.3,87.8,66.2,97.5).curveTo(59.1,107.2,34.6,116.9);
	this.shape_2.setTransform(464.169,206.225);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.beginFill("rgba(85,71,50,0)").beginStroke().moveTo(-121.7,127.2).curveTo(-130.4,111.7,-86.7,38.7).curveTo(-108.2,12.2,-108.2,-1.8).curveTo(-108.2,-57.8,-74.4,-97.5).curveTo(-54.7,-120.5,-21.9,-137.1).curveTo(-34.3,-126.2,-34.3,-111).lineTo(-34.3,-109.5).lineTo(-34.3,-108.3).curveTo(-34.3,-91.5,-50.8,-42.8).curveTo(-68,7.8,-86.7,38.7).curveTo(-68,7.8,-50.8,-42.8).curveTo(-34.3,-91.5,-34.3,-108.3).lineTo(-34.3,-109.5).lineTo(-34.3,-111).curveTo(-34.3,-126.2,-21.9,-137.1).lineTo(-21.3,-137).curveTo(-9.2,-135.6,3,-135.6).lineTo(3,-135.6).lineTo(3,-135.6).curveTo(11.4,-135.6,19.8,-136.3).lineTo(20.1,-136.3).lineTo(20.7,-136.3).curveTo(60.2,-131.5,89.3,-97.5).curveTo(115.6,-66.7,121.5,-26.1).curveTo(120.5,-13,120.5,-1.4).curveTo(120.5,11,121.6,21.9).curveTo(120.5,11,120.5,-1.4).curveTo(120.5,-13,121.5,-26.1).curveTo(123.2,-14.3,123.2,-1.8).curveTo(123.2,10.4,121.6,21.9).curveTo(115.8,62.9,89.3,93.9).curveTo(86.1,97.6,87.1,97.4).lineTo(88.6,96.7).curveTo(53.1,129.8,6.9,111.1).curveTo(62.7,109.9,87.1,97.4).curveTo(62.7,109.9,6.9,111.1).curveTo(-9.9,125,-61.5,133.9).curveTo(-80.2,137.1,-93.3,137.1).curveTo(-116.2,137.1,-121.7,127.2).closePath().moveTo(121.5,-26.1).lineTo(121.5,-26.1).closePath().moveTo(3,-135.6).curveTo(-9.2,-135.6,-21.3,-137).lineTo(-21.9,-137.1).lineTo(7.5,-137.1).curveTo(14.2,-137.1,20.7,-136.3).lineTo(20.1,-136.3).lineTo(19.8,-136.3).curveTo(11.4,-135.6,3,-135.6).lineTo(3,-135.6).lineTo(3,-135.6).closePath().moveTo(-21.9,-137.1).lineTo(-21.9,-137.1).closePath();
	this.shape_3.setTransform(410.2176,226.4421);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.beginFill().beginStroke("rgba(0,0,0,0.149)").setStrokeStyle(4.5,1,1).moveTo(-4.6,-137.1).curveTo(-17.6,-125.7,-17,-109.5).curveTo(-16.4,-93.4,-33.5,-42.8).curveTo(-50.7,7.8,-69.4,38.6).curveTo(-113.1,111.6,-104.4,127.2).curveTo(-95.8,142.8,-44.2,133.9).curveTo(7.4,125,24.2,111.1).curveTo(80,109.9,104.4,97.4).curveTo(105.2,97,105.9,96.6);
	this.shape_4.setTransform(392.9176,226.4671);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.beginFill().beginStroke("rgba(0,0,0,0.149)").setStrokeStyle(4.5,1,0,3).moveTo(-75.8,-116.9).curveTo(-54.7,-114.3,-33.2,-116.1).curveTo(-3.9,-113.7,40.3,-116.6).curveTo(84.4,-119.5,73.8,-56.1).curveTo(69.2,-28.8,67.5,-5.9).curveTo(65.6,21.1,67.6,42.1).curveTo(67.9,44.9,68.2,47.6).curveTo(73.3,87.8,66.2,97.5).curveTo(59.1,107.2,34.6,116.9);
	this.shape_5.setTransform(464.169,206.225);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.beginFill().beginStroke("rgba(0,0,0,0.247)").setStrokeStyle(4.5,1,1).moveTo(-4.6,-137.1).curveTo(-17.6,-125.7,-17,-109.5).curveTo(-16.4,-93.4,-33.5,-42.8).curveTo(-50.7,7.8,-69.4,38.6).curveTo(-113.1,111.6,-104.4,127.2).curveTo(-95.8,142.8,-44.2,133.9).curveTo(7.4,125,24.2,111.1).curveTo(80,109.9,104.4,97.4).curveTo(105.2,97,105.9,96.6);
	this.shape_6.setTransform(392.9176,226.4671);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.beginFill().beginStroke("rgba(0,0,0,0.247)").setStrokeStyle(4.5,1,0,3).moveTo(-75.8,-116.9).curveTo(-54.7,-114.3,-33.2,-116.1).curveTo(-3.9,-113.7,40.3,-116.6).curveTo(84.4,-119.5,73.8,-56.1).curveTo(69.2,-28.8,67.5,-5.9).curveTo(65.6,21.1,67.6,42.1).curveTo(67.9,44.9,68.2,47.6).curveTo(73.3,87.8,66.2,97.5).curveTo(59.1,107.2,34.6,116.9);
	this.shape_7.setTransform(464.169,206.225);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.beginFill().beginStroke("rgba(0,0,0,0.4)").setStrokeStyle(4.5,1,1).moveTo(-4.6,-137.1).curveTo(-17.6,-125.7,-17,-109.5).curveTo(-16.4,-93.4,-33.5,-42.8).curveTo(-50.7,7.8,-69.4,38.6).curveTo(-113.1,111.6,-104.4,127.2).curveTo(-95.8,142.8,-44.2,133.9).curveTo(7.4,125,24.2,111.1).curveTo(80,109.9,104.4,97.4).curveTo(105.2,97,105.9,96.6);
	this.shape_8.setTransform(392.9176,226.4671);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.beginFill().beginStroke("rgba(0,0,0,0.4)").setStrokeStyle(4.5,1,0,3).moveTo(-75.8,-116.9).curveTo(-54.7,-114.3,-33.2,-116.1).curveTo(-3.9,-113.7,40.3,-116.6).curveTo(84.4,-119.5,73.8,-56.1).curveTo(69.2,-28.8,67.5,-5.9).curveTo(65.6,21.1,67.6,42.1).curveTo(67.9,44.9,68.2,47.6).curveTo(73.3,87.8,66.2,97.5).curveTo(59.1,107.2,34.6,116.9);
	this.shape_9.setTransform(464.169,206.225);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.beginFill().beginStroke("rgba(0,0,0,0.6)").setStrokeStyle(4.5,1,1).moveTo(-4.6,-137.1).curveTo(-17.6,-125.7,-17,-109.5).curveTo(-16.4,-93.4,-33.5,-42.8).curveTo(-50.7,7.8,-69.4,38.6).curveTo(-113.1,111.6,-104.4,127.2).curveTo(-95.8,142.8,-44.2,133.9).curveTo(7.4,125,24.2,111.1).curveTo(80,109.9,104.4,97.4).curveTo(105.2,97,105.9,96.6);
	this.shape_10.setTransform(392.9176,226.4671);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.beginFill().beginStroke("rgba(0,0,0,0.6)").setStrokeStyle(4.5,1,0,3).moveTo(-75.8,-116.9).curveTo(-54.7,-114.3,-33.2,-116.1).curveTo(-3.9,-113.7,40.3,-116.6).curveTo(84.4,-119.5,73.8,-56.1).curveTo(69.2,-28.8,67.5,-5.9).curveTo(65.6,21.1,67.6,42.1).curveTo(67.9,44.9,68.2,47.6).curveTo(73.3,87.8,66.2,97.5).curveTo(59.1,107.2,34.6,116.9);
	this.shape_11.setTransform(464.169,206.225);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.beginFill().beginStroke("rgba(0,0,0,0.8)").setStrokeStyle(4.5,1,1).moveTo(-4.6,-137.1).curveTo(-17.6,-125.7,-17,-109.5).curveTo(-16.4,-93.4,-33.5,-42.8).curveTo(-50.7,7.8,-69.4,38.6).curveTo(-113.1,111.6,-104.4,127.2).curveTo(-95.8,142.8,-44.2,133.9).curveTo(7.4,125,24.2,111.1).curveTo(80,109.9,104.4,97.4).curveTo(105.2,97,105.9,96.6);
	this.shape_12.setTransform(392.9176,226.4671);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.beginFill().beginStroke("rgba(0,0,0,0.8)").setStrokeStyle(4.5,1,0,3).moveTo(-75.8,-116.9).curveTo(-54.7,-114.3,-33.2,-116.1).curveTo(-3.9,-113.7,40.3,-116.6).curveTo(84.4,-119.5,73.8,-56.1).curveTo(69.2,-28.8,67.5,-5.9).curveTo(65.6,21.1,67.6,42.1).curveTo(67.9,44.9,68.2,47.6).curveTo(73.3,87.8,66.2,97.5).curveTo(59.1,107.2,34.6,116.9);
	this.shape_13.setTransform(464.169,206.225);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.beginFill().beginStroke("rgba(0,0,0,0.918)").setStrokeStyle(4.5,1,1).moveTo(-4.6,-137.1).curveTo(-17.6,-125.7,-17,-109.5).curveTo(-16.4,-93.4,-33.5,-42.8).curveTo(-50.7,7.8,-69.4,38.6).curveTo(-113.1,111.6,-104.4,127.2).curveTo(-95.8,142.8,-44.2,133.9).curveTo(7.4,125,24.2,111.1).curveTo(80,109.9,104.4,97.4).curveTo(105.2,97,105.9,96.6);
	this.shape_14.setTransform(392.9176,226.4671);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.beginFill().beginStroke("rgba(0,0,0,0.918)").setStrokeStyle(4.5,1,0,3).moveTo(-75.8,-116.9).curveTo(-54.7,-114.3,-33.2,-116.1).curveTo(-3.9,-113.7,40.3,-116.6).curveTo(84.4,-119.5,73.8,-56.1).curveTo(69.2,-28.8,67.5,-5.9).curveTo(65.6,21.1,67.6,42.1).curveTo(67.9,44.9,68.2,47.6).curveTo(73.3,87.8,66.2,97.5).curveTo(59.1,107.2,34.6,116.9);
	this.shape_15.setTransform(464.169,206.225);

	this.instance_105 = new lib.Tween153("synched",0);
	this.instance_105.setTransform(413.5,226.45);
	this.instance_105._off = true;

	this.instance_106 = new lib.Tween154("synched",0);
	this.instance_106.setTransform(-132.45,226.45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},532).to({state:[{t:this.shape_3},{t:this.shape_5},{t:this.shape_4}]},3).to({state:[{t:this.shape_3},{t:this.shape_7},{t:this.shape_6}]},5).to({state:[{t:this.shape_3},{t:this.shape_9},{t:this.shape_8}]},5).to({state:[{t:this.shape_3},{t:this.shape_11},{t:this.shape_10}]},5).to({state:[{t:this.shape_3},{t:this.shape_13},{t:this.shape_12}]},4).to({state:[{t:this.shape_3},{t:this.shape_15},{t:this.shape_14}]},3).to({state:[{t:this.instance_105}]},4).to({state:[{t:this.instance_106}]},144).to({state:[]},34).to({state:[]},605).wait(235));
	this.timeline.addTween(cjs.Tween.get(this.instance_105).wait(561).to({_off:false},0).to({_off:true,x:-132.45},144).wait(874));

	// wrong
	this.text_4 = new cjs.Text("Wrong answer!", "italic bold 25px 'Verdana'", "#FF0000");
	this.text_4.lineHeight = 32;
	this.text_4.parent = this;
	this.text_4.setTransform(77,504);

	this.instance_107 = new lib.CachedBmp_33();
	this.instance_107.setTransform(104.8,362.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_107},{t:this.text_4}]},755).to({state:[]},4).to({state:[]},611).wait(209));

	// text_question
	this.text_5 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_5.textAlign = "center";
	this.text_5.lineHeight = 56;
	this.text_5.parent = this;
	this.text_5.setTransform(194.6,55);

	this.text_6 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_6.textAlign = "center";
	this.text_6.lineHeight = 56;
	this.text_6.parent = this;
	this.text_6.setTransform(194.6,55);

	this.text_7 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_7.textAlign = "center";
	this.text_7.lineHeight = 56;
	this.text_7.parent = this;
	this.text_7.setTransform(194.6,55);

	this.text_8 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_8.textAlign = "center";
	this.text_8.lineHeight = 56;
	this.text_8.parent = this;
	this.text_8.setTransform(194.6,55);

	this.text_9 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_9.textAlign = "center";
	this.text_9.lineHeight = 56;
	this.text_9.parent = this;
	this.text_9.setTransform(194.6,55);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_5,p:{x:194.6,text:"What",lineWidth:131,y:55,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}}]},707).to({state:[{t:this.text_6,p:{x:194.6,text:"What",lineWidth:131,y:55,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_5,p:{x:410,text:"happened",lineWidth:246,y:55,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}}]},2).to({state:[{t:this.text_7,p:{x:194.6,text:"What",lineWidth:131,y:55}},{t:this.text_6,p:{x:410,text:"happened",lineWidth:246,y:55,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_5,p:{x:340.95,text:"next?",lineWidth:172,y:116,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}}]},2).to({state:[{t:this.text_8,p:{x:194.6,text:"What",lineWidth:131}},{t:this.text_7,p:{x:410,text:"happened",lineWidth:246,y:55}},{t:this.text_6,p:{x:340.95,text:"next?",lineWidth:172,y:116,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_5,p:{x:184.6,text:"They got divorced",lineWidth:185,y:215.75,font:"bold 34px 'Verdana'",color:"#996600",lineHeight:43.35}}]},24).to({state:[{t:this.text_9},{t:this.text_8,p:{x:410,text:"happened ",lineWidth:246}},{t:this.text_7,p:{x:340.95,text:"next?",lineWidth:172,y:116}},{t:this.text_6,p:{x:184.6,text:"They got divorced",lineWidth:185,y:215.75,font:"bold 34px 'Verdana'",color:"#996600",lineHeight:43.35}},{t:this.text_5,p:{x:516.35,text:"They lived happily together",lineWidth:225,y:215.75,font:"bold 34px 'Verdana'",color:"#996600",lineHeight:43.35}}]},2).to({state:[]},22).to({state:[]},611).wait(209));

	// button_wrong
	this.button4_wrong = new lib.button_nar1();
	this.button4_wrong.name = "button4_wrong";
	this.button4_wrong.setTransform(169.5,425.5);
	this.button4_wrong._off = true;
	new cjs.ButtonHelper(this.button4_wrong, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button4_wrong).wait(739).to({_off:false},0).to({_off:true},20).wait(820));

	// button
	this.button4 = new lib.button_nar1();
	this.button4.name = "button4";
	this.button4.setTransform(494.45,425);
	this.button4._off = true;
	new cjs.ButtonHelper(this.button4, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button4).wait(741).to({_off:false},0).to({_off:true},18).wait(820));

	// title
	this.text_10 = new cjs.Text("Michail's and Olga's children", "italic bold 34px 'Verdana'");
	this.text_10.lineHeight = 43;
	this.text_10.parent = this;
	this.text_10.setTransform(62.15,17);
	this.text_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_10).wait(764).to({_off:false},0).to({_off:true},158).wait(657));

	// vlad_text
	this.text_11 = new cjs.Text("Vladimir Michailovics", "italic bold 24px 'Verdana'", "#993300");
	this.text_11.lineHeight = 31;
	this.text_11.parent = this;
	this.text_11.setTransform(27.6,275.95);
	this.text_11._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_11).wait(884).to({_off:false},0).wait(38).to({_off:true},37).wait(620));

	// vlad
	this.instance_108 = new lib.vladMC();
	this.instance_108.setTransform(108.95,173.5);
	this.instance_108.alpha = 0;
	this.instance_108._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_108).wait(854).to({_off:false},0).to({alpha:1},30).wait(38).to({alpha:0},37).to({_off:true},1).wait(619));

	// lev_text
	this.text_12 = new cjs.Text("Lev Michailovics", "italic bold 24px 'Verdana'", "#993300");
	this.text_12.lineHeight = 31;
	this.text_12.parent = this;
	this.text_12.setTransform(57.2,329.25);
	this.text_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_12).wait(859).to({_off:false},0).wait(63).to({_off:true},37).wait(620));

	// lev2
	this.instance_109 = new lib.lev2MC();
	this.instance_109.setTransform(-82.95,533);
	this.instance_109._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_109).wait(829).to({_off:false},0).to({x:284.2,y:460.65},30).wait(63).to({alpha:0},37).to({_off:true},1).wait(619));

	// lev1
	this.instance_110 = new lib.lev1MC();
	this.instance_110.setTransform(106.4,474.9,0.146,0.146,0,0,0,-7.2,-3.8);
	this.instance_110.alpha = 0;
	this.instance_110._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_110).wait(804).to({_off:false},0).to({regX:-3.5,regY:-4.7,scaleX:0.216,scaleY:0.216,x:107.55,y:474.45,alpha:1},30).to({regX:-6,x:106.6,y:474.4},88).to({regX:0,regY:-4.4,scaleX:0.1499,scaleY:0.1499,x:108.8,y:474.8,alpha:0},37).to({_off:true},1).wait(619));

	// aleksej_text
	this.text_13 = new cjs.Text("Aleksej Michailovics", "italic bold 24px 'Verdana'", "#993300");
	this.text_13.lineHeight = 31;
	this.text_13.parent = this;
	this.text_13.setTransform(355.3,276);
	this.text_13._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_13).wait(784).to({_off:false},0).wait(138).to({_off:true},37).wait(620));

	// aleksej2_
	this.instance_111 = new lib.aleksej2MC();
	this.instance_111.setTransform(760,486.5);
	this.instance_111._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_111).wait(779).to({_off:false},0).to({x:280.7,y:169.8},30).wait(113).to({alpha:0},37).to({_off:true},1).wait(619));

	// aleksej1_michailovic
	this.instance_112 = new lib.aleksej_michailovicsMC();
	this.instance_112.setTransform(497.15,156.3);
	this.instance_112.alpha = 0;
	this.instance_112._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_112).wait(760).to({_off:false},0).to({alpha:1},24).wait(138).to({alpha:0},37).to({_off:true},1).wait(619));

	// horses
	this.instance_113 = new lib.Tween173("synched",0);
	this.instance_113.setTransform(502.95,710.95);
	this.instance_113._off = true;

	this.instance_114 = new lib.Tween172("synched",0);
	this.instance_114.setTransform(482.95,621.95);
	this.instance_114._off = true;

	this.instance_115 = new lib.Tween171("synched",0);
	this.instance_115.setTransform(482.95,642.95);
	this.instance_115._off = true;

	this.instance_116 = new lib.Tween170("synched",0);
	this.instance_116.setTransform(454,551.95);
	this.instance_116._off = true;

	this.instance_117 = new lib.Tween169("synched",0);
	this.instance_117.setTransform(454,571.95);
	this.instance_117._off = true;

	this.instance_118 = new lib.Tween167("synched",0);
	this.instance_118.setTransform(434,506.95);
	this.instance_118._off = true;

	this.instance_119 = new lib.Tween168("synched",0);
	this.instance_119.setTransform(434,528.95);
	this.instance_119._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_113).wait(907).to({_off:false},0).to({_off:true,x:482.95,y:621.95},7).wait(665));
	this.timeline.addTween(cjs.Tween.get(this.instance_114).wait(907).to({_off:false},7).to({_off:true,y:642.95},7).wait(658));
	this.timeline.addTween(cjs.Tween.get(this.instance_115).wait(914).to({_off:false},7).to({_off:true,x:454,y:551.95},7).wait(651));
	this.timeline.addTween(cjs.Tween.get(this.instance_116).wait(921).to({_off:false},7).to({_off:true,y:571.95},6).wait(645));
	this.timeline.addTween(cjs.Tween.get(this.instance_117).wait(928).to({_off:false},6).to({_off:true,x:434,y:506.95},7).wait(638));
	this.timeline.addTween(cjs.Tween.get(this.instance_118).wait(934).to({_off:false},7).to({_off:true,y:528.95},8).wait(630));
	this.timeline.addTween(cjs.Tween.get(this.instance_119).wait(941).to({_off:false},8).to({x:418,y:482},7).to({y:510},8).to({x:382.2,y:459.4},7).to({y:486},8).to({x:359.6,y:459.65},7).to({y:486.25},8).to({x:338.85,y:461.75},8).to({y:488.35},7).to({x:318.1,y:463.9},8).to({y:481},7).to({y:462.15},7).to({y:490.65},8).to({y:460.5},8).to({y:492.8},7).to({y:460.8},7).to({y:479.8},8).to({y:462.85},7).to({y:487.55},8).to({y:461.2},7).to({y:487.8},8).to({y:459.55},7).to({y:478.55},8).to({y:459.75},7).to({y:478.75},8).to({y:463.7,alpha:0.8008},7).to({y:488.4,alpha:0.6016},8).to({y:465.8,alpha:0.3906},7).to({y:492.4,alpha:0.1914},8).to({alpha:0},5).to({_off:true},1).wait(414));

	// snow
	this.instance_120 = new lib.snowMC();
	this.instance_120.setTransform(322,310.55,1.9115,1.9114,0,0,0,0,-2);
	this.instance_120.alpha = 0;
	this.instance_120._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_120).wait(894).to({_off:false},0).to({alpha:1},28).to({regX:-0.2,regY:-6,scaleX:2.2133,scaleY:2.2083,x:321.25,y:351.05},42).to({regX:-0.5,regY:-7.2,scaleX:2.6157,scaleY:2.6096,x:319.75,y:413.9},30).to({regY:-7.7,scaleX:3.0181,scaleY:3.011,x:319.95,y:475.05},45).to({regX:-0.6,regY:-8.2,scaleX:3.4205,scaleY:3.4124,x:319.35,y:535},45).to({regX:-0.5,regY:-8.3,scaleX:3.8229,scaleY:3.8138,x:319.6,y:592.35,alpha:0},45).to({_off:true},36).wait(414));

	// Anna_text
	this.text_14 = new cjs.Text("Anna Zemchuznikov", "italic bold 24px 'Verdana'");
	this.text_14.lineHeight = 31;
	this.text_14.parent = this;
	this.text_14.setTransform(53.75,100.05);

	this.text_15 = new cjs.Text("Anna Zemchuznikov", "italic bold 24px 'Verdana'");
	this.text_15.lineHeight = 31;
	this.text_15.parent = this;
	this.text_15.setTransform(53.75,100.05);

	this.text_16 = new cjs.Text("Anna Zemchuznikov", "italic bold 24px 'Verdana'");
	this.text_16.lineHeight = 31;
	this.text_16.parent = this;
	this.text_16.setTransform(53.75,100.05);

	this.text_17 = new cjs.Text("Anna Zemchuznikov", "italic bold 24px 'Verdana'");
	this.text_17.lineHeight = 31;
	this.text_17.parent = this;
	this.text_17.setTransform(53.75,100.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_14,p:{x:53.75,y:100.05,text:"Anna Zemchuznikov",lineWidth:271}}]},1230).to({state:[{t:this.text_15,p:{x:53.75,y:100.05,text:"Anna Zemchuznikov",lineWidth:271}},{t:this.text_14,p:{x:331.95,y:100.3,text:"+",lineWidth:21}}]},29).to({state:[{t:this.text_16,p:{x:53.75,y:100.05,text:"Anna Zemchuznikov",lineWidth:271}},{t:this.text_15,p:{x:331.95,y:100.3,text:"+",lineWidth:21}},{t:this.text_14,p:{x:361.5,y:100.3,text:"Viktors",lineWidth:96}}]},21).to({state:[{t:this.text_17},{t:this.text_16,p:{x:331.95,y:100.3,text:"+",lineWidth:21}},{t:this.text_15,p:{x:361.5,y:100.3,text:"Viktors",lineWidth:96}},{t:this.text_14,p:{x:466.2,y:100.3,text:"Arcimovics",lineWidth:147}}]},19).to({state:[]},56).wait(224));

	// Anna
	this.instance_121 = new lib.Anna_viktorwifeMC();
	this.instance_121.setTransform(215.15,302.05);
	this.instance_121.alpha = 0;
	this.instance_121._off = true;

	this.instance_122 = new lib.Anna_daughterMC();
	this.instance_122.setTransform(330,302.05);
	this.instance_122.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_121}]},1165).to({state:[{t:this.instance_121}]},65).to({state:[{t:this.instance_121}]},80).to({state:[{t:this.instance_122}]},44).to({state:[]},1).wait(224));
	this.timeline.addTween(cjs.Tween.get(this.instance_121).wait(1165).to({_off:false},0).to({x:185.9,alpha:1},65).wait(80).to({_off:true,x:330,alpha:0},44).wait(225));

	// viktors
	this.instance_123 = new lib.viktors_framedMC();
	this.instance_123.setTransform(467.8,298.05);
	this.instance_123.alpha = 0;
	this.instance_123._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_123).wait(1230).to({_off:false},0).to({alpha:1},80).to({x:330,alpha:0},44).to({_off:true},1).wait(224));

	// notes
	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-5,13.8).lineTo(-5,-13.8).curveTo(-4.9,-11.1,-2.1,-9.1).curveTo(0.9,-7,5.1,-7);
	this.shape_16.setTransform(160.95,338.375);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.beginFill("#000000").beginStroke().moveTo(-4.5,3.3).lineTo(-5,1).curveTo(-5,0.2,-4.8,-0.4).lineTo(-4.8,-0.5).lineTo(-5,-1).curveTo(-5,-3.4,-3.5,-4.8).curveTo(-2.1,-6,0,-6).curveTo(2,-6,3.4,-4.8).curveTo(4.9,-3.4,5,-1.1).lineTo(5,-0.8).lineTo(4.9,-0.1).lineTo(5,0.9).lineTo(5,1).curveTo(5,2.6,4,4).curveTo(2.6,6,0,6).curveTo(-3.3,6,-4.5,3.3).closePath();
	this.shape_17.setTransform(150.9,353.325);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-92,-40.2).lineTo(-92,-67.8).curveTo(-91.9,-65.1,-89.1,-63.1).curveTo(-86.1,-61,-81.9,-61).moveTo(81.9,67.9).lineTo(81.9,40.2).curveTo(82.1,43,84.9,45).curveTo(87.9,47,92.1,47);
	this.shape_18.setTransform(247.95,392.4);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.beginFill("#000000").beginStroke().moveTo(82.6,57.3).lineTo(82,55.1).curveTo(82,54.2,82.2,53.6).lineTo(82.2,53.5).lineTo(82,53.1).curveTo(82,50.6,83.6,49.2).curveTo(84.9,48,87,48).curveTo(89.1,48,90.4,49.2).curveTo(91.9,50.6,92,52.9).lineTo(92,53.2).lineTo(91.9,54).lineTo(92,54.9).lineTo(92,55.1).curveTo(92,56.6,91,58).curveTo(89.6,60.1,87,60).curveTo(83.7,60,82.6,57.3).closePath().moveTo(-91.5,-50.8).lineTo(-92,-53).curveTo(-92,-53.8,-91.8,-54.5).lineTo(-91.8,-54.5).lineTo(-92,-55).curveTo(-92,-57.4,-90.5,-58.8).curveTo(-89.1,-60,-87,-60).curveTo(-85,-60,-83.6,-58.8).curveTo(-82.1,-57.4,-82,-55.2).lineTo(-82,-54.8).lineTo(-82.1,-54.1).lineTo(-82,-53.1).lineTo(-82,-53).curveTo(-82,-51.5,-83,-50).curveTo(-84.4,-48,-87,-48).curveTo(-90.3,-48,-91.5,-50.8).closePath();
	this.shape_19.setTransform(237.9,407.35);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-92,-40.2).lineTo(-92,-67.8).curveTo(-91.9,-65.1,-89.1,-63.1).curveTo(-86.1,-61,-81.9,-61).moveTo(26.9,-23.1).lineTo(26.9,-50.8).curveTo(27.1,-48,29.9,-46).curveTo(32.9,-44,37.1,-44).moveTo(81.9,67.9).lineTo(81.9,40.2).curveTo(82.1,43,84.9,45).curveTo(87.9,47,92.1,47);
	this.shape_20.setTransform(247.95,392.4);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.beginFill("#000000").beginStroke().moveTo(82.6,57.3).lineTo(82,55.1).curveTo(82,54.2,82.2,53.6).lineTo(82.2,53.5).lineTo(82,53.1).curveTo(82,50.6,83.6,49.2).curveTo(84.9,48,87,48).curveTo(89.1,48,90.4,49.2).curveTo(91.9,50.6,92,52.9).lineTo(92,53.2).lineTo(91.9,54).lineTo(92,54.9).lineTo(92,55.1).curveTo(92,56.6,91,58).curveTo(89.6,60.1,87,60).curveTo(83.7,60,82.6,57.3).closePath().moveTo(27.5,-33.7).lineTo(27,-35.9).curveTo(27,-36.8,27.2,-37.4).lineTo(27.2,-37.5).lineTo(27,-38).curveTo(27,-40.4,28.6,-41.8).curveTo(29.9,-43,32,-43).curveTo(34,-43,35.4,-41.8).curveTo(36.9,-40.4,37,-38.1).lineTo(37,-37.8).lineTo(36.9,-37.1).lineTo(37,-36.1).lineTo(37,-35.9).curveTo(37,-34.4,36,-33).curveTo(34.6,-31,32,-31).curveTo(28.7,-30.9,27.5,-33.7).closePath().moveTo(-91.5,-50.8).lineTo(-92,-53).curveTo(-92,-53.8,-91.8,-54.5).lineTo(-91.8,-54.5).lineTo(-92,-55).curveTo(-92,-57.4,-90.5,-58.8).curveTo(-89.1,-60,-87,-60).curveTo(-85,-60,-83.6,-58.8).curveTo(-82.1,-57.4,-82,-55.2).lineTo(-82,-54.8).lineTo(-82.1,-54.1).lineTo(-82,-53.1).lineTo(-82,-53).curveTo(-82,-51.5,-83,-50).curveTo(-84.4,-48,-87,-48).curveTo(-90.3,-48,-91.5,-50.8).closePath();
	this.shape_21.setTransform(237.9,407.35);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(91.9,-49.2).lineTo(91.9,-76.8).curveTo(92.1,-74.1,94.9,-72.1).curveTo(97.9,-70,102.1,-70).moveTo(-102,-31.2).lineTo(-102,-58.9).curveTo(-101.9,-56.1,-99.1,-54.1).curveTo(-96.1,-52.1,-91.9,-52.1).moveTo(16.9,-14.2).lineTo(16.9,-41.8).curveTo(17.1,-39.1,19.9,-37.1).curveTo(22.9,-35,27.1,-35).moveTo(71.9,76.8).lineTo(71.9,49.2).curveTo(72.1,51.9,74.9,53.9).curveTo(77.9,56,82.1,56);
	this.shape_22.setTransform(257.95,383.425);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.beginFill("#000000").beginStroke().moveTo(72.6,66.3).lineTo(72,64).curveTo(72,63.2,72.2,62.6).lineTo(72.2,62.5).lineTo(72,62).curveTo(72,59.6,73.6,58.2).curveTo(74.9,57,77,57).curveTo(79.1,57,80.4,58.2).curveTo(81.9,59.6,82,61.9).lineTo(82,62.2).lineTo(81.9,62.9).lineTo(82,63.9).lineTo(82,64).curveTo(82,65.6,81,67).curveTo(79.6,69,77,69).curveTo(73.7,69,72.6,66.3).closePath().moveTo(17.5,-24.7).lineTo(17,-27).curveTo(17,-27.8,17.2,-28.4).lineTo(17.2,-28.5).lineTo(17,-29).curveTo(17,-31.4,18.6,-32.8).curveTo(19.9,-34,22,-34).curveTo(24,-34,25.4,-32.8).curveTo(26.9,-31.4,27,-29.1).lineTo(27,-28.8).lineTo(26.9,-28.1).lineTo(27,-27.1).lineTo(27,-27).curveTo(27,-25.4,26,-24).curveTo(24.6,-22,22,-22).curveTo(18.7,-22,17.5,-24.7).closePath().moveTo(-101.5,-41.8).lineTo(-102,-44).curveTo(-102,-44.8,-101.8,-45.5).lineTo(-101.8,-45.5).lineTo(-102,-46).curveTo(-102,-48.4,-100.5,-49.8).curveTo(-99.1,-51.1,-97,-51.1).curveTo(-95,-51.1,-93.6,-49.8).curveTo(-92.1,-48.5,-92,-46.2).lineTo(-92,-45.9).lineTo(-92.1,-45.1).lineTo(-92,-44.2).lineTo(-92,-44).curveTo(-92,-42.5,-93,-41).curveTo(-94.4,-39,-97,-39).curveTo(-100.3,-39,-101.5,-41.8).closePath().moveTo(92.6,-59.7).lineTo(92,-62).curveTo(92,-62.8,92.2,-63.4).lineTo(92.2,-63.5).lineTo(92,-64).curveTo(92,-66.4,93.6,-67.8).curveTo(95,-69,97,-69).curveTo(99,-69,100.5,-67.8).curveTo(102,-66.4,102,-64.1).lineTo(102,-63.8).lineTo(101.9,-63.1).lineTo(102,-62.1).lineTo(102,-62).curveTo(102,-60.4,101,-59).curveTo(99.6,-57,97,-57).curveTo(93.8,-57,92.6,-59.7).closePath();
	this.shape_23.setTransform(247.9,398.375);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(60.5,-49.2).lineTo(60.5,-76.8).curveTo(60.6,-74.1,63.4,-72.1).curveTo(66.4,-70,70.6,-70).moveTo(123.4,-14.4).lineTo(123.4,-42).curveTo(123.5,-39.3,126.4,-37.3).curveTo(129.3,-35.2,133.5,-35.2).moveTo(-133.5,-31.2).lineTo(-133.5,-58.9).curveTo(-133.4,-56.1,-130.6,-54.1).curveTo(-127.6,-52.1,-123.4,-52.1).moveTo(-14.5,-14.2).lineTo(-14.5,-41.8).curveTo(-14.4,-39.1,-11.6,-37.1).curveTo(-8.6,-35,-4.4,-35).moveTo(40.5,76.8).lineTo(40.5,49.2).curveTo(40.6,51.9,43.4,53.9).curveTo(46.4,56,50.6,56);
	this.shape_24.setTransform(289.425,383.425);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.beginFill("#000000").beginStroke().moveTo(41.1,66.3).lineTo(40.5,64).curveTo(40.5,63.2,40.7,62.6).lineTo(40.7,62.5).lineTo(40.5,62).curveTo(40.5,59.6,42.1,58.2).curveTo(43.5,57,45.5,57).curveTo(47.6,57,49,58.2).curveTo(50.5,59.6,50.5,61.9).lineTo(50.5,62.2).lineTo(50.4,62.9).lineTo(50.5,63.9).lineTo(50.5,64).curveTo(50.5,65.6,49.5,67).curveTo(48.1,69,45.5,69).curveTo(42.3,69,41.1,66.3).closePath().moveTo(-13.9,-24.7).lineTo(-14.5,-27).curveTo(-14.5,-27.8,-14.3,-28.4).lineTo(-14.3,-28.5).lineTo(-14.5,-29).curveTo(-14.5,-31.4,-12.9,-32.8).curveTo(-11.5,-34,-9.5,-34).curveTo(-7.4,-34,-6,-32.8).curveTo(-4.5,-31.4,-4.5,-29.1).lineTo(-4.5,-28.8).lineTo(-4.6,-28.1).lineTo(-4.5,-27.1).lineTo(-4.5,-27).curveTo(-4.5,-25.4,-5.5,-24).curveTo(-6.9,-22,-9.5,-22).curveTo(-12.7,-22,-13.9,-24.7).closePath().moveTo(124,-24.9).lineTo(123.5,-27.2).curveTo(123.5,-28,123.7,-28.6).lineTo(123.7,-28.7).lineTo(123.5,-29.2).curveTo(123.5,-31.6,125,-33).curveTo(126.4,-34.2,128.5,-34.2).curveTo(130.5,-34.2,131.9,-33).curveTo(133.4,-31.6,133.5,-29.3).lineTo(133.5,-29).lineTo(133.4,-28.3).lineTo(133.5,-27.3).lineTo(133.5,-27.2).curveTo(133.5,-25.6,132.5,-24.2).curveTo(131.1,-22.2,128.5,-22.2).curveTo(125.2,-22.2,124,-24.9).closePath().moveTo(-132.9,-41.8).lineTo(-133.5,-44).curveTo(-133.5,-44.8,-133.3,-45.5).lineTo(-133.3,-45.5).lineTo(-133.5,-46).curveTo(-133.5,-48.4,-131.9,-49.8).curveTo(-130.5,-51.1,-128.5,-51.1).curveTo(-126.4,-51.1,-125,-49.8).curveTo(-123.5,-48.5,-123.5,-46.2).lineTo(-123.5,-45.9).lineTo(-123.6,-45.1).lineTo(-123.5,-44.2).lineTo(-123.5,-44).curveTo(-123.5,-42.5,-124.5,-41).curveTo(-125.9,-39,-128.5,-39).curveTo(-131.7,-39,-132.9,-41.8).closePath().moveTo(61.1,-59.7).lineTo(60.5,-62).curveTo(60.5,-62.8,60.7,-63.4).lineTo(60.7,-63.5).lineTo(60.5,-64).curveTo(60.5,-66.4,62.1,-67.8).curveTo(63.5,-69,65.5,-69).curveTo(67.6,-69,69,-67.8).curveTo(70.5,-66.4,70.5,-64.1).lineTo(70.5,-63.8).lineTo(70.4,-63.1).lineTo(70.5,-62.1).lineTo(70.5,-62).curveTo(70.5,-60.4,69.5,-59).curveTo(68.1,-57,65.5,-57).curveTo(62.3,-57,61.1,-59.7).closePath();
	this.shape_25.setTransform(279.375,398.375);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(56.9,-49.2).lineTo(56.9,-76.8).curveTo(57.1,-74.1,59.9,-72.1).curveTo(62.9,-70,67.1,-70).moveTo(119.9,-14.4).lineTo(119.9,-42).curveTo(120,-39.3,122.9,-37.3).curveTo(125.8,-35.2,130,-35.2).moveTo(-137,-31.2).lineTo(-137,-58.9).curveTo(-136.9,-56.1,-134.1,-54.1).curveTo(-131.1,-52.1,-126.9,-52.1).moveTo(-18.1,-14.2).lineTo(-18.1,-41.8).curveTo(-17.9,-39.1,-15.1,-37.1).curveTo(-12.1,-35,-7.9,-35).moveTo(126.9,48.8).lineTo(126.9,21.2).curveTo(127.1,23.9,129.9,25.9).curveTo(132.9,28,137.1,28).moveTo(36.9,76.8).lineTo(36.9,49.2).curveTo(37.1,51.9,39.9,53.9).curveTo(42.9,56,47.1,56);
	this.shape_26.setTransform(292.95,383.425);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.beginFill("#000000").beginStroke().moveTo(37.6,66.3).lineTo(37,64).curveTo(37,63.2,37.2,62.6).lineTo(37.2,62.5).lineTo(37,62).curveTo(37,59.6,38.6,58.2).curveTo(39.9,57,42,57).curveTo(44.1,57,45.4,58.2).curveTo(46.9,59.6,47,61.9).lineTo(47,62.2).lineTo(46.9,62.9).lineTo(47,63.9).lineTo(47,64).curveTo(47,65.6,46,67).curveTo(44.6,69,42,69).curveTo(38.7,69,37.6,66.3).closePath().moveTo(127.6,38.3).lineTo(127,36).curveTo(127,35.2,127.2,34.6).lineTo(127.2,34.5).lineTo(127,34).curveTo(127,31.6,128.6,30.2).curveTo(129.9,29,132,29).curveTo(134.1,29,135.4,30.2).curveTo(137,31.6,137,33.9).lineTo(137,34.2).lineTo(136.9,34.9).lineTo(137,35.9).lineTo(137,36).curveTo(137,37.6,136,39).curveTo(134.6,41,132,41).curveTo(128.7,41,127.6,38.3).closePath().moveTo(-17.5,-24.7).lineTo(-18,-27).curveTo(-18,-27.8,-17.8,-28.4).lineTo(-17.8,-28.5).lineTo(-18,-29).curveTo(-18,-31.4,-16.4,-32.8).curveTo(-15.1,-34,-13,-34).curveTo(-11,-34,-9.6,-32.8).curveTo(-8.1,-31.4,-8,-29.1).lineTo(-8,-28.8).lineTo(-8.1,-28.1).lineTo(-8,-27.1).lineTo(-8,-27).curveTo(-8,-25.4,-9,-24).curveTo(-10.4,-22,-13,-22).curveTo(-16.3,-22,-17.5,-24.7).closePath().moveTo(120.5,-24.9).lineTo(119.9,-27.2).curveTo(119.9,-28,120.1,-28.6).lineTo(120.1,-28.7).lineTo(119.9,-29.2).curveTo(120,-31.6,121.5,-33).curveTo(122.9,-34.2,125,-34.2).curveTo(127,-34.2,128.4,-33).curveTo(129.9,-31.6,129.9,-29.3).lineTo(129.9,-29).lineTo(129.8,-28.3).lineTo(129.9,-27.3).lineTo(129.9,-27.2).curveTo(130,-25.6,128.9,-24.2).curveTo(127.6,-22.2,125,-22.2).curveTo(121.7,-22.2,120.5,-24.9).closePath().moveTo(-136.5,-41.8).lineTo(-137,-44).curveTo(-137,-44.8,-136.8,-45.5).lineTo(-136.8,-45.5).lineTo(-137,-46).curveTo(-137,-48.4,-135.5,-49.8).curveTo(-134.1,-51.1,-132,-51.1).curveTo(-130,-51.1,-128.6,-49.8).curveTo(-127.1,-48.5,-127,-46.2).lineTo(-127,-45.9).lineTo(-127.1,-45.1).lineTo(-127,-44.2).lineTo(-127,-44).curveTo(-127,-42.5,-128,-41).curveTo(-129.4,-39,-132,-39).curveTo(-135.3,-39,-136.5,-41.8).closePath().moveTo(57.6,-59.7).lineTo(57,-62).curveTo(57,-62.8,57.2,-63.4).lineTo(57.2,-63.5).lineTo(57,-64).curveTo(57,-66.4,58.6,-67.8).curveTo(60,-69,62,-69).curveTo(64,-69,65.5,-67.8).curveTo(67,-66.4,67,-64.1).lineTo(67,-63.8).lineTo(66.9,-63.1).lineTo(67,-62.1).lineTo(67,-62).curveTo(67,-60.4,66,-59).curveTo(64.6,-57,62,-57).curveTo(58.8,-57,57.6,-59.7).closePath();
	this.shape_27.setTransform(282.9,398.375);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(126.9,-76.2).lineTo(126.9,-103.8).curveTo(127.1,-101.1,129.9,-99.1).curveTo(132.9,-97,137.1,-97).moveTo(56.9,-22.2).lineTo(56.9,-49.8).curveTo(57.1,-47.1,59.9,-45.1).curveTo(62.9,-43,67.1,-43).moveTo(119.9,12.6).lineTo(119.9,-15).curveTo(120,-12.3,122.9,-10.3).curveTo(125.8,-8.2,130,-8.2).moveTo(-137,-4.2).lineTo(-137,-31.9).curveTo(-136.9,-29.1,-134.1,-27.1).curveTo(-131.1,-25.1,-126.9,-25.1).moveTo(-18.1,12.8).lineTo(-18.1,-14.8).curveTo(-17.9,-12.1,-15.1,-10.1).curveTo(-12.1,-8,-7.9,-8).moveTo(126.9,75.8).lineTo(126.9,48.2).curveTo(127.1,50.9,129.9,52.9).curveTo(132.9,55,137.1,55).moveTo(36.9,103.8).lineTo(36.9,76.2).curveTo(37.1,78.9,39.9,80.9).curveTo(42.9,83,47.1,83);
	this.shape_28.setTransform(292.95,356.425);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.beginFill("#000000").beginStroke().moveTo(37.6,93.3).lineTo(37,91).curveTo(37,90.2,37.2,89.6).lineTo(37.2,89.5).lineTo(37,89).curveTo(37,86.6,38.6,85.2).curveTo(39.9,84,42,84).curveTo(44.1,84,45.4,85.2).curveTo(46.9,86.6,47,88.9).lineTo(47,89.2).lineTo(46.9,89.9).lineTo(47,90.9).lineTo(47,91).curveTo(47,92.6,46,94).curveTo(44.6,96,42,96).curveTo(38.7,96,37.6,93.3).closePath().moveTo(127.6,65.3).lineTo(127,63).curveTo(127,62.2,127.2,61.6).lineTo(127.2,61.5).lineTo(127,61).curveTo(127,58.6,128.6,57.2).curveTo(129.9,56,132,56).curveTo(134.1,56,135.4,57.2).curveTo(137,58.6,137,60.9).lineTo(137,61.2).lineTo(136.9,61.9).lineTo(137,62.9).lineTo(137,63).curveTo(137,64.6,136,66).curveTo(134.6,68,132,68).curveTo(128.7,68,127.6,65.3).closePath().moveTo(-17.5,2.3).lineTo(-18,0).curveTo(-18,-0.8,-17.8,-1.4).lineTo(-17.8,-1.5).lineTo(-18,-2).curveTo(-18,-4.4,-16.4,-5.8).curveTo(-15.1,-7,-13,-7).curveTo(-11,-7,-9.6,-5.8).curveTo(-8.1,-4.4,-8,-2.1).lineTo(-8,-1.8).lineTo(-8.1,-1.1).lineTo(-8,-0.1).lineTo(-8,0).curveTo(-8,1.6,-9,3).curveTo(-10.4,5,-13,5).curveTo(-16.3,5,-17.5,2.3).closePath().moveTo(120.5,2.1).lineTo(119.9,-0.2).curveTo(119.9,-1,120.1,-1.6).lineTo(120.1,-1.7).lineTo(119.9,-2.2).curveTo(120,-4.6,121.5,-6).curveTo(122.9,-7.2,125,-7.2).curveTo(127,-7.2,128.4,-6).curveTo(129.9,-4.6,129.9,-2.3).lineTo(129.9,-2).lineTo(129.8,-1.3).lineTo(129.9,-0.3).lineTo(129.9,-0.2).curveTo(130,1.4,128.9,2.8).curveTo(127.6,4.8,125,4.8).curveTo(121.7,4.8,120.5,2.1).closePath().moveTo(-136.5,-14.8).lineTo(-137,-17).curveTo(-137,-17.8,-136.8,-18.5).lineTo(-136.8,-18.5).lineTo(-137,-19).curveTo(-137,-21.4,-135.5,-22.8).curveTo(-134.1,-24.1,-132,-24.1).curveTo(-130,-24.1,-128.6,-22.8).curveTo(-127.1,-21.5,-127,-19.2).lineTo(-127,-18.9).lineTo(-127.1,-18.1).lineTo(-127,-17.2).lineTo(-127,-17).curveTo(-127,-15.5,-128,-14).curveTo(-129.4,-12,-132,-12).curveTo(-135.3,-12,-136.5,-14.8).closePath().moveTo(57.6,-32.7).lineTo(57,-35).curveTo(57,-35.8,57.2,-36.4).lineTo(57.2,-36.5).lineTo(57,-37).curveTo(57,-39.4,58.6,-40.8).curveTo(60,-42,62,-42).curveTo(64,-42,65.5,-40.8).curveTo(67,-39.4,67,-37.1).lineTo(67,-36.8).lineTo(66.9,-36.1).lineTo(67,-35.1).lineTo(67,-35).curveTo(67,-33.4,66,-32).curveTo(64.6,-30,62,-30).curveTo(58.8,-30,57.6,-32.7).closePath().moveTo(127.6,-86.7).lineTo(127,-89).curveTo(127,-89.8,127.2,-90.4).lineTo(127.2,-90.5).lineTo(127,-91).curveTo(127,-93.4,128.6,-94.8).curveTo(129.9,-96,132,-96).curveTo(134.1,-96,135.4,-94.8).curveTo(137,-93.4,137,-91.1).lineTo(137,-90.8).lineTo(136.9,-90.1).lineTo(137,-89.1).lineTo(137,-89).curveTo(137,-87.4,136,-86).curveTo(134.6,-84,132,-84).curveTo(128.7,-84,127.6,-86.7).closePath();
	this.shape_29.setTransform(282.9,371.375);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(126.9,-51.7).lineTo(126.9,-79.3).curveTo(127.1,-76.6,129.9,-74.6).curveTo(132.9,-72.5,137.1,-72.5).moveTo(56.9,2.3).lineTo(56.9,-25.3).curveTo(57.1,-22.6,59.9,-20.6).curveTo(62.9,-18.5,67.1,-18.5).moveTo(119.9,37.1).lineTo(119.9,9.5).curveTo(120,12.2,122.9,14.2).curveTo(125.8,16.3,130,16.3).moveTo(-137,20.3).lineTo(-137,-7.4).curveTo(-136.9,-4.6,-134.1,-2.6).curveTo(-131.1,-0.6,-126.9,-0.6).moveTo(10.9,-100.7).lineTo(10.9,-128.3).curveTo(11.1,-125.6,13.9,-123.6).curveTo(16.9,-121.5,21.1,-121.5).moveTo(-18.1,37.3).lineTo(-18.1,9.7).curveTo(-17.9,12.4,-15.1,14.4).curveTo(-12.1,16.5,-7.9,16.5).moveTo(126.9,100.3).lineTo(126.9,72.7).curveTo(127.1,75.4,129.9,77.4).curveTo(132.9,79.5,137.1,79.5).moveTo(36.9,128.3).lineTo(36.9,100.7).curveTo(37.1,103.4,39.9,105.4).curveTo(42.9,107.5,47.1,107.5);
	this.shape_30.setTransform(292.95,331.925);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.beginFill("#000000").beginStroke().moveTo(37.6,117.8).lineTo(37,115.5).curveTo(37,114.7,37.2,114.1).lineTo(37.2,114).lineTo(37,113.5).curveTo(37,111.1,38.6,109.7).curveTo(39.9,108.5,42,108.5).curveTo(44.1,108.5,45.4,109.7).curveTo(46.9,111.1,47,113.4).lineTo(47,113.7).lineTo(46.9,114.4).lineTo(47,115.4).lineTo(47,115.5).curveTo(47,117.1,46,118.5).curveTo(44.6,120.5,42,120.5).curveTo(38.7,120.5,37.6,117.8).closePath().moveTo(127.6,89.8).lineTo(127,87.5).curveTo(127,86.7,127.2,86.1).lineTo(127.2,86).lineTo(127,85.5).curveTo(127,83.1,128.6,81.7).curveTo(129.9,80.5,132,80.5).curveTo(134.1,80.5,135.4,81.7).curveTo(137,83.1,137,85.4).lineTo(137,85.7).lineTo(136.9,86.4).lineTo(137,87.4).lineTo(137,87.5).curveTo(137,89.1,136,90.5).curveTo(134.6,92.5,132,92.5).curveTo(128.7,92.5,127.6,89.8).closePath().moveTo(-17.5,26.8).lineTo(-18,24.5).curveTo(-18,23.7,-17.8,23.1).lineTo(-17.8,23).lineTo(-18,22.5).curveTo(-18,20.1,-16.4,18.7).curveTo(-15.1,17.5,-13,17.5).curveTo(-11,17.5,-9.6,18.7).curveTo(-8.1,20.1,-8,22.4).lineTo(-8,22.7).lineTo(-8.1,23.4).lineTo(-8,24.4).lineTo(-8,24.5).curveTo(-8,26.1,-9,27.5).curveTo(-10.4,29.5,-13,29.5).curveTo(-16.3,29.5,-17.5,26.8).closePath().moveTo(120.5,26.6).lineTo(119.9,24.3).curveTo(119.9,23.5,120.1,22.9).lineTo(120.1,22.8).lineTo(119.9,22.3).curveTo(120,19.9,121.5,18.5).curveTo(122.9,17.3,125,17.3).curveTo(127,17.3,128.4,18.5).curveTo(129.9,19.9,129.9,22.2).lineTo(129.9,22.5).lineTo(129.8,23.2).lineTo(129.9,24.2).lineTo(129.9,24.3).curveTo(130,25.9,128.9,27.3).curveTo(127.6,29.3,125,29.3).curveTo(121.7,29.3,120.5,26.6).closePath().moveTo(-136.5,9.7).lineTo(-137,7.5).curveTo(-137,6.7,-136.8,6).lineTo(-136.8,6).lineTo(-137,5.5).curveTo(-137,3.1,-135.5,1.7).curveTo(-134.1,0.4,-132,0.4).curveTo(-130,0.4,-128.6,1.7).curveTo(-127.1,3,-127,5.3).lineTo(-127,5.6).lineTo(-127.1,6.4).lineTo(-127,7.3).lineTo(-127,7.5).curveTo(-127,9,-128,10.5).curveTo(-129.4,12.5,-132,12.5).curveTo(-135.3,12.5,-136.5,9.7).closePath().moveTo(57.6,-8.2).lineTo(57,-10.5).curveTo(57,-11.3,57.2,-11.9).lineTo(57.2,-12).lineTo(57,-12.5).curveTo(57,-14.9,58.6,-16.3).curveTo(60,-17.5,62,-17.5).curveTo(64,-17.5,65.5,-16.3).curveTo(67,-14.9,67,-12.6).lineTo(67,-12.3).lineTo(66.9,-11.6).lineTo(67,-10.6).lineTo(67,-10.5).curveTo(67,-8.9,66,-7.5).curveTo(64.6,-5.5,62,-5.5).curveTo(58.8,-5.5,57.6,-8.2).closePath().moveTo(127.6,-62.2).lineTo(127,-64.5).curveTo(127,-65.3,127.2,-65.9).lineTo(127.2,-66).lineTo(127,-66.5).curveTo(127,-68.9,128.6,-70.3).curveTo(129.9,-71.5,132,-71.5).curveTo(134.1,-71.5,135.4,-70.3).curveTo(137,-68.9,137,-66.6).lineTo(137,-66.3).lineTo(136.9,-65.6).lineTo(137,-64.6).lineTo(137,-64.5).curveTo(137,-62.9,136,-61.5).curveTo(134.6,-59.5,132,-59.5).curveTo(128.7,-59.5,127.6,-62.2).closePath().moveTo(11.6,-111.2).lineTo(11,-113.5).curveTo(11,-114.3,11.2,-114.9).lineTo(11.2,-115).lineTo(11,-115.5).curveTo(11,-117.9,12.6,-119.3).curveTo(14,-120.5,16,-120.5).curveTo(18.1,-120.5,19.4,-119.3).curveTo(21,-117.9,21,-115.6).lineTo(21,-115.3).lineTo(20.9,-114.6).lineTo(21,-113.6).lineTo(21,-113.5).curveTo(21,-111.9,20,-110.5).curveTo(18.6,-108.5,16,-108.5).curveTo(12.8,-108.5,11.6,-111.2).closePath();
	this.shape_31.setTransform(282.9,346.875);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(84.9,-134.2).lineTo(84.9,-161.8).curveTo(85.1,-159.1,87.9,-157.1).curveTo(90.9,-155,95.1,-155).moveTo(126.9,-18.2).lineTo(126.9,-45.8).curveTo(127.1,-43.1,129.9,-41.1).curveTo(132.9,-39,137.1,-39).moveTo(56.9,35.8).lineTo(56.9,8.2).curveTo(57.1,10.9,59.9,12.9).curveTo(62.9,15,67.1,15).moveTo(119.9,70.6).lineTo(119.9,43).curveTo(120,45.7,122.9,47.7).curveTo(125.8,49.8,130,49.8).moveTo(-137,53.8).lineTo(-137,26.1).curveTo(-136.9,28.9,-134.1,30.9).curveTo(-131.1,32.9,-126.9,32.9).moveTo(10.9,-67.2).lineTo(10.9,-94.8).curveTo(11.1,-92.1,13.9,-90.1).curveTo(16.9,-88,21.1,-88).moveTo(-18.1,70.8).lineTo(-18.1,43.2).curveTo(-17.9,45.9,-15.1,47.9).curveTo(-12.1,50,-7.9,50).moveTo(126.9,133.8).lineTo(126.9,106.2).curveTo(127.1,108.9,129.9,110.9).curveTo(132.9,113,137.1,113).moveTo(36.9,161.8).lineTo(36.9,134.2).curveTo(37.1,136.9,39.9,138.9).curveTo(42.9,141,47.1,141);
	this.shape_32.setTransform(292.95,298.425);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.beginFill("#000000").beginStroke().moveTo(37.6,151.3).lineTo(37,149).curveTo(37,148.2,37.2,147.6).lineTo(37.2,147.5).lineTo(37,147).curveTo(37,144.6,38.6,143.2).curveTo(39.9,142,42,142).curveTo(44.1,142,45.4,143.2).curveTo(46.9,144.6,47,146.9).lineTo(47,147.2).lineTo(46.9,147.9).lineTo(47,148.9).lineTo(47,149).curveTo(47,150.6,46,152).curveTo(44.6,154,42,154).curveTo(38.7,154,37.6,151.3).closePath().moveTo(127.6,123.3).lineTo(127,121).curveTo(127,120.2,127.2,119.6).lineTo(127.2,119.5).lineTo(127,119).curveTo(127,116.6,128.6,115.2).curveTo(129.9,114,132,114).curveTo(134.1,114,135.4,115.2).curveTo(137,116.6,137,118.9).lineTo(137,119.2).lineTo(136.9,119.9).lineTo(137,120.9).lineTo(137,121).curveTo(137,122.6,136,124).curveTo(134.6,126,132,126).curveTo(128.7,126,127.6,123.3).closePath().moveTo(-17.5,60.3).lineTo(-18,58).curveTo(-18,57.2,-17.8,56.6).lineTo(-17.8,56.5).lineTo(-18,56).curveTo(-18,53.6,-16.4,52.2).curveTo(-15.1,51,-13,51).curveTo(-11,51,-9.6,52.2).curveTo(-8.1,53.6,-8,55.9).lineTo(-8,56.2).lineTo(-8.1,56.9).lineTo(-8,57.9).lineTo(-8,58).curveTo(-8,59.6,-9,61).curveTo(-10.4,63,-13,63).curveTo(-16.3,63,-17.5,60.3).closePath().moveTo(120.5,60.1).lineTo(119.9,57.8).curveTo(119.9,57,120.1,56.4).lineTo(120.1,56.3).lineTo(119.9,55.8).curveTo(120,53.4,121.5,52).curveTo(122.9,50.8,125,50.8).curveTo(127,50.8,128.4,52).curveTo(129.9,53.4,129.9,55.7).lineTo(129.9,56).lineTo(129.8,56.7).lineTo(129.9,57.7).lineTo(129.9,57.8).curveTo(130,59.4,128.9,60.8).curveTo(127.6,62.8,125,62.8).curveTo(121.7,62.8,120.5,60.1).closePath().moveTo(-136.5,43.2).lineTo(-137,41).curveTo(-137,40.2,-136.8,39.5).lineTo(-136.8,39.5).lineTo(-137,39).curveTo(-137,36.6,-135.5,35.2).curveTo(-134.1,33.9,-132,33.9).curveTo(-130,33.9,-128.6,35.2).curveTo(-127.1,36.5,-127,38.8).lineTo(-127,39.1).lineTo(-127.1,39.9).lineTo(-127,40.8).lineTo(-127,41).curveTo(-127,42.5,-128,44).curveTo(-129.4,46,-132,46).curveTo(-135.3,46,-136.5,43.2).closePath().moveTo(57.6,25.3).lineTo(57,23).curveTo(57,22.2,57.2,21.6).lineTo(57.2,21.5).lineTo(57,21).curveTo(57,18.6,58.6,17.2).curveTo(60,16,62,16).curveTo(64,16,65.5,17.2).curveTo(67,18.6,67,20.9).lineTo(67,21.2).lineTo(66.9,21.9).lineTo(67,22.9).lineTo(67,23).curveTo(67,24.6,66,26).curveTo(64.6,28,62,28).curveTo(58.8,28,57.6,25.3).closePath().moveTo(127.6,-28.7).lineTo(127,-31).curveTo(127,-31.8,127.2,-32.4).lineTo(127.2,-32.5).lineTo(127,-33).curveTo(127,-35.4,128.6,-36.8).curveTo(129.9,-38,132,-38).curveTo(134.1,-38,135.4,-36.8).curveTo(137,-35.4,137,-33.1).lineTo(137,-32.8).lineTo(136.9,-32.1).lineTo(137,-31.1).lineTo(137,-31).curveTo(137,-29.4,136,-28).curveTo(134.6,-26,132,-26).curveTo(128.7,-26,127.6,-28.7).closePath().moveTo(11.6,-77.7).lineTo(11,-80).curveTo(11,-80.8,11.2,-81.4).lineTo(11.2,-81.5).lineTo(11,-82).curveTo(11,-84.4,12.6,-85.8).curveTo(14,-87,16,-87).curveTo(18.1,-87,19.4,-85.8).curveTo(21,-84.4,21,-82.1).lineTo(21,-81.8).lineTo(20.9,-81.1).lineTo(21,-80.1).lineTo(21,-80).curveTo(21,-78.4,20,-77).curveTo(18.6,-75,16,-75).curveTo(12.8,-75,11.6,-77.7).closePath().moveTo(85.6,-144.7).lineTo(85,-147).curveTo(85,-147.8,85.2,-148.4).lineTo(85.2,-148.5).lineTo(85,-149).curveTo(85,-151.4,86.5,-152.8).curveTo(88,-154,90,-154).curveTo(92.1,-154,93.5,-152.8).curveTo(95,-151.4,95,-149.1).lineTo(95,-148.8).lineTo(94.9,-148.1).lineTo(95,-147.1).lineTo(95,-147).curveTo(95,-145.4,94,-144).curveTo(92.6,-142,90,-142).curveTo(86.8,-142,85.6,-144.7).closePath();
	this.shape_33.setTransform(282.9,313.375);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(84.9,-117.2).lineTo(84.9,-144.8).curveTo(85.1,-142.1,87.9,-140.1).curveTo(90.9,-138,95.1,-138).moveTo(66.9,-151.2).lineTo(66.9,-178.8).curveTo(67.1,-176.1,69.9,-174.1).curveTo(72.9,-172,77.1,-172).moveTo(126.9,-1.2).lineTo(126.9,-28.8).curveTo(127.1,-26.1,129.9,-24.1).curveTo(132.9,-22,137.1,-22).moveTo(56.9,52.8).lineTo(56.9,25.2).curveTo(57.1,27.9,59.9,29.9).curveTo(62.9,32,67.1,32).moveTo(119.9,87.6).lineTo(119.9,60).curveTo(120,62.7,122.9,64.7).curveTo(125.8,66.8,130,66.8).moveTo(-137,70.8).lineTo(-137,43.1).curveTo(-136.9,45.9,-134.1,47.9).curveTo(-131.1,49.9,-126.9,49.9).moveTo(10.9,-50.2).lineTo(10.9,-77.8).curveTo(11.1,-75.1,13.9,-73.1).curveTo(16.9,-71,21.1,-71).moveTo(-18.1,87.8).lineTo(-18.1,60.2).curveTo(-17.9,62.9,-15.1,64.9).curveTo(-12.1,67,-7.9,67).moveTo(126.9,150.8).lineTo(126.9,123.2).curveTo(127.1,125.9,129.9,127.9).curveTo(132.9,130,137.1,130).moveTo(36.9,178.8).lineTo(36.9,151.2).curveTo(37.1,153.9,39.9,155.9).curveTo(42.9,158,47.1,158);
	this.shape_34.setTransform(292.95,281.425);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.beginFill("#000000").beginStroke().moveTo(37.6,168.3).lineTo(37,166).curveTo(37,165.2,37.2,164.6).lineTo(37.2,164.5).lineTo(37,164).curveTo(37,161.6,38.6,160.2).curveTo(39.9,159,42,159).curveTo(44.1,159,45.4,160.2).curveTo(46.9,161.6,47,163.9).lineTo(47,164.2).lineTo(46.9,164.9).lineTo(47,165.9).lineTo(47,166).curveTo(47,167.6,46,169).curveTo(44.6,171,42,171).curveTo(38.7,171,37.6,168.3).closePath().moveTo(127.6,140.3).lineTo(127,138).curveTo(127,137.2,127.2,136.6).lineTo(127.2,136.5).lineTo(127,136).curveTo(127,133.6,128.6,132.2).curveTo(129.9,131,132,131).curveTo(134.1,131,135.4,132.2).curveTo(137,133.6,137,135.9).lineTo(137,136.2).lineTo(136.9,136.9).lineTo(137,137.9).lineTo(137,138).curveTo(137,139.6,136,141).curveTo(134.6,143,132,143).curveTo(128.7,143,127.6,140.3).closePath().moveTo(-17.5,77.3).lineTo(-18,75).curveTo(-18,74.2,-17.8,73.6).lineTo(-17.8,73.5).lineTo(-18,73).curveTo(-18,70.6,-16.4,69.2).curveTo(-15.1,68,-13,68).curveTo(-11,68,-9.6,69.2).curveTo(-8.1,70.6,-8,72.9).lineTo(-8,73.2).lineTo(-8.1,73.9).lineTo(-8,74.9).lineTo(-8,75).curveTo(-8,76.6,-9,78).curveTo(-10.4,80,-13,80).curveTo(-16.3,80,-17.5,77.3).closePath().moveTo(120.5,77.1).lineTo(119.9,74.8).curveTo(119.9,74,120.1,73.4).lineTo(120.1,73.3).lineTo(119.9,72.8).curveTo(120,70.4,121.5,69).curveTo(122.9,67.8,125,67.8).curveTo(127,67.8,128.4,69).curveTo(129.9,70.4,129.9,72.7).lineTo(129.9,73).lineTo(129.8,73.7).lineTo(129.9,74.7).lineTo(129.9,74.8).curveTo(130,76.4,128.9,77.8).curveTo(127.6,79.8,125,79.8).curveTo(121.7,79.8,120.5,77.1).closePath().moveTo(-136.5,60.2).lineTo(-137,58).curveTo(-137,57.2,-136.8,56.5).lineTo(-136.8,56.5).lineTo(-137,56).curveTo(-137,53.6,-135.5,52.2).curveTo(-134.1,50.9,-132,50.9).curveTo(-130,50.9,-128.6,52.2).curveTo(-127.1,53.5,-127,55.8).lineTo(-127,56.1).lineTo(-127.1,56.9).lineTo(-127,57.8).lineTo(-127,58).curveTo(-127,59.5,-128,61).curveTo(-129.4,63,-132,63).curveTo(-135.3,63,-136.5,60.2).closePath().moveTo(57.6,42.3).lineTo(57,40).curveTo(57,39.2,57.2,38.6).lineTo(57.2,38.5).lineTo(57,38).curveTo(57,35.6,58.6,34.2).curveTo(60,33,62,33).curveTo(64,33,65.5,34.2).curveTo(67,35.6,67,37.9).lineTo(67,38.2).lineTo(66.9,38.9).lineTo(67,39.9).lineTo(67,40).curveTo(67,41.6,66,43).curveTo(64.6,45,62,45).curveTo(58.8,45,57.6,42.3).closePath().moveTo(127.6,-11.7).lineTo(127,-14).curveTo(127,-14.8,127.2,-15.4).lineTo(127.2,-15.5).lineTo(127,-16).curveTo(127,-18.4,128.6,-19.8).curveTo(129.9,-21,132,-21).curveTo(134.1,-21,135.4,-19.8).curveTo(137,-18.4,137,-16.1).lineTo(137,-15.8).lineTo(136.9,-15.1).lineTo(137,-14.1).lineTo(137,-14).curveTo(137,-12.4,136,-11).curveTo(134.6,-9,132,-9).curveTo(128.7,-9,127.6,-11.7).closePath().moveTo(11.6,-60.7).lineTo(11,-63).curveTo(11,-63.8,11.2,-64.4).lineTo(11.2,-64.5).lineTo(11,-65).curveTo(11,-67.4,12.6,-68.8).curveTo(14,-70,16,-70).curveTo(18.1,-70,19.4,-68.8).curveTo(21,-67.4,21,-65.1).lineTo(21,-64.8).lineTo(20.9,-64.1).lineTo(21,-63.1).lineTo(21,-63).curveTo(21,-61.4,20,-60).curveTo(18.6,-58,16,-58).curveTo(12.8,-58,11.6,-60.7).closePath().moveTo(85.6,-127.7).lineTo(85,-130).curveTo(85,-130.8,85.2,-131.4).lineTo(85.2,-131.5).lineTo(85,-132).curveTo(85,-134.4,86.5,-135.8).curveTo(88,-137,90,-137).curveTo(92.1,-137,93.5,-135.8).curveTo(95,-134.4,95,-132.1).lineTo(95,-131.8).lineTo(94.9,-131.1).lineTo(95,-130.1).lineTo(95,-130).curveTo(95,-128.4,94,-127).curveTo(92.6,-125,90,-125).curveTo(86.8,-125,85.6,-127.7).closePath().moveTo(67.6,-161.7).lineTo(67,-164).curveTo(67,-164.8,67.2,-165.4).lineTo(67.2,-165.5).lineTo(67,-166).curveTo(67,-168.4,68.5,-169.8).curveTo(70,-171,72,-171).curveTo(74.1,-171,75.5,-169.8).curveTo(77,-168.4,77,-166.1).lineTo(77,-165.8).lineTo(76.9,-165.1).lineTo(77,-164.1).lineTo(77,-164).curveTo(77,-162.4,76,-161).curveTo(74.6,-159,72,-159).curveTo(68.8,-159,67.6,-161.7).closePath();
	this.shape_35.setTransform(282.9,296.375);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(84.9,-116.8).lineTo(84.9,-144.4).curveTo(85.1,-141.7,87.9,-139.7).curveTo(90.9,-137.6,95.1,-137.6).moveTo(66.9,-150.8).lineTo(66.9,-178.4).curveTo(67.1,-175.7,69.9,-173.7).curveTo(72.9,-171.6,77.1,-171.6).moveTo(126.9,-0.8).lineTo(126.9,-28.4).curveTo(127.1,-25.7,129.9,-23.7).curveTo(132.9,-21.6,137.1,-21.6).moveTo(56.9,53.2).lineTo(56.9,25.6).curveTo(57.1,28.3,59.9,30.3).curveTo(62.9,32.4,67.1,32.4).moveTo(119.9,88).lineTo(119.9,60.4).curveTo(120,63.1,122.9,65.1).curveTo(125.8,67.2,130,67.2).moveTo(10.9,-151.6).lineTo(10.9,-179.2).curveTo(11.1,-176.5,13.9,-174.5).curveTo(16.9,-172.4,21.1,-172.4).moveTo(-137,71.2).lineTo(-137,43.5).curveTo(-136.9,46.3,-134.1,48.3).curveTo(-131.1,50.3,-126.9,50.3).moveTo(10.9,-49.8).lineTo(10.9,-77.4).curveTo(11.1,-74.7,13.9,-72.7).curveTo(16.9,-70.6,21.1,-70.6).moveTo(-18.1,88.2).lineTo(-18.1,60.6).curveTo(-17.9,63.3,-15.1,65.3).curveTo(-12.1,67.4,-7.9,67.4).moveTo(126.9,151.2).lineTo(126.9,123.6).curveTo(127.1,126.3,129.9,128.3).curveTo(132.9,130.4,137.1,130.4).moveTo(36.9,179.2).lineTo(36.9,151.6).curveTo(37.1,154.3,39.9,156.3).curveTo(42.9,158.4,47.1,158.4);
	this.shape_36.setTransform(292.95,281.025);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.beginFill("#000000").beginStroke().moveTo(37.6,168.7).lineTo(37,166.4).curveTo(37,165.6,37.2,165).lineTo(37.2,164.9).lineTo(37,164.4).curveTo(37,162,38.6,160.6).curveTo(39.9,159.4,42,159.4).curveTo(44.1,159.4,45.4,160.6).curveTo(46.9,162,47,164.3).lineTo(47,164.6).lineTo(46.9,165.3).lineTo(47,166.3).lineTo(47,166.4).curveTo(47,168,46,169.4).curveTo(44.6,171.4,42,171.4).curveTo(38.7,171.4,37.6,168.7).closePath().moveTo(127.6,140.7).lineTo(127,138.4).curveTo(127,137.6,127.2,137).lineTo(127.2,136.9).lineTo(127,136.4).curveTo(127,134,128.6,132.6).curveTo(129.9,131.4,132,131.4).curveTo(134.1,131.4,135.4,132.6).curveTo(137,134,137,136.3).lineTo(137,136.6).lineTo(136.9,137.3).lineTo(137,138.3).lineTo(137,138.4).curveTo(137,140,136,141.4).curveTo(134.6,143.4,132,143.4).curveTo(128.7,143.4,127.6,140.7).closePath().moveTo(-17.5,77.7).lineTo(-18,75.4).curveTo(-18,74.6,-17.8,74).lineTo(-17.8,73.9).lineTo(-18,73.4).curveTo(-18,71,-16.4,69.6).curveTo(-15.1,68.4,-13,68.4).curveTo(-11,68.4,-9.6,69.6).curveTo(-8.1,71,-8,73.3).lineTo(-8,73.6).lineTo(-8.1,74.3).lineTo(-8,75.3).lineTo(-8,75.4).curveTo(-8,77,-9,78.4).curveTo(-10.4,80.4,-13,80.4).curveTo(-16.3,80.4,-17.5,77.7).closePath().moveTo(120.5,77.5).lineTo(119.9,75.2).curveTo(119.9,74.4,120.1,73.8).lineTo(120.1,73.7).lineTo(119.9,73.2).curveTo(120,70.8,121.5,69.4).curveTo(122.9,68.2,125,68.2).curveTo(127,68.2,128.4,69.4).curveTo(129.9,70.8,129.9,73.1).lineTo(129.9,73.4).lineTo(129.8,74.1).lineTo(129.9,75.1).lineTo(129.9,75.2).curveTo(130,76.8,128.9,78.2).curveTo(127.6,80.2,125,80.2).curveTo(121.7,80.2,120.5,77.5).closePath().moveTo(-136.5,60.6).lineTo(-137,58.4).curveTo(-137,57.6,-136.8,56.9).lineTo(-136.8,56.9).lineTo(-137,56.4).curveTo(-137,54,-135.5,52.6).curveTo(-134.1,51.3,-132,51.3).curveTo(-130,51.3,-128.6,52.6).curveTo(-127.1,53.9,-127,56.2).lineTo(-127,56.5).lineTo(-127.1,57.3).lineTo(-127,58.2).lineTo(-127,58.4).curveTo(-127,59.9,-128,61.4).curveTo(-129.4,63.4,-132,63.4).curveTo(-135.3,63.4,-136.5,60.6).closePath().moveTo(57.6,42.7).lineTo(57,40.4).curveTo(57,39.6,57.2,39).lineTo(57.2,38.9).lineTo(57,38.4).curveTo(57,36,58.6,34.6).curveTo(60,33.4,62,33.4).curveTo(64,33.4,65.5,34.6).curveTo(67,36,67,38.3).lineTo(67,38.6).lineTo(66.9,39.3).lineTo(67,40.3).lineTo(67,40.4).curveTo(67,42,66,43.4).curveTo(64.6,45.4,62,45.4).curveTo(58.8,45.4,57.6,42.7).closePath().moveTo(127.6,-11.3).lineTo(127,-13.6).curveTo(127,-14.4,127.2,-15).lineTo(127.2,-15.1).lineTo(127,-15.6).curveTo(127,-18,128.6,-19.4).curveTo(129.9,-20.6,132,-20.6).curveTo(134.1,-20.6,135.4,-19.4).curveTo(137,-18,137,-15.7).lineTo(137,-15.4).lineTo(136.9,-14.7).lineTo(137,-13.7).lineTo(137,-13.6).curveTo(137,-12,136,-10.6).curveTo(134.6,-8.6,132,-8.6).curveTo(128.7,-8.6,127.6,-11.3).closePath().moveTo(11.6,-60.3).lineTo(11,-62.6).curveTo(11,-63.4,11.2,-64).lineTo(11.2,-64.1).lineTo(11,-64.6).curveTo(11,-67,12.6,-68.4).curveTo(14,-69.6,16,-69.6).curveTo(18.1,-69.6,19.4,-68.4).curveTo(21,-67,21,-64.7).lineTo(21,-64.4).lineTo(20.9,-63.7).lineTo(21,-62.7).lineTo(21,-62.6).curveTo(21,-61,20,-59.6).curveTo(18.6,-57.6,16,-57.6).curveTo(12.8,-57.6,11.6,-60.3).closePath().moveTo(85.6,-127.3).lineTo(85,-129.6).curveTo(85,-130.4,85.2,-131).lineTo(85.2,-131.1).lineTo(85,-131.6).curveTo(85,-134,86.5,-135.4).curveTo(88,-136.6,90,-136.6).curveTo(92.1,-136.6,93.5,-135.4).curveTo(95,-134,95,-131.7).lineTo(95,-131.4).lineTo(94.9,-130.7).lineTo(95,-129.7).lineTo(95,-129.6).curveTo(95,-128,94,-126.6).curveTo(92.6,-124.6,90,-124.6).curveTo(86.8,-124.6,85.6,-127.3).closePath().moveTo(67.6,-161.3).lineTo(67,-163.6).curveTo(67,-164.4,67.2,-165).lineTo(67.2,-165.1).lineTo(67,-165.6).curveTo(67,-168,68.5,-169.4).curveTo(70,-170.6,72,-170.6).curveTo(74.1,-170.6,75.5,-169.4).curveTo(77,-168,77,-165.7).lineTo(77,-165.4).lineTo(76.9,-164.7).lineTo(77,-163.7).lineTo(77,-163.6).curveTo(77,-162,76,-160.6).curveTo(74.6,-158.6,72,-158.6).curveTo(68.8,-158.6,67.6,-161.3).closePath().moveTo(11.6,-162.1).lineTo(11,-164.4).curveTo(11,-165.2,11.2,-165.8).lineTo(11.2,-165.9).lineTo(11,-166.4).curveTo(11,-168.8,12.6,-170.2).curveTo(14,-171.4,16,-171.4).curveTo(18.1,-171.4,19.4,-170.2).curveTo(21,-168.8,21,-166.5).lineTo(21,-166.2).lineTo(20.9,-165.5).lineTo(21,-164.5).lineTo(21,-164.4).curveTo(21,-162.8,20,-161.4).curveTo(18.6,-159.4,16,-159.4).curveTo(12.8,-159.4,11.6,-162.1).closePath();
	this.shape_37.setTransform(282.9,295.975);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(84.9,-116.8).lineTo(84.9,-144.4).curveTo(85.1,-141.7,87.9,-139.7).curveTo(90.9,-137.6,95.1,-137.6).moveTo(66.9,-150.8).lineTo(66.9,-178.4).curveTo(67.1,-175.7,69.9,-173.7).curveTo(72.9,-171.6,77.1,-171.6).moveTo(126.9,-0.8).lineTo(126.9,-28.4).curveTo(127.1,-25.7,129.9,-23.7).curveTo(132.9,-21.6,137.1,-21.6).moveTo(56.9,53.2).lineTo(56.9,25.6).curveTo(57.1,28.3,59.9,30.3).curveTo(62.9,32.4,67.1,32.4).moveTo(119.9,88).lineTo(119.9,60.4).curveTo(120,63.1,122.9,65.1).curveTo(125.8,67.2,130,67.2).moveTo(-73,-105.8).lineTo(-73,-133.4).curveTo(-72.9,-130.7,-70.1,-128.7).curveTo(-67.1,-126.6,-62.9,-126.6).moveTo(10.9,-151.6).lineTo(10.9,-179.2).curveTo(11.1,-176.5,13.9,-174.5).curveTo(16.9,-172.4,21.1,-172.4).moveTo(-137,71.2).lineTo(-137,43.5).curveTo(-136.9,46.3,-134.1,48.3).curveTo(-131.1,50.3,-126.9,50.3).moveTo(10.9,-49.8).lineTo(10.9,-77.4).curveTo(11.1,-74.7,13.9,-72.7).curveTo(16.9,-70.6,21.1,-70.6).moveTo(-18.1,88.2).lineTo(-18.1,60.6).curveTo(-17.9,63.3,-15.1,65.3).curveTo(-12.1,67.4,-7.9,67.4).moveTo(126.9,151.2).lineTo(126.9,123.6).curveTo(127.1,126.3,129.9,128.3).curveTo(132.9,130.4,137.1,130.4).moveTo(36.9,179.2).lineTo(36.9,151.6).curveTo(37.1,154.3,39.9,156.3).curveTo(42.9,158.4,47.1,158.4);
	this.shape_38.setTransform(292.95,281.025);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.beginFill("#000000").beginStroke().moveTo(37.6,168.7).lineTo(37,166.4).curveTo(37,165.6,37.2,165).lineTo(37.2,164.9).lineTo(37,164.4).curveTo(37,162,38.6,160.6).curveTo(39.9,159.4,42,159.4).curveTo(44.1,159.4,45.4,160.6).curveTo(46.9,162,47,164.3).lineTo(47,164.6).lineTo(46.9,165.3).lineTo(47,166.3).lineTo(47,166.4).curveTo(47,168,46,169.4).curveTo(44.6,171.4,42,171.4).curveTo(38.7,171.4,37.6,168.7).closePath().moveTo(127.6,140.7).lineTo(127,138.4).curveTo(127,137.6,127.2,137).lineTo(127.2,136.9).lineTo(127,136.4).curveTo(127,134,128.6,132.6).curveTo(129.9,131.4,132,131.4).curveTo(134.1,131.4,135.4,132.6).curveTo(137,134,137,136.3).lineTo(137,136.6).lineTo(136.9,137.3).lineTo(137,138.3).lineTo(137,138.4).curveTo(137,140,136,141.4).curveTo(134.6,143.4,132,143.4).curveTo(128.7,143.4,127.6,140.7).closePath().moveTo(-17.5,77.7).lineTo(-18,75.4).curveTo(-18,74.6,-17.8,74).lineTo(-17.8,73.9).lineTo(-18,73.4).curveTo(-18,71,-16.4,69.6).curveTo(-15.1,68.4,-13,68.4).curveTo(-11,68.4,-9.6,69.6).curveTo(-8.1,71,-8,73.3).lineTo(-8,73.6).lineTo(-8.1,74.3).lineTo(-8,75.3).lineTo(-8,75.4).curveTo(-8,77,-9,78.4).curveTo(-10.4,80.4,-13,80.4).curveTo(-16.3,80.4,-17.5,77.7).closePath().moveTo(120.5,77.5).lineTo(119.9,75.2).curveTo(119.9,74.4,120.1,73.8).lineTo(120.1,73.7).lineTo(119.9,73.2).curveTo(120,70.8,121.5,69.4).curveTo(122.9,68.2,125,68.2).curveTo(127,68.2,128.4,69.4).curveTo(129.9,70.8,129.9,73.1).lineTo(129.9,73.4).lineTo(129.8,74.1).lineTo(129.9,75.1).lineTo(129.9,75.2).curveTo(130,76.8,128.9,78.2).curveTo(127.6,80.2,125,80.2).curveTo(121.7,80.2,120.5,77.5).closePath().moveTo(-136.5,60.6).lineTo(-137,58.4).curveTo(-137,57.6,-136.8,56.9).lineTo(-136.8,56.9).lineTo(-137,56.4).curveTo(-137,54,-135.5,52.6).curveTo(-134.1,51.3,-132,51.3).curveTo(-130,51.3,-128.6,52.6).curveTo(-127.1,53.9,-127,56.2).lineTo(-127,56.5).lineTo(-127.1,57.3).lineTo(-127,58.2).lineTo(-127,58.4).curveTo(-127,59.9,-128,61.4).curveTo(-129.4,63.4,-132,63.4).curveTo(-135.3,63.4,-136.5,60.6).closePath().moveTo(57.6,42.7).lineTo(57,40.4).curveTo(57,39.6,57.2,39).lineTo(57.2,38.9).lineTo(57,38.4).curveTo(57,36,58.6,34.6).curveTo(60,33.4,62,33.4).curveTo(64,33.4,65.5,34.6).curveTo(67,36,67,38.3).lineTo(67,38.6).lineTo(66.9,39.3).lineTo(67,40.3).lineTo(67,40.4).curveTo(67,42,66,43.4).curveTo(64.6,45.4,62,45.4).curveTo(58.8,45.4,57.6,42.7).closePath().moveTo(127.6,-11.3).lineTo(127,-13.6).curveTo(127,-14.4,127.2,-15).lineTo(127.2,-15.1).lineTo(127,-15.6).curveTo(127,-18,128.6,-19.4).curveTo(129.9,-20.6,132,-20.6).curveTo(134.1,-20.6,135.4,-19.4).curveTo(137,-18,137,-15.7).lineTo(137,-15.4).lineTo(136.9,-14.7).lineTo(137,-13.7).lineTo(137,-13.6).curveTo(137,-12,136,-10.6).curveTo(134.6,-8.6,132,-8.6).curveTo(128.7,-8.6,127.6,-11.3).closePath().moveTo(11.6,-60.3).lineTo(11,-62.6).curveTo(11,-63.4,11.2,-64).lineTo(11.2,-64.1).lineTo(11,-64.6).curveTo(11,-67,12.6,-68.4).curveTo(14,-69.6,16,-69.6).curveTo(18.1,-69.6,19.4,-68.4).curveTo(21,-67,21,-64.7).lineTo(21,-64.4).lineTo(20.9,-63.7).lineTo(21,-62.7).lineTo(21,-62.6).curveTo(21,-61,20,-59.6).curveTo(18.6,-57.6,16,-57.6).curveTo(12.8,-57.6,11.6,-60.3).closePath().moveTo(-72.5,-116.3).lineTo(-73,-118.6).curveTo(-73,-119.4,-72.8,-120).lineTo(-72.8,-120.1).lineTo(-73,-120.6).curveTo(-73,-123,-71.5,-124.4).curveTo(-70.1,-125.6,-68,-125.6).curveTo(-66,-125.6,-64.6,-124.4).curveTo(-63.1,-123,-63,-120.7).lineTo(-63,-120.4).lineTo(-63.1,-119.7).lineTo(-63,-118.7).lineTo(-63,-118.6).curveTo(-63,-117,-64,-115.6).curveTo(-65.4,-113.6,-68,-113.6).curveTo(-71.3,-113.6,-72.5,-116.3).closePath().moveTo(85.6,-127.3).lineTo(85,-129.6).curveTo(85,-130.4,85.2,-131).lineTo(85.2,-131.1).lineTo(85,-131.6).curveTo(85,-134,86.5,-135.4).curveTo(88,-136.6,90,-136.6).curveTo(92.1,-136.6,93.5,-135.4).curveTo(95,-134,95,-131.7).lineTo(95,-131.4).lineTo(94.9,-130.7).lineTo(95,-129.7).lineTo(95,-129.6).curveTo(95,-128,94,-126.6).curveTo(92.6,-124.6,90,-124.6).curveTo(86.8,-124.6,85.6,-127.3).closePath().moveTo(67.6,-161.3).lineTo(67,-163.6).curveTo(67,-164.4,67.2,-165).lineTo(67.2,-165.1).lineTo(67,-165.6).curveTo(67,-168,68.5,-169.4).curveTo(70,-170.6,72,-170.6).curveTo(74.1,-170.6,75.5,-169.4).curveTo(77,-168,77,-165.7).lineTo(77,-165.4).lineTo(76.9,-164.7).lineTo(77,-163.7).lineTo(77,-163.6).curveTo(77,-162,76,-160.6).curveTo(74.6,-158.6,72,-158.6).curveTo(68.8,-158.6,67.6,-161.3).closePath().moveTo(11.6,-162.1).lineTo(11,-164.4).curveTo(11,-165.2,11.2,-165.8).lineTo(11.2,-165.9).lineTo(11,-166.4).curveTo(11,-168.8,12.6,-170.2).curveTo(14,-171.4,16,-171.4).curveTo(18.1,-171.4,19.4,-170.2).curveTo(21,-168.8,21,-166.5).lineTo(21,-166.2).lineTo(20.9,-165.5).lineTo(21,-164.5).lineTo(21,-164.4).curveTo(21,-162.8,20,-161.4).curveTo(18.6,-159.4,16,-159.4).curveTo(12.8,-159.4,11.6,-162.1).closePath();
	this.shape_39.setTransform(282.9,295.975);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(102.9,-116.8).lineTo(102.9,-144.4).curveTo(103.1,-141.7,105.9,-139.7).curveTo(108.9,-137.6,113.1,-137.6).moveTo(84.9,-150.8).lineTo(84.9,-178.4).curveTo(85.1,-175.7,87.9,-173.7).curveTo(90.9,-171.6,95.1,-171.6).moveTo(144.9,-0.8).lineTo(144.9,-28.4).curveTo(145.1,-25.7,147.9,-23.7).curveTo(150.9,-21.6,155.1,-21.6).moveTo(74.9,53.2).lineTo(74.9,25.6).curveTo(75.1,28.3,77.9,30.3).curveTo(80.9,32.4,85.1,32.4).moveTo(137.9,88).lineTo(137.9,60.4).curveTo(138,63.1,140.9,65.1).curveTo(143.8,67.2,148,67.2).moveTo(-55,-105.8).lineTo(-55,-133.4).curveTo(-54.9,-130.7,-52.1,-128.7).curveTo(-49.1,-126.6,-44.9,-126.6).moveTo(28.9,-151.6).lineTo(28.9,-179.2).curveTo(29.1,-176.5,31.9,-174.5).curveTo(34.9,-172.4,39.1,-172.4).moveTo(-155,-150.8).lineTo(-155,-178.4).curveTo(-154.9,-175.7,-152.1,-173.7).curveTo(-149.1,-171.6,-144.9,-171.6).moveTo(-119,71.2).lineTo(-119,43.5).curveTo(-118.9,46.3,-116.1,48.3).curveTo(-113.1,50.3,-108.9,50.3).moveTo(28.9,-49.8).lineTo(28.9,-77.4).curveTo(29.1,-74.7,31.9,-72.7).curveTo(34.9,-70.6,39.1,-70.6).moveTo(-0.1,88.2).lineTo(-0.1,60.6).curveTo(0.1,63.3,2.9,65.3).curveTo(5.9,67.4,10.1,67.4).moveTo(144.9,151.2).lineTo(144.9,123.6).curveTo(145.1,126.3,147.9,128.3).curveTo(150.9,130.4,155.1,130.4).moveTo(54.9,179.2).lineTo(54.9,151.6).curveTo(55.1,154.3,57.9,156.3).curveTo(60.9,158.4,65.1,158.4);
	this.shape_40.setTransform(274.95,281.025);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.beginFill("#000000").beginStroke().moveTo(55.6,168.7).lineTo(55,166.4).curveTo(55,165.6,55.2,165).lineTo(55.2,164.9).lineTo(55,164.4).curveTo(55,162,56.6,160.6).curveTo(57.9,159.4,60,159.4).curveTo(62.1,159.4,63.4,160.6).curveTo(64.9,162,65,164.3).lineTo(65,164.6).lineTo(64.9,165.3).lineTo(65,166.3).lineTo(65,166.4).curveTo(65,168,64,169.4).curveTo(62.6,171.4,60,171.4).curveTo(56.7,171.4,55.6,168.7).closePath().moveTo(145.6,140.7).lineTo(145,138.4).curveTo(145,137.6,145.2,137).lineTo(145.2,136.9).lineTo(145,136.4).curveTo(145,134,146.6,132.6).curveTo(147.9,131.4,150,131.4).curveTo(152.1,131.4,153.4,132.6).curveTo(155,134,155,136.3).lineTo(155,136.6).lineTo(154.9,137.3).lineTo(155,138.3).lineTo(155,138.4).curveTo(155,140,154,141.4).curveTo(152.6,143.4,150,143.4).curveTo(146.7,143.4,145.6,140.7).closePath().moveTo(0.5,77.7).lineTo(-0,75.4).curveTo(-0,74.6,0.2,74).lineTo(0.2,73.9).lineTo(-0,73.4).curveTo(0,71,1.6,69.6).curveTo(2.9,68.4,5,68.4).curveTo(7,68.4,8.4,69.6).curveTo(9.9,71,10,73.3).lineTo(10,73.6).lineTo(9.9,74.3).lineTo(10,75.3).lineTo(10,75.4).curveTo(10,77,9,78.4).curveTo(7.6,80.4,5,80.4).curveTo(1.7,80.4,0.5,77.7).closePath().moveTo(138.5,77.5).lineTo(137.9,75.2).curveTo(137.9,74.4,138.1,73.8).lineTo(138.1,73.7).lineTo(137.9,73.2).curveTo(138,70.8,139.5,69.4).curveTo(140.9,68.2,143,68.2).curveTo(145,68.2,146.4,69.4).curveTo(147.9,70.8,147.9,73.1).lineTo(147.9,73.4).lineTo(147.8,74.1).lineTo(147.9,75.1).lineTo(147.9,75.2).curveTo(148,76.8,146.9,78.2).curveTo(145.6,80.2,143,80.2).curveTo(139.7,80.2,138.5,77.5).closePath().moveTo(-118.5,60.6).lineTo(-119,58.4).curveTo(-119,57.6,-118.8,56.9).lineTo(-118.8,56.9).lineTo(-119,56.4).curveTo(-119,54,-117.5,52.6).curveTo(-116.1,51.3,-114,51.3).curveTo(-112,51.3,-110.6,52.6).curveTo(-109.1,53.9,-109,56.2).lineTo(-109,56.5).lineTo(-109.1,57.3).lineTo(-109,58.2).lineTo(-109,58.4).curveTo(-109,59.9,-110,61.4).curveTo(-111.4,63.4,-114,63.4).curveTo(-117.3,63.4,-118.5,60.6).closePath().moveTo(75.6,42.7).lineTo(75,40.4).curveTo(75,39.6,75.2,39).lineTo(75.2,38.9).lineTo(75,38.4).curveTo(75,36,76.6,34.6).curveTo(78,33.4,80,33.4).curveTo(82,33.4,83.5,34.6).curveTo(85,36,85,38.3).lineTo(85,38.6).lineTo(84.9,39.3).lineTo(85,40.3).lineTo(85,40.4).curveTo(85,42,84,43.4).curveTo(82.6,45.4,80,45.4).curveTo(76.8,45.4,75.6,42.7).closePath().moveTo(145.6,-11.3).lineTo(145,-13.6).curveTo(145,-14.4,145.2,-15).lineTo(145.2,-15.1).lineTo(145,-15.6).curveTo(145,-18,146.6,-19.4).curveTo(147.9,-20.6,150,-20.6).curveTo(152.1,-20.6,153.4,-19.4).curveTo(155,-18,155,-15.7).lineTo(155,-15.4).lineTo(154.9,-14.7).lineTo(155,-13.7).lineTo(155,-13.6).curveTo(155,-12,154,-10.6).curveTo(152.6,-8.6,150,-8.6).curveTo(146.7,-8.6,145.6,-11.3).closePath().moveTo(29.6,-60.3).lineTo(29,-62.6).curveTo(29,-63.4,29.2,-64).lineTo(29.2,-64.1).lineTo(29,-64.6).curveTo(29,-67,30.6,-68.4).curveTo(32,-69.6,34,-69.6).curveTo(36.1,-69.6,37.4,-68.4).curveTo(39,-67,39,-64.7).lineTo(39,-64.4).lineTo(38.9,-63.7).lineTo(39,-62.7).lineTo(39,-62.6).curveTo(39,-61,38,-59.6).curveTo(36.6,-57.6,34,-57.6).curveTo(30.8,-57.6,29.6,-60.3).closePath().moveTo(-54.5,-116.3).lineTo(-55,-118.6).curveTo(-55,-119.4,-54.8,-120).lineTo(-54.8,-120.1).lineTo(-55,-120.6).curveTo(-55,-123,-53.5,-124.4).curveTo(-52.1,-125.6,-50,-125.6).curveTo(-48,-125.6,-46.6,-124.4).curveTo(-45.1,-123,-45,-120.7).lineTo(-45,-120.4).lineTo(-45.1,-119.7).lineTo(-45,-118.7).lineTo(-45,-118.6).curveTo(-45,-117,-46,-115.6).curveTo(-47.4,-113.6,-50,-113.6).curveTo(-53.3,-113.6,-54.5,-116.3).closePath().moveTo(103.6,-127.3).lineTo(103,-129.6).curveTo(103,-130.4,103.2,-131).lineTo(103.2,-131.1).lineTo(103,-131.6).curveTo(103,-134,104.5,-135.4).curveTo(106,-136.6,108,-136.6).curveTo(110.1,-136.6,111.5,-135.4).curveTo(113,-134,113,-131.7).lineTo(113,-131.4).lineTo(112.9,-130.7).lineTo(113,-129.7).lineTo(113,-129.6).curveTo(113,-128,112,-126.6).curveTo(110.6,-124.6,108,-124.6).curveTo(104.8,-124.6,103.6,-127.3).closePath().moveTo(85.6,-161.3).lineTo(85,-163.6).curveTo(85,-164.4,85.2,-165).lineTo(85.2,-165.1).lineTo(85,-165.6).curveTo(85,-168,86.5,-169.4).curveTo(88,-170.6,90,-170.6).curveTo(92.1,-170.6,93.5,-169.4).curveTo(95,-168,95,-165.7).lineTo(95,-165.4).lineTo(94.9,-164.7).lineTo(95,-163.7).lineTo(95,-163.6).curveTo(95,-162,94,-160.6).curveTo(92.6,-158.6,90,-158.6).curveTo(86.8,-158.6,85.6,-161.3).closePath().moveTo(-154.5,-161.3).lineTo(-155,-163.6).curveTo(-155,-164.4,-154.8,-165).lineTo(-154.8,-165.1).lineTo(-155,-165.6).curveTo(-155,-168,-153.5,-169.4).curveTo(-152.1,-170.6,-150,-170.6).curveTo(-148,-170.6,-146.6,-169.4).curveTo(-145.1,-168,-145,-165.7).lineTo(-145,-165.4).lineTo(-145.1,-164.7).lineTo(-145,-163.7).lineTo(-145,-163.6).curveTo(-145,-162,-146,-160.6).curveTo(-147.4,-158.6,-150,-158.6).curveTo(-153.3,-158.6,-154.5,-161.3).closePath().moveTo(29.6,-162.1).lineTo(29,-164.4).curveTo(29,-165.2,29.2,-165.8).lineTo(29.2,-165.9).lineTo(29,-166.4).curveTo(29,-168.8,30.6,-170.2).curveTo(32,-171.4,34,-171.4).curveTo(36.1,-171.4,37.4,-170.2).curveTo(39,-168.8,39,-166.5).lineTo(39,-166.2).lineTo(38.9,-165.5).lineTo(39,-164.5).lineTo(39,-164.4).curveTo(39,-162.8,38,-161.4).curveTo(36.6,-159.4,34,-159.4).curveTo(30.8,-159.4,29.6,-162.1).closePath();
	this.shape_41.setTransform(264.9,295.975);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(102.9,-116.8).lineTo(102.9,-144.4).curveTo(103.1,-141.7,105.9,-139.7).curveTo(108.9,-137.6,113.1,-137.6).moveTo(84.9,-150.8).lineTo(84.9,-178.4).curveTo(85.1,-175.7,87.9,-173.7).curveTo(90.9,-171.6,95.1,-171.6).moveTo(144.9,-0.8).lineTo(144.9,-28.4).curveTo(145.1,-25.7,147.9,-23.7).curveTo(150.9,-21.6,155.1,-21.6).moveTo(84.9,-40.8).lineTo(84.9,-68.4).curveTo(85.1,-65.7,87.9,-63.7).curveTo(90.9,-61.6,95.1,-61.6).moveTo(74.9,53.2).lineTo(74.9,25.6).curveTo(75.1,28.3,77.9,30.3).curveTo(80.9,32.4,85.1,32.4).moveTo(137.9,88).lineTo(137.9,60.4).curveTo(138,63.1,140.9,65.1).curveTo(143.8,67.2,148,67.2).moveTo(-55,-105.8).lineTo(-55,-133.4).curveTo(-54.9,-130.7,-52.1,-128.7).curveTo(-49.1,-126.6,-44.9,-126.6).moveTo(28.9,-151.6).lineTo(28.9,-179.2).curveTo(29.1,-176.5,31.9,-174.5).curveTo(34.9,-172.4,39.1,-172.4).moveTo(-155,-150.8).lineTo(-155,-178.4).curveTo(-154.9,-175.7,-152.1,-173.7).curveTo(-149.1,-171.6,-144.9,-171.6).moveTo(-119,71.2).lineTo(-119,43.5).curveTo(-118.9,46.3,-116.1,48.3).curveTo(-113.1,50.3,-108.9,50.3).moveTo(28.9,-49.8).lineTo(28.9,-77.4).curveTo(29.1,-74.7,31.9,-72.7).curveTo(34.9,-70.6,39.1,-70.6).moveTo(-0.1,88.2).lineTo(-0.1,60.6).curveTo(0.1,63.3,2.9,65.3).curveTo(5.9,67.4,10.1,67.4).moveTo(144.9,151.2).lineTo(144.9,123.6).curveTo(145.1,126.3,147.9,128.3).curveTo(150.9,130.4,155.1,130.4).moveTo(54.9,179.2).lineTo(54.9,151.6).curveTo(55.1,154.3,57.9,156.3).curveTo(60.9,158.4,65.1,158.4);
	this.shape_42.setTransform(274.95,281.025);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.beginFill("#000000").beginStroke().moveTo(55.6,168.7).lineTo(55,166.4).curveTo(55,165.6,55.2,165).lineTo(55.2,164.9).lineTo(55,164.4).curveTo(55,162,56.6,160.6).curveTo(57.9,159.4,60,159.4).curveTo(62.1,159.4,63.4,160.6).curveTo(64.9,162,65,164.3).lineTo(65,164.6).lineTo(64.9,165.3).lineTo(65,166.3).lineTo(65,166.4).curveTo(65,168,64,169.4).curveTo(62.6,171.4,60,171.4).curveTo(56.7,171.4,55.6,168.7).closePath().moveTo(145.6,140.7).lineTo(145,138.4).curveTo(145,137.6,145.2,137).lineTo(145.2,136.9).lineTo(145,136.4).curveTo(145,134,146.6,132.6).curveTo(147.9,131.4,150,131.4).curveTo(152.1,131.4,153.4,132.6).curveTo(155,134,155,136.3).lineTo(155,136.6).lineTo(154.9,137.3).lineTo(155,138.3).lineTo(155,138.4).curveTo(155,140,154,141.4).curveTo(152.6,143.4,150,143.4).curveTo(146.7,143.4,145.6,140.7).closePath().moveTo(0.5,77.7).lineTo(-0,75.4).curveTo(-0,74.6,0.2,74).lineTo(0.2,73.9).lineTo(-0,73.4).curveTo(0,71,1.6,69.6).curveTo(2.9,68.4,5,68.4).curveTo(7,68.4,8.4,69.6).curveTo(9.9,71,10,73.3).lineTo(10,73.6).lineTo(9.9,74.3).lineTo(10,75.3).lineTo(10,75.4).curveTo(10,77,9,78.4).curveTo(7.6,80.4,5,80.4).curveTo(1.7,80.4,0.5,77.7).closePath().moveTo(138.5,77.5).lineTo(137.9,75.2).curveTo(137.9,74.4,138.1,73.8).lineTo(138.1,73.7).lineTo(137.9,73.2).curveTo(138,70.8,139.5,69.4).curveTo(140.9,68.2,143,68.2).curveTo(145,68.2,146.4,69.4).curveTo(147.9,70.8,147.9,73.1).lineTo(147.9,73.4).lineTo(147.8,74.1).lineTo(147.9,75.1).lineTo(147.9,75.2).curveTo(148,76.8,146.9,78.2).curveTo(145.6,80.2,143,80.2).curveTo(139.7,80.2,138.5,77.5).closePath().moveTo(-118.5,60.6).lineTo(-119,58.4).curveTo(-119,57.6,-118.8,56.9).lineTo(-118.8,56.9).lineTo(-119,56.4).curveTo(-119,54,-117.5,52.6).curveTo(-116.1,51.3,-114,51.3).curveTo(-112,51.3,-110.6,52.6).curveTo(-109.1,53.9,-109,56.2).lineTo(-109,56.5).lineTo(-109.1,57.3).lineTo(-109,58.2).lineTo(-109,58.4).curveTo(-109,59.9,-110,61.4).curveTo(-111.4,63.4,-114,63.4).curveTo(-117.3,63.4,-118.5,60.6).closePath().moveTo(75.6,42.7).lineTo(75,40.4).curveTo(75,39.6,75.2,39).lineTo(75.2,38.9).lineTo(75,38.4).curveTo(75,36,76.6,34.6).curveTo(78,33.4,80,33.4).curveTo(82,33.4,83.5,34.6).curveTo(85,36,85,38.3).lineTo(85,38.6).lineTo(84.9,39.3).lineTo(85,40.3).lineTo(85,40.4).curveTo(85,42,84,43.4).curveTo(82.6,45.4,80,45.4).curveTo(76.8,45.4,75.6,42.7).closePath().moveTo(145.6,-11.3).lineTo(145,-13.6).curveTo(145,-14.4,145.2,-15).lineTo(145.2,-15.1).lineTo(145,-15.6).curveTo(145,-18,146.6,-19.4).curveTo(147.9,-20.6,150,-20.6).curveTo(152.1,-20.6,153.4,-19.4).curveTo(155,-18,155,-15.7).lineTo(155,-15.4).lineTo(154.9,-14.7).lineTo(155,-13.7).lineTo(155,-13.6).curveTo(155,-12,154,-10.6).curveTo(152.6,-8.6,150,-8.6).curveTo(146.7,-8.6,145.6,-11.3).closePath().moveTo(85.6,-51.3).lineTo(85,-53.6).curveTo(85,-54.4,85.2,-55).lineTo(85.2,-55.1).lineTo(85,-55.6).curveTo(85,-58,86.5,-59.4).curveTo(88,-60.6,90,-60.6).curveTo(92.1,-60.6,93.5,-59.4).curveTo(95,-58,95,-55.7).lineTo(95,-55.4).lineTo(94.9,-54.7).lineTo(95,-53.7).lineTo(95,-53.6).curveTo(95,-52,94,-50.6).curveTo(92.6,-48.6,90,-48.6).curveTo(86.8,-48.6,85.6,-51.3).closePath().moveTo(29.6,-60.3).lineTo(29,-62.6).curveTo(29,-63.4,29.2,-64).lineTo(29.2,-64.1).lineTo(29,-64.6).curveTo(29,-67,30.6,-68.4).curveTo(32,-69.6,34,-69.6).curveTo(36.1,-69.6,37.4,-68.4).curveTo(39,-67,39,-64.7).lineTo(39,-64.4).lineTo(38.9,-63.7).lineTo(39,-62.7).lineTo(39,-62.6).curveTo(39,-61,38,-59.6).curveTo(36.6,-57.6,34,-57.6).curveTo(30.8,-57.6,29.6,-60.3).closePath().moveTo(-54.5,-116.3).lineTo(-55,-118.6).curveTo(-55,-119.4,-54.8,-120).lineTo(-54.8,-120.1).lineTo(-55,-120.6).curveTo(-55,-123,-53.5,-124.4).curveTo(-52.1,-125.6,-50,-125.6).curveTo(-48,-125.6,-46.6,-124.4).curveTo(-45.1,-123,-45,-120.7).lineTo(-45,-120.4).lineTo(-45.1,-119.7).lineTo(-45,-118.7).lineTo(-45,-118.6).curveTo(-45,-117,-46,-115.6).curveTo(-47.4,-113.6,-50,-113.6).curveTo(-53.3,-113.6,-54.5,-116.3).closePath().moveTo(103.6,-127.3).lineTo(103,-129.6).curveTo(103,-130.4,103.2,-131).lineTo(103.2,-131.1).lineTo(103,-131.6).curveTo(103,-134,104.5,-135.4).curveTo(106,-136.6,108,-136.6).curveTo(110.1,-136.6,111.5,-135.4).curveTo(113,-134,113,-131.7).lineTo(113,-131.4).lineTo(112.9,-130.7).lineTo(113,-129.7).lineTo(113,-129.6).curveTo(113,-128,112,-126.6).curveTo(110.6,-124.6,108,-124.6).curveTo(104.8,-124.6,103.6,-127.3).closePath().moveTo(85.6,-161.3).lineTo(85,-163.6).curveTo(85,-164.4,85.2,-165).lineTo(85.2,-165.1).lineTo(85,-165.6).curveTo(85,-168,86.5,-169.4).curveTo(88,-170.6,90,-170.6).curveTo(92.1,-170.6,93.5,-169.4).curveTo(95,-168,95,-165.7).lineTo(95,-165.4).lineTo(94.9,-164.7).lineTo(95,-163.7).lineTo(95,-163.6).curveTo(95,-162,94,-160.6).curveTo(92.6,-158.6,90,-158.6).curveTo(86.8,-158.6,85.6,-161.3).closePath().moveTo(-154.5,-161.3).lineTo(-155,-163.6).curveTo(-155,-164.4,-154.8,-165).lineTo(-154.8,-165.1).lineTo(-155,-165.6).curveTo(-155,-168,-153.5,-169.4).curveTo(-152.1,-170.6,-150,-170.6).curveTo(-148,-170.6,-146.6,-169.4).curveTo(-145.1,-168,-145,-165.7).lineTo(-145,-165.4).lineTo(-145.1,-164.7).lineTo(-145,-163.7).lineTo(-145,-163.6).curveTo(-145,-162,-146,-160.6).curveTo(-147.4,-158.6,-150,-158.6).curveTo(-153.3,-158.6,-154.5,-161.3).closePath().moveTo(29.6,-162.1).lineTo(29,-164.4).curveTo(29,-165.2,29.2,-165.8).lineTo(29.2,-165.9).lineTo(29,-166.4).curveTo(29,-168.8,30.6,-170.2).curveTo(32,-171.4,34,-171.4).curveTo(36.1,-171.4,37.4,-170.2).curveTo(39,-168.8,39,-166.5).lineTo(39,-166.2).lineTo(38.9,-165.5).lineTo(39,-164.5).lineTo(39,-164.4).curveTo(39,-162.8,38,-161.4).curveTo(36.6,-159.4,34,-159.4).curveTo(30.8,-159.4,29.6,-162.1).closePath();
	this.shape_43.setTransform(264.9,295.975);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(102.9,-116.8).lineTo(102.9,-144.4).curveTo(103.1,-141.7,105.9,-139.7).curveTo(108.9,-137.6,113.1,-137.6).moveTo(84.9,-150.8).lineTo(84.9,-178.4).curveTo(85.1,-175.7,87.9,-173.7).curveTo(90.9,-171.6,95.1,-171.6).moveTo(144.9,-90.8).lineTo(144.9,-118.4).curveTo(145.1,-115.7,147.9,-113.7).curveTo(150.9,-111.6,155.1,-111.6).moveTo(144.9,-0.8).lineTo(144.9,-28.4).curveTo(145.1,-25.7,147.9,-23.7).curveTo(150.9,-21.6,155.1,-21.6).moveTo(84.9,-40.8).lineTo(84.9,-68.4).curveTo(85.1,-65.7,87.9,-63.7).curveTo(90.9,-61.6,95.1,-61.6).moveTo(74.9,53.2).lineTo(74.9,25.6).curveTo(75.1,28.3,77.9,30.3).curveTo(80.9,32.4,85.1,32.4).moveTo(137.9,88).lineTo(137.9,60.4).curveTo(138,63.1,140.9,65.1).curveTo(143.8,67.2,148,67.2).moveTo(-55,-105.8).lineTo(-55,-133.4).curveTo(-54.9,-130.7,-52.1,-128.7).curveTo(-49.1,-126.6,-44.9,-126.6).moveTo(28.9,-151.6).lineTo(28.9,-179.2).curveTo(29.1,-176.5,31.9,-174.5).curveTo(34.9,-172.4,39.1,-172.4).moveTo(-155,-150.8).lineTo(-155,-178.4).curveTo(-154.9,-175.7,-152.1,-173.7).curveTo(-149.1,-171.6,-144.9,-171.6).moveTo(-119,71.2).lineTo(-119,43.5).curveTo(-118.9,46.3,-116.1,48.3).curveTo(-113.1,50.3,-108.9,50.3).moveTo(28.9,-49.8).lineTo(28.9,-77.4).curveTo(29.1,-74.7,31.9,-72.7).curveTo(34.9,-70.6,39.1,-70.6).moveTo(-0.1,88.2).lineTo(-0.1,60.6).curveTo(0.1,63.3,2.9,65.3).curveTo(5.9,67.4,10.1,67.4).moveTo(144.9,151.2).lineTo(144.9,123.6).curveTo(145.1,126.3,147.9,128.3).curveTo(150.9,130.4,155.1,130.4).moveTo(54.9,179.2).lineTo(54.9,151.6).curveTo(55.1,154.3,57.9,156.3).curveTo(60.9,158.4,65.1,158.4);
	this.shape_44.setTransform(274.95,281.025);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.beginFill("#000000").beginStroke().moveTo(55.6,168.7).lineTo(55,166.4).curveTo(55,165.6,55.2,165).lineTo(55.2,164.9).lineTo(55,164.4).curveTo(55,162,56.6,160.6).curveTo(57.9,159.4,60,159.4).curveTo(62.1,159.4,63.4,160.6).curveTo(64.9,162,65,164.3).lineTo(65,164.6).lineTo(64.9,165.3).lineTo(65,166.3).lineTo(65,166.4).curveTo(65,168,64,169.4).curveTo(62.6,171.4,60,171.4).curveTo(56.7,171.4,55.6,168.7).closePath().moveTo(145.6,140.7).lineTo(145,138.4).curveTo(145,137.6,145.2,137).lineTo(145.2,136.9).lineTo(145,136.4).curveTo(145,134,146.6,132.6).curveTo(147.9,131.4,150,131.4).curveTo(152.1,131.4,153.4,132.6).curveTo(155,134,155,136.3).lineTo(155,136.6).lineTo(154.9,137.3).lineTo(155,138.3).lineTo(155,138.4).curveTo(155,140,154,141.4).curveTo(152.6,143.4,150,143.4).curveTo(146.7,143.4,145.6,140.7).closePath().moveTo(0.5,77.7).lineTo(-0,75.4).curveTo(-0,74.6,0.2,74).lineTo(0.2,73.9).lineTo(-0,73.4).curveTo(0,71,1.6,69.6).curveTo(2.9,68.4,5,68.4).curveTo(7,68.4,8.4,69.6).curveTo(9.9,71,10,73.3).lineTo(10,73.6).lineTo(9.9,74.3).lineTo(10,75.3).lineTo(10,75.4).curveTo(10,77,9,78.4).curveTo(7.6,80.4,5,80.4).curveTo(1.7,80.4,0.5,77.7).closePath().moveTo(138.5,77.5).lineTo(137.9,75.2).curveTo(137.9,74.4,138.1,73.8).lineTo(138.1,73.7).lineTo(137.9,73.2).curveTo(138,70.8,139.5,69.4).curveTo(140.9,68.2,143,68.2).curveTo(145,68.2,146.4,69.4).curveTo(147.9,70.8,147.9,73.1).lineTo(147.9,73.4).lineTo(147.8,74.1).lineTo(147.9,75.1).lineTo(147.9,75.2).curveTo(148,76.8,146.9,78.2).curveTo(145.6,80.2,143,80.2).curveTo(139.7,80.2,138.5,77.5).closePath().moveTo(-118.5,60.6).lineTo(-119,58.4).curveTo(-119,57.6,-118.8,56.9).lineTo(-118.8,56.9).lineTo(-119,56.4).curveTo(-119,54,-117.5,52.6).curveTo(-116.1,51.3,-114,51.3).curveTo(-112,51.3,-110.6,52.6).curveTo(-109.1,53.9,-109,56.2).lineTo(-109,56.5).lineTo(-109.1,57.3).lineTo(-109,58.2).lineTo(-109,58.4).curveTo(-109,59.9,-110,61.4).curveTo(-111.4,63.4,-114,63.4).curveTo(-117.3,63.4,-118.5,60.6).closePath().moveTo(75.6,42.7).lineTo(75,40.4).curveTo(75,39.6,75.2,39).lineTo(75.2,38.9).lineTo(75,38.4).curveTo(75,36,76.6,34.6).curveTo(78,33.4,80,33.4).curveTo(82,33.4,83.5,34.6).curveTo(85,36,85,38.3).lineTo(85,38.6).lineTo(84.9,39.3).lineTo(85,40.3).lineTo(85,40.4).curveTo(85,42,84,43.4).curveTo(82.6,45.4,80,45.4).curveTo(76.8,45.4,75.6,42.7).closePath().moveTo(145.6,-11.3).lineTo(145,-13.6).curveTo(145,-14.4,145.2,-15).lineTo(145.2,-15.1).lineTo(145,-15.6).curveTo(145,-18,146.6,-19.4).curveTo(147.9,-20.6,150,-20.6).curveTo(152.1,-20.6,153.4,-19.4).curveTo(155,-18,155,-15.7).lineTo(155,-15.4).lineTo(154.9,-14.7).lineTo(155,-13.7).lineTo(155,-13.6).curveTo(155,-12,154,-10.6).curveTo(152.6,-8.6,150,-8.6).curveTo(146.7,-8.6,145.6,-11.3).closePath().moveTo(85.6,-51.3).lineTo(85,-53.6).curveTo(85,-54.4,85.2,-55).lineTo(85.2,-55.1).lineTo(85,-55.6).curveTo(85,-58,86.5,-59.4).curveTo(88,-60.6,90,-60.6).curveTo(92.1,-60.6,93.5,-59.4).curveTo(95,-58,95,-55.7).lineTo(95,-55.4).lineTo(94.9,-54.7).lineTo(95,-53.7).lineTo(95,-53.6).curveTo(95,-52,94,-50.6).curveTo(92.6,-48.6,90,-48.6).curveTo(86.8,-48.6,85.6,-51.3).closePath().moveTo(29.6,-60.3).lineTo(29,-62.6).curveTo(29,-63.4,29.2,-64).lineTo(29.2,-64.1).lineTo(29,-64.6).curveTo(29,-67,30.6,-68.4).curveTo(32,-69.6,34,-69.6).curveTo(36.1,-69.6,37.4,-68.4).curveTo(39,-67,39,-64.7).lineTo(39,-64.4).lineTo(38.9,-63.7).lineTo(39,-62.7).lineTo(39,-62.6).curveTo(39,-61,38,-59.6).curveTo(36.6,-57.6,34,-57.6).curveTo(30.8,-57.6,29.6,-60.3).closePath().moveTo(145.6,-101.3).lineTo(145,-103.6).curveTo(145,-104.4,145.2,-105).lineTo(145.2,-105.1).lineTo(145,-105.6).curveTo(145,-108,146.6,-109.4).curveTo(147.9,-110.6,150,-110.6).curveTo(152.1,-110.6,153.4,-109.4).curveTo(155,-108,155,-105.7).lineTo(155,-105.4).lineTo(154.9,-104.7).lineTo(155,-103.7).lineTo(155,-103.6).curveTo(155,-102,154,-100.6).curveTo(152.6,-98.6,150,-98.6).curveTo(146.7,-98.6,145.6,-101.3).closePath().moveTo(-54.5,-116.3).lineTo(-55,-118.6).curveTo(-55,-119.4,-54.8,-120).lineTo(-54.8,-120.1).lineTo(-55,-120.6).curveTo(-55,-123,-53.5,-124.4).curveTo(-52.1,-125.6,-50,-125.6).curveTo(-48,-125.6,-46.6,-124.4).curveTo(-45.1,-123,-45,-120.7).lineTo(-45,-120.4).lineTo(-45.1,-119.7).lineTo(-45,-118.7).lineTo(-45,-118.6).curveTo(-45,-117,-46,-115.6).curveTo(-47.4,-113.6,-50,-113.6).curveTo(-53.3,-113.6,-54.5,-116.3).closePath().moveTo(103.6,-127.3).lineTo(103,-129.6).curveTo(103,-130.4,103.2,-131).lineTo(103.2,-131.1).lineTo(103,-131.6).curveTo(103,-134,104.5,-135.4).curveTo(106,-136.6,108,-136.6).curveTo(110.1,-136.6,111.5,-135.4).curveTo(113,-134,113,-131.7).lineTo(113,-131.4).lineTo(112.9,-130.7).lineTo(113,-129.7).lineTo(113,-129.6).curveTo(113,-128,112,-126.6).curveTo(110.6,-124.6,108,-124.6).curveTo(104.8,-124.6,103.6,-127.3).closePath().moveTo(85.6,-161.3).lineTo(85,-163.6).curveTo(85,-164.4,85.2,-165).lineTo(85.2,-165.1).lineTo(85,-165.6).curveTo(85,-168,86.5,-169.4).curveTo(88,-170.6,90,-170.6).curveTo(92.1,-170.6,93.5,-169.4).curveTo(95,-168,95,-165.7).lineTo(95,-165.4).lineTo(94.9,-164.7).lineTo(95,-163.7).lineTo(95,-163.6).curveTo(95,-162,94,-160.6).curveTo(92.6,-158.6,90,-158.6).curveTo(86.8,-158.6,85.6,-161.3).closePath().moveTo(-154.5,-161.3).lineTo(-155,-163.6).curveTo(-155,-164.4,-154.8,-165).lineTo(-154.8,-165.1).lineTo(-155,-165.6).curveTo(-155,-168,-153.5,-169.4).curveTo(-152.1,-170.6,-150,-170.6).curveTo(-148,-170.6,-146.6,-169.4).curveTo(-145.1,-168,-145,-165.7).lineTo(-145,-165.4).lineTo(-145.1,-164.7).lineTo(-145,-163.7).lineTo(-145,-163.6).curveTo(-145,-162,-146,-160.6).curveTo(-147.4,-158.6,-150,-158.6).curveTo(-153.3,-158.6,-154.5,-161.3).closePath().moveTo(29.6,-162.1).lineTo(29,-164.4).curveTo(29,-165.2,29.2,-165.8).lineTo(29.2,-165.9).lineTo(29,-166.4).curveTo(29,-168.8,30.6,-170.2).curveTo(32,-171.4,34,-171.4).curveTo(36.1,-171.4,37.4,-170.2).curveTo(39,-168.8,39,-166.5).lineTo(39,-166.2).lineTo(38.9,-165.5).lineTo(39,-164.5).lineTo(39,-164.4).curveTo(39,-162.8,38,-161.4).curveTo(36.6,-159.4,34,-159.4).curveTo(30.8,-159.4,29.6,-162.1).closePath();
	this.shape_45.setTransform(264.9,295.975);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(78.4,-116.8).lineTo(78.4,-144.4).curveTo(78.6,-141.7,81.4,-139.7).curveTo(84.4,-137.6,88.6,-137.6).moveTo(60.4,-150.8).lineTo(60.4,-178.4).curveTo(60.6,-175.7,63.4,-173.7).curveTo(66.4,-171.6,70.6,-171.6).moveTo(169.4,-118.8).lineTo(169.4,-146.4).curveTo(169.6,-143.7,172.4,-141.7).curveTo(175.4,-139.6,179.6,-139.6).moveTo(120.4,-90.8).lineTo(120.4,-118.4).curveTo(120.6,-115.7,123.4,-113.7).curveTo(126.4,-111.6,130.6,-111.6).moveTo(120.4,-0.8).lineTo(120.4,-28.4).curveTo(120.6,-25.7,123.4,-23.7).curveTo(126.4,-21.6,130.6,-21.6).moveTo(60.4,-40.8).lineTo(60.4,-68.4).curveTo(60.6,-65.7,63.4,-63.7).curveTo(66.4,-61.6,70.6,-61.6).moveTo(50.4,53.2).lineTo(50.4,25.6).curveTo(50.6,28.3,53.4,30.3).curveTo(56.4,32.4,60.6,32.4).moveTo(113.4,88).lineTo(113.4,60.4).curveTo(113.5,63.1,116.4,65.1).curveTo(119.3,67.2,123.5,67.2).moveTo(-79.5,-105.8).lineTo(-79.5,-133.4).curveTo(-79.4,-130.7,-76.6,-128.7).curveTo(-73.6,-126.6,-69.4,-126.6).moveTo(4.4,-151.6).lineTo(4.4,-179.2).curveTo(4.6,-176.5,7.4,-174.5).curveTo(10.4,-172.4,14.6,-172.4).moveTo(-179.5,-150.8).lineTo(-179.5,-178.4).curveTo(-179.4,-175.7,-176.6,-173.7).curveTo(-173.6,-171.6,-169.4,-171.6).moveTo(-143.5,71.2).lineTo(-143.5,43.5).curveTo(-143.4,46.3,-140.6,48.3).curveTo(-137.6,50.3,-133.4,50.3).moveTo(4.4,-49.8).lineTo(4.4,-77.4).curveTo(4.6,-74.7,7.4,-72.7).curveTo(10.4,-70.6,14.6,-70.6).moveTo(-24.6,88.2).lineTo(-24.6,60.6).curveTo(-24.4,63.3,-21.6,65.3).curveTo(-18.6,67.4,-14.4,67.4).moveTo(120.4,151.2).lineTo(120.4,123.6).curveTo(120.6,126.3,123.4,128.3).curveTo(126.4,130.4,130.6,130.4).moveTo(30.4,179.2).lineTo(30.4,151.6).curveTo(30.6,154.3,33.4,156.3).curveTo(36.4,158.4,40.6,158.4);
	this.shape_46.setTransform(299.45,281.025);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.beginFill("#000000").beginStroke().moveTo(31.1,168.7).lineTo(30.5,166.4).curveTo(30.5,165.6,30.7,165).lineTo(30.7,164.9).lineTo(30.5,164.4).curveTo(30.5,162,32.1,160.6).curveTo(33.4,159.4,35.5,159.4).curveTo(37.6,159.4,38.9,160.6).curveTo(40.4,162,40.5,164.3).lineTo(40.5,164.6).lineTo(40.4,165.3).lineTo(40.5,166.3).lineTo(40.5,166.4).curveTo(40.5,168,39.5,169.4).curveTo(38.1,171.4,35.5,171.4).curveTo(32.2,171.4,31.1,168.7).closePath().moveTo(121.1,140.7).lineTo(120.5,138.4).curveTo(120.5,137.6,120.7,137).lineTo(120.7,136.9).lineTo(120.5,136.4).curveTo(120.5,134,122.1,132.6).curveTo(123.4,131.4,125.5,131.4).curveTo(127.6,131.4,128.9,132.6).curveTo(130.5,134,130.5,136.3).lineTo(130.5,136.6).lineTo(130.4,137.3).lineTo(130.5,138.3).lineTo(130.5,138.4).curveTo(130.5,140,129.5,141.4).curveTo(128.1,143.4,125.5,143.4).curveTo(122.2,143.4,121.1,140.7).closePath().moveTo(-24,77.7).lineTo(-24.5,75.4).curveTo(-24.5,74.6,-24.3,74).lineTo(-24.3,73.9).lineTo(-24.5,73.4).curveTo(-24.5,71,-22.9,69.6).curveTo(-21.6,68.4,-19.5,68.4).curveTo(-17.5,68.4,-16.1,69.6).curveTo(-14.6,71,-14.5,73.3).lineTo(-14.5,73.6).lineTo(-14.6,74.3).lineTo(-14.5,75.3).lineTo(-14.5,75.4).curveTo(-14.5,77,-15.5,78.4).curveTo(-16.9,80.4,-19.5,80.4).curveTo(-22.8,80.4,-24,77.7).closePath().moveTo(114,77.5).lineTo(113.4,75.2).curveTo(113.4,74.4,113.6,73.8).lineTo(113.6,73.7).lineTo(113.4,73.2).curveTo(113.5,70.8,115,69.4).curveTo(116.4,68.2,118.5,68.2).curveTo(120.5,68.2,121.9,69.4).curveTo(123.4,70.8,123.4,73.1).lineTo(123.4,73.4).lineTo(123.3,74.1).lineTo(123.4,75.1).lineTo(123.4,75.2).curveTo(123.5,76.8,122.4,78.2).curveTo(121.1,80.2,118.5,80.2).curveTo(115.2,80.2,114,77.5).closePath().moveTo(-143,60.6).lineTo(-143.5,58.4).curveTo(-143.5,57.6,-143.3,56.9).lineTo(-143.3,56.9).lineTo(-143.5,56.4).curveTo(-143.5,54,-142,52.6).curveTo(-140.6,51.3,-138.5,51.3).curveTo(-136.5,51.3,-135.1,52.6).curveTo(-133.6,53.9,-133.5,56.2).lineTo(-133.5,56.5).lineTo(-133.6,57.3).lineTo(-133.5,58.2).lineTo(-133.5,58.4).curveTo(-133.5,59.9,-134.5,61.4).curveTo(-135.9,63.4,-138.5,63.4).curveTo(-141.8,63.4,-143,60.6).closePath().moveTo(51.1,42.7).lineTo(50.5,40.4).curveTo(50.5,39.6,50.7,39).lineTo(50.7,38.9).lineTo(50.5,38.4).curveTo(50.5,36,52.1,34.6).curveTo(53.5,33.4,55.5,33.4).curveTo(57.5,33.4,59,34.6).curveTo(60.5,36,60.5,38.3).lineTo(60.5,38.6).lineTo(60.4,39.3).lineTo(60.5,40.3).lineTo(60.5,40.4).curveTo(60.5,42,59.5,43.4).curveTo(58.1,45.4,55.5,45.4).curveTo(52.3,45.4,51.1,42.7).closePath().moveTo(121.1,-11.3).lineTo(120.5,-13.6).curveTo(120.5,-14.4,120.7,-15).lineTo(120.7,-15.1).lineTo(120.5,-15.6).curveTo(120.5,-18,122.1,-19.4).curveTo(123.4,-20.6,125.5,-20.6).curveTo(127.6,-20.6,128.9,-19.4).curveTo(130.5,-18,130.5,-15.7).lineTo(130.5,-15.4).lineTo(130.4,-14.7).lineTo(130.5,-13.7).lineTo(130.5,-13.6).curveTo(130.5,-12,129.5,-10.6).curveTo(128.1,-8.6,125.5,-8.6).curveTo(122.2,-8.6,121.1,-11.3).closePath().moveTo(61.1,-51.3).lineTo(60.5,-53.6).curveTo(60.5,-54.4,60.7,-55).lineTo(60.7,-55.1).lineTo(60.5,-55.6).curveTo(60.5,-58,62,-59.4).curveTo(63.5,-60.6,65.5,-60.6).curveTo(67.6,-60.6,69,-59.4).curveTo(70.5,-58,70.5,-55.7).lineTo(70.5,-55.4).lineTo(70.4,-54.7).lineTo(70.5,-53.7).lineTo(70.5,-53.6).curveTo(70.5,-52,69.5,-50.6).curveTo(68.1,-48.6,65.5,-48.6).curveTo(62.3,-48.6,61.1,-51.3).closePath().moveTo(5.1,-60.3).lineTo(4.5,-62.6).curveTo(4.5,-63.4,4.7,-64).lineTo(4.7,-64.1).lineTo(4.5,-64.6).curveTo(4.5,-67,6.1,-68.4).curveTo(7.5,-69.6,9.5,-69.6).curveTo(11.6,-69.6,12.9,-68.4).curveTo(14.5,-67,14.5,-64.7).lineTo(14.5,-64.4).lineTo(14.4,-63.7).lineTo(14.5,-62.7).lineTo(14.5,-62.6).curveTo(14.5,-61,13.5,-59.6).curveTo(12.1,-57.6,9.5,-57.6).curveTo(6.3,-57.6,5.1,-60.3).closePath().moveTo(121.1,-101.3).lineTo(120.5,-103.6).curveTo(120.5,-104.4,120.7,-105).lineTo(120.7,-105.1).lineTo(120.5,-105.6).curveTo(120.5,-108,122.1,-109.4).curveTo(123.4,-110.6,125.5,-110.6).curveTo(127.6,-110.6,128.9,-109.4).curveTo(130.5,-108,130.5,-105.7).lineTo(130.5,-105.4).lineTo(130.4,-104.7).lineTo(130.5,-103.7).lineTo(130.5,-103.6).curveTo(130.5,-102,129.5,-100.6).curveTo(128.1,-98.6,125.5,-98.6).curveTo(122.2,-98.6,121.1,-101.3).closePath().moveTo(-79,-116.3).lineTo(-79.5,-118.6).curveTo(-79.5,-119.4,-79.3,-120).lineTo(-79.3,-120.1).lineTo(-79.5,-120.6).curveTo(-79.5,-123,-78,-124.4).curveTo(-76.6,-125.6,-74.5,-125.6).curveTo(-72.5,-125.6,-71.1,-124.4).curveTo(-69.6,-123,-69.5,-120.7).lineTo(-69.5,-120.4).lineTo(-69.6,-119.7).lineTo(-69.5,-118.7).lineTo(-69.5,-118.6).curveTo(-69.5,-117,-70.5,-115.6).curveTo(-71.9,-113.6,-74.5,-113.6).curveTo(-77.8,-113.6,-79,-116.3).closePath().moveTo(79.1,-127.3).lineTo(78.5,-129.6).curveTo(78.5,-130.4,78.7,-131).lineTo(78.7,-131.1).lineTo(78.5,-131.6).curveTo(78.5,-134,80,-135.4).curveTo(81.5,-136.6,83.5,-136.6).curveTo(85.6,-136.6,87,-135.4).curveTo(88.5,-134,88.5,-131.7).lineTo(88.5,-131.4).lineTo(88.4,-130.7).lineTo(88.5,-129.7).lineTo(88.5,-129.6).curveTo(88.5,-128,87.5,-126.6).curveTo(86.1,-124.6,83.5,-124.6).curveTo(80.3,-124.6,79.1,-127.3).closePath().moveTo(170,-129.3).lineTo(169.5,-131.6).curveTo(169.5,-132.4,169.7,-133).lineTo(169.7,-133.1).lineTo(169.5,-133.6).curveTo(169.5,-136,171,-137.4).curveTo(172.5,-138.6,174.5,-138.6).curveTo(176.6,-138.6,178,-137.4).curveTo(179.5,-136,179.5,-133.7).lineTo(179.5,-133.4).lineTo(179.4,-132.7).lineTo(179.5,-131.7).lineTo(179.5,-131.6).curveTo(179.5,-130,178.5,-128.6).curveTo(177.1,-126.6,174.5,-126.6).curveTo(171.3,-126.6,170,-129.3).closePath().moveTo(61.1,-161.3).lineTo(60.5,-163.6).curveTo(60.5,-164.4,60.7,-165).lineTo(60.7,-165.1).lineTo(60.5,-165.6).curveTo(60.5,-168,62,-169.4).curveTo(63.5,-170.6,65.5,-170.6).curveTo(67.6,-170.6,69,-169.4).curveTo(70.5,-168,70.5,-165.7).lineTo(70.5,-165.4).lineTo(70.4,-164.7).lineTo(70.5,-163.7).lineTo(70.5,-163.6).curveTo(70.5,-162,69.5,-160.6).curveTo(68.1,-158.6,65.5,-158.6).curveTo(62.3,-158.6,61.1,-161.3).closePath().moveTo(-179,-161.3).lineTo(-179.5,-163.6).curveTo(-179.5,-164.4,-179.3,-165).lineTo(-179.3,-165.1).lineTo(-179.5,-165.6).curveTo(-179.5,-168,-178,-169.4).curveTo(-176.6,-170.6,-174.5,-170.6).curveTo(-172.5,-170.6,-171.1,-169.4).curveTo(-169.6,-168,-169.5,-165.7).lineTo(-169.5,-165.4).lineTo(-169.6,-164.7).lineTo(-169.5,-163.7).lineTo(-169.5,-163.6).curveTo(-169.5,-162,-170.5,-160.6).curveTo(-171.9,-158.6,-174.5,-158.6).curveTo(-177.8,-158.6,-179,-161.3).closePath().moveTo(5.1,-162.1).lineTo(4.5,-164.4).curveTo(4.5,-165.2,4.7,-165.8).lineTo(4.7,-165.9).lineTo(4.5,-166.4).curveTo(4.5,-168.8,6.1,-170.2).curveTo(7.5,-171.4,9.5,-171.4).curveTo(11.6,-171.4,12.9,-170.2).curveTo(14.5,-168.8,14.5,-166.5).lineTo(14.5,-166.2).lineTo(14.4,-165.5).lineTo(14.5,-164.5).lineTo(14.5,-164.4).curveTo(14.5,-162.8,13.5,-161.4).curveTo(12.1,-159.4,9.5,-159.4).curveTo(6.3,-159.4,5.1,-162.1).closePath();
	this.shape_47.setTransform(289.4,295.975);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(189.9,-156.7).lineTo(189.9,-184.3).curveTo(190.1,-181.6,192.9,-179.6).curveTo(195.8,-177.5,200.1,-177.5).moveTo(57.9,-111.7).lineTo(57.9,-139.3).curveTo(58.1,-136.6,60.9,-134.6).curveTo(63.9,-132.5,68.1,-132.5).moveTo(39.9,-145.7).lineTo(39.9,-173.3).curveTo(40.1,-170.6,42.9,-168.6).curveTo(45.9,-166.5,50.1,-166.5).moveTo(148.9,-113.7).lineTo(148.9,-141.3).curveTo(149.1,-138.6,151.9,-136.6).curveTo(154.9,-134.5,159.1,-134.5).moveTo(99.9,-85.7).lineTo(99.9,-113.3).curveTo(100.1,-110.6,102.9,-108.6).curveTo(105.9,-106.5,110.1,-106.5).moveTo(99.9,4.3).lineTo(99.9,-23.3).curveTo(100.1,-20.6,102.9,-18.6).curveTo(105.9,-16.5,110.1,-16.5).moveTo(39.9,-35.7).lineTo(39.9,-63.3).curveTo(40.1,-60.6,42.9,-58.6).curveTo(45.9,-56.5,50.1,-56.5).moveTo(29.9,58.3).lineTo(29.9,30.7).curveTo(30.1,33.4,32.9,35.4).curveTo(35.9,37.5,40.1,37.5).moveTo(92.9,93.1).lineTo(92.9,65.5).curveTo(93,68.2,95.9,70.2).curveTo(98.8,72.3,103,72.3).moveTo(-100,-100.7).lineTo(-100,-128.3).curveTo(-99.9,-125.6,-97.1,-123.6).curveTo(-94.1,-121.5,-89.9,-121.5).moveTo(-16.1,-146.5).lineTo(-16.1,-174.1).curveTo(-15.9,-171.4,-13.1,-169.4).curveTo(-10.1,-167.3,-5.9,-167.3).moveTo(-200,-145.7).lineTo(-200,-173.3).curveTo(-199.9,-170.6,-197.1,-168.6).curveTo(-194.1,-166.5,-189.9,-166.5).moveTo(-164,76.3).lineTo(-164,48.6).curveTo(-163.9,51.4,-161.1,53.4).curveTo(-158.1,55.4,-153.9,55.4).moveTo(-16.1,-44.7).lineTo(-16.1,-72.3).curveTo(-15.9,-69.6,-13.1,-67.6).curveTo(-10.1,-65.5,-5.9,-65.5).moveTo(-45.1,93.3).lineTo(-45.1,65.7).curveTo(-44.9,68.4,-42.1,70.4).curveTo(-39.1,72.5,-34.9,72.5).moveTo(99.9,156.3).lineTo(99.9,128.7).curveTo(100.1,131.4,102.9,133.4).curveTo(105.9,135.5,110.1,135.5).moveTo(9.9,184.3).lineTo(9.9,156.7).curveTo(10.1,159.4,12.9,161.4).curveTo(15.9,163.5,20.1,163.5);
	this.shape_48.setTransform(319.95,275.925);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.beginFill("#000000").beginStroke().moveTo(10.6,173.8).lineTo(10,171.5).curveTo(10,170.7,10.2,170.1).lineTo(10.2,170).lineTo(10,169.5).curveTo(10,167.1,11.6,165.7).curveTo(12.9,164.5,15,164.5).curveTo(17.1,164.5,18.4,165.7).curveTo(19.9,167.1,20,169.4).lineTo(20,169.7).lineTo(19.9,170.4).lineTo(20,171.4).lineTo(20,171.5).curveTo(20,173.1,19,174.5).curveTo(17.6,176.5,15,176.5).curveTo(11.7,176.5,10.6,173.8).closePath().moveTo(100.6,145.8).lineTo(100,143.5).curveTo(100,142.7,100.2,142.1).lineTo(100.2,142).lineTo(100,141.5).curveTo(100,139.1,101.6,137.7).curveTo(102.9,136.5,105,136.5).curveTo(107.1,136.5,108.4,137.7).curveTo(110,139.1,110,141.4).lineTo(110,141.7).lineTo(109.9,142.4).lineTo(110,143.4).lineTo(110,143.5).curveTo(110,145.1,109,146.5).curveTo(107.6,148.5,105,148.5).curveTo(101.7,148.5,100.6,145.8).closePath().moveTo(-44.5,82.8).lineTo(-45,80.5).curveTo(-45,79.7,-44.8,79.1).lineTo(-44.8,79).lineTo(-45,78.5).curveTo(-45,76.1,-43.4,74.7).curveTo(-42.1,73.5,-40,73.5).curveTo(-38,73.5,-36.6,74.7).curveTo(-35.1,76.1,-35,78.4).lineTo(-35,78.7).lineTo(-35.1,79.4).lineTo(-35,80.4).lineTo(-35,80.5).curveTo(-35,82.1,-36,83.5).curveTo(-37.4,85.5,-40,85.5).curveTo(-43.3,85.5,-44.5,82.8).closePath().moveTo(93.5,82.6).lineTo(92.9,80.3).curveTo(92.9,79.5,93.1,78.9).lineTo(93.1,78.8).lineTo(92.9,78.3).curveTo(93,75.9,94.5,74.5).curveTo(95.9,73.3,98,73.3).curveTo(100,73.3,101.4,74.5).curveTo(102.9,75.9,102.9,78.2).lineTo(102.9,78.5).lineTo(102.8,79.2).lineTo(102.9,80.2).lineTo(102.9,80.3).curveTo(103,81.9,101.9,83.3).curveTo(100.6,85.3,98,85.3).curveTo(94.7,85.3,93.5,82.6).closePath().moveTo(-163.5,65.7).lineTo(-164,63.5).curveTo(-164,62.7,-163.8,62).lineTo(-163.8,62).lineTo(-164,61.5).curveTo(-164,59.1,-162.5,57.7).curveTo(-161.1,56.4,-159,56.4).curveTo(-157,56.4,-155.6,57.7).curveTo(-154.1,59,-154,61.3).lineTo(-154,61.6).lineTo(-154.1,62.4).lineTo(-154,63.3).lineTo(-154,63.5).curveTo(-154,65,-155,66.5).curveTo(-156.4,68.5,-159,68.5).curveTo(-162.3,68.5,-163.5,65.7).closePath().moveTo(30.6,47.8).lineTo(30,45.5).curveTo(30,44.7,30.2,44.1).lineTo(30.2,44).lineTo(30,43.5).curveTo(30,41.1,31.6,39.7).curveTo(33,38.5,35,38.5).curveTo(37,38.5,38.5,39.7).curveTo(40,41.1,40,43.4).lineTo(40,43.7).lineTo(39.9,44.4).lineTo(40,45.4).lineTo(40,45.5).curveTo(40,47.1,39,48.5).curveTo(37.6,50.5,35,50.5).curveTo(31.8,50.5,30.6,47.8).closePath().moveTo(100.6,-6.2).lineTo(100,-8.5).curveTo(100,-9.3,100.2,-9.9).lineTo(100.2,-10).lineTo(100,-10.5).curveTo(100,-12.9,101.6,-14.3).curveTo(102.9,-15.5,105,-15.5).curveTo(107.1,-15.5,108.4,-14.3).curveTo(110,-12.9,110,-10.6).lineTo(110,-10.3).lineTo(109.9,-9.6).lineTo(110,-8.6).lineTo(110,-8.5).curveTo(110,-6.9,109,-5.5).curveTo(107.6,-3.5,105,-3.5).curveTo(101.7,-3.5,100.6,-6.2).closePath().moveTo(40.6,-46.2).lineTo(40,-48.5).curveTo(40,-49.3,40.2,-49.9).lineTo(40.2,-50).lineTo(40,-50.5).curveTo(40,-52.9,41.5,-54.3).curveTo(43,-55.5,45,-55.5).curveTo(47.1,-55.5,48.5,-54.3).curveTo(50,-52.9,50,-50.6).lineTo(50,-50.3).lineTo(49.9,-49.6).lineTo(50,-48.6).lineTo(50,-48.5).curveTo(50,-46.9,49,-45.5).curveTo(47.6,-43.5,45,-43.5).curveTo(41.8,-43.5,40.6,-46.2).closePath().moveTo(-15.4,-55.2).lineTo(-16,-57.5).curveTo(-16,-58.3,-15.8,-58.9).lineTo(-15.8,-59).lineTo(-16,-59.5).curveTo(-16,-61.9,-14.4,-63.3).curveTo(-13,-64.5,-11,-64.5).curveTo(-8.9,-64.5,-7.6,-63.3).curveTo(-6,-61.9,-6,-59.6).lineTo(-6,-59.3).lineTo(-6.1,-58.6).lineTo(-6,-57.6).lineTo(-6,-57.5).curveTo(-6,-55.9,-7,-54.5).curveTo(-8.4,-52.5,-11,-52.5).curveTo(-14.2,-52.5,-15.4,-55.2).closePath().moveTo(100.6,-96.2).lineTo(100,-98.5).curveTo(100,-99.3,100.2,-99.9).lineTo(100.2,-100).lineTo(100,-100.5).curveTo(100,-102.9,101.6,-104.3).curveTo(102.9,-105.5,105,-105.5).curveTo(107.1,-105.5,108.4,-104.3).curveTo(110,-102.9,110,-100.6).lineTo(110,-100.3).lineTo(109.9,-99.6).lineTo(110,-98.6).lineTo(110,-98.5).curveTo(110,-96.9,109,-95.5).curveTo(107.6,-93.5,105,-93.5).curveTo(101.7,-93.5,100.6,-96.2).closePath().moveTo(-99.5,-111.2).lineTo(-100,-113.5).curveTo(-100,-114.3,-99.8,-114.9).lineTo(-99.8,-115).lineTo(-100,-115.5).curveTo(-100,-117.9,-98.5,-119.3).curveTo(-97.1,-120.5,-95,-120.5).curveTo(-93,-120.5,-91.6,-119.3).curveTo(-90.1,-117.9,-90,-115.6).lineTo(-90,-115.3).lineTo(-90.1,-114.6).lineTo(-90,-113.6).lineTo(-90,-113.5).curveTo(-90,-111.9,-91,-110.5).curveTo(-92.4,-108.5,-95,-108.5).curveTo(-98.3,-108.5,-99.5,-111.2).closePath().moveTo(58.6,-122.2).lineTo(58,-124.5).curveTo(58,-125.3,58.2,-125.9).lineTo(58.2,-126).lineTo(58,-126.5).curveTo(58,-128.9,59.5,-130.3).curveTo(61,-131.5,63,-131.5).curveTo(65.1,-131.5,66.5,-130.3).curveTo(68,-128.9,68,-126.6).lineTo(68,-126.3).lineTo(67.9,-125.6).lineTo(68,-124.6).lineTo(68,-124.5).curveTo(68,-122.9,67,-121.5).curveTo(65.6,-119.5,63,-119.5).curveTo(59.8,-119.5,58.6,-122.2).closePath().moveTo(149.5,-124.2).lineTo(149,-126.5).curveTo(149,-127.3,149.2,-127.9).lineTo(149.2,-128).lineTo(149,-128.5).curveTo(149,-130.9,150.5,-132.3).curveTo(152,-133.5,154,-133.5).curveTo(156.1,-133.5,157.5,-132.3).curveTo(159,-130.9,159,-128.6).lineTo(159,-128.3).lineTo(158.9,-127.6).lineTo(159,-126.6).lineTo(159,-126.5).curveTo(159,-124.9,158,-123.5).curveTo(156.6,-121.5,154,-121.5).curveTo(150.8,-121.5,149.5,-124.2).closePath().moveTo(40.6,-156.2).lineTo(40,-158.5).curveTo(40,-159.3,40.2,-159.9).lineTo(40.2,-160).lineTo(40,-160.5).curveTo(40,-162.9,41.5,-164.3).curveTo(43,-165.5,45,-165.5).curveTo(47.1,-165.5,48.5,-164.3).curveTo(50,-162.9,50,-160.6).lineTo(50,-160.3).lineTo(49.9,-159.6).lineTo(50,-158.6).lineTo(50,-158.5).curveTo(50,-156.9,49,-155.5).curveTo(47.6,-153.5,45,-153.5).curveTo(41.8,-153.5,40.6,-156.2).closePath().moveTo(-199.5,-156.2).lineTo(-200,-158.5).curveTo(-200,-159.3,-199.8,-159.9).lineTo(-199.8,-160).lineTo(-200,-160.5).curveTo(-200,-162.9,-198.5,-164.3).curveTo(-197.1,-165.5,-195,-165.5).curveTo(-193,-165.5,-191.6,-164.3).curveTo(-190.1,-162.9,-190,-160.6).lineTo(-190,-160.3).lineTo(-190.1,-159.6).lineTo(-190,-158.6).lineTo(-190,-158.5).curveTo(-190,-156.9,-191,-155.5).curveTo(-192.4,-153.5,-195,-153.5).curveTo(-198.3,-153.5,-199.5,-156.2).closePath().moveTo(-15.4,-157).lineTo(-16,-159.3).curveTo(-16,-160.1,-15.8,-160.7).lineTo(-15.8,-160.8).lineTo(-16,-161.3).curveTo(-16,-163.7,-14.4,-165.1).curveTo(-13,-166.3,-11,-166.3).curveTo(-8.9,-166.3,-7.6,-165.1).curveTo(-6,-163.7,-6,-161.4).lineTo(-6,-161.1).lineTo(-6.1,-160.4).lineTo(-6,-159.4).lineTo(-6,-159.3).curveTo(-6,-157.7,-7,-156.3).curveTo(-8.4,-154.3,-11,-154.3).curveTo(-14.2,-154.3,-15.4,-157).closePath().moveTo(190.6,-167.2).lineTo(190,-169.5).curveTo(190,-170.3,190.2,-170.9).lineTo(190.2,-171).lineTo(190,-171.5).curveTo(190,-173.9,191.6,-175.3).curveTo(192.9,-176.5,195,-176.5).curveTo(197.1,-176.5,198.4,-175.3).curveTo(200,-173.9,200,-171.6).lineTo(200,-171.3).lineTo(199.9,-170.6).lineTo(200,-169.6).lineTo(200,-169.5).curveTo(200,-167.9,199,-166.5).curveTo(197.6,-164.5,195,-164.5).curveTo(191.7,-164.5,190.6,-167.2).closePath();
	this.shape_49.setTransform(309.9,290.875);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(168.9,-156.7).lineTo(168.9,-184.3).curveTo(169.1,-181.6,171.9,-179.6).curveTo(174.8,-177.5,179.1,-177.5).moveTo(210.9,-149.7).lineTo(210.9,-177.3).curveTo(211.1,-174.6,213.9,-172.6).curveTo(216.8,-170.5,221.1,-170.5).moveTo(36.9,-111.7).lineTo(36.9,-139.3).curveTo(37.1,-136.6,39.9,-134.6).curveTo(42.9,-132.5,47.1,-132.5).moveTo(18.9,-145.7).lineTo(18.9,-173.3).curveTo(19.1,-170.6,21.9,-168.6).curveTo(24.9,-166.5,29.1,-166.5).moveTo(127.9,-113.7).lineTo(127.9,-141.3).curveTo(128.1,-138.6,130.9,-136.6).curveTo(133.9,-134.5,138.1,-134.5).moveTo(78.9,-85.7).lineTo(78.9,-113.3).curveTo(79.1,-110.6,81.9,-108.6).curveTo(84.9,-106.5,89.1,-106.5).moveTo(78.9,4.3).lineTo(78.9,-23.3).curveTo(79.1,-20.6,81.9,-18.6).curveTo(84.9,-16.5,89.1,-16.5).moveTo(18.9,-35.7).lineTo(18.9,-63.3).curveTo(19.1,-60.6,21.9,-58.6).curveTo(24.9,-56.5,29.1,-56.5).moveTo(8.9,58.3).lineTo(8.9,30.7).curveTo(9.1,33.4,11.9,35.4).curveTo(14.9,37.5,19.1,37.5).moveTo(71.9,93.1).lineTo(71.9,65.5).curveTo(72,68.2,74.9,70.2).curveTo(77.8,72.3,82,72.3).moveTo(-121,-100.7).lineTo(-121,-128.3).curveTo(-120.9,-125.6,-118.1,-123.6).curveTo(-115.1,-121.5,-110.9,-121.5).moveTo(-37.1,-146.5).lineTo(-37.1,-174.1).curveTo(-36.9,-171.4,-34.1,-169.4).curveTo(-31.1,-167.3,-26.9,-167.3).moveTo(-221,-145.7).lineTo(-221,-173.3).curveTo(-220.9,-170.6,-218.1,-168.6).curveTo(-215.1,-166.5,-210.9,-166.5).moveTo(-185,76.3).lineTo(-185,48.6).curveTo(-184.9,51.4,-182.1,53.4).curveTo(-179.1,55.4,-174.9,55.4).moveTo(-37.1,-44.7).lineTo(-37.1,-72.3).curveTo(-36.9,-69.6,-34.1,-67.6).curveTo(-31.1,-65.5,-26.9,-65.5).moveTo(-66.1,93.3).lineTo(-66.1,65.7).curveTo(-65.9,68.4,-63.1,70.4).curveTo(-60.1,72.5,-55.9,72.5).moveTo(78.9,156.3).lineTo(78.9,128.7).curveTo(79.1,131.4,81.9,133.4).curveTo(84.9,135.5,89.1,135.5).moveTo(-11.1,184.3).lineTo(-11.1,156.7).curveTo(-10.9,159.4,-8.1,161.4).curveTo(-5.1,163.5,-0.9,163.5);
	this.shape_50.setTransform(340.95,275.925);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.beginFill("#000000").beginStroke().moveTo(-10.4,173.8).lineTo(-11,171.5).curveTo(-11,170.7,-10.8,170.1).lineTo(-10.8,170).lineTo(-11,169.5).curveTo(-11,167.1,-9.4,165.7).curveTo(-8.1,164.5,-6,164.5).curveTo(-3.9,164.5,-2.6,165.7).curveTo(-1.1,167.1,-1,169.4).lineTo(-1,169.7).lineTo(-1.1,170.4).lineTo(-1,171.4).lineTo(-1,171.5).curveTo(-1,173.1,-2,174.5).curveTo(-3.4,176.5,-6,176.5).curveTo(-9.3,176.5,-10.4,173.8).closePath().moveTo(79.6,145.8).lineTo(79,143.5).curveTo(79,142.7,79.2,142.1).lineTo(79.2,142).lineTo(79,141.5).curveTo(79,139.1,80.6,137.7).curveTo(81.9,136.5,84,136.5).curveTo(86.1,136.5,87.4,137.7).curveTo(89,139.1,89,141.4).lineTo(89,141.7).lineTo(88.9,142.4).lineTo(89,143.4).lineTo(89,143.5).curveTo(89,145.1,88,146.5).curveTo(86.6,148.5,84,148.5).curveTo(80.7,148.5,79.6,145.8).closePath().moveTo(-65.5,82.8).lineTo(-66,80.5).curveTo(-66,79.7,-65.8,79.1).lineTo(-65.8,79).lineTo(-66,78.5).curveTo(-66,76.1,-64.4,74.7).curveTo(-63.1,73.5,-61,73.5).curveTo(-59,73.5,-57.6,74.7).curveTo(-56.1,76.1,-56,78.4).lineTo(-56,78.7).lineTo(-56.1,79.4).lineTo(-56,80.4).lineTo(-56,80.5).curveTo(-56,82.1,-57,83.5).curveTo(-58.4,85.5,-61,85.5).curveTo(-64.3,85.5,-65.5,82.8).closePath().moveTo(72.5,82.6).lineTo(71.9,80.3).curveTo(71.9,79.5,72.1,78.9).lineTo(72.1,78.8).lineTo(71.9,78.3).curveTo(72,75.9,73.5,74.5).curveTo(74.9,73.3,77,73.3).curveTo(79,73.3,80.4,74.5).curveTo(81.9,75.9,81.9,78.2).lineTo(81.9,78.5).lineTo(81.8,79.2).lineTo(81.9,80.2).lineTo(81.9,80.3).curveTo(82,81.9,80.9,83.3).curveTo(79.6,85.3,77,85.3).curveTo(73.7,85.3,72.5,82.6).closePath().moveTo(-184.5,65.7).lineTo(-185,63.5).curveTo(-185,62.7,-184.8,62).lineTo(-184.8,62).lineTo(-185,61.5).curveTo(-185,59.1,-183.5,57.7).curveTo(-182.1,56.4,-180,56.4).curveTo(-178,56.4,-176.6,57.7).curveTo(-175.1,59,-175,61.3).lineTo(-175,61.6).lineTo(-175.1,62.4).lineTo(-175,63.3).lineTo(-175,63.5).curveTo(-175,65,-176,66.5).curveTo(-177.4,68.5,-180,68.5).curveTo(-183.3,68.5,-184.5,65.7).closePath().moveTo(9.6,47.8).lineTo(9,45.5).curveTo(9,44.7,9.2,44.1).lineTo(9.2,44).lineTo(9,43.5).curveTo(9,41.1,10.6,39.7).curveTo(12,38.5,14,38.5).curveTo(16,38.5,17.5,39.7).curveTo(19,41.1,19,43.4).lineTo(19,43.7).lineTo(18.9,44.4).lineTo(19,45.4).lineTo(19,45.5).curveTo(19,47.1,18,48.5).curveTo(16.6,50.5,14,50.5).curveTo(10.8,50.5,9.6,47.8).closePath().moveTo(79.6,-6.2).lineTo(79,-8.5).curveTo(79,-9.3,79.2,-9.9).lineTo(79.2,-10).lineTo(79,-10.5).curveTo(79,-12.9,80.6,-14.3).curveTo(81.9,-15.5,84,-15.5).curveTo(86.1,-15.5,87.4,-14.3).curveTo(89,-12.9,89,-10.6).lineTo(89,-10.3).lineTo(88.9,-9.6).lineTo(89,-8.6).lineTo(89,-8.5).curveTo(89,-6.9,88,-5.5).curveTo(86.6,-3.5,84,-3.5).curveTo(80.7,-3.5,79.6,-6.2).closePath().moveTo(19.6,-46.2).lineTo(19,-48.5).curveTo(19,-49.3,19.2,-49.9).lineTo(19.2,-50).lineTo(19,-50.5).curveTo(19,-52.9,20.5,-54.3).curveTo(22,-55.5,24,-55.5).curveTo(26.1,-55.5,27.5,-54.3).curveTo(29,-52.9,29,-50.6).lineTo(29,-50.3).lineTo(28.9,-49.6).lineTo(29,-48.6).lineTo(29,-48.5).curveTo(29,-46.9,28,-45.5).curveTo(26.6,-43.5,24,-43.5).curveTo(20.8,-43.5,19.6,-46.2).closePath().moveTo(-36.4,-55.2).lineTo(-37,-57.5).curveTo(-37,-58.3,-36.8,-58.9).lineTo(-36.8,-59).lineTo(-37,-59.5).curveTo(-37,-61.9,-35.4,-63.3).curveTo(-34,-64.5,-32,-64.5).curveTo(-29.9,-64.5,-28.6,-63.3).curveTo(-27,-61.9,-27,-59.6).lineTo(-27,-59.3).lineTo(-27.1,-58.6).lineTo(-27,-57.6).lineTo(-27,-57.5).curveTo(-27,-55.9,-28,-54.5).curveTo(-29.4,-52.5,-32,-52.5).curveTo(-35.2,-52.5,-36.4,-55.2).closePath().moveTo(79.6,-96.2).lineTo(79,-98.5).curveTo(79,-99.3,79.2,-99.9).lineTo(79.2,-100).lineTo(79,-100.5).curveTo(79,-102.9,80.6,-104.3).curveTo(81.9,-105.5,84,-105.5).curveTo(86.1,-105.5,87.4,-104.3).curveTo(89,-102.9,89,-100.6).lineTo(89,-100.3).lineTo(88.9,-99.6).lineTo(89,-98.6).lineTo(89,-98.5).curveTo(89,-96.9,88,-95.5).curveTo(86.6,-93.5,84,-93.5).curveTo(80.7,-93.5,79.6,-96.2).closePath().moveTo(-120.5,-111.2).lineTo(-121,-113.5).curveTo(-121,-114.3,-120.8,-114.9).lineTo(-120.8,-115).lineTo(-121,-115.5).curveTo(-121,-117.9,-119.5,-119.3).curveTo(-118.1,-120.5,-116,-120.5).curveTo(-114,-120.5,-112.6,-119.3).curveTo(-111.1,-117.9,-111,-115.6).lineTo(-111,-115.3).lineTo(-111.1,-114.6).lineTo(-111,-113.6).lineTo(-111,-113.5).curveTo(-111,-111.9,-112,-110.5).curveTo(-113.4,-108.5,-116,-108.5).curveTo(-119.3,-108.5,-120.5,-111.2).closePath().moveTo(37.6,-122.2).lineTo(37,-124.5).curveTo(37,-125.3,37.2,-125.9).lineTo(37.2,-126).lineTo(37,-126.5).curveTo(37,-128.9,38.5,-130.3).curveTo(40,-131.5,42,-131.5).curveTo(44.1,-131.5,45.5,-130.3).curveTo(47,-128.9,47,-126.6).lineTo(47,-126.3).lineTo(46.9,-125.6).lineTo(47,-124.6).lineTo(47,-124.5).curveTo(47,-122.9,46,-121.5).curveTo(44.6,-119.5,42,-119.5).curveTo(38.8,-119.5,37.6,-122.2).closePath().moveTo(128.5,-124.2).lineTo(128,-126.5).curveTo(128,-127.3,128.2,-127.9).lineTo(128.2,-128).lineTo(128,-128.5).curveTo(128,-130.9,129.5,-132.3).curveTo(131,-133.5,133,-133.5).curveTo(135.1,-133.5,136.5,-132.3).curveTo(138,-130.9,138,-128.6).lineTo(138,-128.3).lineTo(137.9,-127.6).lineTo(138,-126.6).lineTo(138,-126.5).curveTo(138,-124.9,137,-123.5).curveTo(135.6,-121.5,133,-121.5).curveTo(129.8,-121.5,128.5,-124.2).closePath().moveTo(19.6,-156.2).lineTo(19,-158.5).curveTo(19,-159.3,19.2,-159.9).lineTo(19.2,-160).lineTo(19,-160.5).curveTo(19,-162.9,20.5,-164.3).curveTo(22,-165.5,24,-165.5).curveTo(26.1,-165.5,27.5,-164.3).curveTo(29,-162.9,29,-160.6).lineTo(29,-160.3).lineTo(28.9,-159.6).lineTo(29,-158.6).lineTo(29,-158.5).curveTo(29,-156.9,28,-155.5).curveTo(26.6,-153.5,24,-153.5).curveTo(20.8,-153.5,19.6,-156.2).closePath().moveTo(-220.5,-156.2).lineTo(-221,-158.5).curveTo(-221,-159.3,-220.8,-159.9).lineTo(-220.8,-160).lineTo(-221,-160.5).curveTo(-221,-162.9,-219.5,-164.3).curveTo(-218.1,-165.5,-216,-165.5).curveTo(-214,-165.5,-212.6,-164.3).curveTo(-211.1,-162.9,-211,-160.6).lineTo(-211,-160.3).lineTo(-211.1,-159.6).lineTo(-211,-158.6).lineTo(-211,-158.5).curveTo(-211,-156.9,-212,-155.5).curveTo(-213.4,-153.5,-216,-153.5).curveTo(-219.3,-153.5,-220.5,-156.2).closePath().moveTo(-36.4,-157).lineTo(-37,-159.3).curveTo(-37,-160.1,-36.8,-160.7).lineTo(-36.8,-160.8).lineTo(-37,-161.3).curveTo(-37,-163.7,-35.4,-165.1).curveTo(-34,-166.3,-32,-166.3).curveTo(-29.9,-166.3,-28.6,-165.1).curveTo(-27,-163.7,-27,-161.4).lineTo(-27,-161.1).lineTo(-27.1,-160.4).lineTo(-27,-159.4).lineTo(-27,-159.3).curveTo(-27,-157.7,-28,-156.3).curveTo(-29.4,-154.3,-32,-154.3).curveTo(-35.2,-154.3,-36.4,-157).closePath().moveTo(211.5,-160.2).lineTo(211,-162.5).curveTo(211,-163.3,211.2,-163.9).lineTo(211.2,-164).lineTo(211,-164.5).curveTo(211,-166.9,212.5,-168.3).curveTo(213.9,-169.5,216,-169.5).curveTo(218,-169.5,219.4,-168.3).curveTo(220.9,-166.9,221,-164.6).lineTo(221,-164.3).lineTo(220.9,-163.6).lineTo(221,-162.6).lineTo(221,-162.5).curveTo(221,-160.9,220,-159.5).curveTo(218.6,-157.5,216,-157.5).curveTo(212.7,-157.5,211.5,-160.2).closePath().moveTo(169.6,-167.2).lineTo(169,-169.5).curveTo(169,-170.3,169.2,-170.9).lineTo(169.2,-171).lineTo(169,-171.5).curveTo(169,-173.9,170.6,-175.3).curveTo(171.9,-176.5,174,-176.5).curveTo(176.1,-176.5,177.4,-175.3).curveTo(179,-173.9,179,-171.6).lineTo(179,-171.3).lineTo(178.9,-170.6).lineTo(179,-169.6).lineTo(179,-169.5).curveTo(179,-167.9,178,-166.5).curveTo(176.6,-164.5,174,-164.5).curveTo(170.7,-164.5,169.6,-167.2).closePath();
	this.shape_51.setTransform(330.9,290.875);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(168.9,-156.7).lineTo(168.9,-184.3).curveTo(169.1,-181.6,171.9,-179.6).curveTo(174.8,-177.5,179.1,-177.5).moveTo(210.9,-149.7).lineTo(210.9,-177.3).curveTo(211.1,-174.6,213.9,-172.6).curveTo(216.8,-170.5,221.1,-170.5).moveTo(168.9,-93.7).lineTo(168.9,-121.3).curveTo(169.1,-118.6,171.9,-116.6).curveTo(174.8,-114.5,179.1,-114.5).moveTo(36.9,-111.7).lineTo(36.9,-139.3).curveTo(37.1,-136.6,39.9,-134.6).curveTo(42.9,-132.5,47.1,-132.5).moveTo(18.9,-145.7).lineTo(18.9,-173.3).curveTo(19.1,-170.6,21.9,-168.6).curveTo(24.9,-166.5,29.1,-166.5).moveTo(127.9,-113.7).lineTo(127.9,-141.3).curveTo(128.1,-138.6,130.9,-136.6).curveTo(133.9,-134.5,138.1,-134.5).moveTo(78.9,-85.7).lineTo(78.9,-113.3).curveTo(79.1,-110.6,81.9,-108.6).curveTo(84.9,-106.5,89.1,-106.5).moveTo(78.9,4.3).lineTo(78.9,-23.3).curveTo(79.1,-20.6,81.9,-18.6).curveTo(84.9,-16.5,89.1,-16.5).moveTo(18.9,-35.7).lineTo(18.9,-63.3).curveTo(19.1,-60.6,21.9,-58.6).curveTo(24.9,-56.5,29.1,-56.5).moveTo(8.9,58.3).lineTo(8.9,30.7).curveTo(9.1,33.4,11.9,35.4).curveTo(14.9,37.5,19.1,37.5).moveTo(71.9,93.1).lineTo(71.9,65.5).curveTo(72,68.2,74.9,70.2).curveTo(77.8,72.3,82,72.3).moveTo(-121,-100.7).lineTo(-121,-128.3).curveTo(-120.9,-125.6,-118.1,-123.6).curveTo(-115.1,-121.5,-110.9,-121.5).moveTo(-37.1,-146.5).lineTo(-37.1,-174.1).curveTo(-36.9,-171.4,-34.1,-169.4).curveTo(-31.1,-167.3,-26.9,-167.3).moveTo(-221,-145.7).lineTo(-221,-173.3).curveTo(-220.9,-170.6,-218.1,-168.6).curveTo(-215.1,-166.5,-210.9,-166.5).moveTo(-185,76.3).lineTo(-185,48.6).curveTo(-184.9,51.4,-182.1,53.4).curveTo(-179.1,55.4,-174.9,55.4).moveTo(-37.1,-44.7).lineTo(-37.1,-72.3).curveTo(-36.9,-69.6,-34.1,-67.6).curveTo(-31.1,-65.5,-26.9,-65.5).moveTo(-66.1,93.3).lineTo(-66.1,65.7).curveTo(-65.9,68.4,-63.1,70.4).curveTo(-60.1,72.5,-55.9,72.5).moveTo(78.9,156.3).lineTo(78.9,128.7).curveTo(79.1,131.4,81.9,133.4).curveTo(84.9,135.5,89.1,135.5).moveTo(-11.1,184.3).lineTo(-11.1,156.7).curveTo(-10.9,159.4,-8.1,161.4).curveTo(-5.1,163.5,-0.9,163.5);
	this.shape_52.setTransform(340.95,275.925);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.beginFill("#000000").beginStroke().moveTo(-10.4,173.8).lineTo(-11,171.5).curveTo(-11,170.7,-10.8,170.1).lineTo(-10.8,170).lineTo(-11,169.5).curveTo(-11,167.1,-9.4,165.7).curveTo(-8.1,164.5,-6,164.5).curveTo(-3.9,164.5,-2.6,165.7).curveTo(-1.1,167.1,-1,169.4).lineTo(-1,169.7).lineTo(-1.1,170.4).lineTo(-1,171.4).lineTo(-1,171.5).curveTo(-1,173.1,-2,174.5).curveTo(-3.4,176.5,-6,176.5).curveTo(-9.3,176.5,-10.4,173.8).closePath().moveTo(79.6,145.8).lineTo(79,143.5).curveTo(79,142.7,79.2,142.1).lineTo(79.2,142).lineTo(79,141.5).curveTo(79,139.1,80.6,137.7).curveTo(81.9,136.5,84,136.5).curveTo(86.1,136.5,87.4,137.7).curveTo(89,139.1,89,141.4).lineTo(89,141.7).lineTo(88.9,142.4).lineTo(89,143.4).lineTo(89,143.5).curveTo(89,145.1,88,146.5).curveTo(86.6,148.5,84,148.5).curveTo(80.7,148.5,79.6,145.8).closePath().moveTo(-65.5,82.8).lineTo(-66,80.5).curveTo(-66,79.7,-65.8,79.1).lineTo(-65.8,79).lineTo(-66,78.5).curveTo(-66,76.1,-64.4,74.7).curveTo(-63.1,73.5,-61,73.5).curveTo(-59,73.5,-57.6,74.7).curveTo(-56.1,76.1,-56,78.4).lineTo(-56,78.7).lineTo(-56.1,79.4).lineTo(-56,80.4).lineTo(-56,80.5).curveTo(-56,82.1,-57,83.5).curveTo(-58.4,85.5,-61,85.5).curveTo(-64.3,85.5,-65.5,82.8).closePath().moveTo(72.5,82.6).lineTo(71.9,80.3).curveTo(71.9,79.5,72.1,78.9).lineTo(72.1,78.8).lineTo(71.9,78.3).curveTo(72,75.9,73.5,74.5).curveTo(74.9,73.3,77,73.3).curveTo(79,73.3,80.4,74.5).curveTo(81.9,75.9,81.9,78.2).lineTo(81.9,78.5).lineTo(81.8,79.2).lineTo(81.9,80.2).lineTo(81.9,80.3).curveTo(82,81.9,80.9,83.3).curveTo(79.6,85.3,77,85.3).curveTo(73.7,85.3,72.5,82.6).closePath().moveTo(-184.5,65.7).lineTo(-185,63.5).curveTo(-185,62.7,-184.8,62).lineTo(-184.8,62).lineTo(-185,61.5).curveTo(-185,59.1,-183.5,57.7).curveTo(-182.1,56.4,-180,56.4).curveTo(-178,56.4,-176.6,57.7).curveTo(-175.1,59,-175,61.3).lineTo(-175,61.6).lineTo(-175.1,62.4).lineTo(-175,63.3).lineTo(-175,63.5).curveTo(-175,65,-176,66.5).curveTo(-177.4,68.5,-180,68.5).curveTo(-183.3,68.5,-184.5,65.7).closePath().moveTo(9.6,47.8).lineTo(9,45.5).curveTo(9,44.7,9.2,44.1).lineTo(9.2,44).lineTo(9,43.5).curveTo(9,41.1,10.6,39.7).curveTo(12,38.5,14,38.5).curveTo(16,38.5,17.5,39.7).curveTo(19,41.1,19,43.4).lineTo(19,43.7).lineTo(18.9,44.4).lineTo(19,45.4).lineTo(19,45.5).curveTo(19,47.1,18,48.5).curveTo(16.6,50.5,14,50.5).curveTo(10.8,50.5,9.6,47.8).closePath().moveTo(79.6,-6.2).lineTo(79,-8.5).curveTo(79,-9.3,79.2,-9.9).lineTo(79.2,-10).lineTo(79,-10.5).curveTo(79,-12.9,80.6,-14.3).curveTo(81.9,-15.5,84,-15.5).curveTo(86.1,-15.5,87.4,-14.3).curveTo(89,-12.9,89,-10.6).lineTo(89,-10.3).lineTo(88.9,-9.6).lineTo(89,-8.6).lineTo(89,-8.5).curveTo(89,-6.9,88,-5.5).curveTo(86.6,-3.5,84,-3.5).curveTo(80.7,-3.5,79.6,-6.2).closePath().moveTo(19.6,-46.2).lineTo(19,-48.5).curveTo(19,-49.3,19.2,-49.9).lineTo(19.2,-50).lineTo(19,-50.5).curveTo(19,-52.9,20.5,-54.3).curveTo(22,-55.5,24,-55.5).curveTo(26.1,-55.5,27.5,-54.3).curveTo(29,-52.9,29,-50.6).lineTo(29,-50.3).lineTo(28.9,-49.6).lineTo(29,-48.6).lineTo(29,-48.5).curveTo(29,-46.9,28,-45.5).curveTo(26.6,-43.5,24,-43.5).curveTo(20.8,-43.5,19.6,-46.2).closePath().moveTo(-36.4,-55.2).lineTo(-37,-57.5).curveTo(-37,-58.3,-36.8,-58.9).lineTo(-36.8,-59).lineTo(-37,-59.5).curveTo(-37,-61.9,-35.4,-63.3).curveTo(-34,-64.5,-32,-64.5).curveTo(-29.9,-64.5,-28.6,-63.3).curveTo(-27,-61.9,-27,-59.6).lineTo(-27,-59.3).lineTo(-27.1,-58.6).lineTo(-27,-57.6).lineTo(-27,-57.5).curveTo(-27,-55.9,-28,-54.5).curveTo(-29.4,-52.5,-32,-52.5).curveTo(-35.2,-52.5,-36.4,-55.2).closePath().moveTo(79.6,-96.2).lineTo(79,-98.5).curveTo(79,-99.3,79.2,-99.9).lineTo(79.2,-100).lineTo(79,-100.5).curveTo(79,-102.9,80.6,-104.3).curveTo(81.9,-105.5,84,-105.5).curveTo(86.1,-105.5,87.4,-104.3).curveTo(89,-102.9,89,-100.6).lineTo(89,-100.3).lineTo(88.9,-99.6).lineTo(89,-98.6).lineTo(89,-98.5).curveTo(89,-96.9,88,-95.5).curveTo(86.6,-93.5,84,-93.5).curveTo(80.7,-93.5,79.6,-96.2).closePath().moveTo(169.6,-104.2).lineTo(169,-106.5).curveTo(169,-107.3,169.2,-107.9).lineTo(169.2,-108).lineTo(169,-108.5).curveTo(169,-110.9,170.6,-112.3).curveTo(171.9,-113.5,174,-113.5).curveTo(176.1,-113.5,177.4,-112.3).curveTo(179,-110.9,179,-108.6).lineTo(179,-108.3).lineTo(178.9,-107.6).lineTo(179,-106.6).lineTo(179,-106.5).curveTo(179,-104.9,178,-103.5).curveTo(176.6,-101.5,174,-101.5).curveTo(170.7,-101.5,169.6,-104.2).closePath().moveTo(-120.5,-111.2).lineTo(-121,-113.5).curveTo(-121,-114.3,-120.8,-114.9).lineTo(-120.8,-115).lineTo(-121,-115.5).curveTo(-121,-117.9,-119.5,-119.3).curveTo(-118.1,-120.5,-116,-120.5).curveTo(-114,-120.5,-112.6,-119.3).curveTo(-111.1,-117.9,-111,-115.6).lineTo(-111,-115.3).lineTo(-111.1,-114.6).lineTo(-111,-113.6).lineTo(-111,-113.5).curveTo(-111,-111.9,-112,-110.5).curveTo(-113.4,-108.5,-116,-108.5).curveTo(-119.3,-108.5,-120.5,-111.2).closePath().moveTo(37.6,-122.2).lineTo(37,-124.5).curveTo(37,-125.3,37.2,-125.9).lineTo(37.2,-126).lineTo(37,-126.5).curveTo(37,-128.9,38.5,-130.3).curveTo(40,-131.5,42,-131.5).curveTo(44.1,-131.5,45.5,-130.3).curveTo(47,-128.9,47,-126.6).lineTo(47,-126.3).lineTo(46.9,-125.6).lineTo(47,-124.6).lineTo(47,-124.5).curveTo(47,-122.9,46,-121.5).curveTo(44.6,-119.5,42,-119.5).curveTo(38.8,-119.5,37.6,-122.2).closePath().moveTo(128.5,-124.2).lineTo(128,-126.5).curveTo(128,-127.3,128.2,-127.9).lineTo(128.2,-128).lineTo(128,-128.5).curveTo(128,-130.9,129.5,-132.3).curveTo(131,-133.5,133,-133.5).curveTo(135.1,-133.5,136.5,-132.3).curveTo(138,-130.9,138,-128.6).lineTo(138,-128.3).lineTo(137.9,-127.6).lineTo(138,-126.6).lineTo(138,-126.5).curveTo(138,-124.9,137,-123.5).curveTo(135.6,-121.5,133,-121.5).curveTo(129.8,-121.5,128.5,-124.2).closePath().moveTo(19.6,-156.2).lineTo(19,-158.5).curveTo(19,-159.3,19.2,-159.9).lineTo(19.2,-160).lineTo(19,-160.5).curveTo(19,-162.9,20.5,-164.3).curveTo(22,-165.5,24,-165.5).curveTo(26.1,-165.5,27.5,-164.3).curveTo(29,-162.9,29,-160.6).lineTo(29,-160.3).lineTo(28.9,-159.6).lineTo(29,-158.6).lineTo(29,-158.5).curveTo(29,-156.9,28,-155.5).curveTo(26.6,-153.5,24,-153.5).curveTo(20.8,-153.5,19.6,-156.2).closePath().moveTo(-220.5,-156.2).lineTo(-221,-158.5).curveTo(-221,-159.3,-220.8,-159.9).lineTo(-220.8,-160).lineTo(-221,-160.5).curveTo(-221,-162.9,-219.5,-164.3).curveTo(-218.1,-165.5,-216,-165.5).curveTo(-214,-165.5,-212.6,-164.3).curveTo(-211.1,-162.9,-211,-160.6).lineTo(-211,-160.3).lineTo(-211.1,-159.6).lineTo(-211,-158.6).lineTo(-211,-158.5).curveTo(-211,-156.9,-212,-155.5).curveTo(-213.4,-153.5,-216,-153.5).curveTo(-219.3,-153.5,-220.5,-156.2).closePath().moveTo(-36.4,-157).lineTo(-37,-159.3).curveTo(-37,-160.1,-36.8,-160.7).lineTo(-36.8,-160.8).lineTo(-37,-161.3).curveTo(-37,-163.7,-35.4,-165.1).curveTo(-34,-166.3,-32,-166.3).curveTo(-29.9,-166.3,-28.6,-165.1).curveTo(-27,-163.7,-27,-161.4).lineTo(-27,-161.1).lineTo(-27.1,-160.4).lineTo(-27,-159.4).lineTo(-27,-159.3).curveTo(-27,-157.7,-28,-156.3).curveTo(-29.4,-154.3,-32,-154.3).curveTo(-35.2,-154.3,-36.4,-157).closePath().moveTo(211.5,-160.2).lineTo(211,-162.5).curveTo(211,-163.3,211.2,-163.9).lineTo(211.2,-164).lineTo(211,-164.5).curveTo(211,-166.9,212.5,-168.3).curveTo(213.9,-169.5,216,-169.5).curveTo(218,-169.5,219.4,-168.3).curveTo(220.9,-166.9,221,-164.6).lineTo(221,-164.3).lineTo(220.9,-163.6).lineTo(221,-162.6).lineTo(221,-162.5).curveTo(221,-160.9,220,-159.5).curveTo(218.6,-157.5,216,-157.5).curveTo(212.7,-157.5,211.5,-160.2).closePath().moveTo(169.6,-167.2).lineTo(169,-169.5).curveTo(169,-170.3,169.2,-170.9).lineTo(169.2,-171).lineTo(169,-171.5).curveTo(169,-173.9,170.6,-175.3).curveTo(171.9,-176.5,174,-176.5).curveTo(176.1,-176.5,177.4,-175.3).curveTo(179,-173.9,179,-171.6).lineTo(179,-171.3).lineTo(178.9,-170.6).lineTo(179,-169.6).lineTo(179,-169.5).curveTo(179,-167.9,178,-166.5).curveTo(176.6,-164.5,174,-164.5).curveTo(170.7,-164.5,169.6,-167.2).closePath();
	this.shape_53.setTransform(330.9,290.875);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(153.9,-177.7).lineTo(153.9,-205.3).curveTo(154.1,-202.6,156.9,-200.6).curveTo(159.9,-198.5,164.1,-198.5).moveTo(168.9,-135.7).lineTo(168.9,-163.3).curveTo(169.1,-160.6,171.9,-158.6).curveTo(174.8,-156.5,179.1,-156.5).moveTo(210.9,-128.7).lineTo(210.9,-156.3).curveTo(211.1,-153.6,213.9,-151.6).curveTo(216.8,-149.5,221.1,-149.5).moveTo(168.9,-72.7).lineTo(168.9,-100.3).curveTo(169.1,-97.6,171.9,-95.6).curveTo(174.8,-93.5,179.1,-93.5).moveTo(36.9,-90.7).lineTo(36.9,-118.3).curveTo(37.1,-115.6,39.9,-113.6).curveTo(42.9,-111.5,47.1,-111.5).moveTo(18.9,-124.7).lineTo(18.9,-152.3).curveTo(19.1,-149.6,21.9,-147.6).curveTo(24.9,-145.5,29.1,-145.5).moveTo(127.9,-92.7).lineTo(127.9,-120.3).curveTo(128.1,-117.6,130.9,-115.6).curveTo(133.9,-113.5,138.1,-113.5).moveTo(78.9,-64.7).lineTo(78.9,-92.3).curveTo(79.1,-89.6,81.9,-87.6).curveTo(84.9,-85.5,89.1,-85.5).moveTo(78.9,25.3).lineTo(78.9,-2.3).curveTo(79.1,0.4,81.9,2.4).curveTo(84.9,4.5,89.1,4.5).moveTo(18.9,-14.7).lineTo(18.9,-42.3).curveTo(19.1,-39.6,21.9,-37.6).curveTo(24.9,-35.5,29.1,-35.5).moveTo(8.9,79.3).lineTo(8.9,51.7).curveTo(9.1,54.4,11.9,56.4).curveTo(14.9,58.5,19.1,58.5).moveTo(71.9,114.1).lineTo(71.9,86.5).curveTo(72,89.2,74.9,91.2).curveTo(77.8,93.3,82,93.3).moveTo(-121,-79.7).lineTo(-121,-107.3).curveTo(-120.9,-104.6,-118.1,-102.6).curveTo(-115.1,-100.5,-110.9,-100.5).moveTo(-37.1,-125.5).lineTo(-37.1,-153.1).curveTo(-36.9,-150.4,-34.1,-148.4).curveTo(-31.1,-146.3,-26.9,-146.3).moveTo(-221,-124.7).lineTo(-221,-152.3).curveTo(-220.9,-149.6,-218.1,-147.6).curveTo(-215.1,-145.5,-210.9,-145.5).moveTo(-185,97.3).lineTo(-185,69.6).curveTo(-184.9,72.4,-182.1,74.4).curveTo(-179.1,76.4,-174.9,76.4).moveTo(-37.1,-23.7).lineTo(-37.1,-51.3).curveTo(-36.9,-48.6,-34.1,-46.6).curveTo(-31.1,-44.5,-26.9,-44.5).moveTo(-66.1,114.3).lineTo(-66.1,86.7).curveTo(-65.9,89.4,-63.1,91.4).curveTo(-60.1,93.5,-55.9,93.5).moveTo(78.9,177.3).lineTo(78.9,149.7).curveTo(79.1,152.4,81.9,154.4).curveTo(84.9,156.5,89.1,156.5).moveTo(-11.1,205.3).lineTo(-11.1,177.7).curveTo(-10.9,180.4,-8.1,182.4).curveTo(-5.1,184.5,-0.9,184.5);
	this.shape_54.setTransform(340.95,254.925);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.beginFill("#000000").beginStroke().moveTo(-10.4,194.8).lineTo(-11,192.5).curveTo(-11,191.7,-10.8,191.1).lineTo(-10.8,191).lineTo(-11,190.5).curveTo(-11,188.1,-9.4,186.7).curveTo(-8.1,185.5,-6,185.5).curveTo(-3.9,185.5,-2.6,186.7).curveTo(-1.1,188.1,-1,190.4).lineTo(-1,190.7).lineTo(-1.1,191.4).lineTo(-1,192.4).lineTo(-1,192.5).curveTo(-1,194.1,-2,195.5).curveTo(-3.4,197.5,-6,197.5).curveTo(-9.3,197.5,-10.4,194.8).closePath().moveTo(79.6,166.8).lineTo(79,164.5).curveTo(79,163.7,79.2,163.1).lineTo(79.2,163).lineTo(79,162.5).curveTo(79,160.1,80.6,158.7).curveTo(81.9,157.5,84,157.5).curveTo(86.1,157.5,87.4,158.7).curveTo(89,160.1,89,162.4).lineTo(89,162.7).lineTo(88.9,163.4).lineTo(89,164.4).lineTo(89,164.5).curveTo(89,166.1,88,167.5).curveTo(86.6,169.5,84,169.5).curveTo(80.7,169.5,79.6,166.8).closePath().moveTo(-65.5,103.8).lineTo(-66,101.5).curveTo(-66,100.7,-65.8,100.1).lineTo(-65.8,100).lineTo(-66,99.5).curveTo(-66,97.1,-64.4,95.7).curveTo(-63.1,94.5,-61,94.5).curveTo(-59,94.5,-57.6,95.7).curveTo(-56.1,97.1,-56,99.4).lineTo(-56,99.7).lineTo(-56.1,100.4).lineTo(-56,101.4).lineTo(-56,101.5).curveTo(-56,103.1,-57,104.5).curveTo(-58.4,106.5,-61,106.5).curveTo(-64.3,106.5,-65.5,103.8).closePath().moveTo(72.5,103.6).lineTo(71.9,101.3).curveTo(71.9,100.5,72.1,99.9).lineTo(72.1,99.8).lineTo(71.9,99.3).curveTo(72,96.9,73.5,95.5).curveTo(74.9,94.3,77,94.3).curveTo(79,94.3,80.4,95.5).curveTo(81.9,96.9,81.9,99.2).lineTo(81.9,99.5).lineTo(81.8,100.2).lineTo(81.9,101.2).lineTo(81.9,101.3).curveTo(82,102.9,80.9,104.3).curveTo(79.6,106.3,77,106.3).curveTo(73.7,106.3,72.5,103.6).closePath().moveTo(-184.5,86.7).lineTo(-185,84.5).curveTo(-185,83.7,-184.8,83).lineTo(-184.8,83).lineTo(-185,82.5).curveTo(-185,80.1,-183.5,78.7).curveTo(-182.1,77.4,-180,77.4).curveTo(-178,77.4,-176.6,78.7).curveTo(-175.1,80,-175,82.3).lineTo(-175,82.6).lineTo(-175.1,83.4).lineTo(-175,84.3).lineTo(-175,84.5).curveTo(-175,86,-176,87.5).curveTo(-177.4,89.5,-180,89.5).curveTo(-183.3,89.5,-184.5,86.7).closePath().moveTo(9.6,68.8).lineTo(9,66.5).curveTo(9,65.7,9.2,65.1).lineTo(9.2,65).lineTo(9,64.5).curveTo(9,62.1,10.6,60.7).curveTo(12,59.5,14,59.5).curveTo(16,59.5,17.5,60.7).curveTo(19,62.1,19,64.4).lineTo(19,64.7).lineTo(18.9,65.4).lineTo(19,66.4).lineTo(19,66.5).curveTo(19,68.1,18,69.5).curveTo(16.6,71.5,14,71.5).curveTo(10.8,71.5,9.6,68.8).closePath().moveTo(79.6,14.8).lineTo(79,12.5).curveTo(79,11.7,79.2,11.1).lineTo(79.2,11).lineTo(79,10.5).curveTo(79,8.1,80.6,6.7).curveTo(81.9,5.5,84,5.5).curveTo(86.1,5.5,87.4,6.7).curveTo(89,8.1,89,10.4).lineTo(89,10.7).lineTo(88.9,11.4).lineTo(89,12.4).lineTo(89,12.5).curveTo(89,14.1,88,15.5).curveTo(86.6,17.5,84,17.5).curveTo(80.7,17.5,79.6,14.8).closePath().moveTo(19.6,-25.2).lineTo(19,-27.5).curveTo(19,-28.3,19.2,-28.9).lineTo(19.2,-29).lineTo(19,-29.5).curveTo(19,-31.9,20.5,-33.3).curveTo(22,-34.5,24,-34.5).curveTo(26.1,-34.5,27.5,-33.3).curveTo(29,-31.9,29,-29.6).lineTo(29,-29.3).lineTo(28.9,-28.6).lineTo(29,-27.6).lineTo(29,-27.5).curveTo(29,-25.9,28,-24.5).curveTo(26.6,-22.5,24,-22.5).curveTo(20.8,-22.5,19.6,-25.2).closePath().moveTo(-36.4,-34.2).lineTo(-37,-36.5).curveTo(-37,-37.3,-36.8,-37.9).lineTo(-36.8,-38).lineTo(-37,-38.5).curveTo(-37,-40.9,-35.4,-42.3).curveTo(-34,-43.5,-32,-43.5).curveTo(-29.9,-43.5,-28.6,-42.3).curveTo(-27,-40.9,-27,-38.6).lineTo(-27,-38.3).lineTo(-27.1,-37.6).lineTo(-27,-36.6).lineTo(-27,-36.5).curveTo(-27,-34.9,-28,-33.5).curveTo(-29.4,-31.5,-32,-31.5).curveTo(-35.2,-31.5,-36.4,-34.2).closePath().moveTo(79.6,-75.2).lineTo(79,-77.5).curveTo(79,-78.3,79.2,-78.9).lineTo(79.2,-79).lineTo(79,-79.5).curveTo(79,-81.9,80.6,-83.3).curveTo(81.9,-84.5,84,-84.5).curveTo(86.1,-84.5,87.4,-83.3).curveTo(89,-81.9,89,-79.6).lineTo(89,-79.3).lineTo(88.9,-78.6).lineTo(89,-77.6).lineTo(89,-77.5).curveTo(89,-75.9,88,-74.5).curveTo(86.6,-72.5,84,-72.5).curveTo(80.7,-72.5,79.6,-75.2).closePath().moveTo(169.6,-83.2).lineTo(169,-85.5).curveTo(169,-86.3,169.2,-86.9).lineTo(169.2,-87).lineTo(169,-87.5).curveTo(169,-89.9,170.6,-91.3).curveTo(171.9,-92.5,174,-92.5).curveTo(176.1,-92.5,177.4,-91.3).curveTo(179,-89.9,179,-87.6).lineTo(179,-87.3).lineTo(178.9,-86.6).lineTo(179,-85.6).lineTo(179,-85.5).curveTo(179,-83.9,178,-82.5).curveTo(176.6,-80.5,174,-80.5).curveTo(170.7,-80.5,169.6,-83.2).closePath().moveTo(-120.5,-90.2).lineTo(-121,-92.5).curveTo(-121,-93.3,-120.8,-93.9).lineTo(-120.8,-94).lineTo(-121,-94.5).curveTo(-121,-96.9,-119.5,-98.3).curveTo(-118.1,-99.5,-116,-99.5).curveTo(-114,-99.5,-112.6,-98.3).curveTo(-111.1,-96.9,-111,-94.6).lineTo(-111,-94.3).lineTo(-111.1,-93.6).lineTo(-111,-92.6).lineTo(-111,-92.5).curveTo(-111,-90.9,-112,-89.5).curveTo(-113.4,-87.5,-116,-87.5).curveTo(-119.3,-87.5,-120.5,-90.2).closePath().moveTo(37.6,-101.2).lineTo(37,-103.5).curveTo(37,-104.3,37.2,-104.9).lineTo(37.2,-105).lineTo(37,-105.5).curveTo(37,-107.9,38.5,-109.3).curveTo(40,-110.5,42,-110.5).curveTo(44.1,-110.5,45.5,-109.3).curveTo(47,-107.9,47,-105.6).lineTo(47,-105.3).lineTo(46.9,-104.6).lineTo(47,-103.6).lineTo(47,-103.5).curveTo(47,-101.9,46,-100.5).curveTo(44.6,-98.5,42,-98.5).curveTo(38.8,-98.5,37.6,-101.2).closePath().moveTo(128.5,-103.2).lineTo(128,-105.5).curveTo(128,-106.3,128.2,-106.9).lineTo(128.2,-107).lineTo(128,-107.5).curveTo(128,-109.9,129.5,-111.3).curveTo(131,-112.5,133,-112.5).curveTo(135.1,-112.5,136.5,-111.3).curveTo(138,-109.9,138,-107.6).lineTo(138,-107.3).lineTo(137.9,-106.6).lineTo(138,-105.6).lineTo(138,-105.5).curveTo(138,-103.9,137,-102.5).curveTo(135.6,-100.5,133,-100.5).curveTo(129.8,-100.5,128.5,-103.2).closePath().moveTo(19.6,-135.2).lineTo(19,-137.5).curveTo(19,-138.3,19.2,-138.9).lineTo(19.2,-139).lineTo(19,-139.5).curveTo(19,-141.9,20.5,-143.3).curveTo(22,-144.5,24,-144.5).curveTo(26.1,-144.5,27.5,-143.3).curveTo(29,-141.9,29,-139.6).lineTo(29,-139.3).lineTo(28.9,-138.6).lineTo(29,-137.6).lineTo(29,-137.5).curveTo(29,-135.9,28,-134.5).curveTo(26.6,-132.5,24,-132.5).curveTo(20.8,-132.5,19.6,-135.2).closePath().moveTo(-220.5,-135.2).lineTo(-221,-137.5).curveTo(-221,-138.3,-220.8,-138.9).lineTo(-220.8,-139).lineTo(-221,-139.5).curveTo(-221,-141.9,-219.5,-143.3).curveTo(-218.1,-144.5,-216,-144.5).curveTo(-214,-144.5,-212.6,-143.3).curveTo(-211.1,-141.9,-211,-139.6).lineTo(-211,-139.3).lineTo(-211.1,-138.6).lineTo(-211,-137.6).lineTo(-211,-137.5).curveTo(-211,-135.9,-212,-134.5).curveTo(-213.4,-132.5,-216,-132.5).curveTo(-219.3,-132.5,-220.5,-135.2).closePath().moveTo(-36.4,-136).lineTo(-37,-138.3).curveTo(-37,-139.1,-36.8,-139.7).lineTo(-36.8,-139.8).lineTo(-37,-140.3).curveTo(-37,-142.7,-35.4,-144.1).curveTo(-34,-145.3,-32,-145.3).curveTo(-29.9,-145.3,-28.6,-144.1).curveTo(-27,-142.7,-27,-140.4).lineTo(-27,-140.1).lineTo(-27.1,-139.4).lineTo(-27,-138.4).lineTo(-27,-138.3).curveTo(-27,-136.7,-28,-135.3).curveTo(-29.4,-133.3,-32,-133.3).curveTo(-35.2,-133.3,-36.4,-136).closePath().moveTo(211.5,-139.2).lineTo(211,-141.5).curveTo(211,-142.3,211.2,-142.9).lineTo(211.2,-143).lineTo(211,-143.5).curveTo(211,-145.9,212.5,-147.3).curveTo(213.9,-148.5,216,-148.5).curveTo(218,-148.5,219.4,-147.3).curveTo(220.9,-145.9,221,-143.6).lineTo(221,-143.3).lineTo(220.9,-142.6).lineTo(221,-141.6).lineTo(221,-141.5).curveTo(221,-139.9,220,-138.5).curveTo(218.6,-136.5,216,-136.5).curveTo(212.7,-136.5,211.5,-139.2).closePath().moveTo(169.6,-146.2).lineTo(169,-148.5).curveTo(169,-149.3,169.2,-149.9).lineTo(169.2,-150).lineTo(169,-150.5).curveTo(169,-152.9,170.6,-154.3).curveTo(171.9,-155.5,174,-155.5).curveTo(176.1,-155.5,177.4,-154.3).curveTo(179,-152.9,179,-150.6).lineTo(179,-150.3).lineTo(178.9,-149.6).lineTo(179,-148.6).lineTo(179,-148.5).curveTo(179,-146.9,178,-145.5).curveTo(176.6,-143.5,174,-143.5).curveTo(170.7,-143.5,169.6,-146.2).closePath().moveTo(154.6,-188.2).lineTo(154,-190.5).curveTo(154,-191.3,154.2,-191.9).lineTo(154.2,-192).lineTo(154,-192.5).curveTo(154,-194.9,155.5,-196.3).curveTo(157,-197.5,159,-197.5).curveTo(161.1,-197.5,162.5,-196.3).curveTo(164,-194.9,164,-192.6).lineTo(164,-192.3).lineTo(163.9,-191.6).lineTo(164,-190.6).lineTo(164,-190.5).curveTo(164,-188.9,163,-187.5).curveTo(161.6,-185.5,159,-185.5).curveTo(155.8,-185.5,154.6,-188.2).closePath();
	this.shape_55.setTransform(330.9,269.875);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(204.9,-186.4).lineTo(204.9,-214).curveTo(205.1,-211.3,207.9,-209.3).curveTo(210.8,-207.2,215.1,-207.2).moveTo(153.9,-169).lineTo(153.9,-196.6).curveTo(154.1,-193.9,156.9,-191.9).curveTo(159.9,-189.8,164.1,-189.8).moveTo(168.9,-127).lineTo(168.9,-154.6).curveTo(169.1,-151.9,171.9,-149.9).curveTo(174.8,-147.8,179.1,-147.8).moveTo(210.9,-120).lineTo(210.9,-147.6).curveTo(211.1,-144.9,213.9,-142.9).curveTo(216.8,-140.8,221.1,-140.8).moveTo(168.9,-64).lineTo(168.9,-91.6).curveTo(169.1,-88.9,171.9,-86.9).curveTo(174.8,-84.8,179.1,-84.8).moveTo(36.9,-82).lineTo(36.9,-109.6).curveTo(37.1,-106.9,39.9,-104.9).curveTo(42.9,-102.8,47.1,-102.8).moveTo(18.9,-116).lineTo(18.9,-143.6).curveTo(19.1,-140.9,21.9,-138.9).curveTo(24.9,-136.8,29.1,-136.8).moveTo(127.9,-84).lineTo(127.9,-111.6).curveTo(128.1,-108.9,130.9,-106.9).curveTo(133.9,-104.8,138.1,-104.8).moveTo(78.9,-56).lineTo(78.9,-83.6).curveTo(79.1,-80.9,81.9,-78.9).curveTo(84.9,-76.8,89.1,-76.8).moveTo(78.9,34).lineTo(78.9,6.4).curveTo(79.1,9.1,81.9,11.1).curveTo(84.9,13.2,89.1,13.2).moveTo(18.9,-6).lineTo(18.9,-33.6).curveTo(19.1,-30.9,21.9,-28.9).curveTo(24.9,-26.8,29.1,-26.8).moveTo(8.9,88).lineTo(8.9,60.4).curveTo(9.1,63.1,11.9,65.1).curveTo(14.9,67.2,19.1,67.2).moveTo(71.9,122.8).lineTo(71.9,95.2).curveTo(72,97.9,74.9,99.9).curveTo(77.8,102,82,102).moveTo(-121,-71).lineTo(-121,-98.6).curveTo(-120.9,-95.9,-118.1,-93.9).curveTo(-115.1,-91.8,-110.9,-91.8).moveTo(-37.1,-116.8).lineTo(-37.1,-144.4).curveTo(-36.9,-141.7,-34.1,-139.7).curveTo(-31.1,-137.6,-26.9,-137.6).moveTo(-221,-116).lineTo(-221,-143.6).curveTo(-220.9,-140.9,-218.1,-138.9).curveTo(-215.1,-136.8,-210.9,-136.8).moveTo(-185,106).lineTo(-185,78.3).curveTo(-184.9,81.1,-182.1,83.1).curveTo(-179.1,85.1,-174.9,85.1).moveTo(-37.1,-15).lineTo(-37.1,-42.6).curveTo(-36.9,-39.9,-34.1,-37.9).curveTo(-31.1,-35.8,-26.9,-35.8).moveTo(-66.1,123).lineTo(-66.1,95.4).curveTo(-65.9,98.1,-63.1,100.1).curveTo(-60.1,102.2,-55.9,102.2).moveTo(78.9,186).lineTo(78.9,158.4).curveTo(79.1,161.1,81.9,163.1).curveTo(84.9,165.2,89.1,165.2).moveTo(-11.1,214).lineTo(-11.1,186.4).curveTo(-10.9,189.1,-8.1,191.1).curveTo(-5.1,193.2,-0.9,193.2);
	this.shape_56.setTransform(340.95,246.225);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.beginFill("#000000").beginStroke().moveTo(-10.4,203.5).lineTo(-11,201.2).curveTo(-11,200.4,-10.8,199.8).lineTo(-10.8,199.7).lineTo(-11,199.2).curveTo(-11,196.8,-9.4,195.4).curveTo(-8.1,194.2,-6,194.2).curveTo(-3.9,194.2,-2.6,195.4).curveTo(-1.1,196.8,-1,199.1).lineTo(-1,199.4).lineTo(-1.1,200.1).lineTo(-1,201.1).lineTo(-1,201.2).curveTo(-1,202.8,-2,204.2).curveTo(-3.4,206.2,-6,206.2).curveTo(-9.3,206.2,-10.4,203.5).closePath().moveTo(79.6,175.5).lineTo(79,173.2).curveTo(79,172.4,79.2,171.8).lineTo(79.2,171.7).lineTo(79,171.2).curveTo(79,168.8,80.6,167.4).curveTo(81.9,166.2,84,166.2).curveTo(86.1,166.2,87.4,167.4).curveTo(89,168.8,89,171.1).lineTo(89,171.4).lineTo(88.9,172.1).lineTo(89,173.1).lineTo(89,173.2).curveTo(89,174.8,88,176.2).curveTo(86.6,178.2,84,178.2).curveTo(80.7,178.2,79.6,175.5).closePath().moveTo(-65.5,112.5).lineTo(-66,110.2).curveTo(-66,109.4,-65.8,108.8).lineTo(-65.8,108.7).lineTo(-66,108.2).curveTo(-66,105.8,-64.4,104.4).curveTo(-63.1,103.2,-61,103.2).curveTo(-59,103.2,-57.6,104.4).curveTo(-56.1,105.8,-56,108.1).lineTo(-56,108.4).lineTo(-56.1,109.1).lineTo(-56,110.1).lineTo(-56,110.2).curveTo(-56,111.8,-57,113.2).curveTo(-58.4,115.2,-61,115.2).curveTo(-64.3,115.2,-65.5,112.5).closePath().moveTo(72.5,112.3).lineTo(71.9,110).curveTo(71.9,109.2,72.1,108.6).lineTo(72.1,108.5).lineTo(71.9,108).curveTo(72,105.6,73.5,104.2).curveTo(74.9,103,77,103).curveTo(79,103,80.4,104.2).curveTo(81.9,105.6,81.9,107.9).lineTo(81.9,108.2).lineTo(81.8,108.9).lineTo(81.9,109.9).lineTo(81.9,110).curveTo(82,111.6,80.9,113).curveTo(79.6,115,77,115).curveTo(73.7,115,72.5,112.3).closePath().moveTo(-184.5,95.4).lineTo(-185,93.2).curveTo(-185,92.4,-184.8,91.7).lineTo(-184.8,91.7).lineTo(-185,91.2).curveTo(-185,88.8,-183.5,87.4).curveTo(-182.1,86.1,-180,86.1).curveTo(-178,86.1,-176.6,87.4).curveTo(-175.1,88.7,-175,91).lineTo(-175,91.3).lineTo(-175.1,92.1).lineTo(-175,93).lineTo(-175,93.2).curveTo(-175,94.7,-176,96.2).curveTo(-177.4,98.2,-180,98.2).curveTo(-183.3,98.2,-184.5,95.4).closePath().moveTo(9.6,77.5).lineTo(9,75.2).curveTo(9,74.4,9.2,73.8).lineTo(9.2,73.7).lineTo(9,73.2).curveTo(9,70.8,10.6,69.4).curveTo(12,68.2,14,68.2).curveTo(16,68.2,17.5,69.4).curveTo(19,70.8,19,73.1).lineTo(19,73.4).lineTo(18.9,74.1).lineTo(19,75.1).lineTo(19,75.2).curveTo(19,76.8,18,78.2).curveTo(16.6,80.2,14,80.2).curveTo(10.8,80.2,9.6,77.5).closePath().moveTo(79.6,23.5).lineTo(79,21.2).curveTo(79,20.4,79.2,19.8).lineTo(79.2,19.7).lineTo(79,19.2).curveTo(79,16.8,80.6,15.4).curveTo(81.9,14.2,84,14.2).curveTo(86.1,14.2,87.4,15.4).curveTo(89,16.8,89,19.1).lineTo(89,19.4).lineTo(88.9,20.1).lineTo(89,21.1).lineTo(89,21.2).curveTo(89,22.8,88,24.2).curveTo(86.6,26.2,84,26.2).curveTo(80.7,26.2,79.6,23.5).closePath().moveTo(19.6,-16.5).lineTo(19,-18.8).curveTo(19,-19.6,19.2,-20.2).lineTo(19.2,-20.3).lineTo(19,-20.8).curveTo(19,-23.2,20.5,-24.6).curveTo(22,-25.8,24,-25.8).curveTo(26.1,-25.8,27.5,-24.6).curveTo(29,-23.2,29,-20.9).lineTo(29,-20.6).lineTo(28.9,-19.9).lineTo(29,-18.9).lineTo(29,-18.8).curveTo(29,-17.2,28,-15.8).curveTo(26.6,-13.8,24,-13.8).curveTo(20.8,-13.8,19.6,-16.5).closePath().moveTo(-36.4,-25.5).lineTo(-37,-27.8).curveTo(-37,-28.6,-36.8,-29.2).lineTo(-36.8,-29.3).lineTo(-37,-29.8).curveTo(-37,-32.2,-35.4,-33.6).curveTo(-34,-34.8,-32,-34.8).curveTo(-29.9,-34.8,-28.6,-33.6).curveTo(-27,-32.2,-27,-29.9).lineTo(-27,-29.6).lineTo(-27.1,-28.9).lineTo(-27,-27.9).lineTo(-27,-27.8).curveTo(-27,-26.2,-28,-24.8).curveTo(-29.4,-22.8,-32,-22.8).curveTo(-35.2,-22.8,-36.4,-25.5).closePath().moveTo(79.6,-66.5).lineTo(79,-68.8).curveTo(79,-69.6,79.2,-70.2).lineTo(79.2,-70.3).lineTo(79,-70.8).curveTo(79,-73.2,80.6,-74.6).curveTo(81.9,-75.8,84,-75.8).curveTo(86.1,-75.8,87.4,-74.6).curveTo(89,-73.2,89,-70.9).lineTo(89,-70.6).lineTo(88.9,-69.9).lineTo(89,-68.9).lineTo(89,-68.8).curveTo(89,-67.2,88,-65.8).curveTo(86.6,-63.8,84,-63.8).curveTo(80.7,-63.8,79.6,-66.5).closePath().moveTo(169.6,-74.5).lineTo(169,-76.8).curveTo(169,-77.6,169.2,-78.2).lineTo(169.2,-78.3).lineTo(169,-78.8).curveTo(169,-81.2,170.6,-82.6).curveTo(171.9,-83.8,174,-83.8).curveTo(176.1,-83.8,177.4,-82.6).curveTo(179,-81.2,179,-78.9).lineTo(179,-78.6).lineTo(178.9,-77.9).lineTo(179,-76.9).lineTo(179,-76.8).curveTo(179,-75.2,178,-73.8).curveTo(176.6,-71.8,174,-71.8).curveTo(170.7,-71.8,169.6,-74.5).closePath().moveTo(-120.5,-81.5).lineTo(-121,-83.8).curveTo(-121,-84.6,-120.8,-85.2).lineTo(-120.8,-85.3).lineTo(-121,-85.8).curveTo(-121,-88.2,-119.5,-89.6).curveTo(-118.1,-90.8,-116,-90.8).curveTo(-114,-90.8,-112.6,-89.6).curveTo(-111.1,-88.2,-111,-85.9).lineTo(-111,-85.6).lineTo(-111.1,-84.9).lineTo(-111,-83.9).lineTo(-111,-83.8).curveTo(-111,-82.2,-112,-80.8).curveTo(-113.4,-78.8,-116,-78.8).curveTo(-119.3,-78.8,-120.5,-81.5).closePath().moveTo(37.6,-92.5).lineTo(37,-94.8).curveTo(37,-95.6,37.2,-96.2).lineTo(37.2,-96.3).lineTo(37,-96.8).curveTo(37,-99.2,38.5,-100.6).curveTo(40,-101.8,42,-101.8).curveTo(44.1,-101.8,45.5,-100.6).curveTo(47,-99.2,47,-96.9).lineTo(47,-96.6).lineTo(46.9,-95.9).lineTo(47,-94.9).lineTo(47,-94.8).curveTo(47,-93.2,46,-91.8).curveTo(44.6,-89.8,42,-89.8).curveTo(38.8,-89.8,37.6,-92.5).closePath().moveTo(128.5,-94.5).lineTo(128,-96.8).curveTo(128,-97.6,128.2,-98.2).lineTo(128.2,-98.3).lineTo(128,-98.8).curveTo(128,-101.2,129.5,-102.6).curveTo(131,-103.8,133,-103.8).curveTo(135.1,-103.8,136.5,-102.6).curveTo(138,-101.2,138,-98.9).lineTo(138,-98.6).lineTo(137.9,-97.9).lineTo(138,-96.9).lineTo(138,-96.8).curveTo(138,-95.2,137,-93.8).curveTo(135.6,-91.8,133,-91.8).curveTo(129.8,-91.8,128.5,-94.5).closePath().moveTo(19.6,-126.5).lineTo(19,-128.8).curveTo(19,-129.6,19.2,-130.2).lineTo(19.2,-130.3).lineTo(19,-130.8).curveTo(19,-133.2,20.5,-134.6).curveTo(22,-135.8,24,-135.8).curveTo(26.1,-135.8,27.5,-134.6).curveTo(29,-133.2,29,-130.9).lineTo(29,-130.6).lineTo(28.9,-129.9).lineTo(29,-128.9).lineTo(29,-128.8).curveTo(29,-127.2,28,-125.8).curveTo(26.6,-123.8,24,-123.8).curveTo(20.8,-123.8,19.6,-126.5).closePath().moveTo(-220.5,-126.5).lineTo(-221,-128.8).curveTo(-221,-129.6,-220.8,-130.2).lineTo(-220.8,-130.3).lineTo(-221,-130.8).curveTo(-221,-133.2,-219.5,-134.6).curveTo(-218.1,-135.8,-216,-135.8).curveTo(-214,-135.8,-212.6,-134.6).curveTo(-211.1,-133.2,-211,-130.9).lineTo(-211,-130.6).lineTo(-211.1,-129.9).lineTo(-211,-128.9).lineTo(-211,-128.8).curveTo(-211,-127.2,-212,-125.8).curveTo(-213.4,-123.8,-216,-123.8).curveTo(-219.3,-123.8,-220.5,-126.5).closePath().moveTo(-36.4,-127.3).lineTo(-37,-129.6).curveTo(-37,-130.4,-36.8,-131).lineTo(-36.8,-131.1).lineTo(-37,-131.6).curveTo(-37,-134,-35.4,-135.4).curveTo(-34,-136.6,-32,-136.6).curveTo(-29.9,-136.6,-28.6,-135.4).curveTo(-27,-134,-27,-131.7).lineTo(-27,-131.4).lineTo(-27.1,-130.7).lineTo(-27,-129.7).lineTo(-27,-129.6).curveTo(-27,-128,-28,-126.6).curveTo(-29.4,-124.6,-32,-124.6).curveTo(-35.2,-124.6,-36.4,-127.3).closePath().moveTo(211.5,-130.5).lineTo(211,-132.8).curveTo(211,-133.6,211.2,-134.2).lineTo(211.2,-134.3).lineTo(211,-134.8).curveTo(211,-137.2,212.5,-138.6).curveTo(213.9,-139.8,216,-139.8).curveTo(218,-139.8,219.4,-138.6).curveTo(220.9,-137.2,221,-134.9).lineTo(221,-134.6).lineTo(220.9,-133.9).lineTo(221,-132.9).lineTo(221,-132.8).curveTo(221,-131.2,220,-129.8).curveTo(218.6,-127.8,216,-127.8).curveTo(212.7,-127.8,211.5,-130.5).closePath().moveTo(169.6,-137.5).lineTo(169,-139.8).curveTo(169,-140.6,169.2,-141.2).lineTo(169.2,-141.3).lineTo(169,-141.8).curveTo(169,-144.2,170.6,-145.6).curveTo(171.9,-146.8,174,-146.8).curveTo(176.1,-146.8,177.4,-145.6).curveTo(179,-144.2,179,-141.9).lineTo(179,-141.6).lineTo(178.9,-140.9).lineTo(179,-139.9).lineTo(179,-139.8).curveTo(179,-138.2,178,-136.8).curveTo(176.6,-134.8,174,-134.8).curveTo(170.7,-134.8,169.6,-137.5).closePath().moveTo(154.6,-179.5).lineTo(154,-181.8).curveTo(154,-182.6,154.2,-183.2).lineTo(154.2,-183.3).lineTo(154,-183.8).curveTo(154,-186.2,155.5,-187.6).curveTo(157,-188.8,159,-188.8).curveTo(161.1,-188.8,162.5,-187.6).curveTo(164,-186.2,164,-183.9).lineTo(164,-183.6).lineTo(163.9,-182.9).lineTo(164,-181.9).lineTo(164,-181.8).curveTo(164,-180.2,163,-178.8).curveTo(161.6,-176.8,159,-176.8).curveTo(155.8,-176.8,154.6,-179.5).closePath().moveTo(205.6,-196.9).lineTo(205,-199.2).curveTo(205,-200,205.2,-200.6).lineTo(205.2,-200.7).lineTo(205,-201.2).curveTo(205,-203.6,206.6,-205).curveTo(207.9,-206.2,210,-206.2).curveTo(212,-206.2,213.4,-205).curveTo(214.9,-203.6,215,-201.3).lineTo(215,-201).lineTo(214.9,-200.3).lineTo(215,-199.3).lineTo(215,-199.2).curveTo(215,-197.6,214,-196.2).curveTo(212.6,-194.2,210,-194.2).curveTo(206.7,-194.2,205.6,-196.9).closePath();
	this.shape_57.setTransform(330.9,261.175);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(204.9,-186.4).lineTo(204.9,-214).curveTo(205.1,-211.3,207.9,-209.3).curveTo(210.8,-207.2,215.1,-207.2).moveTo(153.9,-169).lineTo(153.9,-196.6).curveTo(154.1,-193.9,156.9,-191.9).curveTo(159.9,-189.8,164.1,-189.8).moveTo(168.9,-127).lineTo(168.9,-154.6).curveTo(169.1,-151.9,171.9,-149.9).curveTo(174.8,-147.8,179.1,-147.8).moveTo(210.9,-120).lineTo(210.9,-147.6).curveTo(211.1,-144.9,213.9,-142.9).curveTo(216.8,-140.8,221.1,-140.8).moveTo(168.9,-64).lineTo(168.9,-91.6).curveTo(169.1,-88.9,171.9,-86.9).curveTo(174.8,-84.8,179.1,-84.8).moveTo(107.9,-150.6).lineTo(107.9,-178.3).curveTo(108.1,-175.5,110.9,-173.5).curveTo(113.9,-171.5,118.1,-171.5).moveTo(36.9,-82).lineTo(36.9,-109.6).curveTo(37.1,-106.9,39.9,-104.9).curveTo(42.9,-102.8,47.1,-102.8).moveTo(18.9,-116).lineTo(18.9,-143.6).curveTo(19.1,-140.9,21.9,-138.9).curveTo(24.9,-136.8,29.1,-136.8).moveTo(127.9,-84).lineTo(127.9,-111.6).curveTo(128.1,-108.9,130.9,-106.9).curveTo(133.9,-104.8,138.1,-104.8).moveTo(78.9,-56).lineTo(78.9,-83.6).curveTo(79.1,-80.9,81.9,-78.9).curveTo(84.9,-76.8,89.1,-76.8).moveTo(78.9,34).lineTo(78.9,6.4).curveTo(79.1,9.1,81.9,11.1).curveTo(84.9,13.2,89.1,13.2).moveTo(18.9,-6).lineTo(18.9,-33.6).curveTo(19.1,-30.9,21.9,-28.9).curveTo(24.9,-26.8,29.1,-26.8).moveTo(8.9,88).lineTo(8.9,60.4).curveTo(9.1,63.1,11.9,65.1).curveTo(14.9,67.2,19.1,67.2).moveTo(71.9,122.8).lineTo(71.9,95.2).curveTo(72,97.9,74.9,99.9).curveTo(77.8,102,82,102).moveTo(-121,-71).lineTo(-121,-98.6).curveTo(-120.9,-95.9,-118.1,-93.9).curveTo(-115.1,-91.8,-110.9,-91.8).moveTo(-37.1,-116.8).lineTo(-37.1,-144.4).curveTo(-36.9,-141.7,-34.1,-139.7).curveTo(-31.1,-137.6,-26.9,-137.6).moveTo(-221,-116).lineTo(-221,-143.6).curveTo(-220.9,-140.9,-218.1,-138.9).curveTo(-215.1,-136.8,-210.9,-136.8).moveTo(-185,106).lineTo(-185,78.3).curveTo(-184.9,81.1,-182.1,83.1).curveTo(-179.1,85.1,-174.9,85.1).moveTo(-37.1,-15).lineTo(-37.1,-42.6).curveTo(-36.9,-39.9,-34.1,-37.9).curveTo(-31.1,-35.8,-26.9,-35.8).moveTo(-66.1,123).lineTo(-66.1,95.4).curveTo(-65.9,98.1,-63.1,100.1).curveTo(-60.1,102.2,-55.9,102.2).moveTo(78.9,186).lineTo(78.9,158.4).curveTo(79.1,161.1,81.9,163.1).curveTo(84.9,165.2,89.1,165.2).moveTo(-11.1,214).lineTo(-11.1,186.4).curveTo(-10.9,189.1,-8.1,191.1).curveTo(-5.1,193.2,-0.9,193.2);
	this.shape_58.setTransform(340.95,246.225);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.beginFill("#000000").beginStroke().moveTo(-10.4,203.5).lineTo(-11,201.2).curveTo(-11,200.4,-10.8,199.8).lineTo(-10.8,199.7).lineTo(-11,199.2).curveTo(-11,196.8,-9.4,195.4).curveTo(-8.1,194.2,-6,194.2).curveTo(-3.9,194.2,-2.6,195.4).curveTo(-1.1,196.8,-1,199.1).lineTo(-1,199.4).lineTo(-1.1,200.1).lineTo(-1,201.1).lineTo(-1,201.2).curveTo(-1,202.8,-2,204.2).curveTo(-3.4,206.2,-6,206.2).curveTo(-9.3,206.2,-10.4,203.5).closePath().moveTo(79.6,175.5).lineTo(79,173.2).curveTo(79,172.4,79.2,171.8).lineTo(79.2,171.7).lineTo(79,171.2).curveTo(79,168.8,80.6,167.4).curveTo(81.9,166.2,84,166.2).curveTo(86.1,166.2,87.4,167.4).curveTo(89,168.8,89,171.1).lineTo(89,171.4).lineTo(88.9,172.1).lineTo(89,173.1).lineTo(89,173.2).curveTo(89,174.8,88,176.2).curveTo(86.6,178.2,84,178.2).curveTo(80.7,178.2,79.6,175.5).closePath().moveTo(-65.5,112.5).lineTo(-66,110.2).curveTo(-66,109.4,-65.8,108.8).lineTo(-65.8,108.7).lineTo(-66,108.2).curveTo(-66,105.8,-64.4,104.4).curveTo(-63.1,103.2,-61,103.2).curveTo(-59,103.2,-57.6,104.4).curveTo(-56.1,105.8,-56,108.1).lineTo(-56,108.4).lineTo(-56.1,109.1).lineTo(-56,110.1).lineTo(-56,110.2).curveTo(-56,111.8,-57,113.2).curveTo(-58.4,115.2,-61,115.2).curveTo(-64.3,115.2,-65.5,112.5).closePath().moveTo(72.5,112.3).lineTo(71.9,110).curveTo(71.9,109.2,72.1,108.6).lineTo(72.1,108.5).lineTo(71.9,108).curveTo(72,105.6,73.5,104.2).curveTo(74.9,103,77,103).curveTo(79,103,80.4,104.2).curveTo(81.9,105.6,81.9,107.9).lineTo(81.9,108.2).lineTo(81.8,108.9).lineTo(81.9,109.9).lineTo(81.9,110).curveTo(82,111.6,80.9,113).curveTo(79.6,115,77,115).curveTo(73.7,115,72.5,112.3).closePath().moveTo(-184.5,95.4).lineTo(-185,93.2).curveTo(-185,92.4,-184.8,91.7).lineTo(-184.8,91.7).lineTo(-185,91.2).curveTo(-185,88.8,-183.5,87.4).curveTo(-182.1,86.1,-180,86.1).curveTo(-178,86.1,-176.6,87.4).curveTo(-175.1,88.7,-175,91).lineTo(-175,91.3).lineTo(-175.1,92.1).lineTo(-175,93).lineTo(-175,93.2).curveTo(-175,94.7,-176,96.2).curveTo(-177.4,98.2,-180,98.2).curveTo(-183.3,98.2,-184.5,95.4).closePath().moveTo(9.6,77.5).lineTo(9,75.2).curveTo(9,74.4,9.2,73.8).lineTo(9.2,73.7).lineTo(9,73.2).curveTo(9,70.8,10.6,69.4).curveTo(12,68.2,14,68.2).curveTo(16,68.2,17.5,69.4).curveTo(19,70.8,19,73.1).lineTo(19,73.4).lineTo(18.9,74.1).lineTo(19,75.1).lineTo(19,75.2).curveTo(19,76.8,18,78.2).curveTo(16.6,80.2,14,80.2).curveTo(10.8,80.2,9.6,77.5).closePath().moveTo(79.6,23.5).lineTo(79,21.2).curveTo(79,20.4,79.2,19.8).lineTo(79.2,19.7).lineTo(79,19.2).curveTo(79,16.8,80.6,15.4).curveTo(81.9,14.2,84,14.2).curveTo(86.1,14.2,87.4,15.4).curveTo(89,16.8,89,19.1).lineTo(89,19.4).lineTo(88.9,20.1).lineTo(89,21.1).lineTo(89,21.2).curveTo(89,22.8,88,24.2).curveTo(86.6,26.2,84,26.2).curveTo(80.7,26.2,79.6,23.5).closePath().moveTo(19.6,-16.5).lineTo(19,-18.8).curveTo(19,-19.6,19.2,-20.2).lineTo(19.2,-20.3).lineTo(19,-20.8).curveTo(19,-23.2,20.5,-24.6).curveTo(22,-25.8,24,-25.8).curveTo(26.1,-25.8,27.5,-24.6).curveTo(29,-23.2,29,-20.9).lineTo(29,-20.6).lineTo(28.9,-19.9).lineTo(29,-18.9).lineTo(29,-18.8).curveTo(29,-17.2,28,-15.8).curveTo(26.6,-13.8,24,-13.8).curveTo(20.8,-13.8,19.6,-16.5).closePath().moveTo(-36.4,-25.5).lineTo(-37,-27.8).curveTo(-37,-28.6,-36.8,-29.2).lineTo(-36.8,-29.3).lineTo(-37,-29.8).curveTo(-37,-32.2,-35.4,-33.6).curveTo(-34,-34.8,-32,-34.8).curveTo(-29.9,-34.8,-28.6,-33.6).curveTo(-27,-32.2,-27,-29.9).lineTo(-27,-29.6).lineTo(-27.1,-28.9).lineTo(-27,-27.9).lineTo(-27,-27.8).curveTo(-27,-26.2,-28,-24.8).curveTo(-29.4,-22.8,-32,-22.8).curveTo(-35.2,-22.8,-36.4,-25.5).closePath().moveTo(79.6,-66.5).lineTo(79,-68.8).curveTo(79,-69.6,79.2,-70.2).lineTo(79.2,-70.3).lineTo(79,-70.8).curveTo(79,-73.2,80.6,-74.6).curveTo(81.9,-75.8,84,-75.8).curveTo(86.1,-75.8,87.4,-74.6).curveTo(89,-73.2,89,-70.9).lineTo(89,-70.6).lineTo(88.9,-69.9).lineTo(89,-68.9).lineTo(89,-68.8).curveTo(89,-67.2,88,-65.8).curveTo(86.6,-63.8,84,-63.8).curveTo(80.7,-63.8,79.6,-66.5).closePath().moveTo(169.6,-74.5).lineTo(169,-76.8).curveTo(169,-77.6,169.2,-78.2).lineTo(169.2,-78.3).lineTo(169,-78.8).curveTo(169,-81.2,170.6,-82.6).curveTo(171.9,-83.8,174,-83.8).curveTo(176.1,-83.8,177.4,-82.6).curveTo(179,-81.2,179,-78.9).lineTo(179,-78.6).lineTo(178.9,-77.9).lineTo(179,-76.9).lineTo(179,-76.8).curveTo(179,-75.2,178,-73.8).curveTo(176.6,-71.8,174,-71.8).curveTo(170.7,-71.8,169.6,-74.5).closePath().moveTo(-120.5,-81.5).lineTo(-121,-83.8).curveTo(-121,-84.6,-120.8,-85.2).lineTo(-120.8,-85.3).lineTo(-121,-85.8).curveTo(-121,-88.2,-119.5,-89.6).curveTo(-118.1,-90.8,-116,-90.8).curveTo(-114,-90.8,-112.6,-89.6).curveTo(-111.1,-88.2,-111,-85.9).lineTo(-111,-85.6).lineTo(-111.1,-84.9).lineTo(-111,-83.9).lineTo(-111,-83.8).curveTo(-111,-82.2,-112,-80.8).curveTo(-113.4,-78.8,-116,-78.8).curveTo(-119.3,-78.8,-120.5,-81.5).closePath().moveTo(37.6,-92.5).lineTo(37,-94.8).curveTo(37,-95.6,37.2,-96.2).lineTo(37.2,-96.3).lineTo(37,-96.8).curveTo(37,-99.2,38.5,-100.6).curveTo(40,-101.8,42,-101.8).curveTo(44.1,-101.8,45.5,-100.6).curveTo(47,-99.2,47,-96.9).lineTo(47,-96.6).lineTo(46.9,-95.9).lineTo(47,-94.9).lineTo(47,-94.8).curveTo(47,-93.2,46,-91.8).curveTo(44.6,-89.8,42,-89.8).curveTo(38.8,-89.8,37.6,-92.5).closePath().moveTo(128.5,-94.5).lineTo(128,-96.8).curveTo(128,-97.6,128.2,-98.2).lineTo(128.2,-98.3).lineTo(128,-98.8).curveTo(128,-101.2,129.5,-102.6).curveTo(131,-103.8,133,-103.8).curveTo(135.1,-103.8,136.5,-102.6).curveTo(138,-101.2,138,-98.9).lineTo(138,-98.6).lineTo(137.9,-97.9).lineTo(138,-96.9).lineTo(138,-96.8).curveTo(138,-95.2,137,-93.8).curveTo(135.6,-91.8,133,-91.8).curveTo(129.8,-91.8,128.5,-94.5).closePath().moveTo(19.6,-126.5).lineTo(19,-128.8).curveTo(19,-129.6,19.2,-130.2).lineTo(19.2,-130.3).lineTo(19,-130.8).curveTo(19,-133.2,20.5,-134.6).curveTo(22,-135.8,24,-135.8).curveTo(26.1,-135.8,27.5,-134.6).curveTo(29,-133.2,29,-130.9).lineTo(29,-130.6).lineTo(28.9,-129.9).lineTo(29,-128.9).lineTo(29,-128.8).curveTo(29,-127.2,28,-125.8).curveTo(26.6,-123.8,24,-123.8).curveTo(20.8,-123.8,19.6,-126.5).closePath().moveTo(-220.5,-126.5).lineTo(-221,-128.8).curveTo(-221,-129.6,-220.8,-130.2).lineTo(-220.8,-130.3).lineTo(-221,-130.8).curveTo(-221,-133.2,-219.5,-134.6).curveTo(-218.1,-135.8,-216,-135.8).curveTo(-214,-135.8,-212.6,-134.6).curveTo(-211.1,-133.2,-211,-130.9).lineTo(-211,-130.6).lineTo(-211.1,-129.9).lineTo(-211,-128.9).lineTo(-211,-128.8).curveTo(-211,-127.2,-212,-125.8).curveTo(-213.4,-123.8,-216,-123.8).curveTo(-219.3,-123.8,-220.5,-126.5).closePath().moveTo(-36.4,-127.3).lineTo(-37,-129.6).curveTo(-37,-130.4,-36.8,-131).lineTo(-36.8,-131.1).lineTo(-37,-131.6).curveTo(-37,-134,-35.4,-135.4).curveTo(-34,-136.6,-32,-136.6).curveTo(-29.9,-136.6,-28.6,-135.4).curveTo(-27,-134,-27,-131.7).lineTo(-27,-131.4).lineTo(-27.1,-130.7).lineTo(-27,-129.7).lineTo(-27,-129.6).curveTo(-27,-128,-28,-126.6).curveTo(-29.4,-124.6,-32,-124.6).curveTo(-35.2,-124.6,-36.4,-127.3).closePath().moveTo(211.5,-130.5).lineTo(211,-132.8).curveTo(211,-133.6,211.2,-134.2).lineTo(211.2,-134.3).lineTo(211,-134.8).curveTo(211,-137.2,212.5,-138.6).curveTo(213.9,-139.8,216,-139.8).curveTo(218,-139.8,219.4,-138.6).curveTo(220.9,-137.2,221,-134.9).lineTo(221,-134.6).lineTo(220.9,-133.9).lineTo(221,-132.9).lineTo(221,-132.8).curveTo(221,-131.2,220,-129.8).curveTo(218.6,-127.8,216,-127.8).curveTo(212.7,-127.8,211.5,-130.5).closePath().moveTo(169.6,-137.5).lineTo(169,-139.8).curveTo(169,-140.6,169.2,-141.2).lineTo(169.2,-141.3).lineTo(169,-141.8).curveTo(169,-144.2,170.6,-145.6).curveTo(171.9,-146.8,174,-146.8).curveTo(176.1,-146.8,177.4,-145.6).curveTo(179,-144.2,179,-141.9).lineTo(179,-141.6).lineTo(178.9,-140.9).lineTo(179,-139.9).lineTo(179,-139.8).curveTo(179,-138.2,178,-136.8).curveTo(176.6,-134.8,174,-134.8).curveTo(170.7,-134.8,169.6,-137.5).closePath().moveTo(108.6,-161.2).lineTo(108,-163.4).curveTo(108,-164.2,108.2,-164.9).lineTo(108.2,-164.9).lineTo(108,-165.4).curveTo(108,-167.8,109.6,-169.2).curveTo(111,-170.5,113,-170.5).curveTo(115,-170.5,116.5,-169.2).curveTo(118,-167.9,118,-165.6).lineTo(118,-165.3).lineTo(117.9,-164.5).lineTo(118,-163.6).lineTo(118,-163.4).curveTo(118,-161.9,117,-160.4).curveTo(115.6,-158.4,113,-158.4).curveTo(109.8,-158.4,108.6,-161.2).closePath().moveTo(154.6,-179.5).lineTo(154,-181.8).curveTo(154,-182.6,154.2,-183.2).lineTo(154.2,-183.3).lineTo(154,-183.8).curveTo(154,-186.2,155.5,-187.6).curveTo(157,-188.8,159,-188.8).curveTo(161.1,-188.8,162.5,-187.6).curveTo(164,-186.2,164,-183.9).lineTo(164,-183.6).lineTo(163.9,-182.9).lineTo(164,-181.9).lineTo(164,-181.8).curveTo(164,-180.2,163,-178.8).curveTo(161.6,-176.8,159,-176.8).curveTo(155.8,-176.8,154.6,-179.5).closePath().moveTo(205.6,-196.9).lineTo(205,-199.2).curveTo(205,-200,205.2,-200.6).lineTo(205.2,-200.7).lineTo(205,-201.2).curveTo(205,-203.6,206.6,-205).curveTo(207.9,-206.2,210,-206.2).curveTo(212,-206.2,213.4,-205).curveTo(214.9,-203.6,215,-201.3).lineTo(215,-201).lineTo(214.9,-200.3).lineTo(215,-199.3).lineTo(215,-199.2).curveTo(215,-197.6,214,-196.2).curveTo(212.6,-194.2,210,-194.2).curveTo(206.7,-194.2,205.6,-196.9).closePath();
	this.shape_59.setTransform(330.9,261.175);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(204.9,-186.4).lineTo(204.9,-214).curveTo(205.1,-211.3,207.9,-209.3).curveTo(210.8,-207.2,215.1,-207.2).moveTo(153.9,-169).lineTo(153.9,-196.6).curveTo(154.1,-193.9,156.9,-191.9).curveTo(159.9,-189.8,164.1,-189.8).moveTo(168.9,-127).lineTo(168.9,-154.6).curveTo(169.1,-151.9,171.9,-149.9).curveTo(174.8,-147.8,179.1,-147.8).moveTo(210.9,-120).lineTo(210.9,-147.6).curveTo(211.1,-144.9,213.9,-142.9).curveTo(216.8,-140.8,221.1,-140.8).moveTo(168.9,-64).lineTo(168.9,-91.6).curveTo(169.1,-88.9,171.9,-86.9).curveTo(174.8,-84.8,179.1,-84.8).moveTo(107.9,-150.6).lineTo(107.9,-178.3).curveTo(108.1,-175.5,110.9,-173.5).curveTo(113.9,-171.5,118.1,-171.5).moveTo(39.1,-181).lineTo(39.1,-208.7).curveTo(39.2,-205.9,42,-203.9).curveTo(44.9,-201.9,49.2,-201.9).moveTo(36.9,-82).lineTo(36.9,-109.6).curveTo(37.1,-106.9,39.9,-104.9).curveTo(42.9,-102.8,47.1,-102.8).moveTo(18.9,-116).lineTo(18.9,-143.6).curveTo(19.1,-140.9,21.9,-138.9).curveTo(24.9,-136.8,29.1,-136.8).moveTo(127.9,-84).lineTo(127.9,-111.6).curveTo(128.1,-108.9,130.9,-106.9).curveTo(133.9,-104.8,138.1,-104.8).moveTo(78.9,-56).lineTo(78.9,-83.6).curveTo(79.1,-80.9,81.9,-78.9).curveTo(84.9,-76.8,89.1,-76.8).moveTo(78.9,34).lineTo(78.9,6.4).curveTo(79.1,9.1,81.9,11.1).curveTo(84.9,13.2,89.1,13.2).moveTo(18.9,-6).lineTo(18.9,-33.6).curveTo(19.1,-30.9,21.9,-28.9).curveTo(24.9,-26.8,29.1,-26.8).moveTo(8.9,88).lineTo(8.9,60.4).curveTo(9.1,63.1,11.9,65.1).curveTo(14.9,67.2,19.1,67.2).moveTo(71.9,122.8).lineTo(71.9,95.2).curveTo(72,97.9,74.9,99.9).curveTo(77.8,102,82,102).moveTo(-121,-71).lineTo(-121,-98.6).curveTo(-120.9,-95.9,-118.1,-93.9).curveTo(-115.1,-91.8,-110.9,-91.8).moveTo(-37.1,-116.8).lineTo(-37.1,-144.4).curveTo(-36.9,-141.7,-34.1,-139.7).curveTo(-31.1,-137.6,-26.9,-137.6).moveTo(-221,-116).lineTo(-221,-143.6).curveTo(-220.9,-140.9,-218.1,-138.9).curveTo(-215.1,-136.8,-210.9,-136.8).moveTo(-185,106).lineTo(-185,78.3).curveTo(-184.9,81.1,-182.1,83.1).curveTo(-179.1,85.1,-174.9,85.1).moveTo(-37.1,-15).lineTo(-37.1,-42.6).curveTo(-36.9,-39.9,-34.1,-37.9).curveTo(-31.1,-35.8,-26.9,-35.8).moveTo(-66.1,123).lineTo(-66.1,95.4).curveTo(-65.9,98.1,-63.1,100.1).curveTo(-60.1,102.2,-55.9,102.2).moveTo(78.9,186).lineTo(78.9,158.4).curveTo(79.1,161.1,81.9,163.1).curveTo(84.9,165.2,89.1,165.2).moveTo(-11.1,214).lineTo(-11.1,186.4).curveTo(-10.9,189.1,-8.1,191.1).curveTo(-5.1,193.2,-0.9,193.2);
	this.shape_60.setTransform(340.95,246.225);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.beginFill("#000000").beginStroke().moveTo(-10.4,203.5).lineTo(-11,201.2).curveTo(-11,200.4,-10.8,199.8).lineTo(-10.8,199.7).lineTo(-11,199.2).curveTo(-11,196.8,-9.4,195.4).curveTo(-8.1,194.2,-6,194.2).curveTo(-3.9,194.2,-2.6,195.4).curveTo(-1.1,196.8,-1,199.1).lineTo(-1,199.4).lineTo(-1.1,200.1).lineTo(-1,201.1).lineTo(-1,201.2).curveTo(-1,202.8,-2,204.2).curveTo(-3.4,206.2,-6,206.2).curveTo(-9.3,206.2,-10.4,203.5).closePath().moveTo(79.6,175.5).lineTo(79,173.2).curveTo(79,172.4,79.2,171.8).lineTo(79.2,171.7).lineTo(79,171.2).curveTo(79,168.8,80.6,167.4).curveTo(81.9,166.2,84,166.2).curveTo(86.1,166.2,87.4,167.4).curveTo(89,168.8,89,171.1).lineTo(89,171.4).lineTo(88.9,172.1).lineTo(89,173.1).lineTo(89,173.2).curveTo(89,174.8,88,176.2).curveTo(86.6,178.2,84,178.2).curveTo(80.7,178.2,79.6,175.5).closePath().moveTo(-65.5,112.5).lineTo(-66,110.2).curveTo(-66,109.4,-65.8,108.8).lineTo(-65.8,108.7).lineTo(-66,108.2).curveTo(-66,105.8,-64.4,104.4).curveTo(-63.1,103.2,-61,103.2).curveTo(-59,103.2,-57.6,104.4).curveTo(-56.1,105.8,-56,108.1).lineTo(-56,108.4).lineTo(-56.1,109.1).lineTo(-56,110.1).lineTo(-56,110.2).curveTo(-56,111.8,-57,113.2).curveTo(-58.4,115.2,-61,115.2).curveTo(-64.3,115.2,-65.5,112.5).closePath().moveTo(72.5,112.3).lineTo(71.9,110).curveTo(71.9,109.2,72.1,108.6).lineTo(72.1,108.5).lineTo(71.9,108).curveTo(72,105.6,73.5,104.2).curveTo(74.9,103,77,103).curveTo(79,103,80.4,104.2).curveTo(81.9,105.6,81.9,107.9).lineTo(81.9,108.2).lineTo(81.8,108.9).lineTo(81.9,109.9).lineTo(81.9,110).curveTo(82,111.6,80.9,113).curveTo(79.6,115,77,115).curveTo(73.7,115,72.5,112.3).closePath().moveTo(-184.5,95.4).lineTo(-185,93.2).curveTo(-185,92.4,-184.8,91.7).lineTo(-184.8,91.7).lineTo(-185,91.2).curveTo(-185,88.8,-183.5,87.4).curveTo(-182.1,86.1,-180,86.1).curveTo(-178,86.1,-176.6,87.4).curveTo(-175.1,88.7,-175,91).lineTo(-175,91.3).lineTo(-175.1,92.1).lineTo(-175,93).lineTo(-175,93.2).curveTo(-175,94.7,-176,96.2).curveTo(-177.4,98.2,-180,98.2).curveTo(-183.3,98.2,-184.5,95.4).closePath().moveTo(9.6,77.5).lineTo(9,75.2).curveTo(9,74.4,9.2,73.8).lineTo(9.2,73.7).lineTo(9,73.2).curveTo(9,70.8,10.6,69.4).curveTo(12,68.2,14,68.2).curveTo(16,68.2,17.5,69.4).curveTo(19,70.8,19,73.1).lineTo(19,73.4).lineTo(18.9,74.1).lineTo(19,75.1).lineTo(19,75.2).curveTo(19,76.8,18,78.2).curveTo(16.6,80.2,14,80.2).curveTo(10.8,80.2,9.6,77.5).closePath().moveTo(79.6,23.5).lineTo(79,21.2).curveTo(79,20.4,79.2,19.8).lineTo(79.2,19.7).lineTo(79,19.2).curveTo(79,16.8,80.6,15.4).curveTo(81.9,14.2,84,14.2).curveTo(86.1,14.2,87.4,15.4).curveTo(89,16.8,89,19.1).lineTo(89,19.4).lineTo(88.9,20.1).lineTo(89,21.1).lineTo(89,21.2).curveTo(89,22.8,88,24.2).curveTo(86.6,26.2,84,26.2).curveTo(80.7,26.2,79.6,23.5).closePath().moveTo(19.6,-16.5).lineTo(19,-18.8).curveTo(19,-19.6,19.2,-20.2).lineTo(19.2,-20.3).lineTo(19,-20.8).curveTo(19,-23.2,20.5,-24.6).curveTo(22,-25.8,24,-25.8).curveTo(26.1,-25.8,27.5,-24.6).curveTo(29,-23.2,29,-20.9).lineTo(29,-20.6).lineTo(28.9,-19.9).lineTo(29,-18.9).lineTo(29,-18.8).curveTo(29,-17.2,28,-15.8).curveTo(26.6,-13.8,24,-13.8).curveTo(20.8,-13.8,19.6,-16.5).closePath().moveTo(-36.4,-25.5).lineTo(-37,-27.8).curveTo(-37,-28.6,-36.8,-29.2).lineTo(-36.8,-29.3).lineTo(-37,-29.8).curveTo(-37,-32.2,-35.4,-33.6).curveTo(-34,-34.8,-32,-34.8).curveTo(-29.9,-34.8,-28.6,-33.6).curveTo(-27,-32.2,-27,-29.9).lineTo(-27,-29.6).lineTo(-27.1,-28.9).lineTo(-27,-27.9).lineTo(-27,-27.8).curveTo(-27,-26.2,-28,-24.8).curveTo(-29.4,-22.8,-32,-22.8).curveTo(-35.2,-22.8,-36.4,-25.5).closePath().moveTo(79.6,-66.5).lineTo(79,-68.8).curveTo(79,-69.6,79.2,-70.2).lineTo(79.2,-70.3).lineTo(79,-70.8).curveTo(79,-73.2,80.6,-74.6).curveTo(81.9,-75.8,84,-75.8).curveTo(86.1,-75.8,87.4,-74.6).curveTo(89,-73.2,89,-70.9).lineTo(89,-70.6).lineTo(88.9,-69.9).lineTo(89,-68.9).lineTo(89,-68.8).curveTo(89,-67.2,88,-65.8).curveTo(86.6,-63.8,84,-63.8).curveTo(80.7,-63.8,79.6,-66.5).closePath().moveTo(169.6,-74.5).lineTo(169,-76.8).curveTo(169,-77.6,169.2,-78.2).lineTo(169.2,-78.3).lineTo(169,-78.8).curveTo(169,-81.2,170.6,-82.6).curveTo(171.9,-83.8,174,-83.8).curveTo(176.1,-83.8,177.4,-82.6).curveTo(179,-81.2,179,-78.9).lineTo(179,-78.6).lineTo(178.9,-77.9).lineTo(179,-76.9).lineTo(179,-76.8).curveTo(179,-75.2,178,-73.8).curveTo(176.6,-71.8,174,-71.8).curveTo(170.7,-71.8,169.6,-74.5).closePath().moveTo(-120.5,-81.5).lineTo(-121,-83.8).curveTo(-121,-84.6,-120.8,-85.2).lineTo(-120.8,-85.3).lineTo(-121,-85.8).curveTo(-121,-88.2,-119.5,-89.6).curveTo(-118.1,-90.8,-116,-90.8).curveTo(-114,-90.8,-112.6,-89.6).curveTo(-111.1,-88.2,-111,-85.9).lineTo(-111,-85.6).lineTo(-111.1,-84.9).lineTo(-111,-83.9).lineTo(-111,-83.8).curveTo(-111,-82.2,-112,-80.8).curveTo(-113.4,-78.8,-116,-78.8).curveTo(-119.3,-78.8,-120.5,-81.5).closePath().moveTo(37.6,-92.5).lineTo(37,-94.8).curveTo(37,-95.6,37.2,-96.2).lineTo(37.2,-96.3).lineTo(37,-96.8).curveTo(37,-99.2,38.5,-100.6).curveTo(40,-101.8,42,-101.8).curveTo(44.1,-101.8,45.5,-100.6).curveTo(47,-99.2,47,-96.9).lineTo(47,-96.6).lineTo(46.9,-95.9).lineTo(47,-94.9).lineTo(47,-94.8).curveTo(47,-93.2,46,-91.8).curveTo(44.6,-89.8,42,-89.8).curveTo(38.8,-89.8,37.6,-92.5).closePath().moveTo(128.5,-94.5).lineTo(128,-96.8).curveTo(128,-97.6,128.2,-98.2).lineTo(128.2,-98.3).lineTo(128,-98.8).curveTo(128,-101.2,129.5,-102.6).curveTo(131,-103.8,133,-103.8).curveTo(135.1,-103.8,136.5,-102.6).curveTo(138,-101.2,138,-98.9).lineTo(138,-98.6).lineTo(137.9,-97.9).lineTo(138,-96.9).lineTo(138,-96.8).curveTo(138,-95.2,137,-93.8).curveTo(135.6,-91.8,133,-91.8).curveTo(129.8,-91.8,128.5,-94.5).closePath().moveTo(19.6,-126.5).lineTo(19,-128.8).curveTo(19,-129.6,19.2,-130.2).lineTo(19.2,-130.3).lineTo(19,-130.8).curveTo(19,-133.2,20.5,-134.6).curveTo(22,-135.8,24,-135.8).curveTo(26.1,-135.8,27.5,-134.6).curveTo(29,-133.2,29,-130.9).lineTo(29,-130.6).lineTo(28.9,-129.9).lineTo(29,-128.9).lineTo(29,-128.8).curveTo(29,-127.2,28,-125.8).curveTo(26.6,-123.8,24,-123.8).curveTo(20.8,-123.8,19.6,-126.5).closePath().moveTo(-220.5,-126.5).lineTo(-221,-128.8).curveTo(-221,-129.6,-220.8,-130.2).lineTo(-220.8,-130.3).lineTo(-221,-130.8).curveTo(-221,-133.2,-219.5,-134.6).curveTo(-218.1,-135.8,-216,-135.8).curveTo(-214,-135.8,-212.6,-134.6).curveTo(-211.1,-133.2,-211,-130.9).lineTo(-211,-130.6).lineTo(-211.1,-129.9).lineTo(-211,-128.9).lineTo(-211,-128.8).curveTo(-211,-127.2,-212,-125.8).curveTo(-213.4,-123.8,-216,-123.8).curveTo(-219.3,-123.8,-220.5,-126.5).closePath().moveTo(-36.4,-127.3).lineTo(-37,-129.6).curveTo(-37,-130.4,-36.8,-131).lineTo(-36.8,-131.1).lineTo(-37,-131.6).curveTo(-37,-134,-35.4,-135.4).curveTo(-34,-136.6,-32,-136.6).curveTo(-29.9,-136.6,-28.6,-135.4).curveTo(-27,-134,-27,-131.7).lineTo(-27,-131.4).lineTo(-27.1,-130.7).lineTo(-27,-129.7).lineTo(-27,-129.6).curveTo(-27,-128,-28,-126.6).curveTo(-29.4,-124.6,-32,-124.6).curveTo(-35.2,-124.6,-36.4,-127.3).closePath().moveTo(211.5,-130.5).lineTo(211,-132.8).curveTo(211,-133.6,211.2,-134.2).lineTo(211.2,-134.3).lineTo(211,-134.8).curveTo(211,-137.2,212.5,-138.6).curveTo(213.9,-139.8,216,-139.8).curveTo(218,-139.8,219.4,-138.6).curveTo(220.9,-137.2,221,-134.9).lineTo(221,-134.6).lineTo(220.9,-133.9).lineTo(221,-132.9).lineTo(221,-132.8).curveTo(221,-131.2,220,-129.8).curveTo(218.6,-127.8,216,-127.8).curveTo(212.7,-127.8,211.5,-130.5).closePath().moveTo(169.6,-137.5).lineTo(169,-139.8).curveTo(169,-140.6,169.2,-141.2).lineTo(169.2,-141.3).lineTo(169,-141.8).curveTo(169,-144.2,170.6,-145.6).curveTo(171.9,-146.8,174,-146.8).curveTo(176.1,-146.8,177.4,-145.6).curveTo(179,-144.2,179,-141.9).lineTo(179,-141.6).lineTo(178.9,-140.9).lineTo(179,-139.9).lineTo(179,-139.8).curveTo(179,-138.2,178,-136.8).curveTo(176.6,-134.8,174,-134.8).curveTo(170.7,-134.8,169.6,-137.5).closePath().moveTo(108.6,-161.2).lineTo(108,-163.4).curveTo(108,-164.2,108.2,-164.9).lineTo(108.2,-164.9).lineTo(108,-165.4).curveTo(108,-167.8,109.6,-169.2).curveTo(111,-170.5,113,-170.5).curveTo(115,-170.5,116.5,-169.2).curveTo(118,-167.9,118,-165.6).lineTo(118,-165.3).lineTo(117.9,-164.5).lineTo(118,-163.6).lineTo(118,-163.4).curveTo(118,-161.9,117,-160.4).curveTo(115.6,-158.4,113,-158.4).curveTo(109.8,-158.4,108.6,-161.2).closePath().moveTo(154.6,-179.5).lineTo(154,-181.8).curveTo(154,-182.6,154.2,-183.2).lineTo(154.2,-183.3).lineTo(154,-183.8).curveTo(154,-186.2,155.5,-187.6).curveTo(157,-188.8,159,-188.8).curveTo(161.1,-188.8,162.5,-187.6).curveTo(164,-186.2,164,-183.9).lineTo(164,-183.6).lineTo(163.9,-182.9).lineTo(164,-181.9).lineTo(164,-181.8).curveTo(164,-180.2,163,-178.8).curveTo(161.6,-176.8,159,-176.8).curveTo(155.8,-176.8,154.6,-179.5).closePath().moveTo(39.6,-191.6).lineTo(39.1,-193.8).curveTo(39.1,-194.6,39.3,-195.3).lineTo(39.3,-195.3).lineTo(39.1,-195.8).curveTo(39.1,-198.2,40.6,-199.6).curveTo(42,-200.9,44.1,-200.9).curveTo(46.1,-200.9,47.5,-199.6).curveTo(49,-198.3,49.1,-196).lineTo(49.1,-195.7).lineTo(49,-194.9).lineTo(49.1,-194).lineTo(49.1,-193.8).curveTo(49.1,-192.3,48.1,-190.8).curveTo(46.7,-188.8,44.1,-188.8).curveTo(40.8,-188.8,39.6,-191.6).closePath().moveTo(205.6,-196.9).lineTo(205,-199.2).curveTo(205,-200,205.2,-200.6).lineTo(205.2,-200.7).lineTo(205,-201.2).curveTo(205,-203.6,206.6,-205).curveTo(207.9,-206.2,210,-206.2).curveTo(212,-206.2,213.4,-205).curveTo(214.9,-203.6,215,-201.3).lineTo(215,-201).lineTo(214.9,-200.3).lineTo(215,-199.3).lineTo(215,-199.2).curveTo(215,-197.6,214,-196.2).curveTo(212.6,-194.2,210,-194.2).curveTo(206.7,-194.2,205.6,-196.9).closePath();
	this.shape_61.setTransform(330.9,261.175);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(202.9,-186.4).lineTo(202.9,-214).curveTo(203.1,-211.3,205.9,-209.3).curveTo(208.8,-207.2,213.1,-207.2).moveTo(151.9,-169).lineTo(151.9,-196.6).curveTo(152.1,-193.9,154.9,-191.9).curveTo(157.9,-189.8,162.1,-189.8).moveTo(166.9,-127).lineTo(166.9,-154.6).curveTo(167.1,-151.9,169.9,-149.9).curveTo(172.8,-147.8,177.1,-147.8).moveTo(208.9,-120).lineTo(208.9,-147.6).curveTo(209.1,-144.9,211.9,-142.9).curveTo(214.8,-140.8,219.1,-140.8).moveTo(166.9,-64).lineTo(166.9,-91.6).curveTo(167.1,-88.9,169.9,-86.9).curveTo(172.8,-84.8,177.1,-84.8).moveTo(212.9,-33.2).lineTo(212.9,-60.9).curveTo(213.1,-58.1,215.9,-56.1).curveTo(218.8,-54.1,223.1,-54.1).moveTo(105.9,-150.6).lineTo(105.9,-178.3).curveTo(106.1,-175.5,108.9,-173.5).curveTo(111.9,-171.5,116.1,-171.5).moveTo(37.1,-181).lineTo(37.1,-208.7).curveTo(37.2,-205.9,40,-203.9).curveTo(42.9,-201.9,47.2,-201.9).moveTo(34.9,-82).lineTo(34.9,-109.6).curveTo(35.1,-106.9,37.9,-104.9).curveTo(40.9,-102.8,45.1,-102.8).moveTo(16.9,-116).lineTo(16.9,-143.6).curveTo(17.1,-140.9,19.9,-138.9).curveTo(22.9,-136.8,27.1,-136.8).moveTo(125.9,-84).lineTo(125.9,-111.6).curveTo(126.1,-108.9,128.9,-106.9).curveTo(131.9,-104.8,136.1,-104.8).moveTo(76.9,-56).lineTo(76.9,-83.6).curveTo(77.1,-80.9,79.9,-78.9).curveTo(82.9,-76.8,87.1,-76.8).moveTo(76.9,34).lineTo(76.9,6.4).curveTo(77.1,9.1,79.9,11.1).curveTo(82.9,13.2,87.1,13.2).moveTo(16.9,-6).lineTo(16.9,-33.6).curveTo(17.1,-30.9,19.9,-28.9).curveTo(22.9,-26.8,27.1,-26.8).moveTo(6.9,88).lineTo(6.9,60.4).curveTo(7.1,63.1,9.9,65.1).curveTo(12.9,67.2,17.1,67.2).moveTo(69.9,122.8).lineTo(69.9,95.2).curveTo(70,97.9,72.9,99.9).curveTo(75.8,102,80,102).moveTo(-123,-71).lineTo(-123,-98.6).curveTo(-122.9,-95.9,-120.1,-93.9).curveTo(-117.1,-91.8,-112.9,-91.8).moveTo(-39.1,-116.8).lineTo(-39.1,-144.4).curveTo(-38.9,-141.7,-36.1,-139.7).curveTo(-33.1,-137.6,-28.9,-137.6).moveTo(-223,-116).lineTo(-223,-143.6).curveTo(-222.9,-140.9,-220.1,-138.9).curveTo(-217.1,-136.8,-212.9,-136.8).moveTo(-187,106).lineTo(-187,78.3).curveTo(-186.9,81.1,-184.1,83.1).curveTo(-181.1,85.1,-176.9,85.1).moveTo(-39.1,-15).lineTo(-39.1,-42.6).curveTo(-38.9,-39.9,-36.1,-37.9).curveTo(-33.1,-35.8,-28.9,-35.8).moveTo(-68.1,123).lineTo(-68.1,95.4).curveTo(-67.9,98.1,-65.1,100.1).curveTo(-62.1,102.2,-57.9,102.2).moveTo(76.9,186).lineTo(76.9,158.4).curveTo(77.1,161.1,79.9,163.1).curveTo(82.9,165.2,87.1,165.2).moveTo(-13.1,214).lineTo(-13.1,186.4).curveTo(-12.9,189.1,-10.1,191.1).curveTo(-7.1,193.2,-2.9,193.2);
	this.shape_62.setTransform(342.95,246.225);

	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.beginFill("#000000").beginStroke().moveTo(-12.4,203.5).lineTo(-13,201.2).curveTo(-13,200.4,-12.8,199.8).lineTo(-12.8,199.7).lineTo(-13,199.2).curveTo(-13,196.8,-11.4,195.4).curveTo(-10.1,194.2,-8,194.2).curveTo(-5.9,194.2,-4.6,195.4).curveTo(-3.1,196.8,-3,199.1).lineTo(-3,199.4).lineTo(-3.1,200.1).lineTo(-3,201.1).lineTo(-3,201.2).curveTo(-3,202.8,-4,204.2).curveTo(-5.4,206.2,-8,206.2).curveTo(-11.3,206.2,-12.4,203.5).closePath().moveTo(77.6,175.5).lineTo(77,173.2).curveTo(77,172.4,77.2,171.8).lineTo(77.2,171.7).lineTo(77,171.2).curveTo(77,168.8,78.6,167.4).curveTo(79.9,166.2,82,166.2).curveTo(84.1,166.2,85.4,167.4).curveTo(87,168.8,87,171.1).lineTo(87,171.4).lineTo(86.9,172.1).lineTo(87,173.1).lineTo(87,173.2).curveTo(87,174.8,86,176.2).curveTo(84.6,178.2,82,178.2).curveTo(78.7,178.2,77.6,175.5).closePath().moveTo(-67.5,112.5).lineTo(-68,110.2).curveTo(-68,109.4,-67.8,108.8).lineTo(-67.8,108.7).lineTo(-68,108.2).curveTo(-68,105.8,-66.4,104.4).curveTo(-65.1,103.2,-63,103.2).curveTo(-61,103.2,-59.6,104.4).curveTo(-58.1,105.8,-58,108.1).lineTo(-58,108.4).lineTo(-58.1,109.1).lineTo(-58,110.1).lineTo(-58,110.2).curveTo(-58,111.8,-59,113.2).curveTo(-60.4,115.2,-63,115.2).curveTo(-66.3,115.2,-67.5,112.5).closePath().moveTo(70.5,112.3).lineTo(69.9,110).curveTo(69.9,109.2,70.1,108.6).lineTo(70.1,108.5).lineTo(69.9,108).curveTo(70,105.6,71.5,104.2).curveTo(72.9,103,75,103).curveTo(77,103,78.4,104.2).curveTo(79.9,105.6,79.9,107.9).lineTo(79.9,108.2).lineTo(79.8,108.9).lineTo(79.9,109.9).lineTo(79.9,110).curveTo(80,111.6,78.9,113).curveTo(77.6,115,75,115).curveTo(71.7,115,70.5,112.3).closePath().moveTo(-186.5,95.4).lineTo(-187,93.2).curveTo(-187,92.4,-186.8,91.7).lineTo(-186.8,91.7).lineTo(-187,91.2).curveTo(-187,88.8,-185.5,87.4).curveTo(-184.1,86.1,-182,86.1).curveTo(-180,86.1,-178.6,87.4).curveTo(-177.1,88.7,-177,91).lineTo(-177,91.3).lineTo(-177.1,92.1).lineTo(-177,93).lineTo(-177,93.2).curveTo(-177,94.7,-178,96.2).curveTo(-179.4,98.2,-182,98.2).curveTo(-185.3,98.2,-186.5,95.4).closePath().moveTo(7.6,77.5).lineTo(7,75.2).curveTo(7,74.4,7.2,73.8).lineTo(7.2,73.7).lineTo(7,73.2).curveTo(7,70.8,8.6,69.4).curveTo(10,68.2,12,68.2).curveTo(14,68.2,15.5,69.4).curveTo(17,70.8,17,73.1).lineTo(17,73.4).lineTo(16.9,74.1).lineTo(17,75.1).lineTo(17,75.2).curveTo(17,76.8,16,78.2).curveTo(14.6,80.2,12,80.2).curveTo(8.8,80.2,7.6,77.5).closePath().moveTo(77.6,23.5).lineTo(77,21.2).curveTo(77,20.4,77.2,19.8).lineTo(77.2,19.7).lineTo(77,19.2).curveTo(77,16.8,78.6,15.4).curveTo(79.9,14.2,82,14.2).curveTo(84.1,14.2,85.4,15.4).curveTo(87,16.8,87,19.1).lineTo(87,19.4).lineTo(86.9,20.1).lineTo(87,21.1).lineTo(87,21.2).curveTo(87,22.8,86,24.2).curveTo(84.6,26.2,82,26.2).curveTo(78.7,26.2,77.6,23.5).closePath().moveTo(17.6,-16.5).lineTo(17,-18.8).curveTo(17,-19.6,17.2,-20.2).lineTo(17.2,-20.3).lineTo(17,-20.8).curveTo(17,-23.2,18.5,-24.6).curveTo(20,-25.8,22,-25.8).curveTo(24.1,-25.8,25.5,-24.6).curveTo(27,-23.2,27,-20.9).lineTo(27,-20.6).lineTo(26.9,-19.9).lineTo(27,-18.9).lineTo(27,-18.8).curveTo(27,-17.2,26,-15.8).curveTo(24.6,-13.8,22,-13.8).curveTo(18.8,-13.8,17.6,-16.5).closePath().moveTo(-38.4,-25.5).lineTo(-39,-27.8).curveTo(-39,-28.6,-38.8,-29.2).lineTo(-38.8,-29.3).lineTo(-39,-29.8).curveTo(-39,-32.2,-37.4,-33.6).curveTo(-36,-34.8,-34,-34.8).curveTo(-31.9,-34.8,-30.6,-33.6).curveTo(-29,-32.2,-29,-29.9).lineTo(-29,-29.6).lineTo(-29.1,-28.9).lineTo(-29,-27.9).lineTo(-29,-27.8).curveTo(-29,-26.2,-30,-24.8).curveTo(-31.4,-22.8,-34,-22.8).curveTo(-37.2,-22.8,-38.4,-25.5).closePath().moveTo(213.6,-43.8).lineTo(213,-46).curveTo(213,-46.8,213.2,-47.5).lineTo(213.2,-47.5).lineTo(213,-48).curveTo(213,-50.4,214.6,-51.8).curveTo(216,-53.1,218,-53.1).curveTo(220.1,-53.1,221.4,-51.8).curveTo(223,-50.5,223,-48.2).lineTo(223,-47.9).lineTo(222.9,-47.1).lineTo(223,-46.2).lineTo(223,-46).curveTo(223,-44.5,222,-43).curveTo(220.6,-41,218,-41).curveTo(214.8,-41,213.6,-43.8).closePath().moveTo(77.6,-66.5).lineTo(77,-68.8).curveTo(77,-69.6,77.2,-70.2).lineTo(77.2,-70.3).lineTo(77,-70.8).curveTo(77,-73.2,78.6,-74.6).curveTo(79.9,-75.8,82,-75.8).curveTo(84.1,-75.8,85.4,-74.6).curveTo(87,-73.2,87,-70.9).lineTo(87,-70.6).lineTo(86.9,-69.9).lineTo(87,-68.9).lineTo(87,-68.8).curveTo(87,-67.2,86,-65.8).curveTo(84.6,-63.8,82,-63.8).curveTo(78.7,-63.8,77.6,-66.5).closePath().moveTo(167.6,-74.5).lineTo(167,-76.8).curveTo(167,-77.6,167.2,-78.2).lineTo(167.2,-78.3).lineTo(167,-78.8).curveTo(167,-81.2,168.6,-82.6).curveTo(169.9,-83.8,172,-83.8).curveTo(174.1,-83.8,175.4,-82.6).curveTo(177,-81.2,177,-78.9).lineTo(177,-78.6).lineTo(176.9,-77.9).lineTo(177,-76.9).lineTo(177,-76.8).curveTo(177,-75.2,176,-73.8).curveTo(174.6,-71.8,172,-71.8).curveTo(168.7,-71.8,167.6,-74.5).closePath().moveTo(-122.5,-81.5).lineTo(-123,-83.8).curveTo(-123,-84.6,-122.8,-85.2).lineTo(-122.8,-85.3).lineTo(-123,-85.8).curveTo(-123,-88.2,-121.5,-89.6).curveTo(-120.1,-90.8,-118,-90.8).curveTo(-116,-90.8,-114.6,-89.6).curveTo(-113.1,-88.2,-113,-85.9).lineTo(-113,-85.6).lineTo(-113.1,-84.9).lineTo(-113,-83.9).lineTo(-113,-83.8).curveTo(-113,-82.2,-114,-80.8).curveTo(-115.4,-78.8,-118,-78.8).curveTo(-121.3,-78.8,-122.5,-81.5).closePath().moveTo(35.6,-92.5).lineTo(35,-94.8).curveTo(35,-95.6,35.2,-96.2).lineTo(35.2,-96.3).lineTo(35,-96.8).curveTo(35,-99.2,36.5,-100.6).curveTo(38,-101.8,40,-101.8).curveTo(42.1,-101.8,43.5,-100.6).curveTo(45,-99.2,45,-96.9).lineTo(45,-96.6).lineTo(44.9,-95.9).lineTo(45,-94.9).lineTo(45,-94.8).curveTo(45,-93.2,44,-91.8).curveTo(42.6,-89.8,40,-89.8).curveTo(36.8,-89.8,35.6,-92.5).closePath().moveTo(126.5,-94.5).lineTo(126,-96.8).curveTo(126,-97.6,126.2,-98.2).lineTo(126.2,-98.3).lineTo(126,-98.8).curveTo(126,-101.2,127.5,-102.6).curveTo(129,-103.8,131,-103.8).curveTo(133.1,-103.8,134.5,-102.6).curveTo(136,-101.2,136,-98.9).lineTo(136,-98.6).lineTo(135.9,-97.9).lineTo(136,-96.9).lineTo(136,-96.8).curveTo(136,-95.2,135,-93.8).curveTo(133.6,-91.8,131,-91.8).curveTo(127.8,-91.8,126.5,-94.5).closePath().moveTo(17.6,-126.5).lineTo(17,-128.8).curveTo(17,-129.6,17.2,-130.2).lineTo(17.2,-130.3).lineTo(17,-130.8).curveTo(17,-133.2,18.5,-134.6).curveTo(20,-135.8,22,-135.8).curveTo(24.1,-135.8,25.5,-134.6).curveTo(27,-133.2,27,-130.9).lineTo(27,-130.6).lineTo(26.9,-129.9).lineTo(27,-128.9).lineTo(27,-128.8).curveTo(27,-127.2,26,-125.8).curveTo(24.6,-123.8,22,-123.8).curveTo(18.8,-123.8,17.6,-126.5).closePath().moveTo(-222.5,-126.5).lineTo(-223,-128.8).curveTo(-223,-129.6,-222.8,-130.2).lineTo(-222.8,-130.3).lineTo(-223,-130.8).curveTo(-223,-133.2,-221.5,-134.6).curveTo(-220.1,-135.8,-218,-135.8).curveTo(-216,-135.8,-214.6,-134.6).curveTo(-213.1,-133.2,-213,-130.9).lineTo(-213,-130.6).lineTo(-213.1,-129.9).lineTo(-213,-128.9).lineTo(-213,-128.8).curveTo(-213,-127.2,-214,-125.8).curveTo(-215.4,-123.8,-218,-123.8).curveTo(-221.3,-123.8,-222.5,-126.5).closePath().moveTo(-38.4,-127.3).lineTo(-39,-129.6).curveTo(-39,-130.4,-38.8,-131).lineTo(-38.8,-131.1).lineTo(-39,-131.6).curveTo(-39,-134,-37.4,-135.4).curveTo(-36,-136.6,-34,-136.6).curveTo(-31.9,-136.6,-30.6,-135.4).curveTo(-29,-134,-29,-131.7).lineTo(-29,-131.4).lineTo(-29.1,-130.7).lineTo(-29,-129.7).lineTo(-29,-129.6).curveTo(-29,-128,-30,-126.6).curveTo(-31.4,-124.6,-34,-124.6).curveTo(-37.2,-124.6,-38.4,-127.3).closePath().moveTo(209.5,-130.5).lineTo(209,-132.8).curveTo(209,-133.6,209.2,-134.2).lineTo(209.2,-134.3).lineTo(209,-134.8).curveTo(209,-137.2,210.5,-138.6).curveTo(211.9,-139.8,214,-139.8).curveTo(216,-139.8,217.4,-138.6).curveTo(218.9,-137.2,219,-134.9).lineTo(219,-134.6).lineTo(218.9,-133.9).lineTo(219,-132.9).lineTo(219,-132.8).curveTo(219,-131.2,218,-129.8).curveTo(216.6,-127.8,214,-127.8).curveTo(210.7,-127.8,209.5,-130.5).closePath().moveTo(167.6,-137.5).lineTo(167,-139.8).curveTo(167,-140.6,167.2,-141.2).lineTo(167.2,-141.3).lineTo(167,-141.8).curveTo(167,-144.2,168.6,-145.6).curveTo(169.9,-146.8,172,-146.8).curveTo(174.1,-146.8,175.4,-145.6).curveTo(177,-144.2,177,-141.9).lineTo(177,-141.6).lineTo(176.9,-140.9).lineTo(177,-139.9).lineTo(177,-139.8).curveTo(177,-138.2,176,-136.8).curveTo(174.6,-134.8,172,-134.8).curveTo(168.7,-134.8,167.6,-137.5).closePath().moveTo(106.6,-161.2).lineTo(106,-163.4).curveTo(106,-164.2,106.2,-164.9).lineTo(106.2,-164.9).lineTo(106,-165.4).curveTo(106,-167.8,107.6,-169.2).curveTo(109,-170.5,111,-170.5).curveTo(113,-170.5,114.5,-169.2).curveTo(116,-167.9,116,-165.6).lineTo(116,-165.3).lineTo(115.9,-164.5).lineTo(116,-163.6).lineTo(116,-163.4).curveTo(116,-161.9,115,-160.4).curveTo(113.6,-158.4,111,-158.4).curveTo(107.8,-158.4,106.6,-161.2).closePath().moveTo(152.6,-179.5).lineTo(152,-181.8).curveTo(152,-182.6,152.2,-183.2).lineTo(152.2,-183.3).lineTo(152,-183.8).curveTo(152,-186.2,153.5,-187.6).curveTo(155,-188.8,157,-188.8).curveTo(159.1,-188.8,160.5,-187.6).curveTo(162,-186.2,162,-183.9).lineTo(162,-183.6).lineTo(161.9,-182.9).lineTo(162,-181.9).lineTo(162,-181.8).curveTo(162,-180.2,161,-178.8).curveTo(159.6,-176.8,157,-176.8).curveTo(153.8,-176.8,152.6,-179.5).closePath().moveTo(37.6,-191.6).lineTo(37.1,-193.8).curveTo(37.1,-194.6,37.3,-195.3).lineTo(37.3,-195.3).lineTo(37.1,-195.8).curveTo(37.1,-198.2,38.6,-199.6).curveTo(40,-200.9,42.1,-200.9).curveTo(44.1,-200.9,45.5,-199.6).curveTo(47,-198.3,47.1,-196).lineTo(47.1,-195.7).lineTo(47,-194.9).lineTo(47.1,-194).lineTo(47.1,-193.8).curveTo(47.1,-192.3,46.1,-190.8).curveTo(44.7,-188.8,42.1,-188.8).curveTo(38.8,-188.8,37.6,-191.6).closePath().moveTo(203.6,-196.9).lineTo(203,-199.2).curveTo(203,-200,203.2,-200.6).lineTo(203.2,-200.7).lineTo(203,-201.2).curveTo(203,-203.6,204.6,-205).curveTo(205.9,-206.2,208,-206.2).curveTo(210,-206.2,211.4,-205).curveTo(212.9,-203.6,213,-201.3).lineTo(213,-201).lineTo(212.9,-200.3).lineTo(213,-199.3).lineTo(213,-199.2).curveTo(213,-197.6,212,-196.2).curveTo(210.6,-194.2,208,-194.2).curveTo(204.7,-194.2,203.6,-196.9).closePath();
	this.shape_63.setTransform(332.9,261.175);

	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(202.9,-186.4).lineTo(202.9,-214).curveTo(203.1,-211.3,205.9,-209.3).curveTo(208.8,-207.2,213.1,-207.2).moveTo(151.9,-169).lineTo(151.9,-196.6).curveTo(152.1,-193.9,154.9,-191.9).curveTo(157.9,-189.8,162.1,-189.8).moveTo(166.9,-127).lineTo(166.9,-154.6).curveTo(167.1,-151.9,169.9,-149.9).curveTo(172.8,-147.8,177.1,-147.8).moveTo(208.9,-120).lineTo(208.9,-147.6).curveTo(209.1,-144.9,211.9,-142.9).curveTo(214.8,-140.8,219.1,-140.8).moveTo(166.9,-64).lineTo(166.9,-91.6).curveTo(167.1,-88.9,169.9,-86.9).curveTo(172.8,-84.8,177.1,-84.8).moveTo(212.9,-33.2).lineTo(212.9,-60.9).curveTo(213.1,-58.1,215.9,-56.1).curveTo(218.8,-54.1,223.1,-54.1).moveTo(105.9,-150.6).lineTo(105.9,-178.3).curveTo(106.1,-175.5,108.9,-173.5).curveTo(111.9,-171.5,116.1,-171.5).moveTo(37.1,-181).lineTo(37.1,-208.7).curveTo(37.2,-205.9,40,-203.9).curveTo(42.9,-201.9,47.2,-201.9).moveTo(34.9,-82).lineTo(34.9,-109.6).curveTo(35.1,-106.9,37.9,-104.9).curveTo(40.9,-102.8,45.1,-102.8).moveTo(16.9,-116).lineTo(16.9,-143.6).curveTo(17.1,-140.9,19.9,-138.9).curveTo(22.9,-136.8,27.1,-136.8).moveTo(125.9,-84).lineTo(125.9,-111.6).curveTo(126.1,-108.9,128.9,-106.9).curveTo(131.9,-104.8,136.1,-104.8).moveTo(76.9,-56).lineTo(76.9,-83.6).curveTo(77.1,-80.9,79.9,-78.9).curveTo(82.9,-76.8,87.1,-76.8).moveTo(76.9,34).lineTo(76.9,6.4).curveTo(77.1,9.1,79.9,11.1).curveTo(82.9,13.2,87.1,13.2).moveTo(16.9,-6).lineTo(16.9,-33.6).curveTo(17.1,-30.9,19.9,-28.9).curveTo(22.9,-26.8,27.1,-26.8).moveTo(6.9,88).lineTo(6.9,60.4).curveTo(7.1,63.1,9.9,65.1).curveTo(12.9,67.2,17.1,67.2).moveTo(69.9,122.8).lineTo(69.9,95.2).curveTo(70,97.9,72.9,99.9).curveTo(75.8,102,80,102).moveTo(-78.1,-173).lineTo(-78.1,-200.6).curveTo(-78.1,-197.9,-75.2,-195.9).curveTo(-72.3,-193.8,-68.1,-193.8).moveTo(-123,-71).lineTo(-123,-98.6).curveTo(-122.9,-95.9,-120.1,-93.9).curveTo(-117.1,-91.8,-112.9,-91.8).moveTo(-39.1,-116.8).lineTo(-39.1,-144.4).curveTo(-38.9,-141.7,-36.1,-139.7).curveTo(-33.1,-137.6,-28.9,-137.6).moveTo(-223,-116).lineTo(-223,-143.6).curveTo(-222.9,-140.9,-220.1,-138.9).curveTo(-217.1,-136.8,-212.9,-136.8).moveTo(-187,106).lineTo(-187,78.3).curveTo(-186.9,81.1,-184.1,83.1).curveTo(-181.1,85.1,-176.9,85.1).moveTo(-39.1,-15).lineTo(-39.1,-42.6).curveTo(-38.9,-39.9,-36.1,-37.9).curveTo(-33.1,-35.8,-28.9,-35.8).moveTo(-68.1,123).lineTo(-68.1,95.4).curveTo(-67.9,98.1,-65.1,100.1).curveTo(-62.1,102.2,-57.9,102.2).moveTo(76.9,186).lineTo(76.9,158.4).curveTo(77.1,161.1,79.9,163.1).curveTo(82.9,165.2,87.1,165.2).moveTo(-13.1,214).lineTo(-13.1,186.4).curveTo(-12.9,189.1,-10.1,191.1).curveTo(-7.1,193.2,-2.9,193.2);
	this.shape_64.setTransform(342.95,246.225);

	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.beginFill("#000000").beginStroke().moveTo(-12.4,203.5).lineTo(-13,201.2).curveTo(-13,200.4,-12.8,199.8).lineTo(-12.8,199.7).lineTo(-13,199.2).curveTo(-13,196.8,-11.4,195.4).curveTo(-10.1,194.2,-8,194.2).curveTo(-5.9,194.2,-4.6,195.4).curveTo(-3.1,196.8,-3,199.1).lineTo(-3,199.4).lineTo(-3.1,200.1).lineTo(-3,201.1).lineTo(-3,201.2).curveTo(-3,202.8,-4,204.2).curveTo(-5.4,206.2,-8,206.2).curveTo(-11.3,206.2,-12.4,203.5).closePath().moveTo(77.6,175.5).lineTo(77,173.2).curveTo(77,172.4,77.2,171.8).lineTo(77.2,171.7).lineTo(77,171.2).curveTo(77,168.8,78.6,167.4).curveTo(79.9,166.2,82,166.2).curveTo(84.1,166.2,85.4,167.4).curveTo(87,168.8,87,171.1).lineTo(87,171.4).lineTo(86.9,172.1).lineTo(87,173.1).lineTo(87,173.2).curveTo(87,174.8,86,176.2).curveTo(84.6,178.2,82,178.2).curveTo(78.7,178.2,77.6,175.5).closePath().moveTo(-67.5,112.5).lineTo(-68,110.2).curveTo(-68,109.4,-67.8,108.8).lineTo(-67.8,108.7).lineTo(-68,108.2).curveTo(-68,105.8,-66.4,104.4).curveTo(-65.1,103.2,-63,103.2).curveTo(-61,103.2,-59.6,104.4).curveTo(-58.1,105.8,-58,108.1).lineTo(-58,108.4).lineTo(-58.1,109.1).lineTo(-58,110.1).lineTo(-58,110.2).curveTo(-58,111.8,-59,113.2).curveTo(-60.4,115.2,-63,115.2).curveTo(-66.3,115.2,-67.5,112.5).closePath().moveTo(70.5,112.3).lineTo(69.9,110).curveTo(69.9,109.2,70.1,108.6).lineTo(70.1,108.5).lineTo(69.9,108).curveTo(70,105.6,71.5,104.2).curveTo(72.9,103,75,103).curveTo(77,103,78.4,104.2).curveTo(79.9,105.6,79.9,107.9).lineTo(79.9,108.2).lineTo(79.8,108.9).lineTo(79.9,109.9).lineTo(79.9,110).curveTo(80,111.6,78.9,113).curveTo(77.6,115,75,115).curveTo(71.7,115,70.5,112.3).closePath().moveTo(-186.5,95.4).lineTo(-187,93.2).curveTo(-187,92.4,-186.8,91.7).lineTo(-186.8,91.7).lineTo(-187,91.2).curveTo(-187,88.8,-185.5,87.4).curveTo(-184.1,86.1,-182,86.1).curveTo(-180,86.1,-178.6,87.4).curveTo(-177.1,88.7,-177,91).lineTo(-177,91.3).lineTo(-177.1,92.1).lineTo(-177,93).lineTo(-177,93.2).curveTo(-177,94.7,-178,96.2).curveTo(-179.4,98.2,-182,98.2).curveTo(-185.3,98.2,-186.5,95.4).closePath().moveTo(7.6,77.5).lineTo(7,75.2).curveTo(7,74.4,7.2,73.8).lineTo(7.2,73.7).lineTo(7,73.2).curveTo(7,70.8,8.6,69.4).curveTo(10,68.2,12,68.2).curveTo(14,68.2,15.5,69.4).curveTo(17,70.8,17,73.1).lineTo(17,73.4).lineTo(16.9,74.1).lineTo(17,75.1).lineTo(17,75.2).curveTo(17,76.8,16,78.2).curveTo(14.6,80.2,12,80.2).curveTo(8.8,80.2,7.6,77.5).closePath().moveTo(77.6,23.5).lineTo(77,21.2).curveTo(77,20.4,77.2,19.8).lineTo(77.2,19.7).lineTo(77,19.2).curveTo(77,16.8,78.6,15.4).curveTo(79.9,14.2,82,14.2).curveTo(84.1,14.2,85.4,15.4).curveTo(87,16.8,87,19.1).lineTo(87,19.4).lineTo(86.9,20.1).lineTo(87,21.1).lineTo(87,21.2).curveTo(87,22.8,86,24.2).curveTo(84.6,26.2,82,26.2).curveTo(78.7,26.2,77.6,23.5).closePath().moveTo(17.6,-16.5).lineTo(17,-18.8).curveTo(17,-19.6,17.2,-20.2).lineTo(17.2,-20.3).lineTo(17,-20.8).curveTo(17,-23.2,18.5,-24.6).curveTo(20,-25.8,22,-25.8).curveTo(24.1,-25.8,25.5,-24.6).curveTo(27,-23.2,27,-20.9).lineTo(27,-20.6).lineTo(26.9,-19.9).lineTo(27,-18.9).lineTo(27,-18.8).curveTo(27,-17.2,26,-15.8).curveTo(24.6,-13.8,22,-13.8).curveTo(18.8,-13.8,17.6,-16.5).closePath().moveTo(-38.4,-25.5).lineTo(-39,-27.8).curveTo(-39,-28.6,-38.8,-29.2).lineTo(-38.8,-29.3).lineTo(-39,-29.8).curveTo(-39,-32.2,-37.4,-33.6).curveTo(-36,-34.8,-34,-34.8).curveTo(-31.9,-34.8,-30.6,-33.6).curveTo(-29,-32.2,-29,-29.9).lineTo(-29,-29.6).lineTo(-29.1,-28.9).lineTo(-29,-27.9).lineTo(-29,-27.8).curveTo(-29,-26.2,-30,-24.8).curveTo(-31.4,-22.8,-34,-22.8).curveTo(-37.2,-22.8,-38.4,-25.5).closePath().moveTo(213.6,-43.8).lineTo(213,-46).curveTo(213,-46.8,213.2,-47.5).lineTo(213.2,-47.5).lineTo(213,-48).curveTo(213,-50.4,214.6,-51.8).curveTo(216,-53.1,218,-53.1).curveTo(220.1,-53.1,221.4,-51.8).curveTo(223,-50.5,223,-48.2).lineTo(223,-47.9).lineTo(222.9,-47.1).lineTo(223,-46.2).lineTo(223,-46).curveTo(223,-44.5,222,-43).curveTo(220.6,-41,218,-41).curveTo(214.8,-41,213.6,-43.8).closePath().moveTo(77.6,-66.5).lineTo(77,-68.8).curveTo(77,-69.6,77.2,-70.2).lineTo(77.2,-70.3).lineTo(77,-70.8).curveTo(77,-73.2,78.6,-74.6).curveTo(79.9,-75.8,82,-75.8).curveTo(84.1,-75.8,85.4,-74.6).curveTo(87,-73.2,87,-70.9).lineTo(87,-70.6).lineTo(86.9,-69.9).lineTo(87,-68.9).lineTo(87,-68.8).curveTo(87,-67.2,86,-65.8).curveTo(84.6,-63.8,82,-63.8).curveTo(78.7,-63.8,77.6,-66.5).closePath().moveTo(167.6,-74.5).lineTo(167,-76.8).curveTo(167,-77.6,167.2,-78.2).lineTo(167.2,-78.3).lineTo(167,-78.8).curveTo(167,-81.2,168.6,-82.6).curveTo(169.9,-83.8,172,-83.8).curveTo(174.1,-83.8,175.4,-82.6).curveTo(177,-81.2,177,-78.9).lineTo(177,-78.6).lineTo(176.9,-77.9).lineTo(177,-76.9).lineTo(177,-76.8).curveTo(177,-75.2,176,-73.8).curveTo(174.6,-71.8,172,-71.8).curveTo(168.7,-71.8,167.6,-74.5).closePath().moveTo(-122.5,-81.5).lineTo(-123,-83.8).curveTo(-123,-84.6,-122.8,-85.2).lineTo(-122.8,-85.3).lineTo(-123,-85.8).curveTo(-123,-88.2,-121.5,-89.6).curveTo(-120.1,-90.8,-118,-90.8).curveTo(-116,-90.8,-114.6,-89.6).curveTo(-113.1,-88.2,-113,-85.9).lineTo(-113,-85.6).lineTo(-113.1,-84.9).lineTo(-113,-83.9).lineTo(-113,-83.8).curveTo(-113,-82.2,-114,-80.8).curveTo(-115.4,-78.8,-118,-78.8).curveTo(-121.3,-78.8,-122.5,-81.5).closePath().moveTo(35.6,-92.5).lineTo(35,-94.8).curveTo(35,-95.6,35.2,-96.2).lineTo(35.2,-96.3).lineTo(35,-96.8).curveTo(35,-99.2,36.5,-100.6).curveTo(38,-101.8,40,-101.8).curveTo(42.1,-101.8,43.5,-100.6).curveTo(45,-99.2,45,-96.9).lineTo(45,-96.6).lineTo(44.9,-95.9).lineTo(45,-94.9).lineTo(45,-94.8).curveTo(45,-93.2,44,-91.8).curveTo(42.6,-89.8,40,-89.8).curveTo(36.8,-89.8,35.6,-92.5).closePath().moveTo(126.5,-94.5).lineTo(126,-96.8).curveTo(126,-97.6,126.2,-98.2).lineTo(126.2,-98.3).lineTo(126,-98.8).curveTo(126,-101.2,127.5,-102.6).curveTo(129,-103.8,131,-103.8).curveTo(133.1,-103.8,134.5,-102.6).curveTo(136,-101.2,136,-98.9).lineTo(136,-98.6).lineTo(135.9,-97.9).lineTo(136,-96.9).lineTo(136,-96.8).curveTo(136,-95.2,135,-93.8).curveTo(133.6,-91.8,131,-91.8).curveTo(127.8,-91.8,126.5,-94.5).closePath().moveTo(17.6,-126.5).lineTo(17,-128.8).curveTo(17,-129.6,17.2,-130.2).lineTo(17.2,-130.3).lineTo(17,-130.8).curveTo(17,-133.2,18.5,-134.6).curveTo(20,-135.8,22,-135.8).curveTo(24.1,-135.8,25.5,-134.6).curveTo(27,-133.2,27,-130.9).lineTo(27,-130.6).lineTo(26.9,-129.9).lineTo(27,-128.9).lineTo(27,-128.8).curveTo(27,-127.2,26,-125.8).curveTo(24.6,-123.8,22,-123.8).curveTo(18.8,-123.8,17.6,-126.5).closePath().moveTo(-222.5,-126.5).lineTo(-223,-128.8).curveTo(-223,-129.6,-222.8,-130.2).lineTo(-222.8,-130.3).lineTo(-223,-130.8).curveTo(-223,-133.2,-221.5,-134.6).curveTo(-220.1,-135.8,-218,-135.8).curveTo(-216,-135.8,-214.6,-134.6).curveTo(-213.1,-133.2,-213,-130.9).lineTo(-213,-130.6).lineTo(-213.1,-129.9).lineTo(-213,-128.9).lineTo(-213,-128.8).curveTo(-213,-127.2,-214,-125.8).curveTo(-215.4,-123.8,-218,-123.8).curveTo(-221.3,-123.8,-222.5,-126.5).closePath().moveTo(-38.4,-127.3).lineTo(-39,-129.6).curveTo(-39,-130.4,-38.8,-131).lineTo(-38.8,-131.1).lineTo(-39,-131.6).curveTo(-39,-134,-37.4,-135.4).curveTo(-36,-136.6,-34,-136.6).curveTo(-31.9,-136.6,-30.6,-135.4).curveTo(-29,-134,-29,-131.7).lineTo(-29,-131.4).lineTo(-29.1,-130.7).lineTo(-29,-129.7).lineTo(-29,-129.6).curveTo(-29,-128,-30,-126.6).curveTo(-31.4,-124.6,-34,-124.6).curveTo(-37.2,-124.6,-38.4,-127.3).closePath().moveTo(209.5,-130.5).lineTo(209,-132.8).curveTo(209,-133.6,209.2,-134.2).lineTo(209.2,-134.3).lineTo(209,-134.8).curveTo(209,-137.2,210.5,-138.6).curveTo(211.9,-139.8,214,-139.8).curveTo(216,-139.8,217.4,-138.6).curveTo(218.9,-137.2,219,-134.9).lineTo(219,-134.6).lineTo(218.9,-133.9).lineTo(219,-132.9).lineTo(219,-132.8).curveTo(219,-131.2,218,-129.8).curveTo(216.6,-127.8,214,-127.8).curveTo(210.7,-127.8,209.5,-130.5).closePath().moveTo(167.6,-137.5).lineTo(167,-139.8).curveTo(167,-140.6,167.2,-141.2).lineTo(167.2,-141.3).lineTo(167,-141.8).curveTo(167,-144.2,168.6,-145.6).curveTo(169.9,-146.8,172,-146.8).curveTo(174.1,-146.8,175.4,-145.6).curveTo(177,-144.2,177,-141.9).lineTo(177,-141.6).lineTo(176.9,-140.9).lineTo(177,-139.9).lineTo(177,-139.8).curveTo(177,-138.2,176,-136.8).curveTo(174.6,-134.8,172,-134.8).curveTo(168.7,-134.8,167.6,-137.5).closePath().moveTo(106.6,-161.2).lineTo(106,-163.4).curveTo(106,-164.2,106.2,-164.9).lineTo(106.2,-164.9).lineTo(106,-165.4).curveTo(106,-167.8,107.6,-169.2).curveTo(109,-170.5,111,-170.5).curveTo(113,-170.5,114.5,-169.2).curveTo(116,-167.9,116,-165.6).lineTo(116,-165.3).lineTo(115.9,-164.5).lineTo(116,-163.6).lineTo(116,-163.4).curveTo(116,-161.9,115,-160.4).curveTo(113.6,-158.4,111,-158.4).curveTo(107.8,-158.4,106.6,-161.2).closePath().moveTo(152.6,-179.5).lineTo(152,-181.8).curveTo(152,-182.6,152.2,-183.2).lineTo(152.2,-183.3).lineTo(152,-183.8).curveTo(152,-186.2,153.5,-187.6).curveTo(155,-188.8,157,-188.8).curveTo(159.1,-188.8,160.5,-187.6).curveTo(162,-186.2,162,-183.9).lineTo(162,-183.6).lineTo(161.9,-182.9).lineTo(162,-181.9).lineTo(162,-181.8).curveTo(162,-180.2,161,-178.8).curveTo(159.6,-176.8,157,-176.8).curveTo(153.8,-176.8,152.6,-179.5).closePath().moveTo(-77.6,-183.5).lineTo(-78.1,-185.8).curveTo(-78.1,-186.6,-77.9,-187.2).lineTo(-77.9,-187.3).lineTo(-78.1,-187.8).curveTo(-78.1,-190.2,-76.6,-191.6).curveTo(-75.2,-192.8,-73.1,-192.8).curveTo(-71.1,-192.8,-69.6,-191.6).curveTo(-68.2,-190.2,-68.1,-187.9).lineTo(-68.1,-187.6).lineTo(-68.2,-186.9).lineTo(-68.1,-185.9).lineTo(-68.1,-185.8).curveTo(-68.1,-184.2,-69.1,-182.8).curveTo(-70.5,-180.8,-73.1,-180.8).curveTo(-76.4,-180.8,-77.6,-183.5).closePath().moveTo(37.6,-191.6).lineTo(37.1,-193.8).curveTo(37.1,-194.6,37.3,-195.3).lineTo(37.3,-195.3).lineTo(37.1,-195.8).curveTo(37.1,-198.2,38.6,-199.6).curveTo(40,-200.9,42.1,-200.9).curveTo(44.1,-200.9,45.5,-199.6).curveTo(47,-198.3,47.1,-196).lineTo(47.1,-195.7).lineTo(47,-194.9).lineTo(47.1,-194).lineTo(47.1,-193.8).curveTo(47.1,-192.3,46.1,-190.8).curveTo(44.7,-188.8,42.1,-188.8).curveTo(38.8,-188.8,37.6,-191.6).closePath().moveTo(203.6,-196.9).lineTo(203,-199.2).curveTo(203,-200,203.2,-200.6).lineTo(203.2,-200.7).lineTo(203,-201.2).curveTo(203,-203.6,204.6,-205).curveTo(205.9,-206.2,208,-206.2).curveTo(210,-206.2,211.4,-205).curveTo(212.9,-203.6,213,-201.3).lineTo(213,-201).lineTo(212.9,-200.3).lineTo(213,-199.3).lineTo(213,-199.2).curveTo(213,-197.6,212,-196.2).curveTo(210.6,-194.2,208,-194.2).curveTo(204.7,-194.2,203.6,-196.9).closePath();
	this.shape_65.setTransform(332.9,261.175);

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(202.9,-186.4).lineTo(202.9,-214).curveTo(203.1,-211.3,205.9,-209.3).curveTo(208.8,-207.2,213.1,-207.2).moveTo(151.9,-169).lineTo(151.9,-196.6).curveTo(152.1,-193.9,154.9,-191.9).curveTo(157.9,-189.8,162.1,-189.8).moveTo(166.9,-127).lineTo(166.9,-154.6).curveTo(167.1,-151.9,169.9,-149.9).curveTo(172.8,-147.8,177.1,-147.8).moveTo(208.9,-120).lineTo(208.9,-147.6).curveTo(209.1,-144.9,211.9,-142.9).curveTo(214.8,-140.8,219.1,-140.8).moveTo(166.9,-64).lineTo(166.9,-91.6).curveTo(167.1,-88.9,169.9,-86.9).curveTo(172.8,-84.8,177.1,-84.8).moveTo(212.9,-33.2).lineTo(212.9,-60.9).curveTo(213.1,-58.1,215.9,-56.1).curveTo(218.8,-54.1,223.1,-54.1).moveTo(105.9,-150.6).lineTo(105.9,-178.3).curveTo(106.1,-175.5,108.9,-173.5).curveTo(111.9,-171.5,116.1,-171.5).moveTo(37.1,-181).lineTo(37.1,-208.7).curveTo(37.2,-205.9,40,-203.9).curveTo(42.9,-201.9,47.2,-201.9).moveTo(34.9,-82).lineTo(34.9,-109.6).curveTo(35.1,-106.9,37.9,-104.9).curveTo(40.9,-102.8,45.1,-102.8).moveTo(16.9,-116).lineTo(16.9,-143.6).curveTo(17.1,-140.9,19.9,-138.9).curveTo(22.9,-136.8,27.1,-136.8).moveTo(125.9,-84).lineTo(125.9,-111.6).curveTo(126.1,-108.9,128.9,-106.9).curveTo(131.9,-104.8,136.1,-104.8).moveTo(76.9,-56).lineTo(76.9,-83.6).curveTo(77.1,-80.9,79.9,-78.9).curveTo(82.9,-76.8,87.1,-76.8).moveTo(76.9,34).lineTo(76.9,6.4).curveTo(77.1,9.1,79.9,11.1).curveTo(82.9,13.2,87.1,13.2).moveTo(16.9,-6).lineTo(16.9,-33.6).curveTo(17.1,-30.9,19.9,-28.9).curveTo(22.9,-26.8,27.1,-26.8).moveTo(6.9,88).lineTo(6.9,60.4).curveTo(7.1,63.1,9.9,65.1).curveTo(12.9,67.2,17.1,67.2).moveTo(69.9,122.8).lineTo(69.9,95.2).curveTo(70,97.9,72.9,99.9).curveTo(75.8,102,80,102).moveTo(-78.1,-173).lineTo(-78.1,-200.6).curveTo(-78.1,-197.9,-75.2,-195.9).curveTo(-72.3,-193.8,-68.1,-193.8).moveTo(-133.1,-151.6).lineTo(-133.1,-179.2).curveTo(-133,-176.5,-130.2,-174.5).curveTo(-127.3,-172.4,-123,-172.4).moveTo(-123,-71).lineTo(-123,-98.6).curveTo(-122.9,-95.9,-120.1,-93.9).curveTo(-117.1,-91.8,-112.9,-91.8).moveTo(-39.1,-116.8).lineTo(-39.1,-144.4).curveTo(-38.9,-141.7,-36.1,-139.7).curveTo(-33.1,-137.6,-28.9,-137.6).moveTo(-223,-116).lineTo(-223,-143.6).curveTo(-222.9,-140.9,-220.1,-138.9).curveTo(-217.1,-136.8,-212.9,-136.8).moveTo(-187,106).lineTo(-187,78.3).curveTo(-186.9,81.1,-184.1,83.1).curveTo(-181.1,85.1,-176.9,85.1).moveTo(-39.1,-15).lineTo(-39.1,-42.6).curveTo(-38.9,-39.9,-36.1,-37.9).curveTo(-33.1,-35.8,-28.9,-35.8).moveTo(-68.1,123).lineTo(-68.1,95.4).curveTo(-67.9,98.1,-65.1,100.1).curveTo(-62.1,102.2,-57.9,102.2).moveTo(76.9,186).lineTo(76.9,158.4).curveTo(77.1,161.1,79.9,163.1).curveTo(82.9,165.2,87.1,165.2).moveTo(-13.1,214).lineTo(-13.1,186.4).curveTo(-12.9,189.1,-10.1,191.1).curveTo(-7.1,193.2,-2.9,193.2);
	this.shape_66.setTransform(342.95,246.225);

	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.beginFill("#000000").beginStroke().moveTo(-12.4,203.5).lineTo(-13,201.2).curveTo(-13,200.4,-12.8,199.8).lineTo(-12.8,199.7).lineTo(-13,199.2).curveTo(-13,196.8,-11.4,195.4).curveTo(-10.1,194.2,-8,194.2).curveTo(-5.9,194.2,-4.6,195.4).curveTo(-3.1,196.8,-3,199.1).lineTo(-3,199.4).lineTo(-3.1,200.1).lineTo(-3,201.1).lineTo(-3,201.2).curveTo(-3,202.8,-4,204.2).curveTo(-5.4,206.2,-8,206.2).curveTo(-11.3,206.2,-12.4,203.5).closePath().moveTo(77.6,175.5).lineTo(77,173.2).curveTo(77,172.4,77.2,171.8).lineTo(77.2,171.7).lineTo(77,171.2).curveTo(77,168.8,78.6,167.4).curveTo(79.9,166.2,82,166.2).curveTo(84.1,166.2,85.4,167.4).curveTo(87,168.8,87,171.1).lineTo(87,171.4).lineTo(86.9,172.1).lineTo(87,173.1).lineTo(87,173.2).curveTo(87,174.8,86,176.2).curveTo(84.6,178.2,82,178.2).curveTo(78.7,178.2,77.6,175.5).closePath().moveTo(-67.5,112.5).lineTo(-68,110.2).curveTo(-68,109.4,-67.8,108.8).lineTo(-67.8,108.7).lineTo(-68,108.2).curveTo(-68,105.8,-66.4,104.4).curveTo(-65.1,103.2,-63,103.2).curveTo(-61,103.2,-59.6,104.4).curveTo(-58.1,105.8,-58,108.1).lineTo(-58,108.4).lineTo(-58.1,109.1).lineTo(-58,110.1).lineTo(-58,110.2).curveTo(-58,111.8,-59,113.2).curveTo(-60.4,115.2,-63,115.2).curveTo(-66.3,115.2,-67.5,112.5).closePath().moveTo(70.5,112.3).lineTo(69.9,110).curveTo(69.9,109.2,70.1,108.6).lineTo(70.1,108.5).lineTo(69.9,108).curveTo(70,105.6,71.5,104.2).curveTo(72.9,103,75,103).curveTo(77,103,78.4,104.2).curveTo(79.9,105.6,79.9,107.9).lineTo(79.9,108.2).lineTo(79.8,108.9).lineTo(79.9,109.9).lineTo(79.9,110).curveTo(80,111.6,78.9,113).curveTo(77.6,115,75,115).curveTo(71.7,115,70.5,112.3).closePath().moveTo(-186.5,95.4).lineTo(-187,93.2).curveTo(-187,92.4,-186.8,91.7).lineTo(-186.8,91.7).lineTo(-187,91.2).curveTo(-187,88.8,-185.5,87.4).curveTo(-184.1,86.1,-182,86.1).curveTo(-180,86.1,-178.6,87.4).curveTo(-177.1,88.7,-177,91).lineTo(-177,91.3).lineTo(-177.1,92.1).lineTo(-177,93).lineTo(-177,93.2).curveTo(-177,94.7,-178,96.2).curveTo(-179.4,98.2,-182,98.2).curveTo(-185.3,98.2,-186.5,95.4).closePath().moveTo(7.6,77.5).lineTo(7,75.2).curveTo(7,74.4,7.2,73.8).lineTo(7.2,73.7).lineTo(7,73.2).curveTo(7,70.8,8.6,69.4).curveTo(10,68.2,12,68.2).curveTo(14,68.2,15.5,69.4).curveTo(17,70.8,17,73.1).lineTo(17,73.4).lineTo(16.9,74.1).lineTo(17,75.1).lineTo(17,75.2).curveTo(17,76.8,16,78.2).curveTo(14.6,80.2,12,80.2).curveTo(8.8,80.2,7.6,77.5).closePath().moveTo(77.6,23.5).lineTo(77,21.2).curveTo(77,20.4,77.2,19.8).lineTo(77.2,19.7).lineTo(77,19.2).curveTo(77,16.8,78.6,15.4).curveTo(79.9,14.2,82,14.2).curveTo(84.1,14.2,85.4,15.4).curveTo(87,16.8,87,19.1).lineTo(87,19.4).lineTo(86.9,20.1).lineTo(87,21.1).lineTo(87,21.2).curveTo(87,22.8,86,24.2).curveTo(84.6,26.2,82,26.2).curveTo(78.7,26.2,77.6,23.5).closePath().moveTo(17.6,-16.5).lineTo(17,-18.8).curveTo(17,-19.6,17.2,-20.2).lineTo(17.2,-20.3).lineTo(17,-20.8).curveTo(17,-23.2,18.5,-24.6).curveTo(20,-25.8,22,-25.8).curveTo(24.1,-25.8,25.5,-24.6).curveTo(27,-23.2,27,-20.9).lineTo(27,-20.6).lineTo(26.9,-19.9).lineTo(27,-18.9).lineTo(27,-18.8).curveTo(27,-17.2,26,-15.8).curveTo(24.6,-13.8,22,-13.8).curveTo(18.8,-13.8,17.6,-16.5).closePath().moveTo(-38.4,-25.5).lineTo(-39,-27.8).curveTo(-39,-28.6,-38.8,-29.2).lineTo(-38.8,-29.3).lineTo(-39,-29.8).curveTo(-39,-32.2,-37.4,-33.6).curveTo(-36,-34.8,-34,-34.8).curveTo(-31.9,-34.8,-30.6,-33.6).curveTo(-29,-32.2,-29,-29.9).lineTo(-29,-29.6).lineTo(-29.1,-28.9).lineTo(-29,-27.9).lineTo(-29,-27.8).curveTo(-29,-26.2,-30,-24.8).curveTo(-31.4,-22.8,-34,-22.8).curveTo(-37.2,-22.8,-38.4,-25.5).closePath().moveTo(213.6,-43.8).lineTo(213,-46).curveTo(213,-46.8,213.2,-47.5).lineTo(213.2,-47.5).lineTo(213,-48).curveTo(213,-50.4,214.6,-51.8).curveTo(216,-53.1,218,-53.1).curveTo(220.1,-53.1,221.4,-51.8).curveTo(223,-50.5,223,-48.2).lineTo(223,-47.9).lineTo(222.9,-47.1).lineTo(223,-46.2).lineTo(223,-46).curveTo(223,-44.5,222,-43).curveTo(220.6,-41,218,-41).curveTo(214.8,-41,213.6,-43.8).closePath().moveTo(77.6,-66.5).lineTo(77,-68.8).curveTo(77,-69.6,77.2,-70.2).lineTo(77.2,-70.3).lineTo(77,-70.8).curveTo(77,-73.2,78.6,-74.6).curveTo(79.9,-75.8,82,-75.8).curveTo(84.1,-75.8,85.4,-74.6).curveTo(87,-73.2,87,-70.9).lineTo(87,-70.6).lineTo(86.9,-69.9).lineTo(87,-68.9).lineTo(87,-68.8).curveTo(87,-67.2,86,-65.8).curveTo(84.6,-63.8,82,-63.8).curveTo(78.7,-63.8,77.6,-66.5).closePath().moveTo(167.6,-74.5).lineTo(167,-76.8).curveTo(167,-77.6,167.2,-78.2).lineTo(167.2,-78.3).lineTo(167,-78.8).curveTo(167,-81.2,168.6,-82.6).curveTo(169.9,-83.8,172,-83.8).curveTo(174.1,-83.8,175.4,-82.6).curveTo(177,-81.2,177,-78.9).lineTo(177,-78.6).lineTo(176.9,-77.9).lineTo(177,-76.9).lineTo(177,-76.8).curveTo(177,-75.2,176,-73.8).curveTo(174.6,-71.8,172,-71.8).curveTo(168.7,-71.8,167.6,-74.5).closePath().moveTo(-122.5,-81.5).lineTo(-123,-83.8).curveTo(-123,-84.6,-122.8,-85.2).lineTo(-122.8,-85.3).lineTo(-123,-85.8).curveTo(-123,-88.2,-121.5,-89.6).curveTo(-120.1,-90.8,-118,-90.8).curveTo(-116,-90.8,-114.6,-89.6).curveTo(-113.1,-88.2,-113,-85.9).lineTo(-113,-85.6).lineTo(-113.1,-84.9).lineTo(-113,-83.9).lineTo(-113,-83.8).curveTo(-113,-82.2,-114,-80.8).curveTo(-115.4,-78.8,-118,-78.8).curveTo(-121.3,-78.8,-122.5,-81.5).closePath().moveTo(35.6,-92.5).lineTo(35,-94.8).curveTo(35,-95.6,35.2,-96.2).lineTo(35.2,-96.3).lineTo(35,-96.8).curveTo(35,-99.2,36.5,-100.6).curveTo(38,-101.8,40,-101.8).curveTo(42.1,-101.8,43.5,-100.6).curveTo(45,-99.2,45,-96.9).lineTo(45,-96.6).lineTo(44.9,-95.9).lineTo(45,-94.9).lineTo(45,-94.8).curveTo(45,-93.2,44,-91.8).curveTo(42.6,-89.8,40,-89.8).curveTo(36.8,-89.8,35.6,-92.5).closePath().moveTo(126.5,-94.5).lineTo(126,-96.8).curveTo(126,-97.6,126.2,-98.2).lineTo(126.2,-98.3).lineTo(126,-98.8).curveTo(126,-101.2,127.5,-102.6).curveTo(129,-103.8,131,-103.8).curveTo(133.1,-103.8,134.5,-102.6).curveTo(136,-101.2,136,-98.9).lineTo(136,-98.6).lineTo(135.9,-97.9).lineTo(136,-96.9).lineTo(136,-96.8).curveTo(136,-95.2,135,-93.8).curveTo(133.6,-91.8,131,-91.8).curveTo(127.8,-91.8,126.5,-94.5).closePath().moveTo(17.6,-126.5).lineTo(17,-128.8).curveTo(17,-129.6,17.2,-130.2).lineTo(17.2,-130.3).lineTo(17,-130.8).curveTo(17,-133.2,18.5,-134.6).curveTo(20,-135.8,22,-135.8).curveTo(24.1,-135.8,25.5,-134.6).curveTo(27,-133.2,27,-130.9).lineTo(27,-130.6).lineTo(26.9,-129.9).lineTo(27,-128.9).lineTo(27,-128.8).curveTo(27,-127.2,26,-125.8).curveTo(24.6,-123.8,22,-123.8).curveTo(18.8,-123.8,17.6,-126.5).closePath().moveTo(-222.5,-126.5).lineTo(-223,-128.8).curveTo(-223,-129.6,-222.8,-130.2).lineTo(-222.8,-130.3).lineTo(-223,-130.8).curveTo(-223,-133.2,-221.5,-134.6).curveTo(-220.1,-135.8,-218,-135.8).curveTo(-216,-135.8,-214.6,-134.6).curveTo(-213.1,-133.2,-213,-130.9).lineTo(-213,-130.6).lineTo(-213.1,-129.9).lineTo(-213,-128.9).lineTo(-213,-128.8).curveTo(-213,-127.2,-214,-125.8).curveTo(-215.4,-123.8,-218,-123.8).curveTo(-221.3,-123.8,-222.5,-126.5).closePath().moveTo(-38.4,-127.3).lineTo(-39,-129.6).curveTo(-39,-130.4,-38.8,-131).lineTo(-38.8,-131.1).lineTo(-39,-131.6).curveTo(-39,-134,-37.4,-135.4).curveTo(-36,-136.6,-34,-136.6).curveTo(-31.9,-136.6,-30.6,-135.4).curveTo(-29,-134,-29,-131.7).lineTo(-29,-131.4).lineTo(-29.1,-130.7).lineTo(-29,-129.7).lineTo(-29,-129.6).curveTo(-29,-128,-30,-126.6).curveTo(-31.4,-124.6,-34,-124.6).curveTo(-37.2,-124.6,-38.4,-127.3).closePath().moveTo(209.5,-130.5).lineTo(209,-132.8).curveTo(209,-133.6,209.2,-134.2).lineTo(209.2,-134.3).lineTo(209,-134.8).curveTo(209,-137.2,210.5,-138.6).curveTo(211.9,-139.8,214,-139.8).curveTo(216,-139.8,217.4,-138.6).curveTo(218.9,-137.2,219,-134.9).lineTo(219,-134.6).lineTo(218.9,-133.9).lineTo(219,-132.9).lineTo(219,-132.8).curveTo(219,-131.2,218,-129.8).curveTo(216.6,-127.8,214,-127.8).curveTo(210.7,-127.8,209.5,-130.5).closePath().moveTo(167.6,-137.5).lineTo(167,-139.8).curveTo(167,-140.6,167.2,-141.2).lineTo(167.2,-141.3).lineTo(167,-141.8).curveTo(167,-144.2,168.6,-145.6).curveTo(169.9,-146.8,172,-146.8).curveTo(174.1,-146.8,175.4,-145.6).curveTo(177,-144.2,177,-141.9).lineTo(177,-141.6).lineTo(176.9,-140.9).lineTo(177,-139.9).lineTo(177,-139.8).curveTo(177,-138.2,176,-136.8).curveTo(174.6,-134.8,172,-134.8).curveTo(168.7,-134.8,167.6,-137.5).closePath().moveTo(106.6,-161.2).lineTo(106,-163.4).curveTo(106,-164.2,106.2,-164.9).lineTo(106.2,-164.9).lineTo(106,-165.4).curveTo(106,-167.8,107.6,-169.2).curveTo(109,-170.5,111,-170.5).curveTo(113,-170.5,114.5,-169.2).curveTo(116,-167.9,116,-165.6).lineTo(116,-165.3).lineTo(115.9,-164.5).lineTo(116,-163.6).lineTo(116,-163.4).curveTo(116,-161.9,115,-160.4).curveTo(113.6,-158.4,111,-158.4).curveTo(107.8,-158.4,106.6,-161.2).closePath().moveTo(-132.6,-162.1).lineTo(-133.1,-164.4).curveTo(-133.1,-165.2,-132.9,-165.8).lineTo(-132.9,-165.9).lineTo(-133.1,-166.4).curveTo(-133.1,-168.8,-131.6,-170.2).curveTo(-130.2,-171.4,-128.1,-171.4).curveTo(-126.1,-171.4,-124.6,-170.2).curveTo(-123.2,-168.8,-123.1,-166.5).lineTo(-123.1,-166.2).lineTo(-123.2,-165.5).lineTo(-123.1,-164.5).lineTo(-123.1,-164.4).curveTo(-123.1,-162.8,-124.1,-161.4).curveTo(-125.5,-159.4,-128.1,-159.4).curveTo(-131.4,-159.4,-132.6,-162.1).closePath().moveTo(152.6,-179.5).lineTo(152,-181.8).curveTo(152,-182.6,152.2,-183.2).lineTo(152.2,-183.3).lineTo(152,-183.8).curveTo(152,-186.2,153.5,-187.6).curveTo(155,-188.8,157,-188.8).curveTo(159.1,-188.8,160.5,-187.6).curveTo(162,-186.2,162,-183.9).lineTo(162,-183.6).lineTo(161.9,-182.9).lineTo(162,-181.9).lineTo(162,-181.8).curveTo(162,-180.2,161,-178.8).curveTo(159.6,-176.8,157,-176.8).curveTo(153.8,-176.8,152.6,-179.5).closePath().moveTo(-77.6,-183.5).lineTo(-78.1,-185.8).curveTo(-78.1,-186.6,-77.9,-187.2).lineTo(-77.9,-187.3).lineTo(-78.1,-187.8).curveTo(-78.1,-190.2,-76.6,-191.6).curveTo(-75.2,-192.8,-73.1,-192.8).curveTo(-71.1,-192.8,-69.6,-191.6).curveTo(-68.2,-190.2,-68.1,-187.9).lineTo(-68.1,-187.6).lineTo(-68.2,-186.9).lineTo(-68.1,-185.9).lineTo(-68.1,-185.8).curveTo(-68.1,-184.2,-69.1,-182.8).curveTo(-70.5,-180.8,-73.1,-180.8).curveTo(-76.4,-180.8,-77.6,-183.5).closePath().moveTo(37.6,-191.6).lineTo(37.1,-193.8).curveTo(37.1,-194.6,37.3,-195.3).lineTo(37.3,-195.3).lineTo(37.1,-195.8).curveTo(37.1,-198.2,38.6,-199.6).curveTo(40,-200.9,42.1,-200.9).curveTo(44.1,-200.9,45.5,-199.6).curveTo(47,-198.3,47.1,-196).lineTo(47.1,-195.7).lineTo(47,-194.9).lineTo(47.1,-194).lineTo(47.1,-193.8).curveTo(47.1,-192.3,46.1,-190.8).curveTo(44.7,-188.8,42.1,-188.8).curveTo(38.8,-188.8,37.6,-191.6).closePath().moveTo(203.6,-196.9).lineTo(203,-199.2).curveTo(203,-200,203.2,-200.6).lineTo(203.2,-200.7).lineTo(203,-201.2).curveTo(203,-203.6,204.6,-205).curveTo(205.9,-206.2,208,-206.2).curveTo(210,-206.2,211.4,-205).curveTo(212.9,-203.6,213,-201.3).lineTo(213,-201).lineTo(212.9,-200.3).lineTo(213,-199.3).lineTo(213,-199.2).curveTo(213,-197.6,212,-196.2).curveTo(210.6,-194.2,208,-194.2).curveTo(204.7,-194.2,203.6,-196.9).closePath();
	this.shape_67.setTransform(332.9,261.175);

	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(213,-186.4).lineTo(213,-214).curveTo(213.1,-211.3,216,-209.3).curveTo(218.9,-207.2,223.1,-207.2).moveTo(162,-169).lineTo(162,-196.6).curveTo(162.1,-193.9,165,-191.9).curveTo(167.9,-189.8,172.1,-189.8).moveTo(177,-127).lineTo(177,-154.6).curveTo(177.1,-151.9,180,-149.9).curveTo(182.9,-147.8,187.1,-147.8).moveTo(219,-120).lineTo(219,-147.6).curveTo(219.1,-144.9,222,-142.9).curveTo(224.9,-140.8,229.1,-140.8).moveTo(177,-64).lineTo(177,-91.6).curveTo(177.1,-88.9,180,-86.9).curveTo(182.9,-84.8,187.1,-84.8).moveTo(223,-33.2).lineTo(223,-60.9).curveTo(223.1,-58.1,226,-56.1).curveTo(228.9,-54.1,233.1,-54.1).moveTo(116,-150.6).lineTo(116,-178.3).curveTo(116.1,-175.5,119,-173.5).curveTo(121.9,-171.5,126.1,-171.5).moveTo(47.1,-181).lineTo(47.1,-208.7).curveTo(47.2,-205.9,50.1,-203.9).curveTo(53,-201.9,57.2,-201.9).moveTo(45,-82).lineTo(45,-109.6).curveTo(45.1,-106.9,48,-104.9).curveTo(50.9,-102.8,55.1,-102.8).moveTo(27,-116).lineTo(27,-143.6).curveTo(27.1,-140.9,30,-138.9).curveTo(32.9,-136.8,37.1,-136.8).moveTo(136,-84).lineTo(136,-111.6).curveTo(136.1,-108.9,139,-106.9).curveTo(141.9,-104.8,146.1,-104.8).moveTo(87,-56).lineTo(87,-83.6).curveTo(87.1,-80.9,90,-78.9).curveTo(92.9,-76.8,97.1,-76.8).moveTo(87,34).lineTo(87,6.4).curveTo(87.1,9.1,90,11.1).curveTo(92.9,13.2,97.1,13.2).moveTo(27,-6).lineTo(27,-33.6).curveTo(27.1,-30.9,30,-28.9).curveTo(32.9,-26.8,37.1,-26.8).moveTo(17,88).lineTo(17,60.4).curveTo(17.1,63.1,20,65.1).curveTo(22.9,67.2,27.1,67.2).moveTo(80,122.8).lineTo(80,95.2).curveTo(80.1,97.9,82.9,99.9).curveTo(85.9,102,90.1,102).moveTo(-68.1,-173).lineTo(-68.1,-200.6).curveTo(-68,-197.9,-65.1,-195.9).curveTo(-62.2,-193.8,-58,-193.8).moveTo(-123.1,-151.6).lineTo(-123.1,-179.2).curveTo(-123,-176.5,-120.1,-174.5).curveTo(-117.2,-172.4,-113,-172.4).moveTo(-113,-71).lineTo(-113,-98.6).curveTo(-112.9,-95.9,-110,-93.9).curveTo(-107.1,-91.8,-102.9,-91.8).moveTo(-29,-116.8).lineTo(-29,-144.4).curveTo(-28.9,-141.7,-26,-139.7).curveTo(-23.1,-137.6,-18.9,-137.6).moveTo(-213,-116).lineTo(-213,-143.6).curveTo(-212.9,-140.9,-210,-138.9).curveTo(-207.1,-136.8,-202.9,-136.8).moveTo(-233.1,-15).lineTo(-233.1,-42.6).curveTo(-233,-39.9,-230.1,-37.9).curveTo(-227.2,-35.8,-223,-35.8).moveTo(-177,106).lineTo(-177,78.3).curveTo(-176.9,81.1,-174,83.1).curveTo(-171.1,85.1,-166.9,85.1).moveTo(-29,-15).lineTo(-29,-42.6).curveTo(-28.9,-39.9,-26,-37.9).curveTo(-23.1,-35.8,-18.9,-35.8).moveTo(-58,123).lineTo(-58,95.4).curveTo(-57.9,98.1,-55,100.1).curveTo(-52.1,102.2,-47.9,102.2).moveTo(87,186).lineTo(87,158.4).curveTo(87.1,161.1,90,163.1).curveTo(92.9,165.2,97.1,165.2).moveTo(-3,214).lineTo(-3,186.4).curveTo(-2.9,189.1,-0,191.1).curveTo(2.9,193.2,7.1,193.2);
	this.shape_68.setTransform(332.9,246.225);

	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.beginFill("#000000").beginStroke().moveTo(-2.4,203.5).lineTo(-3,201.2).curveTo(-2.9,200.4,-2.7,199.8).lineTo(-2.7,199.7).lineTo(-3,199.2).curveTo(-2.9,196.8,-1.4,195.4).curveTo(-0,194.2,2,194.2).curveTo(4.1,194.2,5.5,195.4).curveTo(7,196.8,7.1,199.1).lineTo(7.1,199.4).lineTo(6.9,200.1).lineTo(7.1,201.1).lineTo(7.1,201.2).curveTo(7.1,202.8,6,204.2).curveTo(4.6,206.2,2,206.2).curveTo(-1.2,206.2,-2.4,203.5).closePath().moveTo(87.6,175.5).lineTo(87,173.2).curveTo(87.1,172.4,87.3,171.8).lineTo(87.3,171.7).lineTo(87,171.2).curveTo(87.1,168.8,88.6,167.4).curveTo(90,166.2,92,166.2).curveTo(94.1,166.2,95.5,167.4).curveTo(97,168.8,97.1,171.1).lineTo(97.1,171.4).lineTo(96.9,172.1).lineTo(97.1,173.1).lineTo(97.1,173.2).curveTo(97.1,174.8,96,176.2).curveTo(94.6,178.2,92,178.2).curveTo(88.8,178.2,87.6,175.5).closePath().moveTo(-57.4,112.5).lineTo(-58,110.2).curveTo(-58,109.4,-57.7,108.8).lineTo(-57.7,108.7).lineTo(-58,108.2).curveTo(-57.9,105.8,-56.4,104.4).curveTo(-55,103.2,-52.9,103.2).curveTo(-50.9,103.2,-49.5,104.4).curveTo(-48,105.8,-48,108.1).lineTo(-48,108.4).lineTo(-48.1,109.1).lineTo(-48,110.1).lineTo(-48,110.2).curveTo(-48,111.8,-49,113.2).curveTo(-50.4,115.2,-52.9,115.2).curveTo(-56.2,115.2,-57.4,112.5).closePath().moveTo(80.5,112.3).lineTo(80,110).curveTo(80,109.2,80.2,108.6).lineTo(80.2,108.5).lineTo(80,108).curveTo(80,105.6,81.5,104.2).curveTo(82.9,103,85,103).curveTo(87,103,88.4,104.2).curveTo(89.9,105.6,90,107.9).lineTo(90,108.2).lineTo(89.9,108.9).lineTo(90,109.9).lineTo(90,110).curveTo(90,111.6,89,113).curveTo(87.6,115,85,115).curveTo(81.7,115,80.5,112.3).closePath().moveTo(-176.4,95.4).lineTo(-177,93.2).curveTo(-177,92.4,-176.8,91.7).lineTo(-176.8,91.7).lineTo(-177,91.2).curveTo(-176.9,88.8,-175.4,87.4).curveTo(-174,86.1,-171.9,86.1).curveTo(-169.9,86.1,-168.5,87.4).curveTo(-167,88.7,-167,91).lineTo(-167,91.3).lineTo(-167.1,92.1).lineTo(-167,93).lineTo(-167,93.2).curveTo(-166.9,94.7,-168,96.2).curveTo(-169.3,98.2,-171.9,98.2).curveTo(-175.2,98.2,-176.4,95.4).closePath().moveTo(17.6,77.5).lineTo(17.1,75.2).curveTo(17.1,74.4,17.3,73.8).lineTo(17.3,73.7).lineTo(17.1,73.2).curveTo(17.1,70.8,18.6,69.4).curveTo(20,68.2,22,68.2).curveTo(24.1,68.2,25.5,69.4).curveTo(27,70.8,27.1,73.1).lineTo(27.1,73.4).lineTo(27,74.1).lineTo(27.1,75.1).lineTo(27.1,75.2).curveTo(27,76.8,26.1,78.2).curveTo(24.7,80.2,22,80.2).curveTo(18.8,80.2,17.6,77.5).closePath().moveTo(87.6,23.5).lineTo(87,21.2).curveTo(87.1,20.4,87.3,19.8).lineTo(87.3,19.7).lineTo(87,19.2).curveTo(87.1,16.8,88.6,15.4).curveTo(90,14.2,92,14.2).curveTo(94.1,14.2,95.5,15.4).curveTo(97,16.8,97.1,19.1).lineTo(97.1,19.4).lineTo(96.9,20.1).lineTo(97.1,21.1).lineTo(97.1,21.2).curveTo(97.1,22.8,96,24.2).curveTo(94.6,26.2,92,26.2).curveTo(88.8,26.2,87.6,23.5).closePath().moveTo(27.6,-16.5).lineTo(27.1,-18.8).curveTo(27.1,-19.6,27.3,-20.2).lineTo(27.3,-20.3).lineTo(27.1,-20.8).curveTo(27.1,-23.2,28.6,-24.6).curveTo(30,-25.8,32,-25.8).curveTo(34.1,-25.8,35.5,-24.6).curveTo(37,-23.2,37.1,-20.9).lineTo(37.1,-20.6).lineTo(37,-19.9).lineTo(37.1,-18.9).lineTo(37.1,-18.8).curveTo(37.1,-17.2,36.1,-15.8).curveTo(34.7,-13.8,32,-13.8).curveTo(28.8,-13.8,27.6,-16.5).closePath().moveTo(-28.4,-25.5).lineTo(-28.9,-27.8).curveTo(-28.9,-28.6,-28.7,-29.2).lineTo(-28.7,-29.3).lineTo(-28.9,-29.8).curveTo(-28.9,-32.2,-27.4,-33.6).curveTo(-26,-34.8,-24,-34.8).curveTo(-21.9,-34.8,-20.5,-33.6).curveTo(-19,-32.2,-18.9,-29.9).lineTo(-18.9,-29.6).lineTo(-19,-28.9).lineTo(-18.9,-27.9).lineTo(-18.9,-27.8).curveTo(-19,-26.2,-19.9,-24.8).curveTo(-21.3,-22.8,-24,-22.8).curveTo(-27.2,-22.8,-28.4,-25.5).closePath().moveTo(-232.5,-25.5).lineTo(-233,-27.8).curveTo(-233,-28.6,-232.8,-29.2).lineTo(-232.8,-29.3).lineTo(-233,-29.8).curveTo(-233,-32.2,-231.5,-33.6).curveTo(-230.1,-34.8,-228.1,-34.8).curveTo(-226,-34.8,-224.6,-33.6).curveTo(-223.1,-32.2,-223,-29.9).lineTo(-223,-29.6).lineTo(-223.1,-28.9).lineTo(-223,-27.9).lineTo(-223,-27.8).curveTo(-223,-26.2,-224,-24.8).curveTo(-225.4,-22.8,-228.1,-22.8).curveTo(-231.3,-22.8,-232.5,-25.5).closePath().moveTo(223.6,-43.8).lineTo(223.1,-46).curveTo(223.1,-46.8,223.3,-47.5).lineTo(223.3,-47.5).lineTo(223.1,-48).curveTo(223.1,-50.4,224.6,-51.8).curveTo(226,-53.1,228,-53.1).curveTo(230.1,-53.1,231.5,-51.8).curveTo(233,-50.5,233.1,-48.2).lineTo(233.1,-47.9).lineTo(233,-47.1).lineTo(233.1,-46.2).lineTo(233.1,-46).curveTo(233,-44.5,232.1,-43).curveTo(230.7,-41,228,-41).curveTo(224.8,-41,223.6,-43.8).closePath().moveTo(87.6,-66.5).lineTo(87,-68.8).curveTo(87.1,-69.6,87.3,-70.2).lineTo(87.3,-70.3).lineTo(87,-70.8).curveTo(87.1,-73.2,88.6,-74.6).curveTo(90,-75.8,92,-75.8).curveTo(94.1,-75.8,95.5,-74.6).curveTo(97,-73.2,97.1,-70.9).lineTo(97.1,-70.6).lineTo(96.9,-69.9).lineTo(97.1,-68.9).lineTo(97.1,-68.8).curveTo(97.1,-67.2,96,-65.8).curveTo(94.6,-63.8,92,-63.8).curveTo(88.8,-63.8,87.6,-66.5).closePath().moveTo(177.6,-74.5).lineTo(177,-76.8).curveTo(177.1,-77.6,177.3,-78.2).lineTo(177.3,-78.3).lineTo(177,-78.8).curveTo(177.1,-81.2,178.6,-82.6).curveTo(180,-83.8,182,-83.8).curveTo(184.1,-83.8,185.5,-82.6).curveTo(187,-81.2,187.1,-78.9).lineTo(187.1,-78.6).lineTo(186.9,-77.9).lineTo(187.1,-76.9).lineTo(187.1,-76.8).curveTo(187.1,-75.2,186,-73.8).curveTo(184.6,-71.8,182,-71.8).curveTo(178.8,-71.8,177.6,-74.5).closePath().moveTo(-112.4,-81.5).lineTo(-113,-83.8).curveTo(-113,-84.6,-112.8,-85.2).lineTo(-112.8,-85.3).lineTo(-113,-85.8).curveTo(-112.9,-88.2,-111.4,-89.6).curveTo(-110,-90.8,-107.9,-90.8).curveTo(-105.9,-90.8,-104.5,-89.6).curveTo(-103,-88.2,-103,-85.9).lineTo(-103,-85.6).lineTo(-103.1,-84.9).lineTo(-103,-83.9).lineTo(-103,-83.8).curveTo(-103,-82.2,-104,-80.8).curveTo(-105.3,-78.8,-107.9,-78.8).curveTo(-111.2,-78.8,-112.4,-81.5).closePath().moveTo(45.6,-92.5).lineTo(45.1,-94.8).curveTo(45.1,-95.6,45.3,-96.2).lineTo(45.3,-96.3).lineTo(45.1,-96.8).curveTo(45.1,-99.2,46.6,-100.6).curveTo(48,-101.8,50,-101.8).curveTo(52.1,-101.8,53.5,-100.6).curveTo(55,-99.2,55.1,-96.9).lineTo(55.1,-96.6).lineTo(55,-95.9).lineTo(55.1,-94.9).lineTo(55.1,-94.8).curveTo(55.1,-93.2,54.1,-91.8).curveTo(52.7,-89.8,50,-89.8).curveTo(46.8,-89.8,45.6,-92.5).closePath().moveTo(136.6,-94.5).lineTo(136.1,-96.8).curveTo(136.1,-97.6,136.2,-98.2).lineTo(136.2,-98.3).lineTo(136.1,-98.8).curveTo(136.1,-101.2,137.6,-102.6).curveTo(139,-103.8,141,-103.8).curveTo(143.1,-103.8,144.5,-102.6).curveTo(146,-101.2,146,-98.9).lineTo(146,-98.6).lineTo(146,-97.9).lineTo(146,-96.9).lineTo(146,-96.8).curveTo(146.1,-95.2,145.1,-93.8).curveTo(143.6,-91.8,141,-91.8).curveTo(137.8,-91.8,136.6,-94.5).closePath().moveTo(27.6,-126.5).lineTo(27.1,-128.8).curveTo(27.1,-129.6,27.3,-130.2).lineTo(27.3,-130.3).lineTo(27.1,-130.8).curveTo(27.1,-133.2,28.6,-134.6).curveTo(30,-135.8,32,-135.8).curveTo(34.1,-135.8,35.5,-134.6).curveTo(37,-133.2,37.1,-130.9).lineTo(37.1,-130.6).lineTo(37,-129.9).lineTo(37.1,-128.9).lineTo(37.1,-128.8).curveTo(37.1,-127.2,36.1,-125.8).curveTo(34.7,-123.8,32,-123.8).curveTo(28.8,-123.8,27.6,-126.5).closePath().moveTo(-212.4,-126.5).lineTo(-213,-128.8).curveTo(-213,-129.6,-212.8,-130.2).lineTo(-212.8,-130.3).lineTo(-213,-130.8).curveTo(-212.9,-133.2,-211.4,-134.6).curveTo(-210,-135.8,-207.9,-135.8).curveTo(-205.9,-135.8,-204.5,-134.6).curveTo(-203,-133.2,-203,-130.9).lineTo(-203,-130.6).lineTo(-203.1,-129.9).lineTo(-203,-128.9).lineTo(-203,-128.8).curveTo(-202.9,-127.2,-204,-125.8).curveTo(-205.3,-123.8,-207.9,-123.8).curveTo(-211.2,-123.8,-212.4,-126.5).closePath().moveTo(-28.4,-127.3).lineTo(-28.9,-129.6).curveTo(-28.9,-130.4,-28.7,-131).lineTo(-28.7,-131.1).lineTo(-28.9,-131.6).curveTo(-28.9,-134,-27.4,-135.4).curveTo(-26,-136.6,-24,-136.6).curveTo(-21.9,-136.6,-20.5,-135.4).curveTo(-19,-134,-18.9,-131.7).lineTo(-18.9,-131.4).lineTo(-19,-130.7).lineTo(-18.9,-129.7).lineTo(-18.9,-129.6).curveTo(-19,-128,-19.9,-126.6).curveTo(-21.3,-124.6,-24,-124.6).curveTo(-27.2,-124.6,-28.4,-127.3).closePath().moveTo(219.6,-130.5).lineTo(219,-132.8).curveTo(219,-133.6,219.2,-134.2).lineTo(219.2,-134.3).lineTo(219,-134.8).curveTo(219.1,-137.2,220.6,-138.6).curveTo(222,-139.8,224.1,-139.8).curveTo(226.1,-139.8,227.5,-138.6).curveTo(229,-137.2,229,-134.9).lineTo(229,-134.6).lineTo(228.9,-133.9).lineTo(229,-132.9).lineTo(229,-132.8).curveTo(229,-131.2,228,-129.8).curveTo(226.7,-127.8,224.1,-127.8).curveTo(220.8,-127.8,219.6,-130.5).closePath().moveTo(177.6,-137.5).lineTo(177,-139.8).curveTo(177.1,-140.6,177.3,-141.2).lineTo(177.3,-141.3).lineTo(177,-141.8).curveTo(177.1,-144.2,178.6,-145.6).curveTo(180,-146.8,182,-146.8).curveTo(184.1,-146.8,185.5,-145.6).curveTo(187,-144.2,187.1,-141.9).lineTo(187.1,-141.6).lineTo(186.9,-140.9).lineTo(187.1,-139.9).lineTo(187.1,-139.8).curveTo(187.1,-138.2,186,-136.8).curveTo(184.6,-134.8,182,-134.8).curveTo(178.8,-134.8,177.6,-137.5).closePath().moveTo(116.6,-161.2).lineTo(116.1,-163.4).curveTo(116.1,-164.2,116.3,-164.9).lineTo(116.3,-164.9).lineTo(116.1,-165.4).curveTo(116.1,-167.8,117.6,-169.2).curveTo(119,-170.5,121,-170.5).curveTo(123.1,-170.5,124.5,-169.2).curveTo(126,-167.9,126.1,-165.6).lineTo(126.1,-165.3).lineTo(126,-164.5).lineTo(126.1,-163.6).lineTo(126.1,-163.4).curveTo(126,-161.9,125.1,-160.4).curveTo(123.7,-158.4,121,-158.4).curveTo(117.8,-158.4,116.6,-161.2).closePath().moveTo(-122.5,-162.1).lineTo(-123,-164.4).curveTo(-123.1,-165.2,-122.9,-165.8).lineTo(-122.9,-165.9).lineTo(-123,-166.4).curveTo(-123,-168.8,-121.5,-170.2).curveTo(-120.1,-171.4,-118,-171.4).curveTo(-116,-171.4,-114.6,-170.2).curveTo(-113.1,-168.8,-113.1,-166.5).lineTo(-113.1,-166.2).lineTo(-113.2,-165.5).lineTo(-113.1,-164.5).lineTo(-113.1,-164.4).curveTo(-113,-162.8,-114,-161.4).curveTo(-115.5,-159.4,-118,-159.4).curveTo(-121.3,-159.4,-122.5,-162.1).closePath().moveTo(162.6,-179.5).lineTo(162.1,-181.8).curveTo(162.1,-182.6,162.3,-183.2).lineTo(162.3,-183.3).lineTo(162.1,-183.8).curveTo(162.1,-186.2,163.6,-187.6).curveTo(165,-188.8,167,-188.8).curveTo(169.1,-188.8,170.5,-187.6).curveTo(172,-186.2,172.1,-183.9).lineTo(172.1,-183.6).lineTo(172,-182.9).lineTo(172.1,-181.9).lineTo(172.1,-181.8).curveTo(172.1,-180.2,171.1,-178.8).curveTo(169.7,-176.8,167,-176.8).curveTo(163.8,-176.8,162.6,-179.5).closePath().moveTo(-67.5,-183.5).lineTo(-68.1,-185.8).curveTo(-68.1,-186.6,-67.9,-187.2).lineTo(-67.9,-187.3).lineTo(-68.1,-187.8).curveTo(-68,-190.2,-66.5,-191.6).curveTo(-65.1,-192.8,-63,-192.8).curveTo(-61,-192.8,-59.6,-191.6).curveTo(-58.1,-190.2,-58.1,-187.9).lineTo(-58.1,-187.6).lineTo(-58.2,-186.9).lineTo(-58.1,-185.9).lineTo(-58.1,-185.8).curveTo(-58,-184.2,-59.1,-182.8).curveTo(-60.4,-180.8,-63,-180.8).curveTo(-66.3,-180.8,-67.5,-183.5).closePath().moveTo(47.7,-191.6).lineTo(47.1,-193.8).curveTo(47.1,-194.6,47.3,-195.3).lineTo(47.3,-195.3).lineTo(47.1,-195.8).curveTo(47.2,-198.2,48.7,-199.6).curveTo(50.1,-200.9,52.2,-200.9).curveTo(54.2,-200.9,55.6,-199.6).curveTo(57.1,-198.3,57.1,-196).lineTo(57.1,-195.7).lineTo(57,-194.9).lineTo(57.1,-194).lineTo(57.1,-193.8).curveTo(57.2,-192.3,56.1,-190.8).curveTo(54.8,-188.8,52.2,-188.8).curveTo(48.9,-188.8,47.7,-191.6).closePath().moveTo(213.6,-196.9).lineTo(213,-199.2).curveTo(213.1,-200,213.3,-200.6).lineTo(213.3,-200.7).lineTo(213,-201.2).curveTo(213.1,-203.6,214.6,-205).curveTo(216,-206.2,218,-206.2).curveTo(220.1,-206.2,221.5,-205).curveTo(223,-203.6,223.1,-201.3).lineTo(223.1,-201).lineTo(222.9,-200.3).lineTo(223.1,-199.3).lineTo(223.1,-199.2).curveTo(223.1,-197.6,222,-196.2).curveTo(220.6,-194.2,218,-194.2).curveTo(214.8,-194.2,213.6,-196.9).closePath();
	this.shape_69.setTransform(322.85,261.175);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(213,-186.4).lineTo(213,-214).curveTo(213.1,-211.3,216,-209.3).curveTo(218.9,-207.2,223.1,-207.2).moveTo(162,-169).lineTo(162,-196.6).curveTo(162.1,-193.9,165,-191.9).curveTo(167.9,-189.8,172.1,-189.8).moveTo(177,-127).lineTo(177,-154.6).curveTo(177.1,-151.9,180,-149.9).curveTo(182.9,-147.8,187.1,-147.8).moveTo(219,-120).lineTo(219,-147.6).curveTo(219.1,-144.9,222,-142.9).curveTo(224.9,-140.8,229.1,-140.8).moveTo(177,-64).lineTo(177,-91.6).curveTo(177.1,-88.9,180,-86.9).curveTo(182.9,-84.8,187.1,-84.8).moveTo(223,-33.2).lineTo(223,-60.9).curveTo(223.1,-58.1,226,-56.1).curveTo(228.9,-54.1,233.1,-54.1).moveTo(116,-150.6).lineTo(116,-178.3).curveTo(116.1,-175.5,119,-173.5).curveTo(121.9,-171.5,126.1,-171.5).moveTo(47.1,-181).lineTo(47.1,-208.7).curveTo(47.2,-205.9,50.1,-203.9).curveTo(53,-201.9,57.2,-201.9).moveTo(45,-82).lineTo(45,-109.6).curveTo(45.1,-106.9,48,-104.9).curveTo(50.9,-102.8,55.1,-102.8).moveTo(27,-116).lineTo(27,-143.6).curveTo(27.1,-140.9,30,-138.9).curveTo(32.9,-136.8,37.1,-136.8).moveTo(136,-84).lineTo(136,-111.6).curveTo(136.1,-108.9,139,-106.9).curveTo(141.9,-104.8,146.1,-104.8).moveTo(87,-56).lineTo(87,-83.6).curveTo(87.1,-80.9,90,-78.9).curveTo(92.9,-76.8,97.1,-76.8).moveTo(87,34).lineTo(87,6.4).curveTo(87.1,9.1,90,11.1).curveTo(92.9,13.2,97.1,13.2).moveTo(27,-6).lineTo(27,-33.6).curveTo(27.1,-30.9,30,-28.9).curveTo(32.9,-26.8,37.1,-26.8).moveTo(17,88).lineTo(17,60.4).curveTo(17.1,63.1,20,65.1).curveTo(22.9,67.2,27.1,67.2).moveTo(80,122.8).lineTo(80,95.2).curveTo(80.1,97.9,82.9,99.9).curveTo(85.9,102,90.1,102).moveTo(-68.1,-173).lineTo(-68.1,-200.6).curveTo(-68,-197.9,-65.1,-195.9).curveTo(-62.2,-193.8,-58,-193.8).moveTo(-123.1,-151.6).lineTo(-123.1,-179.2).curveTo(-123,-176.5,-120.1,-174.5).curveTo(-117.2,-172.4,-113,-172.4).moveTo(-113,-71).lineTo(-113,-98.6).curveTo(-112.9,-95.9,-110,-93.9).curveTo(-107.1,-91.8,-102.9,-91.8).moveTo(-29,-116.8).lineTo(-29,-144.4).curveTo(-28.9,-141.7,-26,-139.7).curveTo(-23.1,-137.6,-18.9,-137.6).moveTo(-213,-116).lineTo(-213,-143.6).curveTo(-212.9,-140.9,-210,-138.9).curveTo(-207.1,-136.8,-202.9,-136.8).moveTo(-233.1,-15).lineTo(-233.1,-42.6).curveTo(-233,-39.9,-230.1,-37.9).curveTo(-227.2,-35.8,-223,-35.8).moveTo(-177,106).lineTo(-177,78.3).curveTo(-176.9,81.1,-174,83.1).curveTo(-171.1,85.1,-166.9,85.1).moveTo(-29,-15).lineTo(-29,-42.6).curveTo(-28.9,-39.9,-26,-37.9).curveTo(-23.1,-35.8,-18.9,-35.8).moveTo(-156.9,28.8).lineTo(-156.9,1.2).curveTo(-156.8,3.9,-153.9,5.9).curveTo(-151,8,-146.8,8).moveTo(-58,123).lineTo(-58,95.4).curveTo(-57.9,98.1,-55,100.1).curveTo(-52.1,102.2,-47.9,102.2).moveTo(87,186).lineTo(87,158.4).curveTo(87.1,161.1,90,163.1).curveTo(92.9,165.2,97.1,165.2).moveTo(-3,214).lineTo(-3,186.4).curveTo(-2.9,189.1,-0,191.1).curveTo(2.9,193.2,7.1,193.2);
	this.shape_70.setTransform(332.9,246.225);

	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.beginFill("#000000").beginStroke().moveTo(-2.4,203.5).lineTo(-3,201.2).curveTo(-2.9,200.4,-2.7,199.8).lineTo(-2.7,199.7).lineTo(-3,199.2).curveTo(-2.9,196.8,-1.4,195.4).curveTo(-0,194.2,2,194.2).curveTo(4.1,194.2,5.5,195.4).curveTo(7,196.8,7.1,199.1).lineTo(7.1,199.4).lineTo(6.9,200.1).lineTo(7.1,201.1).lineTo(7.1,201.2).curveTo(7.1,202.8,6,204.2).curveTo(4.6,206.2,2,206.2).curveTo(-1.2,206.2,-2.4,203.5).closePath().moveTo(87.6,175.5).lineTo(87,173.2).curveTo(87.1,172.4,87.3,171.8).lineTo(87.3,171.7).lineTo(87,171.2).curveTo(87.1,168.8,88.6,167.4).curveTo(90,166.2,92,166.2).curveTo(94.1,166.2,95.5,167.4).curveTo(97,168.8,97.1,171.1).lineTo(97.1,171.4).lineTo(96.9,172.1).lineTo(97.1,173.1).lineTo(97.1,173.2).curveTo(97.1,174.8,96,176.2).curveTo(94.6,178.2,92,178.2).curveTo(88.8,178.2,87.6,175.5).closePath().moveTo(-57.4,112.5).lineTo(-58,110.2).curveTo(-58,109.4,-57.7,108.8).lineTo(-57.7,108.7).lineTo(-58,108.2).curveTo(-57.9,105.8,-56.4,104.4).curveTo(-55,103.2,-52.9,103.2).curveTo(-50.9,103.2,-49.5,104.4).curveTo(-48,105.8,-48,108.1).lineTo(-48,108.4).lineTo(-48.1,109.1).lineTo(-48,110.1).lineTo(-48,110.2).curveTo(-48,111.8,-49,113.2).curveTo(-50.4,115.2,-52.9,115.2).curveTo(-56.2,115.2,-57.4,112.5).closePath().moveTo(80.5,112.3).lineTo(80,110).curveTo(80,109.2,80.2,108.6).lineTo(80.2,108.5).lineTo(80,108).curveTo(80,105.6,81.5,104.2).curveTo(82.9,103,85,103).curveTo(87,103,88.4,104.2).curveTo(89.9,105.6,90,107.9).lineTo(90,108.2).lineTo(89.9,108.9).lineTo(90,109.9).lineTo(90,110).curveTo(90,111.6,89,113).curveTo(87.6,115,85,115).curveTo(81.7,115,80.5,112.3).closePath().moveTo(-176.4,95.4).lineTo(-177,93.2).curveTo(-177,92.4,-176.8,91.7).lineTo(-176.8,91.7).lineTo(-177,91.2).curveTo(-176.9,88.8,-175.4,87.4).curveTo(-174,86.1,-171.9,86.1).curveTo(-169.9,86.1,-168.5,87.4).curveTo(-167,88.7,-167,91).lineTo(-167,91.3).lineTo(-167.1,92.1).lineTo(-167,93).lineTo(-167,93.2).curveTo(-166.9,94.7,-168,96.2).curveTo(-169.3,98.2,-171.9,98.2).curveTo(-175.2,98.2,-176.4,95.4).closePath().moveTo(17.6,77.5).lineTo(17.1,75.2).curveTo(17.1,74.4,17.3,73.8).lineTo(17.3,73.7).lineTo(17.1,73.2).curveTo(17.1,70.8,18.6,69.4).curveTo(20,68.2,22,68.2).curveTo(24.1,68.2,25.5,69.4).curveTo(27,70.8,27.1,73.1).lineTo(27.1,73.4).lineTo(27,74.1).lineTo(27.1,75.1).lineTo(27.1,75.2).curveTo(27,76.8,26.1,78.2).curveTo(24.7,80.2,22,80.2).curveTo(18.8,80.2,17.6,77.5).closePath().moveTo(87.6,23.5).lineTo(87,21.2).curveTo(87.1,20.4,87.3,19.8).lineTo(87.3,19.7).lineTo(87,19.2).curveTo(87.1,16.8,88.6,15.4).curveTo(90,14.2,92,14.2).curveTo(94.1,14.2,95.5,15.4).curveTo(97,16.8,97.1,19.1).lineTo(97.1,19.4).lineTo(96.9,20.1).lineTo(97.1,21.1).lineTo(97.1,21.2).curveTo(97.1,22.8,96,24.2).curveTo(94.6,26.2,92,26.2).curveTo(88.8,26.2,87.6,23.5).closePath().moveTo(-156.3,18.3).lineTo(-156.9,16).curveTo(-156.8,15.2,-156.6,14.6).lineTo(-156.6,14.5).lineTo(-156.9,14).curveTo(-156.8,11.6,-155.3,10.2).curveTo(-153.9,9,-151.8,9).curveTo(-149.8,9,-148.4,10.2).curveTo(-146.9,11.6,-146.8,13.9).lineTo(-146.8,14.2).lineTo(-147,14.9).lineTo(-146.8,15.9).lineTo(-146.8,16).curveTo(-146.8,17.6,-147.9,19).curveTo(-149.3,21,-151.8,21).curveTo(-155.1,21,-156.3,18.3).closePath().moveTo(27.6,-16.5).lineTo(27.1,-18.8).curveTo(27.1,-19.6,27.3,-20.2).lineTo(27.3,-20.3).lineTo(27.1,-20.8).curveTo(27.1,-23.2,28.6,-24.6).curveTo(30,-25.8,32,-25.8).curveTo(34.1,-25.8,35.5,-24.6).curveTo(37,-23.2,37.1,-20.9).lineTo(37.1,-20.6).lineTo(37,-19.9).lineTo(37.1,-18.9).lineTo(37.1,-18.8).curveTo(37.1,-17.2,36.1,-15.8).curveTo(34.7,-13.8,32,-13.8).curveTo(28.8,-13.8,27.6,-16.5).closePath().moveTo(-28.4,-25.5).lineTo(-28.9,-27.8).curveTo(-28.9,-28.6,-28.7,-29.2).lineTo(-28.7,-29.3).lineTo(-28.9,-29.8).curveTo(-28.9,-32.2,-27.4,-33.6).curveTo(-26,-34.8,-24,-34.8).curveTo(-21.9,-34.8,-20.5,-33.6).curveTo(-19,-32.2,-18.9,-29.9).lineTo(-18.9,-29.6).lineTo(-19,-28.9).lineTo(-18.9,-27.9).lineTo(-18.9,-27.8).curveTo(-19,-26.2,-19.9,-24.8).curveTo(-21.3,-22.8,-24,-22.8).curveTo(-27.2,-22.8,-28.4,-25.5).closePath().moveTo(-232.5,-25.5).lineTo(-233,-27.8).curveTo(-233,-28.6,-232.8,-29.2).lineTo(-232.8,-29.3).lineTo(-233,-29.8).curveTo(-233,-32.2,-231.5,-33.6).curveTo(-230.1,-34.8,-228.1,-34.8).curveTo(-226,-34.8,-224.6,-33.6).curveTo(-223.1,-32.2,-223,-29.9).lineTo(-223,-29.6).lineTo(-223.1,-28.9).lineTo(-223,-27.9).lineTo(-223,-27.8).curveTo(-223,-26.2,-224,-24.8).curveTo(-225.4,-22.8,-228.1,-22.8).curveTo(-231.3,-22.8,-232.5,-25.5).closePath().moveTo(223.6,-43.8).lineTo(223.1,-46).curveTo(223.1,-46.8,223.3,-47.5).lineTo(223.3,-47.5).lineTo(223.1,-48).curveTo(223.1,-50.4,224.6,-51.8).curveTo(226,-53.1,228,-53.1).curveTo(230.1,-53.1,231.5,-51.8).curveTo(233,-50.5,233.1,-48.2).lineTo(233.1,-47.9).lineTo(233,-47.1).lineTo(233.1,-46.2).lineTo(233.1,-46).curveTo(233,-44.5,232.1,-43).curveTo(230.7,-41,228,-41).curveTo(224.8,-41,223.6,-43.8).closePath().moveTo(87.6,-66.5).lineTo(87,-68.8).curveTo(87.1,-69.6,87.3,-70.2).lineTo(87.3,-70.3).lineTo(87,-70.8).curveTo(87.1,-73.2,88.6,-74.6).curveTo(90,-75.8,92,-75.8).curveTo(94.1,-75.8,95.5,-74.6).curveTo(97,-73.2,97.1,-70.9).lineTo(97.1,-70.6).lineTo(96.9,-69.9).lineTo(97.1,-68.9).lineTo(97.1,-68.8).curveTo(97.1,-67.2,96,-65.8).curveTo(94.6,-63.8,92,-63.8).curveTo(88.8,-63.8,87.6,-66.5).closePath().moveTo(177.6,-74.5).lineTo(177,-76.8).curveTo(177.1,-77.6,177.3,-78.2).lineTo(177.3,-78.3).lineTo(177,-78.8).curveTo(177.1,-81.2,178.6,-82.6).curveTo(180,-83.8,182,-83.8).curveTo(184.1,-83.8,185.5,-82.6).curveTo(187,-81.2,187.1,-78.9).lineTo(187.1,-78.6).lineTo(186.9,-77.9).lineTo(187.1,-76.9).lineTo(187.1,-76.8).curveTo(187.1,-75.2,186,-73.8).curveTo(184.6,-71.8,182,-71.8).curveTo(178.8,-71.8,177.6,-74.5).closePath().moveTo(-112.4,-81.5).lineTo(-113,-83.8).curveTo(-113,-84.6,-112.8,-85.2).lineTo(-112.8,-85.3).lineTo(-113,-85.8).curveTo(-112.9,-88.2,-111.4,-89.6).curveTo(-110,-90.8,-107.9,-90.8).curveTo(-105.9,-90.8,-104.5,-89.6).curveTo(-103,-88.2,-103,-85.9).lineTo(-103,-85.6).lineTo(-103.1,-84.9).lineTo(-103,-83.9).lineTo(-103,-83.8).curveTo(-103,-82.2,-104,-80.8).curveTo(-105.3,-78.8,-107.9,-78.8).curveTo(-111.2,-78.8,-112.4,-81.5).closePath().moveTo(45.6,-92.5).lineTo(45.1,-94.8).curveTo(45.1,-95.6,45.3,-96.2).lineTo(45.3,-96.3).lineTo(45.1,-96.8).curveTo(45.1,-99.2,46.6,-100.6).curveTo(48,-101.8,50,-101.8).curveTo(52.1,-101.8,53.5,-100.6).curveTo(55,-99.2,55.1,-96.9).lineTo(55.1,-96.6).lineTo(55,-95.9).lineTo(55.1,-94.9).lineTo(55.1,-94.8).curveTo(55.1,-93.2,54.1,-91.8).curveTo(52.7,-89.8,50,-89.8).curveTo(46.8,-89.8,45.6,-92.5).closePath().moveTo(136.6,-94.5).lineTo(136.1,-96.8).curveTo(136.1,-97.6,136.2,-98.2).lineTo(136.2,-98.3).lineTo(136.1,-98.8).curveTo(136.1,-101.2,137.6,-102.6).curveTo(139,-103.8,141,-103.8).curveTo(143.1,-103.8,144.5,-102.6).curveTo(146,-101.2,146,-98.9).lineTo(146,-98.6).lineTo(146,-97.9).lineTo(146,-96.9).lineTo(146,-96.8).curveTo(146.1,-95.2,145.1,-93.8).curveTo(143.6,-91.8,141,-91.8).curveTo(137.8,-91.8,136.6,-94.5).closePath().moveTo(27.6,-126.5).lineTo(27.1,-128.8).curveTo(27.1,-129.6,27.3,-130.2).lineTo(27.3,-130.3).lineTo(27.1,-130.8).curveTo(27.1,-133.2,28.6,-134.6).curveTo(30,-135.8,32,-135.8).curveTo(34.1,-135.8,35.5,-134.6).curveTo(37,-133.2,37.1,-130.9).lineTo(37.1,-130.6).lineTo(37,-129.9).lineTo(37.1,-128.9).lineTo(37.1,-128.8).curveTo(37.1,-127.2,36.1,-125.8).curveTo(34.7,-123.8,32,-123.8).curveTo(28.8,-123.8,27.6,-126.5).closePath().moveTo(-212.4,-126.5).lineTo(-213,-128.8).curveTo(-213,-129.6,-212.8,-130.2).lineTo(-212.8,-130.3).lineTo(-213,-130.8).curveTo(-212.9,-133.2,-211.4,-134.6).curveTo(-210,-135.8,-207.9,-135.8).curveTo(-205.9,-135.8,-204.5,-134.6).curveTo(-203,-133.2,-203,-130.9).lineTo(-203,-130.6).lineTo(-203.1,-129.9).lineTo(-203,-128.9).lineTo(-203,-128.8).curveTo(-202.9,-127.2,-204,-125.8).curveTo(-205.3,-123.8,-207.9,-123.8).curveTo(-211.2,-123.8,-212.4,-126.5).closePath().moveTo(-28.4,-127.3).lineTo(-28.9,-129.6).curveTo(-28.9,-130.4,-28.7,-131).lineTo(-28.7,-131.1).lineTo(-28.9,-131.6).curveTo(-28.9,-134,-27.4,-135.4).curveTo(-26,-136.6,-24,-136.6).curveTo(-21.9,-136.6,-20.5,-135.4).curveTo(-19,-134,-18.9,-131.7).lineTo(-18.9,-131.4).lineTo(-19,-130.7).lineTo(-18.9,-129.7).lineTo(-18.9,-129.6).curveTo(-19,-128,-19.9,-126.6).curveTo(-21.3,-124.6,-24,-124.6).curveTo(-27.2,-124.6,-28.4,-127.3).closePath().moveTo(219.6,-130.5).lineTo(219,-132.8).curveTo(219,-133.6,219.2,-134.2).lineTo(219.2,-134.3).lineTo(219,-134.8).curveTo(219.1,-137.2,220.6,-138.6).curveTo(222,-139.8,224.1,-139.8).curveTo(226.1,-139.8,227.5,-138.6).curveTo(229,-137.2,229,-134.9).lineTo(229,-134.6).lineTo(228.9,-133.9).lineTo(229,-132.9).lineTo(229,-132.8).curveTo(229,-131.2,228,-129.8).curveTo(226.7,-127.8,224.1,-127.8).curveTo(220.8,-127.8,219.6,-130.5).closePath().moveTo(177.6,-137.5).lineTo(177,-139.8).curveTo(177.1,-140.6,177.3,-141.2).lineTo(177.3,-141.3).lineTo(177,-141.8).curveTo(177.1,-144.2,178.6,-145.6).curveTo(180,-146.8,182,-146.8).curveTo(184.1,-146.8,185.5,-145.6).curveTo(187,-144.2,187.1,-141.9).lineTo(187.1,-141.6).lineTo(186.9,-140.9).lineTo(187.1,-139.9).lineTo(187.1,-139.8).curveTo(187.1,-138.2,186,-136.8).curveTo(184.6,-134.8,182,-134.8).curveTo(178.8,-134.8,177.6,-137.5).closePath().moveTo(116.6,-161.2).lineTo(116.1,-163.4).curveTo(116.1,-164.2,116.3,-164.9).lineTo(116.3,-164.9).lineTo(116.1,-165.4).curveTo(116.1,-167.8,117.6,-169.2).curveTo(119,-170.5,121,-170.5).curveTo(123.1,-170.5,124.5,-169.2).curveTo(126,-167.9,126.1,-165.6).lineTo(126.1,-165.3).lineTo(126,-164.5).lineTo(126.1,-163.6).lineTo(126.1,-163.4).curveTo(126,-161.9,125.1,-160.4).curveTo(123.7,-158.4,121,-158.4).curveTo(117.8,-158.4,116.6,-161.2).closePath().moveTo(-122.5,-162.1).lineTo(-123,-164.4).curveTo(-123.1,-165.2,-122.9,-165.8).lineTo(-122.9,-165.9).lineTo(-123,-166.4).curveTo(-123,-168.8,-121.5,-170.2).curveTo(-120.1,-171.4,-118,-171.4).curveTo(-116,-171.4,-114.6,-170.2).curveTo(-113.1,-168.8,-113.1,-166.5).lineTo(-113.1,-166.2).lineTo(-113.2,-165.5).lineTo(-113.1,-164.5).lineTo(-113.1,-164.4).curveTo(-113,-162.8,-114,-161.4).curveTo(-115.5,-159.4,-118,-159.4).curveTo(-121.3,-159.4,-122.5,-162.1).closePath().moveTo(162.6,-179.5).lineTo(162.1,-181.8).curveTo(162.1,-182.6,162.3,-183.2).lineTo(162.3,-183.3).lineTo(162.1,-183.8).curveTo(162.1,-186.2,163.6,-187.6).curveTo(165,-188.8,167,-188.8).curveTo(169.1,-188.8,170.5,-187.6).curveTo(172,-186.2,172.1,-183.9).lineTo(172.1,-183.6).lineTo(172,-182.9).lineTo(172.1,-181.9).lineTo(172.1,-181.8).curveTo(172.1,-180.2,171.1,-178.8).curveTo(169.7,-176.8,167,-176.8).curveTo(163.8,-176.8,162.6,-179.5).closePath().moveTo(-67.5,-183.5).lineTo(-68.1,-185.8).curveTo(-68.1,-186.6,-67.9,-187.2).lineTo(-67.9,-187.3).lineTo(-68.1,-187.8).curveTo(-68,-190.2,-66.5,-191.6).curveTo(-65.1,-192.8,-63,-192.8).curveTo(-61,-192.8,-59.6,-191.6).curveTo(-58.1,-190.2,-58.1,-187.9).lineTo(-58.1,-187.6).lineTo(-58.2,-186.9).lineTo(-58.1,-185.9).lineTo(-58.1,-185.8).curveTo(-58,-184.2,-59.1,-182.8).curveTo(-60.4,-180.8,-63,-180.8).curveTo(-66.3,-180.8,-67.5,-183.5).closePath().moveTo(47.7,-191.6).lineTo(47.1,-193.8).curveTo(47.1,-194.6,47.3,-195.3).lineTo(47.3,-195.3).lineTo(47.1,-195.8).curveTo(47.2,-198.2,48.7,-199.6).curveTo(50.1,-200.9,52.2,-200.9).curveTo(54.2,-200.9,55.6,-199.6).curveTo(57.1,-198.3,57.1,-196).lineTo(57.1,-195.7).lineTo(57,-194.9).lineTo(57.1,-194).lineTo(57.1,-193.8).curveTo(57.2,-192.3,56.1,-190.8).curveTo(54.8,-188.8,52.2,-188.8).curveTo(48.9,-188.8,47.7,-191.6).closePath().moveTo(213.6,-196.9).lineTo(213,-199.2).curveTo(213.1,-200,213.3,-200.6).lineTo(213.3,-200.7).lineTo(213,-201.2).curveTo(213.1,-203.6,214.6,-205).curveTo(216,-206.2,218,-206.2).curveTo(220.1,-206.2,221.5,-205).curveTo(223,-203.6,223.1,-201.3).lineTo(223.1,-201).lineTo(222.9,-200.3).lineTo(223.1,-199.3).lineTo(223.1,-199.2).curveTo(223.1,-197.6,222,-196.2).curveTo(220.6,-194.2,218,-194.2).curveTo(214.8,-194.2,213.6,-196.9).closePath();
	this.shape_71.setTransform(322.85,261.175);

	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(213,-186.4).lineTo(213,-214).curveTo(213.1,-211.3,216,-209.3).curveTo(218.9,-207.2,223.1,-207.2).moveTo(162,-169).lineTo(162,-196.6).curveTo(162.1,-193.9,165,-191.9).curveTo(167.9,-189.8,172.1,-189.8).moveTo(177,-127).lineTo(177,-154.6).curveTo(177.1,-151.9,180,-149.9).curveTo(182.9,-147.8,187.1,-147.8).moveTo(219,-120).lineTo(219,-147.6).curveTo(219.1,-144.9,222,-142.9).curveTo(224.9,-140.8,229.1,-140.8).moveTo(177,-64).lineTo(177,-91.6).curveTo(177.1,-88.9,180,-86.9).curveTo(182.9,-84.8,187.1,-84.8).moveTo(223,-33.2).lineTo(223,-60.9).curveTo(223.1,-58.1,226,-56.1).curveTo(228.9,-54.1,233.1,-54.1).moveTo(116,-150.6).lineTo(116,-178.3).curveTo(116.1,-175.5,119,-173.5).curveTo(121.9,-171.5,126.1,-171.5).moveTo(47.1,-181).lineTo(47.1,-208.7).curveTo(47.2,-205.9,50.1,-203.9).curveTo(53,-201.9,57.2,-201.9).moveTo(45,-82).lineTo(45,-109.6).curveTo(45.1,-106.9,48,-104.9).curveTo(50.9,-102.8,55.1,-102.8).moveTo(27,-116).lineTo(27,-143.6).curveTo(27.1,-140.9,30,-138.9).curveTo(32.9,-136.8,37.1,-136.8).moveTo(136,-84).lineTo(136,-111.6).curveTo(136.1,-108.9,139,-106.9).curveTo(141.9,-104.8,146.1,-104.8).moveTo(87,-56).lineTo(87,-83.6).curveTo(87.1,-80.9,90,-78.9).curveTo(92.9,-76.8,97.1,-76.8).moveTo(136,-0.8).lineTo(136,-28.4).curveTo(136.1,-25.7,139,-23.7).curveTo(141.9,-21.6,146.1,-21.6).moveTo(87,34).lineTo(87,6.4).curveTo(87.1,9.1,90,11.1).curveTo(92.9,13.2,97.1,13.2).moveTo(27,-6).lineTo(27,-33.6).curveTo(27.1,-30.9,30,-28.9).curveTo(32.9,-26.8,37.1,-26.8).moveTo(17,88).lineTo(17,60.4).curveTo(17.1,63.1,20,65.1).curveTo(22.9,67.2,27.1,67.2).moveTo(80,122.8).lineTo(80,95.2).curveTo(80.1,97.9,82.9,99.9).curveTo(85.9,102,90.1,102).moveTo(-68.1,-173).lineTo(-68.1,-200.6).curveTo(-68,-197.9,-65.1,-195.9).curveTo(-62.2,-193.8,-58,-193.8).moveTo(-123.1,-151.6).lineTo(-123.1,-179.2).curveTo(-123,-176.5,-120.1,-174.5).curveTo(-117.2,-172.4,-113,-172.4).moveTo(-113,-71).lineTo(-113,-98.6).curveTo(-112.9,-95.9,-110,-93.9).curveTo(-107.1,-91.8,-102.9,-91.8).moveTo(-29,-116.8).lineTo(-29,-144.4).curveTo(-28.9,-141.7,-26,-139.7).curveTo(-23.1,-137.6,-18.9,-137.6).moveTo(-213,-116).lineTo(-213,-143.6).curveTo(-212.9,-140.9,-210,-138.9).curveTo(-207.1,-136.8,-202.9,-136.8).moveTo(-233.1,-15).lineTo(-233.1,-42.6).curveTo(-233,-39.9,-230.1,-37.9).curveTo(-227.2,-35.8,-223,-35.8).moveTo(-177,106).lineTo(-177,78.3).curveTo(-176.9,81.1,-174,83.1).curveTo(-171.1,85.1,-166.9,85.1).moveTo(-29,-15).lineTo(-29,-42.6).curveTo(-28.9,-39.9,-26,-37.9).curveTo(-23.1,-35.8,-18.9,-35.8).moveTo(-156.9,28.8).lineTo(-156.9,1.2).curveTo(-156.8,3.9,-153.9,5.9).curveTo(-151,8,-146.8,8).moveTo(-58,123).lineTo(-58,95.4).curveTo(-57.9,98.1,-55,100.1).curveTo(-52.1,102.2,-47.9,102.2).moveTo(87,186).lineTo(87,158.4).curveTo(87.1,161.1,90,163.1).curveTo(92.9,165.2,97.1,165.2).moveTo(-3,214).lineTo(-3,186.4).curveTo(-2.9,189.1,-0,191.1).curveTo(2.9,193.2,7.1,193.2);
	this.shape_72.setTransform(332.9,246.225);

	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.beginFill("#000000").beginStroke().moveTo(-2.4,203.5).lineTo(-3,201.2).curveTo(-2.9,200.4,-2.7,199.8).lineTo(-2.7,199.7).lineTo(-3,199.2).curveTo(-2.9,196.8,-1.4,195.4).curveTo(-0,194.2,2,194.2).curveTo(4.1,194.2,5.5,195.4).curveTo(7,196.8,7.1,199.1).lineTo(7.1,199.4).lineTo(6.9,200.1).lineTo(7.1,201.1).lineTo(7.1,201.2).curveTo(7.1,202.8,6,204.2).curveTo(4.6,206.2,2,206.2).curveTo(-1.2,206.2,-2.4,203.5).closePath().moveTo(87.6,175.5).lineTo(87,173.2).curveTo(87.1,172.4,87.3,171.8).lineTo(87.3,171.7).lineTo(87,171.2).curveTo(87.1,168.8,88.6,167.4).curveTo(90,166.2,92,166.2).curveTo(94.1,166.2,95.5,167.4).curveTo(97,168.8,97.1,171.1).lineTo(97.1,171.4).lineTo(96.9,172.1).lineTo(97.1,173.1).lineTo(97.1,173.2).curveTo(97.1,174.8,96,176.2).curveTo(94.6,178.2,92,178.2).curveTo(88.8,178.2,87.6,175.5).closePath().moveTo(-57.4,112.5).lineTo(-58,110.2).curveTo(-58,109.4,-57.7,108.8).lineTo(-57.7,108.7).lineTo(-58,108.2).curveTo(-57.9,105.8,-56.4,104.4).curveTo(-55,103.2,-52.9,103.2).curveTo(-50.9,103.2,-49.5,104.4).curveTo(-48,105.8,-48,108.1).lineTo(-48,108.4).lineTo(-48.1,109.1).lineTo(-48,110.1).lineTo(-48,110.2).curveTo(-48,111.8,-49,113.2).curveTo(-50.4,115.2,-52.9,115.2).curveTo(-56.2,115.2,-57.4,112.5).closePath().moveTo(80.5,112.3).lineTo(80,110).curveTo(80,109.2,80.2,108.6).lineTo(80.2,108.5).lineTo(80,108).curveTo(80,105.6,81.5,104.2).curveTo(82.9,103,85,103).curveTo(87,103,88.4,104.2).curveTo(89.9,105.6,90,107.9).lineTo(90,108.2).lineTo(89.9,108.9).lineTo(90,109.9).lineTo(90,110).curveTo(90,111.6,89,113).curveTo(87.6,115,85,115).curveTo(81.7,115,80.5,112.3).closePath().moveTo(-176.4,95.4).lineTo(-177,93.2).curveTo(-177,92.4,-176.8,91.7).lineTo(-176.8,91.7).lineTo(-177,91.2).curveTo(-176.9,88.8,-175.4,87.4).curveTo(-174,86.1,-171.9,86.1).curveTo(-169.9,86.1,-168.5,87.4).curveTo(-167,88.7,-167,91).lineTo(-167,91.3).lineTo(-167.1,92.1).lineTo(-167,93).lineTo(-167,93.2).curveTo(-166.9,94.7,-168,96.2).curveTo(-169.3,98.2,-171.9,98.2).curveTo(-175.2,98.2,-176.4,95.4).closePath().moveTo(17.6,77.5).lineTo(17.1,75.2).curveTo(17.1,74.4,17.3,73.8).lineTo(17.3,73.7).lineTo(17.1,73.2).curveTo(17.1,70.8,18.6,69.4).curveTo(20,68.2,22,68.2).curveTo(24.1,68.2,25.5,69.4).curveTo(27,70.8,27.1,73.1).lineTo(27.1,73.4).lineTo(27,74.1).lineTo(27.1,75.1).lineTo(27.1,75.2).curveTo(27,76.8,26.1,78.2).curveTo(24.7,80.2,22,80.2).curveTo(18.8,80.2,17.6,77.5).closePath().moveTo(87.6,23.5).lineTo(87,21.2).curveTo(87.1,20.4,87.3,19.8).lineTo(87.3,19.7).lineTo(87,19.2).curveTo(87.1,16.8,88.6,15.4).curveTo(90,14.2,92,14.2).curveTo(94.1,14.2,95.5,15.4).curveTo(97,16.8,97.1,19.1).lineTo(97.1,19.4).lineTo(96.9,20.1).lineTo(97.1,21.1).lineTo(97.1,21.2).curveTo(97.1,22.8,96,24.2).curveTo(94.6,26.2,92,26.2).curveTo(88.8,26.2,87.6,23.5).closePath().moveTo(-156.3,18.3).lineTo(-156.9,16).curveTo(-156.8,15.2,-156.6,14.6).lineTo(-156.6,14.5).lineTo(-156.9,14).curveTo(-156.8,11.6,-155.3,10.2).curveTo(-153.9,9,-151.8,9).curveTo(-149.8,9,-148.4,10.2).curveTo(-146.9,11.6,-146.8,13.9).lineTo(-146.8,14.2).lineTo(-147,14.9).lineTo(-146.8,15.9).lineTo(-146.8,16).curveTo(-146.8,17.6,-147.9,19).curveTo(-149.3,21,-151.8,21).curveTo(-155.1,21,-156.3,18.3).closePath().moveTo(136.6,-11.3).lineTo(136.1,-13.6).curveTo(136.1,-14.4,136.2,-15).lineTo(136.2,-15.1).lineTo(136.1,-15.6).curveTo(136.1,-18,137.6,-19.4).curveTo(139,-20.6,141,-20.6).curveTo(143.1,-20.6,144.5,-19.4).curveTo(146,-18,146,-15.7).lineTo(146,-15.4).lineTo(146,-14.7).lineTo(146,-13.7).lineTo(146,-13.6).curveTo(146.1,-12,145.1,-10.6).curveTo(143.6,-8.6,141,-8.6).curveTo(137.8,-8.6,136.6,-11.3).closePath().moveTo(27.6,-16.5).lineTo(27.1,-18.8).curveTo(27.1,-19.6,27.3,-20.2).lineTo(27.3,-20.3).lineTo(27.1,-20.8).curveTo(27.1,-23.2,28.6,-24.6).curveTo(30,-25.8,32,-25.8).curveTo(34.1,-25.8,35.5,-24.6).curveTo(37,-23.2,37.1,-20.9).lineTo(37.1,-20.6).lineTo(37,-19.9).lineTo(37.1,-18.9).lineTo(37.1,-18.8).curveTo(37.1,-17.2,36.1,-15.8).curveTo(34.7,-13.8,32,-13.8).curveTo(28.8,-13.8,27.6,-16.5).closePath().moveTo(-28.4,-25.5).lineTo(-28.9,-27.8).curveTo(-28.9,-28.6,-28.7,-29.2).lineTo(-28.7,-29.3).lineTo(-28.9,-29.8).curveTo(-28.9,-32.2,-27.4,-33.6).curveTo(-26,-34.8,-24,-34.8).curveTo(-21.9,-34.8,-20.5,-33.6).curveTo(-19,-32.2,-18.9,-29.9).lineTo(-18.9,-29.6).lineTo(-19,-28.9).lineTo(-18.9,-27.9).lineTo(-18.9,-27.8).curveTo(-19,-26.2,-19.9,-24.8).curveTo(-21.3,-22.8,-24,-22.8).curveTo(-27.2,-22.8,-28.4,-25.5).closePath().moveTo(-232.5,-25.5).lineTo(-233,-27.8).curveTo(-233,-28.6,-232.8,-29.2).lineTo(-232.8,-29.3).lineTo(-233,-29.8).curveTo(-233,-32.2,-231.5,-33.6).curveTo(-230.1,-34.8,-228.1,-34.8).curveTo(-226,-34.8,-224.6,-33.6).curveTo(-223.1,-32.2,-223,-29.9).lineTo(-223,-29.6).lineTo(-223.1,-28.9).lineTo(-223,-27.9).lineTo(-223,-27.8).curveTo(-223,-26.2,-224,-24.8).curveTo(-225.4,-22.8,-228.1,-22.8).curveTo(-231.3,-22.8,-232.5,-25.5).closePath().moveTo(223.6,-43.8).lineTo(223.1,-46).curveTo(223.1,-46.8,223.3,-47.5).lineTo(223.3,-47.5).lineTo(223.1,-48).curveTo(223.1,-50.4,224.6,-51.8).curveTo(226,-53.1,228,-53.1).curveTo(230.1,-53.1,231.5,-51.8).curveTo(233,-50.5,233.1,-48.2).lineTo(233.1,-47.9).lineTo(233,-47.1).lineTo(233.1,-46.2).lineTo(233.1,-46).curveTo(233,-44.5,232.1,-43).curveTo(230.7,-41,228,-41).curveTo(224.8,-41,223.6,-43.8).closePath().moveTo(87.6,-66.5).lineTo(87,-68.8).curveTo(87.1,-69.6,87.3,-70.2).lineTo(87.3,-70.3).lineTo(87,-70.8).curveTo(87.1,-73.2,88.6,-74.6).curveTo(90,-75.8,92,-75.8).curveTo(94.1,-75.8,95.5,-74.6).curveTo(97,-73.2,97.1,-70.9).lineTo(97.1,-70.6).lineTo(96.9,-69.9).lineTo(97.1,-68.9).lineTo(97.1,-68.8).curveTo(97.1,-67.2,96,-65.8).curveTo(94.6,-63.8,92,-63.8).curveTo(88.8,-63.8,87.6,-66.5).closePath().moveTo(177.6,-74.5).lineTo(177,-76.8).curveTo(177.1,-77.6,177.3,-78.2).lineTo(177.3,-78.3).lineTo(177,-78.8).curveTo(177.1,-81.2,178.6,-82.6).curveTo(180,-83.8,182,-83.8).curveTo(184.1,-83.8,185.5,-82.6).curveTo(187,-81.2,187.1,-78.9).lineTo(187.1,-78.6).lineTo(186.9,-77.9).lineTo(187.1,-76.9).lineTo(187.1,-76.8).curveTo(187.1,-75.2,186,-73.8).curveTo(184.6,-71.8,182,-71.8).curveTo(178.8,-71.8,177.6,-74.5).closePath().moveTo(-112.4,-81.5).lineTo(-113,-83.8).curveTo(-113,-84.6,-112.8,-85.2).lineTo(-112.8,-85.3).lineTo(-113,-85.8).curveTo(-112.9,-88.2,-111.4,-89.6).curveTo(-110,-90.8,-107.9,-90.8).curveTo(-105.9,-90.8,-104.5,-89.6).curveTo(-103,-88.2,-103,-85.9).lineTo(-103,-85.6).lineTo(-103.1,-84.9).lineTo(-103,-83.9).lineTo(-103,-83.8).curveTo(-103,-82.2,-104,-80.8).curveTo(-105.3,-78.8,-107.9,-78.8).curveTo(-111.2,-78.8,-112.4,-81.5).closePath().moveTo(45.6,-92.5).lineTo(45.1,-94.8).curveTo(45.1,-95.6,45.3,-96.2).lineTo(45.3,-96.3).lineTo(45.1,-96.8).curveTo(45.1,-99.2,46.6,-100.6).curveTo(48,-101.8,50,-101.8).curveTo(52.1,-101.8,53.5,-100.6).curveTo(55,-99.2,55.1,-96.9).lineTo(55.1,-96.6).lineTo(55,-95.9).lineTo(55.1,-94.9).lineTo(55.1,-94.8).curveTo(55.1,-93.2,54.1,-91.8).curveTo(52.7,-89.8,50,-89.8).curveTo(46.8,-89.8,45.6,-92.5).closePath().moveTo(136.6,-94.5).lineTo(136.1,-96.8).curveTo(136.1,-97.6,136.2,-98.2).lineTo(136.2,-98.3).lineTo(136.1,-98.8).curveTo(136.1,-101.2,137.6,-102.6).curveTo(139,-103.8,141,-103.8).curveTo(143.1,-103.8,144.5,-102.6).curveTo(146,-101.2,146,-98.9).lineTo(146,-98.6).lineTo(146,-97.9).lineTo(146,-96.9).lineTo(146,-96.8).curveTo(146.1,-95.2,145.1,-93.8).curveTo(143.6,-91.8,141,-91.8).curveTo(137.8,-91.8,136.6,-94.5).closePath().moveTo(27.6,-126.5).lineTo(27.1,-128.8).curveTo(27.1,-129.6,27.3,-130.2).lineTo(27.3,-130.3).lineTo(27.1,-130.8).curveTo(27.1,-133.2,28.6,-134.6).curveTo(30,-135.8,32,-135.8).curveTo(34.1,-135.8,35.5,-134.6).curveTo(37,-133.2,37.1,-130.9).lineTo(37.1,-130.6).lineTo(37,-129.9).lineTo(37.1,-128.9).lineTo(37.1,-128.8).curveTo(37.1,-127.2,36.1,-125.8).curveTo(34.7,-123.8,32,-123.8).curveTo(28.8,-123.8,27.6,-126.5).closePath().moveTo(-212.4,-126.5).lineTo(-213,-128.8).curveTo(-213,-129.6,-212.8,-130.2).lineTo(-212.8,-130.3).lineTo(-213,-130.8).curveTo(-212.9,-133.2,-211.4,-134.6).curveTo(-210,-135.8,-207.9,-135.8).curveTo(-205.9,-135.8,-204.5,-134.6).curveTo(-203,-133.2,-203,-130.9).lineTo(-203,-130.6).lineTo(-203.1,-129.9).lineTo(-203,-128.9).lineTo(-203,-128.8).curveTo(-202.9,-127.2,-204,-125.8).curveTo(-205.3,-123.8,-207.9,-123.8).curveTo(-211.2,-123.8,-212.4,-126.5).closePath().moveTo(-28.4,-127.3).lineTo(-28.9,-129.6).curveTo(-28.9,-130.4,-28.7,-131).lineTo(-28.7,-131.1).lineTo(-28.9,-131.6).curveTo(-28.9,-134,-27.4,-135.4).curveTo(-26,-136.6,-24,-136.6).curveTo(-21.9,-136.6,-20.5,-135.4).curveTo(-19,-134,-18.9,-131.7).lineTo(-18.9,-131.4).lineTo(-19,-130.7).lineTo(-18.9,-129.7).lineTo(-18.9,-129.6).curveTo(-19,-128,-19.9,-126.6).curveTo(-21.3,-124.6,-24,-124.6).curveTo(-27.2,-124.6,-28.4,-127.3).closePath().moveTo(219.6,-130.5).lineTo(219,-132.8).curveTo(219,-133.6,219.2,-134.2).lineTo(219.2,-134.3).lineTo(219,-134.8).curveTo(219.1,-137.2,220.6,-138.6).curveTo(222,-139.8,224.1,-139.8).curveTo(226.1,-139.8,227.5,-138.6).curveTo(229,-137.2,229,-134.9).lineTo(229,-134.6).lineTo(228.9,-133.9).lineTo(229,-132.9).lineTo(229,-132.8).curveTo(229,-131.2,228,-129.8).curveTo(226.7,-127.8,224.1,-127.8).curveTo(220.8,-127.8,219.6,-130.5).closePath().moveTo(177.6,-137.5).lineTo(177,-139.8).curveTo(177.1,-140.6,177.3,-141.2).lineTo(177.3,-141.3).lineTo(177,-141.8).curveTo(177.1,-144.2,178.6,-145.6).curveTo(180,-146.8,182,-146.8).curveTo(184.1,-146.8,185.5,-145.6).curveTo(187,-144.2,187.1,-141.9).lineTo(187.1,-141.6).lineTo(186.9,-140.9).lineTo(187.1,-139.9).lineTo(187.1,-139.8).curveTo(187.1,-138.2,186,-136.8).curveTo(184.6,-134.8,182,-134.8).curveTo(178.8,-134.8,177.6,-137.5).closePath().moveTo(116.6,-161.2).lineTo(116.1,-163.4).curveTo(116.1,-164.2,116.3,-164.9).lineTo(116.3,-164.9).lineTo(116.1,-165.4).curveTo(116.1,-167.8,117.6,-169.2).curveTo(119,-170.5,121,-170.5).curveTo(123.1,-170.5,124.5,-169.2).curveTo(126,-167.9,126.1,-165.6).lineTo(126.1,-165.3).lineTo(126,-164.5).lineTo(126.1,-163.6).lineTo(126.1,-163.4).curveTo(126,-161.9,125.1,-160.4).curveTo(123.7,-158.4,121,-158.4).curveTo(117.8,-158.4,116.6,-161.2).closePath().moveTo(-122.5,-162.1).lineTo(-123,-164.4).curveTo(-123.1,-165.2,-122.9,-165.8).lineTo(-122.9,-165.9).lineTo(-123,-166.4).curveTo(-123,-168.8,-121.5,-170.2).curveTo(-120.1,-171.4,-118,-171.4).curveTo(-116,-171.4,-114.6,-170.2).curveTo(-113.1,-168.8,-113.1,-166.5).lineTo(-113.1,-166.2).lineTo(-113.2,-165.5).lineTo(-113.1,-164.5).lineTo(-113.1,-164.4).curveTo(-113,-162.8,-114,-161.4).curveTo(-115.5,-159.4,-118,-159.4).curveTo(-121.3,-159.4,-122.5,-162.1).closePath().moveTo(162.6,-179.5).lineTo(162.1,-181.8).curveTo(162.1,-182.6,162.3,-183.2).lineTo(162.3,-183.3).lineTo(162.1,-183.8).curveTo(162.1,-186.2,163.6,-187.6).curveTo(165,-188.8,167,-188.8).curveTo(169.1,-188.8,170.5,-187.6).curveTo(172,-186.2,172.1,-183.9).lineTo(172.1,-183.6).lineTo(172,-182.9).lineTo(172.1,-181.9).lineTo(172.1,-181.8).curveTo(172.1,-180.2,171.1,-178.8).curveTo(169.7,-176.8,167,-176.8).curveTo(163.8,-176.8,162.6,-179.5).closePath().moveTo(-67.5,-183.5).lineTo(-68.1,-185.8).curveTo(-68.1,-186.6,-67.9,-187.2).lineTo(-67.9,-187.3).lineTo(-68.1,-187.8).curveTo(-68,-190.2,-66.5,-191.6).curveTo(-65.1,-192.8,-63,-192.8).curveTo(-61,-192.8,-59.6,-191.6).curveTo(-58.1,-190.2,-58.1,-187.9).lineTo(-58.1,-187.6).lineTo(-58.2,-186.9).lineTo(-58.1,-185.9).lineTo(-58.1,-185.8).curveTo(-58,-184.2,-59.1,-182.8).curveTo(-60.4,-180.8,-63,-180.8).curveTo(-66.3,-180.8,-67.5,-183.5).closePath().moveTo(47.7,-191.6).lineTo(47.1,-193.8).curveTo(47.1,-194.6,47.3,-195.3).lineTo(47.3,-195.3).lineTo(47.1,-195.8).curveTo(47.2,-198.2,48.7,-199.6).curveTo(50.1,-200.9,52.2,-200.9).curveTo(54.2,-200.9,55.6,-199.6).curveTo(57.1,-198.3,57.1,-196).lineTo(57.1,-195.7).lineTo(57,-194.9).lineTo(57.1,-194).lineTo(57.1,-193.8).curveTo(57.2,-192.3,56.1,-190.8).curveTo(54.8,-188.8,52.2,-188.8).curveTo(48.9,-188.8,47.7,-191.6).closePath().moveTo(213.6,-196.9).lineTo(213,-199.2).curveTo(213.1,-200,213.3,-200.6).lineTo(213.3,-200.7).lineTo(213,-201.2).curveTo(213.1,-203.6,214.6,-205).curveTo(216,-206.2,218,-206.2).curveTo(220.1,-206.2,221.5,-205).curveTo(223,-203.6,223.1,-201.3).lineTo(223.1,-201).lineTo(222.9,-200.3).lineTo(223.1,-199.3).lineTo(223.1,-199.2).curveTo(223.1,-197.6,222,-196.2).curveTo(220.6,-194.2,218,-194.2).curveTo(214.8,-194.2,213.6,-196.9).closePath();
	this.shape_73.setTransform(322.85,261.175);

	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(234.4,-186.4).lineTo(234.4,-214).curveTo(234.6,-211.3,237.4,-209.3).curveTo(240.3,-207.2,244.6,-207.2).moveTo(183.4,-169).lineTo(183.4,-196.6).curveTo(183.6,-193.9,186.4,-191.9).curveTo(189.4,-189.8,193.6,-189.8).moveTo(198.4,-127).lineTo(198.4,-154.6).curveTo(198.6,-151.9,201.4,-149.9).curveTo(204.3,-147.8,208.6,-147.8).moveTo(240.4,-120).lineTo(240.4,-147.6).curveTo(240.6,-144.9,243.4,-142.9).curveTo(246.3,-140.8,250.6,-140.8).moveTo(198.4,-64).lineTo(198.4,-91.6).curveTo(198.6,-88.9,201.4,-86.9).curveTo(204.3,-84.8,208.6,-84.8).moveTo(244.4,-33.2).lineTo(244.4,-60.9).curveTo(244.6,-58.1,247.4,-56.1).curveTo(250.3,-54.1,254.6,-54.1).moveTo(137.4,-150.6).lineTo(137.4,-178.3).curveTo(137.6,-175.5,140.4,-173.5).curveTo(143.4,-171.5,147.6,-171.5).moveTo(68.6,-181).lineTo(68.6,-208.7).curveTo(68.7,-205.9,71.5,-203.9).curveTo(74.4,-201.9,78.7,-201.9).moveTo(66.4,-82).lineTo(66.4,-109.6).curveTo(66.6,-106.9,69.4,-104.9).curveTo(72.4,-102.8,76.6,-102.8).moveTo(48.4,-116).lineTo(48.4,-143.6).curveTo(48.6,-140.9,51.4,-138.9).curveTo(54.4,-136.8,58.6,-136.8).moveTo(157.4,-84).lineTo(157.4,-111.6).curveTo(157.6,-108.9,160.4,-106.9).curveTo(163.4,-104.8,167.6,-104.8).moveTo(108.4,-56).lineTo(108.4,-83.6).curveTo(108.6,-80.9,111.4,-78.9).curveTo(114.4,-76.8,118.6,-76.8).moveTo(157.4,-0.8).lineTo(157.4,-28.4).curveTo(157.6,-25.7,160.4,-23.7).curveTo(163.4,-21.6,167.6,-21.6).moveTo(108.4,34).lineTo(108.4,6.4).curveTo(108.6,9.1,111.4,11.1).curveTo(114.4,13.2,118.6,13.2).moveTo(48.4,-6).lineTo(48.4,-33.6).curveTo(48.6,-30.9,51.4,-28.9).curveTo(54.4,-26.8,58.6,-26.8).moveTo(38.4,88).lineTo(38.4,60.4).curveTo(38.6,63.1,41.4,65.1).curveTo(44.4,67.2,48.6,67.2).moveTo(101.4,122.8).lineTo(101.4,95.2).curveTo(101.5,97.9,104.4,99.9).curveTo(107.3,102,111.5,102).moveTo(-46.6,-173).lineTo(-46.6,-200.6).curveTo(-46.6,-197.9,-43.7,-195.9).curveTo(-40.8,-193.8,-36.6,-193.8).moveTo(-101.6,-151.6).lineTo(-101.6,-179.2).curveTo(-101.5,-176.5,-98.7,-174.5).curveTo(-95.8,-172.4,-91.5,-172.4).moveTo(-91.5,-71).lineTo(-91.5,-98.6).curveTo(-91.4,-95.9,-88.6,-93.9).curveTo(-85.6,-91.8,-81.4,-91.8).moveTo(-7.6,-116.8).lineTo(-7.6,-144.4).curveTo(-7.4,-141.7,-4.6,-139.7).curveTo(-1.6,-137.6,2.6,-137.6).moveTo(-254.5,-105.8).lineTo(-254.5,-133.4).curveTo(-254.4,-130.7,-251.6,-128.7).curveTo(-248.6,-126.6,-244.4,-126.6).moveTo(-191.5,-116).lineTo(-191.5,-143.6).curveTo(-191.4,-140.9,-188.6,-138.9).curveTo(-185.6,-136.8,-181.4,-136.8).moveTo(-211.6,-15).lineTo(-211.6,-42.6).curveTo(-211.5,-39.9,-208.7,-37.9).curveTo(-205.8,-35.8,-201.5,-35.8).moveTo(-155.5,106).lineTo(-155.5,78.3).curveTo(-155.4,81.1,-152.6,83.1).curveTo(-149.6,85.1,-145.4,85.1).moveTo(-7.6,-15).lineTo(-7.6,-42.6).curveTo(-7.4,-39.9,-4.6,-37.9).curveTo(-1.6,-35.8,2.6,-35.8).moveTo(-135.4,28.8).lineTo(-135.4,1.2).curveTo(-135.3,3.9,-132.5,5.9).curveTo(-129.5,8,-125.3,8).moveTo(-36.6,123).lineTo(-36.6,95.4).curveTo(-36.4,98.1,-33.6,100.1).curveTo(-30.6,102.2,-26.4,102.2).moveTo(108.4,186).lineTo(108.4,158.4).curveTo(108.6,161.1,111.4,163.1).curveTo(114.4,165.2,118.6,165.2).moveTo(18.4,214).lineTo(18.4,186.4).curveTo(18.6,189.1,21.4,191.1).curveTo(24.4,193.2,28.6,193.2);
	this.shape_74.setTransform(311.45,246.225);

	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.beginFill("#000000").beginStroke().moveTo(19.1,203.5).lineTo(18.5,201.2).curveTo(18.5,200.4,18.7,199.8).lineTo(18.7,199.7).lineTo(18.5,199.2).curveTo(18.5,196.8,20.1,195.4).curveTo(21.4,194.2,23.5,194.2).curveTo(25.6,194.2,26.9,195.4).curveTo(28.4,196.8,28.5,199.1).lineTo(28.5,199.4).lineTo(28.4,200.1).lineTo(28.5,201.1).lineTo(28.5,201.2).curveTo(28.5,202.8,27.5,204.2).curveTo(26.1,206.2,23.5,206.2).curveTo(20.2,206.2,19.1,203.5).closePath().moveTo(109.1,175.5).lineTo(108.5,173.2).curveTo(108.5,172.4,108.7,171.8).lineTo(108.7,171.7).lineTo(108.5,171.2).curveTo(108.5,168.8,110.1,167.4).curveTo(111.4,166.2,113.5,166.2).curveTo(115.6,166.2,116.9,167.4).curveTo(118.5,168.8,118.5,171.1).lineTo(118.5,171.4).lineTo(118.4,172.1).lineTo(118.5,173.1).lineTo(118.5,173.2).curveTo(118.5,174.8,117.5,176.2).curveTo(116.1,178.2,113.5,178.2).curveTo(110.2,178.2,109.1,175.5).closePath().moveTo(-36,112.5).lineTo(-36.5,110.2).curveTo(-36.5,109.4,-36.3,108.8).lineTo(-36.3,108.7).lineTo(-36.5,108.2).curveTo(-36.5,105.8,-34.9,104.4).curveTo(-33.6,103.2,-31.5,103.2).curveTo(-29.5,103.2,-28.1,104.4).curveTo(-26.6,105.8,-26.5,108.1).lineTo(-26.5,108.4).lineTo(-26.6,109.1).lineTo(-26.5,110.1).lineTo(-26.5,110.2).curveTo(-26.5,111.8,-27.5,113.2).curveTo(-28.9,115.2,-31.5,115.2).curveTo(-34.8,115.2,-36,112.5).closePath().moveTo(102,112.3).lineTo(101.4,110).curveTo(101.4,109.2,101.6,108.6).lineTo(101.6,108.5).lineTo(101.4,108).curveTo(101.5,105.6,103,104.2).curveTo(104.4,103,106.5,103).curveTo(108.5,103,109.9,104.2).curveTo(111.4,105.6,111.4,107.9).lineTo(111.4,108.2).lineTo(111.3,108.9).lineTo(111.4,109.9).lineTo(111.4,110).curveTo(111.5,111.6,110.4,113).curveTo(109.1,115,106.5,115).curveTo(103.2,115,102,112.3).closePath().moveTo(-155,95.4).lineTo(-155.5,93.2).curveTo(-155.5,92.4,-155.3,91.7).lineTo(-155.3,91.7).lineTo(-155.5,91.2).curveTo(-155.5,88.8,-154,87.4).curveTo(-152.6,86.1,-150.5,86.1).curveTo(-148.5,86.1,-147.1,87.4).curveTo(-145.6,88.7,-145.5,91).lineTo(-145.5,91.3).lineTo(-145.6,92.1).lineTo(-145.5,93).lineTo(-145.5,93.2).curveTo(-145.5,94.7,-146.5,96.2).curveTo(-147.9,98.2,-150.5,98.2).curveTo(-153.8,98.2,-155,95.4).closePath().moveTo(39.1,77.5).lineTo(38.5,75.2).curveTo(38.5,74.4,38.7,73.8).lineTo(38.7,73.7).lineTo(38.5,73.2).curveTo(38.5,70.8,40.1,69.4).curveTo(41.5,68.2,43.5,68.2).curveTo(45.5,68.2,47,69.4).curveTo(48.5,70.8,48.5,73.1).lineTo(48.5,73.4).lineTo(48.4,74.1).lineTo(48.5,75.1).lineTo(48.5,75.2).curveTo(48.5,76.8,47.5,78.2).curveTo(46.1,80.2,43.5,80.2).curveTo(40.3,80.2,39.1,77.5).closePath().moveTo(109.1,23.5).lineTo(108.5,21.2).curveTo(108.5,20.4,108.7,19.8).lineTo(108.7,19.7).lineTo(108.5,19.2).curveTo(108.5,16.8,110.1,15.4).curveTo(111.4,14.2,113.5,14.2).curveTo(115.6,14.2,116.9,15.4).curveTo(118.5,16.8,118.5,19.1).lineTo(118.5,19.4).lineTo(118.4,20.1).lineTo(118.5,21.1).lineTo(118.5,21.2).curveTo(118.5,22.8,117.5,24.2).curveTo(116.1,26.2,113.5,26.2).curveTo(110.2,26.2,109.1,23.5).closePath().moveTo(-134.8,18.3).lineTo(-135.4,16).curveTo(-135.4,15.2,-135.2,14.6).lineTo(-135.2,14.5).lineTo(-135.4,14).curveTo(-135.4,11.6,-133.8,10.2).curveTo(-132.5,9,-130.4,9).curveTo(-128.3,9,-127,10.2).curveTo(-125.4,11.6,-125.4,13.9).lineTo(-125.4,14.2).lineTo(-125.5,14.9).lineTo(-125.4,15.9).lineTo(-125.4,16).curveTo(-125.4,17.6,-126.4,19).curveTo(-127.8,21,-130.4,21).curveTo(-133.7,21,-134.8,18.3).closePath().moveTo(158,-11.3).lineTo(157.5,-13.6).curveTo(157.5,-14.4,157.7,-15).lineTo(157.7,-15.1).lineTo(157.5,-15.6).curveTo(157.5,-18,159,-19.4).curveTo(160.5,-20.6,162.5,-20.6).curveTo(164.6,-20.6,166,-19.4).curveTo(167.5,-18,167.5,-15.7).lineTo(167.5,-15.4).lineTo(167.4,-14.7).lineTo(167.5,-13.7).lineTo(167.5,-13.6).curveTo(167.5,-12,166.5,-10.6).curveTo(165.1,-8.6,162.5,-8.6).curveTo(159.3,-8.6,158,-11.3).closePath().moveTo(49.1,-16.5).lineTo(48.5,-18.8).curveTo(48.5,-19.6,48.7,-20.2).lineTo(48.7,-20.3).lineTo(48.5,-20.8).curveTo(48.5,-23.2,50,-24.6).curveTo(51.5,-25.8,53.5,-25.8).curveTo(55.6,-25.8,57,-24.6).curveTo(58.5,-23.2,58.5,-20.9).lineTo(58.5,-20.6).lineTo(58.4,-19.9).lineTo(58.5,-18.9).lineTo(58.5,-18.8).curveTo(58.5,-17.2,57.5,-15.8).curveTo(56.1,-13.8,53.5,-13.8).curveTo(50.3,-13.8,49.1,-16.5).closePath().moveTo(-6.9,-25.5).lineTo(-7.5,-27.8).curveTo(-7.5,-28.6,-7.3,-29.2).lineTo(-7.3,-29.3).lineTo(-7.5,-29.8).curveTo(-7.5,-32.2,-5.9,-33.6).curveTo(-4.5,-34.8,-2.5,-34.8).curveTo(-0.4,-34.8,0.9,-33.6).curveTo(2.5,-32.2,2.5,-29.9).lineTo(2.5,-29.6).lineTo(2.4,-28.9).lineTo(2.5,-27.9).lineTo(2.5,-27.8).curveTo(2.5,-26.2,1.5,-24.8).curveTo(0.1,-22.8,-2.5,-22.8).curveTo(-5.7,-22.8,-6.9,-25.5).closePath().moveTo(-211,-25.5).lineTo(-211.6,-27.8).curveTo(-211.6,-28.6,-211.4,-29.2).lineTo(-211.4,-29.3).lineTo(-211.6,-29.8).curveTo(-211.6,-32.2,-210.1,-33.6).curveTo(-208.6,-34.8,-206.6,-34.8).curveTo(-204.5,-34.8,-203.1,-33.6).curveTo(-201.6,-32.2,-201.6,-29.9).lineTo(-201.6,-29.6).lineTo(-201.7,-28.9).lineTo(-201.6,-27.9).lineTo(-201.6,-27.8).curveTo(-201.6,-26.2,-202.6,-24.8).curveTo(-204,-22.8,-206.6,-22.8).curveTo(-209.8,-22.8,-211,-25.5).closePath().moveTo(245.1,-43.8).lineTo(244.5,-46).curveTo(244.5,-46.8,244.7,-47.5).lineTo(244.7,-47.5).lineTo(244.5,-48).curveTo(244.5,-50.4,246.1,-51.8).curveTo(247.5,-53.1,249.5,-53.1).curveTo(251.6,-53.1,252.9,-51.8).curveTo(254.5,-50.5,254.5,-48.2).lineTo(254.5,-47.9).lineTo(254.4,-47.1).lineTo(254.5,-46.2).lineTo(254.5,-46).curveTo(254.5,-44.5,253.5,-43).curveTo(252.1,-41,249.5,-41).curveTo(246.3,-41,245.1,-43.8).closePath().moveTo(109.1,-66.5).lineTo(108.5,-68.8).curveTo(108.5,-69.6,108.7,-70.2).lineTo(108.7,-70.3).lineTo(108.5,-70.8).curveTo(108.5,-73.2,110.1,-74.6).curveTo(111.4,-75.8,113.5,-75.8).curveTo(115.6,-75.8,116.9,-74.6).curveTo(118.5,-73.2,118.5,-70.9).lineTo(118.5,-70.6).lineTo(118.4,-69.9).lineTo(118.5,-68.9).lineTo(118.5,-68.8).curveTo(118.5,-67.2,117.5,-65.8).curveTo(116.1,-63.8,113.5,-63.8).curveTo(110.2,-63.8,109.1,-66.5).closePath().moveTo(199.1,-74.5).lineTo(198.5,-76.8).curveTo(198.5,-77.6,198.7,-78.2).lineTo(198.7,-78.3).lineTo(198.5,-78.8).curveTo(198.5,-81.2,200.1,-82.6).curveTo(201.4,-83.8,203.5,-83.8).curveTo(205.6,-83.8,206.9,-82.6).curveTo(208.5,-81.2,208.5,-78.9).lineTo(208.5,-78.6).lineTo(208.4,-77.9).lineTo(208.5,-76.9).lineTo(208.5,-76.8).curveTo(208.5,-75.2,207.5,-73.8).curveTo(206.1,-71.8,203.5,-71.8).curveTo(200.2,-71.8,199.1,-74.5).closePath().moveTo(-91,-81.5).lineTo(-91.5,-83.8).curveTo(-91.5,-84.6,-91.3,-85.2).lineTo(-91.3,-85.3).lineTo(-91.5,-85.8).curveTo(-91.5,-88.2,-90,-89.6).curveTo(-88.6,-90.8,-86.5,-90.8).curveTo(-84.5,-90.8,-83.1,-89.6).curveTo(-81.6,-88.2,-81.5,-85.9).lineTo(-81.5,-85.6).lineTo(-81.6,-84.9).lineTo(-81.5,-83.9).lineTo(-81.5,-83.8).curveTo(-81.5,-82.2,-82.5,-80.8).curveTo(-83.9,-78.8,-86.5,-78.8).curveTo(-89.8,-78.8,-91,-81.5).closePath().moveTo(67.1,-92.5).lineTo(66.5,-94.8).curveTo(66.5,-95.6,66.7,-96.2).lineTo(66.7,-96.3).lineTo(66.5,-96.8).curveTo(66.5,-99.2,68,-100.6).curveTo(69.5,-101.8,71.5,-101.8).curveTo(73.6,-101.8,75,-100.6).curveTo(76.5,-99.2,76.5,-96.9).lineTo(76.5,-96.6).lineTo(76.4,-95.9).lineTo(76.5,-94.9).lineTo(76.5,-94.8).curveTo(76.5,-93.2,75.5,-91.8).curveTo(74.1,-89.8,71.5,-89.8).curveTo(68.3,-89.8,67.1,-92.5).closePath().moveTo(158,-94.5).lineTo(157.5,-96.8).curveTo(157.5,-97.6,157.7,-98.2).lineTo(157.7,-98.3).lineTo(157.5,-98.8).curveTo(157.5,-101.2,159,-102.6).curveTo(160.5,-103.8,162.5,-103.8).curveTo(164.6,-103.8,166,-102.6).curveTo(167.5,-101.2,167.5,-98.9).lineTo(167.5,-98.6).lineTo(167.4,-97.9).lineTo(167.5,-96.9).lineTo(167.5,-96.8).curveTo(167.5,-95.2,166.5,-93.8).curveTo(165.1,-91.8,162.5,-91.8).curveTo(159.3,-91.8,158,-94.5).closePath().moveTo(-254,-116.3).lineTo(-254.5,-118.6).curveTo(-254.5,-119.4,-254.3,-120).lineTo(-254.3,-120.1).lineTo(-254.5,-120.6).curveTo(-254.5,-123,-253,-124.4).curveTo(-251.6,-125.6,-249.5,-125.6).curveTo(-247.5,-125.6,-246.1,-124.4).curveTo(-244.6,-123,-244.5,-120.7).lineTo(-244.5,-120.4).lineTo(-244.6,-119.7).lineTo(-244.5,-118.7).lineTo(-244.5,-118.6).curveTo(-244.5,-117,-245.5,-115.6).curveTo(-246.9,-113.6,-249.5,-113.6).curveTo(-252.8,-113.6,-254,-116.3).closePath().moveTo(49.1,-126.5).lineTo(48.5,-128.8).curveTo(48.5,-129.6,48.7,-130.2).lineTo(48.7,-130.3).lineTo(48.5,-130.8).curveTo(48.5,-133.2,50,-134.6).curveTo(51.5,-135.8,53.5,-135.8).curveTo(55.6,-135.8,57,-134.6).curveTo(58.5,-133.2,58.5,-130.9).lineTo(58.5,-130.6).lineTo(58.4,-129.9).lineTo(58.5,-128.9).lineTo(58.5,-128.8).curveTo(58.5,-127.2,57.5,-125.8).curveTo(56.1,-123.8,53.5,-123.8).curveTo(50.3,-123.8,49.1,-126.5).closePath().moveTo(-191,-126.5).lineTo(-191.5,-128.8).curveTo(-191.5,-129.6,-191.3,-130.2).lineTo(-191.3,-130.3).lineTo(-191.5,-130.8).curveTo(-191.5,-133.2,-190,-134.6).curveTo(-188.6,-135.8,-186.5,-135.8).curveTo(-184.5,-135.8,-183.1,-134.6).curveTo(-181.6,-133.2,-181.5,-130.9).lineTo(-181.5,-130.6).lineTo(-181.6,-129.9).lineTo(-181.5,-128.9).lineTo(-181.5,-128.8).curveTo(-181.5,-127.2,-182.5,-125.8).curveTo(-183.9,-123.8,-186.5,-123.8).curveTo(-189.8,-123.8,-191,-126.5).closePath().moveTo(-6.9,-127.3).lineTo(-7.5,-129.6).curveTo(-7.5,-130.4,-7.3,-131).lineTo(-7.3,-131.1).lineTo(-7.5,-131.6).curveTo(-7.5,-134,-5.9,-135.4).curveTo(-4.5,-136.6,-2.5,-136.6).curveTo(-0.4,-136.6,0.9,-135.4).curveTo(2.5,-134,2.5,-131.7).lineTo(2.5,-131.4).lineTo(2.4,-130.7).lineTo(2.5,-129.7).lineTo(2.5,-129.6).curveTo(2.5,-128,1.5,-126.6).curveTo(0.1,-124.6,-2.5,-124.6).curveTo(-5.7,-124.6,-6.9,-127.3).closePath().moveTo(241,-130.5).lineTo(240.5,-132.8).curveTo(240.5,-133.6,240.7,-134.2).lineTo(240.7,-134.3).lineTo(240.5,-134.8).curveTo(240.5,-137.2,242,-138.6).curveTo(243.4,-139.8,245.5,-139.8).curveTo(247.5,-139.8,248.9,-138.6).curveTo(250.4,-137.2,250.5,-134.9).lineTo(250.5,-134.6).lineTo(250.4,-133.9).lineTo(250.5,-132.9).lineTo(250.5,-132.8).curveTo(250.5,-131.2,249.5,-129.8).curveTo(248.1,-127.8,245.5,-127.8).curveTo(242.2,-127.8,241,-130.5).closePath().moveTo(199.1,-137.5).lineTo(198.5,-139.8).curveTo(198.5,-140.6,198.7,-141.2).lineTo(198.7,-141.3).lineTo(198.5,-141.8).curveTo(198.5,-144.2,200.1,-145.6).curveTo(201.4,-146.8,203.5,-146.8).curveTo(205.6,-146.8,206.9,-145.6).curveTo(208.5,-144.2,208.5,-141.9).lineTo(208.5,-141.6).lineTo(208.4,-140.9).lineTo(208.5,-139.9).lineTo(208.5,-139.8).curveTo(208.5,-138.2,207.5,-136.8).curveTo(206.1,-134.8,203.5,-134.8).curveTo(200.2,-134.8,199.1,-137.5).closePath().moveTo(138.1,-161.2).lineTo(137.5,-163.4).curveTo(137.5,-164.2,137.7,-164.9).lineTo(137.7,-164.9).lineTo(137.5,-165.4).curveTo(137.5,-167.8,139.1,-169.2).curveTo(140.5,-170.5,142.5,-170.5).curveTo(144.5,-170.5,146,-169.2).curveTo(147.5,-167.9,147.5,-165.6).lineTo(147.5,-165.3).lineTo(147.4,-164.5).lineTo(147.5,-163.6).lineTo(147.5,-163.4).curveTo(147.5,-161.9,146.5,-160.4).curveTo(145.1,-158.4,142.5,-158.4).curveTo(139.3,-158.4,138.1,-161.2).closePath().moveTo(-101.1,-162.1).lineTo(-101.6,-164.4).curveTo(-101.6,-165.2,-101.4,-165.8).lineTo(-101.4,-165.9).lineTo(-101.6,-166.4).curveTo(-101.6,-168.8,-100.1,-170.2).curveTo(-98.7,-171.4,-96.6,-171.4).curveTo(-94.6,-171.4,-93.1,-170.2).curveTo(-91.7,-168.8,-91.6,-166.5).lineTo(-91.6,-166.2).lineTo(-91.7,-165.5).lineTo(-91.6,-164.5).lineTo(-91.6,-164.4).curveTo(-91.6,-162.8,-92.6,-161.4).curveTo(-94,-159.4,-96.6,-159.4).curveTo(-99.9,-159.4,-101.1,-162.1).closePath().moveTo(184.1,-179.5).lineTo(183.5,-181.8).curveTo(183.5,-182.6,183.7,-183.2).lineTo(183.7,-183.3).lineTo(183.5,-183.8).curveTo(183.5,-186.2,185,-187.6).curveTo(186.5,-188.8,188.5,-188.8).curveTo(190.6,-188.8,192,-187.6).curveTo(193.5,-186.2,193.5,-183.9).lineTo(193.5,-183.6).lineTo(193.4,-182.9).lineTo(193.5,-181.9).lineTo(193.5,-181.8).curveTo(193.5,-180.2,192.5,-178.8).curveTo(191.1,-176.8,188.5,-176.8).curveTo(185.3,-176.8,184.1,-179.5).closePath().moveTo(-46.1,-183.5).lineTo(-46.6,-185.8).curveTo(-46.6,-186.6,-46.4,-187.2).lineTo(-46.4,-187.3).lineTo(-46.6,-187.8).curveTo(-46.6,-190.2,-45.1,-191.6).curveTo(-43.7,-192.8,-41.6,-192.8).curveTo(-39.6,-192.8,-38.1,-191.6).curveTo(-36.7,-190.2,-36.6,-187.9).lineTo(-36.6,-187.6).lineTo(-36.7,-186.9).lineTo(-36.6,-185.9).lineTo(-36.6,-185.8).curveTo(-36.6,-184.2,-37.6,-182.8).curveTo(-39,-180.8,-41.6,-180.8).curveTo(-44.9,-180.8,-46.1,-183.5).closePath().moveTo(69.1,-191.6).lineTo(68.6,-193.8).curveTo(68.6,-194.6,68.8,-195.3).lineTo(68.8,-195.3).lineTo(68.6,-195.8).curveTo(68.6,-198.2,70.1,-199.6).curveTo(71.5,-200.9,73.6,-200.9).curveTo(75.6,-200.9,77,-199.6).curveTo(78.5,-198.3,78.6,-196).lineTo(78.6,-195.7).lineTo(78.5,-194.9).lineTo(78.6,-194).lineTo(78.6,-193.8).curveTo(78.6,-192.3,77.6,-190.8).curveTo(76.2,-188.8,73.6,-188.8).curveTo(70.3,-188.8,69.1,-191.6).closePath().moveTo(235.1,-196.9).lineTo(234.5,-199.2).curveTo(234.5,-200,234.7,-200.6).lineTo(234.7,-200.7).lineTo(234.5,-201.2).curveTo(234.5,-203.6,236.1,-205).curveTo(237.4,-206.2,239.5,-206.2).curveTo(241.5,-206.2,242.9,-205).curveTo(244.4,-203.6,244.5,-201.3).lineTo(244.5,-201).lineTo(244.4,-200.3).lineTo(244.5,-199.3).lineTo(244.5,-199.2).curveTo(244.5,-197.6,243.5,-196.2).curveTo(242.1,-194.2,239.5,-194.2).curveTo(236.2,-194.2,235.1,-196.9).closePath();
	this.shape_75.setTransform(301.4,261.175);

	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(234.4,-186.4).lineTo(234.4,-214).curveTo(234.6,-211.3,237.4,-209.3).curveTo(240.3,-207.2,244.6,-207.2).moveTo(183.4,-169).lineTo(183.4,-196.6).curveTo(183.6,-193.9,186.4,-191.9).curveTo(189.4,-189.8,193.6,-189.8).moveTo(198.4,-127).lineTo(198.4,-154.6).curveTo(198.6,-151.9,201.4,-149.9).curveTo(204.3,-147.8,208.6,-147.8).moveTo(240.4,-120).lineTo(240.4,-147.6).curveTo(240.6,-144.9,243.4,-142.9).curveTo(246.3,-140.8,250.6,-140.8).moveTo(198.4,-64).lineTo(198.4,-91.6).curveTo(198.6,-88.9,201.4,-86.9).curveTo(204.3,-84.8,208.6,-84.8).moveTo(244.4,-33.2).lineTo(244.4,-60.9).curveTo(244.6,-58.1,247.4,-56.1).curveTo(250.3,-54.1,254.6,-54.1).moveTo(137.4,-150.6).lineTo(137.4,-178.3).curveTo(137.6,-175.5,140.4,-173.5).curveTo(143.4,-171.5,147.6,-171.5).moveTo(68.6,-181).lineTo(68.6,-208.7).curveTo(68.7,-205.9,71.5,-203.9).curveTo(74.4,-201.9,78.7,-201.9).moveTo(66.4,-82).lineTo(66.4,-109.6).curveTo(66.6,-106.9,69.4,-104.9).curveTo(72.4,-102.8,76.6,-102.8).moveTo(48.4,-116).lineTo(48.4,-143.6).curveTo(48.6,-140.9,51.4,-138.9).curveTo(54.4,-136.8,58.6,-136.8).moveTo(157.4,-84).lineTo(157.4,-111.6).curveTo(157.6,-108.9,160.4,-106.9).curveTo(163.4,-104.8,167.6,-104.8).moveTo(108.4,-56).lineTo(108.4,-83.6).curveTo(108.6,-80.9,111.4,-78.9).curveTo(114.4,-76.8,118.6,-76.8).moveTo(157.4,-0.8).lineTo(157.4,-28.4).curveTo(157.6,-25.7,160.4,-23.7).curveTo(163.4,-21.6,167.6,-21.6).moveTo(108.4,34).lineTo(108.4,6.4).curveTo(108.6,9.1,111.4,11.1).curveTo(114.4,13.2,118.6,13.2).moveTo(48.4,-6).lineTo(48.4,-33.6).curveTo(48.6,-30.9,51.4,-28.9).curveTo(54.4,-26.8,58.6,-26.8).moveTo(38.4,88).lineTo(38.4,60.4).curveTo(38.6,63.1,41.4,65.1).curveTo(44.4,67.2,48.6,67.2).moveTo(101.4,122.8).lineTo(101.4,95.2).curveTo(101.5,97.9,104.4,99.9).curveTo(107.3,102,111.5,102).moveTo(214.3,46.8).lineTo(214.3,19.2).curveTo(214.4,21.9,217.3,23.9).curveTo(220.3,26,224.4,26).moveTo(-46.6,-173).lineTo(-46.6,-200.6).curveTo(-46.6,-197.9,-43.7,-195.9).curveTo(-40.8,-193.8,-36.6,-193.8).moveTo(-101.6,-151.6).lineTo(-101.6,-179.2).curveTo(-101.5,-176.5,-98.7,-174.5).curveTo(-95.8,-172.4,-91.5,-172.4).moveTo(-91.5,-71).lineTo(-91.5,-98.6).curveTo(-91.4,-95.9,-88.6,-93.9).curveTo(-85.6,-91.8,-81.4,-91.8).moveTo(-7.6,-116.8).lineTo(-7.6,-144.4).curveTo(-7.4,-141.7,-4.6,-139.7).curveTo(-1.6,-137.6,2.6,-137.6).moveTo(-254.5,-105.8).lineTo(-254.5,-133.4).curveTo(-254.4,-130.7,-251.6,-128.7).curveTo(-248.6,-126.6,-244.4,-126.6).moveTo(-191.5,-116).lineTo(-191.5,-143.6).curveTo(-191.4,-140.9,-188.6,-138.9).curveTo(-185.6,-136.8,-181.4,-136.8).moveTo(-211.6,-15).lineTo(-211.6,-42.6).curveTo(-211.5,-39.9,-208.7,-37.9).curveTo(-205.8,-35.8,-201.5,-35.8).moveTo(-155.5,106).lineTo(-155.5,78.3).curveTo(-155.4,81.1,-152.6,83.1).curveTo(-149.6,85.1,-145.4,85.1).moveTo(-7.6,-15).lineTo(-7.6,-42.6).curveTo(-7.4,-39.9,-4.6,-37.9).curveTo(-1.6,-35.8,2.6,-35.8).moveTo(-135.4,28.8).lineTo(-135.4,1.2).curveTo(-135.3,3.9,-132.5,5.9).curveTo(-129.5,8,-125.3,8).moveTo(-36.6,123).lineTo(-36.6,95.4).curveTo(-36.4,98.1,-33.6,100.1).curveTo(-30.6,102.2,-26.4,102.2).moveTo(108.4,186).lineTo(108.4,158.4).curveTo(108.6,161.1,111.4,163.1).curveTo(114.4,165.2,118.6,165.2).moveTo(18.4,214).lineTo(18.4,186.4).curveTo(18.6,189.1,21.4,191.1).curveTo(24.4,193.2,28.6,193.2);
	this.shape_76.setTransform(311.45,246.225);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.beginFill("#000000").beginStroke().moveTo(19.1,203.5).lineTo(18.5,201.2).curveTo(18.5,200.4,18.7,199.8).lineTo(18.7,199.7).lineTo(18.5,199.2).curveTo(18.5,196.8,20.1,195.4).curveTo(21.4,194.2,23.5,194.2).curveTo(25.6,194.2,26.9,195.4).curveTo(28.4,196.8,28.5,199.1).lineTo(28.5,199.4).lineTo(28.4,200.1).lineTo(28.5,201.1).lineTo(28.5,201.2).curveTo(28.5,202.8,27.5,204.2).curveTo(26.1,206.2,23.5,206.2).curveTo(20.2,206.2,19.1,203.5).closePath().moveTo(109.1,175.5).lineTo(108.5,173.2).curveTo(108.5,172.4,108.7,171.8).lineTo(108.7,171.7).lineTo(108.5,171.2).curveTo(108.5,168.8,110.1,167.4).curveTo(111.4,166.2,113.5,166.2).curveTo(115.6,166.2,116.9,167.4).curveTo(118.5,168.8,118.5,171.1).lineTo(118.5,171.4).lineTo(118.4,172.1).lineTo(118.5,173.1).lineTo(118.5,173.2).curveTo(118.5,174.8,117.5,176.2).curveTo(116.1,178.2,113.5,178.2).curveTo(110.2,178.2,109.1,175.5).closePath().moveTo(-36,112.5).lineTo(-36.5,110.2).curveTo(-36.5,109.4,-36.3,108.8).lineTo(-36.3,108.7).lineTo(-36.5,108.2).curveTo(-36.5,105.8,-34.9,104.4).curveTo(-33.6,103.2,-31.5,103.2).curveTo(-29.5,103.2,-28.1,104.4).curveTo(-26.6,105.8,-26.5,108.1).lineTo(-26.5,108.4).lineTo(-26.6,109.1).lineTo(-26.5,110.1).lineTo(-26.5,110.2).curveTo(-26.5,111.8,-27.5,113.2).curveTo(-28.9,115.2,-31.5,115.2).curveTo(-34.8,115.2,-36,112.5).closePath().moveTo(102,112.3).lineTo(101.4,110).curveTo(101.4,109.2,101.6,108.6).lineTo(101.6,108.5).lineTo(101.4,108).curveTo(101.5,105.6,103,104.2).curveTo(104.4,103,106.5,103).curveTo(108.5,103,109.9,104.2).curveTo(111.4,105.6,111.4,107.9).lineTo(111.4,108.2).lineTo(111.3,108.9).lineTo(111.4,109.9).lineTo(111.4,110).curveTo(111.5,111.6,110.4,113).curveTo(109.1,115,106.5,115).curveTo(103.2,115,102,112.3).closePath().moveTo(-155,95.4).lineTo(-155.5,93.2).curveTo(-155.5,92.4,-155.3,91.7).lineTo(-155.3,91.7).lineTo(-155.5,91.2).curveTo(-155.5,88.8,-154,87.4).curveTo(-152.6,86.1,-150.5,86.1).curveTo(-148.5,86.1,-147.1,87.4).curveTo(-145.6,88.7,-145.5,91).lineTo(-145.5,91.3).lineTo(-145.6,92.1).lineTo(-145.5,93).lineTo(-145.5,93.2).curveTo(-145.5,94.7,-146.5,96.2).curveTo(-147.9,98.2,-150.5,98.2).curveTo(-153.8,98.2,-155,95.4).closePath().moveTo(39.1,77.5).lineTo(38.5,75.2).curveTo(38.5,74.4,38.7,73.8).lineTo(38.7,73.7).lineTo(38.5,73.2).curveTo(38.5,70.8,40.1,69.4).curveTo(41.5,68.2,43.5,68.2).curveTo(45.5,68.2,47,69.4).curveTo(48.5,70.8,48.5,73.1).lineTo(48.5,73.4).lineTo(48.4,74.1).lineTo(48.5,75.1).lineTo(48.5,75.2).curveTo(48.5,76.8,47.5,78.2).curveTo(46.1,80.2,43.5,80.2).curveTo(40.3,80.2,39.1,77.5).closePath().moveTo(214.9,36.3).lineTo(214.4,34).curveTo(214.4,33.2,214.6,32.6).lineTo(214.6,32.5).lineTo(214.4,32).curveTo(214.4,29.6,215.9,28.2).curveTo(217.3,27,219.4,27).curveTo(221.4,27,222.9,28.2).curveTo(224.3,29.6,224.4,31.9).lineTo(224.4,32.2).lineTo(224.3,32.9).lineTo(224.4,33.9).lineTo(224.4,34).curveTo(224.4,35.6,223.4,37).curveTo(222,39,219.4,39).curveTo(216.1,39,214.9,36.3).closePath().moveTo(109.1,23.5).lineTo(108.5,21.2).curveTo(108.5,20.4,108.7,19.8).lineTo(108.7,19.7).lineTo(108.5,19.2).curveTo(108.5,16.8,110.1,15.4).curveTo(111.4,14.2,113.5,14.2).curveTo(115.6,14.2,116.9,15.4).curveTo(118.5,16.8,118.5,19.1).lineTo(118.5,19.4).lineTo(118.4,20.1).lineTo(118.5,21.1).lineTo(118.5,21.2).curveTo(118.5,22.8,117.5,24.2).curveTo(116.1,26.2,113.5,26.2).curveTo(110.2,26.2,109.1,23.5).closePath().moveTo(-134.8,18.3).lineTo(-135.4,16).curveTo(-135.4,15.2,-135.2,14.6).lineTo(-135.2,14.5).lineTo(-135.4,14).curveTo(-135.4,11.6,-133.8,10.2).curveTo(-132.5,9,-130.4,9).curveTo(-128.3,9,-127,10.2).curveTo(-125.4,11.6,-125.4,13.9).lineTo(-125.4,14.2).lineTo(-125.5,14.9).lineTo(-125.4,15.9).lineTo(-125.4,16).curveTo(-125.4,17.6,-126.4,19).curveTo(-127.8,21,-130.4,21).curveTo(-133.7,21,-134.8,18.3).closePath().moveTo(158,-11.3).lineTo(157.5,-13.6).curveTo(157.5,-14.4,157.7,-15).lineTo(157.7,-15.1).lineTo(157.5,-15.6).curveTo(157.5,-18,159,-19.4).curveTo(160.5,-20.6,162.5,-20.6).curveTo(164.6,-20.6,166,-19.4).curveTo(167.5,-18,167.5,-15.7).lineTo(167.5,-15.4).lineTo(167.4,-14.7).lineTo(167.5,-13.7).lineTo(167.5,-13.6).curveTo(167.5,-12,166.5,-10.6).curveTo(165.1,-8.6,162.5,-8.6).curveTo(159.3,-8.6,158,-11.3).closePath().moveTo(49.1,-16.5).lineTo(48.5,-18.8).curveTo(48.5,-19.6,48.7,-20.2).lineTo(48.7,-20.3).lineTo(48.5,-20.8).curveTo(48.5,-23.2,50,-24.6).curveTo(51.5,-25.8,53.5,-25.8).curveTo(55.6,-25.8,57,-24.6).curveTo(58.5,-23.2,58.5,-20.9).lineTo(58.5,-20.6).lineTo(58.4,-19.9).lineTo(58.5,-18.9).lineTo(58.5,-18.8).curveTo(58.5,-17.2,57.5,-15.8).curveTo(56.1,-13.8,53.5,-13.8).curveTo(50.3,-13.8,49.1,-16.5).closePath().moveTo(-6.9,-25.5).lineTo(-7.5,-27.8).curveTo(-7.5,-28.6,-7.3,-29.2).lineTo(-7.3,-29.3).lineTo(-7.5,-29.8).curveTo(-7.5,-32.2,-5.9,-33.6).curveTo(-4.5,-34.8,-2.5,-34.8).curveTo(-0.4,-34.8,0.9,-33.6).curveTo(2.5,-32.2,2.5,-29.9).lineTo(2.5,-29.6).lineTo(2.4,-28.9).lineTo(2.5,-27.9).lineTo(2.5,-27.8).curveTo(2.5,-26.2,1.5,-24.8).curveTo(0.1,-22.8,-2.5,-22.8).curveTo(-5.7,-22.8,-6.9,-25.5).closePath().moveTo(-211,-25.5).lineTo(-211.6,-27.8).curveTo(-211.6,-28.6,-211.4,-29.2).lineTo(-211.4,-29.3).lineTo(-211.6,-29.8).curveTo(-211.6,-32.2,-210.1,-33.6).curveTo(-208.6,-34.8,-206.6,-34.8).curveTo(-204.5,-34.8,-203.1,-33.6).curveTo(-201.6,-32.2,-201.6,-29.9).lineTo(-201.6,-29.6).lineTo(-201.7,-28.9).lineTo(-201.6,-27.9).lineTo(-201.6,-27.8).curveTo(-201.6,-26.2,-202.6,-24.8).curveTo(-204,-22.8,-206.6,-22.8).curveTo(-209.8,-22.8,-211,-25.5).closePath().moveTo(245.1,-43.8).lineTo(244.5,-46).curveTo(244.5,-46.8,244.7,-47.5).lineTo(244.7,-47.5).lineTo(244.5,-48).curveTo(244.5,-50.4,246.1,-51.8).curveTo(247.5,-53.1,249.5,-53.1).curveTo(251.6,-53.1,252.9,-51.8).curveTo(254.5,-50.5,254.5,-48.2).lineTo(254.5,-47.9).lineTo(254.4,-47.1).lineTo(254.5,-46.2).lineTo(254.5,-46).curveTo(254.5,-44.5,253.5,-43).curveTo(252.1,-41,249.5,-41).curveTo(246.3,-41,245.1,-43.8).closePath().moveTo(109.1,-66.5).lineTo(108.5,-68.8).curveTo(108.5,-69.6,108.7,-70.2).lineTo(108.7,-70.3).lineTo(108.5,-70.8).curveTo(108.5,-73.2,110.1,-74.6).curveTo(111.4,-75.8,113.5,-75.8).curveTo(115.6,-75.8,116.9,-74.6).curveTo(118.5,-73.2,118.5,-70.9).lineTo(118.5,-70.6).lineTo(118.4,-69.9).lineTo(118.5,-68.9).lineTo(118.5,-68.8).curveTo(118.5,-67.2,117.5,-65.8).curveTo(116.1,-63.8,113.5,-63.8).curveTo(110.2,-63.8,109.1,-66.5).closePath().moveTo(199.1,-74.5).lineTo(198.5,-76.8).curveTo(198.5,-77.6,198.7,-78.2).lineTo(198.7,-78.3).lineTo(198.5,-78.8).curveTo(198.5,-81.2,200.1,-82.6).curveTo(201.4,-83.8,203.5,-83.8).curveTo(205.6,-83.8,206.9,-82.6).curveTo(208.5,-81.2,208.5,-78.9).lineTo(208.5,-78.6).lineTo(208.4,-77.9).lineTo(208.5,-76.9).lineTo(208.5,-76.8).curveTo(208.5,-75.2,207.5,-73.8).curveTo(206.1,-71.8,203.5,-71.8).curveTo(200.2,-71.8,199.1,-74.5).closePath().moveTo(-91,-81.5).lineTo(-91.5,-83.8).curveTo(-91.5,-84.6,-91.3,-85.2).lineTo(-91.3,-85.3).lineTo(-91.5,-85.8).curveTo(-91.5,-88.2,-90,-89.6).curveTo(-88.6,-90.8,-86.5,-90.8).curveTo(-84.5,-90.8,-83.1,-89.6).curveTo(-81.6,-88.2,-81.5,-85.9).lineTo(-81.5,-85.6).lineTo(-81.6,-84.9).lineTo(-81.5,-83.9).lineTo(-81.5,-83.8).curveTo(-81.5,-82.2,-82.5,-80.8).curveTo(-83.9,-78.8,-86.5,-78.8).curveTo(-89.8,-78.8,-91,-81.5).closePath().moveTo(67.1,-92.5).lineTo(66.5,-94.8).curveTo(66.5,-95.6,66.7,-96.2).lineTo(66.7,-96.3).lineTo(66.5,-96.8).curveTo(66.5,-99.2,68,-100.6).curveTo(69.5,-101.8,71.5,-101.8).curveTo(73.6,-101.8,75,-100.6).curveTo(76.5,-99.2,76.5,-96.9).lineTo(76.5,-96.6).lineTo(76.4,-95.9).lineTo(76.5,-94.9).lineTo(76.5,-94.8).curveTo(76.5,-93.2,75.5,-91.8).curveTo(74.1,-89.8,71.5,-89.8).curveTo(68.3,-89.8,67.1,-92.5).closePath().moveTo(158,-94.5).lineTo(157.5,-96.8).curveTo(157.5,-97.6,157.7,-98.2).lineTo(157.7,-98.3).lineTo(157.5,-98.8).curveTo(157.5,-101.2,159,-102.6).curveTo(160.5,-103.8,162.5,-103.8).curveTo(164.6,-103.8,166,-102.6).curveTo(167.5,-101.2,167.5,-98.9).lineTo(167.5,-98.6).lineTo(167.4,-97.9).lineTo(167.5,-96.9).lineTo(167.5,-96.8).curveTo(167.5,-95.2,166.5,-93.8).curveTo(165.1,-91.8,162.5,-91.8).curveTo(159.3,-91.8,158,-94.5).closePath().moveTo(-254,-116.3).lineTo(-254.5,-118.6).curveTo(-254.5,-119.4,-254.3,-120).lineTo(-254.3,-120.1).lineTo(-254.5,-120.6).curveTo(-254.5,-123,-253,-124.4).curveTo(-251.6,-125.6,-249.5,-125.6).curveTo(-247.5,-125.6,-246.1,-124.4).curveTo(-244.6,-123,-244.5,-120.7).lineTo(-244.5,-120.4).lineTo(-244.6,-119.7).lineTo(-244.5,-118.7).lineTo(-244.5,-118.6).curveTo(-244.5,-117,-245.5,-115.6).curveTo(-246.9,-113.6,-249.5,-113.6).curveTo(-252.8,-113.6,-254,-116.3).closePath().moveTo(49.1,-126.5).lineTo(48.5,-128.8).curveTo(48.5,-129.6,48.7,-130.2).lineTo(48.7,-130.3).lineTo(48.5,-130.8).curveTo(48.5,-133.2,50,-134.6).curveTo(51.5,-135.8,53.5,-135.8).curveTo(55.6,-135.8,57,-134.6).curveTo(58.5,-133.2,58.5,-130.9).lineTo(58.5,-130.6).lineTo(58.4,-129.9).lineTo(58.5,-128.9).lineTo(58.5,-128.8).curveTo(58.5,-127.2,57.5,-125.8).curveTo(56.1,-123.8,53.5,-123.8).curveTo(50.3,-123.8,49.1,-126.5).closePath().moveTo(-191,-126.5).lineTo(-191.5,-128.8).curveTo(-191.5,-129.6,-191.3,-130.2).lineTo(-191.3,-130.3).lineTo(-191.5,-130.8).curveTo(-191.5,-133.2,-190,-134.6).curveTo(-188.6,-135.8,-186.5,-135.8).curveTo(-184.5,-135.8,-183.1,-134.6).curveTo(-181.6,-133.2,-181.5,-130.9).lineTo(-181.5,-130.6).lineTo(-181.6,-129.9).lineTo(-181.5,-128.9).lineTo(-181.5,-128.8).curveTo(-181.5,-127.2,-182.5,-125.8).curveTo(-183.9,-123.8,-186.5,-123.8).curveTo(-189.8,-123.8,-191,-126.5).closePath().moveTo(-6.9,-127.3).lineTo(-7.5,-129.6).curveTo(-7.5,-130.4,-7.3,-131).lineTo(-7.3,-131.1).lineTo(-7.5,-131.6).curveTo(-7.5,-134,-5.9,-135.4).curveTo(-4.5,-136.6,-2.5,-136.6).curveTo(-0.4,-136.6,0.9,-135.4).curveTo(2.5,-134,2.5,-131.7).lineTo(2.5,-131.4).lineTo(2.4,-130.7).lineTo(2.5,-129.7).lineTo(2.5,-129.6).curveTo(2.5,-128,1.5,-126.6).curveTo(0.1,-124.6,-2.5,-124.6).curveTo(-5.7,-124.6,-6.9,-127.3).closePath().moveTo(241,-130.5).lineTo(240.5,-132.8).curveTo(240.5,-133.6,240.7,-134.2).lineTo(240.7,-134.3).lineTo(240.5,-134.8).curveTo(240.5,-137.2,242,-138.6).curveTo(243.4,-139.8,245.5,-139.8).curveTo(247.5,-139.8,248.9,-138.6).curveTo(250.4,-137.2,250.5,-134.9).lineTo(250.5,-134.6).lineTo(250.4,-133.9).lineTo(250.5,-132.9).lineTo(250.5,-132.8).curveTo(250.5,-131.2,249.5,-129.8).curveTo(248.1,-127.8,245.5,-127.8).curveTo(242.2,-127.8,241,-130.5).closePath().moveTo(199.1,-137.5).lineTo(198.5,-139.8).curveTo(198.5,-140.6,198.7,-141.2).lineTo(198.7,-141.3).lineTo(198.5,-141.8).curveTo(198.5,-144.2,200.1,-145.6).curveTo(201.4,-146.8,203.5,-146.8).curveTo(205.6,-146.8,206.9,-145.6).curveTo(208.5,-144.2,208.5,-141.9).lineTo(208.5,-141.6).lineTo(208.4,-140.9).lineTo(208.5,-139.9).lineTo(208.5,-139.8).curveTo(208.5,-138.2,207.5,-136.8).curveTo(206.1,-134.8,203.5,-134.8).curveTo(200.2,-134.8,199.1,-137.5).closePath().moveTo(138.1,-161.2).lineTo(137.5,-163.4).curveTo(137.5,-164.2,137.7,-164.9).lineTo(137.7,-164.9).lineTo(137.5,-165.4).curveTo(137.5,-167.8,139.1,-169.2).curveTo(140.5,-170.5,142.5,-170.5).curveTo(144.5,-170.5,146,-169.2).curveTo(147.5,-167.9,147.5,-165.6).lineTo(147.5,-165.3).lineTo(147.4,-164.5).lineTo(147.5,-163.6).lineTo(147.5,-163.4).curveTo(147.5,-161.9,146.5,-160.4).curveTo(145.1,-158.4,142.5,-158.4).curveTo(139.3,-158.4,138.1,-161.2).closePath().moveTo(-101.1,-162.1).lineTo(-101.6,-164.4).curveTo(-101.6,-165.2,-101.4,-165.8).lineTo(-101.4,-165.9).lineTo(-101.6,-166.4).curveTo(-101.6,-168.8,-100.1,-170.2).curveTo(-98.7,-171.4,-96.6,-171.4).curveTo(-94.6,-171.4,-93.1,-170.2).curveTo(-91.7,-168.8,-91.6,-166.5).lineTo(-91.6,-166.2).lineTo(-91.7,-165.5).lineTo(-91.6,-164.5).lineTo(-91.6,-164.4).curveTo(-91.6,-162.8,-92.6,-161.4).curveTo(-94,-159.4,-96.6,-159.4).curveTo(-99.9,-159.4,-101.1,-162.1).closePath().moveTo(184.1,-179.5).lineTo(183.5,-181.8).curveTo(183.5,-182.6,183.7,-183.2).lineTo(183.7,-183.3).lineTo(183.5,-183.8).curveTo(183.5,-186.2,185,-187.6).curveTo(186.5,-188.8,188.5,-188.8).curveTo(190.6,-188.8,192,-187.6).curveTo(193.5,-186.2,193.5,-183.9).lineTo(193.5,-183.6).lineTo(193.4,-182.9).lineTo(193.5,-181.9).lineTo(193.5,-181.8).curveTo(193.5,-180.2,192.5,-178.8).curveTo(191.1,-176.8,188.5,-176.8).curveTo(185.3,-176.8,184.1,-179.5).closePath().moveTo(-46.1,-183.5).lineTo(-46.6,-185.8).curveTo(-46.6,-186.6,-46.4,-187.2).lineTo(-46.4,-187.3).lineTo(-46.6,-187.8).curveTo(-46.6,-190.2,-45.1,-191.6).curveTo(-43.7,-192.8,-41.6,-192.8).curveTo(-39.6,-192.8,-38.1,-191.6).curveTo(-36.7,-190.2,-36.6,-187.9).lineTo(-36.6,-187.6).lineTo(-36.7,-186.9).lineTo(-36.6,-185.9).lineTo(-36.6,-185.8).curveTo(-36.6,-184.2,-37.6,-182.8).curveTo(-39,-180.8,-41.6,-180.8).curveTo(-44.9,-180.8,-46.1,-183.5).closePath().moveTo(69.1,-191.6).lineTo(68.6,-193.8).curveTo(68.6,-194.6,68.8,-195.3).lineTo(68.8,-195.3).lineTo(68.6,-195.8).curveTo(68.6,-198.2,70.1,-199.6).curveTo(71.5,-200.9,73.6,-200.9).curveTo(75.6,-200.9,77,-199.6).curveTo(78.5,-198.3,78.6,-196).lineTo(78.6,-195.7).lineTo(78.5,-194.9).lineTo(78.6,-194).lineTo(78.6,-193.8).curveTo(78.6,-192.3,77.6,-190.8).curveTo(76.2,-188.8,73.6,-188.8).curveTo(70.3,-188.8,69.1,-191.6).closePath().moveTo(235.1,-196.9).lineTo(234.5,-199.2).curveTo(234.5,-200,234.7,-200.6).lineTo(234.7,-200.7).lineTo(234.5,-201.2).curveTo(234.5,-203.6,236.1,-205).curveTo(237.4,-206.2,239.5,-206.2).curveTo(241.5,-206.2,242.9,-205).curveTo(244.4,-203.6,244.5,-201.3).lineTo(244.5,-201).lineTo(244.4,-200.3).lineTo(244.5,-199.3).lineTo(244.5,-199.2).curveTo(244.5,-197.6,243.5,-196.2).curveTo(242.1,-194.2,239.5,-194.2).curveTo(236.2,-194.2,235.1,-196.9).closePath();
	this.shape_77.setTransform(301.4,261.175);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(234.4,-186.4).lineTo(234.4,-214).curveTo(234.6,-211.3,237.4,-209.3).curveTo(240.3,-207.2,244.6,-207.2).moveTo(183.4,-169).lineTo(183.4,-196.6).curveTo(183.6,-193.9,186.4,-191.9).curveTo(189.4,-189.8,193.6,-189.8).moveTo(198.4,-127).lineTo(198.4,-154.6).curveTo(198.6,-151.9,201.4,-149.9).curveTo(204.3,-147.8,208.6,-147.8).moveTo(240.4,-120).lineTo(240.4,-147.6).curveTo(240.6,-144.9,243.4,-142.9).curveTo(246.3,-140.8,250.6,-140.8).moveTo(198.4,-64).lineTo(198.4,-91.6).curveTo(198.6,-88.9,201.4,-86.9).curveTo(204.3,-84.8,208.6,-84.8).moveTo(244.4,-33.2).lineTo(244.4,-60.9).curveTo(244.6,-58.1,247.4,-56.1).curveTo(250.3,-54.1,254.6,-54.1).moveTo(137.4,-150.6).lineTo(137.4,-178.3).curveTo(137.6,-175.5,140.4,-173.5).curveTo(143.4,-171.5,147.6,-171.5).moveTo(68.6,-181).lineTo(68.6,-208.7).curveTo(68.7,-205.9,71.5,-203.9).curveTo(74.4,-201.9,78.7,-201.9).moveTo(66.4,-82).lineTo(66.4,-109.6).curveTo(66.6,-106.9,69.4,-104.9).curveTo(72.4,-102.8,76.6,-102.8).moveTo(48.4,-116).lineTo(48.4,-143.6).curveTo(48.6,-140.9,51.4,-138.9).curveTo(54.4,-136.8,58.6,-136.8).moveTo(157.4,-84).lineTo(157.4,-111.6).curveTo(157.6,-108.9,160.4,-106.9).curveTo(163.4,-104.8,167.6,-104.8).moveTo(108.4,-56).lineTo(108.4,-83.6).curveTo(108.6,-80.9,111.4,-78.9).curveTo(114.4,-76.8,118.6,-76.8).moveTo(157.4,-0.8).lineTo(157.4,-28.4).curveTo(157.6,-25.7,160.4,-23.7).curveTo(163.4,-21.6,167.6,-21.6).moveTo(108.4,34).lineTo(108.4,6.4).curveTo(108.6,9.1,111.4,11.1).curveTo(114.4,13.2,118.6,13.2).moveTo(48.4,-6).lineTo(48.4,-33.6).curveTo(48.6,-30.9,51.4,-28.9).curveTo(54.4,-26.8,58.6,-26.8).moveTo(38.4,88).lineTo(38.4,60.4).curveTo(38.6,63.1,41.4,65.1).curveTo(44.4,67.2,48.6,67.2).moveTo(101.4,122.8).lineTo(101.4,95.2).curveTo(101.5,97.9,104.4,99.9).curveTo(107.3,102,111.5,102).moveTo(214.3,46.8).lineTo(214.3,19.2).curveTo(214.4,21.9,217.3,23.9).curveTo(220.3,26,224.4,26).moveTo(-46.6,-173).lineTo(-46.6,-200.6).curveTo(-46.6,-197.9,-43.7,-195.9).curveTo(-40.8,-193.8,-36.6,-193.8).moveTo(-101.6,-151.6).lineTo(-101.6,-179.2).curveTo(-101.5,-176.5,-98.7,-174.5).curveTo(-95.8,-172.4,-91.5,-172.4).moveTo(-91.5,-71).lineTo(-91.5,-98.6).curveTo(-91.4,-95.9,-88.6,-93.9).curveTo(-85.6,-91.8,-81.4,-91.8).moveTo(-7.6,-116.8).lineTo(-7.6,-144.4).curveTo(-7.4,-141.7,-4.6,-139.7).curveTo(-1.6,-137.6,2.6,-137.6).moveTo(-254.5,-105.8).lineTo(-254.5,-133.4).curveTo(-254.4,-130.7,-251.6,-128.7).curveTo(-248.6,-126.6,-244.4,-126.6).moveTo(-191.5,-116).lineTo(-191.5,-143.6).curveTo(-191.4,-140.9,-188.6,-138.9).curveTo(-185.6,-136.8,-181.4,-136.8).moveTo(-211.6,-15).lineTo(-211.6,-42.6).curveTo(-211.5,-39.9,-208.7,-37.9).curveTo(-205.8,-35.8,-201.5,-35.8).moveTo(-155.5,106).lineTo(-155.5,78.3).curveTo(-155.4,81.1,-152.6,83.1).curveTo(-149.6,85.1,-145.4,85.1).moveTo(-7.6,-15).lineTo(-7.6,-42.6).curveTo(-7.4,-39.9,-4.6,-37.9).curveTo(-1.6,-35.8,2.6,-35.8).moveTo(-56.8,28.8).lineTo(-56.8,1.2).curveTo(-56.6,3.9,-53.8,5.9).curveTo(-50.8,8,-46.6,8).moveTo(-135.4,28.8).lineTo(-135.4,1.2).curveTo(-135.3,3.9,-132.5,5.9).curveTo(-129.5,8,-125.3,8).moveTo(-36.6,123).lineTo(-36.6,95.4).curveTo(-36.4,98.1,-33.6,100.1).curveTo(-30.6,102.2,-26.4,102.2).moveTo(108.4,186).lineTo(108.4,158.4).curveTo(108.6,161.1,111.4,163.1).curveTo(114.4,165.2,118.6,165.2).moveTo(18.4,214).lineTo(18.4,186.4).curveTo(18.6,189.1,21.4,191.1).curveTo(24.4,193.2,28.6,193.2);
	this.shape_78.setTransform(311.45,246.225);

	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.beginFill("#000000").beginStroke().moveTo(19.1,203.5).lineTo(18.5,201.2).curveTo(18.5,200.4,18.7,199.8).lineTo(18.7,199.7).lineTo(18.5,199.2).curveTo(18.5,196.8,20.1,195.4).curveTo(21.4,194.2,23.5,194.2).curveTo(25.6,194.2,26.9,195.4).curveTo(28.4,196.8,28.5,199.1).lineTo(28.5,199.4).lineTo(28.4,200.1).lineTo(28.5,201.1).lineTo(28.5,201.2).curveTo(28.5,202.8,27.5,204.2).curveTo(26.1,206.2,23.5,206.2).curveTo(20.2,206.2,19.1,203.5).closePath().moveTo(109.1,175.5).lineTo(108.5,173.2).curveTo(108.5,172.4,108.7,171.8).lineTo(108.7,171.7).lineTo(108.5,171.2).curveTo(108.5,168.8,110.1,167.4).curveTo(111.4,166.2,113.5,166.2).curveTo(115.6,166.2,116.9,167.4).curveTo(118.5,168.8,118.5,171.1).lineTo(118.5,171.4).lineTo(118.4,172.1).lineTo(118.5,173.1).lineTo(118.5,173.2).curveTo(118.5,174.8,117.5,176.2).curveTo(116.1,178.2,113.5,178.2).curveTo(110.2,178.2,109.1,175.5).closePath().moveTo(-36,112.5).lineTo(-36.5,110.2).curveTo(-36.5,109.4,-36.3,108.8).lineTo(-36.3,108.7).lineTo(-36.5,108.2).curveTo(-36.5,105.8,-34.9,104.4).curveTo(-33.6,103.2,-31.5,103.2).curveTo(-29.5,103.2,-28.1,104.4).curveTo(-26.6,105.8,-26.5,108.1).lineTo(-26.5,108.4).lineTo(-26.6,109.1).lineTo(-26.5,110.1).lineTo(-26.5,110.2).curveTo(-26.5,111.8,-27.5,113.2).curveTo(-28.9,115.2,-31.5,115.2).curveTo(-34.8,115.2,-36,112.5).closePath().moveTo(102,112.3).lineTo(101.4,110).curveTo(101.4,109.2,101.6,108.6).lineTo(101.6,108.5).lineTo(101.4,108).curveTo(101.5,105.6,103,104.2).curveTo(104.4,103,106.5,103).curveTo(108.5,103,109.9,104.2).curveTo(111.4,105.6,111.4,107.9).lineTo(111.4,108.2).lineTo(111.3,108.9).lineTo(111.4,109.9).lineTo(111.4,110).curveTo(111.5,111.6,110.4,113).curveTo(109.1,115,106.5,115).curveTo(103.2,115,102,112.3).closePath().moveTo(-155,95.4).lineTo(-155.5,93.2).curveTo(-155.5,92.4,-155.3,91.7).lineTo(-155.3,91.7).lineTo(-155.5,91.2).curveTo(-155.5,88.8,-154,87.4).curveTo(-152.6,86.1,-150.5,86.1).curveTo(-148.5,86.1,-147.1,87.4).curveTo(-145.6,88.7,-145.5,91).lineTo(-145.5,91.3).lineTo(-145.6,92.1).lineTo(-145.5,93).lineTo(-145.5,93.2).curveTo(-145.5,94.7,-146.5,96.2).curveTo(-147.9,98.2,-150.5,98.2).curveTo(-153.8,98.2,-155,95.4).closePath().moveTo(39.1,77.5).lineTo(38.5,75.2).curveTo(38.5,74.4,38.7,73.8).lineTo(38.7,73.7).lineTo(38.5,73.2).curveTo(38.5,70.8,40.1,69.4).curveTo(41.5,68.2,43.5,68.2).curveTo(45.5,68.2,47,69.4).curveTo(48.5,70.8,48.5,73.1).lineTo(48.5,73.4).lineTo(48.4,74.1).lineTo(48.5,75.1).lineTo(48.5,75.2).curveTo(48.5,76.8,47.5,78.2).curveTo(46.1,80.2,43.5,80.2).curveTo(40.3,80.2,39.1,77.5).closePath().moveTo(214.9,36.3).lineTo(214.4,34).curveTo(214.4,33.2,214.6,32.6).lineTo(214.6,32.5).lineTo(214.4,32).curveTo(214.4,29.6,215.9,28.2).curveTo(217.3,27,219.4,27).curveTo(221.4,27,222.9,28.2).curveTo(224.3,29.6,224.4,31.9).lineTo(224.4,32.2).lineTo(224.3,32.9).lineTo(224.4,33.9).lineTo(224.4,34).curveTo(224.4,35.6,223.4,37).curveTo(222,39,219.4,39).curveTo(216.1,39,214.9,36.3).closePath().moveTo(109.1,23.5).lineTo(108.5,21.2).curveTo(108.5,20.4,108.7,19.8).lineTo(108.7,19.7).lineTo(108.5,19.2).curveTo(108.5,16.8,110.1,15.4).curveTo(111.4,14.2,113.5,14.2).curveTo(115.6,14.2,116.9,15.4).curveTo(118.5,16.8,118.5,19.1).lineTo(118.5,19.4).lineTo(118.4,20.1).lineTo(118.5,21.1).lineTo(118.5,21.2).curveTo(118.5,22.8,117.5,24.2).curveTo(116.1,26.2,113.5,26.2).curveTo(110.2,26.2,109.1,23.5).closePath().moveTo(-56.1,18.3).lineTo(-56.7,16).curveTo(-56.7,15.2,-56.5,14.6).lineTo(-56.5,14.5).lineTo(-56.7,14).curveTo(-56.7,11.6,-55.2,10.2).curveTo(-53.7,9,-51.7,9).curveTo(-49.6,9,-48.2,10.2).curveTo(-46.7,11.6,-46.7,13.9).lineTo(-46.7,14.2).lineTo(-46.8,14.9).lineTo(-46.7,15.9).lineTo(-46.7,16).curveTo(-46.7,17.6,-47.7,19).curveTo(-49.1,21,-51.7,21).curveTo(-54.9,21,-56.1,18.3).closePath().moveTo(-134.8,18.3).lineTo(-135.4,16).curveTo(-135.4,15.2,-135.2,14.6).lineTo(-135.2,14.5).lineTo(-135.4,14).curveTo(-135.4,11.6,-133.8,10.2).curveTo(-132.5,9,-130.4,9).curveTo(-128.3,9,-127,10.2).curveTo(-125.4,11.6,-125.4,13.9).lineTo(-125.4,14.2).lineTo(-125.5,14.9).lineTo(-125.4,15.9).lineTo(-125.4,16).curveTo(-125.4,17.6,-126.4,19).curveTo(-127.8,21,-130.4,21).curveTo(-133.7,21,-134.8,18.3).closePath().moveTo(158,-11.3).lineTo(157.5,-13.6).curveTo(157.5,-14.4,157.7,-15).lineTo(157.7,-15.1).lineTo(157.5,-15.6).curveTo(157.5,-18,159,-19.4).curveTo(160.5,-20.6,162.5,-20.6).curveTo(164.6,-20.6,166,-19.4).curveTo(167.5,-18,167.5,-15.7).lineTo(167.5,-15.4).lineTo(167.4,-14.7).lineTo(167.5,-13.7).lineTo(167.5,-13.6).curveTo(167.5,-12,166.5,-10.6).curveTo(165.1,-8.6,162.5,-8.6).curveTo(159.3,-8.6,158,-11.3).closePath().moveTo(49.1,-16.5).lineTo(48.5,-18.8).curveTo(48.5,-19.6,48.7,-20.2).lineTo(48.7,-20.3).lineTo(48.5,-20.8).curveTo(48.5,-23.2,50,-24.6).curveTo(51.5,-25.8,53.5,-25.8).curveTo(55.6,-25.8,57,-24.6).curveTo(58.5,-23.2,58.5,-20.9).lineTo(58.5,-20.6).lineTo(58.4,-19.9).lineTo(58.5,-18.9).lineTo(58.5,-18.8).curveTo(58.5,-17.2,57.5,-15.8).curveTo(56.1,-13.8,53.5,-13.8).curveTo(50.3,-13.8,49.1,-16.5).closePath().moveTo(-6.9,-25.5).lineTo(-7.5,-27.8).curveTo(-7.5,-28.6,-7.3,-29.2).lineTo(-7.3,-29.3).lineTo(-7.5,-29.8).curveTo(-7.5,-32.2,-5.9,-33.6).curveTo(-4.5,-34.8,-2.5,-34.8).curveTo(-0.4,-34.8,0.9,-33.6).curveTo(2.5,-32.2,2.5,-29.9).lineTo(2.5,-29.6).lineTo(2.4,-28.9).lineTo(2.5,-27.9).lineTo(2.5,-27.8).curveTo(2.5,-26.2,1.5,-24.8).curveTo(0.1,-22.8,-2.5,-22.8).curveTo(-5.7,-22.8,-6.9,-25.5).closePath().moveTo(-211,-25.5).lineTo(-211.6,-27.8).curveTo(-211.6,-28.6,-211.4,-29.2).lineTo(-211.4,-29.3).lineTo(-211.6,-29.8).curveTo(-211.6,-32.2,-210.1,-33.6).curveTo(-208.6,-34.8,-206.6,-34.8).curveTo(-204.5,-34.8,-203.1,-33.6).curveTo(-201.6,-32.2,-201.6,-29.9).lineTo(-201.6,-29.6).lineTo(-201.7,-28.9).lineTo(-201.6,-27.9).lineTo(-201.6,-27.8).curveTo(-201.6,-26.2,-202.6,-24.8).curveTo(-204,-22.8,-206.6,-22.8).curveTo(-209.8,-22.8,-211,-25.5).closePath().moveTo(245.1,-43.8).lineTo(244.5,-46).curveTo(244.5,-46.8,244.7,-47.5).lineTo(244.7,-47.5).lineTo(244.5,-48).curveTo(244.5,-50.4,246.1,-51.8).curveTo(247.5,-53.1,249.5,-53.1).curveTo(251.6,-53.1,252.9,-51.8).curveTo(254.5,-50.5,254.5,-48.2).lineTo(254.5,-47.9).lineTo(254.4,-47.1).lineTo(254.5,-46.2).lineTo(254.5,-46).curveTo(254.5,-44.5,253.5,-43).curveTo(252.1,-41,249.5,-41).curveTo(246.3,-41,245.1,-43.8).closePath().moveTo(109.1,-66.5).lineTo(108.5,-68.8).curveTo(108.5,-69.6,108.7,-70.2).lineTo(108.7,-70.3).lineTo(108.5,-70.8).curveTo(108.5,-73.2,110.1,-74.6).curveTo(111.4,-75.8,113.5,-75.8).curveTo(115.6,-75.8,116.9,-74.6).curveTo(118.5,-73.2,118.5,-70.9).lineTo(118.5,-70.6).lineTo(118.4,-69.9).lineTo(118.5,-68.9).lineTo(118.5,-68.8).curveTo(118.5,-67.2,117.5,-65.8).curveTo(116.1,-63.8,113.5,-63.8).curveTo(110.2,-63.8,109.1,-66.5).closePath().moveTo(199.1,-74.5).lineTo(198.5,-76.8).curveTo(198.5,-77.6,198.7,-78.2).lineTo(198.7,-78.3).lineTo(198.5,-78.8).curveTo(198.5,-81.2,200.1,-82.6).curveTo(201.4,-83.8,203.5,-83.8).curveTo(205.6,-83.8,206.9,-82.6).curveTo(208.5,-81.2,208.5,-78.9).lineTo(208.5,-78.6).lineTo(208.4,-77.9).lineTo(208.5,-76.9).lineTo(208.5,-76.8).curveTo(208.5,-75.2,207.5,-73.8).curveTo(206.1,-71.8,203.5,-71.8).curveTo(200.2,-71.8,199.1,-74.5).closePath().moveTo(-91,-81.5).lineTo(-91.5,-83.8).curveTo(-91.5,-84.6,-91.3,-85.2).lineTo(-91.3,-85.3).lineTo(-91.5,-85.8).curveTo(-91.5,-88.2,-90,-89.6).curveTo(-88.6,-90.8,-86.5,-90.8).curveTo(-84.5,-90.8,-83.1,-89.6).curveTo(-81.6,-88.2,-81.5,-85.9).lineTo(-81.5,-85.6).lineTo(-81.6,-84.9).lineTo(-81.5,-83.9).lineTo(-81.5,-83.8).curveTo(-81.5,-82.2,-82.5,-80.8).curveTo(-83.9,-78.8,-86.5,-78.8).curveTo(-89.8,-78.8,-91,-81.5).closePath().moveTo(67.1,-92.5).lineTo(66.5,-94.8).curveTo(66.5,-95.6,66.7,-96.2).lineTo(66.7,-96.3).lineTo(66.5,-96.8).curveTo(66.5,-99.2,68,-100.6).curveTo(69.5,-101.8,71.5,-101.8).curveTo(73.6,-101.8,75,-100.6).curveTo(76.5,-99.2,76.5,-96.9).lineTo(76.5,-96.6).lineTo(76.4,-95.9).lineTo(76.5,-94.9).lineTo(76.5,-94.8).curveTo(76.5,-93.2,75.5,-91.8).curveTo(74.1,-89.8,71.5,-89.8).curveTo(68.3,-89.8,67.1,-92.5).closePath().moveTo(158,-94.5).lineTo(157.5,-96.8).curveTo(157.5,-97.6,157.7,-98.2).lineTo(157.7,-98.3).lineTo(157.5,-98.8).curveTo(157.5,-101.2,159,-102.6).curveTo(160.5,-103.8,162.5,-103.8).curveTo(164.6,-103.8,166,-102.6).curveTo(167.5,-101.2,167.5,-98.9).lineTo(167.5,-98.6).lineTo(167.4,-97.9).lineTo(167.5,-96.9).lineTo(167.5,-96.8).curveTo(167.5,-95.2,166.5,-93.8).curveTo(165.1,-91.8,162.5,-91.8).curveTo(159.3,-91.8,158,-94.5).closePath().moveTo(-254,-116.3).lineTo(-254.5,-118.6).curveTo(-254.5,-119.4,-254.3,-120).lineTo(-254.3,-120.1).lineTo(-254.5,-120.6).curveTo(-254.5,-123,-253,-124.4).curveTo(-251.6,-125.6,-249.5,-125.6).curveTo(-247.5,-125.6,-246.1,-124.4).curveTo(-244.6,-123,-244.5,-120.7).lineTo(-244.5,-120.4).lineTo(-244.6,-119.7).lineTo(-244.5,-118.7).lineTo(-244.5,-118.6).curveTo(-244.5,-117,-245.5,-115.6).curveTo(-246.9,-113.6,-249.5,-113.6).curveTo(-252.8,-113.6,-254,-116.3).closePath().moveTo(49.1,-126.5).lineTo(48.5,-128.8).curveTo(48.5,-129.6,48.7,-130.2).lineTo(48.7,-130.3).lineTo(48.5,-130.8).curveTo(48.5,-133.2,50,-134.6).curveTo(51.5,-135.8,53.5,-135.8).curveTo(55.6,-135.8,57,-134.6).curveTo(58.5,-133.2,58.5,-130.9).lineTo(58.5,-130.6).lineTo(58.4,-129.9).lineTo(58.5,-128.9).lineTo(58.5,-128.8).curveTo(58.5,-127.2,57.5,-125.8).curveTo(56.1,-123.8,53.5,-123.8).curveTo(50.3,-123.8,49.1,-126.5).closePath().moveTo(-191,-126.5).lineTo(-191.5,-128.8).curveTo(-191.5,-129.6,-191.3,-130.2).lineTo(-191.3,-130.3).lineTo(-191.5,-130.8).curveTo(-191.5,-133.2,-190,-134.6).curveTo(-188.6,-135.8,-186.5,-135.8).curveTo(-184.5,-135.8,-183.1,-134.6).curveTo(-181.6,-133.2,-181.5,-130.9).lineTo(-181.5,-130.6).lineTo(-181.6,-129.9).lineTo(-181.5,-128.9).lineTo(-181.5,-128.8).curveTo(-181.5,-127.2,-182.5,-125.8).curveTo(-183.9,-123.8,-186.5,-123.8).curveTo(-189.8,-123.8,-191,-126.5).closePath().moveTo(-6.9,-127.3).lineTo(-7.5,-129.6).curveTo(-7.5,-130.4,-7.3,-131).lineTo(-7.3,-131.1).lineTo(-7.5,-131.6).curveTo(-7.5,-134,-5.9,-135.4).curveTo(-4.5,-136.6,-2.5,-136.6).curveTo(-0.4,-136.6,0.9,-135.4).curveTo(2.5,-134,2.5,-131.7).lineTo(2.5,-131.4).lineTo(2.4,-130.7).lineTo(2.5,-129.7).lineTo(2.5,-129.6).curveTo(2.5,-128,1.5,-126.6).curveTo(0.1,-124.6,-2.5,-124.6).curveTo(-5.7,-124.6,-6.9,-127.3).closePath().moveTo(241,-130.5).lineTo(240.5,-132.8).curveTo(240.5,-133.6,240.7,-134.2).lineTo(240.7,-134.3).lineTo(240.5,-134.8).curveTo(240.5,-137.2,242,-138.6).curveTo(243.4,-139.8,245.5,-139.8).curveTo(247.5,-139.8,248.9,-138.6).curveTo(250.4,-137.2,250.5,-134.9).lineTo(250.5,-134.6).lineTo(250.4,-133.9).lineTo(250.5,-132.9).lineTo(250.5,-132.8).curveTo(250.5,-131.2,249.5,-129.8).curveTo(248.1,-127.8,245.5,-127.8).curveTo(242.2,-127.8,241,-130.5).closePath().moveTo(199.1,-137.5).lineTo(198.5,-139.8).curveTo(198.5,-140.6,198.7,-141.2).lineTo(198.7,-141.3).lineTo(198.5,-141.8).curveTo(198.5,-144.2,200.1,-145.6).curveTo(201.4,-146.8,203.5,-146.8).curveTo(205.6,-146.8,206.9,-145.6).curveTo(208.5,-144.2,208.5,-141.9).lineTo(208.5,-141.6).lineTo(208.4,-140.9).lineTo(208.5,-139.9).lineTo(208.5,-139.8).curveTo(208.5,-138.2,207.5,-136.8).curveTo(206.1,-134.8,203.5,-134.8).curveTo(200.2,-134.8,199.1,-137.5).closePath().moveTo(138.1,-161.2).lineTo(137.5,-163.4).curveTo(137.5,-164.2,137.7,-164.9).lineTo(137.7,-164.9).lineTo(137.5,-165.4).curveTo(137.5,-167.8,139.1,-169.2).curveTo(140.5,-170.5,142.5,-170.5).curveTo(144.5,-170.5,146,-169.2).curveTo(147.5,-167.9,147.5,-165.6).lineTo(147.5,-165.3).lineTo(147.4,-164.5).lineTo(147.5,-163.6).lineTo(147.5,-163.4).curveTo(147.5,-161.9,146.5,-160.4).curveTo(145.1,-158.4,142.5,-158.4).curveTo(139.3,-158.4,138.1,-161.2).closePath().moveTo(-101.1,-162.1).lineTo(-101.6,-164.4).curveTo(-101.6,-165.2,-101.4,-165.8).lineTo(-101.4,-165.9).lineTo(-101.6,-166.4).curveTo(-101.6,-168.8,-100.1,-170.2).curveTo(-98.7,-171.4,-96.6,-171.4).curveTo(-94.6,-171.4,-93.1,-170.2).curveTo(-91.7,-168.8,-91.6,-166.5).lineTo(-91.6,-166.2).lineTo(-91.7,-165.5).lineTo(-91.6,-164.5).lineTo(-91.6,-164.4).curveTo(-91.6,-162.8,-92.6,-161.4).curveTo(-94,-159.4,-96.6,-159.4).curveTo(-99.9,-159.4,-101.1,-162.1).closePath().moveTo(184.1,-179.5).lineTo(183.5,-181.8).curveTo(183.5,-182.6,183.7,-183.2).lineTo(183.7,-183.3).lineTo(183.5,-183.8).curveTo(183.5,-186.2,185,-187.6).curveTo(186.5,-188.8,188.5,-188.8).curveTo(190.6,-188.8,192,-187.6).curveTo(193.5,-186.2,193.5,-183.9).lineTo(193.5,-183.6).lineTo(193.4,-182.9).lineTo(193.5,-181.9).lineTo(193.5,-181.8).curveTo(193.5,-180.2,192.5,-178.8).curveTo(191.1,-176.8,188.5,-176.8).curveTo(185.3,-176.8,184.1,-179.5).closePath().moveTo(-46.1,-183.5).lineTo(-46.6,-185.8).curveTo(-46.6,-186.6,-46.4,-187.2).lineTo(-46.4,-187.3).lineTo(-46.6,-187.8).curveTo(-46.6,-190.2,-45.1,-191.6).curveTo(-43.7,-192.8,-41.6,-192.8).curveTo(-39.6,-192.8,-38.1,-191.6).curveTo(-36.7,-190.2,-36.6,-187.9).lineTo(-36.6,-187.6).lineTo(-36.7,-186.9).lineTo(-36.6,-185.9).lineTo(-36.6,-185.8).curveTo(-36.6,-184.2,-37.6,-182.8).curveTo(-39,-180.8,-41.6,-180.8).curveTo(-44.9,-180.8,-46.1,-183.5).closePath().moveTo(69.1,-191.6).lineTo(68.6,-193.8).curveTo(68.6,-194.6,68.8,-195.3).lineTo(68.8,-195.3).lineTo(68.6,-195.8).curveTo(68.6,-198.2,70.1,-199.6).curveTo(71.5,-200.9,73.6,-200.9).curveTo(75.6,-200.9,77,-199.6).curveTo(78.5,-198.3,78.6,-196).lineTo(78.6,-195.7).lineTo(78.5,-194.9).lineTo(78.6,-194).lineTo(78.6,-193.8).curveTo(78.6,-192.3,77.6,-190.8).curveTo(76.2,-188.8,73.6,-188.8).curveTo(70.3,-188.8,69.1,-191.6).closePath().moveTo(235.1,-196.9).lineTo(234.5,-199.2).curveTo(234.5,-200,234.7,-200.6).lineTo(234.7,-200.7).lineTo(234.5,-201.2).curveTo(234.5,-203.6,236.1,-205).curveTo(237.4,-206.2,239.5,-206.2).curveTo(241.5,-206.2,242.9,-205).curveTo(244.4,-203.6,244.5,-201.3).lineTo(244.5,-201).lineTo(244.4,-200.3).lineTo(244.5,-199.3).lineTo(244.5,-199.2).curveTo(244.5,-197.6,243.5,-196.2).curveTo(242.1,-194.2,239.5,-194.2).curveTo(236.2,-194.2,235.1,-196.9).closePath();
	this.shape_79.setTransform(301.4,261.175);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(234.4,-186.4).lineTo(234.4,-214).curveTo(234.6,-211.3,237.4,-209.3).curveTo(240.3,-207.2,244.6,-207.2).moveTo(183.4,-169).lineTo(183.4,-196.6).curveTo(183.6,-193.9,186.4,-191.9).curveTo(189.4,-189.8,193.6,-189.8).moveTo(198.4,-127).lineTo(198.4,-154.6).curveTo(198.6,-151.9,201.4,-149.9).curveTo(204.3,-147.8,208.6,-147.8).moveTo(240.4,-120).lineTo(240.4,-147.6).curveTo(240.6,-144.9,243.4,-142.9).curveTo(246.3,-140.8,250.6,-140.8).moveTo(198.4,-64).lineTo(198.4,-91.6).curveTo(198.6,-88.9,201.4,-86.9).curveTo(204.3,-84.8,208.6,-84.8).moveTo(244.4,-33.2).lineTo(244.4,-60.9).curveTo(244.6,-58.1,247.4,-56.1).curveTo(250.3,-54.1,254.6,-54.1).moveTo(137.4,-150.6).lineTo(137.4,-178.3).curveTo(137.6,-175.5,140.4,-173.5).curveTo(143.4,-171.5,147.6,-171.5).moveTo(68.6,-181).lineTo(68.6,-208.7).curveTo(68.7,-205.9,71.5,-203.9).curveTo(74.4,-201.9,78.7,-201.9).moveTo(66.4,-82).lineTo(66.4,-109.6).curveTo(66.6,-106.9,69.4,-104.9).curveTo(72.4,-102.8,76.6,-102.8).moveTo(48.4,-116).lineTo(48.4,-143.6).curveTo(48.6,-140.9,51.4,-138.9).curveTo(54.4,-136.8,58.6,-136.8).moveTo(157.4,-84).lineTo(157.4,-111.6).curveTo(157.6,-108.9,160.4,-106.9).curveTo(163.4,-104.8,167.6,-104.8).moveTo(108.4,-56).lineTo(108.4,-83.6).curveTo(108.6,-80.9,111.4,-78.9).curveTo(114.4,-76.8,118.6,-76.8).moveTo(157.4,-0.8).lineTo(157.4,-28.4).curveTo(157.6,-25.7,160.4,-23.7).curveTo(163.4,-21.6,167.6,-21.6).moveTo(108.4,34).lineTo(108.4,6.4).curveTo(108.6,9.1,111.4,11.1).curveTo(114.4,13.2,118.6,13.2).moveTo(48.4,-6).lineTo(48.4,-33.6).curveTo(48.6,-30.9,51.4,-28.9).curveTo(54.4,-26.8,58.6,-26.8).moveTo(38.4,88).lineTo(38.4,60.4).curveTo(38.6,63.1,41.4,65.1).curveTo(44.4,67.2,48.6,67.2).moveTo(101.4,122.8).lineTo(101.4,95.2).curveTo(101.5,97.9,104.4,99.9).curveTo(107.3,102,111.5,102).moveTo(214.3,46.8).lineTo(214.3,19.2).curveTo(214.4,21.9,217.3,23.9).curveTo(220.3,26,224.4,26).moveTo(-46.6,-173).lineTo(-46.6,-200.6).curveTo(-46.6,-197.9,-43.7,-195.9).curveTo(-40.8,-193.8,-36.6,-193.8).moveTo(-145.5,-177.3).lineTo(-145.5,-205).curveTo(-145.4,-202.2,-142.6,-200.2).curveTo(-139.6,-198.2,-135.4,-198.2).moveTo(-101.6,-151.6).lineTo(-101.6,-179.2).curveTo(-101.5,-176.5,-98.7,-174.5).curveTo(-95.8,-172.4,-91.5,-172.4).moveTo(-91.5,-71).lineTo(-91.5,-98.6).curveTo(-91.4,-95.9,-88.6,-93.9).curveTo(-85.6,-91.8,-81.4,-91.8).moveTo(-7.6,-116.8).lineTo(-7.6,-144.4).curveTo(-7.4,-141.7,-4.6,-139.7).curveTo(-1.6,-137.6,2.6,-137.6).moveTo(-254.5,-105.8).lineTo(-254.5,-133.4).curveTo(-254.4,-130.7,-251.6,-128.7).curveTo(-248.6,-126.6,-244.4,-126.6).moveTo(-191.5,-116).lineTo(-191.5,-143.6).curveTo(-191.4,-140.9,-188.6,-138.9).curveTo(-185.6,-136.8,-181.4,-136.8).moveTo(-211.6,-15).lineTo(-211.6,-42.6).curveTo(-211.5,-39.9,-208.7,-37.9).curveTo(-205.8,-35.8,-201.5,-35.8).moveTo(-155.5,106).lineTo(-155.5,78.3).curveTo(-155.4,81.1,-152.6,83.1).curveTo(-149.6,85.1,-145.4,85.1).moveTo(-7.6,-15).lineTo(-7.6,-42.6).curveTo(-7.4,-39.9,-4.6,-37.9).curveTo(-1.6,-35.8,2.6,-35.8).moveTo(-56.8,28.8).lineTo(-56.8,1.2).curveTo(-56.6,3.9,-53.8,5.9).curveTo(-50.8,8,-46.6,8).moveTo(-135.4,28.8).lineTo(-135.4,1.2).curveTo(-135.3,3.9,-132.5,5.9).curveTo(-129.5,8,-125.3,8).moveTo(-36.6,123).lineTo(-36.6,95.4).curveTo(-36.4,98.1,-33.6,100.1).curveTo(-30.6,102.2,-26.4,102.2).moveTo(108.4,186).lineTo(108.4,158.4).curveTo(108.6,161.1,111.4,163.1).curveTo(114.4,165.2,118.6,165.2).moveTo(18.4,214).lineTo(18.4,186.4).curveTo(18.6,189.1,21.4,191.1).curveTo(24.4,193.2,28.6,193.2);
	this.shape_80.setTransform(311.45,246.225);

	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.beginFill("#000000").beginStroke().moveTo(19.1,203.5).lineTo(18.5,201.2).curveTo(18.5,200.4,18.7,199.8).lineTo(18.7,199.7).lineTo(18.5,199.2).curveTo(18.5,196.8,20.1,195.4).curveTo(21.4,194.2,23.5,194.2).curveTo(25.6,194.2,26.9,195.4).curveTo(28.4,196.8,28.5,199.1).lineTo(28.5,199.4).lineTo(28.4,200.1).lineTo(28.5,201.1).lineTo(28.5,201.2).curveTo(28.5,202.8,27.5,204.2).curveTo(26.1,206.2,23.5,206.2).curveTo(20.2,206.2,19.1,203.5).closePath().moveTo(109.1,175.5).lineTo(108.5,173.2).curveTo(108.5,172.4,108.7,171.8).lineTo(108.7,171.7).lineTo(108.5,171.2).curveTo(108.5,168.8,110.1,167.4).curveTo(111.4,166.2,113.5,166.2).curveTo(115.6,166.2,116.9,167.4).curveTo(118.5,168.8,118.5,171.1).lineTo(118.5,171.4).lineTo(118.4,172.1).lineTo(118.5,173.1).lineTo(118.5,173.2).curveTo(118.5,174.8,117.5,176.2).curveTo(116.1,178.2,113.5,178.2).curveTo(110.2,178.2,109.1,175.5).closePath().moveTo(-36,112.5).lineTo(-36.5,110.2).curveTo(-36.5,109.4,-36.3,108.8).lineTo(-36.3,108.7).lineTo(-36.5,108.2).curveTo(-36.5,105.8,-34.9,104.4).curveTo(-33.6,103.2,-31.5,103.2).curveTo(-29.5,103.2,-28.1,104.4).curveTo(-26.6,105.8,-26.5,108.1).lineTo(-26.5,108.4).lineTo(-26.6,109.1).lineTo(-26.5,110.1).lineTo(-26.5,110.2).curveTo(-26.5,111.8,-27.5,113.2).curveTo(-28.9,115.2,-31.5,115.2).curveTo(-34.8,115.2,-36,112.5).closePath().moveTo(102,112.3).lineTo(101.4,110).curveTo(101.4,109.2,101.6,108.6).lineTo(101.6,108.5).lineTo(101.4,108).curveTo(101.5,105.6,103,104.2).curveTo(104.4,103,106.5,103).curveTo(108.5,103,109.9,104.2).curveTo(111.4,105.6,111.4,107.9).lineTo(111.4,108.2).lineTo(111.3,108.9).lineTo(111.4,109.9).lineTo(111.4,110).curveTo(111.5,111.6,110.4,113).curveTo(109.1,115,106.5,115).curveTo(103.2,115,102,112.3).closePath().moveTo(-155,95.4).lineTo(-155.5,93.2).curveTo(-155.5,92.4,-155.3,91.7).lineTo(-155.3,91.7).lineTo(-155.5,91.2).curveTo(-155.5,88.8,-154,87.4).curveTo(-152.6,86.1,-150.5,86.1).curveTo(-148.5,86.1,-147.1,87.4).curveTo(-145.6,88.7,-145.5,91).lineTo(-145.5,91.3).lineTo(-145.6,92.1).lineTo(-145.5,93).lineTo(-145.5,93.2).curveTo(-145.5,94.7,-146.5,96.2).curveTo(-147.9,98.2,-150.5,98.2).curveTo(-153.8,98.2,-155,95.4).closePath().moveTo(39.1,77.5).lineTo(38.5,75.2).curveTo(38.5,74.4,38.7,73.8).lineTo(38.7,73.7).lineTo(38.5,73.2).curveTo(38.5,70.8,40.1,69.4).curveTo(41.5,68.2,43.5,68.2).curveTo(45.5,68.2,47,69.4).curveTo(48.5,70.8,48.5,73.1).lineTo(48.5,73.4).lineTo(48.4,74.1).lineTo(48.5,75.1).lineTo(48.5,75.2).curveTo(48.5,76.8,47.5,78.2).curveTo(46.1,80.2,43.5,80.2).curveTo(40.3,80.2,39.1,77.5).closePath().moveTo(214.9,36.3).lineTo(214.4,34).curveTo(214.4,33.2,214.6,32.6).lineTo(214.6,32.5).lineTo(214.4,32).curveTo(214.4,29.6,215.9,28.2).curveTo(217.3,27,219.4,27).curveTo(221.4,27,222.9,28.2).curveTo(224.3,29.6,224.4,31.9).lineTo(224.4,32.2).lineTo(224.3,32.9).lineTo(224.4,33.9).lineTo(224.4,34).curveTo(224.4,35.6,223.4,37).curveTo(222,39,219.4,39).curveTo(216.1,39,214.9,36.3).closePath().moveTo(109.1,23.5).lineTo(108.5,21.2).curveTo(108.5,20.4,108.7,19.8).lineTo(108.7,19.7).lineTo(108.5,19.2).curveTo(108.5,16.8,110.1,15.4).curveTo(111.4,14.2,113.5,14.2).curveTo(115.6,14.2,116.9,15.4).curveTo(118.5,16.8,118.5,19.1).lineTo(118.5,19.4).lineTo(118.4,20.1).lineTo(118.5,21.1).lineTo(118.5,21.2).curveTo(118.5,22.8,117.5,24.2).curveTo(116.1,26.2,113.5,26.2).curveTo(110.2,26.2,109.1,23.5).closePath().moveTo(-56.1,18.3).lineTo(-56.7,16).curveTo(-56.7,15.2,-56.5,14.6).lineTo(-56.5,14.5).lineTo(-56.7,14).curveTo(-56.7,11.6,-55.2,10.2).curveTo(-53.7,9,-51.7,9).curveTo(-49.6,9,-48.2,10.2).curveTo(-46.7,11.6,-46.7,13.9).lineTo(-46.7,14.2).lineTo(-46.8,14.9).lineTo(-46.7,15.9).lineTo(-46.7,16).curveTo(-46.7,17.6,-47.7,19).curveTo(-49.1,21,-51.7,21).curveTo(-54.9,21,-56.1,18.3).closePath().moveTo(-134.8,18.3).lineTo(-135.4,16).curveTo(-135.4,15.2,-135.2,14.6).lineTo(-135.2,14.5).lineTo(-135.4,14).curveTo(-135.4,11.6,-133.8,10.2).curveTo(-132.5,9,-130.4,9).curveTo(-128.3,9,-127,10.2).curveTo(-125.4,11.6,-125.4,13.9).lineTo(-125.4,14.2).lineTo(-125.5,14.9).lineTo(-125.4,15.9).lineTo(-125.4,16).curveTo(-125.4,17.6,-126.4,19).curveTo(-127.8,21,-130.4,21).curveTo(-133.7,21,-134.8,18.3).closePath().moveTo(158,-11.3).lineTo(157.5,-13.6).curveTo(157.5,-14.4,157.7,-15).lineTo(157.7,-15.1).lineTo(157.5,-15.6).curveTo(157.5,-18,159,-19.4).curveTo(160.5,-20.6,162.5,-20.6).curveTo(164.6,-20.6,166,-19.4).curveTo(167.5,-18,167.5,-15.7).lineTo(167.5,-15.4).lineTo(167.4,-14.7).lineTo(167.5,-13.7).lineTo(167.5,-13.6).curveTo(167.5,-12,166.5,-10.6).curveTo(165.1,-8.6,162.5,-8.6).curveTo(159.3,-8.6,158,-11.3).closePath().moveTo(49.1,-16.5).lineTo(48.5,-18.8).curveTo(48.5,-19.6,48.7,-20.2).lineTo(48.7,-20.3).lineTo(48.5,-20.8).curveTo(48.5,-23.2,50,-24.6).curveTo(51.5,-25.8,53.5,-25.8).curveTo(55.6,-25.8,57,-24.6).curveTo(58.5,-23.2,58.5,-20.9).lineTo(58.5,-20.6).lineTo(58.4,-19.9).lineTo(58.5,-18.9).lineTo(58.5,-18.8).curveTo(58.5,-17.2,57.5,-15.8).curveTo(56.1,-13.8,53.5,-13.8).curveTo(50.3,-13.8,49.1,-16.5).closePath().moveTo(-6.9,-25.5).lineTo(-7.5,-27.8).curveTo(-7.5,-28.6,-7.3,-29.2).lineTo(-7.3,-29.3).lineTo(-7.5,-29.8).curveTo(-7.5,-32.2,-5.9,-33.6).curveTo(-4.5,-34.8,-2.5,-34.8).curveTo(-0.4,-34.8,0.9,-33.6).curveTo(2.5,-32.2,2.5,-29.9).lineTo(2.5,-29.6).lineTo(2.4,-28.9).lineTo(2.5,-27.9).lineTo(2.5,-27.8).curveTo(2.5,-26.2,1.5,-24.8).curveTo(0.1,-22.8,-2.5,-22.8).curveTo(-5.7,-22.8,-6.9,-25.5).closePath().moveTo(-211,-25.5).lineTo(-211.6,-27.8).curveTo(-211.6,-28.6,-211.4,-29.2).lineTo(-211.4,-29.3).lineTo(-211.6,-29.8).curveTo(-211.6,-32.2,-210.1,-33.6).curveTo(-208.6,-34.8,-206.6,-34.8).curveTo(-204.5,-34.8,-203.1,-33.6).curveTo(-201.6,-32.2,-201.6,-29.9).lineTo(-201.6,-29.6).lineTo(-201.7,-28.9).lineTo(-201.6,-27.9).lineTo(-201.6,-27.8).curveTo(-201.6,-26.2,-202.6,-24.8).curveTo(-204,-22.8,-206.6,-22.8).curveTo(-209.8,-22.8,-211,-25.5).closePath().moveTo(245.1,-43.8).lineTo(244.5,-46).curveTo(244.5,-46.8,244.7,-47.5).lineTo(244.7,-47.5).lineTo(244.5,-48).curveTo(244.5,-50.4,246.1,-51.8).curveTo(247.5,-53.1,249.5,-53.1).curveTo(251.6,-53.1,252.9,-51.8).curveTo(254.5,-50.5,254.5,-48.2).lineTo(254.5,-47.9).lineTo(254.4,-47.1).lineTo(254.5,-46.2).lineTo(254.5,-46).curveTo(254.5,-44.5,253.5,-43).curveTo(252.1,-41,249.5,-41).curveTo(246.3,-41,245.1,-43.8).closePath().moveTo(109.1,-66.5).lineTo(108.5,-68.8).curveTo(108.5,-69.6,108.7,-70.2).lineTo(108.7,-70.3).lineTo(108.5,-70.8).curveTo(108.5,-73.2,110.1,-74.6).curveTo(111.4,-75.8,113.5,-75.8).curveTo(115.6,-75.8,116.9,-74.6).curveTo(118.5,-73.2,118.5,-70.9).lineTo(118.5,-70.6).lineTo(118.4,-69.9).lineTo(118.5,-68.9).lineTo(118.5,-68.8).curveTo(118.5,-67.2,117.5,-65.8).curveTo(116.1,-63.8,113.5,-63.8).curveTo(110.2,-63.8,109.1,-66.5).closePath().moveTo(199.1,-74.5).lineTo(198.5,-76.8).curveTo(198.5,-77.6,198.7,-78.2).lineTo(198.7,-78.3).lineTo(198.5,-78.8).curveTo(198.5,-81.2,200.1,-82.6).curveTo(201.4,-83.8,203.5,-83.8).curveTo(205.6,-83.8,206.9,-82.6).curveTo(208.5,-81.2,208.5,-78.9).lineTo(208.5,-78.6).lineTo(208.4,-77.9).lineTo(208.5,-76.9).lineTo(208.5,-76.8).curveTo(208.5,-75.2,207.5,-73.8).curveTo(206.1,-71.8,203.5,-71.8).curveTo(200.2,-71.8,199.1,-74.5).closePath().moveTo(-91,-81.5).lineTo(-91.5,-83.8).curveTo(-91.5,-84.6,-91.3,-85.2).lineTo(-91.3,-85.3).lineTo(-91.5,-85.8).curveTo(-91.5,-88.2,-90,-89.6).curveTo(-88.6,-90.8,-86.5,-90.8).curveTo(-84.5,-90.8,-83.1,-89.6).curveTo(-81.6,-88.2,-81.5,-85.9).lineTo(-81.5,-85.6).lineTo(-81.6,-84.9).lineTo(-81.5,-83.9).lineTo(-81.5,-83.8).curveTo(-81.5,-82.2,-82.5,-80.8).curveTo(-83.9,-78.8,-86.5,-78.8).curveTo(-89.8,-78.8,-91,-81.5).closePath().moveTo(67.1,-92.5).lineTo(66.5,-94.8).curveTo(66.5,-95.6,66.7,-96.2).lineTo(66.7,-96.3).lineTo(66.5,-96.8).curveTo(66.5,-99.2,68,-100.6).curveTo(69.5,-101.8,71.5,-101.8).curveTo(73.6,-101.8,75,-100.6).curveTo(76.5,-99.2,76.5,-96.9).lineTo(76.5,-96.6).lineTo(76.4,-95.9).lineTo(76.5,-94.9).lineTo(76.5,-94.8).curveTo(76.5,-93.2,75.5,-91.8).curveTo(74.1,-89.8,71.5,-89.8).curveTo(68.3,-89.8,67.1,-92.5).closePath().moveTo(158,-94.5).lineTo(157.5,-96.8).curveTo(157.5,-97.6,157.7,-98.2).lineTo(157.7,-98.3).lineTo(157.5,-98.8).curveTo(157.5,-101.2,159,-102.6).curveTo(160.5,-103.8,162.5,-103.8).curveTo(164.6,-103.8,166,-102.6).curveTo(167.5,-101.2,167.5,-98.9).lineTo(167.5,-98.6).lineTo(167.4,-97.9).lineTo(167.5,-96.9).lineTo(167.5,-96.8).curveTo(167.5,-95.2,166.5,-93.8).curveTo(165.1,-91.8,162.5,-91.8).curveTo(159.3,-91.8,158,-94.5).closePath().moveTo(-254,-116.3).lineTo(-254.5,-118.6).curveTo(-254.5,-119.4,-254.3,-120).lineTo(-254.3,-120.1).lineTo(-254.5,-120.6).curveTo(-254.5,-123,-253,-124.4).curveTo(-251.6,-125.6,-249.5,-125.6).curveTo(-247.5,-125.6,-246.1,-124.4).curveTo(-244.6,-123,-244.5,-120.7).lineTo(-244.5,-120.4).lineTo(-244.6,-119.7).lineTo(-244.5,-118.7).lineTo(-244.5,-118.6).curveTo(-244.5,-117,-245.5,-115.6).curveTo(-246.9,-113.6,-249.5,-113.6).curveTo(-252.8,-113.6,-254,-116.3).closePath().moveTo(49.1,-126.5).lineTo(48.5,-128.8).curveTo(48.5,-129.6,48.7,-130.2).lineTo(48.7,-130.3).lineTo(48.5,-130.8).curveTo(48.5,-133.2,50,-134.6).curveTo(51.5,-135.8,53.5,-135.8).curveTo(55.6,-135.8,57,-134.6).curveTo(58.5,-133.2,58.5,-130.9).lineTo(58.5,-130.6).lineTo(58.4,-129.9).lineTo(58.5,-128.9).lineTo(58.5,-128.8).curveTo(58.5,-127.2,57.5,-125.8).curveTo(56.1,-123.8,53.5,-123.8).curveTo(50.3,-123.8,49.1,-126.5).closePath().moveTo(-191,-126.5).lineTo(-191.5,-128.8).curveTo(-191.5,-129.6,-191.3,-130.2).lineTo(-191.3,-130.3).lineTo(-191.5,-130.8).curveTo(-191.5,-133.2,-190,-134.6).curveTo(-188.6,-135.8,-186.5,-135.8).curveTo(-184.5,-135.8,-183.1,-134.6).curveTo(-181.6,-133.2,-181.5,-130.9).lineTo(-181.5,-130.6).lineTo(-181.6,-129.9).lineTo(-181.5,-128.9).lineTo(-181.5,-128.8).curveTo(-181.5,-127.2,-182.5,-125.8).curveTo(-183.9,-123.8,-186.5,-123.8).curveTo(-189.8,-123.8,-191,-126.5).closePath().moveTo(-6.9,-127.3).lineTo(-7.5,-129.6).curveTo(-7.5,-130.4,-7.3,-131).lineTo(-7.3,-131.1).lineTo(-7.5,-131.6).curveTo(-7.5,-134,-5.9,-135.4).curveTo(-4.5,-136.6,-2.5,-136.6).curveTo(-0.4,-136.6,0.9,-135.4).curveTo(2.5,-134,2.5,-131.7).lineTo(2.5,-131.4).lineTo(2.4,-130.7).lineTo(2.5,-129.7).lineTo(2.5,-129.6).curveTo(2.5,-128,1.5,-126.6).curveTo(0.1,-124.6,-2.5,-124.6).curveTo(-5.7,-124.6,-6.9,-127.3).closePath().moveTo(241,-130.5).lineTo(240.5,-132.8).curveTo(240.5,-133.6,240.7,-134.2).lineTo(240.7,-134.3).lineTo(240.5,-134.8).curveTo(240.5,-137.2,242,-138.6).curveTo(243.4,-139.8,245.5,-139.8).curveTo(247.5,-139.8,248.9,-138.6).curveTo(250.4,-137.2,250.5,-134.9).lineTo(250.5,-134.6).lineTo(250.4,-133.9).lineTo(250.5,-132.9).lineTo(250.5,-132.8).curveTo(250.5,-131.2,249.5,-129.8).curveTo(248.1,-127.8,245.5,-127.8).curveTo(242.2,-127.8,241,-130.5).closePath().moveTo(199.1,-137.5).lineTo(198.5,-139.8).curveTo(198.5,-140.6,198.7,-141.2).lineTo(198.7,-141.3).lineTo(198.5,-141.8).curveTo(198.5,-144.2,200.1,-145.6).curveTo(201.4,-146.8,203.5,-146.8).curveTo(205.6,-146.8,206.9,-145.6).curveTo(208.5,-144.2,208.5,-141.9).lineTo(208.5,-141.6).lineTo(208.4,-140.9).lineTo(208.5,-139.9).lineTo(208.5,-139.8).curveTo(208.5,-138.2,207.5,-136.8).curveTo(206.1,-134.8,203.5,-134.8).curveTo(200.2,-134.8,199.1,-137.5).closePath().moveTo(138.1,-161.2).lineTo(137.5,-163.4).curveTo(137.5,-164.2,137.7,-164.9).lineTo(137.7,-164.9).lineTo(137.5,-165.4).curveTo(137.5,-167.8,139.1,-169.2).curveTo(140.5,-170.5,142.5,-170.5).curveTo(144.5,-170.5,146,-169.2).curveTo(147.5,-167.9,147.5,-165.6).lineTo(147.5,-165.3).lineTo(147.4,-164.5).lineTo(147.5,-163.6).lineTo(147.5,-163.4).curveTo(147.5,-161.9,146.5,-160.4).curveTo(145.1,-158.4,142.5,-158.4).curveTo(139.3,-158.4,138.1,-161.2).closePath().moveTo(-101.1,-162.1).lineTo(-101.6,-164.4).curveTo(-101.6,-165.2,-101.4,-165.8).lineTo(-101.4,-165.9).lineTo(-101.6,-166.4).curveTo(-101.6,-168.8,-100.1,-170.2).curveTo(-98.7,-171.4,-96.6,-171.4).curveTo(-94.6,-171.4,-93.1,-170.2).curveTo(-91.7,-168.8,-91.6,-166.5).lineTo(-91.6,-166.2).lineTo(-91.7,-165.5).lineTo(-91.6,-164.5).lineTo(-91.6,-164.4).curveTo(-91.6,-162.8,-92.6,-161.4).curveTo(-94,-159.4,-96.6,-159.4).curveTo(-99.9,-159.4,-101.1,-162.1).closePath().moveTo(184.1,-179.5).lineTo(183.5,-181.8).curveTo(183.5,-182.6,183.7,-183.2).lineTo(183.7,-183.3).lineTo(183.5,-183.8).curveTo(183.5,-186.2,185,-187.6).curveTo(186.5,-188.8,188.5,-188.8).curveTo(190.6,-188.8,192,-187.6).curveTo(193.5,-186.2,193.5,-183.9).lineTo(193.5,-183.6).lineTo(193.4,-182.9).lineTo(193.5,-181.9).lineTo(193.5,-181.8).curveTo(193.5,-180.2,192.5,-178.8).curveTo(191.1,-176.8,188.5,-176.8).curveTo(185.3,-176.8,184.1,-179.5).closePath().moveTo(-46.1,-183.5).lineTo(-46.6,-185.8).curveTo(-46.6,-186.6,-46.4,-187.2).lineTo(-46.4,-187.3).lineTo(-46.6,-187.8).curveTo(-46.6,-190.2,-45.1,-191.6).curveTo(-43.7,-192.8,-41.6,-192.8).curveTo(-39.6,-192.8,-38.1,-191.6).curveTo(-36.7,-190.2,-36.6,-187.9).lineTo(-36.6,-187.6).lineTo(-36.7,-186.9).lineTo(-36.6,-185.9).lineTo(-36.6,-185.8).curveTo(-36.6,-184.2,-37.6,-182.8).curveTo(-39,-180.8,-41.6,-180.8).curveTo(-44.9,-180.8,-46.1,-183.5).closePath().moveTo(-145,-187.9).lineTo(-145.5,-190.1).curveTo(-145.5,-190.9,-145.3,-191.6).lineTo(-145.3,-191.6).lineTo(-145.5,-192.1).curveTo(-145.5,-194.5,-144,-195.9).curveTo(-142.6,-197.2,-140.5,-197.2).curveTo(-138.5,-197.2,-137.1,-195.9).curveTo(-135.6,-194.6,-135.5,-192.3).lineTo(-135.5,-192).lineTo(-135.6,-191.2).lineTo(-135.5,-190.3).lineTo(-135.5,-190.1).curveTo(-135.5,-188.6,-136.5,-187.1).curveTo(-137.9,-185.1,-140.5,-185.1).curveTo(-143.8,-185.1,-145,-187.9).closePath().moveTo(69.1,-191.6).lineTo(68.6,-193.8).curveTo(68.6,-194.6,68.8,-195.3).lineTo(68.8,-195.3).lineTo(68.6,-195.8).curveTo(68.6,-198.2,70.1,-199.6).curveTo(71.5,-200.9,73.6,-200.9).curveTo(75.6,-200.9,77,-199.6).curveTo(78.5,-198.3,78.6,-196).lineTo(78.6,-195.7).lineTo(78.5,-194.9).lineTo(78.6,-194).lineTo(78.6,-193.8).curveTo(78.6,-192.3,77.6,-190.8).curveTo(76.2,-188.8,73.6,-188.8).curveTo(70.3,-188.8,69.1,-191.6).closePath().moveTo(235.1,-196.9).lineTo(234.5,-199.2).curveTo(234.5,-200,234.7,-200.6).lineTo(234.7,-200.7).lineTo(234.5,-201.2).curveTo(234.5,-203.6,236.1,-205).curveTo(237.4,-206.2,239.5,-206.2).curveTo(241.5,-206.2,242.9,-205).curveTo(244.4,-203.6,244.5,-201.3).lineTo(244.5,-201).lineTo(244.4,-200.3).lineTo(244.5,-199.3).lineTo(244.5,-199.2).curveTo(244.5,-197.6,243.5,-196.2).curveTo(242.1,-194.2,239.5,-194.2).curveTo(236.2,-194.2,235.1,-196.9).closePath();
	this.shape_81.setTransform(301.4,261.175);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(234.4,-186.4).lineTo(234.4,-214).curveTo(234.6,-211.3,237.4,-209.3).curveTo(240.3,-207.2,244.6,-207.2).moveTo(183.4,-169).lineTo(183.4,-196.6).curveTo(183.6,-193.9,186.4,-191.9).curveTo(189.4,-189.8,193.6,-189.8).moveTo(198.4,-127).lineTo(198.4,-154.6).curveTo(198.6,-151.9,201.4,-149.9).curveTo(204.3,-147.8,208.6,-147.8).moveTo(240.4,-120).lineTo(240.4,-147.6).curveTo(240.6,-144.9,243.4,-142.9).curveTo(246.3,-140.8,250.6,-140.8).moveTo(198.4,-64).lineTo(198.4,-91.6).curveTo(198.6,-88.9,201.4,-86.9).curveTo(204.3,-84.8,208.6,-84.8).moveTo(244.4,-33.2).lineTo(244.4,-60.9).curveTo(244.6,-58.1,247.4,-56.1).curveTo(250.3,-54.1,254.6,-54.1).moveTo(137.4,-150.6).lineTo(137.4,-178.3).curveTo(137.6,-175.5,140.4,-173.5).curveTo(143.4,-171.5,147.6,-171.5).moveTo(68.6,-181).lineTo(68.6,-208.7).curveTo(68.7,-205.9,71.5,-203.9).curveTo(74.4,-201.9,78.7,-201.9).moveTo(66.4,-82).lineTo(66.4,-109.6).curveTo(66.6,-106.9,69.4,-104.9).curveTo(72.4,-102.8,76.6,-102.8).moveTo(48.4,-116).lineTo(48.4,-143.6).curveTo(48.6,-140.9,51.4,-138.9).curveTo(54.4,-136.8,58.6,-136.8).moveTo(157.4,-84).lineTo(157.4,-111.6).curveTo(157.6,-108.9,160.4,-106.9).curveTo(163.4,-104.8,167.6,-104.8).moveTo(108.4,-56).lineTo(108.4,-83.6).curveTo(108.6,-80.9,111.4,-78.9).curveTo(114.4,-76.8,118.6,-76.8).moveTo(157.4,-0.8).lineTo(157.4,-28.4).curveTo(157.6,-25.7,160.4,-23.7).curveTo(163.4,-21.6,167.6,-21.6).moveTo(108.4,34).lineTo(108.4,6.4).curveTo(108.6,9.1,111.4,11.1).curveTo(114.4,13.2,118.6,13.2).moveTo(157.4,66).lineTo(157.4,38.4).curveTo(157.6,41.1,160.4,43.1).curveTo(163.4,45.2,167.6,45.2).moveTo(48.4,-6).lineTo(48.4,-33.6).curveTo(48.6,-30.9,51.4,-28.9).curveTo(54.4,-26.8,58.6,-26.8).moveTo(38.4,88).lineTo(38.4,60.4).curveTo(38.6,63.1,41.4,65.1).curveTo(44.4,67.2,48.6,67.2).moveTo(101.4,122.8).lineTo(101.4,95.2).curveTo(101.5,97.9,104.4,99.9).curveTo(107.3,102,111.5,102).moveTo(214.3,46.8).lineTo(214.3,19.2).curveTo(214.4,21.9,217.3,23.9).curveTo(220.3,26,224.4,26).moveTo(-46.6,-173).lineTo(-46.6,-200.6).curveTo(-46.6,-197.9,-43.7,-195.9).curveTo(-40.8,-193.8,-36.6,-193.8).moveTo(-145.5,-177.3).lineTo(-145.5,-205).curveTo(-145.4,-202.2,-142.6,-200.2).curveTo(-139.6,-198.2,-135.4,-198.2).moveTo(-101.6,-151.6).lineTo(-101.6,-179.2).curveTo(-101.5,-176.5,-98.7,-174.5).curveTo(-95.8,-172.4,-91.5,-172.4).moveTo(-91.5,-71).lineTo(-91.5,-98.6).curveTo(-91.4,-95.9,-88.6,-93.9).curveTo(-85.6,-91.8,-81.4,-91.8).moveTo(-7.6,-116.8).lineTo(-7.6,-144.4).curveTo(-7.4,-141.7,-4.6,-139.7).curveTo(-1.6,-137.6,2.6,-137.6).moveTo(-254.5,-105.8).lineTo(-254.5,-133.4).curveTo(-254.4,-130.7,-251.6,-128.7).curveTo(-248.6,-126.6,-244.4,-126.6).moveTo(-191.5,-116).lineTo(-191.5,-143.6).curveTo(-191.4,-140.9,-188.6,-138.9).curveTo(-185.6,-136.8,-181.4,-136.8).moveTo(-211.6,-15).lineTo(-211.6,-42.6).curveTo(-211.5,-39.9,-208.7,-37.9).curveTo(-205.8,-35.8,-201.5,-35.8).moveTo(-155.5,106).lineTo(-155.5,78.3).curveTo(-155.4,81.1,-152.6,83.1).curveTo(-149.6,85.1,-145.4,85.1).moveTo(-7.6,-15).lineTo(-7.6,-42.6).curveTo(-7.4,-39.9,-4.6,-37.9).curveTo(-1.6,-35.8,2.6,-35.8).moveTo(-56.8,28.8).lineTo(-56.8,1.2).curveTo(-56.6,3.9,-53.8,5.9).curveTo(-50.8,8,-46.6,8).moveTo(-135.4,28.8).lineTo(-135.4,1.2).curveTo(-135.3,3.9,-132.5,5.9).curveTo(-129.5,8,-125.3,8).moveTo(-36.6,123).lineTo(-36.6,95.4).curveTo(-36.4,98.1,-33.6,100.1).curveTo(-30.6,102.2,-26.4,102.2).moveTo(108.4,186).lineTo(108.4,158.4).curveTo(108.6,161.1,111.4,163.1).curveTo(114.4,165.2,118.6,165.2).moveTo(18.4,214).lineTo(18.4,186.4).curveTo(18.6,189.1,21.4,191.1).curveTo(24.4,193.2,28.6,193.2);
	this.shape_82.setTransform(311.45,246.225);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.beginFill("#000000").beginStroke().moveTo(19.1,203.5).lineTo(18.5,201.2).curveTo(18.5,200.4,18.7,199.8).lineTo(18.7,199.7).lineTo(18.5,199.2).curveTo(18.5,196.8,20.1,195.4).curveTo(21.4,194.2,23.5,194.2).curveTo(25.6,194.2,26.9,195.4).curveTo(28.4,196.8,28.5,199.1).lineTo(28.5,199.4).lineTo(28.4,200.1).lineTo(28.5,201.1).lineTo(28.5,201.2).curveTo(28.5,202.8,27.5,204.2).curveTo(26.1,206.2,23.5,206.2).curveTo(20.2,206.2,19.1,203.5).closePath().moveTo(109.1,175.5).lineTo(108.5,173.2).curveTo(108.5,172.4,108.7,171.8).lineTo(108.7,171.7).lineTo(108.5,171.2).curveTo(108.5,168.8,110.1,167.4).curveTo(111.4,166.2,113.5,166.2).curveTo(115.6,166.2,116.9,167.4).curveTo(118.5,168.8,118.5,171.1).lineTo(118.5,171.4).lineTo(118.4,172.1).lineTo(118.5,173.1).lineTo(118.5,173.2).curveTo(118.5,174.8,117.5,176.2).curveTo(116.1,178.2,113.5,178.2).curveTo(110.2,178.2,109.1,175.5).closePath().moveTo(-36,112.5).lineTo(-36.5,110.2).curveTo(-36.5,109.4,-36.3,108.8).lineTo(-36.3,108.7).lineTo(-36.5,108.2).curveTo(-36.5,105.8,-34.9,104.4).curveTo(-33.6,103.2,-31.5,103.2).curveTo(-29.5,103.2,-28.1,104.4).curveTo(-26.6,105.8,-26.5,108.1).lineTo(-26.5,108.4).lineTo(-26.6,109.1).lineTo(-26.5,110.1).lineTo(-26.5,110.2).curveTo(-26.5,111.8,-27.5,113.2).curveTo(-28.9,115.2,-31.5,115.2).curveTo(-34.8,115.2,-36,112.5).closePath().moveTo(102,112.3).lineTo(101.4,110).curveTo(101.4,109.2,101.6,108.6).lineTo(101.6,108.5).lineTo(101.4,108).curveTo(101.5,105.6,103,104.2).curveTo(104.4,103,106.5,103).curveTo(108.5,103,109.9,104.2).curveTo(111.4,105.6,111.4,107.9).lineTo(111.4,108.2).lineTo(111.3,108.9).lineTo(111.4,109.9).lineTo(111.4,110).curveTo(111.5,111.6,110.4,113).curveTo(109.1,115,106.5,115).curveTo(103.2,115,102,112.3).closePath().moveTo(-155,95.4).lineTo(-155.5,93.2).curveTo(-155.5,92.4,-155.3,91.7).lineTo(-155.3,91.7).lineTo(-155.5,91.2).curveTo(-155.5,88.8,-154,87.4).curveTo(-152.6,86.1,-150.5,86.1).curveTo(-148.5,86.1,-147.1,87.4).curveTo(-145.6,88.7,-145.5,91).lineTo(-145.5,91.3).lineTo(-145.6,92.1).lineTo(-145.5,93).lineTo(-145.5,93.2).curveTo(-145.5,94.7,-146.5,96.2).curveTo(-147.9,98.2,-150.5,98.2).curveTo(-153.8,98.2,-155,95.4).closePath().moveTo(39.1,77.5).lineTo(38.5,75.2).curveTo(38.5,74.4,38.7,73.8).lineTo(38.7,73.7).lineTo(38.5,73.2).curveTo(38.5,70.8,40.1,69.4).curveTo(41.5,68.2,43.5,68.2).curveTo(45.5,68.2,47,69.4).curveTo(48.5,70.8,48.5,73.1).lineTo(48.5,73.4).lineTo(48.4,74.1).lineTo(48.5,75.1).lineTo(48.5,75.2).curveTo(48.5,76.8,47.5,78.2).curveTo(46.1,80.2,43.5,80.2).curveTo(40.3,80.2,39.1,77.5).closePath().moveTo(158,55.5).lineTo(157.5,53.2).curveTo(157.5,52.4,157.7,51.8).lineTo(157.7,51.7).lineTo(157.5,51.2).curveTo(157.5,48.8,159,47.4).curveTo(160.5,46.2,162.5,46.2).curveTo(164.6,46.2,166,47.4).curveTo(167.5,48.8,167.5,51.1).lineTo(167.5,51.4).lineTo(167.4,52.1).lineTo(167.5,53.1).lineTo(167.5,53.2).curveTo(167.5,54.8,166.5,56.2).curveTo(165.1,58.2,162.5,58.2).curveTo(159.3,58.2,158,55.5).closePath().moveTo(214.9,36.3).lineTo(214.4,34).curveTo(214.4,33.2,214.6,32.6).lineTo(214.6,32.5).lineTo(214.4,32).curveTo(214.4,29.6,215.9,28.2).curveTo(217.3,27,219.4,27).curveTo(221.4,27,222.9,28.2).curveTo(224.3,29.6,224.4,31.9).lineTo(224.4,32.2).lineTo(224.3,32.9).lineTo(224.4,33.9).lineTo(224.4,34).curveTo(224.4,35.6,223.4,37).curveTo(222,39,219.4,39).curveTo(216.1,39,214.9,36.3).closePath().moveTo(109.1,23.5).lineTo(108.5,21.2).curveTo(108.5,20.4,108.7,19.8).lineTo(108.7,19.7).lineTo(108.5,19.2).curveTo(108.5,16.8,110.1,15.4).curveTo(111.4,14.2,113.5,14.2).curveTo(115.6,14.2,116.9,15.4).curveTo(118.5,16.8,118.5,19.1).lineTo(118.5,19.4).lineTo(118.4,20.1).lineTo(118.5,21.1).lineTo(118.5,21.2).curveTo(118.5,22.8,117.5,24.2).curveTo(116.1,26.2,113.5,26.2).curveTo(110.2,26.2,109.1,23.5).closePath().moveTo(-56.1,18.3).lineTo(-56.7,16).curveTo(-56.7,15.2,-56.5,14.6).lineTo(-56.5,14.5).lineTo(-56.7,14).curveTo(-56.7,11.6,-55.2,10.2).curveTo(-53.7,9,-51.7,9).curveTo(-49.6,9,-48.2,10.2).curveTo(-46.7,11.6,-46.7,13.9).lineTo(-46.7,14.2).lineTo(-46.8,14.9).lineTo(-46.7,15.9).lineTo(-46.7,16).curveTo(-46.7,17.6,-47.7,19).curveTo(-49.1,21,-51.7,21).curveTo(-54.9,21,-56.1,18.3).closePath().moveTo(-134.8,18.3).lineTo(-135.4,16).curveTo(-135.4,15.2,-135.2,14.6).lineTo(-135.2,14.5).lineTo(-135.4,14).curveTo(-135.4,11.6,-133.8,10.2).curveTo(-132.5,9,-130.4,9).curveTo(-128.3,9,-127,10.2).curveTo(-125.4,11.6,-125.4,13.9).lineTo(-125.4,14.2).lineTo(-125.5,14.9).lineTo(-125.4,15.9).lineTo(-125.4,16).curveTo(-125.4,17.6,-126.4,19).curveTo(-127.8,21,-130.4,21).curveTo(-133.7,21,-134.8,18.3).closePath().moveTo(158,-11.3).lineTo(157.5,-13.6).curveTo(157.5,-14.4,157.7,-15).lineTo(157.7,-15.1).lineTo(157.5,-15.6).curveTo(157.5,-18,159,-19.4).curveTo(160.5,-20.6,162.5,-20.6).curveTo(164.6,-20.6,166,-19.4).curveTo(167.5,-18,167.5,-15.7).lineTo(167.5,-15.4).lineTo(167.4,-14.7).lineTo(167.5,-13.7).lineTo(167.5,-13.6).curveTo(167.5,-12,166.5,-10.6).curveTo(165.1,-8.6,162.5,-8.6).curveTo(159.3,-8.6,158,-11.3).closePath().moveTo(49.1,-16.5).lineTo(48.5,-18.8).curveTo(48.5,-19.6,48.7,-20.2).lineTo(48.7,-20.3).lineTo(48.5,-20.8).curveTo(48.5,-23.2,50,-24.6).curveTo(51.5,-25.8,53.5,-25.8).curveTo(55.6,-25.8,57,-24.6).curveTo(58.5,-23.2,58.5,-20.9).lineTo(58.5,-20.6).lineTo(58.4,-19.9).lineTo(58.5,-18.9).lineTo(58.5,-18.8).curveTo(58.5,-17.2,57.5,-15.8).curveTo(56.1,-13.8,53.5,-13.8).curveTo(50.3,-13.8,49.1,-16.5).closePath().moveTo(-6.9,-25.5).lineTo(-7.5,-27.8).curveTo(-7.5,-28.6,-7.3,-29.2).lineTo(-7.3,-29.3).lineTo(-7.5,-29.8).curveTo(-7.5,-32.2,-5.9,-33.6).curveTo(-4.5,-34.8,-2.5,-34.8).curveTo(-0.4,-34.8,0.9,-33.6).curveTo(2.5,-32.2,2.5,-29.9).lineTo(2.5,-29.6).lineTo(2.4,-28.9).lineTo(2.5,-27.9).lineTo(2.5,-27.8).curveTo(2.5,-26.2,1.5,-24.8).curveTo(0.1,-22.8,-2.5,-22.8).curveTo(-5.7,-22.8,-6.9,-25.5).closePath().moveTo(-211,-25.5).lineTo(-211.6,-27.8).curveTo(-211.6,-28.6,-211.4,-29.2).lineTo(-211.4,-29.3).lineTo(-211.6,-29.8).curveTo(-211.6,-32.2,-210.1,-33.6).curveTo(-208.6,-34.8,-206.6,-34.8).curveTo(-204.5,-34.8,-203.1,-33.6).curveTo(-201.6,-32.2,-201.6,-29.9).lineTo(-201.6,-29.6).lineTo(-201.7,-28.9).lineTo(-201.6,-27.9).lineTo(-201.6,-27.8).curveTo(-201.6,-26.2,-202.6,-24.8).curveTo(-204,-22.8,-206.6,-22.8).curveTo(-209.8,-22.8,-211,-25.5).closePath().moveTo(245.1,-43.8).lineTo(244.5,-46).curveTo(244.5,-46.8,244.7,-47.5).lineTo(244.7,-47.5).lineTo(244.5,-48).curveTo(244.5,-50.4,246.1,-51.8).curveTo(247.5,-53.1,249.5,-53.1).curveTo(251.6,-53.1,252.9,-51.8).curveTo(254.5,-50.5,254.5,-48.2).lineTo(254.5,-47.9).lineTo(254.4,-47.1).lineTo(254.5,-46.2).lineTo(254.5,-46).curveTo(254.5,-44.5,253.5,-43).curveTo(252.1,-41,249.5,-41).curveTo(246.3,-41,245.1,-43.8).closePath().moveTo(109.1,-66.5).lineTo(108.5,-68.8).curveTo(108.5,-69.6,108.7,-70.2).lineTo(108.7,-70.3).lineTo(108.5,-70.8).curveTo(108.5,-73.2,110.1,-74.6).curveTo(111.4,-75.8,113.5,-75.8).curveTo(115.6,-75.8,116.9,-74.6).curveTo(118.5,-73.2,118.5,-70.9).lineTo(118.5,-70.6).lineTo(118.4,-69.9).lineTo(118.5,-68.9).lineTo(118.5,-68.8).curveTo(118.5,-67.2,117.5,-65.8).curveTo(116.1,-63.8,113.5,-63.8).curveTo(110.2,-63.8,109.1,-66.5).closePath().moveTo(199.1,-74.5).lineTo(198.5,-76.8).curveTo(198.5,-77.6,198.7,-78.2).lineTo(198.7,-78.3).lineTo(198.5,-78.8).curveTo(198.5,-81.2,200.1,-82.6).curveTo(201.4,-83.8,203.5,-83.8).curveTo(205.6,-83.8,206.9,-82.6).curveTo(208.5,-81.2,208.5,-78.9).lineTo(208.5,-78.6).lineTo(208.4,-77.9).lineTo(208.5,-76.9).lineTo(208.5,-76.8).curveTo(208.5,-75.2,207.5,-73.8).curveTo(206.1,-71.8,203.5,-71.8).curveTo(200.2,-71.8,199.1,-74.5).closePath().moveTo(-91,-81.5).lineTo(-91.5,-83.8).curveTo(-91.5,-84.6,-91.3,-85.2).lineTo(-91.3,-85.3).lineTo(-91.5,-85.8).curveTo(-91.5,-88.2,-90,-89.6).curveTo(-88.6,-90.8,-86.5,-90.8).curveTo(-84.5,-90.8,-83.1,-89.6).curveTo(-81.6,-88.2,-81.5,-85.9).lineTo(-81.5,-85.6).lineTo(-81.6,-84.9).lineTo(-81.5,-83.9).lineTo(-81.5,-83.8).curveTo(-81.5,-82.2,-82.5,-80.8).curveTo(-83.9,-78.8,-86.5,-78.8).curveTo(-89.8,-78.8,-91,-81.5).closePath().moveTo(67.1,-92.5).lineTo(66.5,-94.8).curveTo(66.5,-95.6,66.7,-96.2).lineTo(66.7,-96.3).lineTo(66.5,-96.8).curveTo(66.5,-99.2,68,-100.6).curveTo(69.5,-101.8,71.5,-101.8).curveTo(73.6,-101.8,75,-100.6).curveTo(76.5,-99.2,76.5,-96.9).lineTo(76.5,-96.6).lineTo(76.4,-95.9).lineTo(76.5,-94.9).lineTo(76.5,-94.8).curveTo(76.5,-93.2,75.5,-91.8).curveTo(74.1,-89.8,71.5,-89.8).curveTo(68.3,-89.8,67.1,-92.5).closePath().moveTo(158,-94.5).lineTo(157.5,-96.8).curveTo(157.5,-97.6,157.7,-98.2).lineTo(157.7,-98.3).lineTo(157.5,-98.8).curveTo(157.5,-101.2,159,-102.6).curveTo(160.5,-103.8,162.5,-103.8).curveTo(164.6,-103.8,166,-102.6).curveTo(167.5,-101.2,167.5,-98.9).lineTo(167.5,-98.6).lineTo(167.4,-97.9).lineTo(167.5,-96.9).lineTo(167.5,-96.8).curveTo(167.5,-95.2,166.5,-93.8).curveTo(165.1,-91.8,162.5,-91.8).curveTo(159.3,-91.8,158,-94.5).closePath().moveTo(-254,-116.3).lineTo(-254.5,-118.6).curveTo(-254.5,-119.4,-254.3,-120).lineTo(-254.3,-120.1).lineTo(-254.5,-120.6).curveTo(-254.5,-123,-253,-124.4).curveTo(-251.6,-125.6,-249.5,-125.6).curveTo(-247.5,-125.6,-246.1,-124.4).curveTo(-244.6,-123,-244.5,-120.7).lineTo(-244.5,-120.4).lineTo(-244.6,-119.7).lineTo(-244.5,-118.7).lineTo(-244.5,-118.6).curveTo(-244.5,-117,-245.5,-115.6).curveTo(-246.9,-113.6,-249.5,-113.6).curveTo(-252.8,-113.6,-254,-116.3).closePath().moveTo(49.1,-126.5).lineTo(48.5,-128.8).curveTo(48.5,-129.6,48.7,-130.2).lineTo(48.7,-130.3).lineTo(48.5,-130.8).curveTo(48.5,-133.2,50,-134.6).curveTo(51.5,-135.8,53.5,-135.8).curveTo(55.6,-135.8,57,-134.6).curveTo(58.5,-133.2,58.5,-130.9).lineTo(58.5,-130.6).lineTo(58.4,-129.9).lineTo(58.5,-128.9).lineTo(58.5,-128.8).curveTo(58.5,-127.2,57.5,-125.8).curveTo(56.1,-123.8,53.5,-123.8).curveTo(50.3,-123.8,49.1,-126.5).closePath().moveTo(-191,-126.5).lineTo(-191.5,-128.8).curveTo(-191.5,-129.6,-191.3,-130.2).lineTo(-191.3,-130.3).lineTo(-191.5,-130.8).curveTo(-191.5,-133.2,-190,-134.6).curveTo(-188.6,-135.8,-186.5,-135.8).curveTo(-184.5,-135.8,-183.1,-134.6).curveTo(-181.6,-133.2,-181.5,-130.9).lineTo(-181.5,-130.6).lineTo(-181.6,-129.9).lineTo(-181.5,-128.9).lineTo(-181.5,-128.8).curveTo(-181.5,-127.2,-182.5,-125.8).curveTo(-183.9,-123.8,-186.5,-123.8).curveTo(-189.8,-123.8,-191,-126.5).closePath().moveTo(-6.9,-127.3).lineTo(-7.5,-129.6).curveTo(-7.5,-130.4,-7.3,-131).lineTo(-7.3,-131.1).lineTo(-7.5,-131.6).curveTo(-7.5,-134,-5.9,-135.4).curveTo(-4.5,-136.6,-2.5,-136.6).curveTo(-0.4,-136.6,0.9,-135.4).curveTo(2.5,-134,2.5,-131.7).lineTo(2.5,-131.4).lineTo(2.4,-130.7).lineTo(2.5,-129.7).lineTo(2.5,-129.6).curveTo(2.5,-128,1.5,-126.6).curveTo(0.1,-124.6,-2.5,-124.6).curveTo(-5.7,-124.6,-6.9,-127.3).closePath().moveTo(241,-130.5).lineTo(240.5,-132.8).curveTo(240.5,-133.6,240.7,-134.2).lineTo(240.7,-134.3).lineTo(240.5,-134.8).curveTo(240.5,-137.2,242,-138.6).curveTo(243.4,-139.8,245.5,-139.8).curveTo(247.5,-139.8,248.9,-138.6).curveTo(250.4,-137.2,250.5,-134.9).lineTo(250.5,-134.6).lineTo(250.4,-133.9).lineTo(250.5,-132.9).lineTo(250.5,-132.8).curveTo(250.5,-131.2,249.5,-129.8).curveTo(248.1,-127.8,245.5,-127.8).curveTo(242.2,-127.8,241,-130.5).closePath().moveTo(199.1,-137.5).lineTo(198.5,-139.8).curveTo(198.5,-140.6,198.7,-141.2).lineTo(198.7,-141.3).lineTo(198.5,-141.8).curveTo(198.5,-144.2,200.1,-145.6).curveTo(201.4,-146.8,203.5,-146.8).curveTo(205.6,-146.8,206.9,-145.6).curveTo(208.5,-144.2,208.5,-141.9).lineTo(208.5,-141.6).lineTo(208.4,-140.9).lineTo(208.5,-139.9).lineTo(208.5,-139.8).curveTo(208.5,-138.2,207.5,-136.8).curveTo(206.1,-134.8,203.5,-134.8).curveTo(200.2,-134.8,199.1,-137.5).closePath().moveTo(138.1,-161.2).lineTo(137.5,-163.4).curveTo(137.5,-164.2,137.7,-164.9).lineTo(137.7,-164.9).lineTo(137.5,-165.4).curveTo(137.5,-167.8,139.1,-169.2).curveTo(140.5,-170.5,142.5,-170.5).curveTo(144.5,-170.5,146,-169.2).curveTo(147.5,-167.9,147.5,-165.6).lineTo(147.5,-165.3).lineTo(147.4,-164.5).lineTo(147.5,-163.6).lineTo(147.5,-163.4).curveTo(147.5,-161.9,146.5,-160.4).curveTo(145.1,-158.4,142.5,-158.4).curveTo(139.3,-158.4,138.1,-161.2).closePath().moveTo(-101.1,-162.1).lineTo(-101.6,-164.4).curveTo(-101.6,-165.2,-101.4,-165.8).lineTo(-101.4,-165.9).lineTo(-101.6,-166.4).curveTo(-101.6,-168.8,-100.1,-170.2).curveTo(-98.7,-171.4,-96.6,-171.4).curveTo(-94.6,-171.4,-93.1,-170.2).curveTo(-91.7,-168.8,-91.6,-166.5).lineTo(-91.6,-166.2).lineTo(-91.7,-165.5).lineTo(-91.6,-164.5).lineTo(-91.6,-164.4).curveTo(-91.6,-162.8,-92.6,-161.4).curveTo(-94,-159.4,-96.6,-159.4).curveTo(-99.9,-159.4,-101.1,-162.1).closePath().moveTo(184.1,-179.5).lineTo(183.5,-181.8).curveTo(183.5,-182.6,183.7,-183.2).lineTo(183.7,-183.3).lineTo(183.5,-183.8).curveTo(183.5,-186.2,185,-187.6).curveTo(186.5,-188.8,188.5,-188.8).curveTo(190.6,-188.8,192,-187.6).curveTo(193.5,-186.2,193.5,-183.9).lineTo(193.5,-183.6).lineTo(193.4,-182.9).lineTo(193.5,-181.9).lineTo(193.5,-181.8).curveTo(193.5,-180.2,192.5,-178.8).curveTo(191.1,-176.8,188.5,-176.8).curveTo(185.3,-176.8,184.1,-179.5).closePath().moveTo(-46.1,-183.5).lineTo(-46.6,-185.8).curveTo(-46.6,-186.6,-46.4,-187.2).lineTo(-46.4,-187.3).lineTo(-46.6,-187.8).curveTo(-46.6,-190.2,-45.1,-191.6).curveTo(-43.7,-192.8,-41.6,-192.8).curveTo(-39.6,-192.8,-38.1,-191.6).curveTo(-36.7,-190.2,-36.6,-187.9).lineTo(-36.6,-187.6).lineTo(-36.7,-186.9).lineTo(-36.6,-185.9).lineTo(-36.6,-185.8).curveTo(-36.6,-184.2,-37.6,-182.8).curveTo(-39,-180.8,-41.6,-180.8).curveTo(-44.9,-180.8,-46.1,-183.5).closePath().moveTo(-145,-187.9).lineTo(-145.5,-190.1).curveTo(-145.5,-190.9,-145.3,-191.6).lineTo(-145.3,-191.6).lineTo(-145.5,-192.1).curveTo(-145.5,-194.5,-144,-195.9).curveTo(-142.6,-197.2,-140.5,-197.2).curveTo(-138.5,-197.2,-137.1,-195.9).curveTo(-135.6,-194.6,-135.5,-192.3).lineTo(-135.5,-192).lineTo(-135.6,-191.2).lineTo(-135.5,-190.3).lineTo(-135.5,-190.1).curveTo(-135.5,-188.6,-136.5,-187.1).curveTo(-137.9,-185.1,-140.5,-185.1).curveTo(-143.8,-185.1,-145,-187.9).closePath().moveTo(69.1,-191.6).lineTo(68.6,-193.8).curveTo(68.6,-194.6,68.8,-195.3).lineTo(68.8,-195.3).lineTo(68.6,-195.8).curveTo(68.6,-198.2,70.1,-199.6).curveTo(71.5,-200.9,73.6,-200.9).curveTo(75.6,-200.9,77,-199.6).curveTo(78.5,-198.3,78.6,-196).lineTo(78.6,-195.7).lineTo(78.5,-194.9).lineTo(78.6,-194).lineTo(78.6,-193.8).curveTo(78.6,-192.3,77.6,-190.8).curveTo(76.2,-188.8,73.6,-188.8).curveTo(70.3,-188.8,69.1,-191.6).closePath().moveTo(235.1,-196.9).lineTo(234.5,-199.2).curveTo(234.5,-200,234.7,-200.6).lineTo(234.7,-200.7).lineTo(234.5,-201.2).curveTo(234.5,-203.6,236.1,-205).curveTo(237.4,-206.2,239.5,-206.2).curveTo(241.5,-206.2,242.9,-205).curveTo(244.4,-203.6,244.5,-201.3).lineTo(244.5,-201).lineTo(244.4,-200.3).lineTo(244.5,-199.3).lineTo(244.5,-199.2).curveTo(244.5,-197.6,243.5,-196.2).curveTo(242.1,-194.2,239.5,-194.2).curveTo(236.2,-194.2,235.1,-196.9).closePath();
	this.shape_83.setTransform(301.4,261.175);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(234.4,-186.4).lineTo(234.4,-214).curveTo(234.6,-211.3,237.4,-209.3).curveTo(240.3,-207.2,244.6,-207.2).moveTo(183.4,-169).lineTo(183.4,-196.6).curveTo(183.6,-193.9,186.4,-191.9).curveTo(189.4,-189.8,193.6,-189.8).moveTo(198.4,-127).lineTo(198.4,-154.6).curveTo(198.6,-151.9,201.4,-149.9).curveTo(204.3,-147.8,208.6,-147.8).moveTo(240.4,-120).lineTo(240.4,-147.6).curveTo(240.6,-144.9,243.4,-142.9).curveTo(246.3,-140.8,250.6,-140.8).moveTo(198.4,-64).lineTo(198.4,-91.6).curveTo(198.6,-88.9,201.4,-86.9).curveTo(204.3,-84.8,208.6,-84.8).moveTo(244.4,-33.2).lineTo(244.4,-60.9).curveTo(244.6,-58.1,247.4,-56.1).curveTo(250.3,-54.1,254.6,-54.1).moveTo(137.4,-150.6).lineTo(137.4,-178.3).curveTo(137.6,-175.5,140.4,-173.5).curveTo(143.4,-171.5,147.6,-171.5).moveTo(68.6,-181).lineTo(68.6,-208.7).curveTo(68.7,-205.9,71.5,-203.9).curveTo(74.4,-201.9,78.7,-201.9).moveTo(66.4,-82).lineTo(66.4,-109.6).curveTo(66.6,-106.9,69.4,-104.9).curveTo(72.4,-102.8,76.6,-102.8).moveTo(48.4,-116).lineTo(48.4,-143.6).curveTo(48.6,-140.9,51.4,-138.9).curveTo(54.4,-136.8,58.6,-136.8).moveTo(157.4,-84).lineTo(157.4,-111.6).curveTo(157.6,-108.9,160.4,-106.9).curveTo(163.4,-104.8,167.6,-104.8).moveTo(108.4,-56).lineTo(108.4,-83.6).curveTo(108.6,-80.9,111.4,-78.9).curveTo(114.4,-76.8,118.6,-76.8).moveTo(157.4,-0.8).lineTo(157.4,-28.4).curveTo(157.6,-25.7,160.4,-23.7).curveTo(163.4,-21.6,167.6,-21.6).moveTo(108.4,34).lineTo(108.4,6.4).curveTo(108.6,9.1,111.4,11.1).curveTo(114.4,13.2,118.6,13.2).moveTo(157.4,66).lineTo(157.4,38.4).curveTo(157.6,41.1,160.4,43.1).curveTo(163.4,45.2,167.6,45.2).moveTo(48.4,-6).lineTo(48.4,-33.6).curveTo(48.6,-30.9,51.4,-28.9).curveTo(54.4,-26.8,58.6,-26.8).moveTo(38.4,88).lineTo(38.4,60.4).curveTo(38.6,63.1,41.4,65.1).curveTo(44.4,67.2,48.6,67.2).moveTo(101.4,122.8).lineTo(101.4,95.2).curveTo(101.5,97.9,104.4,99.9).curveTo(107.3,102,111.5,102).moveTo(214.3,46.8).lineTo(214.3,19.2).curveTo(214.4,21.9,217.3,23.9).curveTo(220.3,26,224.4,26).moveTo(183.4,136).lineTo(183.4,108.4).curveTo(183.6,111.1,186.4,113.1).curveTo(189.4,115.2,193.6,115.2).moveTo(-46.6,-173).lineTo(-46.6,-200.6).curveTo(-46.6,-197.9,-43.7,-195.9).curveTo(-40.8,-193.8,-36.6,-193.8).moveTo(-145.5,-177.3).lineTo(-145.5,-205).curveTo(-145.4,-202.2,-142.6,-200.2).curveTo(-139.6,-198.2,-135.4,-198.2).moveTo(-101.6,-151.6).lineTo(-101.6,-179.2).curveTo(-101.5,-176.5,-98.7,-174.5).curveTo(-95.8,-172.4,-91.5,-172.4).moveTo(-91.5,-71).lineTo(-91.5,-98.6).curveTo(-91.4,-95.9,-88.6,-93.9).curveTo(-85.6,-91.8,-81.4,-91.8).moveTo(-7.6,-116.8).lineTo(-7.6,-144.4).curveTo(-7.4,-141.7,-4.6,-139.7).curveTo(-1.6,-137.6,2.6,-137.6).moveTo(-254.5,-105.8).lineTo(-254.5,-133.4).curveTo(-254.4,-130.7,-251.6,-128.7).curveTo(-248.6,-126.6,-244.4,-126.6).moveTo(-191.5,-116).lineTo(-191.5,-143.6).curveTo(-191.4,-140.9,-188.6,-138.9).curveTo(-185.6,-136.8,-181.4,-136.8).moveTo(-211.6,-15).lineTo(-211.6,-42.6).curveTo(-211.5,-39.9,-208.7,-37.9).curveTo(-205.8,-35.8,-201.5,-35.8).moveTo(-155.5,106).lineTo(-155.5,78.3).curveTo(-155.4,81.1,-152.6,83.1).curveTo(-149.6,85.1,-145.4,85.1).moveTo(-7.6,-15).lineTo(-7.6,-42.6).curveTo(-7.4,-39.9,-4.6,-37.9).curveTo(-1.6,-35.8,2.6,-35.8).moveTo(-56.8,28.8).lineTo(-56.8,1.2).curveTo(-56.6,3.9,-53.8,5.9).curveTo(-50.8,8,-46.6,8).moveTo(-135.4,28.8).lineTo(-135.4,1.2).curveTo(-135.3,3.9,-132.5,5.9).curveTo(-129.5,8,-125.3,8).moveTo(-36.6,123).lineTo(-36.6,95.4).curveTo(-36.4,98.1,-33.6,100.1).curveTo(-30.6,102.2,-26.4,102.2).moveTo(108.4,186).lineTo(108.4,158.4).curveTo(108.6,161.1,111.4,163.1).curveTo(114.4,165.2,118.6,165.2).moveTo(18.4,214).lineTo(18.4,186.4).curveTo(18.6,189.1,21.4,191.1).curveTo(24.4,193.2,28.6,193.2);
	this.shape_84.setTransform(311.45,246.225);

	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.beginFill("#000000").beginStroke().moveTo(19.1,203.5).lineTo(18.5,201.2).curveTo(18.5,200.4,18.7,199.8).lineTo(18.7,199.7).lineTo(18.5,199.2).curveTo(18.5,196.8,20.1,195.4).curveTo(21.4,194.2,23.5,194.2).curveTo(25.6,194.2,26.9,195.4).curveTo(28.4,196.8,28.5,199.1).lineTo(28.5,199.4).lineTo(28.4,200.1).lineTo(28.5,201.1).lineTo(28.5,201.2).curveTo(28.5,202.8,27.5,204.2).curveTo(26.1,206.2,23.5,206.2).curveTo(20.2,206.2,19.1,203.5).closePath().moveTo(109.1,175.5).lineTo(108.5,173.2).curveTo(108.5,172.4,108.7,171.8).lineTo(108.7,171.7).lineTo(108.5,171.2).curveTo(108.5,168.8,110.1,167.4).curveTo(111.4,166.2,113.5,166.2).curveTo(115.6,166.2,116.9,167.4).curveTo(118.5,168.8,118.5,171.1).lineTo(118.5,171.4).lineTo(118.4,172.1).lineTo(118.5,173.1).lineTo(118.5,173.2).curveTo(118.5,174.8,117.5,176.2).curveTo(116.1,178.2,113.5,178.2).curveTo(110.2,178.2,109.1,175.5).closePath().moveTo(184.1,125.5).lineTo(183.5,123.2).curveTo(183.5,122.4,183.7,121.8).lineTo(183.7,121.7).lineTo(183.5,121.2).curveTo(183.5,118.8,185,117.4).curveTo(186.5,116.2,188.5,116.2).curveTo(190.6,116.2,192,117.4).curveTo(193.5,118.8,193.5,121.1).lineTo(193.5,121.4).lineTo(193.4,122.1).lineTo(193.5,123.1).lineTo(193.5,123.2).curveTo(193.5,124.8,192.5,126.2).curveTo(191.1,128.2,188.5,128.2).curveTo(185.3,128.2,184.1,125.5).closePath().moveTo(-36,112.5).lineTo(-36.5,110.2).curveTo(-36.5,109.4,-36.3,108.8).lineTo(-36.3,108.7).lineTo(-36.5,108.2).curveTo(-36.5,105.8,-34.9,104.4).curveTo(-33.6,103.2,-31.5,103.2).curveTo(-29.5,103.2,-28.1,104.4).curveTo(-26.6,105.8,-26.5,108.1).lineTo(-26.5,108.4).lineTo(-26.6,109.1).lineTo(-26.5,110.1).lineTo(-26.5,110.2).curveTo(-26.5,111.8,-27.5,113.2).curveTo(-28.9,115.2,-31.5,115.2).curveTo(-34.8,115.2,-36,112.5).closePath().moveTo(102,112.3).lineTo(101.4,110).curveTo(101.4,109.2,101.6,108.6).lineTo(101.6,108.5).lineTo(101.4,108).curveTo(101.5,105.6,103,104.2).curveTo(104.4,103,106.5,103).curveTo(108.5,103,109.9,104.2).curveTo(111.4,105.6,111.4,107.9).lineTo(111.4,108.2).lineTo(111.3,108.9).lineTo(111.4,109.9).lineTo(111.4,110).curveTo(111.5,111.6,110.4,113).curveTo(109.1,115,106.5,115).curveTo(103.2,115,102,112.3).closePath().moveTo(-155,95.4).lineTo(-155.5,93.2).curveTo(-155.5,92.4,-155.3,91.7).lineTo(-155.3,91.7).lineTo(-155.5,91.2).curveTo(-155.5,88.8,-154,87.4).curveTo(-152.6,86.1,-150.5,86.1).curveTo(-148.5,86.1,-147.1,87.4).curveTo(-145.6,88.7,-145.5,91).lineTo(-145.5,91.3).lineTo(-145.6,92.1).lineTo(-145.5,93).lineTo(-145.5,93.2).curveTo(-145.5,94.7,-146.5,96.2).curveTo(-147.9,98.2,-150.5,98.2).curveTo(-153.8,98.2,-155,95.4).closePath().moveTo(39.1,77.5).lineTo(38.5,75.2).curveTo(38.5,74.4,38.7,73.8).lineTo(38.7,73.7).lineTo(38.5,73.2).curveTo(38.5,70.8,40.1,69.4).curveTo(41.5,68.2,43.5,68.2).curveTo(45.5,68.2,47,69.4).curveTo(48.5,70.8,48.5,73.1).lineTo(48.5,73.4).lineTo(48.4,74.1).lineTo(48.5,75.1).lineTo(48.5,75.2).curveTo(48.5,76.8,47.5,78.2).curveTo(46.1,80.2,43.5,80.2).curveTo(40.3,80.2,39.1,77.5).closePath().moveTo(158,55.5).lineTo(157.5,53.2).curveTo(157.5,52.4,157.7,51.8).lineTo(157.7,51.7).lineTo(157.5,51.2).curveTo(157.5,48.8,159,47.4).curveTo(160.5,46.2,162.5,46.2).curveTo(164.6,46.2,166,47.4).curveTo(167.5,48.8,167.5,51.1).lineTo(167.5,51.4).lineTo(167.4,52.1).lineTo(167.5,53.1).lineTo(167.5,53.2).curveTo(167.5,54.8,166.5,56.2).curveTo(165.1,58.2,162.5,58.2).curveTo(159.3,58.2,158,55.5).closePath().moveTo(214.9,36.3).lineTo(214.4,34).curveTo(214.4,33.2,214.6,32.6).lineTo(214.6,32.5).lineTo(214.4,32).curveTo(214.4,29.6,215.9,28.2).curveTo(217.3,27,219.4,27).curveTo(221.4,27,222.9,28.2).curveTo(224.3,29.6,224.4,31.9).lineTo(224.4,32.2).lineTo(224.3,32.9).lineTo(224.4,33.9).lineTo(224.4,34).curveTo(224.4,35.6,223.4,37).curveTo(222,39,219.4,39).curveTo(216.1,39,214.9,36.3).closePath().moveTo(109.1,23.5).lineTo(108.5,21.2).curveTo(108.5,20.4,108.7,19.8).lineTo(108.7,19.7).lineTo(108.5,19.2).curveTo(108.5,16.8,110.1,15.4).curveTo(111.4,14.2,113.5,14.2).curveTo(115.6,14.2,116.9,15.4).curveTo(118.5,16.8,118.5,19.1).lineTo(118.5,19.4).lineTo(118.4,20.1).lineTo(118.5,21.1).lineTo(118.5,21.2).curveTo(118.5,22.8,117.5,24.2).curveTo(116.1,26.2,113.5,26.2).curveTo(110.2,26.2,109.1,23.5).closePath().moveTo(-56.1,18.3).lineTo(-56.7,16).curveTo(-56.7,15.2,-56.5,14.6).lineTo(-56.5,14.5).lineTo(-56.7,14).curveTo(-56.7,11.6,-55.2,10.2).curveTo(-53.7,9,-51.7,9).curveTo(-49.6,9,-48.2,10.2).curveTo(-46.7,11.6,-46.7,13.9).lineTo(-46.7,14.2).lineTo(-46.8,14.9).lineTo(-46.7,15.9).lineTo(-46.7,16).curveTo(-46.7,17.6,-47.7,19).curveTo(-49.1,21,-51.7,21).curveTo(-54.9,21,-56.1,18.3).closePath().moveTo(-134.8,18.3).lineTo(-135.4,16).curveTo(-135.4,15.2,-135.2,14.6).lineTo(-135.2,14.5).lineTo(-135.4,14).curveTo(-135.4,11.6,-133.8,10.2).curveTo(-132.5,9,-130.4,9).curveTo(-128.3,9,-127,10.2).curveTo(-125.4,11.6,-125.4,13.9).lineTo(-125.4,14.2).lineTo(-125.5,14.9).lineTo(-125.4,15.9).lineTo(-125.4,16).curveTo(-125.4,17.6,-126.4,19).curveTo(-127.8,21,-130.4,21).curveTo(-133.7,21,-134.8,18.3).closePath().moveTo(158,-11.3).lineTo(157.5,-13.6).curveTo(157.5,-14.4,157.7,-15).lineTo(157.7,-15.1).lineTo(157.5,-15.6).curveTo(157.5,-18,159,-19.4).curveTo(160.5,-20.6,162.5,-20.6).curveTo(164.6,-20.6,166,-19.4).curveTo(167.5,-18,167.5,-15.7).lineTo(167.5,-15.4).lineTo(167.4,-14.7).lineTo(167.5,-13.7).lineTo(167.5,-13.6).curveTo(167.5,-12,166.5,-10.6).curveTo(165.1,-8.6,162.5,-8.6).curveTo(159.3,-8.6,158,-11.3).closePath().moveTo(49.1,-16.5).lineTo(48.5,-18.8).curveTo(48.5,-19.6,48.7,-20.2).lineTo(48.7,-20.3).lineTo(48.5,-20.8).curveTo(48.5,-23.2,50,-24.6).curveTo(51.5,-25.8,53.5,-25.8).curveTo(55.6,-25.8,57,-24.6).curveTo(58.5,-23.2,58.5,-20.9).lineTo(58.5,-20.6).lineTo(58.4,-19.9).lineTo(58.5,-18.9).lineTo(58.5,-18.8).curveTo(58.5,-17.2,57.5,-15.8).curveTo(56.1,-13.8,53.5,-13.8).curveTo(50.3,-13.8,49.1,-16.5).closePath().moveTo(-6.9,-25.5).lineTo(-7.5,-27.8).curveTo(-7.5,-28.6,-7.3,-29.2).lineTo(-7.3,-29.3).lineTo(-7.5,-29.8).curveTo(-7.5,-32.2,-5.9,-33.6).curveTo(-4.5,-34.8,-2.5,-34.8).curveTo(-0.4,-34.8,0.9,-33.6).curveTo(2.5,-32.2,2.5,-29.9).lineTo(2.5,-29.6).lineTo(2.4,-28.9).lineTo(2.5,-27.9).lineTo(2.5,-27.8).curveTo(2.5,-26.2,1.5,-24.8).curveTo(0.1,-22.8,-2.5,-22.8).curveTo(-5.7,-22.8,-6.9,-25.5).closePath().moveTo(-211,-25.5).lineTo(-211.6,-27.8).curveTo(-211.6,-28.6,-211.4,-29.2).lineTo(-211.4,-29.3).lineTo(-211.6,-29.8).curveTo(-211.6,-32.2,-210.1,-33.6).curveTo(-208.6,-34.8,-206.6,-34.8).curveTo(-204.5,-34.8,-203.1,-33.6).curveTo(-201.6,-32.2,-201.6,-29.9).lineTo(-201.6,-29.6).lineTo(-201.7,-28.9).lineTo(-201.6,-27.9).lineTo(-201.6,-27.8).curveTo(-201.6,-26.2,-202.6,-24.8).curveTo(-204,-22.8,-206.6,-22.8).curveTo(-209.8,-22.8,-211,-25.5).closePath().moveTo(245.1,-43.8).lineTo(244.5,-46).curveTo(244.5,-46.8,244.7,-47.5).lineTo(244.7,-47.5).lineTo(244.5,-48).curveTo(244.5,-50.4,246.1,-51.8).curveTo(247.5,-53.1,249.5,-53.1).curveTo(251.6,-53.1,252.9,-51.8).curveTo(254.5,-50.5,254.5,-48.2).lineTo(254.5,-47.9).lineTo(254.4,-47.1).lineTo(254.5,-46.2).lineTo(254.5,-46).curveTo(254.5,-44.5,253.5,-43).curveTo(252.1,-41,249.5,-41).curveTo(246.3,-41,245.1,-43.8).closePath().moveTo(109.1,-66.5).lineTo(108.5,-68.8).curveTo(108.5,-69.6,108.7,-70.2).lineTo(108.7,-70.3).lineTo(108.5,-70.8).curveTo(108.5,-73.2,110.1,-74.6).curveTo(111.4,-75.8,113.5,-75.8).curveTo(115.6,-75.8,116.9,-74.6).curveTo(118.5,-73.2,118.5,-70.9).lineTo(118.5,-70.6).lineTo(118.4,-69.9).lineTo(118.5,-68.9).lineTo(118.5,-68.8).curveTo(118.5,-67.2,117.5,-65.8).curveTo(116.1,-63.8,113.5,-63.8).curveTo(110.2,-63.8,109.1,-66.5).closePath().moveTo(199.1,-74.5).lineTo(198.5,-76.8).curveTo(198.5,-77.6,198.7,-78.2).lineTo(198.7,-78.3).lineTo(198.5,-78.8).curveTo(198.5,-81.2,200.1,-82.6).curveTo(201.4,-83.8,203.5,-83.8).curveTo(205.6,-83.8,206.9,-82.6).curveTo(208.5,-81.2,208.5,-78.9).lineTo(208.5,-78.6).lineTo(208.4,-77.9).lineTo(208.5,-76.9).lineTo(208.5,-76.8).curveTo(208.5,-75.2,207.5,-73.8).curveTo(206.1,-71.8,203.5,-71.8).curveTo(200.2,-71.8,199.1,-74.5).closePath().moveTo(-91,-81.5).lineTo(-91.5,-83.8).curveTo(-91.5,-84.6,-91.3,-85.2).lineTo(-91.3,-85.3).lineTo(-91.5,-85.8).curveTo(-91.5,-88.2,-90,-89.6).curveTo(-88.6,-90.8,-86.5,-90.8).curveTo(-84.5,-90.8,-83.1,-89.6).curveTo(-81.6,-88.2,-81.5,-85.9).lineTo(-81.5,-85.6).lineTo(-81.6,-84.9).lineTo(-81.5,-83.9).lineTo(-81.5,-83.8).curveTo(-81.5,-82.2,-82.5,-80.8).curveTo(-83.9,-78.8,-86.5,-78.8).curveTo(-89.8,-78.8,-91,-81.5).closePath().moveTo(67.1,-92.5).lineTo(66.5,-94.8).curveTo(66.5,-95.6,66.7,-96.2).lineTo(66.7,-96.3).lineTo(66.5,-96.8).curveTo(66.5,-99.2,68,-100.6).curveTo(69.5,-101.8,71.5,-101.8).curveTo(73.6,-101.8,75,-100.6).curveTo(76.5,-99.2,76.5,-96.9).lineTo(76.5,-96.6).lineTo(76.4,-95.9).lineTo(76.5,-94.9).lineTo(76.5,-94.8).curveTo(76.5,-93.2,75.5,-91.8).curveTo(74.1,-89.8,71.5,-89.8).curveTo(68.3,-89.8,67.1,-92.5).closePath().moveTo(158,-94.5).lineTo(157.5,-96.8).curveTo(157.5,-97.6,157.7,-98.2).lineTo(157.7,-98.3).lineTo(157.5,-98.8).curveTo(157.5,-101.2,159,-102.6).curveTo(160.5,-103.8,162.5,-103.8).curveTo(164.6,-103.8,166,-102.6).curveTo(167.5,-101.2,167.5,-98.9).lineTo(167.5,-98.6).lineTo(167.4,-97.9).lineTo(167.5,-96.9).lineTo(167.5,-96.8).curveTo(167.5,-95.2,166.5,-93.8).curveTo(165.1,-91.8,162.5,-91.8).curveTo(159.3,-91.8,158,-94.5).closePath().moveTo(-254,-116.3).lineTo(-254.5,-118.6).curveTo(-254.5,-119.4,-254.3,-120).lineTo(-254.3,-120.1).lineTo(-254.5,-120.6).curveTo(-254.5,-123,-253,-124.4).curveTo(-251.6,-125.6,-249.5,-125.6).curveTo(-247.5,-125.6,-246.1,-124.4).curveTo(-244.6,-123,-244.5,-120.7).lineTo(-244.5,-120.4).lineTo(-244.6,-119.7).lineTo(-244.5,-118.7).lineTo(-244.5,-118.6).curveTo(-244.5,-117,-245.5,-115.6).curveTo(-246.9,-113.6,-249.5,-113.6).curveTo(-252.8,-113.6,-254,-116.3).closePath().moveTo(49.1,-126.5).lineTo(48.5,-128.8).curveTo(48.5,-129.6,48.7,-130.2).lineTo(48.7,-130.3).lineTo(48.5,-130.8).curveTo(48.5,-133.2,50,-134.6).curveTo(51.5,-135.8,53.5,-135.8).curveTo(55.6,-135.8,57,-134.6).curveTo(58.5,-133.2,58.5,-130.9).lineTo(58.5,-130.6).lineTo(58.4,-129.9).lineTo(58.5,-128.9).lineTo(58.5,-128.8).curveTo(58.5,-127.2,57.5,-125.8).curveTo(56.1,-123.8,53.5,-123.8).curveTo(50.3,-123.8,49.1,-126.5).closePath().moveTo(-191,-126.5).lineTo(-191.5,-128.8).curveTo(-191.5,-129.6,-191.3,-130.2).lineTo(-191.3,-130.3).lineTo(-191.5,-130.8).curveTo(-191.5,-133.2,-190,-134.6).curveTo(-188.6,-135.8,-186.5,-135.8).curveTo(-184.5,-135.8,-183.1,-134.6).curveTo(-181.6,-133.2,-181.5,-130.9).lineTo(-181.5,-130.6).lineTo(-181.6,-129.9).lineTo(-181.5,-128.9).lineTo(-181.5,-128.8).curveTo(-181.5,-127.2,-182.5,-125.8).curveTo(-183.9,-123.8,-186.5,-123.8).curveTo(-189.8,-123.8,-191,-126.5).closePath().moveTo(-6.9,-127.3).lineTo(-7.5,-129.6).curveTo(-7.5,-130.4,-7.3,-131).lineTo(-7.3,-131.1).lineTo(-7.5,-131.6).curveTo(-7.5,-134,-5.9,-135.4).curveTo(-4.5,-136.6,-2.5,-136.6).curveTo(-0.4,-136.6,0.9,-135.4).curveTo(2.5,-134,2.5,-131.7).lineTo(2.5,-131.4).lineTo(2.4,-130.7).lineTo(2.5,-129.7).lineTo(2.5,-129.6).curveTo(2.5,-128,1.5,-126.6).curveTo(0.1,-124.6,-2.5,-124.6).curveTo(-5.7,-124.6,-6.9,-127.3).closePath().moveTo(241,-130.5).lineTo(240.5,-132.8).curveTo(240.5,-133.6,240.7,-134.2).lineTo(240.7,-134.3).lineTo(240.5,-134.8).curveTo(240.5,-137.2,242,-138.6).curveTo(243.4,-139.8,245.5,-139.8).curveTo(247.5,-139.8,248.9,-138.6).curveTo(250.4,-137.2,250.5,-134.9).lineTo(250.5,-134.6).lineTo(250.4,-133.9).lineTo(250.5,-132.9).lineTo(250.5,-132.8).curveTo(250.5,-131.2,249.5,-129.8).curveTo(248.1,-127.8,245.5,-127.8).curveTo(242.2,-127.8,241,-130.5).closePath().moveTo(199.1,-137.5).lineTo(198.5,-139.8).curveTo(198.5,-140.6,198.7,-141.2).lineTo(198.7,-141.3).lineTo(198.5,-141.8).curveTo(198.5,-144.2,200.1,-145.6).curveTo(201.4,-146.8,203.5,-146.8).curveTo(205.6,-146.8,206.9,-145.6).curveTo(208.5,-144.2,208.5,-141.9).lineTo(208.5,-141.6).lineTo(208.4,-140.9).lineTo(208.5,-139.9).lineTo(208.5,-139.8).curveTo(208.5,-138.2,207.5,-136.8).curveTo(206.1,-134.8,203.5,-134.8).curveTo(200.2,-134.8,199.1,-137.5).closePath().moveTo(138.1,-161.2).lineTo(137.5,-163.4).curveTo(137.5,-164.2,137.7,-164.9).lineTo(137.7,-164.9).lineTo(137.5,-165.4).curveTo(137.5,-167.8,139.1,-169.2).curveTo(140.5,-170.5,142.5,-170.5).curveTo(144.5,-170.5,146,-169.2).curveTo(147.5,-167.9,147.5,-165.6).lineTo(147.5,-165.3).lineTo(147.4,-164.5).lineTo(147.5,-163.6).lineTo(147.5,-163.4).curveTo(147.5,-161.9,146.5,-160.4).curveTo(145.1,-158.4,142.5,-158.4).curveTo(139.3,-158.4,138.1,-161.2).closePath().moveTo(-101.1,-162.1).lineTo(-101.6,-164.4).curveTo(-101.6,-165.2,-101.4,-165.8).lineTo(-101.4,-165.9).lineTo(-101.6,-166.4).curveTo(-101.6,-168.8,-100.1,-170.2).curveTo(-98.7,-171.4,-96.6,-171.4).curveTo(-94.6,-171.4,-93.1,-170.2).curveTo(-91.7,-168.8,-91.6,-166.5).lineTo(-91.6,-166.2).lineTo(-91.7,-165.5).lineTo(-91.6,-164.5).lineTo(-91.6,-164.4).curveTo(-91.6,-162.8,-92.6,-161.4).curveTo(-94,-159.4,-96.6,-159.4).curveTo(-99.9,-159.4,-101.1,-162.1).closePath().moveTo(184.1,-179.5).lineTo(183.5,-181.8).curveTo(183.5,-182.6,183.7,-183.2).lineTo(183.7,-183.3).lineTo(183.5,-183.8).curveTo(183.5,-186.2,185,-187.6).curveTo(186.5,-188.8,188.5,-188.8).curveTo(190.6,-188.8,192,-187.6).curveTo(193.5,-186.2,193.5,-183.9).lineTo(193.5,-183.6).lineTo(193.4,-182.9).lineTo(193.5,-181.9).lineTo(193.5,-181.8).curveTo(193.5,-180.2,192.5,-178.8).curveTo(191.1,-176.8,188.5,-176.8).curveTo(185.3,-176.8,184.1,-179.5).closePath().moveTo(-46.1,-183.5).lineTo(-46.6,-185.8).curveTo(-46.6,-186.6,-46.4,-187.2).lineTo(-46.4,-187.3).lineTo(-46.6,-187.8).curveTo(-46.6,-190.2,-45.1,-191.6).curveTo(-43.7,-192.8,-41.6,-192.8).curveTo(-39.6,-192.8,-38.1,-191.6).curveTo(-36.7,-190.2,-36.6,-187.9).lineTo(-36.6,-187.6).lineTo(-36.7,-186.9).lineTo(-36.6,-185.9).lineTo(-36.6,-185.8).curveTo(-36.6,-184.2,-37.6,-182.8).curveTo(-39,-180.8,-41.6,-180.8).curveTo(-44.9,-180.8,-46.1,-183.5).closePath().moveTo(-145,-187.9).lineTo(-145.5,-190.1).curveTo(-145.5,-190.9,-145.3,-191.6).lineTo(-145.3,-191.6).lineTo(-145.5,-192.1).curveTo(-145.5,-194.5,-144,-195.9).curveTo(-142.6,-197.2,-140.5,-197.2).curveTo(-138.5,-197.2,-137.1,-195.9).curveTo(-135.6,-194.6,-135.5,-192.3).lineTo(-135.5,-192).lineTo(-135.6,-191.2).lineTo(-135.5,-190.3).lineTo(-135.5,-190.1).curveTo(-135.5,-188.6,-136.5,-187.1).curveTo(-137.9,-185.1,-140.5,-185.1).curveTo(-143.8,-185.1,-145,-187.9).closePath().moveTo(69.1,-191.6).lineTo(68.6,-193.8).curveTo(68.6,-194.6,68.8,-195.3).lineTo(68.8,-195.3).lineTo(68.6,-195.8).curveTo(68.6,-198.2,70.1,-199.6).curveTo(71.5,-200.9,73.6,-200.9).curveTo(75.6,-200.9,77,-199.6).curveTo(78.5,-198.3,78.6,-196).lineTo(78.6,-195.7).lineTo(78.5,-194.9).lineTo(78.6,-194).lineTo(78.6,-193.8).curveTo(78.6,-192.3,77.6,-190.8).curveTo(76.2,-188.8,73.6,-188.8).curveTo(70.3,-188.8,69.1,-191.6).closePath().moveTo(235.1,-196.9).lineTo(234.5,-199.2).curveTo(234.5,-200,234.7,-200.6).lineTo(234.7,-200.7).lineTo(234.5,-201.2).curveTo(234.5,-203.6,236.1,-205).curveTo(237.4,-206.2,239.5,-206.2).curveTo(241.5,-206.2,242.9,-205).curveTo(244.4,-203.6,244.5,-201.3).lineTo(244.5,-201).lineTo(244.4,-200.3).lineTo(244.5,-199.3).lineTo(244.5,-199.2).curveTo(244.5,-197.6,243.5,-196.2).curveTo(242.1,-194.2,239.5,-194.2).curveTo(236.2,-194.2,235.1,-196.9).closePath();
	this.shape_85.setTransform(301.4,261.175);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(234.4,-199.4).lineTo(234.4,-227).curveTo(234.6,-224.3,237.4,-222.3).curveTo(240.3,-220.2,244.6,-220.2).moveTo(183.4,-182).lineTo(183.4,-209.6).curveTo(183.6,-206.9,186.4,-204.9).curveTo(189.4,-202.8,193.6,-202.8).moveTo(198.4,-140).lineTo(198.4,-167.6).curveTo(198.6,-164.9,201.4,-162.9).curveTo(204.3,-160.8,208.6,-160.8).moveTo(240.4,-133).lineTo(240.4,-160.6).curveTo(240.6,-157.9,243.4,-155.9).curveTo(246.3,-153.8,250.6,-153.8).moveTo(198.4,-77).lineTo(198.4,-104.6).curveTo(198.6,-101.9,201.4,-99.9).curveTo(204.3,-97.8,208.6,-97.8).moveTo(244.4,-46.2).lineTo(244.4,-73.9).curveTo(244.6,-71.1,247.4,-69.1).curveTo(250.3,-67.1,254.6,-67.1).moveTo(137.4,-163.6).lineTo(137.4,-191.3).curveTo(137.6,-188.5,140.4,-186.5).curveTo(143.4,-184.5,147.6,-184.5).moveTo(68.6,-194).lineTo(68.6,-221.7).curveTo(68.7,-218.9,71.5,-216.9).curveTo(74.4,-214.9,78.7,-214.9).moveTo(66.4,-95).lineTo(66.4,-122.6).curveTo(66.6,-119.9,69.4,-117.9).curveTo(72.4,-115.8,76.6,-115.8).moveTo(48.4,-129).lineTo(48.4,-156.6).curveTo(48.6,-153.9,51.4,-151.9).curveTo(54.4,-149.8,58.6,-149.8).moveTo(157.4,-97).lineTo(157.4,-124.6).curveTo(157.6,-121.9,160.4,-119.9).curveTo(163.4,-117.8,167.6,-117.8).moveTo(108.4,-69).lineTo(108.4,-96.6).curveTo(108.6,-93.9,111.4,-91.9).curveTo(114.4,-89.8,118.6,-89.8).moveTo(157.4,-13.8).lineTo(157.4,-41.4).curveTo(157.6,-38.7,160.4,-36.7).curveTo(163.4,-34.6,167.6,-34.6).moveTo(108.4,21).lineTo(108.4,-6.6).curveTo(108.6,-3.9,111.4,-1.9).curveTo(114.4,0.2,118.6,0.2).moveTo(157.4,53).lineTo(157.4,25.4).curveTo(157.6,28.1,160.4,30.1).curveTo(163.4,32.2,167.6,32.2).moveTo(48.4,-19).lineTo(48.4,-46.6).curveTo(48.6,-43.9,51.4,-41.9).curveTo(54.4,-39.8,58.6,-39.8).moveTo(38.4,75).lineTo(38.4,47.4).curveTo(38.6,50.1,41.4,52.1).curveTo(44.4,54.2,48.6,54.2).moveTo(101.4,109.8).lineTo(101.4,82.2).curveTo(101.5,84.9,104.4,86.9).curveTo(107.3,89,111.5,89).moveTo(214.3,33.8).lineTo(214.3,6.2).curveTo(214.4,8.9,217.3,10.9).curveTo(220.3,13,224.4,13).moveTo(183.4,123).lineTo(183.4,95.4).curveTo(183.6,98.1,186.4,100.1).curveTo(189.4,102.2,193.6,102.2).moveTo(-46.6,-186).lineTo(-46.6,-213.6).curveTo(-46.6,-210.9,-43.7,-208.9).curveTo(-40.8,-206.8,-36.6,-206.8).moveTo(-145.5,-190.3).lineTo(-145.5,-218).curveTo(-145.4,-215.2,-142.6,-213.2).curveTo(-139.6,-211.2,-135.4,-211.2).moveTo(-101.6,-164.6).lineTo(-101.6,-192.2).curveTo(-101.5,-189.5,-98.7,-187.5).curveTo(-95.8,-185.4,-91.5,-185.4).moveTo(-91.5,-84).lineTo(-91.5,-111.6).curveTo(-91.4,-108.9,-88.6,-106.9).curveTo(-85.6,-104.8,-81.4,-104.8).moveTo(-7.6,-129.8).lineTo(-7.6,-157.4).curveTo(-7.4,-154.7,-4.6,-152.7).curveTo(-1.6,-150.6,2.6,-150.6).moveTo(-254.5,-118.8).lineTo(-254.5,-146.4).curveTo(-254.4,-143.7,-251.6,-141.7).curveTo(-248.6,-139.6,-244.4,-139.6).moveTo(-191.5,-129).lineTo(-191.5,-156.6).curveTo(-191.4,-153.9,-188.6,-151.9).curveTo(-185.6,-149.8,-181.4,-149.8).moveTo(-211.6,-28).lineTo(-211.6,-55.6).curveTo(-211.5,-52.9,-208.7,-50.9).curveTo(-205.8,-48.8,-201.5,-48.8).moveTo(-155.5,93).lineTo(-155.5,65.3).curveTo(-155.4,68.1,-152.6,70.1).curveTo(-149.6,72.1,-145.4,72.1).moveTo(-7.6,-28).lineTo(-7.6,-55.6).curveTo(-7.4,-52.9,-4.6,-50.9).curveTo(-1.6,-48.8,2.6,-48.8).moveTo(-56.8,15.8).lineTo(-56.8,-11.8).curveTo(-56.6,-9.1,-53.8,-7.1).curveTo(-50.8,-5,-46.6,-5).moveTo(-135.4,15.8).lineTo(-135.4,-11.8).curveTo(-135.3,-9.1,-132.5,-7.1).curveTo(-129.5,-5,-125.3,-5).moveTo(-36.6,110).lineTo(-36.6,82.4).curveTo(-36.4,85.1,-33.6,87.1).curveTo(-30.6,89.2,-26.4,89.2).moveTo(-71.5,227).lineTo(-71.5,199.4).curveTo(-71.4,202.1,-68.6,204.1).curveTo(-65.6,206.2,-61.4,206.2).moveTo(108.4,173).lineTo(108.4,145.4).curveTo(108.6,148.1,111.4,150.1).curveTo(114.4,152.2,118.6,152.2).moveTo(18.4,201).lineTo(18.4,173.4).curveTo(18.6,176.1,21.4,178.1).curveTo(24.4,180.2,28.6,180.2);
	this.shape_86.setTransform(311.45,259.225);

	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.beginFill("#000000").beginStroke().moveTo(-70.9,216.5).lineTo(-71.5,214.2).curveTo(-71.5,213.4,-71.3,212.8).lineTo(-71.3,212.7).lineTo(-71.5,212.2).curveTo(-71.5,209.8,-69.9,208.4).curveTo(-68.6,207.2,-66.5,207.2).curveTo(-64.4,207.2,-63.1,208.4).curveTo(-61.6,209.8,-61.5,212.1).lineTo(-61.5,212.4).lineTo(-61.6,213.1).lineTo(-61.5,214.1).lineTo(-61.5,214.2).curveTo(-61.5,215.8,-62.5,217.2).curveTo(-63.9,219.2,-66.5,219.2).curveTo(-69.8,219.2,-70.9,216.5).closePath().moveTo(19.1,190.5).lineTo(18.5,188.2).curveTo(18.5,187.4,18.7,186.8).lineTo(18.7,186.7).lineTo(18.5,186.2).curveTo(18.5,183.8,20.1,182.4).curveTo(21.4,181.2,23.5,181.2).curveTo(25.6,181.2,26.9,182.4).curveTo(28.4,183.8,28.5,186.1).lineTo(28.5,186.4).lineTo(28.4,187.1).lineTo(28.5,188.1).lineTo(28.5,188.2).curveTo(28.5,189.8,27.5,191.2).curveTo(26.1,193.2,23.5,193.2).curveTo(20.2,193.2,19.1,190.5).closePath().moveTo(109.1,162.5).lineTo(108.5,160.2).curveTo(108.5,159.4,108.7,158.8).lineTo(108.7,158.7).lineTo(108.5,158.2).curveTo(108.5,155.8,110.1,154.4).curveTo(111.4,153.2,113.5,153.2).curveTo(115.6,153.2,116.9,154.4).curveTo(118.5,155.8,118.5,158.1).lineTo(118.5,158.4).lineTo(118.4,159.1).lineTo(118.5,160.1).lineTo(118.5,160.2).curveTo(118.5,161.8,117.5,163.2).curveTo(116.1,165.2,113.5,165.2).curveTo(110.2,165.2,109.1,162.5).closePath().moveTo(184.1,112.5).lineTo(183.5,110.2).curveTo(183.5,109.4,183.7,108.8).lineTo(183.7,108.7).lineTo(183.5,108.2).curveTo(183.5,105.8,185,104.4).curveTo(186.5,103.2,188.5,103.2).curveTo(190.6,103.2,192,104.4).curveTo(193.5,105.8,193.5,108.1).lineTo(193.5,108.4).lineTo(193.4,109.1).lineTo(193.5,110.1).lineTo(193.5,110.2).curveTo(193.5,111.8,192.5,113.2).curveTo(191.1,115.2,188.5,115.2).curveTo(185.3,115.2,184.1,112.5).closePath().moveTo(-36,99.5).lineTo(-36.5,97.2).curveTo(-36.5,96.4,-36.3,95.8).lineTo(-36.3,95.7).lineTo(-36.5,95.2).curveTo(-36.5,92.8,-34.9,91.4).curveTo(-33.6,90.2,-31.5,90.2).curveTo(-29.5,90.2,-28.1,91.4).curveTo(-26.6,92.8,-26.5,95.1).lineTo(-26.5,95.4).lineTo(-26.6,96.1).lineTo(-26.5,97.1).lineTo(-26.5,97.2).curveTo(-26.5,98.8,-27.5,100.2).curveTo(-28.9,102.2,-31.5,102.2).curveTo(-34.8,102.2,-36,99.5).closePath().moveTo(102,99.3).lineTo(101.4,97).curveTo(101.4,96.2,101.6,95.6).lineTo(101.6,95.5).lineTo(101.4,95).curveTo(101.5,92.6,103,91.2).curveTo(104.4,90,106.5,90).curveTo(108.5,90,109.9,91.2).curveTo(111.4,92.6,111.4,94.9).lineTo(111.4,95.2).lineTo(111.3,95.9).lineTo(111.4,96.9).lineTo(111.4,97).curveTo(111.5,98.6,110.4,100).curveTo(109.1,102,106.5,102).curveTo(103.2,102,102,99.3).closePath().moveTo(-155,82.4).lineTo(-155.5,80.2).curveTo(-155.5,79.4,-155.3,78.7).lineTo(-155.3,78.7).lineTo(-155.5,78.2).curveTo(-155.5,75.8,-154,74.4).curveTo(-152.6,73.1,-150.5,73.1).curveTo(-148.5,73.1,-147.1,74.4).curveTo(-145.6,75.7,-145.5,78).lineTo(-145.5,78.3).lineTo(-145.6,79.1).lineTo(-145.5,80).lineTo(-145.5,80.2).curveTo(-145.5,81.7,-146.5,83.2).curveTo(-147.9,85.2,-150.5,85.2).curveTo(-153.8,85.2,-155,82.4).closePath().moveTo(39.1,64.5).lineTo(38.5,62.2).curveTo(38.5,61.4,38.7,60.8).lineTo(38.7,60.7).lineTo(38.5,60.2).curveTo(38.5,57.8,40.1,56.4).curveTo(41.5,55.2,43.5,55.2).curveTo(45.5,55.2,47,56.4).curveTo(48.5,57.8,48.5,60.1).lineTo(48.5,60.4).lineTo(48.4,61.1).lineTo(48.5,62.1).lineTo(48.5,62.2).curveTo(48.5,63.8,47.5,65.2).curveTo(46.1,67.2,43.5,67.2).curveTo(40.3,67.2,39.1,64.5).closePath().moveTo(158,42.5).lineTo(157.5,40.2).curveTo(157.5,39.4,157.7,38.8).lineTo(157.7,38.7).lineTo(157.5,38.2).curveTo(157.5,35.8,159,34.4).curveTo(160.5,33.2,162.5,33.2).curveTo(164.6,33.2,166,34.4).curveTo(167.5,35.8,167.5,38.1).lineTo(167.5,38.4).lineTo(167.4,39.1).lineTo(167.5,40.1).lineTo(167.5,40.2).curveTo(167.5,41.8,166.5,43.2).curveTo(165.1,45.2,162.5,45.2).curveTo(159.3,45.2,158,42.5).closePath().moveTo(214.9,23.3).lineTo(214.4,21).curveTo(214.4,20.2,214.6,19.6).lineTo(214.6,19.5).lineTo(214.4,19).curveTo(214.4,16.6,215.9,15.2).curveTo(217.3,14,219.4,14).curveTo(221.4,14,222.9,15.2).curveTo(224.3,16.6,224.4,18.9).lineTo(224.4,19.2).lineTo(224.3,19.9).lineTo(224.4,20.9).lineTo(224.4,21).curveTo(224.4,22.6,223.4,24).curveTo(222,26,219.4,26).curveTo(216.1,26,214.9,23.3).closePath().moveTo(109.1,10.5).lineTo(108.5,8.2).curveTo(108.5,7.4,108.7,6.8).lineTo(108.7,6.7).lineTo(108.5,6.2).curveTo(108.5,3.8,110.1,2.4).curveTo(111.4,1.2,113.5,1.2).curveTo(115.6,1.2,116.9,2.4).curveTo(118.5,3.8,118.5,6.1).lineTo(118.5,6.4).lineTo(118.4,7.1).lineTo(118.5,8.1).lineTo(118.5,8.2).curveTo(118.5,9.8,117.5,11.2).curveTo(116.1,13.2,113.5,13.2).curveTo(110.2,13.2,109.1,10.5).closePath().moveTo(-56.1,5.3).lineTo(-56.7,3).curveTo(-56.7,2.2,-56.5,1.6).lineTo(-56.5,1.5).lineTo(-56.7,1).curveTo(-56.7,-1.4,-55.2,-2.8).curveTo(-53.7,-4,-51.7,-4).curveTo(-49.6,-4,-48.2,-2.8).curveTo(-46.7,-1.4,-46.7,0.9).lineTo(-46.7,1.2).lineTo(-46.8,1.9).lineTo(-46.7,2.9).lineTo(-46.7,3).curveTo(-46.7,4.6,-47.7,6).curveTo(-49.1,8,-51.7,8).curveTo(-54.9,8,-56.1,5.3).closePath().moveTo(-134.8,5.3).lineTo(-135.4,3).curveTo(-135.4,2.2,-135.2,1.6).lineTo(-135.2,1.5).lineTo(-135.4,1).curveTo(-135.4,-1.4,-133.8,-2.8).curveTo(-132.5,-4,-130.4,-4).curveTo(-128.3,-4,-127,-2.8).curveTo(-125.4,-1.4,-125.4,0.9).lineTo(-125.4,1.2).lineTo(-125.5,1.9).lineTo(-125.4,2.9).lineTo(-125.4,3).curveTo(-125.4,4.6,-126.4,6).curveTo(-127.8,8,-130.4,8).curveTo(-133.7,8,-134.8,5.3).closePath().moveTo(158,-24.3).lineTo(157.5,-26.6).curveTo(157.5,-27.4,157.7,-28).lineTo(157.7,-28.1).lineTo(157.5,-28.6).curveTo(157.5,-31,159,-32.4).curveTo(160.5,-33.6,162.5,-33.6).curveTo(164.6,-33.6,166,-32.4).curveTo(167.5,-31,167.5,-28.7).lineTo(167.5,-28.4).lineTo(167.4,-27.7).lineTo(167.5,-26.7).lineTo(167.5,-26.6).curveTo(167.5,-25,166.5,-23.6).curveTo(165.1,-21.6,162.5,-21.6).curveTo(159.3,-21.6,158,-24.3).closePath().moveTo(49.1,-29.5).lineTo(48.5,-31.8).curveTo(48.5,-32.6,48.7,-33.2).lineTo(48.7,-33.3).lineTo(48.5,-33.8).curveTo(48.5,-36.2,50,-37.6).curveTo(51.5,-38.8,53.5,-38.8).curveTo(55.6,-38.8,57,-37.6).curveTo(58.5,-36.2,58.5,-33.9).lineTo(58.5,-33.6).lineTo(58.4,-32.9).lineTo(58.5,-31.9).lineTo(58.5,-31.8).curveTo(58.5,-30.2,57.5,-28.8).curveTo(56.1,-26.8,53.5,-26.8).curveTo(50.3,-26.8,49.1,-29.5).closePath().moveTo(-6.9,-38.5).lineTo(-7.5,-40.8).curveTo(-7.5,-41.6,-7.3,-42.2).lineTo(-7.3,-42.3).lineTo(-7.5,-42.8).curveTo(-7.5,-45.2,-5.9,-46.6).curveTo(-4.5,-47.8,-2.5,-47.8).curveTo(-0.4,-47.8,0.9,-46.6).curveTo(2.5,-45.2,2.5,-42.9).lineTo(2.5,-42.6).lineTo(2.4,-41.9).lineTo(2.5,-40.9).lineTo(2.5,-40.8).curveTo(2.5,-39.2,1.5,-37.8).curveTo(0.1,-35.8,-2.5,-35.8).curveTo(-5.7,-35.8,-6.9,-38.5).closePath().moveTo(-211,-38.5).lineTo(-211.6,-40.8).curveTo(-211.6,-41.6,-211.4,-42.2).lineTo(-211.4,-42.3).lineTo(-211.6,-42.8).curveTo(-211.6,-45.2,-210.1,-46.6).curveTo(-208.6,-47.8,-206.6,-47.8).curveTo(-204.5,-47.8,-203.1,-46.6).curveTo(-201.6,-45.2,-201.6,-42.9).lineTo(-201.6,-42.6).lineTo(-201.7,-41.9).lineTo(-201.6,-40.9).lineTo(-201.6,-40.8).curveTo(-201.6,-39.2,-202.6,-37.8).curveTo(-204,-35.8,-206.6,-35.8).curveTo(-209.8,-35.8,-211,-38.5).closePath().moveTo(245.1,-56.8).lineTo(244.5,-59).curveTo(244.5,-59.8,244.7,-60.5).lineTo(244.7,-60.5).lineTo(244.5,-61).curveTo(244.5,-63.4,246.1,-64.8).curveTo(247.5,-66.1,249.5,-66.1).curveTo(251.6,-66.1,252.9,-64.8).curveTo(254.5,-63.5,254.5,-61.2).lineTo(254.5,-60.9).lineTo(254.4,-60.1).lineTo(254.5,-59.2).lineTo(254.5,-59).curveTo(254.5,-57.5,253.5,-56).curveTo(252.1,-54,249.5,-54).curveTo(246.3,-54,245.1,-56.8).closePath().moveTo(109.1,-79.5).lineTo(108.5,-81.8).curveTo(108.5,-82.6,108.7,-83.2).lineTo(108.7,-83.3).lineTo(108.5,-83.8).curveTo(108.5,-86.2,110.1,-87.6).curveTo(111.4,-88.8,113.5,-88.8).curveTo(115.6,-88.8,116.9,-87.6).curveTo(118.5,-86.2,118.5,-83.9).lineTo(118.5,-83.6).lineTo(118.4,-82.9).lineTo(118.5,-81.9).lineTo(118.5,-81.8).curveTo(118.5,-80.2,117.5,-78.8).curveTo(116.1,-76.8,113.5,-76.8).curveTo(110.2,-76.8,109.1,-79.5).closePath().moveTo(199.1,-87.5).lineTo(198.5,-89.8).curveTo(198.5,-90.6,198.7,-91.2).lineTo(198.7,-91.3).lineTo(198.5,-91.8).curveTo(198.5,-94.2,200.1,-95.6).curveTo(201.4,-96.8,203.5,-96.8).curveTo(205.6,-96.8,206.9,-95.6).curveTo(208.5,-94.2,208.5,-91.9).lineTo(208.5,-91.6).lineTo(208.4,-90.9).lineTo(208.5,-89.9).lineTo(208.5,-89.8).curveTo(208.5,-88.2,207.5,-86.8).curveTo(206.1,-84.8,203.5,-84.8).curveTo(200.2,-84.8,199.1,-87.5).closePath().moveTo(-91,-94.5).lineTo(-91.5,-96.8).curveTo(-91.5,-97.6,-91.3,-98.2).lineTo(-91.3,-98.3).lineTo(-91.5,-98.8).curveTo(-91.5,-101.2,-90,-102.6).curveTo(-88.6,-103.8,-86.5,-103.8).curveTo(-84.5,-103.8,-83.1,-102.6).curveTo(-81.6,-101.2,-81.5,-98.9).lineTo(-81.5,-98.6).lineTo(-81.6,-97.9).lineTo(-81.5,-96.9).lineTo(-81.5,-96.8).curveTo(-81.5,-95.2,-82.5,-93.8).curveTo(-83.9,-91.8,-86.5,-91.8).curveTo(-89.8,-91.8,-91,-94.5).closePath().moveTo(67.1,-105.5).lineTo(66.5,-107.8).curveTo(66.5,-108.6,66.7,-109.2).lineTo(66.7,-109.3).lineTo(66.5,-109.8).curveTo(66.5,-112.2,68,-113.6).curveTo(69.5,-114.8,71.5,-114.8).curveTo(73.6,-114.8,75,-113.6).curveTo(76.5,-112.2,76.5,-109.9).lineTo(76.5,-109.6).lineTo(76.4,-108.9).lineTo(76.5,-107.9).lineTo(76.5,-107.8).curveTo(76.5,-106.2,75.5,-104.8).curveTo(74.1,-102.8,71.5,-102.8).curveTo(68.3,-102.8,67.1,-105.5).closePath().moveTo(158,-107.5).lineTo(157.5,-109.8).curveTo(157.5,-110.6,157.7,-111.2).lineTo(157.7,-111.3).lineTo(157.5,-111.8).curveTo(157.5,-114.2,159,-115.6).curveTo(160.5,-116.8,162.5,-116.8).curveTo(164.6,-116.8,166,-115.6).curveTo(167.5,-114.2,167.5,-111.9).lineTo(167.5,-111.6).lineTo(167.4,-110.9).lineTo(167.5,-109.9).lineTo(167.5,-109.8).curveTo(167.5,-108.2,166.5,-106.8).curveTo(165.1,-104.8,162.5,-104.8).curveTo(159.3,-104.8,158,-107.5).closePath().moveTo(-254,-129.3).lineTo(-254.5,-131.6).curveTo(-254.5,-132.4,-254.3,-133).lineTo(-254.3,-133.1).lineTo(-254.5,-133.6).curveTo(-254.5,-136,-253,-137.4).curveTo(-251.6,-138.6,-249.5,-138.6).curveTo(-247.5,-138.6,-246.1,-137.4).curveTo(-244.6,-136,-244.5,-133.7).lineTo(-244.5,-133.4).lineTo(-244.6,-132.7).lineTo(-244.5,-131.7).lineTo(-244.5,-131.6).curveTo(-244.5,-130,-245.5,-128.6).curveTo(-246.9,-126.6,-249.5,-126.6).curveTo(-252.8,-126.6,-254,-129.3).closePath().moveTo(49.1,-139.5).lineTo(48.5,-141.8).curveTo(48.5,-142.6,48.7,-143.2).lineTo(48.7,-143.3).lineTo(48.5,-143.8).curveTo(48.5,-146.2,50,-147.6).curveTo(51.5,-148.8,53.5,-148.8).curveTo(55.6,-148.8,57,-147.6).curveTo(58.5,-146.2,58.5,-143.9).lineTo(58.5,-143.6).lineTo(58.4,-142.9).lineTo(58.5,-141.9).lineTo(58.5,-141.8).curveTo(58.5,-140.2,57.5,-138.8).curveTo(56.1,-136.8,53.5,-136.8).curveTo(50.3,-136.8,49.1,-139.5).closePath().moveTo(-191,-139.5).lineTo(-191.5,-141.8).curveTo(-191.5,-142.6,-191.3,-143.2).lineTo(-191.3,-143.3).lineTo(-191.5,-143.8).curveTo(-191.5,-146.2,-190,-147.6).curveTo(-188.6,-148.8,-186.5,-148.8).curveTo(-184.5,-148.8,-183.1,-147.6).curveTo(-181.6,-146.2,-181.5,-143.9).lineTo(-181.5,-143.6).lineTo(-181.6,-142.9).lineTo(-181.5,-141.9).lineTo(-181.5,-141.8).curveTo(-181.5,-140.2,-182.5,-138.8).curveTo(-183.9,-136.8,-186.5,-136.8).curveTo(-189.8,-136.8,-191,-139.5).closePath().moveTo(-6.9,-140.3).lineTo(-7.5,-142.6).curveTo(-7.5,-143.4,-7.3,-144).lineTo(-7.3,-144.1).lineTo(-7.5,-144.6).curveTo(-7.5,-147,-5.9,-148.4).curveTo(-4.5,-149.6,-2.5,-149.6).curveTo(-0.4,-149.6,0.9,-148.4).curveTo(2.5,-147,2.5,-144.7).lineTo(2.5,-144.4).lineTo(2.4,-143.7).lineTo(2.5,-142.7).lineTo(2.5,-142.6).curveTo(2.5,-141,1.5,-139.6).curveTo(0.1,-137.6,-2.5,-137.6).curveTo(-5.7,-137.6,-6.9,-140.3).closePath().moveTo(241,-143.5).lineTo(240.5,-145.8).curveTo(240.5,-146.6,240.7,-147.2).lineTo(240.7,-147.3).lineTo(240.5,-147.8).curveTo(240.5,-150.2,242,-151.6).curveTo(243.4,-152.8,245.5,-152.8).curveTo(247.5,-152.8,248.9,-151.6).curveTo(250.4,-150.2,250.5,-147.9).lineTo(250.5,-147.6).lineTo(250.4,-146.9).lineTo(250.5,-145.9).lineTo(250.5,-145.8).curveTo(250.5,-144.2,249.5,-142.8).curveTo(248.1,-140.8,245.5,-140.8).curveTo(242.2,-140.8,241,-143.5).closePath().moveTo(199.1,-150.5).lineTo(198.5,-152.8).curveTo(198.5,-153.6,198.7,-154.2).lineTo(198.7,-154.3).lineTo(198.5,-154.8).curveTo(198.5,-157.2,200.1,-158.6).curveTo(201.4,-159.8,203.5,-159.8).curveTo(205.6,-159.8,206.9,-158.6).curveTo(208.5,-157.2,208.5,-154.9).lineTo(208.5,-154.6).lineTo(208.4,-153.9).lineTo(208.5,-152.9).lineTo(208.5,-152.8).curveTo(208.5,-151.2,207.5,-149.8).curveTo(206.1,-147.8,203.5,-147.8).curveTo(200.2,-147.8,199.1,-150.5).closePath().moveTo(138.1,-174.2).lineTo(137.5,-176.4).curveTo(137.5,-177.2,137.7,-177.9).lineTo(137.7,-177.9).lineTo(137.5,-178.4).curveTo(137.5,-180.8,139.1,-182.2).curveTo(140.5,-183.5,142.5,-183.5).curveTo(144.5,-183.5,146,-182.2).curveTo(147.5,-180.9,147.5,-178.6).lineTo(147.5,-178.3).lineTo(147.4,-177.5).lineTo(147.5,-176.6).lineTo(147.5,-176.4).curveTo(147.5,-174.9,146.5,-173.4).curveTo(145.1,-171.4,142.5,-171.4).curveTo(139.3,-171.4,138.1,-174.2).closePath().moveTo(-101.1,-175.1).lineTo(-101.6,-177.4).curveTo(-101.6,-178.2,-101.4,-178.8).lineTo(-101.4,-178.9).lineTo(-101.6,-179.4).curveTo(-101.6,-181.8,-100.1,-183.2).curveTo(-98.7,-184.4,-96.6,-184.4).curveTo(-94.6,-184.4,-93.1,-183.2).curveTo(-91.7,-181.8,-91.6,-179.5).lineTo(-91.6,-179.2).lineTo(-91.7,-178.5).lineTo(-91.6,-177.5).lineTo(-91.6,-177.4).curveTo(-91.6,-175.8,-92.6,-174.4).curveTo(-94,-172.4,-96.6,-172.4).curveTo(-99.9,-172.4,-101.1,-175.1).closePath().moveTo(184.1,-192.5).lineTo(183.5,-194.8).curveTo(183.5,-195.6,183.7,-196.2).lineTo(183.7,-196.3).lineTo(183.5,-196.8).curveTo(183.5,-199.2,185,-200.6).curveTo(186.5,-201.8,188.5,-201.8).curveTo(190.6,-201.8,192,-200.6).curveTo(193.5,-199.2,193.5,-196.9).lineTo(193.5,-196.6).lineTo(193.4,-195.9).lineTo(193.5,-194.9).lineTo(193.5,-194.8).curveTo(193.5,-193.2,192.5,-191.8).curveTo(191.1,-189.8,188.5,-189.8).curveTo(185.3,-189.8,184.1,-192.5).closePath().moveTo(-46.1,-196.5).lineTo(-46.6,-198.8).curveTo(-46.6,-199.6,-46.4,-200.2).lineTo(-46.4,-200.3).lineTo(-46.6,-200.8).curveTo(-46.6,-203.2,-45.1,-204.6).curveTo(-43.7,-205.8,-41.6,-205.8).curveTo(-39.6,-205.8,-38.1,-204.6).curveTo(-36.7,-203.2,-36.6,-200.9).lineTo(-36.6,-200.6).lineTo(-36.7,-199.9).lineTo(-36.6,-198.9).lineTo(-36.6,-198.8).curveTo(-36.6,-197.2,-37.6,-195.8).curveTo(-39,-193.8,-41.6,-193.8).curveTo(-44.9,-193.8,-46.1,-196.5).closePath().moveTo(-145,-200.9).lineTo(-145.5,-203.1).curveTo(-145.5,-203.9,-145.3,-204.6).lineTo(-145.3,-204.6).lineTo(-145.5,-205.1).curveTo(-145.5,-207.5,-144,-208.9).curveTo(-142.6,-210.2,-140.5,-210.2).curveTo(-138.5,-210.2,-137.1,-208.9).curveTo(-135.6,-207.6,-135.5,-205.3).lineTo(-135.5,-205).lineTo(-135.6,-204.2).lineTo(-135.5,-203.3).lineTo(-135.5,-203.1).curveTo(-135.5,-201.6,-136.5,-200.1).curveTo(-137.9,-198.1,-140.5,-198.1).curveTo(-143.8,-198.1,-145,-200.9).closePath().moveTo(69.1,-204.6).lineTo(68.6,-206.8).curveTo(68.6,-207.6,68.8,-208.3).lineTo(68.8,-208.3).lineTo(68.6,-208.8).curveTo(68.6,-211.2,70.1,-212.6).curveTo(71.5,-213.9,73.6,-213.9).curveTo(75.6,-213.9,77,-212.6).curveTo(78.5,-211.3,78.6,-209).lineTo(78.6,-208.7).lineTo(78.5,-207.9).lineTo(78.6,-207).lineTo(78.6,-206.8).curveTo(78.6,-205.3,77.6,-203.8).curveTo(76.2,-201.8,73.6,-201.8).curveTo(70.3,-201.8,69.1,-204.6).closePath().moveTo(235.1,-209.9).lineTo(234.5,-212.2).curveTo(234.5,-213,234.7,-213.6).lineTo(234.7,-213.7).lineTo(234.5,-214.2).curveTo(234.5,-216.6,236.1,-218).curveTo(237.4,-219.2,239.5,-219.2).curveTo(241.5,-219.2,242.9,-218).curveTo(244.4,-216.6,244.5,-214.3).lineTo(244.5,-214).lineTo(244.4,-213.3).lineTo(244.5,-212.3).lineTo(244.5,-212.2).curveTo(244.5,-210.6,243.5,-209.2).curveTo(242.1,-207.2,239.5,-207.2).curveTo(236.2,-207.2,235.1,-209.9).closePath();
	this.shape_87.setTransform(301.4,274.175);

	this.shape_88 = new cjs.Shape();
	this.shape_88.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(234.4,-199.4).lineTo(234.4,-227).curveTo(234.6,-224.3,237.4,-222.3).curveTo(240.3,-220.2,244.6,-220.2).moveTo(183.4,-182).lineTo(183.4,-209.6).curveTo(183.6,-206.9,186.4,-204.9).curveTo(189.4,-202.8,193.6,-202.8).moveTo(198.4,-140).lineTo(198.4,-167.6).curveTo(198.6,-164.9,201.4,-162.9).curveTo(204.3,-160.8,208.6,-160.8).moveTo(240.4,-133).lineTo(240.4,-160.6).curveTo(240.6,-157.9,243.4,-155.9).curveTo(246.3,-153.8,250.6,-153.8).moveTo(198.4,-77).lineTo(198.4,-104.6).curveTo(198.6,-101.9,201.4,-99.9).curveTo(204.3,-97.8,208.6,-97.8).moveTo(244.4,-46.2).lineTo(244.4,-73.9).curveTo(244.6,-71.1,247.4,-69.1).curveTo(250.3,-67.1,254.6,-67.1).moveTo(137.4,-163.6).lineTo(137.4,-191.3).curveTo(137.6,-188.5,140.4,-186.5).curveTo(143.4,-184.5,147.6,-184.5).moveTo(68.6,-194).lineTo(68.6,-221.7).curveTo(68.7,-218.9,71.5,-216.9).curveTo(74.4,-214.9,78.7,-214.9).moveTo(66.4,-95).lineTo(66.4,-122.6).curveTo(66.6,-119.9,69.4,-117.9).curveTo(72.4,-115.8,76.6,-115.8).moveTo(48.4,-129).lineTo(48.4,-156.6).curveTo(48.6,-153.9,51.4,-151.9).curveTo(54.4,-149.8,58.6,-149.8).moveTo(157.4,-97).lineTo(157.4,-124.6).curveTo(157.6,-121.9,160.4,-119.9).curveTo(163.4,-117.8,167.6,-117.8).moveTo(108.4,-69).lineTo(108.4,-96.6).curveTo(108.6,-93.9,111.4,-91.9).curveTo(114.4,-89.8,118.6,-89.8).moveTo(157.4,-13.8).lineTo(157.4,-41.4).curveTo(157.6,-38.7,160.4,-36.7).curveTo(163.4,-34.6,167.6,-34.6).moveTo(108.4,21).lineTo(108.4,-6.6).curveTo(108.6,-3.9,111.4,-1.9).curveTo(114.4,0.2,118.6,0.2).moveTo(157.4,53).lineTo(157.4,25.4).curveTo(157.6,28.1,160.4,30.1).curveTo(163.4,32.2,167.6,32.2).moveTo(48.4,-19).lineTo(48.4,-46.6).curveTo(48.6,-43.9,51.4,-41.9).curveTo(54.4,-39.8,58.6,-39.8).moveTo(38.4,75).lineTo(38.4,47.4).curveTo(38.6,50.1,41.4,52.1).curveTo(44.4,54.2,48.6,54.2).moveTo(101.4,109.8).lineTo(101.4,82.2).curveTo(101.5,84.9,104.4,86.9).curveTo(107.3,89,111.5,89).moveTo(214.3,33.8).lineTo(214.3,6.2).curveTo(214.4,8.9,217.3,10.9).curveTo(220.3,13,224.4,13).moveTo(183.4,123).lineTo(183.4,95.4).curveTo(183.6,98.1,186.4,100.1).curveTo(189.4,102.2,193.6,102.2).moveTo(-46.6,-186).lineTo(-46.6,-213.6).curveTo(-46.6,-210.9,-43.7,-208.9).curveTo(-40.8,-206.8,-36.6,-206.8).moveTo(-145.5,-190.3).lineTo(-145.5,-218).curveTo(-145.4,-215.2,-142.6,-213.2).curveTo(-139.6,-211.2,-135.4,-211.2).moveTo(-101.6,-164.6).lineTo(-101.6,-192.2).curveTo(-101.5,-189.5,-98.7,-187.5).curveTo(-95.8,-185.4,-91.5,-185.4).moveTo(-91.5,-84).lineTo(-91.5,-111.6).curveTo(-91.4,-108.9,-88.6,-106.9).curveTo(-85.6,-104.8,-81.4,-104.8).moveTo(-7.6,-129.8).lineTo(-7.6,-157.4).curveTo(-7.4,-154.7,-4.6,-152.7).curveTo(-1.6,-150.6,2.6,-150.6).moveTo(-254.5,-118.8).lineTo(-254.5,-146.4).curveTo(-254.4,-143.7,-251.6,-141.7).curveTo(-248.6,-139.6,-244.4,-139.6).moveTo(-191.5,-129).lineTo(-191.5,-156.6).curveTo(-191.4,-153.9,-188.6,-151.9).curveTo(-185.6,-149.8,-181.4,-149.8).moveTo(-211.6,-28).lineTo(-211.6,-55.6).curveTo(-211.5,-52.9,-208.7,-50.9).curveTo(-205.8,-48.8,-201.5,-48.8).moveTo(-155.5,93).lineTo(-155.5,65.3).curveTo(-155.4,68.1,-152.6,70.1).curveTo(-149.6,72.1,-145.4,72.1).moveTo(-7.6,-28).lineTo(-7.6,-55.6).curveTo(-7.4,-52.9,-4.6,-50.9).curveTo(-1.6,-48.8,2.6,-48.8).moveTo(-56.8,15.8).lineTo(-56.8,-11.8).curveTo(-56.6,-9.1,-53.8,-7.1).curveTo(-50.8,-5,-46.6,-5).moveTo(-135.4,15.8).lineTo(-135.4,-11.8).curveTo(-135.3,-9.1,-132.5,-7.1).curveTo(-129.5,-5,-125.3,-5).moveTo(-36.6,110).lineTo(-36.6,82.4).curveTo(-36.4,85.1,-33.6,87.1).curveTo(-30.6,89.2,-26.4,89.2).moveTo(-131.5,191).lineTo(-131.5,163.4).curveTo(-131.4,166.1,-128.6,168.1).curveTo(-125.6,170.2,-121.4,170.2).moveTo(-71.5,227).lineTo(-71.5,199.4).curveTo(-71.4,202.1,-68.6,204.1).curveTo(-65.6,206.2,-61.4,206.2).moveTo(108.4,173).lineTo(108.4,145.4).curveTo(108.6,148.1,111.4,150.1).curveTo(114.4,152.2,118.6,152.2).moveTo(18.4,201).lineTo(18.4,173.4).curveTo(18.6,176.1,21.4,178.1).curveTo(24.4,180.2,28.6,180.2);
	this.shape_88.setTransform(311.45,259.225);

	this.shape_89 = new cjs.Shape();
	this.shape_89.graphics.beginFill("#000000").beginStroke().moveTo(-70.9,216.5).lineTo(-71.5,214.2).curveTo(-71.5,213.4,-71.3,212.8).lineTo(-71.3,212.7).lineTo(-71.5,212.2).curveTo(-71.5,209.8,-69.9,208.4).curveTo(-68.6,207.2,-66.5,207.2).curveTo(-64.4,207.2,-63.1,208.4).curveTo(-61.6,209.8,-61.5,212.1).lineTo(-61.5,212.4).lineTo(-61.6,213.1).lineTo(-61.5,214.1).lineTo(-61.5,214.2).curveTo(-61.5,215.8,-62.5,217.2).curveTo(-63.9,219.2,-66.5,219.2).curveTo(-69.8,219.2,-70.9,216.5).closePath().moveTo(19.1,190.5).lineTo(18.5,188.2).curveTo(18.5,187.4,18.7,186.8).lineTo(18.7,186.7).lineTo(18.5,186.2).curveTo(18.5,183.8,20.1,182.4).curveTo(21.4,181.2,23.5,181.2).curveTo(25.6,181.2,26.9,182.4).curveTo(28.4,183.8,28.5,186.1).lineTo(28.5,186.4).lineTo(28.4,187.1).lineTo(28.5,188.1).lineTo(28.5,188.2).curveTo(28.5,189.8,27.5,191.2).curveTo(26.1,193.2,23.5,193.2).curveTo(20.2,193.2,19.1,190.5).closePath().moveTo(-130.9,180.5).lineTo(-131.5,178.2).curveTo(-131.5,177.4,-131.3,176.8).lineTo(-131.3,176.7).lineTo(-131.5,176.2).curveTo(-131.5,173.8,-130,172.4).curveTo(-128.5,171.2,-126.5,171.2).curveTo(-124.4,171.2,-123,172.4).curveTo(-121.5,173.8,-121.5,176.1).lineTo(-121.5,176.4).lineTo(-121.6,177.1).lineTo(-121.5,178.1).lineTo(-121.5,178.2).curveTo(-121.5,179.8,-122.5,181.2).curveTo(-123.9,183.2,-126.5,183.2).curveTo(-129.7,183.2,-130.9,180.5).closePath().moveTo(109.1,162.5).lineTo(108.5,160.2).curveTo(108.5,159.4,108.7,158.8).lineTo(108.7,158.7).lineTo(108.5,158.2).curveTo(108.5,155.8,110.1,154.4).curveTo(111.4,153.2,113.5,153.2).curveTo(115.6,153.2,116.9,154.4).curveTo(118.5,155.8,118.5,158.1).lineTo(118.5,158.4).lineTo(118.4,159.1).lineTo(118.5,160.1).lineTo(118.5,160.2).curveTo(118.5,161.8,117.5,163.2).curveTo(116.1,165.2,113.5,165.2).curveTo(110.2,165.2,109.1,162.5).closePath().moveTo(184.1,112.5).lineTo(183.5,110.2).curveTo(183.5,109.4,183.7,108.8).lineTo(183.7,108.7).lineTo(183.5,108.2).curveTo(183.5,105.8,185,104.4).curveTo(186.5,103.2,188.5,103.2).curveTo(190.6,103.2,192,104.4).curveTo(193.5,105.8,193.5,108.1).lineTo(193.5,108.4).lineTo(193.4,109.1).lineTo(193.5,110.1).lineTo(193.5,110.2).curveTo(193.5,111.8,192.5,113.2).curveTo(191.1,115.2,188.5,115.2).curveTo(185.3,115.2,184.1,112.5).closePath().moveTo(-36,99.5).lineTo(-36.5,97.2).curveTo(-36.5,96.4,-36.3,95.8).lineTo(-36.3,95.7).lineTo(-36.5,95.2).curveTo(-36.5,92.8,-34.9,91.4).curveTo(-33.6,90.2,-31.5,90.2).curveTo(-29.5,90.2,-28.1,91.4).curveTo(-26.6,92.8,-26.5,95.1).lineTo(-26.5,95.4).lineTo(-26.6,96.1).lineTo(-26.5,97.1).lineTo(-26.5,97.2).curveTo(-26.5,98.8,-27.5,100.2).curveTo(-28.9,102.2,-31.5,102.2).curveTo(-34.8,102.2,-36,99.5).closePath().moveTo(102,99.3).lineTo(101.4,97).curveTo(101.4,96.2,101.6,95.6).lineTo(101.6,95.5).lineTo(101.4,95).curveTo(101.5,92.6,103,91.2).curveTo(104.4,90,106.5,90).curveTo(108.5,90,109.9,91.2).curveTo(111.4,92.6,111.4,94.9).lineTo(111.4,95.2).lineTo(111.3,95.9).lineTo(111.4,96.9).lineTo(111.4,97).curveTo(111.5,98.6,110.4,100).curveTo(109.1,102,106.5,102).curveTo(103.2,102,102,99.3).closePath().moveTo(-155,82.4).lineTo(-155.5,80.2).curveTo(-155.5,79.4,-155.3,78.7).lineTo(-155.3,78.7).lineTo(-155.5,78.2).curveTo(-155.5,75.8,-154,74.4).curveTo(-152.6,73.1,-150.5,73.1).curveTo(-148.5,73.1,-147.1,74.4).curveTo(-145.6,75.7,-145.5,78).lineTo(-145.5,78.3).lineTo(-145.6,79.1).lineTo(-145.5,80).lineTo(-145.5,80.2).curveTo(-145.5,81.7,-146.5,83.2).curveTo(-147.9,85.2,-150.5,85.2).curveTo(-153.8,85.2,-155,82.4).closePath().moveTo(39.1,64.5).lineTo(38.5,62.2).curveTo(38.5,61.4,38.7,60.8).lineTo(38.7,60.7).lineTo(38.5,60.2).curveTo(38.5,57.8,40.1,56.4).curveTo(41.5,55.2,43.5,55.2).curveTo(45.5,55.2,47,56.4).curveTo(48.5,57.8,48.5,60.1).lineTo(48.5,60.4).lineTo(48.4,61.1).lineTo(48.5,62.1).lineTo(48.5,62.2).curveTo(48.5,63.8,47.5,65.2).curveTo(46.1,67.2,43.5,67.2).curveTo(40.3,67.2,39.1,64.5).closePath().moveTo(158,42.5).lineTo(157.5,40.2).curveTo(157.5,39.4,157.7,38.8).lineTo(157.7,38.7).lineTo(157.5,38.2).curveTo(157.5,35.8,159,34.4).curveTo(160.5,33.2,162.5,33.2).curveTo(164.6,33.2,166,34.4).curveTo(167.5,35.8,167.5,38.1).lineTo(167.5,38.4).lineTo(167.4,39.1).lineTo(167.5,40.1).lineTo(167.5,40.2).curveTo(167.5,41.8,166.5,43.2).curveTo(165.1,45.2,162.5,45.2).curveTo(159.3,45.2,158,42.5).closePath().moveTo(214.9,23.3).lineTo(214.4,21).curveTo(214.4,20.2,214.6,19.6).lineTo(214.6,19.5).lineTo(214.4,19).curveTo(214.4,16.6,215.9,15.2).curveTo(217.3,14,219.4,14).curveTo(221.4,14,222.9,15.2).curveTo(224.3,16.6,224.4,18.9).lineTo(224.4,19.2).lineTo(224.3,19.9).lineTo(224.4,20.9).lineTo(224.4,21).curveTo(224.4,22.6,223.4,24).curveTo(222,26,219.4,26).curveTo(216.1,26,214.9,23.3).closePath().moveTo(109.1,10.5).lineTo(108.5,8.2).curveTo(108.5,7.4,108.7,6.8).lineTo(108.7,6.7).lineTo(108.5,6.2).curveTo(108.5,3.8,110.1,2.4).curveTo(111.4,1.2,113.5,1.2).curveTo(115.6,1.2,116.9,2.4).curveTo(118.5,3.8,118.5,6.1).lineTo(118.5,6.4).lineTo(118.4,7.1).lineTo(118.5,8.1).lineTo(118.5,8.2).curveTo(118.5,9.8,117.5,11.2).curveTo(116.1,13.2,113.5,13.2).curveTo(110.2,13.2,109.1,10.5).closePath().moveTo(-56.1,5.3).lineTo(-56.7,3).curveTo(-56.7,2.2,-56.5,1.6).lineTo(-56.5,1.5).lineTo(-56.7,1).curveTo(-56.7,-1.4,-55.2,-2.8).curveTo(-53.7,-4,-51.7,-4).curveTo(-49.6,-4,-48.2,-2.8).curveTo(-46.7,-1.4,-46.7,0.9).lineTo(-46.7,1.2).lineTo(-46.8,1.9).lineTo(-46.7,2.9).lineTo(-46.7,3).curveTo(-46.7,4.6,-47.7,6).curveTo(-49.1,8,-51.7,8).curveTo(-54.9,8,-56.1,5.3).closePath().moveTo(-134.8,5.3).lineTo(-135.4,3).curveTo(-135.4,2.2,-135.2,1.6).lineTo(-135.2,1.5).lineTo(-135.4,1).curveTo(-135.4,-1.4,-133.8,-2.8).curveTo(-132.5,-4,-130.4,-4).curveTo(-128.3,-4,-127,-2.8).curveTo(-125.4,-1.4,-125.4,0.9).lineTo(-125.4,1.2).lineTo(-125.5,1.9).lineTo(-125.4,2.9).lineTo(-125.4,3).curveTo(-125.4,4.6,-126.4,6).curveTo(-127.8,8,-130.4,8).curveTo(-133.7,8,-134.8,5.3).closePath().moveTo(158,-24.3).lineTo(157.5,-26.6).curveTo(157.5,-27.4,157.7,-28).lineTo(157.7,-28.1).lineTo(157.5,-28.6).curveTo(157.5,-31,159,-32.4).curveTo(160.5,-33.6,162.5,-33.6).curveTo(164.6,-33.6,166,-32.4).curveTo(167.5,-31,167.5,-28.7).lineTo(167.5,-28.4).lineTo(167.4,-27.7).lineTo(167.5,-26.7).lineTo(167.5,-26.6).curveTo(167.5,-25,166.5,-23.6).curveTo(165.1,-21.6,162.5,-21.6).curveTo(159.3,-21.6,158,-24.3).closePath().moveTo(49.1,-29.5).lineTo(48.5,-31.8).curveTo(48.5,-32.6,48.7,-33.2).lineTo(48.7,-33.3).lineTo(48.5,-33.8).curveTo(48.5,-36.2,50,-37.6).curveTo(51.5,-38.8,53.5,-38.8).curveTo(55.6,-38.8,57,-37.6).curveTo(58.5,-36.2,58.5,-33.9).lineTo(58.5,-33.6).lineTo(58.4,-32.9).lineTo(58.5,-31.9).lineTo(58.5,-31.8).curveTo(58.5,-30.2,57.5,-28.8).curveTo(56.1,-26.8,53.5,-26.8).curveTo(50.3,-26.8,49.1,-29.5).closePath().moveTo(-6.9,-38.5).lineTo(-7.5,-40.8).curveTo(-7.5,-41.6,-7.3,-42.2).lineTo(-7.3,-42.3).lineTo(-7.5,-42.8).curveTo(-7.5,-45.2,-5.9,-46.6).curveTo(-4.5,-47.8,-2.5,-47.8).curveTo(-0.4,-47.8,0.9,-46.6).curveTo(2.5,-45.2,2.5,-42.9).lineTo(2.5,-42.6).lineTo(2.4,-41.9).lineTo(2.5,-40.9).lineTo(2.5,-40.8).curveTo(2.5,-39.2,1.5,-37.8).curveTo(0.1,-35.8,-2.5,-35.8).curveTo(-5.7,-35.8,-6.9,-38.5).closePath().moveTo(-211,-38.5).lineTo(-211.6,-40.8).curveTo(-211.6,-41.6,-211.4,-42.2).lineTo(-211.4,-42.3).lineTo(-211.6,-42.8).curveTo(-211.6,-45.2,-210.1,-46.6).curveTo(-208.6,-47.8,-206.6,-47.8).curveTo(-204.5,-47.8,-203.1,-46.6).curveTo(-201.6,-45.2,-201.6,-42.9).lineTo(-201.6,-42.6).lineTo(-201.7,-41.9).lineTo(-201.6,-40.9).lineTo(-201.6,-40.8).curveTo(-201.6,-39.2,-202.6,-37.8).curveTo(-204,-35.8,-206.6,-35.8).curveTo(-209.8,-35.8,-211,-38.5).closePath().moveTo(245.1,-56.8).lineTo(244.5,-59).curveTo(244.5,-59.8,244.7,-60.5).lineTo(244.7,-60.5).lineTo(244.5,-61).curveTo(244.5,-63.4,246.1,-64.8).curveTo(247.5,-66.1,249.5,-66.1).curveTo(251.6,-66.1,252.9,-64.8).curveTo(254.5,-63.5,254.5,-61.2).lineTo(254.5,-60.9).lineTo(254.4,-60.1).lineTo(254.5,-59.2).lineTo(254.5,-59).curveTo(254.5,-57.5,253.5,-56).curveTo(252.1,-54,249.5,-54).curveTo(246.3,-54,245.1,-56.8).closePath().moveTo(109.1,-79.5).lineTo(108.5,-81.8).curveTo(108.5,-82.6,108.7,-83.2).lineTo(108.7,-83.3).lineTo(108.5,-83.8).curveTo(108.5,-86.2,110.1,-87.6).curveTo(111.4,-88.8,113.5,-88.8).curveTo(115.6,-88.8,116.9,-87.6).curveTo(118.5,-86.2,118.5,-83.9).lineTo(118.5,-83.6).lineTo(118.4,-82.9).lineTo(118.5,-81.9).lineTo(118.5,-81.8).curveTo(118.5,-80.2,117.5,-78.8).curveTo(116.1,-76.8,113.5,-76.8).curveTo(110.2,-76.8,109.1,-79.5).closePath().moveTo(199.1,-87.5).lineTo(198.5,-89.8).curveTo(198.5,-90.6,198.7,-91.2).lineTo(198.7,-91.3).lineTo(198.5,-91.8).curveTo(198.5,-94.2,200.1,-95.6).curveTo(201.4,-96.8,203.5,-96.8).curveTo(205.6,-96.8,206.9,-95.6).curveTo(208.5,-94.2,208.5,-91.9).lineTo(208.5,-91.6).lineTo(208.4,-90.9).lineTo(208.5,-89.9).lineTo(208.5,-89.8).curveTo(208.5,-88.2,207.5,-86.8).curveTo(206.1,-84.8,203.5,-84.8).curveTo(200.2,-84.8,199.1,-87.5).closePath().moveTo(-91,-94.5).lineTo(-91.5,-96.8).curveTo(-91.5,-97.6,-91.3,-98.2).lineTo(-91.3,-98.3).lineTo(-91.5,-98.8).curveTo(-91.5,-101.2,-90,-102.6).curveTo(-88.6,-103.8,-86.5,-103.8).curveTo(-84.5,-103.8,-83.1,-102.6).curveTo(-81.6,-101.2,-81.5,-98.9).lineTo(-81.5,-98.6).lineTo(-81.6,-97.9).lineTo(-81.5,-96.9).lineTo(-81.5,-96.8).curveTo(-81.5,-95.2,-82.5,-93.8).curveTo(-83.9,-91.8,-86.5,-91.8).curveTo(-89.8,-91.8,-91,-94.5).closePath().moveTo(67.1,-105.5).lineTo(66.5,-107.8).curveTo(66.5,-108.6,66.7,-109.2).lineTo(66.7,-109.3).lineTo(66.5,-109.8).curveTo(66.5,-112.2,68,-113.6).curveTo(69.5,-114.8,71.5,-114.8).curveTo(73.6,-114.8,75,-113.6).curveTo(76.5,-112.2,76.5,-109.9).lineTo(76.5,-109.6).lineTo(76.4,-108.9).lineTo(76.5,-107.9).lineTo(76.5,-107.8).curveTo(76.5,-106.2,75.5,-104.8).curveTo(74.1,-102.8,71.5,-102.8).curveTo(68.3,-102.8,67.1,-105.5).closePath().moveTo(158,-107.5).lineTo(157.5,-109.8).curveTo(157.5,-110.6,157.7,-111.2).lineTo(157.7,-111.3).lineTo(157.5,-111.8).curveTo(157.5,-114.2,159,-115.6).curveTo(160.5,-116.8,162.5,-116.8).curveTo(164.6,-116.8,166,-115.6).curveTo(167.5,-114.2,167.5,-111.9).lineTo(167.5,-111.6).lineTo(167.4,-110.9).lineTo(167.5,-109.9).lineTo(167.5,-109.8).curveTo(167.5,-108.2,166.5,-106.8).curveTo(165.1,-104.8,162.5,-104.8).curveTo(159.3,-104.8,158,-107.5).closePath().moveTo(-254,-129.3).lineTo(-254.5,-131.6).curveTo(-254.5,-132.4,-254.3,-133).lineTo(-254.3,-133.1).lineTo(-254.5,-133.6).curveTo(-254.5,-136,-253,-137.4).curveTo(-251.6,-138.6,-249.5,-138.6).curveTo(-247.5,-138.6,-246.1,-137.4).curveTo(-244.6,-136,-244.5,-133.7).lineTo(-244.5,-133.4).lineTo(-244.6,-132.7).lineTo(-244.5,-131.7).lineTo(-244.5,-131.6).curveTo(-244.5,-130,-245.5,-128.6).curveTo(-246.9,-126.6,-249.5,-126.6).curveTo(-252.8,-126.6,-254,-129.3).closePath().moveTo(49.1,-139.5).lineTo(48.5,-141.8).curveTo(48.5,-142.6,48.7,-143.2).lineTo(48.7,-143.3).lineTo(48.5,-143.8).curveTo(48.5,-146.2,50,-147.6).curveTo(51.5,-148.8,53.5,-148.8).curveTo(55.6,-148.8,57,-147.6).curveTo(58.5,-146.2,58.5,-143.9).lineTo(58.5,-143.6).lineTo(58.4,-142.9).lineTo(58.5,-141.9).lineTo(58.5,-141.8).curveTo(58.5,-140.2,57.5,-138.8).curveTo(56.1,-136.8,53.5,-136.8).curveTo(50.3,-136.8,49.1,-139.5).closePath().moveTo(-191,-139.5).lineTo(-191.5,-141.8).curveTo(-191.5,-142.6,-191.3,-143.2).lineTo(-191.3,-143.3).lineTo(-191.5,-143.8).curveTo(-191.5,-146.2,-190,-147.6).curveTo(-188.6,-148.8,-186.5,-148.8).curveTo(-184.5,-148.8,-183.1,-147.6).curveTo(-181.6,-146.2,-181.5,-143.9).lineTo(-181.5,-143.6).lineTo(-181.6,-142.9).lineTo(-181.5,-141.9).lineTo(-181.5,-141.8).curveTo(-181.5,-140.2,-182.5,-138.8).curveTo(-183.9,-136.8,-186.5,-136.8).curveTo(-189.8,-136.8,-191,-139.5).closePath().moveTo(-6.9,-140.3).lineTo(-7.5,-142.6).curveTo(-7.5,-143.4,-7.3,-144).lineTo(-7.3,-144.1).lineTo(-7.5,-144.6).curveTo(-7.5,-147,-5.9,-148.4).curveTo(-4.5,-149.6,-2.5,-149.6).curveTo(-0.4,-149.6,0.9,-148.4).curveTo(2.5,-147,2.5,-144.7).lineTo(2.5,-144.4).lineTo(2.4,-143.7).lineTo(2.5,-142.7).lineTo(2.5,-142.6).curveTo(2.5,-141,1.5,-139.6).curveTo(0.1,-137.6,-2.5,-137.6).curveTo(-5.7,-137.6,-6.9,-140.3).closePath().moveTo(241,-143.5).lineTo(240.5,-145.8).curveTo(240.5,-146.6,240.7,-147.2).lineTo(240.7,-147.3).lineTo(240.5,-147.8).curveTo(240.5,-150.2,242,-151.6).curveTo(243.4,-152.8,245.5,-152.8).curveTo(247.5,-152.8,248.9,-151.6).curveTo(250.4,-150.2,250.5,-147.9).lineTo(250.5,-147.6).lineTo(250.4,-146.9).lineTo(250.5,-145.9).lineTo(250.5,-145.8).curveTo(250.5,-144.2,249.5,-142.8).curveTo(248.1,-140.8,245.5,-140.8).curveTo(242.2,-140.8,241,-143.5).closePath().moveTo(199.1,-150.5).lineTo(198.5,-152.8).curveTo(198.5,-153.6,198.7,-154.2).lineTo(198.7,-154.3).lineTo(198.5,-154.8).curveTo(198.5,-157.2,200.1,-158.6).curveTo(201.4,-159.8,203.5,-159.8).curveTo(205.6,-159.8,206.9,-158.6).curveTo(208.5,-157.2,208.5,-154.9).lineTo(208.5,-154.6).lineTo(208.4,-153.9).lineTo(208.5,-152.9).lineTo(208.5,-152.8).curveTo(208.5,-151.2,207.5,-149.8).curveTo(206.1,-147.8,203.5,-147.8).curveTo(200.2,-147.8,199.1,-150.5).closePath().moveTo(138.1,-174.2).lineTo(137.5,-176.4).curveTo(137.5,-177.2,137.7,-177.9).lineTo(137.7,-177.9).lineTo(137.5,-178.4).curveTo(137.5,-180.8,139.1,-182.2).curveTo(140.5,-183.5,142.5,-183.5).curveTo(144.5,-183.5,146,-182.2).curveTo(147.5,-180.9,147.5,-178.6).lineTo(147.5,-178.3).lineTo(147.4,-177.5).lineTo(147.5,-176.6).lineTo(147.5,-176.4).curveTo(147.5,-174.9,146.5,-173.4).curveTo(145.1,-171.4,142.5,-171.4).curveTo(139.3,-171.4,138.1,-174.2).closePath().moveTo(-101.1,-175.1).lineTo(-101.6,-177.4).curveTo(-101.6,-178.2,-101.4,-178.8).lineTo(-101.4,-178.9).lineTo(-101.6,-179.4).curveTo(-101.6,-181.8,-100.1,-183.2).curveTo(-98.7,-184.4,-96.6,-184.4).curveTo(-94.6,-184.4,-93.1,-183.2).curveTo(-91.7,-181.8,-91.6,-179.5).lineTo(-91.6,-179.2).lineTo(-91.7,-178.5).lineTo(-91.6,-177.5).lineTo(-91.6,-177.4).curveTo(-91.6,-175.8,-92.6,-174.4).curveTo(-94,-172.4,-96.6,-172.4).curveTo(-99.9,-172.4,-101.1,-175.1).closePath().moveTo(184.1,-192.5).lineTo(183.5,-194.8).curveTo(183.5,-195.6,183.7,-196.2).lineTo(183.7,-196.3).lineTo(183.5,-196.8).curveTo(183.5,-199.2,185,-200.6).curveTo(186.5,-201.8,188.5,-201.8).curveTo(190.6,-201.8,192,-200.6).curveTo(193.5,-199.2,193.5,-196.9).lineTo(193.5,-196.6).lineTo(193.4,-195.9).lineTo(193.5,-194.9).lineTo(193.5,-194.8).curveTo(193.5,-193.2,192.5,-191.8).curveTo(191.1,-189.8,188.5,-189.8).curveTo(185.3,-189.8,184.1,-192.5).closePath().moveTo(-46.1,-196.5).lineTo(-46.6,-198.8).curveTo(-46.6,-199.6,-46.4,-200.2).lineTo(-46.4,-200.3).lineTo(-46.6,-200.8).curveTo(-46.6,-203.2,-45.1,-204.6).curveTo(-43.7,-205.8,-41.6,-205.8).curveTo(-39.6,-205.8,-38.1,-204.6).curveTo(-36.7,-203.2,-36.6,-200.9).lineTo(-36.6,-200.6).lineTo(-36.7,-199.9).lineTo(-36.6,-198.9).lineTo(-36.6,-198.8).curveTo(-36.6,-197.2,-37.6,-195.8).curveTo(-39,-193.8,-41.6,-193.8).curveTo(-44.9,-193.8,-46.1,-196.5).closePath().moveTo(-145,-200.9).lineTo(-145.5,-203.1).curveTo(-145.5,-203.9,-145.3,-204.6).lineTo(-145.3,-204.6).lineTo(-145.5,-205.1).curveTo(-145.5,-207.5,-144,-208.9).curveTo(-142.6,-210.2,-140.5,-210.2).curveTo(-138.5,-210.2,-137.1,-208.9).curveTo(-135.6,-207.6,-135.5,-205.3).lineTo(-135.5,-205).lineTo(-135.6,-204.2).lineTo(-135.5,-203.3).lineTo(-135.5,-203.1).curveTo(-135.5,-201.6,-136.5,-200.1).curveTo(-137.9,-198.1,-140.5,-198.1).curveTo(-143.8,-198.1,-145,-200.9).closePath().moveTo(69.1,-204.6).lineTo(68.6,-206.8).curveTo(68.6,-207.6,68.8,-208.3).lineTo(68.8,-208.3).lineTo(68.6,-208.8).curveTo(68.6,-211.2,70.1,-212.6).curveTo(71.5,-213.9,73.6,-213.9).curveTo(75.6,-213.9,77,-212.6).curveTo(78.5,-211.3,78.6,-209).lineTo(78.6,-208.7).lineTo(78.5,-207.9).lineTo(78.6,-207).lineTo(78.6,-206.8).curveTo(78.6,-205.3,77.6,-203.8).curveTo(76.2,-201.8,73.6,-201.8).curveTo(70.3,-201.8,69.1,-204.6).closePath().moveTo(235.1,-209.9).lineTo(234.5,-212.2).curveTo(234.5,-213,234.7,-213.6).lineTo(234.7,-213.7).lineTo(234.5,-214.2).curveTo(234.5,-216.6,236.1,-218).curveTo(237.4,-219.2,239.5,-219.2).curveTo(241.5,-219.2,242.9,-218).curveTo(244.4,-216.6,244.5,-214.3).lineTo(244.5,-214).lineTo(244.4,-213.3).lineTo(244.5,-212.3).lineTo(244.5,-212.2).curveTo(244.5,-210.6,243.5,-209.2).curveTo(242.1,-207.2,239.5,-207.2).curveTo(236.2,-207.2,235.1,-209.9).closePath();
	this.shape_89.setTransform(301.4,274.175);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_17},{t:this.shape_16}]},1368).to({state:[{t:this.shape_19},{t:this.shape_18}]},5).to({state:[{t:this.shape_21},{t:this.shape_20}]},6).to({state:[{t:this.shape_23},{t:this.shape_22}]},5).to({state:[{t:this.shape_25},{t:this.shape_24}]},5).to({state:[{t:this.shape_27},{t:this.shape_26}]},5).to({state:[{t:this.shape_29},{t:this.shape_28}]},5).to({state:[{t:this.shape_31},{t:this.shape_30}]},5).to({state:[{t:this.shape_33},{t:this.shape_32}]},5).to({state:[{t:this.shape_35},{t:this.shape_34}]},5).to({state:[{t:this.shape_37},{t:this.shape_36}]},5).to({state:[{t:this.shape_39},{t:this.shape_38}]},5).to({state:[{t:this.shape_41},{t:this.shape_40}]},5).to({state:[{t:this.shape_43},{t:this.shape_42}]},5).to({state:[{t:this.shape_43},{t:this.shape_42}]},5).to({state:[{t:this.shape_45},{t:this.shape_44}]},5).to({state:[{t:this.shape_47},{t:this.shape_46}]},5).to({state:[{t:this.shape_47},{t:this.shape_46}]},5).to({state:[{t:this.shape_49},{t:this.shape_48}]},5).to({state:[{t:this.shape_51},{t:this.shape_50}]},5).to({state:[{t:this.shape_53},{t:this.shape_52}]},5).to({state:[{t:this.shape_55},{t:this.shape_54}]},5).to({state:[{t:this.shape_57},{t:this.shape_56}]},5).to({state:[{t:this.shape_59},{t:this.shape_58}]},5).to({state:[{t:this.shape_61},{t:this.shape_60}]},5).to({state:[{t:this.shape_63},{t:this.shape_62}]},5).to({state:[{t:this.shape_65},{t:this.shape_64}]},5).to({state:[{t:this.shape_67},{t:this.shape_66}]},5).to({state:[{t:this.shape_69},{t:this.shape_68}]},5).to({state:[{t:this.shape_71},{t:this.shape_70}]},5).to({state:[{t:this.shape_73},{t:this.shape_72}]},5).to({state:[{t:this.shape_75},{t:this.shape_74}]},5).to({state:[{t:this.shape_77},{t:this.shape_76}]},5).to({state:[{t:this.shape_79},{t:this.shape_78}]},5).to({state:[{t:this.shape_81},{t:this.shape_80}]},5).to({state:[{t:this.shape_83},{t:this.shape_82}]},5).to({state:[{t:this.shape_85},{t:this.shape_84}]},5).to({state:[{t:this.shape_87},{t:this.shape_86}]},5).to({state:[{t:this.shape_89},{t:this.shape_88}]},5).wait(20));

	// background
	this.instance_124 = new lib.paperbg2_600x800();

	this.shape_90 = new cjs.Shape();
	this.shape_90.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(139.8,-74.8).lineTo(139.8,-102.5).curveTo(139.9,-99.7,142.7,-97.7).curveTo(145.7,-95.7,149.9,-95.7).moveTo(129.9,-74.1).lineTo(129.9,-74.2).moveTo(136.3,-67.9).curveTo(138,-67.4,140.1,-67.4).moveTo(158.9,-61.1).lineTo(158.9,-88.8).curveTo(158.9,-86,161.8,-84).curveTo(164.8,-82,168.9,-82).moveTo(159.9,64.5).lineTo(159.9,36.8).curveTo(160.1,39.6,162.9,41.6).curveTo(165.9,43.6,170.1,43.6).moveTo(129.9,-72).lineTo(129.9,-46.5).moveTo(-170,102.5).lineTo(-170,74.8).curveTo(-169.9,77.6,-167.1,79.6).curveTo(-164.1,81.6,-159.9,81.6);
	this.shape_90.setTransform(289.95,155.775);

	this.shape_91 = new cjs.Shape();
	this.shape_91.graphics.beginFill("#000000").beginStroke().moveTo(-169.5,91.9).lineTo(-170,89.7).curveTo(-170,88.9,-169.8,88.2).lineTo(-169.8,88.2).lineTo(-170,87.7).curveTo(-170,85.3,-168.5,83.9).curveTo(-167.1,82.6,-165,82.6).curveTo(-163,82.6,-161.6,83.9).curveTo(-160.1,85.2,-160,87.5).lineTo(-160,87.8).lineTo(-160.1,88.6).lineTo(-160,89.5).lineTo(-160,89.7).curveTo(-160,91.2,-161,92.7).curveTo(-162.4,94.7,-165,94.7).curveTo(-168.3,94.7,-169.5,91.9).closePath().moveTo(160.6,53.9).lineTo(160,51.7).curveTo(160,50.9,160.2,50.2).lineTo(160.2,50.2).lineTo(160,49.7).curveTo(160,47.3,161.5,45.9).curveTo(163,44.6,165,44.6).curveTo(167.1,44.6,168.5,45.9).curveTo(170,47.2,170,49.5).lineTo(170,49.8).lineTo(169.9,50.6).lineTo(170,51.5).lineTo(170,51.7).curveTo(170,53.2,169,54.7).curveTo(167.6,56.7,165,56.7).curveTo(161.8,56.7,160.6,53.9).closePath().moveTo(130.6,-57.1).lineTo(130,-59.3).curveTo(130,-60.1,130.2,-60.8).lineTo(130.2,-60.8).lineTo(130,-61.3).curveTo(130,-63.7,131.6,-65.1).curveTo(132.9,-66.4,135,-66.4).curveTo(137.1,-66.4,138.4,-65.1).curveTo(140,-63.8,140,-61.5).lineTo(140,-61.2).lineTo(139.9,-60.4).lineTo(140,-59.5).lineTo(140,-59.3).curveTo(140,-57.8,139,-56.3).curveTo(137.6,-54.3,135,-54.3).curveTo(131.7,-54.3,130.6,-57.1).closePath().moveTo(159.5,-71.7).lineTo(158.9,-73.9).curveTo(158.9,-74.7,159.1,-75.4).lineTo(159.1,-75.4).lineTo(158.9,-75.9).curveTo(158.9,-78.3,160.5,-79.7).curveTo(161.9,-81,163.9,-81).curveTo(166,-81,167.3,-79.7).curveTo(168.9,-78.4,168.9,-76.1).lineTo(168.9,-75.8).lineTo(168.8,-75).lineTo(168.9,-74.1).lineTo(168.9,-73.9).curveTo(168.9,-72.4,167.9,-70.9).curveTo(166.5,-68.9,163.9,-68.9).curveTo(160.7,-68.9,159.5,-71.7).closePath().moveTo(140.3,-85.4).lineTo(140,-87).lineTo(139.8,-87.6).curveTo(139.8,-88.4,140,-89.1).lineTo(140,-89.1).lineTo(139.8,-89.6).curveTo(139.8,-92,141.4,-93.4).curveTo(142.7,-94.7,144.8,-94.7).curveTo(146.8,-94.7,148.2,-93.4).curveTo(149.7,-92.1,149.8,-89.8).lineTo(149.8,-89.5).lineTo(149.7,-88.7).lineTo(149.8,-87.8).lineTo(149.8,-87.6).curveTo(149.8,-86.1,148.8,-84.6).curveTo(147.8,-83.2,146.3,-82.8).curveTo(145.6,-82.6,144.8,-82.6).curveTo(141.5,-82.6,140.3,-85.4).closePath();
	this.shape_91.setTransform(279.9,170.725);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_91},{t:this.shape_90},{t:this.instance_124}]}).to({state:[]},1575).wait(4));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-228.5,264.4,1500,992.6999999999999);
// library properties:
lib.properties = {
	id: '6B99072D8376574892ED4DC1B504EB30',
	width: 800,
	height: 600,
	fps: 24,
	color: "#FFFF99",
	opacity: 1.00,
	manifest: [
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_1.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_1"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4_atlas_2"},
		{src:"sounds/galloping_bounce.mp3", id:"galloping_bounce"},
		{src:"sounds/giggles_bounce.mp3", id:"giggles_bounce"},
		{src:"sounds/giggles_shorter_bounce.mp3", id:"giggles_shorter_bounce"},
		{src:"sounds/nar4_pt1.mp3", id:"nar4_pt1"},
		{src:"sounds/nar4_pt26db.mp3", id:"nar4_pt26db"},
		{src:"sounds/nar4_wrongbranch.mp3", id:"nar4_wrongbranch"}
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
an.compositions['6B99072D8376574892ED4DC1B504EB30'] = {
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