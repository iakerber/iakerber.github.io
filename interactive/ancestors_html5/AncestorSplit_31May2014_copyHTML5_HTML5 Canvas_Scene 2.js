(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_1", frames: [[0,0,1200,1400]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_2", frames: [[0,0,1449,930],[0,932,1449,930]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_3", frames: [[0,0,1392,930],[0,932,1386,930]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_4", frames: [[0,0,1386,930],[0,932,1386,930]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_5", frames: [[0,0,1386,897],[0,899,1386,897]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_6", frames: [[0,0,1294,897],[0,899,1294,876]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_7", frames: [[0,0,1294,824],[0,826,1294,793]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_8", frames: [[0,0,1294,772],[0,774,1294,726]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_9", frames: [[0,697,906,938],[908,697,906,938],[0,0,1294,695]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_10", frames: [[0,940,1294,585],[0,1527,1294,516],[0,0,906,938],[908,0,754,927]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_11", frames: [[0,0,1175,516],[0,518,1072,516],[1074,797,965,516],[802,1315,713,598],[1177,0,725,795],[0,1315,800,600]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12", frames: [[1868,291,144,122],[745,1337,564,52],[0,0,850,461],[852,0,779,442],[852,444,665,442],[1519,444,443,396],[1030,1167,248,168],[1030,888,281,277],[0,463,713,291],[0,756,510,289],[1633,0,366,289],[512,756,299,289],[1733,1105,169,289],[715,463,129,136],[1889,842,144,122],[1964,415,70,94],[531,1047,212,315],[1313,888,174,200],[1531,1105,200,283],[241,1047,288,239],[1964,511,70,90],[715,601,100,100],[1633,291,233,147],[0,1047,239,300],[1964,603,70,90],[1313,1105,216,266],[72,1349,70,86],[1889,966,100,100],[1904,1068,100,100],[1519,842,368,261],[1964,695,70,90],[241,1288,70,90],[313,1288,70,90],[385,1288,70,90],[1904,1170,100,100],[1904,1272,100,100],[2001,0,41,47],[813,888,215,368],[457,1288,70,90],[0,1349,70,90]]}
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



(lib.CachedBmp_125 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_9"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_124 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_9"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_123 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_120 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_119 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_118 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_117 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_116 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_115 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_114 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_113 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_112 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_111 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_110 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_6"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_109 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_108 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_7"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_107 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_8"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_106 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_8"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_105 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_9"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_104 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_10"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_103 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_10"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_102 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_11"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_101 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_11"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_100 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_11"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_99 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_98 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_97 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_96 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_95 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_94 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_93 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_11"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_92 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_91 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_90 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_89 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_88 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_87 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_86 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_10"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_85 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_122 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_11"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.AleksejRazumovskij_small1748 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.Aleksejs = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.bandura_clear = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.bandurist_honcharenko_drawn = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.bcamp1BanduraChoir = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.BirutaAkerbergs_small1947 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.bodyWoArms = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.castle_pochep = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.dancer2 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.Empress_Catherine_small = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.Hansen_small1983 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.Kiril_medium = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.KirilRazumovskij1728 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_10"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.KirilRazumovskij_small1728 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.left_arm = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.left_leg = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.map_pochep = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.MichailZemcuznikov_small1788 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.NataljaRozum_small1678 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.NikolajAzbelev_small1857 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.OlgaSott_small1921 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.paperbg2_600x800 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_11"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.right_arm = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.right_leg = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.tree_branch = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.tree_clear_small = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.VeraAzbeleva_small1883 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.ViktorArcimovic_small1820 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"]);
	this.gotoAndStop(39);
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


(lib.Tween57 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.right_arm();
	this.instance.setTransform(40.55,-57.9,1,1,79.9753);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-57.9,-57.9,115.9,115.9);


(lib.Tween56 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.right_arm();
	this.instance.setTransform(-50,-50);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-50,-50,100,100);


(lib.Tween47 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween46 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween45 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween44 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween43 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_125();
	this.instance.setTransform(-226.4,-234.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-226.4,-234.5,453,469);


(lib.Tween42 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_124();
	this.instance.setTransform(-226.4,-234.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-226.4,-234.5,453,469);


(lib.Tween41 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_123();
	this.instance.setTransform(172.45,145.1,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_122();
	this.instance_1.setTransform(-246,-207.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-246,-207.6,490.5,413.7);


(lib.Tween40 = function(mode,startPosition,loop,reversed) {
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

	this.instance = new lib.CachedBmp_122();
	this.instance.setTransform(-246,-207.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-246,-207.6,490.7,413.79999999999995);


(lib.Tween39 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween38 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween37 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween36 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween35 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween34 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween33 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween32 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween31 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween30 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween29 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween28 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween27 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween26 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween25 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween24 = function(mode,startPosition,loop,reversed) {
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


(lib.Tween23 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("Kiril Razumovskij -- 1728", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 278;
	this.text.parent = this;
	this.text.setTransform(-138.9,-11);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-140.9,-13,281.8,25.9);


(lib.Tween22 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_120();
	this.instance.setTransform(-140.9,-13,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-140.9,-13,282,26);


(lib.Tween21 = function(mode,startPosition,loop,reversed) {
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


(lib.map_pochepMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.map_pochep();
	this.instance.setTransform(-184,-130.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.map_pochepMC, new cjs.Rectangle(-184,-130.5,368,261), null);


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


(lib.katrinaMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Empress_Catherine_small();
	this.instance.setTransform(-119.5,-150);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.katrinaMC, new cjs.Rectangle(-119.5,-150,239,300), null);


(lib.dancer2MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.dancer2();
	this.instance.setTransform(-600,-700);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.dancer2MC, new cjs.Rectangle(-600,-700,1200,1400), null);


(lib.banduraMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.bandura_clear();
	this.instance.setTransform(-87,-100);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.banduraMC, new cjs.Rectangle(-87,-100,174,200), null);


(lib.bandura_pic2MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.bcamp1BanduraChoir();
	this.instance.setTransform(-144,-119.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.bandura_pic2MC, new cjs.Rectangle(-144,-119.5,288,239), null);


(lib.bandura_pic1MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.bandurist_honcharenko_drawn();
	this.instance.setTransform(-100,-141.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.bandura_pic1MC, new cjs.Rectangle(-100,-141.5,200,283), null);


(lib.castleMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.castle_pochep();
	this.instance.setTransform(-116.5,-73.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.castleMC, new cjs.Rectangle(-116.5,-73.5,233,147), null);


(lib.aleksejs = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Aleksejs();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.aleksejs, new cjs.Rectangle(0,0,212,315), null);


(lib.Kiril_largeMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.KirilRazumovskij1728();
	this.instance.setTransform(-377,-463.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Kiril_largeMC, new cjs.Rectangle(-377,-463.5,754,927), null);


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


(lib.dancer1MC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// right_arm
	this.instance = new lib.Tween56("synched",0);
	this.instance.setTransform(30,0.5);

	this.instance_1 = new lib.Tween57("synched",0);
	this.instance_1.setTransform(22.5,11.45,1,1,-45);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},4).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_1}]},5).to({state:[{t:this.instance_1}]},5).wait(6));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(4).to({_off:false},0).wait(5).to({rotation:0,x:7},0).wait(5).to({rotation:44.9994,x:-5.5,y:2.45},0).wait(5).to({scaleX:0.9999,scaleY:0.9999,rotation:96.4293,x:-10,y:-16.05},0).wait(5).to({scaleX:1,scaleY:1,rotation:59.6888,y:-5.05},0).wait(5).to({scaleX:0.9999,scaleY:0.9999,rotation:14.6898,x:1,y:8.45},0).wait(5).to({rotation:-30.3097,x:16,y:9.45},0).wait(6));

	// bodywoArms
	this.instance_2 = new lib.bodyWoArms();
	this.instance_2.setTransform(-50,-50);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(40));

	// right_leg
	this.instance_3 = new lib.right_leg();
	this.instance_3.setTransform(-98,-19.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(4).to({rotation:-43.2564,x:-97.15,y:44.85},0).wait(5).to({rotation:-67.7419,x:-71.2,y:73.8},0).wait(5).to({rotation:-112.7402,x:-10.3,y:104.4},0).wait(5).to({rotation:-168.2333,x:59.25,y:64.6},0).wait(5).to({rotation:-114.7654,x:-15.95,y:106.3},0).wait(5).to({rotation:-62.0335,x:-80.6,y:70.15},0).wait(5).to({scaleX:0.9999,scaleY:0.9999,rotation:-32.0336,x:-102.9,y:31.55},0).wait(6));

	// left_leg
	this.instance_4 = new lib.left_leg();
	this.instance_4.setTransform(-33.5,-37);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(4).to({rotation:59.9996,x:29.3,y:-34.8},0).wait(5).to({rotation:110.965,x:47.05,y:8.7},0).wait(5).to({rotation:150.4017,x:33.1,y:47.8},0).wait(5).to({scaleX:0.9999,scaleY:0.9999,rotation:176.3622,x:15.45,y:64.7},0).wait(5).to({rotation:146.3633,x:31.25,y:50.45},0).wait(5).to({rotation:116.3633,x:46.4,y:13.95},0).wait(5).to({rotation:67.6276,x:32.65,y:-28.25},0).wait(6));

	// left_arm
	this.instance_5 = new lib.left_arm();
	this.instance_5.setTransform(-68,-63);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(4).to({rotation:-59.9996,x:-74.8,y:19.3},0).wait(5).to({rotation:-117.1813,x:-13.6,y:68.3},0).wait(5).to({rotation:-182.6746,x:77.35,y:46.05},0).wait(5).to({rotation:-227.6736,x:95.2,y:-21.9},0).wait(5).to({scaleX:0.9999,scaleY:0.9999,rotation:-171.9438,x:67.1,y:56.3},0).wait(5).to({rotation:-126.9444,x:3.2,y:73.8},0).wait(5).to({rotation:-75.9797,x:-60.55,y:37.7},0).wait(6));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-107.4,-89.2,202.60000000000002,206.9);


// stage content:
(lib.AncestorSplit_31May2014_copyHTML5_HTML5Canvas_Scene2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {nar2:0,wrong_nar2:375,continue_nar2:379,wrongbranch_nar2:1569};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,101,374,375,379,1559,1569,1571,2305];
	this.streamSoundSymbolsList[101] = [{id:"nar2_pt1",startFrame:101,endFrame:379,loop:1,offset:0}];
	this.streamSoundSymbolsList[1569] = [{id:"nar2_wrongbranch",startFrame:1569,endFrame:2269,loop:1,offset:0}];
	this.streamSoundSymbolsList[1571] = [{id:"nutcracker_64kb_short_quiet",startFrame:1571,endFrame:2307,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}
	this.frame_101 = function() {
		var soundInstance = playSound("nar2_pt1",0);
		this.InsertIntoSoundStreamData(soundInstance,101,379,1);
		soundInstance.volume = 1.0;
	}
	this.frame_374 = function() {
		this.stop();
		
		this.button2.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar2");
		}
		
		
		this.button2_wrong.addEventListener("click", fl_WrongClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_WrongClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("wrongbranch_nar2");
		}
		
		/*import flash.events.Event;
		
		button2.addEventListener(MouseEvent.MOUSE_UP, continue_nar2);
		
		function continue_nar2(e:Event):void {
			button2.removeEventListener(MouseEvent.MOUSE_UP, continue_nar2);
			gotoAndPlay("continue_nar2");
		}
		
		button2_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar2);
		
		function wrong_nar2(e:Event):void {
			button2_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar2);
			gotoAndPlay("wrongbranch_nar2");
		}
		*/
	}
	this.frame_375 = function() {
		this.stop();
		
		this.button2.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar2");
		}
		
		/*import flash.events.Event;
		
		button2.addEventListener(MouseEvent.MOUSE_UP, continue_nar2a);
		
		function continue_nar2a(e:Event):void {
			button2.removeEventListener(MouseEvent.MOUSE_UP, continue_nar2);
			gotoAndPlay("continue_nar2");
		}
		
		button2_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar2a);
		
		function wrong_nar2a(e:Event):void {
			button2_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar2);
			gotoAndPlay("wrongbranch_nar2");
		}
		*/
	}
	this.frame_379 = function() {
		playSound("nar2_pt2_finalMamma");
	}
	this.frame_1559 = function() {
		/* gotoAndPlay("tree","Scene 1");*/
		
		window.open("AncestorSplit_31May2014_copyHTML5_HTML5_Canvas.html?18596", "_self");
	}
	this.frame_1569 = function() {
		var soundInstance = playSound("nar2_wrongbranch",0);
		this.InsertIntoSoundStreamData(soundInstance,1569,2269,1);
		soundInstance.volume = 2.0;
	}
	this.frame_1571 = function() {
		var soundInstance = playSound("nutcracker_64kb_short_quiet",0);
		this.InsertIntoSoundStreamData(soundInstance,1571,2307,1);
		soundInstance.volume = 0.2;
	}
	this.frame_2305 = function() {
		this.gotoAndStop("wrong_nar2");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(101).call(this.frame_101).wait(273).call(this.frame_374).wait(1).call(this.frame_375).wait(4).call(this.frame_379).wait(1180).call(this.frame_1559).wait(10).call(this.frame_1569).wait(2).call(this.frame_1571).wait(734).call(this.frame_2305).wait(2));

	// text_nar2
	this.text = new cjs.Text("Kiril Razumovskij -- 1728", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 278;
	this.text.parent = this;
	this.text.setTransform(191.1,23.9);

	this.instance = new lib.Tween22("synched",0);
	this.instance.setTransform(330,34.9);
	this.instance._off = true;

	this.instance_1 = new lib.Tween23("synched",0);
	this.instance_1.setTransform(168.35,34.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text}]}).to({state:[{t:this.instance}]},45).to({state:[{t:this.instance_1}]},64).to({state:[]},253).to({state:[]},1194).wait(751));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(45).to({_off:false},0).to({_off:true,x:168.35},64).wait(2198));

	// Kiril_large
	this.instance_2 = new lib.Kiril_largeMC();
	this.instance_2.setTransform(328.85,294.95,0.0955,0.0954,0,0,0,-0.5,-3.6);
	this.instance_2.alpha = 0;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(15).to({_off:false},0).to({regX:0.7,regY:-29.4,scaleX:0.87,scaleY:0.8694,x:329.65,y:262.75,alpha:1},30).to({x:-327.4,y:19.6,alpha:0},56).to({_off:true},261).wait(1945));

	// _NR1678
	this.instance_3 = new lib.Tween3("synched",0);
	this.instance_3.setTransform(333.6,342.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(90).to({startPosition:0},0).to({alpha:0},17).to({_off:true},1).wait(2199));

	// _KR1728
	this.instance_4 = new lib.Tween20("synched",0);
	this.instance_4.setTransform(509.15,383.35);

	this.instance_5 = new lib.Tween21("synched",0);
	this.instance_5.setTransform(331.75,241.35);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({_off:true,x:331.75,y:241.35},30).wait(2277));
	this.timeline.addTween(cjs.Tween.get(this.instance_5).to({_off:false},30).wait(60).to({startPosition:0},0).to({alpha:0},17).to({_off:true},1).wait(2199));

	// _AR1748
	this.instance_6 = new lib.AleksejRazumovskij_small1748();
	this.instance_6.setTransform(475.55,190.05);

	this.instance_7 = new lib.Tween24("synched",0);
	this.instance_7.setTransform(510.55,237.05);
	this.instance_7._off = true;

	this.instance_8 = new lib.Tween25("synched",0);
	this.instance_8.setTransform(510.55,237.05);
	this.instance_8.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_6}]}).to({state:[{t:this.instance_7}]},90).to({state:[{t:this.instance_8}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// _MZ1788
	this.instance_9 = new lib.MichailZemcuznikov_small1788();
	this.instance_9.setTransform(350.95,114);

	this.instance_10 = new lib.Tween26("synched",0);
	this.instance_10.setTransform(385.95,159);
	this.instance_10._off = true;

	this.instance_11 = new lib.Tween27("synched",0);
	this.instance_11.setTransform(385.95,159);
	this.instance_11.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9}]}).to({state:[{t:this.instance_10}]},90).to({state:[{t:this.instance_11}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// _VA1820
	this.instance_12 = new lib.ViktorArcimovic_small1820();
	this.instance_12.setTransform(232,113);

	this.instance_13 = new lib.Tween28("synched",0);
	this.instance_13.setTransform(267,158);
	this.instance_13._off = true;

	this.instance_14 = new lib.Tween29("synched",0);
	this.instance_14.setTransform(267,158);
	this.instance_14.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_12}]}).to({state:[{t:this.instance_13}]},90).to({state:[{t:this.instance_14}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// _NA1857
	this.instance_15 = new lib.NikolajAzbelev_small1857();
	this.instance_15.setTransform(117,184);

	this.instance_16 = new lib.Tween30("synched",0);
	this.instance_16.setTransform(152,229);
	this.instance_16._off = true;

	this.instance_17 = new lib.Tween31("synched",0);
	this.instance_17.setTransform(152,229);
	this.instance_17.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_15}]}).to({state:[{t:this.instance_16}]},90).to({state:[{t:this.instance_17}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// _VA1883
	this.instance_18 = new lib.VeraAzbeleva_small1883();
	this.instance_18.setTransform(109,329);

	this.instance_19 = new lib.Tween32("synched",0);
	this.instance_19.setTransform(144,374);
	this.instance_19._off = true;

	this.instance_20 = new lib.Tween33("synched",0);
	this.instance_20.setTransform(144,374);
	this.instance_20.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_18}]}).to({state:[{t:this.instance_19}]},90).to({state:[{t:this.instance_20}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// _OS1921
	this.instance_21 = new lib.OlgaSott_small1921();
	this.instance_21.setTransform(200.1,466.45);

	this.instance_22 = new lib.Tween34("synched",0);
	this.instance_22.setTransform(235.1,511.45);
	this.instance_22._off = true;

	this.instance_23 = new lib.Tween35("synched",0);
	this.instance_23.setTransform(235.1,511.45);
	this.instance_23.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_21}]}).to({state:[{t:this.instance_22}]},90).to({state:[{t:this.instance_23}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_22).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// _BA1947
	this.instance_24 = new lib.BirutaAkerbergs_small1947();
	this.instance_24.setTransform(349.05,467);

	this.instance_25 = new lib.Tween36("synched",0);
	this.instance_25.setTransform(384.05,512);
	this.instance_25._off = true;

	this.instance_26 = new lib.Tween37("synched",0);
	this.instance_26.setTransform(384.05,512);
	this.instance_26.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_24}]}).to({state:[{t:this.instance_25}]},90).to({state:[{t:this.instance_26}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_25).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// _0H1983
	this.instance_27 = new lib.Hansen_small1983();
	this.instance_27.setTransform(490.1,462.7);

	this.instance_28 = new lib.Tween38("synched",0);
	this.instance_28.setTransform(525.1,507.7);
	this.instance_28._off = true;

	this.instance_29 = new lib.Tween39("synched",0);
	this.instance_29.setTransform(525.1,507.7);
	this.instance_29.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_27}]}).to({state:[{t:this.instance_28}]},90).to({state:[{t:this.instance_29}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_28).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// arrows
	this.instance_30 = new lib.CachedBmp_85();
	this.instance_30.setTransform(569.95,472.7,0.5,0.5);

	this.instance_31 = new lib.CachedBmp_122();
	this.instance_31.setTransform(151.45,120,0.5,0.5);

	this.instance_32 = new lib.Tween40("synched",0);
	this.instance_32.setTransform(397.5,327.6);
	this.instance_32._off = true;

	this.instance_33 = new lib.Tween41("synched",0);
	this.instance_33.setTransform(397.5,327.6);
	this.instance_33.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_31},{t:this.instance_30}]}).to({state:[{t:this.instance_32}]},90).to({state:[{t:this.instance_33}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_32).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// vine
	this.instance_34 = new lib.CachedBmp_86();
	this.instance_34.setTransform(88.1,62.4,0.5,0.5);

	this.instance_35 = new lib.Tween42("synched",0);
	this.instance_35.setTransform(314.5,296.9);
	this.instance_35._off = true;

	this.instance_36 = new lib.Tween43("synched",0);
	this.instance_36.setTransform(314.5,296.9);
	this.instance_36.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_34}]}).to({state:[{t:this.instance_35}]},90).to({state:[{t:this.instance_36}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_35).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// branches
	this.instance_37 = new lib.tree_branch();
	this.instance_37.setTransform(345.5,382.5);

	this.instance_38 = new lib.tree_branch();
	this.instance_38.setTransform(542.6,507,0.8293,1.0441,0,-74.6679,-29.9986);

	this.instance_39 = new lib.tree_branch();
	this.instance_39.setTransform(586.45,490.9,1,1,-29.9992);

	this.instance_40 = new lib.tree_branch();
	this.instance_40.setTransform(446.5,486.5,1,1.164,0,30.7843,0);

	this.instance_41 = new lib.tree_branch();
	this.instance_41.setTransform(481.15,493.5,0.5341,0.7659,59.9996);

	this.instance_42 = new lib.tree_branch();
	this.instance_42.setTransform(436.1,479.85,1,1,45);

	this.instance_43 = new lib.tree_branch();
	this.instance_43.setTransform(346.3,480.2,1,1.451,59.9998);

	this.instance_44 = new lib.tree_branch();
	this.instance_44.setTransform(294.15,480.9,1,1,45);

	this.instance_45 = new lib.tree_branch();
	this.instance_45.setTransform(161.95,487.7,1,1,-74.9998);

	this.instance_46 = new lib.tree_branch();
	this.instance_46.setTransform(132.55,458.9,1.1309,1,0,-74.9998,-47.1609);

	this.instance_47 = new lib.tree_branch();
	this.instance_47.setTransform(109.5,316.2,1.7805,1,-45);

	this.instance_48 = new lib.tree_branch();
	this.instance_48.setTransform(171.5,147.5);

	this.instance_49 = new lib.tree_branch();
	this.instance_49.setTransform(212.9,188.05,1,1,-135);

	this.instance_50 = new lib.tree_branch();
	this.instance_50.setTransform(312.9,172.5,1,1,-120.0004);

	this.instance_51 = new lib.tree_branch();
	this.instance_51.setTransform(417.5,166.5,0.4634,1,-90);

	this.instance_52 = new lib.tree_branch();
	this.instance_52.setTransform(470.45,310.5,1.5366,1);

	this.instance_53 = new lib.tree_branch();
	this.instance_53.setTransform(462.85,426.15,1,0.7,-135.0009);

	this.instance_54 = new lib.tree_branch();
	this.instance_54.setTransform(397.6,383.55,1.6415,1,14.9983);

	this.instance_55 = new lib.tree_branch();
	this.instance_55.setTransform(459.4,328.95,1,1,-83.995);

	this.instance_56 = new lib.tree_branch();
	this.instance_56.setTransform(440.85,152.9,1,1,-45);

	this.instance_57 = new lib.Tween44("synched",0);
	this.instance_57.setTransform(377.45,331.65);
	this.instance_57._off = true;

	this.instance_58 = new lib.Tween45("synched",0);
	this.instance_58.setTransform(377.45,331.65);
	this.instance_58.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_56},{t:this.instance_55},{t:this.instance_54},{t:this.instance_53},{t:this.instance_52},{t:this.instance_51},{t:this.instance_50},{t:this.instance_49},{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_41},{t:this.instance_40},{t:this.instance_39},{t:this.instance_38},{t:this.instance_37}]}).to({state:[{t:this.instance_57}]},90).to({state:[{t:this.instance_58}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_57).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// tree
	this.instance_59 = new lib.tree_clear_small();
	this.instance_59.setTransform(214.5,138);

	this.instance_60 = new lib.Tween46("synched",0);
	this.instance_60.setTransform(322,322);
	this.instance_60._off = true;

	this.instance_61 = new lib.Tween47("synched",0);
	this.instance_61.setTransform(322,322);
	this.instance_61.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_59}]}).to({state:[{t:this.instance_60}]},90).to({state:[{t:this.instance_61}]},17).to({state:[]},1).wait(2199));
	this.timeline.addTween(cjs.Tween.get(this.instance_60).wait(90).to({_off:false},0).to({_off:true,alpha:0},17).wait(2200));

	// Aleksejs
	this.instance_62 = new lib.aleksejs();
	this.instance_62.setTransform(478.05,212,1,1,0,0,0,106,157.5);
	this.instance_62._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_62).wait(109).to({_off:false},0).to({_off:true},171).wait(2027));

	// Kiril
	this.instance_63 = new lib.kiril_mediumMC();
	this.instance_63.setTransform(169.15,214);
	this.instance_63._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_63).wait(151).to({_off:false},0).wait(129).to({x:275.95,y:196.2},28).to({_off:true},53).wait(595).to({_off:false,x:916.55,y:373.8},0).to({x:502.5,y:318.8},24).to({_off:true},327).wait(1000));

	// arrow
	this.shape = new cjs.Shape();
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(4.3,0).lineTo(-4.3,0);
	this.shape.setTransform(297.025,196);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(-4.1,0.9).lineTo(-3.1,0.1).lineTo(0.9,0.1).lineTo(4.1,-0.9);
	this.shape_1.setTransform(297.75,195.925);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(-3.8,1.8).lineTo(-3.9,0.2).lineTo(-0,0.2).lineTo(3.9,-1.8);
	this.shape_2.setTransform(298.4,195.85);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(-3,2.8).lineTo(-4.2,0.3).lineTo(-0.6,0.3).lineTo(4.2,-2.8);
	this.shape_3.setTransform(298.575,195.75);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(-2.3,3.7).lineTo(-4.5,0.3).lineTo(-1.2,0.3).lineTo(4.5,-3.7);
	this.shape_4.setTransform(298.775,195.675);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(-1.5,4.7).lineTo(-4.8,0.4).lineTo(-1.8,0.4).lineTo(4.8,-4.7);
	this.shape_5.setTransform(298.95,195.6);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(-0.8,5.6).lineTo(-5.1,0.5).lineTo(-2.3,0.5).lineTo(5.1,-5.6);
	this.shape_6.setTransform(299.15,195.525);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(0,6.5).lineTo(-5.4,0.6).lineTo(-3,0.6).lineTo(5.4,-6.5);
	this.shape_7.setTransform(299.35,195.45);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(0.8,7.5).lineTo(-5.7,0.6).lineTo(-3.5,0.6).lineTo(5.7,-7.4);
	this.shape_8.setTransform(299.55,195.4);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(1.5,8.4).lineTo(-6,0.7).lineTo(-4.1,0.7).lineTo(6,-8.4);
	this.shape_9.setTransform(299.7,195.3);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(2.3,9.3).lineTo(-6.3,0.8).lineTo(-4.6,0.8).lineTo(6.3,-9.3);
	this.shape_10.setTransform(299.9,195.225);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(3,10.3).lineTo(-6.6,0.8).lineTo(-5.3,0.8).lineTo(6.6,-10.3);
	this.shape_11.setTransform(300.1,195.15);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(3.8,11.2).lineTo(-6.9,0.9).lineTo(-5.8,0.9).lineTo(6.9,-11.2);
	this.shape_12.setTransform(300.275,195.075);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(4.5,12.1).lineTo(-7.2,1).lineTo(-6.4,1).lineTo(7.2,-12.1);
	this.shape_13.setTransform(300.475,195);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(5.3,13.1).lineTo(-7.5,1.1).lineTo(-6.9,1.1).lineTo(7.5,-13);
	this.shape_14.setTransform(300.65,194.9);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(6.1,14).lineTo(-7.8,1.2).lineTo(-7.5,1.2).lineTo(7.8,-14);
	this.shape_15.setTransform(300.825,194.825);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.beginFill().beginStroke("#000000").setStrokeStyle(4.2,1,1).moveTo(-22.3,1.3).lineTo(-6.2,-14.9).moveTo(-7.4,14.9).lineTo(-22.3,1.3).moveTo(22.3,1.3).lineTo(-22.3,1.3);
	this.shape_16.setTransform(315.275,194.75);

	this.text_1 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 56;
	this.text_1.lineWidth = 150;
	this.text_1.parent = this;
	this.text_1.setTransform(261.55,70.9);

	this.text_2 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_2.textAlign = "center";
	this.text_2.lineHeight = 56;
	this.text_2.lineWidth = 150;
	this.text_2.parent = this;
	this.text_2.setTransform(261.55,65.9);

	this.text_3 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_3.textAlign = "center";
	this.text_3.lineHeight = 56;
	this.text_3.lineWidth = 150;
	this.text_3.parent = this;
	this.text_3.setTransform(261.55,65.9);

	this.text_4 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_4.textAlign = "center";
	this.text_4.lineHeight = 56;
	this.text_4.lineWidth = 150;
	this.text_4.parent = this;
	this.text_4.setTransform(261.55,65.9);

	this.text_5 = new cjs.Text("What", "bold 44px 'Verdana'");
	this.text_5.textAlign = "center";
	this.text_5.lineHeight = 56;
	this.text_5.lineWidth = 150;
	this.text_5.parent = this;
	this.text_5.setTransform(261.55,65.9);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(0,5).lineTo(0,-5);
	this.shape_17.setTransform(120.5,95.025);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-2,-5.4).lineTo(-2,-5.2).lineTo(2,5.4);
	this.shape_18.setTransform(122.55,95.575);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-4.1,-5.8).lineTo(4.1,5.8);
	this.shape_19.setTransform(124.6,96.175);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-6.1,-6.3).lineTo(6.1,6.3);
	this.shape_20.setTransform(126.625,96.65);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-8.2,-6.4).lineTo(-8.2,-6.8).lineTo(8.2,6.8);
	this.shape_21.setTransform(128.675,97.1);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-10.2,-6.7).lineTo(-10.2,-7.2).lineTo(10.2,7.2);
	this.shape_22.setTransform(130.725,97.575);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-12.3,-7).lineTo(-12.3,-7.7).lineTo(12.3,7.7);
	this.shape_23.setTransform(132.75,98.05);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-14.3,-7.3).lineTo(-14.3,-8.2).lineTo(14.3,8.2);
	this.shape_24.setTransform(134.8,98.525);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-16.3,-7.6).lineTo(-16.3,-8.6).lineTo(16.3,8.6);
	this.shape_25.setTransform(136.85,98.975);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-18.4,-7.9).lineTo(-18.4,-9.1).lineTo(18.4,9.1);
	this.shape_26.setTransform(138.9,99.45);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-20.4,-8.2).lineTo(-20.4,-9.6).lineTo(20.4,9.6);
	this.shape_27.setTransform(140.925,99.925);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-22.5,-8.6).lineTo(-22.5,-10.1).lineTo(22.5,10);
	this.shape_28.setTransform(142.975,100.4);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-24.5,-8.8).lineTo(-24.5,-10.5).lineTo(24.5,10.6);
	this.shape_29.setTransform(145.025,100.85);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-26.6,-9.1).lineTo(-26.6,-11).lineTo(26.6,11);
	this.shape_30.setTransform(147.075,101.325);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-28.6,-9.4).lineTo(-28.6,-11.5).lineTo(28.6,11.5);
	this.shape_31.setTransform(149.1,101.8);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-30.7,-9.7).lineTo(-30.7,-12).lineTo(30.7,12);
	this.shape_32.setTransform(151.15,102.275);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-32.7,-10).lineTo(-32.7,-12.5).lineTo(32.7,12.5);
	this.shape_33.setTransform(153.2,102.75);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-34.8,-10.3).lineTo(-34.8,-12.9).lineTo(34.8,12.9);
	this.shape_34.setTransform(155.25,103.225);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-36.8,-10.6).lineTo(-36.8,-13.4).lineTo(36.8,13.4);
	this.shape_35.setTransform(157.275,103.7);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-38.8,-10.9).lineTo(-38.8,-13.9).lineTo(38.8,13.9);
	this.shape_36.setTransform(159.325,104.15);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-40.9,-11.2).lineTo(-40.9,-14.4).lineTo(40.9,14.4);
	this.shape_37.setTransform(161.375,104.625);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-42.9,-11.5).lineTo(-42.9,-14.8).lineTo(42.9,14.9);
	this.shape_38.setTransform(163.425,105.1);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-44.9,-11.8).lineTo(-44.9,-15.3).lineTo(45,15.3);
	this.shape_39.setTransform(165.45,105.575);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-47,-12.1).lineTo(-47,-15.8).lineTo(47,15.8);
	this.shape_40.setTransform(167.5,106.025);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-49.1,-12.4).lineTo(-49.1,-16.3).lineTo(49,16.3);
	this.shape_41.setTransform(169.55,106.5);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-51.1,-12.7).lineTo(-51.1,-16.7).lineTo(51.1,16.7);
	this.shape_42.setTransform(171.6,106.975);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-53.1,-13).lineTo(-53.1,-17.2).lineTo(53.1,17.2);
	this.shape_43.setTransform(173.625,107.425);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-55.2,-13.3).lineTo(-55.2,-17.7).lineTo(55.2,17.7);
	this.shape_44.setTransform(175.675,107.9);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-57.2,-13.6).lineTo(-57.2,-18.2).lineTo(57.2,18.2);
	this.shape_45.setTransform(177.725,108.375);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-59.3,-13.9).lineTo(-59.3,-18.6).lineTo(59.3,18.7);
	this.shape_46.setTransform(179.775,108.85);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-61.3,-14.2).lineTo(-61.3,-19.1).lineTo(61.3,19.1);
	this.shape_47.setTransform(181.8,109.325);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-63.3,-14.5).lineTo(-63.3,-19.6).lineTo(63.3,19.6);
	this.shape_48.setTransform(183.85,109.8);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-65.4,-14.8).lineTo(-65.4,-20.1).lineTo(65.4,20.1);
	this.shape_49.setTransform(185.9,110.275);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-67.4,-15.2).lineTo(-67.4,-20.5).lineTo(67.5,20.6);
	this.shape_50.setTransform(187.95,110.75);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-69.5,-15.4).lineTo(-69.5,-21).lineTo(69.5,21);
	this.shape_51.setTransform(189.975,111.2);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-71.5,-15.7).lineTo(-71.5,-21.5).lineTo(71.5,21.5);
	this.shape_52.setTransform(192.025,111.675);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-73.6,-16).lineTo(-73.6,-22).lineTo(73.6,22);
	this.shape_53.setTransform(194.075,112.15);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-75.6,-16.3).lineTo(-75.6,-22.5).lineTo(75.6,22.5);
	this.shape_54.setTransform(196.125,112.6);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-77.7,-16.6).lineTo(-77.7,-22.9).lineTo(77.7,22.9);
	this.shape_55.setTransform(198.15,113.075);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-79.7,-16.9).lineTo(-79.7,-23.4).lineTo(79.7,23.4);
	this.shape_56.setTransform(200.2,113.55);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-81.8,-17.2).lineTo(-81.8,-23.9).lineTo(81.8,23.9);
	this.shape_57.setTransform(202.25,114.025);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-83.8,-17.5).lineTo(-83.8,-24.4).lineTo(83.8,24.4);
	this.shape_58.setTransform(204.3,114.475);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-85.8,-17.8).lineTo(-85.8,-24.9).lineTo(85.8,24.9);
	this.shape_59.setTransform(206.325,114.95);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-87.9,-18.1).lineTo(-87.9,-25.3).lineTo(87.9,25.3);
	this.shape_60.setTransform(208.375,115.425);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-89.9,-18.4).lineTo(-89.9,-25.8).lineTo(89.9,25.8);
	this.shape_61.setTransform(210.425,115.9);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-92,-18.7).lineTo(-92,-26.3).lineTo(92,26.3);
	this.shape_62.setTransform(212.475,116.375);

	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-94,-19).lineTo(-94,-26.8).lineTo(94,26.8);
	this.shape_63.setTransform(214.5,116.85);

	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-96.1,-19.3).lineTo(-96.1,-27.2).lineTo(96.1,27.2);
	this.shape_64.setTransform(216.55,117.325);

	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-98.1,-19.6).lineTo(-98.1,-27.7).lineTo(98.1,27.7);
	this.shape_65.setTransform(218.6,117.775);

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-100.2,-19.9).lineTo(-100.2,-28.2).lineTo(100.2,28.2);
	this.shape_66.setTransform(220.65,118.25);

	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-102.2,-20.2).lineTo(-102.2,-28.7).lineTo(102.2,28.7);
	this.shape_67.setTransform(222.675,118.725);

	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-104.2,-20.5).lineTo(-104.2,-29.1).lineTo(104.2,29.2);
	this.shape_68.setTransform(224.725,119.2);

	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-106.3,-20.8).lineTo(-106.3,-29.6).lineTo(106.3,29.6);
	this.shape_69.setTransform(226.775,119.65);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-108.3,-21.1).lineTo(-108.3,-30.1).lineTo(108.3,30.1);
	this.shape_70.setTransform(228.825,120.125);

	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-110.3,-21.4).lineTo(-110.3,-30.5).lineTo(110.3,30.6);
	this.shape_71.setTransform(230.85,120.6);

	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-112.4,-21.7).lineTo(-112.4,-31).lineTo(112.4,31);
	this.shape_72.setTransform(232.9,121.075);

	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-114.4,-22).lineTo(-114.4,-31.5).lineTo(114.4,31.5);
	this.shape_73.setTransform(234.95,121.525);

	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-116.5,-22.3).lineTo(-116.5,-32).lineTo(116.5,32);
	this.shape_74.setTransform(236.975,122);

	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-118.5,-22.6).lineTo(-118.5,-32.5).lineTo(118.5,32.5);
	this.shape_75.setTransform(239.025,122.475);

	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-120.7,-23).lineTo(-120.7,-33).lineTo(120.7,33);
	this.shape_76.setTransform(241.225,123);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-118.3,-22.4).lineTo(-118,-32).lineTo(-83.3,-23.3).curveTo(4.8,-0.1,92.3,24.8).lineTo(118.3,32);
	this.shape_77.setTransform(245.125,124.05);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-115.9,-21.7).lineTo(-115.3,-31.1).lineTo(-82.1,-23.4).curveTo(1.7,-2,84.4,22.2).lineTo(91.4,24.5).lineTo(115.9,31.1);
	this.shape_78.setTransform(249.025,124.95);

	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-113.4,-21.1).lineTo(-112.6,-30.2).lineTo(-80.9,-23.4).curveTo(-1.5,-4.2,76.5,19.7).lineTo(83.4,22.2).lineTo(113.4,30.2);
	this.shape_79.setTransform(252.925,125.9);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-111,-20.3).lineTo(-109.9,-29.3).lineTo(-79.8,-23.5).curveTo(-4.6,-6.1,68.6,17.1).lineTo(75.3,19.8).lineTo(111,29.3);
	this.shape_80.setTransform(256.85,126.8);

	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-108.6,-19.7).lineTo(-107.2,-28.4).lineTo(-78.6,-23.5).curveTo(-7.7,-8.2,60.7,14.6).lineTo(67.3,17.4).lineTo(108.6,28.4);
	this.shape_81.setTransform(260.725,127.725);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-106.1,-19).lineTo(-104.5,-27.5).lineTo(-77.4,-23.6).curveTo(-10.8,-10.3,52.9,12.1).lineTo(59.2,15.1).lineTo(106.2,27.6);
	this.shape_82.setTransform(264.65,128.65);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-103.7,-18.3).lineTo(-101.8,-26.6).lineTo(-76.2,-23.6).curveTo(-14,-12.3,45,9.5).lineTo(51.2,12.7).lineTo(103.7,26.6);
	this.shape_83.setTransform(268.525,129.575);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-101.3,-17.6).lineTo(-99.1,-25.8).lineTo(-75.1,-23.7).curveTo(-17.1,-14.4,37.1,6.9).lineTo(43.1,10.3).lineTo(101.3,25.8);
	this.shape_84.setTransform(272.425,130.5);

	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-98.9,-16.9).lineTo(-96.4,-24.9).lineTo(-73.9,-23.8).curveTo(-20.3,-16.5,29.1,4.4).lineTo(35,8).lineTo(98.8,24.8);
	this.shape_85.setTransform(276.35,131.4);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-96.4,-16.2).lineTo(-93.6,-24).lineTo(-72.7,-23.8).curveTo(-23.4,-18.5,21.3,1.9).lineTo(27,5.6).lineTo(96.4,24);
	this.shape_86.setTransform(280.225,132.325);

	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-94,-15.2).lineTo(-90.9,-22.7).lineTo(-71.6,-23.5).curveTo(-26.5,-20.2,13.4,-0.3).lineTo(19,3.6).lineTo(94,23.5);
	this.shape_87.setTransform(284.15,132.875);

	this.shape_88 = new cjs.Shape();
	this.shape_88.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-91.6,-14).lineTo(-88.3,-21.3).lineTo(-70.4,-23.1).curveTo(-29.7,-21.7,5.4,-2.3).lineTo(10.9,1.8).lineTo(91.6,23);
	this.shape_88.setTransform(288.05,133.3);

	this.shape_89 = new cjs.Shape();
	this.shape_89.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-89.2,-12.8).lineTo(-85.6,-19.9).lineTo(-69.3,-22.6).curveTo(-32.8,-23.3,-2.5,-4.3).lineTo(2.8,-0.1).lineTo(89.1,22.7);
	this.shape_89.setTransform(291.95,133.7392);

	this.shape_90 = new cjs.Shape();
	this.shape_90.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-86.7,-11.5).lineTo(-82.9,-18.4).lineTo(-68.1,-22.1).curveTo(-35.9,-24.7,-10.4,-6.3).lineTo(-5.2,-1.9).lineTo(86.7,22.4);
	this.shape_90.setTransform(295.85,134.0086);

	this.shape_91 = new cjs.Shape();
	this.shape_91.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-84.3,-10.1).lineTo(-80.1,-16.7).lineTo(-66.9,-21.3).curveTo(-39,-26,-18.3,-8).lineTo(-13.3,-3.5).lineTo(84.3,22.3);
	this.shape_91.setTransform(299.75,134.1716);

	this.shape_92 = new cjs.Shape();
	this.shape_92.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-81.8,-8.5).lineTo(-77.4,-14.9).lineTo(-65.7,-20.5).curveTo(-42.1,-27.1,-26.1,-9.6).lineTo(-21.3,-4.9).lineTo(81.9,22.3);
	this.shape_92.setTransform(303.65,134.1844);

	this.shape_93 = new cjs.Shape();
	this.shape_93.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-79.4,-6.8).lineTo(-74.7,-13).lineTo(-64.6,-19.5).curveTo(-45.3,-28.1,-34.1,-11.2).lineTo(-29.4,-6.3).lineTo(79.4,22.4);
	this.shape_93.setTransform(307.55,134.0776);

	this.shape_94 = new cjs.Shape();
	this.shape_94.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-77,-5).lineTo(-72,-11.1).lineTo(-63.4,-18.5).curveTo(-48.4,-29.1,-41.9,-12.6).lineTo(-37.4,-7.5).lineTo(77,22.6);
	this.shape_94.setTransform(311.45,133.9019);

	this.shape_95 = new cjs.Shape();
	this.shape_95.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-74.6,-3.1).lineTo(-62.2,-17.4).curveTo(-51.6,-30,-49.8,-13.9).lineTo(-45.5,-8.7).lineTo(74.5,22.9);
	this.shape_95.setTransform(315.35,133.6293);

	this.shape_96 = new cjs.Shape();
	this.shape_96.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-72.1,-1.2).lineTo(-66.6,-6.8).lineTo(-61.1,-16.2).curveTo(-54.7,-30.8,-57.7,-15.3).lineTo(-53.5,-9.8).lineTo(72.1,23.3);
	this.shape_96.setTransform(319.275,133.3341);

	this.shape_97 = new cjs.Shape();
	this.shape_97.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-69.7,0.7).lineTo(-63.8,-4.7).lineTo(-61.4,-10.9).lineTo(-59.9,-15).curveTo(-57.8,-31.6,-65.6,-16.5).lineTo(-61.5,-10.9).lineTo(-61.4,-10.9).lineTo(69.7,23.7);
	this.shape_97.setTransform(323.15,132.9718);

	this.shape_98 = new cjs.Shape();
	this.shape_98.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-64.1,2.8).lineTo(-58,-2.4).lineTo(-56.5,-9.3).lineTo(-55.6,-13.7).curveTo(-57.8,-32.3,-70.4,-17.7).lineTo(-66.5,-11.9).lineTo(-56.5,-9.3).lineTo(70.4,24.1);
	this.shape_98.setTransform(323.925,132.5398);

	this.shape_99 = new cjs.Shape();
	this.shape_99.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-56.5,4.8).lineTo(-50.2,-0.2).lineTo(-49.6,-7.7).lineTo(-49.3,-12.4).curveTo(-55.8,-32.9,-73.1,-18.9).lineTo(-69.4,-12.9).lineTo(-49.6,-7.7).lineTo(73.1,24.6);
	this.shape_99.setTransform(322.675,132.0974);

	this.shape_100 = new cjs.Shape();
	this.shape_100.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-48.9,7).lineTo(-42.3,2.2).lineTo(-42.7,-6.1).lineTo(-42.9,-11).curveTo(-53.7,-33.6,-75.8,-20).lineTo(-72.2,-13.9).lineTo(-42.7,-6.1).lineTo(75.9,25.1);
	this.shape_100.setTransform(321.4,131.5953);

	this.shape_101 = new cjs.Shape();
	this.shape_101.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-41.3,9.1).lineTo(-34.4,4.5).lineTo(-35.8,-4.5).lineTo(-36.6,-9.6).curveTo(-51.7,-34.2,-78.6,-21.1).lineTo(-75.2,-14.8).lineTo(-35.8,-4.5).lineTo(78.6,25.7);
	this.shape_101.setTransform(320.15,131.0853);

	this.shape_102 = new cjs.Shape();
	this.shape_102.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-28.9,-2.8).lineTo(-30.2,-8.2).curveTo(-49.6,-34.8,-81.3,-22.2).lineTo(-78.1,-15.7).closePath().moveTo(-33.7,11.2).lineTo(-26.6,6.8).lineTo(-28.9,-2.8).lineTo(81.3,26.2);
	this.shape_102.setTransform(318.875,130.5224);

	this.shape_103 = new cjs.Shape();
	this.shape_103.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-22,-1.1).lineTo(-23.9,-6.8).curveTo(-47.6,-35.4,-84.1,-23.2).lineTo(-81,-16.6).closePath().moveTo(-26.2,13.4).lineTo(-18.7,9.2).lineTo(-22,-1.1).lineTo(84,26.8);
	this.shape_103.setTransform(317.6,129.9615);

	this.shape_104 = new cjs.Shape();
	this.shape_104.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-15.2,0.6).lineTo(-17.6,-5.3).curveTo(-45.6,-35.9,-86.8,-24.3).lineTo(-83.9,-17.5).closePath().moveTo(-18.6,15.6).lineTo(-10.8,11.6).lineTo(-15.2,0.6).lineTo(86.8,27.5);
	this.shape_104.setTransform(316.35,129.3788);

	this.shape_105 = new cjs.Shape();
	this.shape_105.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-8.4,2.3).lineTo(-11.2,-3.9).curveTo(-43.5,-36.4,-89.5,-25.3).lineTo(-86.7,-18.3).closePath().moveTo(-10.9,17.8).lineTo(-2.9,14).lineTo(-8.4,2.3).lineTo(89.5,28.1);
	this.shape_105.setTransform(315.075,128.7525);

	this.shape_106 = new cjs.Shape();
	this.shape_106.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(-1.6,4.1).lineTo(-5,-2.4).curveTo(-41.6,-36.9,-92.3,-26.2).lineTo(-89.7,-19.1).closePath().moveTo(-3.4,20).lineTo(4.9,16.5).lineTo(-1.6,4.1).lineTo(92.3,28.8);
	this.shape_106.setTransform(313.85,128.1349);

	this.shape_107 = new cjs.Shape();
	this.shape_107.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(5.3,5.9).lineTo(1.4,-0.9).curveTo(-39.5,-37.4,-95,-27.2).lineTo(-92.5,-19.9).closePath().moveTo(4.2,22.3).lineTo(12.8,18.9).lineTo(5.3,5.9).lineTo(95,29.4);
	this.shape_107.setTransform(312.575,127.4708);

	this.shape_108 = new cjs.Shape();
	this.shape_108.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(12.1,7.6).lineTo(7.7,0.6).curveTo(-37.5,-37.9,-97.7,-28.2).lineTo(-95.4,-20.7).closePath().moveTo(11.8,24.5).lineTo(20.6,21.4).lineTo(12.1,7.6).lineTo(97.7,30.1);
	this.shape_108.setTransform(311.325,126.824);

	this.shape_109 = new cjs.Shape();
	this.shape_109.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(18.8,9.4).lineTo(14.1,2.2).curveTo(-35.4,-38.3,-100.5,-29.1).lineTo(-98.3,-21.5).closePath().moveTo(19.4,26.8).lineTo(28.6,23.9).lineTo(18.8,9.4).lineTo(100.4,30.8);
	this.shape_109.setTransform(310.05,126.1735);

	this.shape_110 = new cjs.Shape();
	this.shape_110.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(25.7,11.1).lineTo(20.4,3.7).curveTo(-33.4,-38.8,-103.2,-30.1).lineTo(-101.2,-22.2).closePath().moveTo(27,29.1).lineTo(36.4,26.4).lineTo(25.7,11.1).lineTo(103.2,31.5);
	this.shape_110.setTransform(308.775,125.4608);

	this.shape_111 = new cjs.Shape();
	this.shape_111.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(32.4,12.9).lineTo(26.7,5.3).curveTo(-31.3,-39.2,-105.9,-31).lineTo(-104.1,-23).closePath().moveTo(34.6,31.4).lineTo(44.3,28.9).lineTo(32.4,12.9).lineTo(105.9,32.3);
	this.shape_111.setTransform(307.525,124.7799);

	this.shape_112 = new cjs.Shape();
	this.shape_112.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(39.2,14.4).lineTo(33.1,6.5).curveTo(-29.3,-40,-108.7,-32.2).lineTo(-106.9,-24.1).closePath().moveTo(42.2,33.3).lineTo(52.1,31).lineTo(39.2,14.4).lineTo(108.6,32.6);
	this.shape_112.setTransform(306.25,124.4209);

	this.shape_113 = new cjs.Shape();
	this.shape_113.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(45.9,15.4).lineTo(39.4,7.3).curveTo(-27.3,-41.2,-111.4,-33.9).lineTo(-109.8,-25.6).closePath().moveTo(49.8,34.9).lineTo(60,32.8).lineTo(45.9,15.4).lineTo(111.4,32.6);
	this.shape_113.setTransform(305,124.4786);

	this.shape_114 = new cjs.Shape();
	this.shape_114.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(52.7,16.4).lineTo(45.7,8.1).curveTo(-25.2,-42.4,-114.1,-35.6).lineTo(-112.7,-27.1).closePath().moveTo(57.4,36.4).lineTo(67.9,34.5).lineTo(52.7,16.4).lineTo(114.1,32.6);
	this.shape_114.setTransform(303.725,124.5517);

	this.shape_115 = new cjs.Shape();
	this.shape_115.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(59.5,17.4).lineTo(52.1,8.9).curveTo(-23.2,-43.6,-116.9,-37.3).lineTo(-115.6,-28.6).closePath().moveTo(65,37.9).lineTo(75.8,36.3).lineTo(59.5,17.4).lineTo(116.9,32.5);
	this.shape_115.setTransform(302.475,124.6122);

	this.shape_116 = new cjs.Shape();
	this.shape_116.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(72.6,39.5).lineTo(83.7,38).lineTo(66.3,18.5).lineTo(58.4,9.7).curveTo(-21.1,-44.8,-119.6,-39).lineTo(-118.5,-30.1).lineTo(66.3,18.5).lineTo(119.6,32.5);
	this.shape_116.setTransform(301.2,124.6708);

	this.shape_117 = new cjs.Shape();
	this.shape_117.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(72.9,19.5).lineTo(64.8,10.5).curveTo(-19.1,-45.9,-122.3,-40.6).lineTo(-121.4,-31.6).closePath().moveTo(80.2,41.1).lineTo(91.5,39.8).lineTo(72.9,19.5).lineTo(122.3,32.5);
	this.shape_117.setTransform(299.925,124.7226);

	this.shape_118 = new cjs.Shape();
	this.shape_118.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(79.7,20.6).lineTo(71.1,11.3).curveTo(-17.1,-47.1,-125,-42.3).lineTo(-124.3,-33.1).closePath().moveTo(87.8,42.6).lineTo(99.4,41.6).lineTo(79.7,20.6).lineTo(125.1,32.5);
	this.shape_118.setTransform(298.7,124.7642);

	this.shape_119 = new cjs.Shape();
	this.shape_119.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(86.4,21.6).lineTo(77.4,12.2).curveTo(-15.1,-48.3,-127.8,-43.9).lineTo(-127.2,-34.5).closePath().moveTo(95.3,44.2).lineTo(107.2,43.4).lineTo(86.4,21.6).lineTo(127.8,32.5);
	this.shape_119.setTransform(297.425,124.779);

	this.shape_120 = new cjs.Shape();
	this.shape_120.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(93.2,22.7).lineTo(83.7,13).curveTo(-13,-49.4,-130.5,-45.6).lineTo(-130.1,-36).closePath().moveTo(102.9,45.8).lineTo(115.1,45.1).lineTo(93.2,22.7).lineTo(130.5,32.5);
	this.shape_120.setTransform(296.175,124.8131);

	this.shape_121 = new cjs.Shape();
	this.shape_121.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(99.9,23.7).lineTo(90.1,13.9).curveTo(-11,-50.6,-133.2,-47.2).lineTo(-132.9,-37.5).closePath().moveTo(110.6,47.4).lineTo(123,47).lineTo(99.9,23.7).lineTo(133.3,32.5);
	this.shape_121.setTransform(294.9,124.8398);

	this.shape_122 = new cjs.Shape();
	this.shape_122.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(106.6,24.8).lineTo(96.4,14.7).curveTo(-8.9,-51.7,-136,-48.8).lineTo(-135.8,-38.9).closePath().moveTo(118.1,49).lineTo(130.9,48.8).lineTo(106.6,24.8).lineTo(136,32.5);
	this.shape_122.setTransform(293.65,124.8414);

	this.shape_123 = new cjs.Shape();
	this.shape_123.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(138.7,50.5).lineTo(125.7,50.5).moveTo(138.7,32.5).lineTo(138.7,50.5).moveTo(-138.7,-40.4).lineTo(-138.7,-50.5).curveTo(-6.9,-52.9,102.7,15.5).lineTo(138.7,50.5);
	this.shape_123.setTransform(292.375,124.8593);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},135).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_7}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_10}]},1).to({state:[{t:this.shape_11}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_13}]},1).to({state:[{t:this.shape_14}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_16}]},1).to({state:[]},129).to({state:[{t:this.text_1,p:{x:261.55,y:70.9,text:"What",lineWidth:150,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}}]},82).to({state:[{t:this.text_2,p:{x:261.55,text:"What",lineWidth:150,y:65.9,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_1,p:{x:488,y:65.9,text:"happened",lineWidth:259,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}}]},2).to({state:[{t:this.text_3,p:{x:261.55,text:"What",lineWidth:150,y:65.9}},{t:this.text_2,p:{x:488,text:"happened",lineWidth:259,y:65.9,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_1,p:{x:400,y:138.85,text:"next?",lineWidth:186,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}}]},2).to({state:[{t:this.text_4,p:{x:261.55,text:"What",lineWidth:150}},{t:this.text_3,p:{x:488,text:"happened",lineWidth:259,y:65.9}},{t:this.text_2,p:{x:401,text:"next?",lineWidth:186,y:138.85,font:"bold 44px 'Verdana'",color:"#000000",lineHeight:55.5}},{t:this.text_1,p:{x:245.75,y:219.6,text:"He fell in love,\nbut was already \nmarried to somebody else",lineWidth:235,font:"italic bold 26px 'Verdana'",color:"#996600",lineHeight:33.6}}]},2).to({state:[{t:this.text_5},{t:this.text_4,p:{x:488,text:"happened",lineWidth:259}},{t:this.text_3,p:{x:401,text:"next?",lineWidth:186,y:138.85}},{t:this.text_2,p:{x:247.45,text:"He fell in love,\nbut was  \nmarried to somebody else",lineWidth:235,y:219.4,font:"italic bold 26px 'Verdana'",color:"#996600",lineHeight:33.6}},{t:this.text_1,p:{x:558.2,y:219.4,text:"He became a Ukrainian dancer",lineWidth:195,font:"italic bold 26px 'Verdana'",color:"#996600",lineHeight:33.6}}]},2).to({state:[]},9).to({state:[{t:this.shape_17}]},180).to({state:[{t:this.shape_18}]},1).to({state:[{t:this.shape_19}]},1).to({state:[{t:this.shape_20}]},1).to({state:[{t:this.shape_21}]},1).to({state:[{t:this.shape_22}]},1).to({state:[{t:this.shape_23}]},1).to({state:[{t:this.shape_24}]},1).to({state:[{t:this.shape_25}]},1).to({state:[{t:this.shape_26}]},1).to({state:[{t:this.shape_27}]},1).to({state:[{t:this.shape_28}]},1).to({state:[{t:this.shape_29}]},1).to({state:[{t:this.shape_30}]},1).to({state:[{t:this.shape_31}]},1).to({state:[{t:this.shape_32}]},1).to({state:[{t:this.shape_33}]},1).to({state:[{t:this.shape_34}]},1).to({state:[{t:this.shape_35}]},1).to({state:[{t:this.shape_36}]},1).to({state:[{t:this.shape_37}]},1).to({state:[{t:this.shape_38}]},1).to({state:[{t:this.shape_39}]},1).to({state:[{t:this.shape_40}]},1).to({state:[{t:this.shape_41}]},1).to({state:[{t:this.shape_42}]},1).to({state:[{t:this.shape_43}]},1).to({state:[{t:this.shape_44}]},1).to({state:[{t:this.shape_45}]},1).to({state:[{t:this.shape_46}]},1).to({state:[{t:this.shape_47}]},1).to({state:[{t:this.shape_48}]},1).to({state:[{t:this.shape_49}]},1).to({state:[{t:this.shape_50}]},1).to({state:[{t:this.shape_51}]},1).to({state:[{t:this.shape_52}]},1).to({state:[{t:this.shape_53}]},1).to({state:[{t:this.shape_54}]},1).to({state:[{t:this.shape_55}]},1).to({state:[{t:this.shape_56}]},1).to({state:[{t:this.shape_57}]},1).to({state:[{t:this.shape_58}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_60}]},1).to({state:[{t:this.shape_61}]},1).to({state:[{t:this.shape_62}]},1).to({state:[{t:this.shape_63}]},1).to({state:[{t:this.shape_64}]},1).to({state:[{t:this.shape_65}]},1).to({state:[{t:this.shape_66}]},1).to({state:[{t:this.shape_67}]},1).to({state:[{t:this.shape_68}]},1).to({state:[{t:this.shape_69}]},1).to({state:[{t:this.shape_70}]},1).to({state:[{t:this.shape_71}]},1).to({state:[{t:this.shape_72}]},1).to({state:[{t:this.shape_73}]},1).to({state:[{t:this.shape_74}]},1).to({state:[{t:this.shape_75}]},1).to({state:[{t:this.shape_76}]},1).to({state:[{t:this.shape_77}]},1).to({state:[{t:this.shape_78}]},1).to({state:[{t:this.shape_79}]},1).to({state:[{t:this.shape_80}]},1).to({state:[{t:this.shape_81}]},1).to({state:[{t:this.shape_82}]},1).to({state:[{t:this.shape_83}]},1).to({state:[{t:this.shape_84}]},1).to({state:[{t:this.shape_85}]},1).to({state:[{t:this.shape_86}]},1).to({state:[{t:this.shape_87}]},1).to({state:[{t:this.shape_88}]},1).to({state:[{t:this.shape_89}]},1).to({state:[{t:this.shape_90}]},1).to({state:[{t:this.shape_91}]},1).to({state:[{t:this.shape_92}]},1).to({state:[{t:this.shape_93}]},1).to({state:[{t:this.shape_94}]},1).to({state:[{t:this.shape_95}]},1).to({state:[{t:this.shape_96}]},1).to({state:[{t:this.shape_97}]},1).to({state:[{t:this.shape_98}]},1).to({state:[{t:this.shape_99}]},1).to({state:[{t:this.shape_100}]},1).to({state:[{t:this.shape_101}]},1).to({state:[{t:this.shape_102}]},1).to({state:[{t:this.shape_103}]},1).to({state:[{t:this.shape_104}]},1).to({state:[{t:this.shape_105}]},1).to({state:[{t:this.shape_106}]},1).to({state:[{t:this.shape_107}]},1).to({state:[{t:this.shape_108}]},1).to({state:[{t:this.shape_109}]},1).to({state:[{t:this.shape_110}]},1).to({state:[{t:this.shape_111}]},1).to({state:[{t:this.shape_112}]},1).to({state:[{t:this.shape_113}]},1).to({state:[{t:this.shape_114}]},1).to({state:[{t:this.shape_115}]},1).to({state:[{t:this.shape_116}]},1).to({state:[{t:this.shape_117}]},1).to({state:[{t:this.shape_118}]},1).to({state:[{t:this.shape_119}]},1).to({state:[{t:this.shape_120}]},1).to({state:[{t:this.shape_121}]},1).to({state:[{t:this.shape_122}]},1).to({state:[{t:this.shape_123}]},1).to({state:[]},291).to({state:[]},640).wait(711));

	// text2
	this.text_6 = new cjs.Text("Rajeva", "bold 33px 'Times New Roman'");
	this.text_6.lineHeight = 39;
	this.text_6.lineWidth = 129;
	this.text_6.parent = this;
	this.text_6.setTransform(441.15,163.9);

	this.text_7 = new cjs.Text("Rajeva", "bold 33px 'Times New Roman'");
	this.text_7.lineHeight = 39;
	this.text_7.lineWidth = 129;
	this.text_7.parent = this;
	this.text_7.setTransform(441.15,163.9);

	this.text_8 = new cjs.Text("Who?", "9px 'Arial Rounded MT Bold'", "#663300");
	this.text_8.lineHeight = 12;
	this.text_8.parent = this;
	this.text_8.setTransform(396.5,44);
	this.text_8._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_6,p:{x:441.15,y:163.9,text:"Rajeva",font:"bold 33px 'Times New Roman'",lineHeight:38.55,lineWidth:129}}]},454).to({state:[{t:this.text_7},{t:this.text_6,p:{x:95.9,y:84.5,text:"Petrovskoje",font:"bold 29px 'Times New Roman'",lineHeight:34.1,lineWidth:57}}]},96).to({state:[]},406).to({state:[{t:this.text_8}]},255).to({state:[{t:this.text_8}]},2).to({state:[{t:this.text_8}]},2).to({state:[{t:this.text_8}]},2).to({state:[{t:this.text_8}]},2).to({state:[{t:this.text_8}]},2).to({state:[{t:this.text_8}]},2).to({state:[]},10).to({state:[]},363).wait(711));
	this.timeline.addTween(cjs.Tween.get(this.text_8).wait(1211).to({_off:false},0).wait(2).to({font:"20px 'Arial Rounded MT Bold'",lineHeight:25.15,lineWidth:55},0).wait(2).to({font:"30px 'Arial Rounded MT Bold'",lineHeight:36.75,lineWidth:82},0).wait(2).to({font:"40px 'Arial Rounded MT Bold'",lineHeight:48.3,lineWidth:109},0).wait(2).to({font:"50px 'Arial Rounded MT Bold'",lineHeight:59.85,lineWidth:136},0).wait(2).to({font:"60px 'Arial Rounded MT Bold'",lineHeight:71.45,lineWidth:163},0).wait(2).to({font:"70px 'Arial Rounded MT Bold'",lineHeight:83,lineWidth:191},0).to({_off:true},10).wait(1074));

	// text
	this.text_9 = new cjs.Text("Research Academy", "bold 26px 'Verdana'");
	this.text_9.textAlign = "center";
	this.text_9.lineHeight = 34;
	this.text_9.lineWidth = 361;
	this.text_9.parent = this;
	this.text_9.setTransform(282.15,481.85);

	this.text_10 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_10.lineHeight = 37;
	this.text_10.parent = this;
	this.text_10.setTransform(421,22);

	this.text_11 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_11.lineHeight = 37;
	this.text_11.parent = this;
	this.text_11.setTransform(421,22);

	this.text_12 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_12.lineHeight = 37;
	this.text_12.parent = this;
	this.text_12.setTransform(421,22);

	this.text_13 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_13.lineHeight = 37;
	this.text_13.parent = this;
	this.text_13.setTransform(421,22);

	this.text_14 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_14.lineHeight = 37;
	this.text_14.parent = this;
	this.text_14.setTransform(421,22);

	this.text_15 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_15.lineHeight = 37;
	this.text_15.parent = this;
	this.text_15.setTransform(421,22);

	this.text_16 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_16.lineHeight = 37;
	this.text_16.parent = this;
	this.text_16.setTransform(421,22);

	this.text_17 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_17.lineHeight = 37;
	this.text_17.parent = this;
	this.text_17.setTransform(421,22);

	this.text_18 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_18.lineHeight = 37;
	this.text_18.parent = this;
	this.text_18.setTransform(421,22);

	this.text_19 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_19.lineHeight = 37;
	this.text_19.parent = this;
	this.text_19.setTransform(421,22);

	this.text_20 = new cjs.Text("I", "30px 'Arial Rounded MT Bold'", "#663300");
	this.text_20.lineHeight = 37;
	this.text_20.parent = this;
	this.text_20.setTransform(421,22);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_9,p:{x:282.15,y:481.85,text:"Research Academy",font:"bold 26px 'Verdana'",color:"#000000",textAlign:"center",lineHeight:33.6,lineWidth:361}}]},314).to({state:[]},47).to({state:[{t:this.text_9,p:{x:421,y:22,text:"I",font:"30px 'Arial Rounded MT Bold'",color:"#663300",textAlign:"",lineHeight:36.75,lineWidth:10}}]},596).to({state:[{t:this.text_10,p:{x:421,y:22,text:"I",lineWidth:10,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_9,p:{x:452,y:21,text:"was",font:"30px 'Arial Rounded MT Bold'",color:"#663300",textAlign:"",lineHeight:36.75,lineWidth:58}}]},5).to({state:[{t:this.text_11,p:{x:421,y:22,text:"I",lineWidth:10,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_10,p:{x:452,y:21,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_9,p:{x:524,y:21,text:"in",font:"30px 'Arial Rounded MT Bold'",color:"#663300",textAlign:"",lineHeight:36.75,lineWidth:26}}]},4).to({state:[{t:this.text_12,p:{x:421,y:22,text:"I",lineWidth:10,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_11,p:{x:452,y:21,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_10,p:{x:524,y:21,text:"in",lineWidth:26,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_9,p:{x:430,y:66,text:"LOVE!",font:"42px 'Arial'",color:"#CC0000",textAlign:"",lineHeight:48.9,lineWidth:124}}]},4).to({state:[{t:this.text_13,p:{x:421,y:22,text:"I",lineWidth:10,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_12,p:{x:452,y:21,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_11,p:{x:524,y:21,text:"in",lineWidth:26,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_10,p:{x:430,y:66,text:"LOVE!",lineWidth:124,font:"42px 'Arial'",color:"#CC0000",lineHeight:48.9}},{t:this.text_9,p:{x:36,y:22,text:"O",font:"42px 'Arial'",color:"#990099",textAlign:"",lineHeight:48.9,lineWidth:33}}]},19).to({state:[{t:this.text_14,p:{x:421,y:22,text:"I",lineWidth:10,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_13,p:{x:452,y:21,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_12,p:{x:524,y:21,text:"in",lineWidth:26,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_11,p:{x:430,y:66,text:"LOVE!",lineWidth:124,font:"42px 'Arial'",color:"#CC0000",lineHeight:48.9}},{t:this.text_10,p:{x:36,y:22,text:"O",lineWidth:33,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_9,p:{x:79,y:20.45,text:"o",font:"42px 'Arial'",color:"#990099",textAlign:"",lineHeight:48.9,lineWidth:24}}]},6).to({state:[{t:this.text_15,p:{x:421,y:22,text:"I",lineWidth:10,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_14,p:{x:452,y:21,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_13,p:{x:524,y:21,text:"in",lineWidth:26,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_12,p:{x:430,y:66,text:"LOVE!",lineWidth:124,font:"42px 'Arial'",color:"#CC0000",lineHeight:48.9}},{t:this.text_11,p:{x:36,y:22,text:"O",lineWidth:33,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_10,p:{x:79,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_9,p:{x:119,y:20.45,text:"o",font:"42px 'Arial'",color:"#990099",textAlign:"",lineHeight:48.9,lineWidth:24}}]},4).to({state:[{t:this.text_16,p:{x:421,y:22,text:"I",lineWidth:10,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_15,p:{x:452,y:21,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_14,p:{x:524,y:21,text:"in",lineWidth:26,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_13,p:{x:430,y:66,text:"LOVE!",lineWidth:124,font:"42px 'Arial'",color:"#CC0000",lineHeight:48.9}},{t:this.text_12,p:{x:36,y:22,text:"O",lineWidth:33,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_11,p:{x:79,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_10,p:{x:119,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_9,p:{x:160,y:20.45,text:"o",font:"42px 'Arial'",color:"#990099",textAlign:"",lineHeight:48.9,lineWidth:24}}]},5).to({state:[{t:this.text_17,p:{x:421,y:22,text:"I",lineWidth:10,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_16,p:{x:452,y:21,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_15,p:{x:524,y:21,text:"in",lineWidth:26,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_14,p:{x:430,y:66,text:"LOVE!",lineWidth:124,font:"42px 'Arial'",color:"#CC0000",lineHeight:48.9}},{t:this.text_13,p:{x:36,y:22,text:"O",lineWidth:33,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_12,p:{x:79,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_11,p:{x:119,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_10,p:{x:160,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_9,p:{x:203,y:20.45,text:"h",font:"42px 'Arial'",color:"#990099",textAlign:"",lineHeight:48.9,lineWidth:24}}]},3).to({state:[{t:this.text_18,p:{x:421,y:22,text:"I",lineWidth:10}},{t:this.text_17,p:{x:452,y:21,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_16,p:{x:524,y:21,text:"in",lineWidth:26,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_15,p:{x:430,y:66,text:"LOVE!",lineWidth:124,font:"42px 'Arial'",color:"#CC0000",lineHeight:48.9}},{t:this.text_14,p:{x:36,y:22,text:"O",lineWidth:33,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_13,p:{x:79,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_12,p:{x:119,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_11,p:{x:160,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_10,p:{x:203,y:20.45,text:"h",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_9,p:{x:245.95,y:21.45,text:"!",font:"42px 'Arial'",color:"#990099",textAlign:"",lineHeight:48.9,lineWidth:12}}]},3).to({state:[{t:this.text_19,p:{x:421,y:22,text:"I",lineWidth:10}},{t:this.text_18,p:{x:452,y:21,text:"was",lineWidth:58}},{t:this.text_17,p:{x:524,y:21,text:"in",lineWidth:26,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_16,p:{x:430,y:66,text:"LOVE!",lineWidth:124,font:"42px 'Arial'",color:"#CC0000",lineHeight:48.9}},{t:this.text_15,p:{x:36,y:22,text:"O",lineWidth:33,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_14,p:{x:79,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_13,p:{x:119,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_12,p:{x:160,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_11,p:{x:203,y:20.45,text:"h",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_10,p:{x:245.95,y:21.45,text:"!",lineWidth:12,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_9,p:{x:30,y:74.45,text:"Come",font:"42px 'Arial'",color:"#990099",textAlign:"",lineHeight:48.9,lineWidth:152}}]},4).to({state:[{t:this.text_20},{t:this.text_19,p:{x:452,y:21,text:"was",lineWidth:58}},{t:this.text_18,p:{x:524,y:21,text:"in",lineWidth:26}},{t:this.text_17,p:{x:430,y:66,text:"LOVE!",lineWidth:124,font:"42px 'Arial'",color:"#CC0000",lineHeight:48.9}},{t:this.text_16,p:{x:36,y:22,text:"O",lineWidth:33,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_15,p:{x:79,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_14,p:{x:119,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_13,p:{x:160,y:20.45,text:"o",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_12,p:{x:203,y:20.45,text:"h",lineWidth:24,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_11,p:{x:245.95,y:21.45,text:"!",lineWidth:12,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_10,p:{x:30,y:74.45,text:"Come",lineWidth:152,font:"42px 'Arial'",color:"#990099",lineHeight:48.9}},{t:this.text_9,p:{x:172,y:73.45,text:"on!",font:"42px 'Arial'",color:"#990099",textAlign:"",lineHeight:48.9,lineWidth:59}}]},7).to({state:[{t:this.text_13,p:{x:421,y:22,text:"I",lineWidth:10,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_12,p:{x:452,y:21,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_11,p:{x:524,y:21,text:"in",lineWidth:26,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_10,p:{x:430,y:66,text:"LOVE!",lineWidth:124,font:"42px 'Arial'",color:"#CC0000",lineHeight:48.9}},{t:this.text_9,p:{x:86,y:59,text:"Who?",font:"54px 'Arial'",color:"#990099",textAlign:"",lineHeight:62.35,lineWidth:141}}]},172).to({state:[{t:this.text_9,p:{x:86,y:59,text:"Who?",font:"54px 'Arial'",color:"#990099",textAlign:"",lineHeight:62.35,lineWidth:141}}]},18).to({state:[{t:this.text_10,p:{x:86,y:59,text:"Who?",lineWidth:141,font:"54px 'Arial'",color:"#990099",lineHeight:62.35}},{t:this.text_9,p:{x:391,y:23.75,text:"It",font:"30px 'Arial Rounded MT Bold'",color:"#663300",textAlign:"",lineHeight:36.75,lineWidth:20}}]},24).to({state:[{t:this.text_11,p:{x:86,y:59,text:"Who?",lineWidth:141,font:"54px 'Arial'",color:"#990099",lineHeight:62.35}},{t:this.text_10,p:{x:427.95,y:23.75,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_9,p:{x:390.8,y:23.75,text:"It",font:"30px 'Arial Rounded MT Bold'",color:"#663300",textAlign:"",lineHeight:36.75,lineWidth:20}}]},12).to({state:[{t:this.text_12,p:{x:86,y:59,text:"Who?",lineWidth:141,font:"54px 'Arial'",color:"#990099",lineHeight:62.35}},{t:this.text_11,p:{x:427.95,y:23.75,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_10,p:{x:419.95,y:65,text:"YOU",lineWidth:44,font:"20px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:25.15}},{t:this.text_9,p:{x:391,y:23.75,text:"It",font:"30px 'Arial Rounded MT Bold'",color:"#663300",textAlign:"",lineHeight:36.75,lineWidth:20}}]},9).to({state:[{t:this.text_12,p:{x:86,y:59,text:"Who?",lineWidth:141,font:"54px 'Arial'",color:"#990099",lineHeight:62.35}},{t:this.text_11,p:{x:427.95,y:23.75,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_10,p:{x:419.95,y:65,text:"YOU",lineWidth:65,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_9,p:{x:391,y:23.75,text:"It",font:"30px 'Arial Rounded MT Bold'",color:"#663300",textAlign:"",lineHeight:36.75,lineWidth:20}}]},2).to({state:[{t:this.text_12,p:{x:86,y:59,text:"Who?",lineWidth:141,font:"54px 'Arial'",color:"#990099",lineHeight:62.35}},{t:this.text_11,p:{x:427.95,y:23.75,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_10,p:{x:419.95,y:65,text:"YOU",lineWidth:87,font:"40px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:48.3}},{t:this.text_9,p:{x:391,y:23.75,text:"It",font:"30px 'Arial Rounded MT Bold'",color:"#663300",textAlign:"",lineHeight:36.75,lineWidth:20}}]},2).to({state:[{t:this.text_12,p:{x:86,y:59,text:"Who?",lineWidth:141,font:"54px 'Arial'",color:"#990099",lineHeight:62.35}},{t:this.text_11,p:{x:427.95,y:23.75,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_10,p:{x:419.95,y:65,text:"YOU",lineWidth:130,font:"60px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:71.45}},{t:this.text_9,p:{x:391,y:23.75,text:"It",font:"30px 'Arial Rounded MT Bold'",color:"#663300",textAlign:"",lineHeight:36.75,lineWidth:20}}]},2).to({state:[{t:this.text_12,p:{x:86,y:59,text:"Who?",lineWidth:141,font:"54px 'Arial'",color:"#990099",lineHeight:62.35}},{t:this.text_11,p:{x:427.95,y:23.75,text:"was",lineWidth:58,font:"30px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:36.75}},{t:this.text_10,p:{x:419.95,y:65,text:"YOU!",lineWidth:150,font:"60px 'Arial Rounded MT Bold'",color:"#663300",lineHeight:71.45}},{t:this.text_9,p:{x:391,y:23.75,text:"It",font:"30px 'Arial Rounded MT Bold'",color:"#663300",textAlign:"",lineHeight:36.75,lineWidth:20}}]},2).to({state:[]},43).to({state:[{t:this.text_9,p:{x:72.8,y:433.35,text:"VOS",font:"bold 39px 'Times New Roman'",color:"#0066CC",textAlign:"",lineHeight:45.2,lineWidth:82}}]},122).to({state:[{t:this.text_10,p:{x:72.8,y:433,text:"VOS",lineWidth:82,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_9,p:{x:152.8,y:433,text:"KRE",font:"bold 39px 'Times New Roman'",color:"#0066CC",textAlign:"",lineHeight:45.2,lineWidth:85}}]},3).to({state:[{t:this.text_11,p:{x:72.8,y:433.35,text:"VOS",lineWidth:82,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_10,p:{x:152.8,y:433.35,text:"KRE",lineWidth:85,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_9,p:{x:238.8,y:433.35,text:"SEN",font:"bold 39px 'Times New Roman'",color:"#0066CC",textAlign:"",lineHeight:45.2,lineWidth:76}}]},2).to({state:[{t:this.text_12,p:{x:72.8,y:433.35,text:"VOS",lineWidth:82,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_11,p:{x:152.8,y:433.35,text:"KRE",lineWidth:85,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_10,p:{x:238.8,y:433.35,text:"SEN",lineWidth:76,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_9,p:{x:314.75,y:433.35,text:"SKA",font:"bold 39px 'Times New Roman'",color:"#0066CC",textAlign:"",lineHeight:45.2,lineWidth:80}}]},3).to({state:[{t:this.text_13,p:{x:72.8,y:433.35,text:"VOS",lineWidth:82,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_12,p:{x:152.8,y:433.35,text:"KRE",lineWidth:85,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_11,p:{x:238.8,y:433.35,text:"SEN",lineWidth:76,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_10,p:{x:314.75,y:433.35,text:"SKA",lineWidth:80,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_9,p:{x:395.75,y:433.35,text:"JA",font:"bold 39px 'Times New Roman'",color:"#0066CC",textAlign:"",lineHeight:45.2,lineWidth:48}}]},3).to({state:[{t:this.text_14,p:{x:72.8,y:433.35,text:"VOS",lineWidth:82,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_13,p:{x:152.8,y:433.35,text:"KRE",lineWidth:85,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_12,p:{x:238.8,y:433.35,text:"SEN",lineWidth:76,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_11,p:{x:314.75,y:433.35,text:"SKA",lineWidth:80,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_10,p:{x:395.75,y:433.35,text:"JA",lineWidth:48,font:"bold 39px 'Times New Roman'",color:"#0066CC",lineHeight:45.2}},{t:this.text_9,p:{x:463.75,y:433.35,text:"Castle",font:"bold 39px 'Times New Roman'",color:"#0066CC",textAlign:"",lineHeight:45.2,lineWidth:116}}]},4).to({state:[]},114).to({state:[]},21).wait(728));

	// katrina
	this.instance_64 = new lib.katrinaMC();
	this.instance_64.setTransform(-119.5,312.4);
	this.instance_64._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_64).wait(989).to({_off:false},0).to({x:184.5},98).to({_off:true},220).wait(1000));

	// building
	this.instance_65 = new lib.CachedBmp_87();
	this.instance_65.setTransform(179.45,411.7,0.5,0.5);

	this.instance_66 = new lib.CachedBmp_88();
	this.instance_66.setTransform(179.45,335.05,0.5,0.5);

	this.instance_67 = new lib.CachedBmp_89();
	this.instance_67.setTransform(179.45,335.05,0.5,0.5);

	this.instance_68 = new lib.CachedBmp_90();
	this.instance_68.setTransform(179.45,335.05,0.5,0.5);

	this.instance_69 = new lib.CachedBmp_91();
	this.instance_69.setTransform(179.45,335.05,0.5,0.5);

	this.instance_70 = new lib.CachedBmp_92();
	this.instance_70.setTransform(179.45,335.05,0.5,0.5);

	this.instance_71 = new lib.CachedBmp_93();
	this.instance_71.setTransform(179.45,181.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_65}]},318).to({state:[{t:this.instance_66}]},11).to({state:[{t:this.instance_67}]},2).to({state:[{t:this.instance_68}]},2).to({state:[{t:this.instance_69}]},1).to({state:[{t:this.instance_70}]},2).to({state:[{t:this.instance_71}]},2).to({state:[]},23).to({state:[]},1235).wait(711));

	// wrong
	this.text_21 = new cjs.Text("WRONG ANSWER!", "italic bold 25px 'Verdana'", "#FF0000");
	this.text_21.lineHeight = 32;
	this.text_21.parent = this;
	this.text_21.setTransform(432.45,476.5);

	this.instance_72 = new lib.CachedBmp_94();
	this.instance_72.setTransform(475.6,337.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_72},{t:this.text_21}]},375).to({state:[]},4).to({state:[]},1217).wait(711));

	// button_wrong
	this.button2_wrong = new lib.button_nar1();
	this.button2_wrong.name = "button2_wrong";
	this.button2_wrong.setTransform(549.1,416);
	this.button2_wrong._off = true;
	new cjs.ButtonHelper(this.button2_wrong, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button2_wrong).wait(373).to({_off:false},0).to({_off:true},6).wait(1928));

	// button
	this.button2 = new lib.button_nar1();
	this.button2.name = "button2";
	this.button2.setTransform(249.7,416.45);
	this.button2._off = true;
	new cjs.ButtonHelper(this.button2, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button2).wait(372).to({_off:false},0).to({_off:true},7).wait(1928));

	// flowers
	this.instance_73 = new lib.CachedBmp_95();
	this.instance_73.setTransform(1.95,270.75,0.5,0.5);

	this.instance_74 = new lib.CachedBmp_96();
	this.instance_74.setTransform(1.95,156.75,0.5,0.5);

	this.instance_75 = new lib.CachedBmp_97();
	this.instance_75.setTransform(1.95,134,0.5,0.5);

	this.instance_76 = new lib.CachedBmp_98();
	this.instance_76.setTransform(1.95,134,0.5,0.5);

	this.instance_77 = new lib.CachedBmp_99();
	this.instance_77.setTransform(1.95,134,0.5,0.5);

	this.instance_78 = new lib.CachedBmp_100();
	this.instance_78.setTransform(1.95,134,0.5,0.5);

	this.instance_79 = new lib.CachedBmp_101();
	this.instance_79.setTransform(1.95,134,0.5,0.5);

	this.instance_80 = new lib.CachedBmp_102();
	this.instance_80.setTransform(1.95,134,0.5,0.5);

	this.instance_81 = new lib.CachedBmp_103();
	this.instance_81.setTransform(1.95,134,0.5,0.5);

	this.instance_82 = new lib.CachedBmp_104();
	this.instance_82.setTransform(1.95,99.5,0.5,0.5);

	this.instance_83 = new lib.CachedBmp_105();
	this.instance_83.setTransform(1.95,44.1,0.5,0.5);

	this.instance_84 = new lib.CachedBmp_106();
	this.instance_84.setTransform(1.95,28.8,0.5,0.5);

	this.instance_85 = new lib.CachedBmp_107();
	this.instance_85.setTransform(1.95,5.7,0.5,0.5);

	this.instance_86 = new lib.CachedBmp_108();
	this.instance_86.setTransform(1.95,-4.55,0.5,0.5);

	this.instance_87 = new lib.CachedBmp_109();
	this.instance_87.setTransform(1.95,-19.95,0.5,0.5);

	this.instance_88 = new lib.CachedBmp_110();
	this.instance_88.setTransform(1.95,-19.95,0.5,0.5);

	this.instance_89 = new lib.CachedBmp_111();
	this.instance_89.setTransform(1.95,-19.95,0.5,0.5);

	this.instance_90 = new lib.CachedBmp_112();
	this.instance_90.setTransform(-43.95,-19.95,0.5,0.5);

	this.instance_91 = new lib.CachedBmp_113();
	this.instance_91.setTransform(-43.95,-19.95,0.5,0.5);

	this.instance_92 = new lib.CachedBmp_114();
	this.instance_92.setTransform(-43.95,-36.35,0.5,0.5);

	this.instance_93 = new lib.CachedBmp_115();
	this.instance_93.setTransform(-43.95,-36.35,0.5,0.5);

	this.instance_94 = new lib.CachedBmp_116();
	this.instance_94.setTransform(-43.95,-36.35,0.5,0.5);

	this.instance_95 = new lib.CachedBmp_117();
	this.instance_95.setTransform(-43.95,-36.35,0.5,0.5);

	this.instance_96 = new lib.CachedBmp_118();
	this.instance_96.setTransform(-43.95,-36.35,0.5,0.5);

	this.instance_97 = new lib.CachedBmp_119();
	this.instance_97.setTransform(-43.95,-36.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_73}]},384).to({state:[{t:this.instance_74}]},5).to({state:[{t:this.instance_75}]},2).to({state:[{t:this.instance_76}]},2).to({state:[{t:this.instance_77}]},2).to({state:[{t:this.instance_78}]},2).to({state:[{t:this.instance_79}]},2).to({state:[{t:this.instance_80}]},2).to({state:[{t:this.instance_81}]},2).to({state:[{t:this.instance_82}]},2).to({state:[{t:this.instance_83}]},2).to({state:[{t:this.instance_84}]},2).to({state:[{t:this.instance_85}]},2).to({state:[{t:this.instance_86}]},2).to({state:[{t:this.instance_87}]},2).to({state:[{t:this.instance_88}]},2).to({state:[{t:this.instance_89}]},2).to({state:[{t:this.instance_90}]},2).to({state:[{t:this.instance_91}]},2).to({state:[{t:this.instance_92}]},2).to({state:[{t:this.instance_93}]},2).to({state:[{t:this.instance_94}]},2).to({state:[{t:this.instance_95}]},2).to({state:[{t:this.instance_96}]},2).to({state:[{t:this.instance_97}]},2).to({state:[]},521).to({state:[]},640).wait(711));

	// bandura2
	this.instance_98 = new lib.banduraMC();
	this.instance_98.setTransform(46.3,469.8);
	this.instance_98.alpha = 0;
	this.instance_98._off = true;

	this.instance_99 = new lib.bandura_pic2MC();
	this.instance_99.setTransform(385.8,396.1);
	this.instance_99.alpha = 0;
	this.instance_99._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_98).wait(1938).to({_off:false},0).to({x:273.5,y:264.05,alpha:1},21).to({alpha:0},20).to({_off:true},21).wait(56).to({_off:false,x:713.3,y:528.15},0).to({scaleX:1.0695,skewY:180,x:341.25,y:274.35,alpha:1},22).to({scaleX:0.9656,skewY:0,x:-84,y:44.6,alpha:0},21).wait(23).to({scaleX:0.2511,scaleY:0.2511,x:380.65,y:246.9},0).to({scaleX:1.6915,scaleY:0.8073,skewX:180,skewY:-57.0489,alpha:1},27).to({scaleY:4.1534,skewX:330.1599,alpha:0},30).to({_off:true},10).wait(118));
	this.timeline.addTween(cjs.Tween.get(this.instance_99).wait(2189).to({_off:false},0).to({scaleX:1.6311,scaleY:1.6311,alpha:1},20).to({scaleX:3.3574,scaleY:3.3574,alpha:0},20).to({_off:true},5).wait(73));

	// bandura
	this.instance_100 = new lib.banduraMC();
	this.instance_100.setTransform(476.7,353.2);
	this.instance_100.alpha = 0;
	this.instance_100._off = true;

	this.instance_101 = new lib.bandura_pic1MC();
	this.instance_101.setTransform(320.65,183.45);
	this.instance_101.alpha = 0;
	this.instance_101._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_100).wait(1929).to({_off:false},0).to({x:305.25,y:264.05,alpha:1},20).to({x:565.9,y:205.8,alpha:0},20).wait(18).to({x:396.15,y:123.5,alpha:1},22).to({x:87,y:100,alpha:0},20).wait(2).to({x:-27.9,y:425.8},0).to({scaleX:1.0103,skewY:180,x:311.6,y:249.2,alpha:1},24).to({scaleX:1.0394,skewY:0,x:736.85,y:31.45,alpha:0},20).wait(16).to({scaleY:1.023,skewX:180,x:357.9,y:276.65,alpha:1},24).to({scaleY:1.1713,skewX:0,x:-90.4,y:429.25},25).to({_off:true},21).wait(146));
	this.timeline.addTween(cjs.Tween.get(this.instance_101).wait(2167).to({_off:false},0).to({scaleX:2.5874,scaleY:2.5874,x:349.8,y:282.9,alpha:1},18).to({scaleX:3.6653,scaleY:3.6653,alpha:0},20).to({_off:true},2).wait(100));

	// dancer2
	this.instance_102 = new lib.dancer2MC();
	this.instance_102.setTransform(848,322.65,0.4391,0.4391,0,0,0,-0.6,-3);
	this.instance_102._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_102).wait(2210).to({_off:false},0).to({scaleX:0.4272,skewY:180,x:403.9},19).wait(14).to({scaleX:0.4166,skewY:0,x:237.3},16).wait(17).to({scaleX:0.4169,skewY:180,x:-182.6},14).to({_off:true},12).wait(5));

	// dancer1
	this.instance_103 = new lib.dancer1MC();
	this.instance_103.setTransform(-101.15,413.3,1,1,0,0,0,-9,8.8);
	this.instance_103._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_103).wait(1569).to({_off:false},0).to({x:109.75,y:324.1},21).to({x:172.3,y:418.9},9).to({x:241.75,y:404.7},10).to({x:324.95,y:415},10).to({x:346.35,y:291.55},10).to({x:408.1,y:349},10).to({x:505.8,y:301.85},10).to({x:545.25,y:412.45},10).to({x:584.7,y:303.55},10).to({x:593.3,y:409.85},10).to({x:898.05,y:313},10).wait(20).to({scaleX:0.9651,skewY:180,x:877.05,y:427},0).to({x:524.7,y:289.85},20).wait(10).to({x:468.1,y:361.85},0).wait(10).to({x:406.4,y:272.7},0).wait(10).to({x:332.65,y:353.3},0).wait(10).to({x:269.25,y:238.45},0).wait(10).to({x:161.2,y:301.85},0).wait(10).to({x:109.75,y:214.4},0).wait(10).to({x:66.9,y:272.7},0).wait(10).to({x:-32.55,y:180.1},0).wait(10).to({x:-140.6,y:252.1},0).to({_off:true},10).wait(10).to({_off:false,scaleX:1,skewY:0,x:-78.9,y:192.1},0).wait(10).to({x:65.15,y:92.65},0).wait(10).to({x:138.9,y:173.25},0).wait(10).to({x:238.35,y:80.65},0).wait(10).to({x:303.5,y:174.95},0).wait(10).to({x:397.8,y:71.8},0).wait(10).to({x:478.35,y:167.8},0).wait(10).to({x:562.4,y:64.95},0).wait(10).to({x:641.25,y:173},0).wait(10).to({x:766.4,y:71.8},0).to({_off:true},10).wait(368));

	// map_pochep
	this.instance_104 = new lib.map_pochepMC();
	this.instance_104.setTransform(279.25,201.9,0.1823,0.1822,0,0,0,0,-1.1);
	this.instance_104._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_104).wait(1308).to({_off:false},0).to({regX:0.4,regY:-15,scaleX:1.0978,scaleY:1.0972,x:400.45,y:226.45},48).to({regX:0.3,regY:-15.8,scaleX:1.7064,scaleY:1.7054,x:275.55,y:168.85,alpha:0},90).to({_off:true},11).wait(850));

	// castle
	this.instance_105 = new lib.castleMC();
	this.instance_105.setTransform(275,196.8,2.9227,2.9225,0,0,0,0,-0.8);
	this.instance_105.alpha = 0;
	this.instance_105._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_105).wait(1446).to({_off:false},0).to({regX:-0.1,regY:-1.1,scaleX:1.6781,scaleY:1.6779,x:329.85,y:237.3,alpha:1},24).to({_off:true},88).wait(749));

	// background
	this.instance_106 = new lib.paperbg2_600x800();

	this.timeline.addTween(cjs.Tween.get(this.instance_106).wait(956).to({_off:true},1350).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-256,-57.8,1367.8,948.6999999999999);
// library properties:
lib.properties = {
	id: 'FC946C28CFC54F4592144583A0F57FF1',
	width: 800,
	height: 600,
	fps: 24,
	color: "#FFFF99",
	opacity: 1.00,
	manifest: [
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_1.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_1"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_2.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_2"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_3.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_3"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_4.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_4"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_5.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_5"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_6.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_6"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_7.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_7"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_8.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_8"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_9.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_9"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_10.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_10"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_11.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_11"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2_atlas_12"},
		{src:"sounds/nar2_pt1.mp3", id:"nar2_pt1"},
		{src:"sounds/nar2_pt2_finalMamma.mp3", id:"nar2_pt2_finalMamma"},
		{src:"sounds/nar2_wrongbranch.mp3", id:"nar2_wrongbranch"},
		{src:"sounds/nutcracker_64kb_short_quiet.mp3", id:"nutcracker_64kb_short_quiet"}
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
an.compositions['FC946C28CFC54F4592144583A0F57FF1'] = {
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