(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_1", frames: [[0,1002,906,938],[908,1002,906,938],[921,0,906,938],[0,0,919,1000]]},
		{name:"nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_2", frames: [[0,0,725,795],[0,797,725,795],[727,1442,800,600],[727,862,882,578],[727,0,600,860]]},
		{name:"nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3", frames: [[1219,1586,292,277],[797,1876,573,148],[1608,1338,362,246],[802,491,660,435],[1404,0,619,427],[0,599,600,399],[0,1000,400,393],[0,1578,484,304],[1176,1022,618,314],[802,0,600,489],[1730,1586,257,284],[797,1578,420,296],[1219,1338,387,244],[1464,429,421,591],[0,0,800,597],[402,1323,597,253],[1513,1586,215,368],[602,928,572,393],[486,1578,309,463]]},
		{name:"nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4", frames: [[932,548,512,52],[1446,548,144,122],[256,336,394,115],[1493,0,507,115],[1679,407,369,115],[1359,431,309,115],[280,453,269,115],[988,314,447,115],[988,431,369,115],[652,446,278,115],[0,453,278,115],[310,219,494,115],[1670,524,287,76],[551,563,144,122],[988,146,70,94],[1872,117,165,227],[652,336,70,90],[724,336,70,90],[624,0,460,144],[0,570,70,86],[1086,0,204,310],[1493,117,184,310],[806,146,180,298],[1679,117,191,288],[551,453,70,90],[1959,524,70,90],[1592,548,70,90],[697,563,70,90],[0,229,254,200],[310,0,312,217],[0,0,308,227],[1292,0,199,312],[2002,0,41,47],[769,563,70,90],[841,563,70,90]]}
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



(lib.CachedBmp_27 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.AleksejRazumovskij_small1748 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.arc_tombstone_full = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.bagu_armammu = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.BirutaAkerbergs_small1947 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.elizaveta_olga_smaller = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.Esslingen1 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.Esslingen2 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.esslingen_small = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.Hansen_small1983 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.high_school = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.JewsCattleCarsSiberia = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.karsava_pilseta = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.KirilRazumovskij_small1728 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.Ludza_drawing = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.mama_papa_olija_small = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.mamma_arbabaolga = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.mamma_child_full = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.mamma_newyork = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.mamma_older_full = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.mamma_olderyet_full = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.mamma_runtorta = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.mamma_young_full = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.MichailZemcuznikov_small1788 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.NataljaRozum_small1678 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.NikolajAzbelev_small1857 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.OlgaSott1921 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.OlgaSott_small1921 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.paperbg2_600x800 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.refugees1_small = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.refugees4 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.Riga_college = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.Riga_skyline_cutout = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.runtorta_drawing = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.Sura1 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.sura_runtorta = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.tree_branch = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.tree_clear_small = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.vera_azb_large = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.VeraAzbeleva_small1883 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.ViktorArcimovic_small1820 = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.visadzimta_runtorta = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.wedding = function() {
	this.initialize(ss["nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"]);
	this.gotoAndStop(18);
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


(lib.Tween247 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween246 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween240 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_27();
	this.instance.setTransform(-127.9,-13,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-127.9,-13,256,26);


(lib.Tween239 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("Olga Schott -- 1921", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 252;
	this.text.parent = this;
	this.text.setTransform(-125.9,-11);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-127.9,-13,255.9,25.9);


(lib.Tween219 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween218 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween217 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween216 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween215 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_26();
	this.instance.setTransform(-226.4,-234.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-226.4,-234.5,453,469);


(lib.Tween214 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_25();
	this.instance.setTransform(-226.4,-234.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-226.4,-234.5,453,469);


(lib.Tween213 = function(mode,startPosition,loop,reversed) {
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

	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(-246,-207.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-246,-207.6,490.7,413.79999999999995);


(lib.Tween212 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_23();
	this.instance.setTransform(172.45,145.1,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_24();
	this.instance_1.setTransform(-246,-207.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-246,-207.6,490.5,413.7);


(lib.Tween211 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween210 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween209 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween208 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween207 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween205 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween204 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween181 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween180 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween178 = function(mode,startPosition,loop,reversed) {
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


(lib.tombstoneMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.arc_tombstone_full();
	this.instance.setTransform(-181,-123);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.tombstoneMC, new cjs.Rectangle(-181,-123,362,246), null);


(lib.sura_vladMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.sura_runtorta();
	this.instance.setTransform(-99.5,-156);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sura_vladMC, new cjs.Rectangle(-99.5,-156,199,312), null);


(lib.siberiaMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.JewsCattleCarsSiberia();
	this.instance.setTransform(-200,-196.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.siberiaMC, new cjs.Rectangle(-200,-196.5,400,393), null);


(lib.refugees4MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.refugees4();
	this.instance.setTransform(-127,-100);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.refugees4MC, new cjs.Rectangle(-127,-100,254,200), null);


(lib.refugees1MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.refugees1_small();
	this.instance.setTransform(-400,-298.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.refugees1MC, new cjs.Rectangle(-400,-298.5,800,597), null);


(lib.olga_mammaMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.mamma_arbabaolga();
	this.instance.setTransform(-128.5,-142);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.olga_mammaMC, new cjs.Rectangle(-128.5,-142,257,284), null);


(lib.Olga_ElizavetaMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.elizaveta_olga_smaller();
	this.instance.setTransform(-459.5,-500);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Olga_ElizavetaMC, new cjs.Rectangle(-459.5,-500,919,1000), null);


(lib.suraMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Sura1();
	this.instance.setTransform(-441,-289);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.suraMC, new cjs.Rectangle(-441,-289,882,578), null);


(lib.NewYorkmammaMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.mamma_newyork();
	this.instance.setTransform(-210,-148);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.NewYorkmammaMC, new cjs.Rectangle(-210,-148,420,296), null);


(lib.RuntortaPeople2MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.visadzimta_runtorta();
	this.instance.setTransform(-286,-196.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.RuntortaPeople2MC, new cjs.Rectangle(-286,-196.5,572,393), null);


(lib.RuntortaPeople1MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.mamma_runtorta();
	this.instance.setTransform(-193.5,-122);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.RuntortaPeople1MC, new cjs.Rectangle(-193.5,-122,387,244), null);


(lib.mammaOlderMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.mamma_older_full();
	this.instance.setTransform(-92,-155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mammaOlderMC, new cjs.Rectangle(-92,-155,184,310), null);


(lib.mammaChildMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.mamma_child_full();
	this.instance.setTransform(-102,-155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mammaChildMC, new cjs.Rectangle(-102,-155,204,310), null);


(lib.LudzaDrawing2MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.runtorta_drawing();
	this.instance.setTransform(-298.5,-126.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.LudzaDrawing2MC, new cjs.Rectangle(-298.5,-126.5,597,253), null);


(lib.LudzaDrawing1MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Ludza_drawing();
	this.instance.setTransform(-309,-157);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.LudzaDrawing1MC, new cjs.Rectangle(-309,-157,618,314), null);


(lib.baguMammaMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.bagu_armammu();
	this.instance.setTransform(-82.5,-113.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.baguMammaMC, new cjs.Rectangle(-82.5,-113.5,165,227), null);


(lib.RigaSkylineMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Riga_skyline_cutout();
	this.instance.setTransform(-154,-113.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.RigaSkylineMC, new cjs.Rectangle(-154,-113.5,308,227), null);


(lib.RigaCollegeMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Riga_college();
	this.instance.setTransform(-156,-108.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.RigaCollegeMC, new cjs.Rectangle(-156,-108.5,312,217), null);


(lib.mammaYoungMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.mamma_young_full();
	this.instance.setTransform(-95.5,-144);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mammaYoungMC, new cjs.Rectangle(-95.5,-144,191,288), null);


(lib.mammaOlderyetMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.mamma_olderyet_full();
	this.instance.setTransform(-90,-149);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mammaOlderyetMC, new cjs.Rectangle(-90,-149,180,298), null);


(lib.karsavaMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.karsava_pilseta();
	this.instance.setTransform(-242,-152);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.karsavaMC, new cjs.Rectangle(-242,-152,484,304), null);


(lib.KarsavaHSMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.high_school();
	this.instance.setTransform(-230,-72);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.KarsavaHSMC, new cjs.Rectangle(-230,-72,460,144), null);


(lib.weddingMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.wedding();
	this.instance.setTransform(-154.5,-231.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.weddingMC, new cjs.Rectangle(-154.5,-231.5,309,463), null);


(lib.familyMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.mama_papa_olija_small();
	this.instance.setTransform(-300,-244.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.familyMC, new cjs.Rectangle(-300,-244.5,600,489), null);


(lib.esslingen2MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Esslingen2();
	this.instance.setTransform(-309.5,-213.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.esslingen2MC, new cjs.Rectangle(-309.5,-213.5,619,427), null);


(lib.esslingen1MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Esslingen1();
	this.instance.setTransform(-330,-217.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.esslingen1MC, new cjs.Rectangle(-330,-217.5,660,435), null);


(lib.esslingen_smallMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.esslingen_small();
	this.instance.setTransform(-300,-199.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.esslingen_smallMC, new cjs.Rectangle(-300,-199.5,600,399), null);


(lib.VeraAzb_largeMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.vera_azb_large();
	this.instance.setTransform(-300,-430);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.VeraAzb_largeMC, new cjs.Rectangle(-300,-430,600,860), null);


(lib.Olga_largeMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.OlgaSott1921();
	this.instance.setTransform(-210.5,-295.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Olga_largeMC, new cjs.Rectangle(-210.5,-295.5,421,591), null);


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
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(28.5,-28.5).lineTo(28.5,28.5).lineTo(-28.5,28.5).lineTo(-28.5,-28.5).closePath();
	this.shape.setTransform(0.5,2.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.beginFill("#996600").beginStroke().moveTo(-28.5,28.5).lineTo(-28.5,-28.5).lineTo(28.5,-28.5).lineTo(28.5,28.5).closePath();
	this.shape_1.setTransform(0.5,2.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.beginFill().beginStroke("#000000").setStrokeStyle(35,1,1).moveTo(28.5,28.5).lineTo(-28.5,28.5).lineTo(-28.5,-28.5).lineTo(28.5,-28.5).closePath();
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
(lib.nar8_OlgaSchott_copyHTML5_HTML5Canvas = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {nar8:0,wrong_nar8:1073,continue_nar8:1076,wrongbranch_nar8:1379};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,100,1071,1073,1076,1078,1376,1379,2069,2589];
	this.streamSoundSymbolsList[100] = [{id:"Latvia_dzivitewav",startFrame:100,endFrame:2590,loop:1,offset:0}];
	this.streamSoundSymbolsList[1078] = [{id:"Germany_bellswav",startFrame:1078,endFrame:2592,loop:1,offset:0}];
	this.streamSoundSymbolsList[2069] = [{id:"Train_sirenwav",startFrame:2069,endFrame:2590,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}
	this.frame_100 = function() {
		var soundInstance = playSound("Latvia_dzivitewav",0);
		this.InsertIntoSoundStreamData(soundInstance,100,2590,1);
		playSound("nar8_pt1");
		soundInstance.volume = 0.2;
	}
	this.frame_1071 = function() {
		this.stop();
		
		
		/*import flash.events.Event;
		
		button8.addEventListener(MouseEvent.MOUSE_UP, continue_nar8);
		
		function continue_nar8(e:Event):void {
			button8.removeEventListener(MouseEvent.MOUSE_UP, continue_nar8);
			gotoAndPlay("continue_nar8");
		}
		
		button8_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar8);
		
		function wrong_nar8(e:Event):void {
			button8_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar8);
			gotoAndPlay("wrongbranch_nar8");
		}
		*/
		/* Click to Go to Frame and Play
		Clicking on the specified symbol instance moves the playhead to the specified frame in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		
		Instructions:
		1. Replace the number 5 in the code below with the frame number you would like the playhead to move to when the symbol instance is clicked.
		2.Frame numbers in EaselJS start at 0 instead of 1
		*/
		
		this.button8.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar8");
		}
		
		
		this.button8_wrong.addEventListener("click", fl_WrongClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_WrongClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("wrongbranch_nar8");
		}
	}
	this.frame_1073 = function() {
		this.stop();
		
		
		
		/*import flash.events.Event;*/
		
		
		
		/*function continue_nar8a(e:Event):void {
			button8.removeEventListener(MouseEvent.MOUSE_UP, continue_nar8);
			gotoAndPlay("continue_nar8");
		}
		
		button8_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar8a);
		
		function wrong_nar8a(e:Event):void {
			button8_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar8);
			gotoAndPlay("wrongbranch_nar8");
		}
		*/
		
		this.button8.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar8");
		}
	}
	this.frame_1076 = function() {
		playSound("nar8_pt2");
	}
	this.frame_1078 = function() {
		var soundInstance = playSound("Germany_bellswav",0);
		this.InsertIntoSoundStreamData(soundInstance,1078,2592,1);
		soundInstance.volume = 0.2;
	}
	this.frame_1376 = function() {
		/* import flash.net.URLRequest;
		import flash.display.Loader;
		import flash.events.Event;
		import flash.events.ProgressEvent;
		
		stop();*/
		
		this.stop();
		
		window.open("AncestorSplit_31May2014_copyHTML5_HTML5_Canvas.html?18596", "_self");
		
		
		/*function startLoad()
		{
			var mLoader:Loader = new Loader();
			var mRequest:URLRequest = new URLRequest("Ancestors.swf");
			mLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, onCompleteHandler);
			mLoader.contentLoaderInfo.addEventListener(ProgressEvent.PROGRESS, onProgressHandler);
			mLoader.load(mRequest);
		}
		
		function onCompleteHandler(loadEvent:Event)
		{
			addChild(loadEvent.currentTarget.content);
		}
		function onProgressHandler(mProgress:ProgressEvent)
		{
			var percent:Number = mProgress.bytesLoaded/mProgress.bytesTotal;
			trace(percent);
		}
		startLoad();*/
	}
	this.frame_1379 = function() {
		playSound("nar8_wrongbtanch");
	}
	this.frame_2069 = function() {
		var soundInstance = playSound("Train_sirenwav",0);
		this.InsertIntoSoundStreamData(soundInstance,2069,2590,1);
		soundInstance.volume = 0.2;
	}
	this.frame_2589 = function() {
		this.gotoAndStop("wrong_nar8");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(100).call(this.frame_100).wait(971).call(this.frame_1071).wait(2).call(this.frame_1073).wait(3).call(this.frame_1076).wait(2).call(this.frame_1078).wait(298).call(this.frame_1376).wait(3).call(this.frame_1379).wait(690).call(this.frame_2069).wait(520).call(this.frame_2589).wait(3));

	// text_nar8
	this.text = new cjs.Text("Olga Schott -- 1921", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 252;
	this.text.parent = this;
	this.text.setTransform(204.1,23.9);

	this.instance = new lib.Tween239("synched",0);
	this.instance.setTransform(330,34.9);
	this.instance._off = true;

	this.instance_1 = new lib.Tween240("synched",0);
	this.instance_1.setTransform(222.9,34.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text}]}).to({state:[{t:this.instance}]},44).to({state:[{t:this.instance_1}]},45).to({state:[{t:this.instance_1}]},11).to({state:[]},501).wait(1991));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(44).to({_off:false},0).to({_off:true,x:222.9},45).wait(2503));

	// OlgaSchott_large
	this.instance_2 = new lib.Olga_largeMC();
	this.instance_2.setTransform(315.2,211.55,0.0208,0.0207,0,0,0,2.4,-12.1);
	this.instance_2.alpha = 0;
	this.instance_2._off = true;

	this.instance_3 = new lib.VeraAzb_largeMC();
	this.instance_3.setTransform(-260.95,287.05,0.4622,0.46,0,0,0,4.1,-47.4);
	this.instance_3.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_2}]},14).to({state:[{t:this.instance_2}]},30).to({state:[{t:this.instance_3}]},155).to({state:[{t:this.instance_3}]},863).to({state:[]},1).wait(1529));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(14).to({_off:false},0).to({regX:2.6,regY:-49.3,scaleX:1.2611,scaleY:1.2552,x:317.7,y:242.25,alpha:1},30).to({_off:true,regX:4.1,regY:-47.4,scaleX:0.4622,scaleY:0.46,x:-260.95,y:287.05,alpha:0},155).wait(2393));

	// _NR1678
	this.instance_4 = new lib.Tween3("synched",0);
	this.instance_4.setTransform(327.15,364.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(89).to({x:327.6},0).to({x:333.6,y:342.9,alpha:0},11).to({_off:true},1).wait(2491));

	// _KR1728
	this.instance_5 = new lib.Tween20("synched",0);
	this.instance_5.setTransform(509.15,383.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(89).to({startPosition:0},0).to({alpha:0},11).to({_off:true},1).wait(2491));

	// _AR1748
	this.instance_6 = new lib.Tween58("synched",0);
	this.instance_6.setTransform(510.55,237.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(89).to({startPosition:0},0).to({alpha:0},11).to({_off:true},1).wait(2491));

	// _MZ1783
	this.instance_7 = new lib.Tween95("synched",0);
	this.instance_7.setTransform(385.95,159);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(89).to({startPosition:0},0).to({alpha:0},11).to({_off:true},1).wait(2491));

	// _VA1820
	this.instance_8 = new lib.Tween178("synched",0);
	this.instance_8.setTransform(267,158);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(89).to({startPosition:0},0).to({alpha:0},11).to({_off:true},1).wait(2491));

	// _NA1854
	this.instance_9 = new lib.NikolajAzbelev_small1857();
	this.instance_9.setTransform(117,184);

	this.instance_10 = new lib.Tween180("synched",0);
	this.instance_10.setTransform(152,229);
	this.instance_10._off = true;

	this.instance_11 = new lib.Tween181("synched",0);
	this.instance_11.setTransform(152,229);
	this.instance_11.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9}]}).to({state:[{t:this.instance_10}]},89).to({state:[{t:this.instance_11}]},11).to({state:[]},1).wait(2491));
	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2492));

	// _VA1883
	this.instance_12 = new lib.VeraAzbeleva_small1883();
	this.instance_12.setTransform(109,329);

	this.instance_13 = new lib.Tween204("synched",0);
	this.instance_13.setTransform(144.5,373.35);
	this.instance_13._off = true;

	this.instance_14 = new lib.Tween205("synched",0);
	this.instance_14.setTransform(165.95,385.35);
	this.instance_14.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_12}]}).to({state:[{t:this.instance_13}]},89).to({state:[{t:this.instance_14}]},11).to({state:[]},1).wait(2491));
	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(89).to({_off:false},0).to({_off:true,x:165.95,y:385.35,alpha:0},11).wait(2492));

	// _OS1921
	this.instance_15 = new lib.OlgaSott_small1921();
	this.instance_15.setTransform(200.1,466.45);

	this.instance_16 = new lib.Tween246("synched",0);
	this.instance_16.setTransform(235.1,511.45);
	this.instance_16._off = true;

	this.instance_17 = new lib.Tween247("synched",0);
	this.instance_17.setTransform(333.6,263);
	this.instance_17._off = true;

	this.instance_18 = new lib.Tween207("synched",0);
	this.instance_18.setTransform(337.3,264.3);
	this.instance_18.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_15}]}).to({state:[{t:this.instance_16}]},29).to({state:[{t:this.instance_17}]},60).to({state:[{t:this.instance_18}]},11).to({state:[]},1).wait(2491));
	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(29).to({_off:false},0).to({_off:true,x:333.6,y:263},60).wait(2503));
	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(29).to({_off:false},60).to({_off:true,x:337.3,y:264.3,alpha:0},11).wait(2492));

	// _BA1947
	this.instance_19 = new lib.BirutaAkerbergs_small1947();
	this.instance_19.setTransform(349.05,467);

	this.instance_20 = new lib.Tween208("synched",0);
	this.instance_20.setTransform(384.05,512);
	this.instance_20._off = true;

	this.instance_21 = new lib.Tween209("synched",0);
	this.instance_21.setTransform(384.05,512);
	this.instance_21.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_19}]}).to({state:[{t:this.instance_20}]},89).to({state:[{t:this.instance_21}]},11).to({state:[]},1).wait(2491));
	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2492));

	// _0H1983
	this.instance_22 = new lib.Hansen_small1983();
	this.instance_22.setTransform(490.1,462.7);

	this.instance_23 = new lib.Tween210("synched",0);
	this.instance_23.setTransform(525.1,507.7);
	this.instance_23._off = true;

	this.instance_24 = new lib.Tween211("synched",0);
	this.instance_24.setTransform(525.1,507.7);
	this.instance_24.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_22}]}).to({state:[{t:this.instance_23}]},89).to({state:[{t:this.instance_24}]},11).to({state:[]},1).wait(2491));
	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2492));

	// arrows
	this.instance_25 = new lib.CachedBmp_7();
	this.instance_25.setTransform(569.95,472.7,0.5,0.5);

	this.instance_26 = new lib.CachedBmp_6();
	this.instance_26.setTransform(151.45,120,0.5,0.5);

	this.instance_27 = new lib.Tween212("synched",0);
	this.instance_27.setTransform(397.5,327.6);
	this.instance_27._off = true;

	this.instance_28 = new lib.Tween213("synched",0);
	this.instance_28.setTransform(397.5,327.6);
	this.instance_28.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_26},{t:this.instance_25}]}).to({state:[{t:this.instance_27}]},89).to({state:[{t:this.instance_28}]},11).to({state:[]},1).wait(2491));
	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2492));

	// vine
	this.instance_29 = new lib.CachedBmp_8();
	this.instance_29.setTransform(88.1,62.4,0.5,0.5);

	this.instance_30 = new lib.Tween214("synched",0);
	this.instance_30.setTransform(314.5,296.9);
	this.instance_30._off = true;

	this.instance_31 = new lib.Tween215("synched",0);
	this.instance_31.setTransform(314.5,296.9);
	this.instance_31.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_29}]}).to({state:[{t:this.instance_30}]},89).to({state:[{t:this.instance_31}]},11).to({state:[]},1).wait(2491));
	this.timeline.addTween(cjs.Tween.get(this.instance_30).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2492));

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

	this.instance_52 = new lib.Tween216("synched",0);
	this.instance_52.setTransform(377.45,331.65);
	this.instance_52._off = true;

	this.instance_53 = new lib.Tween217("synched",0);
	this.instance_53.setTransform(377.45,331.65);
	this.instance_53.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_51},{t:this.instance_50},{t:this.instance_49},{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_41},{t:this.instance_40},{t:this.instance_39},{t:this.instance_38},{t:this.instance_37},{t:this.instance_36},{t:this.instance_35},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32}]}).to({state:[{t:this.instance_52}]},89).to({state:[{t:this.instance_53}]},11).to({state:[]},1).wait(2491));
	this.timeline.addTween(cjs.Tween.get(this.instance_52).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2492));

	// tree
	this.instance_54 = new lib.tree_clear_small();
	this.instance_54.setTransform(214.5,138);

	this.instance_55 = new lib.Tween218("synched",0);
	this.instance_55.setTransform(322,322);
	this.instance_55._off = true;

	this.instance_56 = new lib.Tween219("synched",0);
	this.instance_56.setTransform(322,322);
	this.instance_56.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_54}]}).to({state:[{t:this.instance_55}]},89).to({state:[{t:this.instance_56}]},11).to({state:[]},1).wait(2491));
	this.timeline.addTween(cjs.Tween.get(this.instance_55).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2492));

	// text_Runtorta
	this.instance_57 = new lib.CachedBmp_9();
	this.instance_57.setTransform(328.35,493.4,0.5,0.5);

	this.text_1 = new cjs.Text("Tante Sura, Vladimir Arcimovics\nand their two sons", "italic bold 28px 'Verdana'");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 36;
	this.text_1.parent = this;
	this.text_1.setTransform(400,491.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_57}]},670).to({state:[]},193).to({state:[{t:this.text_1,p:{y:491.9,text:"Tante Sura, Vladimir Arcimovics\nand their two sons",lineWidth:504}}]},826).to({state:[]},110).to({state:[{t:this.text_1,p:{y:478.5,text:"Olga Schott and Olga Arcimovics",lineWidth:512}}]},80).to({state:[]},190).to({state:[{t:this.text_1,p:{y:493.85,text:"Ludza cemetery",lineWidth:249}}]},300).to({state:[]},65).to({state:[]},156).wait(2));

	// mamma_Runtorta3
	this.instance_58 = new lib.mammaOlderMC();
	this.instance_58.setTransform(120.85,483.45);
	this.instance_58.alpha = 0;
	this.instance_58._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_58).wait(311).to({_off:false},0).to({x:400,y:300,alpha:1},89).wait(38).to({alpha:0},78).to({_off:true},7).wait(2069));

	// mamma_Runtorta2
	this.instance_59 = new lib.mammaChildMC();
	this.instance_59.setTransform(698.3,525.65);
	this.instance_59.alpha = 0;
	this.instance_59._off = true;

	this.instance_60 = new lib.RuntortaPeople2MC();
	this.instance_60.setTransform(-90.2,78.65);
	this.instance_60.alpha = 0;
	this.instance_60._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_59).wait(146).to({_off:false},0).to({x:400,y:300,alpha:1},167).wait(51).to({alpha:0},60).to({_off:true},11).wait(2157));
	this.timeline.addTween(cjs.Tween.get(this.instance_60).wait(648).to({_off:false},0).to({x:400,y:300,alpha:1},84).wait(2).to({alpha:0},32).to({_off:true},3).wait(1823));

	// mamma_Runtorta1
	this.instance_61 = new lib.baguMammaMC();
	this.instance_61.setTransform(136.55,457);
	this.instance_61.alpha = 0;
	this.instance_61._off = true;

	this.instance_62 = new lib.RuntortaPeople1MC();
	this.instance_62.setTransform(698.35,136.25);
	this.instance_62.alpha = 0;
	this.instance_62._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_61).wait(387).to({_off:false},0).to({regY:-0.8,scaleX:1.2849,scaleY:1.2848,x:400,y:298.95,alpha:1},106).wait(80).to({alpha:0},32).to({_off:true},2).wait(1985));
	this.timeline.addTween(cjs.Tween.get(this.instance_62).wait(609).to({_off:false},0).to({x:400,y:300,alpha:1},61).to({_off:true},70).wait(1852));

	// LudzaDrawing2
	this.instance_63 = new lib.LudzaDrawing2MC();
	this.instance_63.setTransform(400,300);
	this.instance_63.alpha = 0;
	this.instance_63._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_63).wait(740).to({_off:false},0).to({regX:0.1,regY:-2.9,scaleX:1.7152,scaleY:1.7152,x:400.2,y:292.1,alpha:1},107).wait(4).to({alpha:0},12).to({_off:true},3).wait(1726));

	// LudzaDrawing1
	this.instance_64 = new lib.LudzaDrawing1MC();
	this.instance_64.setTransform(400,300);
	this.instance_64.alpha = 0;
	this.instance_64._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_64).wait(691).to({_off:false},0).to({regX:0.1,regY:-3.6,scaleX:1.6489,scaleY:1.6487,x:400.3,y:290.45,alpha:1},73).wait(65).to({alpha:0},18).to({_off:true},4).wait(1741));

	// Karsava3
	this.instance_65 = new lib.KarsavaHSMC();
	this.instance_65.setTransform(399,94);
	this.instance_65.alpha = 0;
	this.instance_65._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_65).wait(899).to({_off:false},0).to({alpha:1},16).wait(20).to({alpha:0},14).to({_off:true},7).wait(1636));

	// Karsava2
	this.instance_66 = new lib.mammaOlderyetMC();
	this.instance_66.setTransform(109.35,485.4);
	this.instance_66.alpha = 0;
	this.instance_66._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_66).wait(870).to({_off:false},0).to({x:400,y:300,alpha:1},42).wait(23).to({alpha:0},14).to({_off:true},7).wait(1636));

	// Karsava
	this.instance_67 = new lib.karsavaMC();
	this.instance_67.setTransform(521.8,287.8);
	this.instance_67.alpha = 0;
	this.instance_67._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_67).wait(847).to({_off:false},0).to({x:400,y:300,alpha:1},39).wait(49).to({alpha:0},14).to({_off:true},7).wait(1636));

	// Riga2
	this.instance_68 = new lib.mammaYoungMC();
	this.instance_68.setTransform(400,300);
	this.instance_68.alpha = 0;
	this.instance_68._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_68).wait(970).to({_off:false},0).to({alpha:1},13).to({x:578.6},46).to({_off:true},21).wait(1542));

	// Riga1
	this.instance_69 = new lib.RigaSkylineMC();
	this.instance_69.setTransform(383.7,351.1);
	this.instance_69.alpha = 0;
	this.instance_69._off = true;

	this.instance_70 = new lib.RigaCollegeMC();
	this.instance_70.setTransform(211.05,142);
	this.instance_70.alpha = 0;
	this.instance_70._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_69).wait(936).to({_off:false},0).to({regX:0.1,regY:-0.8,scaleX:1.2922,scaleY:1.2921,x:400.25,y:298.1,alpha:1},34).wait(30).to({alpha:0},9).to({_off:true},1).wait(1582));
	this.timeline.addTween(cjs.Tween.get(this.instance_70).wait(1011).to({_off:false},0).to({x:249.05,y:291.45,alpha:1},18).to({_off:true},23).wait(1540));

	// text_esslingen
	this.text_2 = new cjs.Text("Esslingen, Germany", "italic bold 28px 'Verdana'");
	this.text_2.lineHeight = 36;
	this.text_2.parent = this;
	this.text_2.setTransform(244.4,536.05);
	this.text_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_2).wait(1099).to({_off:false},0).to({_off:true},100).wait(1393));

	// esslingen3
	this.instance_71 = new lib.esslingen2MC();
	this.instance_71.setTransform(400,300);
	this.instance_71.alpha = 0;
	this.instance_71._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_71).wait(1119).to({_off:false},0).to({alpha:1},30).to({_off:true},50).wait(1393));

	// esslingen2
	this.instance_72 = new lib.esslingen1MC();
	this.instance_72.setTransform(400,300);
	this.instance_72.alpha = 0;
	this.instance_72._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_72).wait(1099).to({_off:false},0).to({alpha:1},20).wait(30).to({alpha:0},20).to({_off:true},10).wait(1413));

	// esslingen1
	this.instance_73 = new lib.esslingen_smallMC();
	this.instance_73.setTransform(400,300);
	this.instance_73.alpha = 0;
	this.instance_73._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_73).wait(1076).to({_off:false},0).to({alpha:1},23).wait(20).to({alpha:0},30).to({_off:true},5).wait(1438));

	// NewYork
	this.instance_74 = new lib.NewYorkmammaMC();
	this.instance_74.setTransform(400,300);
	this.instance_74.alpha = 0;
	this.instance_74._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_74).wait(1248).to({_off:false},0).to({alpha:1},31).wait(30).to({alpha:0},35).to({_off:true},15).wait(1233));

	// marriage
	this.instance_75 = new lib.weddingMC();
	this.instance_75.setTransform(400,300);
	this.instance_75.alpha = 0;
	this.instance_75._off = true;

	this.instance_76 = new lib.familyMC();
	this.instance_76.setTransform(400,300);
	this.instance_76.alpha = 0;
	this.instance_76._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_75).wait(1199).to({_off:false},0).to({alpha:1},20).wait(29).to({alpha:0},31).to({_off:true},5).wait(1308));
	this.timeline.addTween(cjs.Tween.get(this.instance_76).wait(1289).to({_off:false},0).to({alpha:1},30).wait(30).to({alpha:0},20).to({_off:true},5).wait(1218));

	// test_question
	this.text_3 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_3.lineHeight = 56;
	this.text_3.parent = this;
	this.text_3.setTransform(74.85,47.25);

	this.instance_77 = new lib.CachedBmp_10();
	this.instance_77.setTransform(234,45.25,0.5,0.5);

	this.text_4 = new cjs.Text("happened", "bold 44px 'Verdana'");
	this.text_4.lineHeight = 56;
	this.text_4.parent = this;
	this.text_4.setTransform(236,47.25);

	this.text_5 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_5.lineHeight = 56;
	this.text_5.parent = this;
	this.text_5.setTransform(74.85,47.25);

	this.instance_78 = new lib.CachedBmp_11();
	this.instance_78.setTransform(502.4,44.15,0.5,0.5);

	this.text_6 = new cjs.Text("happened", "bold 44px 'Verdana'");
	this.text_6.lineHeight = 56;
	this.text_6.parent = this;
	this.text_6.setTransform(236,47.25);

	this.text_7 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_7.lineHeight = 56;
	this.text_7.parent = this;
	this.text_7.setTransform(74.85,47.25);

	this.text_8 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_8.lineHeight = 56;
	this.text_8.parent = this;
	this.text_8.setTransform(74.85,47.25);

	this.instance_79 = new lib.CachedBmp_14();
	this.instance_79.setTransform(341.75,130.3,0.5,0.5);

	this.instance_80 = new lib.CachedBmp_13();
	this.instance_80.setTransform(129,130.5,0.5,0.5);

	this.instance_81 = new lib.CachedBmp_12();
	this.instance_81.setTransform(502.4,44.15,0.5,0.5);

	this.instance_82 = new lib.CachedBmp_20();
	this.instance_82.setTransform(105.8,309.6,0.5,0.5);

	this.instance_83 = new lib.CachedBmp_19();
	this.instance_83.setTransform(245.65,220.6,0.5,0.5);

	this.instance_84 = new lib.CachedBmp_18();
	this.instance_84.setTransform(341.75,130.3,0.5,0.5);

	this.instance_85 = new lib.CachedBmp_17();
	this.instance_85.setTransform(129,130.5,0.5,0.5);

	this.instance_86 = new lib.CachedBmp_16();
	this.instance_86.setTransform(502.4,44.15,0.5,0.5);

	this.instance_87 = new lib.CachedBmp_15();
	this.instance_87.setTransform(72.85,45.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_3,p:{x:74.85,y:47.25,text:"What",lineWidth:131,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}}]},1044).to({state:[{t:this.text_3,p:{x:74.85,y:47.25,text:"What",lineWidth:131,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}},{t:this.instance_77}]},2).to({state:[{t:this.text_5,p:{x:74.85,y:47.25,text:"What",lineWidth:131}},{t:this.text_4,p:{x:236,y:47.25,text:"happened",lineWidth:243}},{t:this.text_3,p:{x:504.4,y:46.15,text:"when",lineWidth:135,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}}]},2).to({state:[{t:this.text_5,p:{x:74.85,y:47.25,text:"What",lineWidth:131}},{t:this.text_4,p:{x:236,y:47.25,text:"happened",lineWidth:243}},{t:this.instance_78},{t:this.text_3,p:{x:131,y:132.5,text:"Soviets",lineWidth:181,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}}]},2).to({state:[{t:this.text_7,p:{x:74.85,text:"What",lineWidth:131}},{t:this.text_6,p:{x:236,y:47.25,text:"happened",lineWidth:243}},{t:this.text_5,p:{x:504.4,y:46.15,text:"when",lineWidth:135}},{t:this.text_4,p:{x:131,y:132.5,text:"Soviets",lineWidth:181}},{t:this.text_3,p:{x:343.75,y:132.3,text:"occupied",lineWidth:219,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}}]},2).to({state:[{t:this.text_8},{t:this.text_7,p:{x:236,text:"happened",lineWidth:243}},{t:this.text_6,p:{x:504.4,y:46.15,text:"when",lineWidth:135}},{t:this.text_5,p:{x:131,y:132.5,text:"Soviets",lineWidth:181}},{t:this.text_4,p:{x:343.75,y:132.3,text:"occupied",lineWidth:219}},{t:this.text_3,p:{x:247.65,y:222.6,text:"Latvia?",lineWidth:178,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}}]},2).to({state:[{t:this.text_6,p:{x:74.85,y:47.25,text:"What",lineWidth:131}},{t:this.text_5,p:{x:236,y:47.25,text:"happened",lineWidth:243}},{t:this.instance_81},{t:this.instance_80},{t:this.instance_79},{t:this.text_4,p:{x:247.65,y:222.6,text:"Latvia?",lineWidth:178}},{t:this.text_3,p:{x:248.95,y:311.6,text:"She was deported\nto Siberia",lineWidth:282,font:"bold 28px 'Verdana'",color:"#990000",textAlign:"center",lineHeight:36.05}}]},5).to({state:[{t:this.instance_87},{t:this.text_4,p:{x:236,y:47.25,text:"happened",lineWidth:243}},{t:this.instance_86},{t:this.instance_85},{t:this.instance_84},{t:this.instance_83},{t:this.instance_82},{t:this.text_3,p:{x:550.85,y:313.35,text:"She fled\nto Germany",lineWidth:183,font:"bold 28px 'Verdana'",color:"#990000",textAlign:"center",lineHeight:36.05}}]},3).to({state:[]},14).to({state:[]},3).wait(1513));

	// wrong
	this.text_9 = new cjs.Text("Wrong Answer!", "italic bold 28px 'Verdana'", "#FF0000");
	this.text_9.textAlign = "center";
	this.text_9.lineHeight = 36;
	this.text_9.parent = this;
	this.text_9.setTransform(225.65,541.8);

	this.instance_88 = new lib.CachedBmp_21();
	this.instance_88.setTransform(173.5,396.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_88},{t:this.text_9}]},1073).to({state:[]},3).to({state:[]},3).wait(1513));

	// button_wrong
	this.button8_wrong = new lib.button_nar1();
	this.button8_wrong.name = "button8_wrong";
	this.button8_wrong.setTransform(246.8,461.95);
	this.button8_wrong._off = true;
	new cjs.ButtonHelper(this.button8_wrong, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button8_wrong).wait(1066).to({_off:false},0).to({_off:true},10).wait(1516));

	// button
	this.button8 = new lib.button_nar1();
	this.button8.name = "button8";
	this.button8.setTransform(554.05,461.9);
	this.button8._off = true;
	new cjs.ButtonHelper(this.button8, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button8).wait(1069).to({_off:false},0).to({_off:true},7).wait(1516));

	// deport2
	this.instance_89 = new lib.refugees1MC();
	this.instance_89.setTransform(553,308);
	this.instance_89.alpha = 0;
	this.instance_89._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_89).wait(2159).to({_off:false},0).to({regX:0.1,regY:-1.9,scaleX:0.9075,scaleY:0.9075,x:400.25,y:296.45,alpha:1},90).wait(35).to({alpha:0},45).to({_off:true},15).wait(248));

	// deport
	this.instance_90 = new lib.siberiaMC();
	this.instance_90.setTransform(483,364);
	this.instance_90.alpha = 0;
	this.instance_90._off = true;

	this.instance_91 = new lib.refugees4MC();
	this.instance_91.setTransform(727.95,382);
	this.instance_91.alpha = 0;
	this.instance_91._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_90).wait(1379).to({_off:false},0).to({x:400,y:300,alpha:1},100).wait(91).to({alpha:0},44).to({_off:true},65).wait(913));
	this.timeline.addTween(cjs.Tween.get(this.instance_91).wait(2079).to({_off:false},0).to({x:400,y:300,alpha:1},80).to({_off:true},20).wait(413));

	// babaOlga
	this.instance_92 = new lib.Olga_ElizavetaMC();
	this.instance_92.setTransform(400,300);
	this.instance_92.alpha = 0;
	this.instance_92._off = true;

	this.instance_93 = new lib.olga_mammaMC();
	this.instance_93.setTransform(749.95,354);
	this.instance_93.alpha = 0;
	this.instance_93._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_92).wait(1570).to({_off:false},0).to({regX:0.1,regY:-1.5,scaleX:0.8749,scaleY:0.8748,x:400.15,y:340.95,alpha:1},44).wait(25).to({alpha:0},40).to({_off:true},20).wait(893));
	this.timeline.addTween(cjs.Tween.get(this.instance_93).wait(1724).to({_off:false},0).to({x:400,y:300,alpha:1},155).wait(160).to({alpha:0},30).to({_off:true},10).wait(513));

	// vlad_sura
	this.instance_94 = new lib.sura_vladMC();
	this.instance_94.setTransform(659,369);
	this.instance_94.alpha = 0;
	this.instance_94._off = true;

	this.instance_95 = new lib.suraMC();
	this.instance_95.setTransform(400,290.5);
	this.instance_95.alpha = 0;
	this.instance_95._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_94).wait(1654).to({_off:false},0).to({x:400,y:300,alpha:1},35).wait(80).to({alpha:0},30).to({_off:true},15).wait(778));
	this.timeline.addTween(cjs.Tween.get(this.instance_95).wait(2399).to({_off:false},0).to({alpha:1},35).to({_off:true},154).wait(4));

	// tombstone
	this.instance_96 = new lib.tombstoneMC();
	this.instance_96.setTransform(400,300);
	this.instance_96.alpha = 0;
	this.instance_96._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_96).wait(2344).to({_off:false},0).to({regY:-0.8,scaleX:1.221,scaleY:1.2209,y:298.15,alpha:1},25).to({alpha:0},65).to({_off:true},154).wait(4));

	// background
	this.instance_97 = new lib.paperbg2_600x800();
	this.instance_97.setTransform(-2.5,2.55);

	this.timeline.addTween(cjs.Tween.get(this.instance_97).to({_off:true},2590).wait(2));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,0,954.5,800);
// library properties:
lib.properties = {
	id: 'DC54330ACD8C4D489A377E9BAB8E2B66',
	width: 800,
	height: 600,
	fps: 24,
	color: "#FFFF99",
	opacity: 1.00,
	manifest: [
		{src:"images/nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_1.png", id:"nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_1"},
		{src:"images/nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_2.png", id:"nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_2"},
		{src:"images/nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3.png", id:"nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_3"},
		{src:"images/nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4.png", id:"nar8_OlgaSchott_copyHTML5_HTML5 Canvas_atlas_4"},
		{src:"sounds/Germany_bellswav.mp3", id:"Germany_bellswav"},
		{src:"sounds/Latvia_dzivitewav.mp3", id:"Latvia_dzivitewav"},
		{src:"sounds/nar8_pt1.mp3", id:"nar8_pt1"},
		{src:"sounds/nar8_pt2.mp3", id:"nar8_pt2"},
		{src:"sounds/nar8_wrongbtanch.mp3", id:"nar8_wrongbtanch"},
		{src:"sounds/Train_sirenwav.mp3", id:"Train_sirenwav"}
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
an.compositions['DC54330ACD8C4D489A377E9BAB8E2B66'] = {
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