(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_1", frames: [[0,0,906,938],[0,940,906,938],[908,0,906,938],[908,940,834,986]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_2", frames: [[0,988,725,795],[1343,602,529,532],[1343,1136,529,532],[727,988,614,900],[0,0,834,986],[836,0,800,600]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3", frames: [[786,1312,72,66],[924,790,349,206],[518,1065,273,147],[924,998,298,210],[1275,790,70,94],[1969,847,70,94],[1575,973,212,315],[1863,0,182,334],[1275,886,70,90],[1427,1221,70,90],[0,0,501,474],[1789,973,217,299],[508,1214,132,138],[1499,1221,70,90],[1789,1274,70,90],[1863,611,145,234],[0,1303,70,86],[72,1303,70,86],[793,1065,114,245],[434,476,67,112],[1427,1085,145,134],[1070,1210,145,134],[1224,998,95,74],[642,1214,95,74],[228,803,201,194],[1224,1085,201,194],[221,1157,159,136],[909,1210,159,136],[1575,657,271,314],[434,695,271,314],[0,1123,219,178],[1861,1274,70,90],[1933,1274,70,90],[144,1303,70,83],[1217,1281,70,90],[1289,1281,70,90],[642,1290,70,90],[714,1290,70,90],[1571,1290,70,90],[937,368,92,106],[382,1157,124,155],[1863,336,167,273],[1848,847,119,119],[1371,657,202,426],[503,0,550,366],[1429,330,432,325],[503,368,432,325],[1429,0,432,328],[0,476,432,325],[937,476,432,312],[228,1011,288,144],[1055,0,372,474],[1371,476,41,47],[707,695,215,368],[0,803,226,318],[1643,1290,70,90],[1715,1290,70,90],[221,1295,70,90],[293,1295,70,90]]}
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



(lib.CachedBmp_83 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_82 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_81 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_80 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_79 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_78 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_77 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_76 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.AleksejRazumovskij_invert = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.AleksejRazumovskij_small1748 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.Aleksejs = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.Aleksejs_wife = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.BirutaAkerbergs_invert = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.BirutaAkerbergs_small1947 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.bright_heart_clear = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.cape_smaller = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.hair_smaller = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.Hansen_invert = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.Hansen_small1983 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.head_smaller = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.KirilRazumovskij_invert = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.KirilRazumovskij_small1728 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.leftArm_smaller = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.leftFoot_long_smaller = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.lev_head = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.lev_head_1 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.lev_leftFoot = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.lev_leftFoot_1 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.lev_rightArm = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.lev_rightArm_1 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.lev_rightHand = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.lev_rightHand_1 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.lev_skirt = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.lev_skirt_1 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.lev_upperBody = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.lev_upperBody_1 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.map = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.MichailZemcuznikov_invert = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.MichailZemcuznikov_small1788 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.mirror2_perspective = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.NataljaRozum1678 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.NataljaRozum1678_1 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.NataljaRozum_invert = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.NataljaRozum_small1678 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.NikolajAzbelev_invert = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.NikolajAzbelev_small1857 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.OlgaSott_invert = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.OlgaSott_small1921 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.paperbg2_600x800 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.peas_leftArm = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.peas_rightArm = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.peas_skirt = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.peas_upperBody = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.peasant_natalja = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.peterhofpalace = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.petersburg1 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.petersburg2 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.petersburg3 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.petersburg4 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.petersburg5 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.rightArm_long_smaller = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(50);
}).prototype = p = new cjs.Sprite();



(lib.skirt_smaller = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(51);
}).prototype = p = new cjs.Sprite();



(lib.tree_branch = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(52);
}).prototype = p = new cjs.Sprite();



(lib.tree_clear_small = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(53);
}).prototype = p = new cjs.Sprite();



(lib.upperBody_smaller = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(54);
}).prototype = p = new cjs.Sprite();



(lib.VeraAzbeleva_invert = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(55);
}).prototype = p = new cjs.Sprite();



(lib.VeraAzbeleva_small1883 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(56);
}).prototype = p = new cjs.Sprite();



(lib.ViktorArcimovic_invert = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(57);
}).prototype = p = new cjs.Sprite();



(lib.ViktorArcimovic_small1820 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"]);
	this.gotoAndStop(58);
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


(lib.Tween225 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("Petersburg", "26px 'Arial'");
	this.text.textAlign = "center";
	this.text.lineHeight = 31;
	this.text.lineWidth = 140;
	this.text.parent = this;
	this.text.setTransform(15.15,-13);

	this.text_1 = new cjs.Text("St.", "26px 'Arial'");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 31;
	this.text_1.parent = this;
	this.text_1.setTransform(-70.3,-13);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text_1},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-88.2,-15,175.4,33.1);


(lib.Tween224 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("Petersburg", "26px 'Arial'");
	this.text.textAlign = "center";
	this.text.lineHeight = 31;
	this.text.lineWidth = 140;
	this.text.parent = this;
	this.text.setTransform(15.2,-13);

	this.instance = new lib.CachedBmp_83();
	this.instance.setTransform(-88.2,-15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-88.2,-15,175.4,33.1);


(lib.Tween223 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-136,3).lineTo(-119,27).moveTo(136,3).lineTo(-136,3).lineTo(-115,-27);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-141.9,-32.9,283.8,65.8);


(lib.Tween222 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-136,3).lineTo(-119,27).moveTo(136,3).lineTo(-136,3).lineTo(-115,-27);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-141.9,-32.9,283.8,65.8);


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
	this.instance = new lib.CachedBmp_82();
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
	this.instance = new lib.CachedBmp_81();
	this.instance.setTransform(-226.4,-234.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-226.4,-234.5,453,469);


(lib.Tween19 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("St. Petersburg", "bold 20px 'Verdana'");
	this.text.lineHeight = 26;
	this.text.parent = this;
	this.text.setTransform(-80.9,-12);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-82.9,-14,165.9,28.3);


(lib.Tween18 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("St. Petersburg", "bold 20px 'Verdana'");
	this.text.lineHeight = 26;
	this.text.parent = this;
	this.text.setTransform(-80.9,-12);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-82.9,-14,165.9,28.3);


(lib.Tween6 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("Natalja Rozum -- 1678", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(-114.5,-11);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-116.5,-13,233,25.9);


(lib.Tween5 = function(mode,startPosition,loop,reversed) {
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
	this.text = new cjs.Text("Natalja Rozum -- 1678", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(-114.5,-11);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-116.5,-13,233,25.9);


(lib.Tween4 = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-35,-41.5,1.0001,1.0001);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-41.5,70,90);


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


(lib.upperBody_smallerMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.upperBody_smaller();
	this.instance.setTransform(-113,-159);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.upperBody_smallerMC, new cjs.Rectangle(-113,-159,226,318), null);


(lib.skirt_smallerMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.skirt_smaller();
	this.instance.setTransform(-186,-237);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.skirt_smallerMC, new cjs.Rectangle(-186,-237,372,474), null);


(lib.rightArm_smallerMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.rightArm_long_smaller();
	this.instance.setTransform(-115.5,-48);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.rightArm_smallerMC, new cjs.Rectangle(-115.5,-48,288,144), null);


(lib.peterhofMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peterhofpalace();
	this.instance.setTransform(-275,-183);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.peterhofMC, new cjs.Rectangle(-275,-183,550,366), null);


(lib.peasant_nataljaMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peasant_natalja();
	this.instance.setTransform(-101,-213);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.peasant_nataljaMC, new cjs.Rectangle(-101,-213,202,426), null);


(lib.peas_upperBodyMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_upperBody();
	this.instance.setTransform(-59.5,-59.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.peas_upperBodyMC, new cjs.Rectangle(-59.5,-59.5,119,119), null);


(lib.peas_skirtMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_skirt();
	this.instance.setTransform(-83.5,-136.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.peas_skirtMC, new cjs.Rectangle(-83.5,-136.5,167,273), null);


(lib.peas_rightArmMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_rightArm();
	this.instance.setTransform(-62,-77.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.peas_rightArmMC, new cjs.Rectangle(-62,-77.5,124,155), null);


(lib.peas_leftArmMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_leftArm();
	this.instance.setTransform(-46,-53);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.peas_leftArmMC, new cjs.Rectangle(-46,-53,92,106), null);


(lib.mirror_perspective = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.mirror2_perspective();
	this.instance.setTransform(-307,-450);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mirror_perspective, new cjs.Rectangle(-307,-450,614,900), null);


(lib.map1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.map();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.map1, new cjs.Rectangle(0,0,219,178), null);


(lib.lev_upperBodyMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.lev_upperBody_1();
	this.instance.setTransform(-135.5,-157);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_upperBodyMC, new cjs.Rectangle(-135.5,-157,271,314), null);


(lib.lev_skirtMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.lev_skirt_1();
	this.instance.setTransform(-264.5,-266);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_skirtMC, new cjs.Rectangle(-264.5,-266,529,532), null);


(lib.lev_rightHandMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.lev_rightHand_1();
	this.instance.setTransform(-79.5,-68);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_rightHandMC, new cjs.Rectangle(-79.5,-68,159,136), null);


(lib.lev_rightArmMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.lev_rightArm_1();
	this.instance.setTransform(-100.5,-97);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_rightArmMC, new cjs.Rectangle(-100.5,-97,201,194), null);


(lib.lev_leftFootMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.lev_leftFoot_1();
	this.instance.setTransform(-53.5,-35);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_leftFootMC, new cjs.Rectangle(-53.5,-35,95,74), null);


(lib.lev_headMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.lev_head_1();
	this.instance.setTransform(-72.5,-67);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_headMC, new cjs.Rectangle(-72.5,-67,145,134), null);


(lib.leftFoot_smallerMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.leftFoot_long_smaller();
	this.instance.setTransform(-33.5,-56);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.leftFoot_smallerMC, new cjs.Rectangle(-33.5,-56,67,112), null);


(lib.leftArm_smallerMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.leftArm_smaller();
	this.instance.setTransform(-57,-122.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.leftArm_smallerMC, new cjs.Rectangle(-57,-122.5,114,245), null);


(lib.petersburg5MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.petersburg5();
	this.instance.setTransform(-216,-155);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.petersburg5MC, new cjs.Rectangle(-216,-155,432,312), null);


(lib.petersburg4MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.petersburg4();
	this.instance.setTransform(-216,-160.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.petersburg4MC, new cjs.Rectangle(-216,-160.5,432,325), null);


(lib.petersburg3MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.petersburg3();
	this.instance.setTransform(-216,-165);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.petersburg3MC, new cjs.Rectangle(-216,-165,432,328), null);


(lib.petersburg2MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.petersburg2();
	this.instance.setTransform(-216,-162.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.petersburg2MC, new cjs.Rectangle(-216,-162.5,432,325), null);


(lib.petersburg1MC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.petersburg1();
	this.instance.setTransform(-215,-162.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.petersburg1MC, new cjs.Rectangle(-215,-162.5,432,325), null);


(lib.heartMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.bright_heart_clear();
	this.instance.setTransform(-250.5,-237);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.heartMC, new cjs.Rectangle(-250.5,-237,501,474), null);


(lib.headSimpleMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.head_smaller();
	this.instance.setTransform(-72.5,-117);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.headSimpleMC, new cjs.Rectangle(-72.5,-117,145,234), null);


(lib.hair_smallerMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.hair_smaller();
	this.instance.setTransform(-66,-69);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hair_smallerMC, new cjs.Rectangle(-66,-69,132,138), null);


(lib.cape_smallerMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.cape_smaller();
	this.instance.setTransform(-108.5,-149.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.cape_smallerMC, new cjs.Rectangle(-108.5,-149.5,217,299), null);


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


(lib.natalja = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.NataljaRozum1678();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.natalja, new cjs.Rectangle(0,0,834,986), null);


(lib.elizavetaMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_3 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.moveTo(-42.1,142.8).curveTo(-79.8,107.2,-112.2,66.4).curveTo(-144.6,25.6,-169.4,-22.8).curveTo(-188.1,-59,-189.2,-112.8).curveTo(-177.3,-174.2,-110.5,-179.6).curveTo(-103.6,-180.1,-95.2,-178.3).curveTo(-58.1,-170.2,-33.5,-148.9).curveTo(-15.6,-133.3,-0.1,-115.2).lineTo(-0.1,-110.8).lineTo(0.8,-111.3).lineTo(0.7,-114.4).lineTo(0.7,-115.2).curveTo(32.7,-156.5,86.2,-175.5).curveTo(109.7,-183.9,132.7,-177.4).curveTo(192.6,-160.4,189,-92.4).curveTo(187.7,-67,179.8,-47.4).curveTo(159,5.1,127.9,47.3).curveTo(97,89.4,60.9,126.5).curveTo(33.2,154.9,1.5,179.4).curveTo(0.7,178.4,0.4,175.1).lineTo(-0.7,175).lineTo(-0.9,180.2).curveTo(-21.9,161.8,-42.1,142.8).closePath();
	mask.setTransform(5.6993,19.0024);

	// Layer_1
	this.instance = new lib.Aleksejs_wife();
	this.instance.setTransform(-142.05,-167.95,1.5506,1.5506);

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.elizavetaMC, new cjs.Rectangle(-142,-161.2,282.2,360.4), null);


(lib.lev_upperBodyMC_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance_1 = new lib.lev_upperBody();
	this.instance_1.setTransform(-135.5,-157);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_upperBodyMC_1, new cjs.Rectangle(-135.5,-157,271,314), null);


(lib.lev_skirtMC_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance_1 = new lib.lev_skirt();
	this.instance_1.setTransform(-264.5,-266);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_skirtMC_1, new cjs.Rectangle(-264.5,-266,529,532), null);


(lib.lev_rightHandMC_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance_1 = new lib.lev_rightHand();
	this.instance_1.setTransform(-79.5,-68);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_rightHandMC_1, new cjs.Rectangle(-79.5,-68,159,136), null);


(lib.lev_rightArmMC_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance_1 = new lib.lev_rightArm();
	this.instance_1.setTransform(-100.5,-97);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_rightArmMC_1, new cjs.Rectangle(-100.5,-97,201,194), null);


(lib.lev_leftFootMC_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance_1 = new lib.lev_leftFoot();
	this.instance_1.setTransform(-53.5,-35);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_leftFootMC_1, new cjs.Rectangle(-53.5,-35,95,74), null);


(lib.lev_headMC_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance_1 = new lib.lev_head();
	this.instance_1.setTransform(-72.5,-67);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lev_headMC_1, new cjs.Rectangle(-72.5,-67,145,134), null);


(lib.Natalja_largeMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.NataljaRozum1678_1();
	this.instance.setTransform(-417,-493);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Natalja_largeMC, new cjs.Rectangle(-417,-493,834,986), null);


(lib.viktor_button = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.ViktorArcimovic_small1820();
	this.instance.setTransform(-34,-39);

	this.text = new cjs.Text("Viktor\nArcimovic\n1820", "italic bold 18px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(-186.85,-67);

	this.instance_1 = new lib.ViktorArcimovic_invert();
	this.instance_1.setTransform(-34,-39);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1},{t:this.text}]},1).to({state:[{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-238.6,-69,274.6,120);


(lib.vera_button = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.VeraAzbeleva_small1883();
	this.instance.setTransform(-35,-45);

	this.instance_1 = new lib.VeraAzbeleva_invert();
	this.instance_1.setTransform(-35,-45);

	this.text = new cjs.Text("Vera\nAzbeleva\n1883", "italic bold 18px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(-87.95,-72);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance,p:{x:-35,y:-45}}]}).to({state:[{t:this.text},{t:this.instance_1}]},1).to({state:[{t:this.instance,p:{x:-41.5,y:-34}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-135.5,-74,170.5,130);


(lib.olga_button = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.OlgaSott_small1921();
	this.instance.setTransform(-35,-45);

	this.text = new cjs.Text("Olga\nSchott\n1921", "italic bold 18px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(-116.95,36);

	this.instance_1 = new lib.OlgaSott_invert();
	this.instance_1.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance,p:{y:-45}}]}).to({state:[{t:this.instance_1},{t:this.text}]},1).to({state:[{t:this.instance,p:{y:-49}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-151.5,-49,186.5,156.7);


(lib.nikolaj_button = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.NikolajAzbelev_small1857();
	this.instance.setTransform(-39.5,-34);

	this.text = new cjs.Text("Nikolaj\nAzbelev\n1857", "italic bold 18px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(-101.95,-96);

	this.instance_1 = new lib.NikolajAzbelev_invert();
	this.instance_1.setTransform(-39.5,-34);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1},{t:this.text}]},1).to({state:[{t:this.instance}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-143.5,-98,174,154);


(lib.natalja_button = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.NataljaRozum_small1678();
	this.instance.setTransform(-35,-45);

	this.text = new cjs.Text("Natalja\nRozum\n1678", "italic bold 18px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(-111.25,-88.95);

	this.instance_1 = new lib.NataljaRozum_invert();
	this.instance_1.setTransform(-35,-41.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance,p:{y:-45}}]}).to({state:[{t:this.instance_1},{t:this.text}]},1).to({state:[{t:this.instance,p:{y:-41.5}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-149.7,-90.9,184.7,139.4);


(lib.michail_button = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.MichailZemcuznikov_small1788();
	this.instance.setTransform(-35,-45);

	this.instance_1 = new lib.CachedBmp_79();
	this.instance_1.setTransform(143.8,-75,0.5,0.5);

	this.instance_2 = new lib.MichailZemcuznikov_invert();
	this.instance_2.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance,p:{y:-45}}]}).to({state:[{t:this.instance_2},{t:this.instance_1}]},1).to({state:[{t:this.instance,p:{y:-51}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-75,315.3,120);


(lib.kiril_button = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.KirilRazumovskij_small1728();
	this.instance.setTransform(-36,-42,1,1.0465);

	this.text = new cjs.Text("Kiril\nRazumovskij\n1721", "italic bold 18px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(125.45,-98);

	this.instance_1 = new lib.KirilRazumovskij_invert();
	this.instance_1.setTransform(-36,-42);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance,p:{scaleY:1.0465}}]}).to({state:[{t:this.instance_1},{t:this.text}]},1).to({state:[{t:this.instance,p:{scaleY:1}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-100,228,148);


(lib.hansen_button = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Hansen_small1983();
	this.instance.setTransform(-35,-45);

	this.text = new cjs.Text("Erik and\nIngrid\nHansen\n1983", "italic bold 18px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(107.05,-124);

	this.instance_1 = new lib.Hansen_invert();
	this.instance_1.setTransform(-35,-45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance,p:{x:-35,y:-45}}]}).to({state:[{t:this.instance_1},{t:this.text}]},1).to({state:[{t:this.instance,p:{x:-40,y:-41}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-40,-126,190.7,175);


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


(lib.biruta_button = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.BirutaAkerbergs_small1947();
	this.instance.setTransform(-35,-45);

	this.instance_1 = new lib.BirutaAkerbergs_invert();
	this.instance_1.setTransform(-35,-45);

	this.text = new cjs.Text("Biruta\nAkerbergs\n1947", "italic bold 18px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(251.05,-70);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance,p:{y:-45}}]}).to({state:[{t:this.text},{t:this.instance_1}]},1).to({state:[{t:this.instance,p:{y:-50}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-72,340,117);


(lib.aleksej_button = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.AleksejRazumovskij_small1748();
	this.instance.setTransform(-35,-47,1,0.9575);

	this.text = new cjs.Text("Aleksej\nRazumovskij\n1748", "italic bold 18px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 24;
	this.text.parent = this;
	this.text.setTransform(119.05,-106);

	this.instance_1 = new lib.AleksejRazumovskij_invert();
	this.instance_1.setTransform(-35,-47);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1},{t:this.text}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35,-108,220.6,155);


(lib.Tween236 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_rightArmMC();
	this.instance.setTransform(-32.3,-104.3,1,1,14.9985,0,0,0,-37);

	this.instance_1 = new lib.peas_leftArmMC();
	this.instance_1.setTransform(65.35,-108.6,1,1,-15.0002,0,0,10.7,-33.4);

	this.instance_2 = new lib.peas_upperBodyMC();
	this.instance_2.setTransform(29.75,-80.3);

	this.instance_3 = new lib.headSimpleMC();
	this.instance_3.setTransform(25.7,-126.45,0.3793,0.3791,-7.9455,0,0,0,87.9);

	this.instance_4 = new lib.peas_skirtMC();
	this.instance_4.setTransform(24.75,83.7,1,0.9048);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-121.8,-207.1,243.6,414.29999999999995);


(lib.Tween235 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_rightArmMC();
	this.instance.setTransform(-40.95,-104.3,1,1,14.9985,0,0,0,-37);

	this.instance_1 = new lib.peas_leftArmMC();
	this.instance_1.setTransform(56.7,-108.65,1,1,-29.9992,0,0,10.7,-33.4);

	this.instance_2 = new lib.peas_upperBodyMC();
	this.instance_2.setTransform(21.1,-80.3);

	this.instance_3 = new lib.headSimpleMC();
	this.instance_3.setTransform(17.05,-126.45,0.3793,0.3791,-7.9455,0,0,0,87.9);

	this.instance_4 = new lib.peas_skirtMC();
	this.instance_4.setTransform(16.1,83.7,1,0.9048);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-130.4,-207.1,260.9,414.29999999999995);


(lib.Tween234 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_rightArmMC();
	this.instance.setTransform(-42.45,-91.85,1,1,14.9983,0,0,0,-37);

	this.instance_1 = new lib.peas_leftArmMC();
	this.instance_1.setTransform(58.2,-110.2,1,1,-29.9992,0,0,10.7,-33.4);

	this.instance_2 = new lib.peas_upperBodyMC();
	this.instance_2.setTransform(15.6,-81.85);

	this.instance_3 = new lib.headSimpleMC();
	this.instance_3.setTransform(11.55,-128,0.3793,0.3791,0,0,0,0,87.9);

	this.instance_4 = new lib.peas_skirtMC();
	this.instance_4.setTransform(10.6,82.15,1,0.9048);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-131.9,-205.6,263.9,411.29999999999995);


(lib.Tween233 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_rightArmMC();
	this.instance.setTransform(-23.5,-89.6,1,1,14.9983,0,0,0,-37);

	this.instance_1 = new lib.peas_leftArmMC();
	this.instance_1.setTransform(66.5,-74.6);

	this.instance_2 = new lib.peas_upperBodyMC();
	this.instance_2.setTransform(34.55,-79.6);

	this.instance_3 = new lib.headSimpleMC();
	this.instance_3.setTransform(30.55,-125.75,0.3793,0.3791,14.9984,0,0,0.1,87.8);

	this.instance_4 = new lib.peas_skirtMC();
	this.instance_4.setTransform(29.55,84.4,1,0.9048);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-113,-207.8,226.1,415.70000000000005);


(lib.Tween232 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_rightArmMC();
	this.instance.setTransform(-37.25,-52.6);

	this.instance_1 = new lib.peas_leftArmMC();
	this.instance_1.setTransform(52.7,-74.6);

	this.instance_2 = new lib.peas_upperBodyMC();
	this.instance_2.setTransform(20.75,-79.6);

	this.instance_3 = new lib.headSimpleMC();
	this.instance_3.setTransform(16.75,-125.75,0.3793,0.3791,14.9984,0,0,0.1,87.8);

	this.instance_4 = new lib.peas_skirtMC();
	this.instance_4.setTransform(15.75,84.4,1,0.9048);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-99.2,-207.8,198.5,415.70000000000005);


(lib.Tween231 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_rightArmMC();
	this.instance.setTransform(-37.25,-56.35);

	this.instance_1 = new lib.peas_leftArmMC();
	this.instance_1.setTransform(52.7,-78.35);

	this.instance_2 = new lib.peas_upperBodyMC();
	this.instance_2.setTransform(20.75,-83.35);

	this.instance_3 = new lib.headSimpleMC();
	this.instance_3.setTransform(16.7,-160.5,0.3793,0.3791,0,0,0,0,-1.9);

	this.instance_4 = new lib.peas_skirtMC();
	this.instance_4.setTransform(15.75,80.65,1,0.9048);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-99.2,-204.1,198.5,408.29999999999995);


(lib.Tween230 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.headSimpleMC();
	this.instance.setTransform(14.7,-150.1,0.382,0.382,0,0,0,0,-0.7);

	this.instance_1 = new lib.peas_rightArmMC();
	this.instance_1.setTransform(-37.25,-48.9);

	this.instance_2 = new lib.peas_leftArmMC();
	this.instance_2.setTransform(52.7,-70.9);

	this.instance_3 = new lib.peas_upperBodyMC();
	this.instance_3.setTransform(19.75,-76.9);

	this.instance_4 = new lib.peas_skirtMC();
	this.instance_4.setTransform(15.75,71.1,1,0.9048);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-99.2,-194.5,198.5,389.1);


(lib.Tween229 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.headSimpleMC();
	this.instance.setTransform(16,-126.35,0.4828,0.4827,0,0,0,0,-0.8);

	this.instance_1 = new lib.peas_rightArmMC();
	this.instance_1.setTransform(-36.95,-29.05);

	this.instance_2 = new lib.peas_leftArmMC();
	this.instance_2.setTransform(53,-51.05);

	this.instance_3 = new lib.peas_upperBodyMC();
	this.instance_3.setTransform(20.05,-49.05);

	this.instance_4 = new lib.peas_skirtMC();
	this.instance_4.setTransform(15.05,58.95,1,0.9048);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-98.9,-182.4,197.9,364.9);


(lib.Tween228 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.headSimpleMC();
	this.instance.setTransform(14,-107.65,0.5711,0.571,0,0,0,0,-0.7);

	this.instance_1 = new lib.peas_rightArmMC();
	this.instance_1.setTransform(-36.95,3.55);

	this.instance_2 = new lib.peas_leftArmMC();
	this.instance_2.setTransform(53,-18.45);

	this.instance_3 = new lib.peas_upperBodyMC();
	this.instance_3.setTransform(22.05,-29.45);

	this.instance_4 = new lib.peas_skirtMC();
	this.instance_4.setTransform(13.05,91.55,1,0.6044);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-98.9,-174,197.9,348.1);


(lib.Tween227 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_rightArmMC();
	this.instance.setTransform(-36.95,81.55);

	this.instance_1 = new lib.peas_leftArmMC();
	this.instance_1.setTransform(53,59.55);

	this.instance_2 = new lib.peas_upperBodyMC();
	this.instance_2.setTransform(22.05,53.55);

	this.instance_3 = new lib.headSimpleMC();
	this.instance_3.setTransform(17,-75.65,0.7172,0.7171,0,0,0,0,-0.7);

	this.instance_4 = new lib.peas_skirtMC();
	this.instance_4.setTransform(13.05,110.55,1,0.3113);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-98.9,-159,197.9,318.1);


(lib.Tween226 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.peas_rightArmMC();
	this.instance.setTransform(-36.95,84.55);

	this.instance_1 = new lib.peas_leftArmMC();
	this.instance_1.setTransform(53,62.55);

	this.instance_2 = new lib.peas_upperBodyMC();
	this.instance_2.setTransform(22.05,56.55);

	this.instance_3 = new lib.headSimpleMC();
	this.instance_3.setTransform(20,-78.6,0.7172,0.7171,0,0,0,0,-0.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-98.9,-162,197.9,324.1);


(lib.Tween15 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.petersburg3MC();
	this.instance.setTransform(-173.5,-9.25,1,1,0,0,0,0,-1);

	this.instance_1 = new lib.petersburg1MC();
	this.instance_1.setTransform(173.5,10.75,1,1,0,0,0,1,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-389.5,-173.2,779,346.5);


(lib.head_smallerMC = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.hair_smallerMC();
	this.instance.setTransform(28.5,-27.05,1.9947,1.9947);

	this.instance_1 = new lib.head_smaller();
	this.instance_1.setTransform(-72.5,-117);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.head_smallerMC, new cjs.Rectangle(-103.1,-164.7,263.29999999999995,281.7), null);


(lib.dresser_showQueen = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.lev_rightHandMC_1();
	this.instance.setTransform(172.9,23,0.8994,1,0,0,180);

	this.instance_1 = new lib.lev_rightHandMC_1();
	this.instance_1.setTransform(-135.5,23);

	this.instance_2 = new lib.lev_rightArmMC_1();
	this.instance_2.setTransform(-35,-74);

	this.instance_3 = new lib.lev_upperBodyMC_1();
	this.instance_3.setTransform(0,1);

	this.instance_4 = new lib.lev_headMC_1();
	this.instance_4.setTransform(21,-187);

	this.instance_5 = new lib.lev_skirtMC_1();
	this.instance_5.setTransform(-27,300.95);

	this.instance_6 = new lib.lev_rightArmMC_1();
	this.instance_6.setTransform(86.45,-74,0.8602,1,0,0,180);

	this.instance_7 = new lib.lev_leftFootMC_1();
	this.instance_7.setTransform(70,563,1,1,0,0,0,-6,2);

	this.instance_8 = new lib.lev_leftFootMC_1();
	this.instance_8.setTransform(-47.5,578,1,1,0,0,0,-6,2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:0,skewY:180,x:86.45,y:-74,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:0,x:-35,y:-74,regX:0,regY:0}},{t:this.instance_1,p:{rotation:0,x:-135.5,y:23,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:0,skewY:180,x:172.9,y:23,regX:0,regY:0,scaleY:1,rotation:0}}]}).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-35.7409,skewY:144.2596,x:97.45,y:-87.35,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:0,x:-35,y:-74,regX:0,regY:0}},{t:this.instance_1,p:{rotation:0,x:-135.5,y:23,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-35.7409,skewY:144.2588,x:224.35,y:-59.15,regX:0,regY:0,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:49.1977,x:-46.4,y:-85.3,regX:0,regY:0}},{t:this.instance_1,p:{rotation:49.1977,x:-185.5,y:-97.95,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-56.4612,skewY:123.5385,x:214.3,y:-116.55,regX:0,regY:0,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:49.1977,x:-46.4,y:-85.3,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-10.8017,x:-111,y:-98.05,regX:48.7,regY:-56.5,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-86.4613,skewY:93.5388,x:151.55,y:-95.35,regX:58.2,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:14.9983,y:-144.55,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:4.1985,x:-36.65,y:-61.75,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-55.8017,x:-91.2,y:-25.05,regX:48.8,regY:-56.4,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-86.4613,skewY:93.5388,x:151.55,y:-95.35,regX:58.2,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:14.9983,y:-144.55,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:4.1985,x:-36.65,y:-61.75,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-100.8003,x:-91.3,y:-6.3,regX:48.8,regY:-56.4,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-101.4594,skewY:78.5393,x:151.5,y:-95.3,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},1).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:142.65,y:-53.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-137.1,regX:-0.1,x:70.3,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:2.75,y:110.95}},{t:this.instance_2,p:{rotation:4.1985,x:-25.25,y:-61.75,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-100.8003,x:-79.9,y:-6.3,regX:48.8,regY:-56.4,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-101.4594,skewY:78.5393,x:208.5,y:-50.3,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:14.9983,x:-96.85,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:142.65,y:-41.8,regX:0,regY:0}},{t:this.instance_5,p:{y:315.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-129.6,regX:-0.1,x:74.1,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:2.75,y:118.45}},{t:this.instance_2,p:{rotation:-10.8,x:5.8,y:-72.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-60.95,y:19.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-101.4594,skewY:78.5393,x:208.5,y:-39.05,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:142.65,y:-41.8,regX:0,regY:0}},{t:this.instance_5,p:{y:319.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-129.6,regX:-0.1,x:77.9,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:6.55,y:122.2}},{t:this.instance_2,p:{rotation:-10.8,x:17.2,y:-72.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-49.55,y:19.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:208.5,y:-39.05,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:146.45,y:-30.55,regX:0,regY:0}},{t:this.instance_5,p:{y:334.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-114.6,regX:-0.1,x:85.5,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:17.95,y:137.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:-72.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:19.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:212.3,y:-27.8,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:146.45,y:-15.55,regX:0,regY:0}},{t:this.instance_5,p:{y:349.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-99.6,regX:-0.1,x:85.5,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:14.15,y:152.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:-57.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:34.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:212.3,y:-12.8,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:169.25,y:25.7,regX:0,regY:0}},{t:this.instance_5,p:{y:394.7,scaleX:1.1484,scaleY:0.884}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-39.6,regX:-0.1,x:100.7,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:29.35,y:212.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:21.25,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:113.7,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:235.1,y:28.45,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:169.25,y:40.7,regX:0,regY:0}},{t:this.instance_5,p:{y:409.7,scaleX:1.2595,scaleY:0.8189}},{t:this.instance_4,p:{regY:42.5,rotation:14.9985,y:-24.55,regX:0,x:100.8,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:25.55,y:227.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:36.25,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:128.7,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:235.1,y:43.45,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:176.85,y:70.7,regX:0,regY:0}},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.5,rotation:44.9994,y:9.25,regX:0,x:131.2,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:25.9195,x:33.1,y:253.45}},{t:this.instance_2,p:{rotation:-10.8,x:59,y:73.75,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-7.75,y:166.2,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-56.4608,skewY:123.538,x:242.65,y:73.4,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-30.9864,skewY:149.0143,x:173.9,y:91.25,regX:0,regY:0}},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.5,rotation:74.9976,y:9.15,regX:-0.1,x:131.15,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:25.9195,x:36.9,y:253.45}},{t:this.instance_2,p:{rotation:-10.8,x:59,y:73.75,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-7.75,y:166.2,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-30.9853,skewY:149.0136,x:232.2,y:121.85,regX:58.1,regY:-40.7,scaleY:1,rotation:0}}]},3).to({state:[{t:this.instance_6,p:{skewX:14.0127,skewY:-165.9862,x:151.35,y:150.35,regX:0,regY:0}},{t:this.instance_1,p:{rotation:0,x:170.85,y:213.25,regX:58.2,regY:-40.7,scaleX:0.8994,scaleY:1,skewX:14.0144,skewY:-165.9869}},{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.4,rotation:14.9969,y:54.15,regX:-0.1,x:142.65,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.5,regY:109.8,rotation:40.9188,x:-8.7,y:253.3}},{t:this.instance_2,p:{rotation:19.1989,x:59.05,y:77.5,regX:14.5,regY:-19.4}},{t:this.instance,p:{scaleX:1,skewX:0,skewY:0,x:-49.5,y:143.65,regX:48.9,regY:-56.4,scaleY:0.9999,rotation:-70.8028}}]},3).to({state:[{t:this.instance_6,p:{skewX:14.0127,skewY:-165.9862,x:151.35,y:150.35,regX:0,regY:0}},{t:this.instance_1,p:{rotation:0,x:170.85,y:213.25,regX:58.2,regY:-40.7,scaleX:0.8994,scaleY:1,skewX:14.0144,skewY:-165.9869}},{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.5,rotation:44.9963,y:54.25,regX:-0.1,x:142.55,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.5,regY:109.8,rotation:40.9188,x:-8.7,y:253.3}},{t:this.instance_2,p:{rotation:19.1989,x:59.05,y:77.5,regX:14.5,regY:-19.4}},{t:this.instance,p:{scaleX:0.9999,skewX:0,skewY:0,x:-60.95,y:117.5,regX:48.9,regY:-56.4,scaleY:0.9999,rotation:-40.8033}}]},3).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-30.9864,skewY:149.0143,x:173.9,y:91.25,regX:0,regY:0}},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.5,rotation:74.9976,y:9.15,regX:-0.1,x:131.15,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:25.9195,x:36.9,y:253.45}},{t:this.instance_2,p:{rotation:-10.8,x:59,y:73.75,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-7.75,y:166.2,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-30.9853,skewY:149.0136,x:232.2,y:121.85,regX:58.1,regY:-40.7,scaleY:1,rotation:0}}]},3).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:176.85,y:70.7,regX:0,regY:0}},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.5,rotation:44.9994,y:9.25,regX:0,x:131.2,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:25.9195,x:33.1,y:253.45}},{t:this.instance_2,p:{rotation:-10.8,x:59,y:73.75,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-7.75,y:166.2,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-56.4608,skewY:123.538,x:242.65,y:73.4,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},3).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:169.25,y:40.7,regX:0,regY:0}},{t:this.instance_5,p:{y:409.7,scaleX:1.2595,scaleY:0.8189}},{t:this.instance_4,p:{regY:42.5,rotation:14.9985,y:-24.55,regX:0,x:100.8,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:25.55,y:227.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:36.25,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:128.7,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:235.1,y:43.45,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},3).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:169.25,y:25.7,regX:0,regY:0}},{t:this.instance_5,p:{y:394.7,scaleX:1.1484,scaleY:0.884}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-39.6,regX:-0.1,x:100.7,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:29.35,y:212.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:21.25,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:113.7,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:235.1,y:28.45,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:146.45,y:-15.55,regX:0,regY:0}},{t:this.instance_5,p:{y:349.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-99.6,regX:-0.1,x:85.5,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:14.15,y:152.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:-57.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:34.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:212.3,y:-12.8,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:146.45,y:-30.55,regX:0,regY:0}},{t:this.instance_5,p:{y:334.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-114.6,regX:-0.1,x:85.5,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:17.95,y:137.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:-72.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:19.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:212.3,y:-27.8,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:142.65,y:-41.8,regX:0,regY:0}},{t:this.instance_5,p:{y:319.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-129.6,regX:-0.1,x:77.9,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:6.55,y:122.2}},{t:this.instance_2,p:{rotation:-10.8,x:17.2,y:-72.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-49.55,y:19.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:208.5,y:-39.05,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:14.9983,x:-96.85,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:142.65,y:-41.8,regX:0,regY:0}},{t:this.instance_5,p:{y:315.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-129.6,regX:-0.1,x:74.1,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:2.75,y:118.45}},{t:this.instance_2,p:{rotation:-10.8,x:5.8,y:-72.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-60.95,y:19.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-101.4594,skewY:78.5393,x:208.5,y:-39.05,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:142.65,y:-53.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-137.1,regX:-0.1,x:70.3,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:2.75,y:110.95}},{t:this.instance_2,p:{rotation:4.1985,x:-25.25,y:-61.75,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-100.8003,x:-79.9,y:-6.3,regX:48.8,regY:-56.4,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-101.4594,skewY:78.5393,x:208.5,y:-50.3,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:14.9983,y:-144.55,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:4.1985,x:-36.65,y:-61.75,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-100.8003,x:-91.3,y:-6.3,regX:48.8,regY:-56.4,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-101.4594,skewY:78.5393,x:151.5,y:-95.3,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:14.9983,y:-144.55,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:4.1985,x:-36.65,y:-61.75,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-55.8017,x:-91.2,y:-25.05,regX:48.8,regY:-56.4,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-86.4613,skewY:93.5388,x:151.55,y:-95.35,regX:58.2,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:49.1977,x:-46.4,y:-85.3,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-10.8017,x:-111,y:-98.05,regX:48.7,regY:-56.5,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-86.4613,skewY:93.5388,x:151.55,y:-95.35,regX:58.2,regY:-40.6,scaleY:1,rotation:0}}]},1).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:49.1977,x:-46.4,y:-85.3,regX:0,regY:0}},{t:this.instance_1,p:{rotation:49.1977,x:-185.5,y:-97.95,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-56.4612,skewY:123.5385,x:214.3,y:-116.55,regX:0,regY:0,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-35.7409,skewY:144.2596,x:97.45,y:-87.35,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:0,x:-35,y:-74,regX:0,regY:0}},{t:this.instance_1,p:{rotation:0,x:-135.5,y:23,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-35.7409,skewY:144.2588,x:224.35,y:-59.15,regX:0,regY:0,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:0,skewY:180,x:86.45,y:-74,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:0,x:-35,y:-74,regX:0,regY:0}},{t:this.instance_1,p:{rotation:0,x:-135.5,y:23,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:0,skewY:180,x:172.9,y:23,regX:0,regY:0,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-35.7409,skewY:144.2596,x:97.45,y:-87.35,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:0,x:-35,y:-74,regX:0,regY:0}},{t:this.instance_1,p:{rotation:0,x:-135.5,y:23,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-35.7409,skewY:144.2588,x:224.35,y:-59.15,regX:0,regY:0,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:49.1977,x:-46.4,y:-85.3,regX:0,regY:0}},{t:this.instance_1,p:{rotation:49.1977,x:-185.5,y:-97.95,regX:0,regY:0,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-56.4612,skewY:123.5385,x:214.3,y:-116.55,regX:0,regY:0,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:0,rotation:0,y:-187,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:49.1977,x:-46.4,y:-85.3,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-10.8017,x:-111,y:-98.05,regX:48.7,regY:-56.5,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-86.4613,skewY:93.5388,x:151.55,y:-95.35,regX:58.2,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:14.9983,y:-144.55,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:4.1985,x:-36.65,y:-61.75,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-55.8017,x:-91.2,y:-25.05,regX:48.8,regY:-56.4,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-86.4613,skewY:93.5388,x:151.55,y:-95.35,regX:58.2,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:85.65,y:-98.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:14.9983,y:-144.55,regX:0,x:21,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:0,regY:0,rotation:0,x:0,y:1}},{t:this.instance_2,p:{rotation:4.1985,x:-36.65,y:-61.75,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-100.8003,x:-91.3,y:-6.3,regX:48.8,regY:-56.4,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-101.4594,skewY:78.5393,x:151.5,y:-95.3,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},1).to({state:[{t:this.instance_8,p:{rotation:0,x:-47.5,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:142.65,y:-53.05,regX:0,regY:0}},{t:this.instance_5,p:{y:300.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-137.1,regX:-0.1,x:70.3,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:2.75,y:110.95}},{t:this.instance_2,p:{rotation:4.1985,x:-25.25,y:-61.75,regX:0,regY:0}},{t:this.instance_1,p:{rotation:-100.8003,x:-79.9,y:-6.3,regX:48.8,regY:-56.4,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-101.4594,skewY:78.5393,x:208.5,y:-50.3,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:14.9983,x:-96.85,y:578}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:142.65,y:-41.8,regX:0,regY:0}},{t:this.instance_5,p:{y:315.95,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-129.6,regX:-0.1,x:74.1,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:2.75,y:118.45}},{t:this.instance_2,p:{rotation:-10.8,x:5.8,y:-72.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-60.95,y:19.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-101.4594,skewY:78.5393,x:208.5,y:-39.05,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:142.65,y:-41.8,regX:0,regY:0}},{t:this.instance_5,p:{y:319.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-129.6,regX:-0.1,x:77.9,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:6.55,y:122.2}},{t:this.instance_2,p:{rotation:-10.8,x:17.2,y:-72.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-49.55,y:19.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:208.5,y:-39.05,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:146.45,y:-30.55,regX:0,regY:0}},{t:this.instance_5,p:{y:334.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-114.6,regX:-0.1,x:85.5,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:17.95,y:137.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:-72.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:19.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:212.3,y:-27.8,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:146.45,y:-15.55,regX:0,regY:0}},{t:this.instance_5,p:{y:349.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-99.6,regX:-0.1,x:85.5,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:14.15,y:152.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:-57.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:34.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:212.3,y:-12.8,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:169.25,y:25.7,regX:0,regY:0}},{t:this.instance_5,p:{y:394.7,scaleX:1.1484,scaleY:0.884}},{t:this.instance_4,p:{regY:42.5,rotation:29.9984,y:-39.6,regX:-0.1,x:100.7,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:29.35,y:212.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:21.25,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:113.7,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:235.1,y:28.45,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:169.25,y:40.7,regX:0,regY:0}},{t:this.instance_5,p:{y:409.7,scaleX:1.2595,scaleY:0.8189}},{t:this.instance_4,p:{regY:42.5,rotation:14.9985,y:-24.55,regX:0,x:100.8,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:25.55,y:227.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:36.25,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:128.7,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-116.4587,skewY:63.5402,x:235.1,y:43.45,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:176.85,y:70.7,regX:0,regY:0}},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.5,rotation:44.9994,y:9.25,regX:0,x:131.2,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:25.9195,x:33.1,y:253.45}},{t:this.instance_2,p:{rotation:-10.8,x:59,y:73.75,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-7.75,y:166.2,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-56.4608,skewY:123.538,x:242.65,y:73.4,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-30.9864,skewY:149.0143,x:173.9,y:91.25,regX:0,regY:0}},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.5,rotation:74.9976,y:9.15,regX:-0.1,x:131.15,scaleX:1,scaleY:1,skewX:0,skewY:0}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:25.9195,x:36.9,y:253.45}},{t:this.instance_2,p:{rotation:-10.8,x:59,y:73.75,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-7.75,y:166.2,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-30.9853,skewY:149.0136,x:232.2,y:121.85,regX:58.1,regY:-40.7,scaleY:1,rotation:0}}]},3).to({state:[{t:this.instance_6,p:{skewX:-15.986,skewY:164.015,x:170.55,y:135.65,regX:0,regY:0}},{t:this.instance_1,p:{rotation:0,x:218.85,y:180.45,regX:58.3,regY:-40.6,scaleX:0.8994,scaleY:1,skewX:-15.9849,skewY:164.014}},{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.4,rotation:0,y:54.3,regX:-0.1,x:161.65,scaleX:0.9992,scaleY:0.9983,skewX:14.7797,skewY:-165.2191}},{t:this.instance_3,p:{regX:25.5,regY:109.8,rotation:40.9188,x:-12.5,y:253.3}},{t:this.instance_2,p:{rotation:19.1989,x:59.05,y:77.5,regX:14.5,regY:-19.4}},{t:this.instance,p:{scaleX:1,skewX:0,skewY:0,x:-49.5,y:143.65,regX:48.9,regY:-56.4,scaleY:0.9999,rotation:-70.8028}}]},3).to({state:[{t:this.instance_6,p:{skewX:-45.9867,skewY:134.0125,x:175.75,y:129.3,regX:0,regY:0}},{t:this.instance_1,p:{rotation:0,x:240.05,y:143.9,regX:58.2,regY:-40.6,scaleX:0.8993,scaleY:1,skewX:-45.9843,skewY:134.0129}},{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.5,rotation:0,y:58,regX:-0.1,x:157.9,scaleX:0.9983,scaleY:0.9983,skewX:-0.0937,skewY:179.9063}},{t:this.instance_3,p:{regX:25.5,regY:109.8,rotation:40.9188,x:-16.3,y:253.3}},{t:this.instance_2,p:{rotation:19.1989,x:59.05,y:77.5,regX:14.5,regY:-19.4}},{t:this.instance,p:{scaleX:0.9999,skewX:0,skewY:0,x:-60.95,y:117.5,regX:48.9,regY:-56.4,scaleY:0.9999,rotation:-40.8033}}]},3).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-54.7159,skewY:125.2849,x:181.3,y:78.6,regX:0,regY:0}},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.5,rotation:0,y:16.75,regX:-0.1,x:146.4,scaleX:0.9991,scaleY:0.9991,skewX:-0.0123,skewY:179.9869}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:25.9195,x:29.3,y:253.45}},{t:this.instance_2,p:{rotation:-10.8,x:59,y:73.75,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-7.75,y:166.2,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8993,skewX:-54.7149,skewY:125.2837,x:246.9,y:83.3,regX:58.3,regY:-40.7,scaleY:1,rotation:0}}]},3).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:242.65,y:73.45,regX:-39.6,regY:56.4}},{t:this.instance_5,p:{y:428.45,scaleX:1.3262,scaleY:0.7319}},{t:this.instance_4,p:{regY:42.4,rotation:0,y:20.4,regX:0,x:150.3,scaleX:0.9983,scaleY:0.9983,skewX:-0.0937,skewY:179.9063}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:25.9195,x:29.3,y:253.45}},{t:this.instance_2,p:{rotation:-10.8,x:59,y:73.75,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-7.75,y:166.2,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-71.4611,skewY:108.5379,x:242.65,y:73.4,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},3).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:169.25,y:40.7,regX:0,regY:0}},{t:this.instance_5,p:{y:409.7,scaleX:1.2595,scaleY:0.8189}},{t:this.instance_4,p:{regY:42.5,rotation:0,y:-17.1,regX:0,x:108.45,scaleX:0.9992,scaleY:0.9991,skewX:-0.175,skewY:179.8241}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:25.55,y:227.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:36.25,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:128.7,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-86.4594,skewY:93.5387,x:235.05,y:43.45,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},3).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-56.4612,skewY:123.5393,x:169.25,y:25.7,regX:0,regY:0}},{t:this.instance_5,p:{y:394.7,scaleX:1.1484,scaleY:0.884}},{t:this.instance_4,p:{regY:42.5,rotation:0,y:-35.8,regX:-0.1,x:112.25,scaleX:0.9985,scaleY:0.9985,skewX:-0.1401,skewY:179.859}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:29.35,y:212.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:21.25,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:113.7,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-61.0194,skewY:118.9794,x:235.1,y:28.35,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:-71.4617,skewY:108.5391,x:146.45,y:-41.8,regX:0,regY:0}},{t:this.instance_5,p:{y:349.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.4,rotation:0,y:-95.85,regX:-0.1,x:100.9,scaleX:0.9985,scaleY:0.9986,skewX:-15.1392,skewY:164.8595}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:19.73,x:10.35,y:152.2}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:-57.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:34.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-71.4611,skewY:108.5379,x:212.3,y:-50.3,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},2).to({state:[{t:this.instance_8,p:{rotation:44.9988,x:-134.85,y:559.3}},{t:this.instance_7},{t:this.instance_6,p:{skewX:3.5362,skewY:-176.4608,x:73.2,y:-60.55,regX:30.7,regY:-23.3}},{t:this.instance_5,p:{y:334.7,scaleX:1,scaleY:1}},{t:this.instance_4,p:{regY:42.4,rotation:0,y:-122.1,regX:-0.1,x:62.9,scaleX:0.9985,scaleY:0.9985,skewX:-0.1401,skewY:179.859}},{t:this.instance_3,p:{regX:25.6,regY:109.9,rotation:4.7309,x:36.2,y:137.15}},{t:this.instance_2,p:{rotation:-10.8,x:32.4,y:-72.5,regX:14.5,regY:-19.4}},{t:this.instance_1,p:{rotation:-130.7997,x:-34.35,y:19.95,regX:48.8,regY:-56.4,scaleX:0.9999,scaleY:0.9999,skewX:0,skewY:0}},{t:this.instance,p:{scaleX:0.8994,skewX:-2.4698,skewY:177.5311,x:140.05,y:43.45,regX:58.3,regY:-40.6,scaleY:1,rotation:0}}]},16).wait(11));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-377.7,-269,784.9,898.9);


(lib.dresser_framebyframe = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.lev_rightHandMC();
	this.instance.setTransform(172.9,23,0.8994,1,0,0,180);

	this.instance_1 = new lib.lev_rightHandMC();
	this.instance_1.setTransform(-135.5,23);

	this.instance_2 = new lib.lev_rightArmMC();
	this.instance_2.setTransform(-35,-74);

	this.instance_3 = new lib.lev_upperBodyMC();
	this.instance_3.setTransform(0,1);

	this.instance_4 = new lib.lev_headMC();
	this.instance_4.setTransform(21,-187);

	this.instance_5 = new lib.lev_skirtMC();
	this.instance_5.setTransform(-27,300.95);

	this.instance_6 = new lib.lev_rightArmMC();
	this.instance_6.setTransform(86.45,-74,0.8602,1,0,0,180);

	this.instance_7 = new lib.lev_leftFootMC();
	this.instance_7.setTransform(70,563,1,1,0,0,0,-6,2);

	this.instance_8 = new lib.lev_leftFootMC();
	this.instance_8.setTransform(-47.5,578,1,1,0,0,0,-6,2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:0,skewY:180,x:86.45,y:-74,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:0,x:21,y:-187,regX:0,regY:0}},{t:this.instance_3,p:{x:0,rotation:0,y:1,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:0,x:-35,y:-74}},{t:this.instance_1,p:{rotation:0,x:-135.5,y:23,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8994,skewX:0,skewY:180,x:172.9,y:23,scaleY:1,regX:0,regY:0}}]}).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-36.452,skewY:143.548,x:113.75,y:-94.4,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:0,x:21,y:-187,regX:0,regY:0}},{t:this.instance_3,p:{x:0.1,rotation:0,y:1,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:0,x:-35,y:-74}},{t:this.instance_1,p:{rotation:0,x:-135.5,y:23,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-36.452,skewY:143.5477,x:240.85,y:-67.8,scaleY:1,regX:0,regY:0}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-36.452,skewY:143.548,x:113.75,y:-68.15,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:127.95,y:-190.75,regX:0,regY:0}},{t:this.instance_3,p:{x:26.05,rotation:26.2405,y:-31.35,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:27.7,y:-114.1}},{t:this.instance_1,p:{rotation:26.2405,x:-127.8,y:-71.55,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-25.2105,skewY:154.7898,x:261.2,y:-20.35,scaleY:1,regX:0,regY:0}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-51.4516,skewY:128.55,x:113.75,y:-68.15,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:127.95,y:-190.75,regX:0,regY:0}},{t:this.instance_3,p:{x:29.8,rotation:26.2405,y:-31.35,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:27.7,y:-114.1}},{t:this.instance_1,p:{rotation:26.2405,x:-127.8,y:-71.55,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-40.2095,skewY:139.7898,x:261.2,y:-69.1,scaleY:1,regX:0,regY:0}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-51.4516,skewY:128.55,x:177.5,y:-68.15,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:161.7,y:-190.75,regX:0,regY:0}},{t:this.instance_3,p:{x:59.8,rotation:26.2405,y:-31.35,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:38.95,y:-114.1}},{t:this.instance_1,p:{rotation:26.2405,x:-116.55,y:-71.55,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-40.2095,skewY:139.7898,x:328.7,y:-69.1,scaleY:1,regX:0,regY:0}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-51.4516,skewY:128.55,x:177.5,y:-68.15,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:161.7,y:-190.75,regX:0,regY:0}},{t:this.instance_3,p:{x:59.8,rotation:34.4757,y:-31.35,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:38.95,y:-114.1}},{t:this.instance_1,p:{rotation:26.2405,x:-116.55,y:-71.55,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-40.2095,skewY:139.7898,x:328.7,y:-69.1,scaleY:1,regX:0,regY:0}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-81.4495,skewY:98.5528,x:185.55,y:-94.4,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:161.7,y:-190.75,regX:0,regY:0}},{t:this.instance_3,p:{x:59.8,rotation:34.4757,y:-31.35,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:46.45,y:-114.1}},{t:this.instance_1,p:{rotation:26.2405,x:-109.05,y:-71.55,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-70.2074,skewY:109.7914,x:316,y:-170.8,scaleY:1,regX:0,regY:0}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-51.4492,skewY:128.5512,x:189.4,y:-75.3,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:161.7,y:-190.75,regX:0,regY:0}},{t:this.instance_3,p:{x:59.8,rotation:34.4757,y:-31.35,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:46.45,y:-114.1}},{t:this.instance_1,p:{rotation:26.2405,x:-109.05,y:-71.55,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-40.2068,skewY:139.7914,x:340.6,y:-76.2,scaleY:0.9999,regX:0,regY:0}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-38.25,skewY:141.7512,x:188.6,y:-68.75,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:176.7,y:-183.25,regX:0,regY:0}},{t:this.instance_3,p:{x:59.8,rotation:34.4757,y:-31.35,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:46.45,y:-114.1}},{t:this.instance_1,p:{rotation:26.2405,x:-109.05,y:-71.55,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-27.0065,skewY:152.9924,x:336,y:-35.15,scaleY:1,regX:0,regY:0}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-23.2511,skewY:156.7508,x:187.65,y:-61.55,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:202.95,y:-168.25,regX:0,regY:0}},{t:this.instance_3,p:{x:42.35,rotation:39.9415,y:49.55,regX:28.3,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:65.2,y:-110.35}},{t:this.instance_1,p:{rotation:26.2405,x:-94.05,y:-64.05,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-12.0063,skewY:167.9909,x:321.35,y:9.05,scaleY:1,regX:0,regY:0}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:185.4,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:225.45,y:-164.5,regX:0,regY:0}},{t:this.instance_3,p:{x:64.85,rotation:39.9415,y:49.55,regX:28.3,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:83.95,y:-102.85}},{t:this.instance_1,p:{rotation:26.2405,x:-79.05,y:-52.8,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-6.3078,skewY:173.6906,x:311.45,y:22.45,scaleY:0.9999,regX:0,regY:0}}]},1).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:185.4,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:11.2417,x:200.4,y:-131.75,regX:-4.7,regY:38.8}},{t:this.instance_3,p:{x:64.85,rotation:39.9415,y:49.55,regX:28.3,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:83.95,y:-102.85}},{t:this.instance_1,p:{rotation:26.2405,x:-79.05,y:-52.8,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-36.3072,skewY:143.6918,x:261.25,y:-10.35,scaleY:0.9999,regX:51.4,regY:-38.1}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:185.4,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:11.2417,x:200.4,y:-131.75,regX:-4.7,regY:38.8}},{t:this.instance_3,p:{x:64.85,rotation:39.9415,y:49.55,regX:28.3,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:83.95,y:-102.85}},{t:this.instance_1,p:{rotation:26.2405,x:-79.05,y:-52.8,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-81.3075,skewY:98.6923,x:261.25,y:-10.25,scaleY:1,regX:51.4,regY:-38.1}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:185.4,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:170.55,y:-146.75,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:53.5,rotation:33.7201,y:49.6,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:61.45,y:-102.85}},{t:this.instance_1,p:{rotation:26.2405,x:-101.55,y:-52.8,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-81.3075,skewY:98.6923,x:250,y:-10.25,scaleY:1,regX:51.4,regY:-38.1}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:185.4,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2405,x:170.55,y:-146.75,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:53.5,rotation:33.7201,y:49.6,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:61.45,y:-102.85}},{t:this.instance_1,p:{rotation:26.2405,x:-101.55,y:-52.8,regX:0,regY:0,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-51.307,skewY:128.6912,x:250.05,y:-10.2,scaleY:0.9999,regX:51.4,regY:-38.1}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:2,rotation:0,x:70,y:563}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:185.4,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:41.2399,x:170.45,y:-146.7,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:53.5,rotation:33.7201,y:49.6,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:61.45,y:-102.85}},{t:this.instance_1,p:{rotation:-3.7585,x:-26.8,y:-56.55,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-21.3072,skewY:158.6903,x:250.1,y:-10.2,scaleY:0.9999,regX:51.4,regY:-38.1}}]},2).to({state:[{t:this.instance_8,p:{regY:2,rotation:0,x:-47.5,y:578}},{t:this.instance_7,p:{regY:1.9,rotation:-29.9992,x:157.8,y:562.95}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:185.4,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-27,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:41.2399,x:170.45,y:-146.7,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:53.5,rotation:33.7201,y:49.6,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:61.45,y:-102.85}},{t:this.instance_1,p:{rotation:-3.7585,x:-26.8,y:-56.55,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-21.3072,skewY:158.6903,x:250.1,y:-10.2,scaleY:0.9999,regX:51.4,regY:-38.1}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-29.9992,x:157.8,y:562.95}},{t:this.instance_7,p:{regY:2,rotation:0,x:128.75,y:578}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:329.95,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:111.75,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:41.2399,x:294.2,y:-146.7,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:184.75,rotation:33.7201,y:49.6,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:188.95,y:-102.85}},{t:this.instance_1,p:{rotation:-3.7585,x:100.8,y:-59.75,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-21.3072,skewY:158.6903,x:413.85,y:-10.2,scaleY:0.9999,regX:51.4,regY:-38.1}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-29.9992,x:157.8,y:562.95}},{t:this.instance_7,p:{regY:1.9,rotation:-29.9992,x:267.45,y:577.95}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:329.95,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:111.75,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:56.2391,x:294.2,y:-146.75,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:184.75,rotation:33.7201,y:49.6,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:188.95,y:-102.85}},{t:this.instance_1,p:{rotation:-33.757,x:100.8,y:-59.75,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-66.3074,skewY:113.6908,x:413.8,y:-10.15,scaleY:0.9999,regX:51.4,regY:-38.1}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-29.9992,x:157.8,y:562.95}},{t:this.instance_7,p:{regY:1.9,rotation:-29.9992,x:267.45,y:577.95}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:329.95,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:111.75,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:71.2388,x:294.15,y:-146.7,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:184.75,rotation:33.7201,y:49.6,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:188.95,y:-102.85}},{t:this.instance_1,p:{rotation:-48.7565,x:119.65,y:-67.3,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-21.307,skewY:158.6893,x:413.8,y:-10.2,scaleY:0.9999,regX:51.4,regY:-38.1}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-29.9992,x:157.8,y:562.95}},{t:this.instance_7,p:{regY:1.9,rotation:-29.9992,x:267.45,y:577.95}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:329.95,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:111.75,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:41.2386,x:294.2,y:-146.8,regX:-4.5,regY:38.7}},{t:this.instance_3,p:{x:184.75,rotation:33.7201,y:49.6,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:188.95,y:-102.85}},{t:this.instance_1,p:{rotation:-48.7565,x:119.65,y:-67.3,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-51.3055,skewY:128.6902,x:406.35,y:-10.05,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-29.9992,x:157.8,y:562.95}},{t:this.instance_7,p:{regY:1.9,rotation:0,x:83.65,y:577.95}},{t:this.instance_6,p:{skewX:-17.5521,skewY:162.4493,x:281.2,y:-61.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:111.75,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2397,x:215.5,y:-184.25,regX:-4.4,regY:38.8}},{t:this.instance_3,p:{x:184.8,rotation:12.4804,y:49.55,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:151.45,y:-91.6}},{t:this.instance_1,p:{rotation:-48.7565,x:82.15,y:-56.05,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:-51.3055,skewY:128.6902,x:357.6,y:-10.05,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:0,x:83.65,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:191.2,y:-79.8,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:21.75,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2397,x:129.25,y:-184.25,regX:-4.4,regY:38.8}},{t:this.instance_3,p:{x:102.3,rotation:12.4804,y:49.55,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:61.45,y:-91.6}},{t:this.instance_1,p:{rotation:-48.7565,x:-16.15,y:-56.05,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:8.6931,skewY:-171.311,x:248.9,y:-6.35,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:0,x:83.65,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:239.95,y:-1.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:21.75,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:26.2397,x:238,y:-113,regX:-4.4,regY:38.8}},{t:this.instance_3,p:{x:98.5,rotation:42.4793,y:64.45,regX:28.2,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:143.95,y:-91.6}},{t:this.instance_1,p:{rotation:-48.7565,x:66.35,y:-56.05,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8993,skewX:8.6931,skewY:-171.311,x:297.65,y:72.4,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:117.4,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:239.95,y:-1.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:21.75,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:56.2386,x:237.95,y:-113.05,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:98.5,rotation:42.4793,y:64.45,regX:28.2,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:26.2405,x:143.95,y:-91.6}},{t:this.instance_1,p:{rotation:-48.7565,x:66.35,y:-56.05,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:-43.2617,skewY:136.7327,x:297.6,y:72.45,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:117.4,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:239.95,y:-1.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:21.75,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:71.2374,x:237.9,y:-113,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:98.5,rotation:42.4793,y:64.45,regX:28.2,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:-3.7585,x:143.95,y:-69.1}},{t:this.instance_1,p:{rotation:-78.7554,x:141.25,y:-7.35,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:16.7375,skewY:-163.267,x:297.7,y:72.45,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:146.2,y:-38.55,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-12,scaleY:1,y:300.95}},{t:this.instance_4,p:{rotation:41.2386,x:119.3,y:-153.7,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:31,rotation:27.4796,y:64.4,regX:28.2,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:-3.7585,x:12.7,y:-69.1}},{t:this.instance_1,p:{rotation:-78.7554,x:10,y:-7.35,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:16.7375,skewY:-163.267,x:203.95,y:34.95,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:149.95,y:32.7,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-12,scaleY:0.9263,y:387.2}},{t:this.instance_4,p:{rotation:41.2386,x:123.05,y:-41.2,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:27.25,rotation:27.4796,y:169.4,regX:28.2,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:-3.7585,x:31.45,y:24.65}},{t:this.instance_1,p:{rotation:-78.7554,x:10,y:67.65,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:16.7375,skewY:-163.267,x:203.95,y:109.95,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:209.95,y:148.95,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-12,scaleY:0.9263,y:387.2}},{t:this.instance_4,p:{rotation:71.2374,x:224.3,y:15,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:83.5,rotation:42.4793,y:195.7,regX:28.2,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:-3.7585,x:121.45,y:65.9}},{t:this.instance_1,p:{rotation:-78.7554,x:100,y:108.9,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:16.7375,skewY:-163.267,x:263.95,y:226.2,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:232.45,y:238.95,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.7668,y:417.2}},{t:this.instance_4,p:{rotation:86.237,x:224.3,y:123.7,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:49.6,rotation:57.4795,y:273.35,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:-3.7585,x:128.95,y:174.65}},{t:this.instance_1,p:{rotation:-78.7554,x:88.75,y:217.65,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:-43.2617,skewY:136.7334,x:286.5,y:316.25,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:232.45,y:253.95,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.7668,y:417.2}},{t:this.instance_4,p:{rotation:101.2364,x:246.85,y:138.7,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:49.6,rotation:57.4795,y:273.35,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:11.2407,x:128.95,y:174.65}},{t:this.instance_1,p:{rotation:-78.7554,x:88.75,y:217.65,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:9.2244,skewY:-170.78,x:286.55,y:331.15,scaleY:0.9999,regX:51.3,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:209.95,y:148.95,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-12,scaleY:0.9263,y:387.2}},{t:this.instance_4,p:{rotation:71.2374,x:224.3,y:15,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:83.5,rotation:42.4793,y:195.7,regX:28.2,regY:78.7,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:-3.7585,x:121.45,y:65.9}},{t:this.instance_1,p:{rotation:-78.7554,x:100,y:108.9,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:16.7375,skewY:-163.267,x:263.95,y:226.2,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:232.45,y:238.95,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.7668,y:417.2}},{t:this.instance_4,p:{rotation:86.237,x:224.3,y:123.7,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:49.6,rotation:57.4795,y:273.35,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:-3.7585,x:128.95,y:174.65}},{t:this.instance_1,p:{rotation:-78.7554,x:88.75,y:217.65,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:-43.2617,skewY:136.7334,x:286.5,y:316.25,scaleY:0.9999,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:232.45,y:253.95,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.7668,y:417.2}},{t:this.instance_4,p:{rotation:101.2364,x:246.85,y:138.7,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:49.6,rotation:57.4795,y:273.35,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:11.2407,x:128.95,y:174.65}},{t:this.instance_1,p:{rotation:-78.7554,x:88.75,y:217.65,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:9.2244,skewY:-170.78,x:286.55,y:331.15,scaleY:0.9999,regX:51.3,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:296.2,y:313.95,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.7668,y:417.2}},{t:this.instance_4,p:{rotation:56.2382,x:299.25,y:194.9,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:98.35,rotation:72.478,y:292.1,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:11.2407,x:182.3,y:220.9}},{t:this.instance_1,p:{rotation:-48.7565,x:145.05,y:273.85,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:-35.7754,skewY:144.2217,x:346.6,y:379.95,scaleY:0.9998,regX:51.3,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:303.7,y:306.45,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.7668,y:417.2}},{t:this.instance_4,p:{rotation:86.2361,x:299.25,y:194.95,regX:-4.4,regY:38.8}},{t:this.instance_3,p:{x:98.35,rotation:72.478,y:292.1,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:11.2407,x:182.3,y:220.9}},{t:this.instance_1,p:{rotation:-78.7552,x:145,y:273.9,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:39.2245,skewY:-140.7796,x:346.55,y:379.85,scaleY:0.9998,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:251.2,y:126.45,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.8892,y:417.2}},{t:this.instance_4,p:{rotation:71.2374,x:250.5,y:41.2,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:98.35,rotation:41.4751,y:205.85,regX:28.3,regY:78.8,scaleX:0.9999,scaleY:0.9999}},{t:this.instance_2,p:{rotation:26.2401,x:122.3,y:55.9}},{t:this.instance_1,p:{rotation:-78.7552,x:70,y:93.9,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:39.2245,skewY:-140.7796,x:294.05,y:199.85,scaleY:0.9998,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:146.2,y:47.7,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.9326,y:364.7}},{t:this.instance_4,p:{rotation:41.2386,x:119.2,y:-37.55,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:38.4,rotation:26.4759,y:187.1,regX:28.3,regY:78.8,scaleX:0.9999,scaleY:0.9999}},{t:this.instance_2,p:{rotation:11.2415,x:21.05,y:25.9}},{t:this.instance_1,p:{rotation:-78.7552,x:-35,y:75.15,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:39.2245,skewY:-140.7796,x:189.05,y:121.1,scaleY:0.9998,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:146.2,y:-46.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.9544,y:338.45}},{t:this.instance_4,p:{rotation:26.2397,x:78,y:-138.9,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:53.45,rotation:7.8074,y:89.55,regX:28.3,regY:78.8,scaleX:0.9999,scaleY:0.9999}},{t:this.instance_2,p:{rotation:11.2415,x:-1.45,y:-56.6}},{t:this.instance_1,p:{rotation:-78.7552,x:-50,y:-7.35,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:39.2245,skewY:-140.7796,x:189.05,y:27.35,scaleY:0.9998,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-62.5544,skewY:117.4469,x:152.55,y:-64.65,scaleY:0.9999,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.9544,y:338.45}},{t:this.instance_4,p:{rotation:26.2397,x:78,y:-138.9,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:53.45,rotation:7.8074,y:89.55,regX:28.3,regY:78.8,scaleX:0.9999,scaleY:0.9999}},{t:this.instance_2,p:{rotation:-48.8414,x:34.15,y:-41.35}},{t:this.instance_1,p:{rotation:-138.8384,x:52.65,y:25.2,regX:53.6,regY:-26.4,scaleX:0.9999,scaleY:0.9999}},{t:this.instance,p:{scaleX:0.8991,skewX:-20.7766,skewY:159.2186,x:237.55,y:-65.1,scaleY:0.9998,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-86.5014,skewY:93.4986,x:150,y:-76.6,scaleY:0.9999,scaleX:0.8601}},{t:this.instance_5,p:{x:-8.25,scaleY:0.9544,y:338.45}},{t:this.instance_4,p:{rotation:11.2403,x:74.35,y:-138.85,regX:-4.4,regY:38.8}},{t:this.instance_3,p:{x:75.95,rotation:3.0589,y:89.55,regX:28.3,regY:78.8,scaleX:1,scaleY:1}},{t:this.instance_2,p:{rotation:-93.8419,x:40.9,y:-53.55}},{t:this.instance_1,p:{rotation:176.1623,x:101.1,y:-19.5,regX:53.6,regY:-26.4,scaleX:0.9999,scaleY:0.9999}},{t:this.instance,p:{scaleX:0.8992,skewX:-44.7255,skewY:135.2709,x:227.5,y:-111.6,scaleY:0.9998,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-62.5544,skewY:117.4469,x:152.55,y:-64.65,scaleY:0.9999,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.9544,y:338.45}},{t:this.instance_4,p:{rotation:26.2397,x:78,y:-138.9,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:53.45,rotation:7.8074,y:89.55,regX:28.3,regY:78.8,scaleX:0.9999,scaleY:0.9999}},{t:this.instance_2,p:{rotation:-48.8414,x:34.15,y:-41.35}},{t:this.instance_1,p:{rotation:-138.8384,x:52.65,y:25.2,regX:53.6,regY:-26.4,scaleX:0.9999,scaleY:0.9999}},{t:this.instance,p:{scaleX:0.8991,skewX:-20.7766,skewY:159.2186,x:237.55,y:-65.1,scaleY:0.9998,regX:51.4,regY:-38}}]},2).to({state:[{t:this.instance_8,p:{regY:1.9,rotation:-15.0002,x:30.3,y:563}},{t:this.instance_7,p:{regY:1.9,rotation:-14.9985,x:-17.6,y:577.95}},{t:this.instance_6,p:{skewX:-2.5529,skewY:177.448,x:146.2,y:-46.05,scaleY:1,scaleX:0.8602}},{t:this.instance_5,p:{x:-8.25,scaleY:0.9544,y:338.45}},{t:this.instance_4,p:{rotation:26.2397,x:70.5,y:-138.9,regX:-4.5,regY:38.8}},{t:this.instance_3,p:{x:53.45,rotation:7.8074,y:89.55,regX:28.3,regY:78.8,scaleX:0.9999,scaleY:0.9999}},{t:this.instance_2,p:{rotation:11.2415,x:-1.45,y:-56.6}},{t:this.instance_1,p:{rotation:-78.7552,x:-57.5,y:-3.6,regX:53.6,regY:-26.4,scaleX:1,scaleY:1}},{t:this.instance,p:{scaleX:0.8992,skewX:39.2245,skewY:-140.7796,x:189.05,y:27.35,scaleY:0.9998,regX:51.4,regY:-38}}]},2).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-291.5,-309.2,854.2,963);


(lib.dresser = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Armature_38
	this.ikNode_38 = new lib.lev_rightHandMC();
	this.ikNode_38.name = "ikNode_38";
	this.ikNode_38.setTransform(-172.7,91.85,0.9975,0.9975,-2.0101,0,0,8.4,-11.1);

	this.ikNode_36 = new lib.lev_rightArmMC();
	this.ikNode_36.name = "ikNode_36";
	this.ikNode_36.setTransform(-96.4,-1.75,0.997,0.997,-3.0707,0,0,-9.7,-5);

	this.ikNode_39 = new lib.lev_skirtMC();
	this.ikNode_39.name = "ikNode_39";
	this.ikNode_39.setTransform(-7.55,245.35,0.9971,0.9971,-11.3299,0,0,66.2,-110);

	this.ikNode_35 = new lib.lev_headMC();
	this.ikNode_35.name = "ikNode_35";
	this.ikNode_35.setTransform(-6.6,-106.2,0.9974,0.9974,-0.4882,0,0,0.5,21.9);

	this.ikNode_34 = new lib.lev_upperBodyMC();
	this.ikNode_34.name = "ikNode_34";
	this.ikNode_34.setTransform(9.15,-27.05,0.998,0.998,-0.4862,0,0,38.5,-79.8);

	this.ikNode_37 = new lib.lev_rightArmMC();
	this.ikNode_37.name = "ikNode_37";
	this.ikNode_37.setTransform(101.2,-38.35,1.0563,0.9977,0,-34.2296,145.7638,-24.4,3.1);

	this.ikNode_42 = new lib.lev_rightHandMC();
	this.ikNode_42.name = "ikNode_42";
	this.ikNode_42.setTransform(202.8,-5.25,0.8986,0.9993,0,0.6142,-179.3754,15.1,-28.2);

	this.ikNode_40 = new lib.lev_leftFootMC();
	this.ikNode_40.name = "ikNode_40";
	this.ikNode_40.setTransform(108.3,614.9,0.9971,0.9971,-46.7251,0,0,-7.2,1.1);

	this.ikNode_41 = new lib.lev_leftFootMC();
	this.ikNode_41.name = "ikNode_41";
	this.ikNode_41.setTransform(-62.4,643.1,0.7413,0.9976,2.3432,0,0,-15,11.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.ikNode_41,p:{scaleX:0.7413,scaleY:0.9976,rotation:2.3432,x:-62.4,y:643.1,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.9971,scaleY:0.9971,rotation:-46.7251,x:108.3,y:614.9,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:0.6142,skewY:-179.3754,x:202.8,y:-5.25,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:-34.2296,skewY:145.7638,x:101.2,y:-38.35,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-0.4862,x:9.15,y:-27.05,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-0.4882,x:-6.6,y:-106.2,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-11.3299,x:-7.55,y:245.35,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.997,scaleY:0.997,rotation:-3.0707,x:-96.4,y:-1.75,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11.1,rotation:-2.0101,x:-172.7,y:91.85,scaleX:0.9975,scaleY:0.9975}}]}).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:1.8838,x:-48.9,y:644.55,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-44.9299,x:112.05,y:614.85,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:4.9775,skewY:-175.015,x:201.2,y:3.5,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-31.2012,skewY:148.7932,x:101.4,y:-34.95,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-1.2012,x:9.05,y:-26.95,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-1.2028,x:-7.8,y:-106.05,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-12.0587,x:-4.25,y:245.5,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-2.9251,x:-96.95,y:-3.6,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-2.319,x:-173.5,y:90.05,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:1.4235,x:-35.45,y:645.55,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-43.1327,x:116,y:614.75,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:9.3389,skewY:-170.653,x:199,y:12.05,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:-28.1705,skewY:151.8245,x:101.35,y:-31.5,regX:-24.3,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-1.9181,x:8.9,y:-27.05,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-1.9201,x:-8.95,y:-105.85,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-12.7904,x:-1.2,y:245.7,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-2.782,x:-97.45,y:-5.45,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-2.6295,x:-174.2,y:87.95,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:0.9632,x:-21.9,y:646.4,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-41.3342,x:119.95,y:614.55,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:13.6999,skewY:-166.2906,x:196.5,y:20.75,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-25.1391,skewY:154.8558,x:101.45,y:-28,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-2.6361,x:8.7,y:-27.05,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-2.6377,x:-10.15,y:-105.65,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-13.5216,x:2.25,y:245.65,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-2.638,x:-97.95,y:-7.2,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-2.9402,x:-174.85,y:85.95,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:0.5031,x:-8.45,y:647,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-39.5384,x:123.9,y:614.4,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:18.0626,skewY:-161.9294,x:193.8,y:29.35,regY:-28.3,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-22.1082,skewY:157.8866,x:101.2,y:-24.25,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-3.3538,x:8.5,y:-27.05,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-3.3541,x:-11.35,y:-105.55,scaleX:0.9973,scaleY:0.9973,regY:21.8,regX:0.5}},{t:this.ikNode_39,p:{rotation:-14.2532,x:5.45,y:245.75,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-2.4949,x:-98.35,y:-9.2,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-3.2501,x:-175.55,y:83.9,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:0.0429,x:5.1,y:647.3,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-37.7421,x:127.8,y:614.15,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:22.4237,skewY:-157.5662,x:190.35,y:38.05,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-19.0759,skewY:160.918,x:100.9,y:-20.55,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-4.0719,x:8.2,y:-27.15,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-4.0718,x:-12.45,y:-105.2,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-14.9854,x:8.75,y:245.8,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-2.3518,x:-98.75,y:-11,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-3.56,x:-176.3,y:81.75,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-0.4146,x:18.7,y:647.25,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-35.9444,x:131.8,y:613.85,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:26.7857,skewY:-153.2048,x:186.55,y:46.5,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-16.0454,skewY:163.949,x:100.35,y:-16.7,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-4.789,x:8.2,y:-27.15,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-4.7892,x:-13.65,y:-105.05,scaleX:0.9974,scaleY:0.9974,regY:21.8,regX:0.5}},{t:this.ikNode_39,p:{rotation:-15.7163,x:12,y:245.65,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-2.2079,x:-99.1,y:-13.05,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-3.8719,x:-176.85,y:79.65,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-0.8747,x:32.25,y:646.75,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-34.1475,x:135.7,y:613.55,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:31.1482,skewY:-148.8428,x:182.5,y:54.8,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-13.0139,skewY:166.98,x:99.7,y:-12.8,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.5085,x:7.95,y:-27.2,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.5066,x:-14.85,y:-104.65,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-16.4475,x:15.25,y:245.6,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-2.0639,x:-99.45,y:-14.85,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-4.182,x:-177.4,y:77.5,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-1.3358,x:45.75,y:646.05,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-32.3513,x:139.65,y:613.2,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:35.5098,skewY:-144.4813,x:178.05,y:62.8,regY:-28.3,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:-9.9818,skewY:170.0102,x:98.85,y:-8.95,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.2245,x:7.85,y:-27.2,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.2229,x:-16,y:-104.35,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-17.1793,x:18.55,y:245.45,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-1.9209,x:-99.75,y:-16.95,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-4.4924,x:-178,y:75.35,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-1.7952,x:59.25,y:645.2,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-30.5529,x:143.6,y:612.8,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:39.8732,skewY:-140.1187,x:173.05,y:70.6,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-6.9514,skewY:173.0416,x:97.9,y:-5.25,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.9433,x:7.7,y:-27.3,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.9395,x:-17.05,y:-104.05,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-17.9103,x:21.7,y:245.35,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-1.7761,x:-99.95,y:-18.75,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-4.8037,x:-178.45,y:73.2,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:-2.2547,x:72.75,y:643.95,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-28.7573,x:147.5,y:612.35,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:44.2347,skewY:-135.7568,x:167.85,y:78.25,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-3.9202,skewY:176.0744,x:96.7,y:-1.6,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.6605,x:7.5,y:-27.25,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.658,x:-18.3,y:-103.75,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-18.6421,x:25.05,y:245.1,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-1.634,x:-100.2,y:-20.7,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11.1,rotation:-5.1124,x:-179,y:70.95,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-2.7153,x:86.25,y:642.35,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-26.96,x:151.5,y:611.85,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:48.5961,skewY:-131.3945,x:162.3,y:85.45,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-0.8886,skewY:179.106,x:95.45,y:1.9,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-8.3779,x:7.3,y:-27.45,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.3752,x:-19.4,y:-103.4,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-19.3736,x:28.05,y:244.95,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-1.4893,x:-100.45,y:-22.65,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-5.4232,x:-179.45,y:68.95,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:-3.176,x:99.65,y:640.45,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-25.163,x:155.35,y:611.3,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:52.9598,skewY:-127.032,x:156.4,y:92.2,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:2.1387,skewY:-177.8673,x:94.1,y:5.2,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-9.0959,x:7.15,y:-27.4,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-9.0908,x:-20.55,y:-103.25,scaleX:0.9973,scaleY:0.9973,regY:21.8,regX:0.5}},{t:this.ikNode_39,p:{rotation:-20.1058,x:31.5,y:244.5,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-1.3471,x:-100.55,y:-24.5,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-5.7333,x:-179.9,y:66.8,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-3.6353,x:113,y:638.25,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-23.3658,x:159.3,y:610.65,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:57.3207,skewY:-122.6702,x:150.25,y:98.6,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:5.1703,skewY:-174.8363,x:92.5,y:8.45,regX:-24.3,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-9.8138,x:6.95,y:-27.4,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-9.8096,x:-21.65,y:-102.9,scaleX:0.9973,scaleY:0.9973,regY:21.8,regX:0.5}},{t:this.ikNode_39,p:{rotation:-20.8369,x:34.7,y:244.15,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-1.2015,x:-100.7,y:-26.4,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-6.0434,x:-180.2,y:64.65,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-4.0964,x:126.25,y:635.75,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-21.5682,x:163.3,y:609.95,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:61.6829,skewY:-118.3089,x:143.95,y:104.55,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:8.2015,skewY:-171.8049,x:91.15,y:11.4,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-10.5318,x:6.7,y:-27.45,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-10.5268,x:-22.7,y:-102.45,scaleX:0.9973,scaleY:0.9973,regY:21.8,regX:0.6}},{t:this.ikNode_39,p:{rotation:-21.5684,x:37.95,y:243.85,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-1.0586,x:-100.8,y:-28.25,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-6.3536,x:-180.6,y:62.65,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-6.184,x:130.5,y:634.6,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-21.0674,x:156.75,y:611.95,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:61.8329,skewY:-118.1587,x:143.6,y:104.85,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:8.3512,skewY:-171.656,x:91.1,y:11.65,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-10.3823,x:6.8,y:-27.5,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-10.3771,x:-22.4,y:-102.45,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.6}},{t:this.ikNode_39,p:{rotation:-21.4188,x:37.25,y:243.85,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:0.5069,x:-101,y:-28.75,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-5.9676,x:-183.2,y:60.15,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-8.2715,x:134.6,y:633.45,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-20.5639,x:150.15,y:613.85,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:61.9816,skewY:-118.0103,x:143.25,y:105.15,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:8.5,skewY:-171.5063,x:91.05,y:11.8,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-10.2326,x:6.65,y:-27.5,scaleX:0.998,scaleY:0.998,regX:38.4}},{t:this.ikNode_35,p:{rotation:-10.2282,x:-22.35,y:-102.6,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-21.2699,x:36.55,y:243.85,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:2.0754,x:-101.15,y:-29,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-5.5791,x:-185.8,y:57.5,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-10.3589,x:138.8,y:632.25,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-20.0618,x:143.6,y:615.7,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:62.1303,skewY:-117.8605,x:142.9,y:105.45,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:8.6489,skewY:-171.3573,x:90.9,y:11.95,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-10.0829,x:6.85,y:-27.6,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-10.0794,x:-22.2,y:-102.7,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-21.1206,x:35.9,y:243.9,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:3.6445,x:-101.4,y:-29.2,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-5.1925,x:-188.35,y:54.75,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-12.4467,x:142.95,y:630.9,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-19.5603,x:136.9,y:617.4,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:62.2798,skewY:-117.7108,x:142.6,y:105.8,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:8.7979,skewY:-171.2075,x:90.8,y:12.15,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-9.9346,x:6.85,y:-27.65,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-9.9298,x:-22,y:-103,scaleX:0.9973,scaleY:0.9973,regY:21.8,regX:0.5}},{t:this.ikNode_39,p:{rotation:-20.971,x:35.15,y:244,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:5.2129,x:-101.65,y:-29.7,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-4.8054,x:-190.75,y:52,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-14.5349,x:147.2,y:629.55,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-19.0578,x:130.25,y:619,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:62.4289,skewY:-117.5624,x:142.25,y:106.1,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:8.9477,skewY:-171.0583,x:90.65,y:12.3,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-9.7851,x:6.8,y:-27.75,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-9.7804,x:-21.75,y:-103.05,scaleX:0.9973,scaleY:0.9973,regY:21.8,regX:0.5}},{t:this.ikNode_39,p:{rotation:-20.8216,x:34.45,y:243.95,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:6.7816,x:-101.7,y:-30.05,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-4.4176,x:-193.15,y:49.15,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-16.6223,x:151.3,y:628.15,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-18.5559,x:123.55,y:620.45,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:62.5788,skewY:-117.4123,x:141.9,y:106.35,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:9.0968,skewY:-170.909,x:90.6,y:12.45,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-9.635,x:6.85,y:-27.75,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-9.6309,x:-21.55,y:-103.1,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-20.6726,x:33.8,y:244,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:8.3521,x:-101.9,y:-30.4,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-4.03,x:-195.45,y:46.2,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-18.7104,x:155.5,y:626.5,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-18.0531,x:116.9,y:621.9,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:62.7275,skewY:-117.263,x:141.65,y:106.6,regY:-28.3,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:9.2459,skewY:-170.7599,x:90.55,y:12.65,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-9.4867,x:6.85,y:-27.75,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-9.4815,x:-21.35,y:-103.2,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-20.5231,x:33,y:244,regX:66.1,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:9.9208,x:-102.05,y:-30.75,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-3.6417,x:-197.75,y:43.25,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-20.7967,x:159.65,y:625,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-17.5506,x:110.05,y:623.3,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:62.8766,skewY:-117.1146,x:141.2,y:107,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:9.3942,skewY:-170.6105,x:90.4,y:12.85,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-9.3364,x:6.85,y:-27.8,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-9.3332,x:-21.05,y:-103.3,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.6}},{t:this.ikNode_39,p:{rotation:-20.3752,x:32.3,y:243.95,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:11.4898,x:-102.3,y:-31.25,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-3.2536,x:-199.95,y:40.25,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-22.8848,x:163.7,y:623.25,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-17.0486,x:103.3,y:624.4,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:63.0261,skewY:-116.9649,x:140.85,y:107.3,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:9.5444,skewY:-170.462,x:90.25,y:13,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-9.1875,x:6.85,y:-27.8,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-9.1832,x:-20.9,y:-103.55,scaleX:0.9973,scaleY:0.9973,regY:21.8,regX:0.6}},{t:this.ikNode_39,p:{rotation:-20.2246,x:31.65,y:244.05,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:13.0588,x:-102.4,y:-31.5,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-2.8656,x:-202,y:37.3,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-24.9723,x:167.75,y:621.75,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-16.5454,x:96.45,y:625.5,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:63.1759,skewY:-116.8157,x:140.5,y:107.6,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:9.6935,skewY:-170.3118,x:90.2,y:13.15,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-9.0384,x:6.85,y:-28,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-9.0347,x:-20.7,y:-103.6,scaleX:0.9974,scaleY:0.9974,regY:21.8,regX:0.5}},{t:this.ikNode_39,p:{rotation:-20.0758,x:30.95,y:244,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:14.6278,x:-102.5,y:-31.8,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-2.4795,x:-204,y:34.15,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-27.0601,x:171.85,y:620,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:-16.044,x:89.7,y:626.5,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:63.3242,skewY:-116.6669,x:140.2,y:107.9,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:9.8429,skewY:-170.1639,x:90.1,y:13.35,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-8.8884,x:6.85,y:-28.05,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.8849,x:-20.55,y:-103.65,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-19.9266,x:30.25,y:244,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:16.1961,x:-102.85,y:-32.25,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-2.0918,x:-205.95,y:31,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-29.1477,x:175.9,y:618.15,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-15.5415,x:82.9,y:627.45,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:63.4745,skewY:-116.5172,x:139.8,y:108.15,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:9.9918,skewY:-170.0143,x:90,y:13.5,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.7387,x:6.7,y:-27.95,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-8.736,x:-20.3,y:-103.75,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-19.7774,x:29.55,y:244.05,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:17.7669,x:-102.9,y:-32.6,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-1.705,x:-207.9,y:27.8,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-31.2361,x:179.85,y:616.35,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-15.0397,x:76.1,y:628.25,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:63.6232,skewY:-116.3675,x:139.45,y:108.45,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.1422,skewY:-169.8639,x:89.85,y:13.7,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-8.5896,x:6.85,y:-28.1,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.5861,x:-20.15,y:-103.8,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-19.6276,x:28.7,y:244.1,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:19.3357,x:-103,y:-33,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-1.3184,x:-209.55,y:24.5,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-33.3235,x:183.75,y:614.45,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-14.5371,x:69.4,y:628.95,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:63.7718,skewY:-116.2191,x:139.2,y:108.7,regY:-28.3,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.2918,skewY:-169.7157,x:89.75,y:13.85,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.4418,x:6.8,y:-28,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-8.4372,x:-19.9,y:-103.95,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-19.4787,x:28.2,y:244.1,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:20.9039,x:-103.3,y:-33.4,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-0.93,x:-211.35,y:21.2,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.4113,x:187.7,y:612.45,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-14.0341,x:62.45,y:629.55,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:63.9217,skewY:-116.069,x:138.75,y:109.05,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.4397,skewY:-169.5667,x:89.65,y:14,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.2913,x:6.9,y:-28.1,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.2882,x:-19.7,y:-104.1,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-19.3298,x:27.5,y:244.05,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:22.4737,x:-103.35,y:-33.7,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-0.5426,x:-212.9,y:17.85,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-33.7251,x:169.4,y:617.45,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-13.1653,x:54.95,y:628.4,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:63.9906,skewY:-116.0002,x:137.2,y:107.6,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.509,skewY:-169.497,x:88.25,y:12.5,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.2231,x:5.55,y:-29.7,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.2192,x:-20.95,y:-105.65,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-18.4616,x:25.9,y:242.45,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:19.8117,x:-103.9,y:-35.3,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-3.2036,x:-210.9,y:21.45,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-32.0364,x:150.8,y:622.05,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-12.2978,x:47.55,y:627.15,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.059,skewY:-115.9319,x:135.7,y:106.1,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.5776,skewY:-169.4289,x:86.85,y:10.95,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-8.1548,x:4.2,y:-31.55,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.1493,x:-22.2,y:-107.4,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-17.592,x:24.2,y:240.8,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:17.1502,x:-104.25,y:-36.5,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-5.8654,x:-208.5,y:24.95,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-30.3494,x:131.75,y:625.65,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-11.4295,x:39.8,y:625.85,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:64.1279,skewY:-115.8636,x:134.15,y:104.5,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.6455,skewY:-169.3615,x:85.5,y:9.35,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.0859,x:2.85,y:-33.05,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.082,x:-23.5,y:-109.1,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-16.7239,x:22.45,y:239.15,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:14.488,x:-104.65,y:-37.85,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-8.5265,x:-206.05,y:28.25,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-28.6625,x:112.45,y:628.6,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-10.5603,x:32.3,y:624.5,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.1952,skewY:-115.7953,x:132.65,y:103.05,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.7134,skewY:-169.2923,x:84.05,y:7.85,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.0167,x:1.5,y:-34.7,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.0138,x:-24.75,y:-110.75,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-15.8548,x:20.8,y:237.5,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:11.8256,x:-105.05,y:-39.5,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-11.1887,x:-203.4,y:31.5,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-26.9746,x:93,y:630.7,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-9.6917,x:24.85,y:623,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.2649,skewY:-115.7265,x:131.1,y:101.5,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.7821,skewY:-169.224,x:82.5,y:6.3,regX:-24.3,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.9477,x:0.15,y:-36.3,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.9438,x:-26.05,y:-112.45,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-14.9871,x:19.1,y:235.95,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:9.1639,x:-105.6,y:-40.8,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-13.8513,x:-200.3,y:34.5,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-25.2891,x:73.15,y:632,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-8.8237,x:17.2,y:621.35,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.3338,skewY:-115.6573,x:129.55,y:100.1,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:10.8507,skewY:-169.1551,x:81.15,y:4.75,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.8798,x:-1.2,y:-38.05,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.8766,x:-27.3,y:-114.1,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-14.1177,x:17.45,y:234.3,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:6.5026,x:-105.9,y:-42.25,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-16.5126,x:-197.1,y:37.4,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-23.6013,x:53.2,y:632.55,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-7.955,x:9.7,y:619.6,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.4015,skewY:-115.589,x:128.1,y:98.6,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:10.9195,skewY:-169.087,x:79.75,y:3.25,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.8116,x:-2.55,y:-39.65,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.8075,x:-28.6,y:-115.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-13.2496,x:15.7,y:232.6,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:3.8405,x:-106.4,y:-43.65,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-19.1748,x:-193.8,y:40.1,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-21.914,x:33.25,y:632.2,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-7.0865,x:2.25,y:617.9,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.4707,skewY:-115.5202,x:126.55,y:97.05,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.9882,skewY:-169.0177,x:78.35,y:1.65,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.7427,x:-3.95,y:-41.4,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.7385,x:-29.85,y:-117.5,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-12.3815,x:14.05,y:231.05,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:1.1787,x:-106.85,y:-45.1,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-21.8358,x:-190.2,y:42.65,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-20.2276,x:13.1,y:631.05,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-6.2169,x:-5.45,y:616,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.5396,skewY:-115.4519,x:124.95,y:95.55,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:11.0568,skewY:-168.9493,x:76.95,y:0.1,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.6738,x:-5.25,y:-43,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.6695,x:-31.15,y:-119.25,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-11.5134,x:12.35,y:229.35,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-1.4787,x:-107.25,y:-46.5,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-24.498,x:-186.55,y:45,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-18.5397,x:-6.85,y:629,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-5.3497,x:-12.9,y:614.1,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:64.6077,skewY:-115.3832,x:123.4,y:93.9,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:11.1248,skewY:-168.8819,x:75.5,y:-1.55,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-7.6055,x:-6.65,y:-44.85,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.6023,x:-32.4,y:-120.95,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-10.6455,x:10.65,y:227.7,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-4.1395,x:-107.75,y:-47.9,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-27.1601,x:-182.6,y:47.2,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-16.8525,x:-26.7,y:626,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-4.481,x:-20.4,y:611.95,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.677,skewY:-115.3144,x:121.9,y:92.55,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:11.1936,skewY:-168.812,x:74.15,y:-3.05,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.5368,x:-8,y:-46.35,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.5332,x:-33.65,y:-122.65,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-9.776,x:9.05,y:226,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-6.8021,x:-108.2,y:-49.3,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-29.8227,x:-178.6,y:49.2,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-15.1661,x:-46.4,y:622.4,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-3.6116,x:-28,y:609.8,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.7458,skewY:-115.246,x:120.4,y:91.05,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:11.2622,skewY:-168.7446,x:72.75,y:-4.55,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.4679,x:-9.4,y:-48.05,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.4635,x:-34.9,y:-124.35,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-8.9078,x:7.15,y:224.45,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-9.4635,x:-108.75,y:-50.7,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-32.4837,x:-174.35,y:50.8,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-13.4793,x:-66,y:618.1,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-2.743,x:-35.45,y:607.65,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.8135,skewY:-115.1768,x:118.8,y:89.45,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:11.3304,skewY:-168.6759,x:71.3,y:-6.15,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.3988,x:-10.7,y:-49.7,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.3954,x:-36.2,y:-126,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-8.0398,x:5.55,y:222.75,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:-12.1261,x:-109.05,y:-52,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-35.1462,x:-169.95,y:52.4,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-11.7931,x:-85.3,y:612.75,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-1.8751,x:-42.9,y:605.35,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.8832,skewY:-115.1085,x:117.3,y:88,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:11.3991,skewY:-168.6078,x:69.9,y:-7.75,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.3317,x:-12.1,y:-51.4,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.3282,x:-37.35,y:-127.75,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.6}},{t:this.ikNode_39,p:{rotation:-7.1711,x:3.95,y:221.1,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-14.7873,x:-109.5,y:-53.5,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-37.8082,x:-165.6,y:53.8,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:-10.1058,x:-104.25,y:606.85,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-1.0067,x:-50.55,y:603.05,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:64.9517,skewY:-115.0402,x:115.85,y:86.5,regY:-28.3,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:11.467,skewY:-168.5391,x:68.45,y:-9.3,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.262,x:-13.5,y:-53,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.2593,x:-38.7,y:-129.35,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.3022,x:2.2,y:219.45,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-17.4493,x:-109.9,y:-54.95,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-40.4695,x:-160.9,y:54.75,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-9.073,x:-108.35,y:605.25,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9997,x:-47.7,y:603.45,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:64.2915,skewY:-115.7,x:119.85,y:86.35,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.8062,skewY:-169.1996,x:71.2,y:-8.95,regX:-24.3,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.2567,x:-10.55,y:-52.65,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.2531,x:-35.8,y:-129,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.297,x:5,y:219.8,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-20.5273,x:-106.25,y:-55.35,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-43.5681,x:-151.25,y:56.85,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-8.0422,x:-112.3,y:603.5,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9944,x:-44.85,y:603.8,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:63.631,skewY:-116.3597,x:123.8,y:86.1,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.1484,skewY:-169.8588,x:74.3,y:-8.55,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.2505,x:-7.6,y:-52.3,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.2478,x:-32.9,y:-128.65,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2907,x:8.05,y:220.2,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-23.6042,x:-102.5,y:-55.8,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11.1,rotation:-46.6681,x:-141.5,y:58.6,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-7.0122,x:-116.4,y:601.6,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:-0.9883,x:-41.95,y:604.05,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:62.9717,skewY:-117.0198,x:127.8,y:85.9,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:9.4875,skewY:-170.5199,x:77.15,y:-8.15,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.2452,x:-4.8,y:-51.95,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-7.2416,x:-30,y:-128.25,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2855,x:10.85,y:220.6,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-26.6811,x:-98.85,y:-56.25,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11.1,rotation:-49.7667,x:-131.55,y:60.1,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-5.9802,x:-120.2,y:599.65,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:-0.983,x:-39.15,y:604.35,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:62.3104,skewY:-117.6808,x:131.8,y:85.7,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:8.8271,skewY:-171.1789,x:80.15,y:-7.8,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.239,x:-1.75,y:-51.6,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.2364,x:-27,y:-127.9,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2794,x:13.75,y:220.95,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-29.7588,x:-95.05,y:-56.7,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-52.867,x:-121.45,y:61.25,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:-4.9492,x:-124.25,y:597.5,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9778,x:-36.25,y:604.65,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:61.652,skewY:-118.3398,x:135.75,y:85.4,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:8.167,skewY:-171.8391,x:83.05,y:-7.5,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.2337,x:1.15,y:-51.2,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.2293,x:-24.1,y:-127.6,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2731,x:16.6,y:221.3,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:-32.8363,x:-91.3,y:-57.05,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-55.9645,x:-111.4,y:62.05,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-3.9181,x:-128.1,y:595.25,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9716,x:-33.5,y:605.05,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:60.9911,skewY:-118.999,x:139.75,y:85.25,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:7.5071,skewY:-172.4992,x:85.95,y:-7.05,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.2276,x:4.05,y:-50.85,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.224,x:-21.2,y:-127.25,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2678,x:19.55,y:221.65,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-35.9136,x:-87.7,y:-57.5,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-59.0647,x:-101.2,y:62.5,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-2.8865,x:-131.85,y:592.9,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9664,x:-30.65,y:605.4,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:60.3322,skewY:-119.6591,x:143.8,y:84.9,regY:-28.3,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:6.8472,skewY:-173.1592,x:88.9,y:-6.75,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.2223,x:6.9,y:-50.5,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.2178,x:-18.3,y:-126.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2618,x:22.45,y:222,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-38.9892,x:-83.85,y:-58.05,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-62.1636,x:-91.05,y:62.7,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-1.8548,x:-135.65,y:590.35,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9602,x:-27.8,y:605.8,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:59.6721,skewY:-120.319,x:147.6,y:84.6,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:6.1866,skewY:-173.8189,x:91.65,y:-6.35,regX:-24.3,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.2161,x:9.7,y:-50.1,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-7.2124,x:-15.35,y:-126.5,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2555,x:25.3,y:222.4,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-42.068,x:-80.2,y:-58.4,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-65.2623,x:-80.75,y:62.4,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-0.8239,x:-139.5,y:587.65,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.955,x:-24.95,y:606.1,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:59.0115,skewY:-120.9794,x:151.65,y:84.45,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:5.5269,skewY:-174.4796,x:94.7,y:-5.85,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.2108,x:12.6,y:-49.7,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-7.2062,x:-12.4,y:-126.15,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2501,x:28.25,y:222.8,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-45.1451,x:-76.35,y:-59,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-68.3614,x:-70.5,y:61.8,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:0.2033,x:-143.15,y:584.85,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9488,x:-22.05,y:606.5,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:58.3519,skewY:-121.6392,x:155.65,y:84.15,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:4.8676,skewY:-175.1387,x:97.6,y:-5.55,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.2046,x:15.7,y:-49.35,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.2009,x:-9.55,y:-125.8,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.244,x:30.95,y:223.15,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-48.2233,x:-72.65,y:-59.45,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-71.4606,x:-60.25,y:60.85,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:1.235,x:-146.8,y:582,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9435,x:-19.2,y:606.85,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:57.6915,skewY:-122.2996,x:159.55,y:83.8,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:4.2067,skewY:-175.7989,x:100.5,y:-5.15,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.1983,x:18.6,y:-49,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.1947,x:-6.5,y:-125.4,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.6}},{t:this.ikNode_39,p:{rotation:-6.2388,x:34,y:223.5,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-51.2995,x:-68.8,y:-59.85,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-74.5595,x:-50.05,y:59.6,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:2.2662,x:-150.3,y:579.15,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:-0.9383,x:-16.4,y:607.2,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:57.0321,skewY:-122.9587,x:163.5,y:83.45,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:3.547,skewY:-176.4592,x:103.25,y:-4.75,regX:-24.3,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.193,x:21.5,y:-48.65,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.1894,x:-3.55,y:-125.05,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.6}},{t:this.ikNode_39,p:{rotation:-6.2325,x:36.95,y:223.8,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-54.3773,x:-65.1,y:-60.35,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-77.6579,x:-39.9,y:57.9,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:3.2954,x:-153.75,y:576.1,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9321,x:-13.5,y:607.55,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:56.3718,skewY:-123.6186,x:167.4,y:83.15,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:2.8869,skewY:-177.1192,x:106.3,y:-4.4,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.1868,x:24.4,y:-48.3,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.1833,x:-0.75,y:-124.7,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2264,x:39.8,y:224.15,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-57.4552,x:-61.25,y:-60.75,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-80.7574,x:-29.8,y:56.15,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:4.3267,x:-157.25,y:572.95,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9251,x:-10.65,y:607.95,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:55.712,skewY:-124.2789,x:171.35,y:82.8,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:2.2273,skewY:-177.7795,x:109.2,y:-4,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.1815,x:27.2,y:-47.9,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-7.1788,x:2.15,y:-124.35,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2212,x:42.55,y:224.55,regX:66.1,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-60.5314,x:-57.45,y:-61.2,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-83.8561,x:-19.75,y:53.7,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:5.3585,x:-160.45,y:569.6,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-0.9208,x:-7.8,y:608.3,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:55.0507,skewY:-124.9404,x:175.25,y:82.45,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:1.5662,skewY:-178.4404,x:112.1,y:-3.7,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.1753,x:30,y:-47.55,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-7.1727,x:5,y:-123.95,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2149,x:45.55,y:224.9,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-63.6091,x:-53.6,y:-61.55,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-86.9545,x:-9.9,y:51.05,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:4.5499,x:-151.6,y:574,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:0.5638,x:-9.2,y:607.15,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:53.8292,skewY:-126.1611,x:176.5,y:79.8,regY:-28.3,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:0.3435,skewY:-179.6623,x:111.55,y:-4.75,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.2435,x:29.35,y:-48.6,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-7.2407,x:4.25,y:-124.9,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.4416,x:45.3,y:223.85,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-59.9721,x:-54.55,y:-62.25,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11.1,rotation:-83.319,x:-18.1,y:53.05,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:3.7424,x:-142.45,y:578.05,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:2.0523,x:-10.6,y:605.9,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:52.6078,skewY:-127.384,x:177.65,y:77.45,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-0.8746,skewY:179.1201,x:110.85,y:-5.9,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-7.3114,x:28.75,y:-49.75,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.3087,x:3.5,y:-125.95,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.6694,x:44.9,y:222.85,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-56.3352,x:-55.5,y:-62.8,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-79.6811,x:-26.35,y:54.5,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:2.9347,x:-133.2,y:582,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:3.5421,x:-11.8,y:604.7,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:51.3843,skewY:-128.6068,x:178.75,y:74.75,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-2.0975,skewY:177.8971,x:110.3,y:-7,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-7.3784,x:28.15,y:-50.8,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.376,x:2.85,y:-126.9,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.8955,x:44.6,y:221.8,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-52.6972,x:-56.45,y:-63.45,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11.1,rotation:-76.0439,x:-34.85,y:55.45,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:2.1276,x:-123.7,y:585.6,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:5.0292,x:-13.4,y:603.5,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:50.161,skewY:-129.8295,x:179.9,y:72.3,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-3.3205,skewY:176.6732,x:109.75,y:-8.2,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.4448,x:27.65,y:-51.7,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.4423,x:2.2,y:-127.9,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-7.1216,x:44.25,y:220.65,regX:66.2,scaleX:0.997,scaleY:0.997}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-49.0596,x:-57.45,y:-64.1,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-72.4066,x:-43.2,y:55.95,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:1.32,x:-114.1,y:588.9,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:6.5178,x:-14.85,y:602.35,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:48.939,skewY:-131.0518,x:181.05,y:69.65,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-4.5442,skewY:175.4511,x:109.15,y:-9.25,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.5127,x:27,y:-52.65,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.5112,x:1.35,y:-128.85,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-7.3488,x:43.8,y:219.7,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:-45.4223,x:-58.25,y:-64.6,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-68.7697,x:-51.9,y:56.15,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:0.5118,x:-104.35,y:592,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:8.0066,x:-16.2,y:601.1,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:47.7151,skewY:-132.2751,x:182.1,y:67,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-5.7647,skewY:174.2285,x:108.5,y:-10.35,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.5801,x:26.35,y:-53.7,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.5784,x:0.7,y:-129.9,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-7.5769,x:43.7,y:218.65,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-41.7855,x:-59.2,y:-65.3,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-65.1317,x:-60.4,y:55.6,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:-0.2936,x:-94.55,y:594.75,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:9.4961,x:-17.65,y:599.85,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:46.4936,skewY:-133.4979,x:183.05,y:64.15,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-6.9885,skewY:173.0058,x:107.95,y:-11.55,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.6473,x:25.7,y:-54.75,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.6465,x:-0.1,y:-130.9,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-7.8035,x:43.3,y:217.65,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-38.1487,x:-60.1,y:-65.9,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-61.4946,x:-69,y:54.65,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-1.1009,x:-84.5,y:597.3,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:10.9842,x:-19,y:598.65,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:45.271,skewY:-134.7207,x:184,y:61.4,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-8.2105,skewY:171.7823,x:107.35,y:-12.65,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.7152,x:24.9,y:-55.75,scaleX:0.998,scaleY:0.998,regX:38.4}},{t:this.ikNode_35,p:{rotation:-7.7138,x:-0.8,y:-131.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-8.03,x:42.95,y:216.6,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-34.5105,x:-61.05,y:-66.5,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-57.8572,x:-77.6,y:53.2,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-1.9084,x:-74.5,y:599.6,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:12.4727,x:-20.4,y:597.4,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:44.0478,skewY:-135.9433,x:185.1,y:58.65,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:-9.4332,skewY:170.5594,x:106.65,y:-13.7,regX:-24.3,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.7824,x:24.35,y:-56.8,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.781,x:-1.55,y:-132.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-8.256,x:42.65,y:215.45,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-30.8723,x:-61.95,y:-67.1,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-54.2183,x:-86,y:51.3,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-2.7162,x:-64.35,y:601.75,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:13.9607,x:-21.8,y:596.15,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:42.8255,skewY:-137.165,x:185.95,y:55.9,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-10.6579,skewY:169.3373,x:106.15,y:-14.85,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.8489,x:23.7,y:-57.85,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.8491,x:-2.2,y:-133.9,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.6}},{t:this.ikNode_39,p:{rotation:-8.4836,x:42.3,y:214.45,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:-27.2353,x:-62.9,y:-67.6,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-50.5833,x:-94.45,y:49,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-3.5254,x:-54.2,y:603.45,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:15.4502,x:-23.2,y:594.9,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:41.6028,skewY:-138.3884,x:186.85,y:53,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-11.8785,skewY:168.1139,x:105.55,y:-15.95,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-7.9168,x:23.05,y:-59,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.9155,x:-3.05,y:-134.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-8.7107,x:42,y:213.4,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-23.5991,x:-63.75,y:-68.3,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-46.9452,x:-102.6,y:46.05,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-4.332,x:-43.9,y:604.85,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:16.9388,x:-24.5,y:593.7,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:40.3798,skewY:-139.6105,x:187.75,y:50.1,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-13.1021,skewY:166.8915,x:104.95,y:-17.15,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.9842,x:22.4,y:-59.85,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.9846,x:-3.75,y:-135.75,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-8.9369,x:41.6,y:212.3,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-19.9618,x:-64.7,y:-69,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11.1,rotation:-43.3077,x:-110.8,y:42.65,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-5.1411,x:-33.7,y:605.9,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:18.4291,x:-26,y:592.45,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:39.1573,skewY:-140.8333,x:188.55,y:47.25,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-14.3253,skewY:165.6689,x:104.2,y:-18.25,regX:-24.3,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.0513,x:21.75,y:-60.9,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.0519,x:-4.55,y:-136.8,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-9.1634,x:41.35,y:211.3,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-16.3238,x:-65.7,y:-69.55,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-39.6713,x:-118.55,y:39,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-5.9486,x:-23.4,y:606.7,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:19.9164,x:-27.25,y:591.25,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:37.9345,skewY:-142.0568,x:189.25,y:44.15,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-15.548,skewY:164.4463,x:103.8,y:-19.3,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.1196,x:21.1,y:-61.95,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.1192,x:-5.15,y:-137.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.6}},{t:this.ikNode_39,p:{rotation:-9.3908,x:40.9,y:210.3,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-12.6872,x:-66.45,y:-70.15,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-36.0335,x:-126.25,y:34.75,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9976,rotation:-6.757,x:-13.3,y:607.3,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:21.4056,x:-28.8,y:590,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:36.7126,skewY:-143.2801,x:190.1,y:41.25,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-16.7706,skewY:163.2222,x:103.15,y:-20.5,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.1877,x:20.45,y:-62.9,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.1865,x:-6,y:-138.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-9.6176,x:40.7,y:209.2,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-9.0494,x:-67.35,y:-70.8,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-32.3966,x:-133.8,y:30.2,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-8.6463,x:-10.35,y:606.7,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:23.3301,x:-38.8,y:587.4,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:38.4404,skewY:-141.5517,x:184.35,y:42.6,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-15.0438,skewY:164.9499,x:99.35,y:-21.8,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.9745,x:16.75,y:-64.55,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.9748,x:-9.4,y:-140.5,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-9.2203,x:36.05,y:207.7,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-11.259,x:-70.8,y:-72.7,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-34.6061,x:-133.2,y:30.75,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-10.5352,x:-7.45,y:605.95,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:25.2547,x:-48.75,y:584.8,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:40.165,skewY:-139.8244,x:178.65,y:43.8,regY:-28.3,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-13.318,skewY:166.6763,x:95.6,y:-23.05,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.7621,x:13.15,y:-66.15,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.7624,x:-12.75,y:-142.15,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-8.8242,x:31.5,y:206.1,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-13.4685,x:-74.2,y:-74.6,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-36.8163,x:-132.6,y:31.2,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-12.4269,x:-4.3,y:605.1,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:27.1792,x:-58.7,y:582.2,regY:1.2}},{t:this.ikNode_42,p:{regX:15.1,skewX:41.8921,skewY:-138.0982,x:172.65,y:44.95,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-11.5902,skewY:168.4042,x:91.75,y:-24.35,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.55,x:9.55,y:-67.7,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.5502,x:-16.1,y:-143.9,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-8.426,x:26.8,y:204.6,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-15.6787,x:-77.6,y:-76.45,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-39.0248,x:-131.9,y:31.4,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-14.3153,x:-1.05,y:604.05,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:29.1043,x:-68.65,y:579.3,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:43.6184,skewY:-136.372,x:166.8,y:46.1,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-9.8643,skewY:170.1303,x:88,y:-25.65,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.3389,x:5.95,y:-69.35,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.3388,x:-19.4,y:-145.6,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-8.03,x:22.15,y:203.1,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-17.8886,x:-81.1,y:-78.5,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-41.2352,x:-131.2,y:31.65,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-16.205,x:2.1,y:602.95,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:31.029,x:-78.55,y:576.5,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:45.3458,skewY:-134.645,x:160.85,y:47.1,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-8.1369,skewY:171.8576,x:84.15,y:-26.9,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.126,x:2.35,y:-70.9,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.1259,x:-22.75,y:-147.25,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-7.6327,x:17.55,y:201.5,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-20.098,x:-84.45,y:-80.2,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-43.4453,x:-130.25,y:31.55,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-18.0957,x:5.45,y:601.65,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:32.9536,x:-88.45,y:573.55,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:47.0729,skewY:-132.9183,x:154.75,y:48.15,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-6.4106,skewY:173.5833,x:80.4,y:-28.25,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.9142,x:-1.25,y:-72.5,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.9147,x:-26.05,y:-148.95,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-7.2365,x:12.9,y:199.95,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-22.3077,x:-87.95,y:-82.2,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-45.6551,x:-129.35,y:31.25,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-19.9842,x:8.75,y:600,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:34.8777,x:-98.3,y:570.6,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:48.8007,skewY:-131.1904,x:148.6,y:49.05,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:-4.6839,skewY:175.3107,x:76.65,y:-29.45,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-6.7016,x:-4.95,y:-74.3,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.7021,x:-29.45,y:-150.6,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.8397,x:8.25,y:198.4,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-24.5181,x:-91.25,y:-84.15,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-47.8653,x:-128.5,y:30.95,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-21.8748,x:12.15,y:598.5,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:36.8024,x:-108.2,y:567.5,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:50.5263,skewY:-129.464,x:142.45,y:49.9,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:-2.9571,skewY:177.0379,x:72.8,y:-30.8,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.49,x:-8.7,y:-75.75,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-6.4894,x:-32.75,y:-152.35,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.4425,x:3.6,y:196.85,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-26.727,x:-94.7,y:-85.9,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-50.0747,x:-127.3,y:30.35,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-23.7649,x:15.3,y:596.7,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:38.728,x:-118.1,y:564.4,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:52.2541,skewY:-127.7365,x:136.15,y:50.65,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:-1.2296,skewY:178.7649,x:68.9,y:-32.05,regX:-24.3,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.2775,x:-12.15,y:-77.3,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.2785,x:-36.1,y:-154.05,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.0455,x:-1,y:195.35,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:-28.937,x:-98.05,y:-87.65,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-52.2848,x:-126.2,y:29.65,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-25.6557,x:18.75,y:594.7,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:40.6518,x:-127.8,y:561.05,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:53.9812,skewY:-126.0101,x:129.85,y:51.3,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:0.4934,skewY:-179.5125,x:65.1,y:-33.4,regX:-24.3,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.066,x:-15.8,y:-78.95,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.0661,x:-39.5,y:-155.75,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-5.6491,x:-5.65,y:193.8,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-31.1477,x:-101.65,y:-89.65,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-54.4939,x:-125.25,y:28.85,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-27.5442,x:22,y:592.55,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:42.5755,x:-137.65,y:557.75,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:55.7081,skewY:-124.283,x:123.45,y:51.75,regY:-28.3,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:2.2203,skewY:-177.7869,x:61.4,y:-34.7,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.8536,x:-19.45,y:-80.5,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.8536,x:-42.75,y:-157.35,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-5.2517,x:-10.25,y:192.25,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-33.3571,x:-105.1,y:-91.75,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-56.7038,x:-123.9,y:27.7,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-29.4334,x:25.1,y:590.15,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:44.5009,x:-147.3,y:554.4,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:57.4349,skewY:-122.5563,x:117.05,y:52.5,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:3.9466,skewY:-176.0602,x:57.6,y:-36,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.6415,x:-23,y:-82.2,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.6422,x:-46.2,y:-159.1,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-4.8557,x:-15.05,y:190.6,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-35.5657,x:-108.35,y:-93.55,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-58.9137,x:-122.7,y:26.45,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-31.3237,x:28.25,y:587.85,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:46.425,x:-157.1,y:550.9,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:59.1614,skewY:-120.8289,x:110.55,y:52.9,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:5.6739,skewY:-174.3332,x:53.8,y:-37.25,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-5.4285,x:-26.7,y:-83.75,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.4291,x:-49.55,y:-160.8,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-4.4588,x:-19.65,y:189.05,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-37.7769,x:-111.8,y:-95.35,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-61.1235,x:-121.5,y:24.95,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-33.2139,x:31.25,y:585.3,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:48.3496,x:-166.75,y:547.45,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:60.8889,skewY:-119.1014,x:104,y:53.25,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:7.4,skewY:-172.6061,x:50,y:-38.6,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.2173,x:-30.45,y:-85.25,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-5.2178,x:-52.8,y:-162.5,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-4.0614,x:-24.15,y:187.5,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-39.9861,x:-115.2,y:-97.2,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-63.3342,x:-120.3,y:23.45,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.1032,x:34.15,y:582.55,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:50.2748,x:-176.5,y:543.75,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:62.616,skewY:-117.3753,x:97.4,y:53.55,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:9.1281,skewY:-170.878,x:46.2,y:-39.85,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-5.0045,x:-34.05,y:-86.95,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-5.0066,x:-56.25,y:-164.2,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-3.6642,x:-28.8,y:185.9,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:-42.1959,x:-118.55,y:-99,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11.1,rotation:-65.5428,x:-119.2,y:21.55,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.1915,x:31.55,y:581.55,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:46.6341,x:-167.55,y:545.5,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:63.64,skewY:-116.3514,x:96.05,y:52.8,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:10.1511,skewY:-169.8554,x:46.55,y:-41.5,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.0747,x:-33.8,y:-88.35,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-5.076,x:-55.95,y:-165.65,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.6}},{t:this.ikNode_39,p:{rotation:-3.6967,x:-28.15,y:184.4,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-41.6258,x:-118.45,y:-100.65,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-64.9721,x:-120,y:20.15,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.2812,x:28.85,y:580.4,regY:11.6,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:42.9943,x:-158.35,y:547.15,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:64.6644,skewY:-115.3278,x:94.65,y:52,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:11.1757,skewY:-168.8313,x:46.9,y:-43.1,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.146,x:-33.55,y:-89.95,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-5.1465,x:-55.9,y:-167.25,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-3.73,x:-27.7,y:182.75,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-41.0566,x:-118.15,y:-102.1,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-64.4024,x:-121,y:18.6,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.3678,x:26.35,y:579.3,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:39.354,x:-149.15,y:548.55,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:65.6873,skewY:-114.3022,x:93.3,y:51.15,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:12.2002,skewY:-167.806,x:47.2,y:-44.8,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.2164,x:-33.25,y:-91.5,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-5.2178,x:-55.65,y:-168.75,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-3.7634,x:-27,y:181.2,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:-40.4857,x:-117.75,y:-103.4,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-63.8328,x:-121.85,y:17.15,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.4571,x:23.7,y:578.15,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:35.7144,x:-139.8,y:549.8,regY:1.1}},{t:this.ikNode_42,p:{regX:15.1,skewX:66.7128,skewY:-113.2775,x:91.9,y:50.3,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:13.2235,skewY:-166.7828,x:47.5,y:-46.45,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.2858,x:-32.95,y:-93.05,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-5.2882,x:-55.5,y:-170.25,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-3.796,x:-26.4,y:179.65,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-39.9157,x:-117.5,y:-104.95,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11.1,rotation:-63.2621,x:-122.95,y:15.55,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.5451,x:21.15,y:577,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:32.0743,x:-130.4,y:550.9,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:67.7375,skewY:-112.2536,x:90.5,y:49.5,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:14.2473,skewY:-165.7594,x:47.85,y:-48.05,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-5.3562,x:-32.65,y:-94.75,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.3586,x:-55.3,y:-171.8,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-3.8294,x:-25.75,y:178.1,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-39.3452,x:-117.25,y:-106.5,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-62.6925,x:-123.7,y:14.1,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.6344,x:18.45,y:575.9,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:28.434,x:-120.75,y:551.65,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:68.7615,skewY:-111.2292,x:89,y:48.65,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:15.2725,skewY:-164.7338,x:48.15,y:-49.7,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-5.4268,x:-32.3,y:-96.25,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.4282,x:-55.2,y:-173.3,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-3.8628,x:-25.2,y:176.5,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-38.7747,x:-117.05,y:-107.85,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-62.122,x:-124.65,y:12.5,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.7222,x:15.8,y:574.6,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:24.7934,x:-111.15,y:552.25,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:69.7858,skewY:-110.2044,x:87.65,y:47.65,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:16.2951,skewY:-163.7093,x:48.55,y:-51.35,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.4979,x:-31.95,y:-97.7,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.4994,x:-55,y:-174.85,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-3.8953,x:-24.55,y:175,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-38.2043,x:-116.8,y:-109.35,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-61.5515,x:-125.6,y:11,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.809,x:13.3,y:573.35,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:21.1551,x:-101.55,y:552.6,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:70.8097,skewY:-109.1805,x:86.15,y:46.65,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:17.3214,skewY:-162.6849,x:48.85,y:-53.05,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.5683,x:-31.7,y:-99.3,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.57,x:-54.85,y:-176.3,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-3.9287,x:-23.9,y:173.45,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-37.6338,x:-116.45,y:-110.9,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-60.9807,x:-126.5,y:9.45,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.8973,x:10.55,y:572,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:17.5137,x:-91.85,y:552.85,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:71.8351,skewY:-108.1565,x:84.7,y:45.7,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:18.3441,skewY:-161.6616,x:49.2,y:-54.65,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.6388,x:-31.4,y:-100.85,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.6413,x:-54.65,y:-177.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-3.9612,x:-23.25,y:171.95,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:-37.0644,x:-116.1,y:-112.3,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-60.4097,x:-127.45,y:7.85,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-35.9859,x:7.95,y:570.8,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:13.8731,x:-82.05,y:552.85,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:72.8589,skewY:-107.1327,x:83.35,y:44.55,regY:-28.3,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:19.3678,skewY:-160.6382,x:49.35,y:-56.35,regX:-24.3,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.7083,x:-31.15,y:-102.35,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.71,x:-54.5,y:-179.35,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-3.9937,x:-22.7,y:170.35,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-36.4942,x:-115.85,y:-113.85,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-59.8408,x:-128.35,y:6.2,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-36.0744,x:5.3,y:569.5,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:10.2337,x:-72.35,y:552.55,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:73.8834,skewY:-106.1082,x:81.7,y:43.6,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:20.3927,skewY:-159.6128,x:49.65,y:-57.95,regX:-24.3,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.7788,x:-30.85,y:-103.85,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.7814,x:-54.25,y:-180.9,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-4.0271,x:-22.05,y:168.75,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-35.9238,x:-115.75,y:-115.25,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-59.27,x:-129.25,y:4.65,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-36.1628,x:2.65,y:568.15,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:6.5946,x:-62.65,y:552.1,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:74.9061,skewY:-105.0833,x:80.25,y:42.55,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:21.4162,skewY:-158.5898,x:50.1,y:-59.6,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.8502,x:-30.6,y:-105.45,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.8528,x:-54.05,y:-182.35,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-4.0605,x:-21.45,y:167.2,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-35.3536,x:-115.4,y:-116.75,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-58.7001,x:-130.2,y:3.05,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-36.2513,x:0.05,y:566.6,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:2.9537,x:-52.75,y:551.55,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:75.9315,skewY:-104.0589,x:78.9,y:41.35,regY:-28.3,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:22.4406,skewY:-157.5655,x:50.3,y:-61.3,regX:-24.3,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.9196,x:-30.35,y:-107,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.9232,x:-53.9,y:-184,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-4.0931,x:-20.9,y:165.65,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-34.784,x:-115.15,y:-118.3,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-58.1299,x:-131.05,y:1.35,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-36.3389,x:-2.4,y:565.3,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:-0.6831,x:-43.25,y:550.5,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:76.9565,skewY:-103.0342,x:77.25,y:40.25,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:23.4647,skewY:-156.5407,x:50.75,y:-62.9,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-5.9902,x:-30.05,y:-108.55,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-5.9938,x:-53.65,y:-185.45,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.6}},{t:this.ikNode_39,p:{rotation:-4.1265,x:-20.25,y:164.05,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-34.2133,x:-114.8,y:-119.7,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-57.5589,x:-131.95,y:-0.25,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-36.4268,x:-5,y:563.85,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-4.3218,x:-33.5,y:549.35,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:77.9807,skewY:-102.0099,x:75.7,y:39.05,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:24.4894,skewY:-155.5165,x:51,y:-64.55,regX:-24.3,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.0607,x:-29.8,y:-110.15,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.0634,x:-53.6,y:-187.05,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-4.1599,x:-19.65,y:162.45,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-33.6431,x:-114.55,y:-121.15,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11.1,rotation:-56.9894,x:-133.05,y:-2.05,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-34.3702,x:-6.2,y:564.5,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-7.6922,x:-19.3,y:550.1,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:78.3251,skewY:-101.6668,x:75.8,y:39.45,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:24.8318,skewY:-155.1735,x:51.8,y:-64.25,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.2403,x:-29.2,y:-109.55,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.244,x:-53.2,y:-186.35,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-4.3859,x:-18.2,y:163,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-35.5185,x:-113.95,y:-120.25,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-58.8641,x:-128.5,y:-0.4,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-32.3109,x:-7.2,y:565.1,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:-11.0618,x:-5.1,y:550.65,regY:1.2}},{t:this.ikNode_42,p:{regX:15,skewX:78.6679,skewY:-101.3231,x:75.95,y:39.9,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:25.1768,skewY:-154.8295,x:52.55,y:-63.9,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.4211,x:-28.6,y:-109,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.4232,x:-52.9,y:-185.7,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-4.6128,x:-16.7,y:163.55,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-37.3942,x:-113.45,y:-119.45,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-60.7401,x:-123.9,y:0.85,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-30.2528,x:-8.35,y:565.75,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-14.431,x:9.25,y:550.45,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:79.0121,skewY:-100.9792,x:76,y:40.4,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0563,skewX:25.5205,skewY:-154.4852,x:53.2,y:-63.55,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.5993,x:-28.15,y:-108.4,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-6.6031,x:-52.5,y:-185,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-4.8406,x:-15.35,y:164.1,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-39.2698,x:-112.8,y:-118.45,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-62.6157,x:-119.4,y:2,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-28.195,x:-9.45,y:566.3,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.9971,scaleY:0.9971,rotation:-17.7994,x:23.6,y:549.95,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:79.355,skewY:-100.6354,x:76.1,y:40.8,regY:-28.2,scaleX:0.8985,scaleY:0.9992}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:25.8643,skewY:-154.1416,x:53.95,y:-63.25,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-6.7792,x:-27.45,y:-107.95,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.7823,x:-52.15,y:-184.4,scaleX:0.9974,scaleY:0.9974,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-5.0669,x:-13.95,y:164.6,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.2,scaleX:0.9969,scaleY:0.9969,rotation:-41.1448,x:-112.3,y:-117.6,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-64.4914,x:-114.9,y:3.2,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-26.1378,x:-10.6,y:566.9,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-21.1704,x:38.05,y:549,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:79.7002,skewY:-100.2909,x:76.2,y:41.3,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:26.2084,skewY:-153.7974,x:54.65,y:-62.95,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-6.9592,x:-26.85,y:-107.3,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-6.9625,x:-51.8,y:-183.75,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-5.2941,x:-12.45,y:165.1,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5,scaleX:0.9969,scaleY:0.9969,rotation:-43.0208,x:-111.5,y:-116.6,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-66.3672,x:-110.3,y:3.95,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-24.08,x:-11.75,y:567.35,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-24.5384,x:52.4,y:547.55,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:80.0426,skewY:-99.947,x:76.25,y:41.7,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:26.5517,skewY:-153.4538,x:55.25,y:-62.7,regX:-24.3,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.1384,x:-26.4,y:-106.7,scaleX:0.9979,scaleY:0.9979,regX:38.4}},{t:this.ikNode_35,p:{rotation:-7.1426,x:-51.5,y:-183.15,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-5.5205,x:-11.05,y:165.65,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-44.8958,x:-111.1,y:-115.65,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-68.2429,x:-105.8,y:4.75,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-22.0226,x:-12.8,y:567.7,regY:11.6,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-27.9079,x:66.6,y:545.7,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:80.3878,skewY:-99.6034,x:76.4,y:42.15,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:26.8943,skewY:-153.1103,x:56.15,y:-62.3,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.8,rotation:-7.3194,x:-25.7,y:-106.3,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.322,x:-51,y:-182.55,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.6}},{t:this.ikNode_39,p:{rotation:-5.7478,x:-9.7,y:166.2,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-46.772,x:-110.4,y:-114.9,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-70.1183,x:-101.25,y:5.35,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-19.9636,x:-13.9,y:568.3,regY:11.7,regX:-15}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-31.2782,x:80.8,y:543.5,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:80.7303,skewY:-99.2601,x:76.45,y:42.5,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:27.2392,skewY:-152.7671,x:56.8,y:-62,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.4977,x:-25.1,y:-105.6,scaleX:0.998,scaleY:0.998,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.5016,x:-50.85,y:-181.8,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-5.9742,x:-8.15,y:166.7,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-48.6463,x:-109.85,y:-113.9,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-71.9944,x:-96.7,y:5.95,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-17.9064,x:-15.15,y:568.65,regY:11.6,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.3,scaleX:0.997,scaleY:0.997,rotation:-34.6471,x:94.75,y:540.8,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:81.0749,skewY:-98.9164,x:76.55,y:43.05,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:27.5821,skewY:-152.4225,x:57.5,y:-61.65,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.6781,x:-24.5,y:-105,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.6811,x:-50.5,y:-181.15,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.2008,x:-6.8,y:167.15,regX:66.1,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-50.5214,x:-109.2,y:-113.05,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-73.8696,x:-92.2,y:6.3,scaleX:0.9975,scaleY:0.9975}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-15.8491,x:-16.15,y:569.2,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-38.0166,x:108.7,y:537.6,regY:1.1}},{t:this.ikNode_42,p:{regX:15,skewX:81.4183,skewY:-98.5728,x:76.6,y:43.35,regY:-28.2,scaleX:0.8986,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:27.9267,skewY:-152.08,x:58.2,y:-61.35,regX:-24.4,scaleY:0.9976}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-7.8577,x:-23.9,y:-104.5,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-7.8616,x:-50.15,y:-180.45,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.4275,x:-5.3,y:167.65,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-52.3975,x:-108.65,y:-112.15,regX:-9.7}},{t:this.ikNode_38,p:{regX:8.3,regY:-11,rotation:-75.745,x:-87.75,y:6.75,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-13.7929,x:-17.25,y:569.65,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-41.3864,x:122.35,y:534.25,regY:1.2}},{t:this.ikNode_42,p:{regX:15.1,skewX:81.7624,skewY:-98.2277,x:76.7,y:43.7,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:28.2701,skewY:-151.7352,x:58.95,y:-61.05,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.0372,x:-23.3,y:-103.9,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.0412,x:-49.85,y:-179.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.6553,x:-3.8,y:168.15,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-54.2722,x:-108.15,y:-111.1,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-77.6213,x:-83.2,y:6.75,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-13.7929,x:-17.25,y:569.65,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-41.3864,x:122.35,y:534.25,regY:1.2}},{t:this.ikNode_42,p:{regX:15.1,skewX:81.7624,skewY:-98.2277,x:76.7,y:43.7,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:28.2701,skewY:-151.7352,x:58.95,y:-61.05,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.0372,x:-23.3,y:-103.9,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.0412,x:-49.85,y:-179.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.6553,x:-3.8,y:168.15,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-54.2722,x:-108.15,y:-111.1,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-77.6213,x:-83.2,y:6.75,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-13.7929,x:-17.25,y:569.65,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-41.3864,x:122.35,y:534.25,regY:1.2}},{t:this.ikNode_42,p:{regX:15.1,skewX:81.7624,skewY:-98.2277,x:76.7,y:43.7,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:28.2701,skewY:-151.7352,x:58.95,y:-61.05,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.0372,x:-23.3,y:-103.9,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.0412,x:-49.85,y:-179.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.6553,x:-3.8,y:168.15,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-54.2722,x:-108.15,y:-111.1,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-77.6213,x:-83.2,y:6.75,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-13.7929,x:-17.25,y:569.65,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-41.3864,x:122.35,y:534.25,regY:1.2}},{t:this.ikNode_42,p:{regX:15.1,skewX:81.7624,skewY:-98.2277,x:76.7,y:43.7,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:28.2701,skewY:-151.7352,x:58.95,y:-61.05,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.0372,x:-23.3,y:-103.9,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.0412,x:-49.85,y:-179.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.6553,x:-3.8,y:168.15,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-54.2722,x:-108.15,y:-111.1,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-77.6213,x:-83.2,y:6.75,scaleX:0.9974,scaleY:0.9974}}]},1).to({state:[{t:this.ikNode_41,p:{scaleX:0.7412,scaleY:0.9975,rotation:-13.7929,x:-17.25,y:569.65,regY:11.7,regX:-15.1}},{t:this.ikNode_40,p:{regX:-7.2,scaleX:0.997,scaleY:0.997,rotation:-41.3864,x:122.35,y:534.25,regY:1.2}},{t:this.ikNode_42,p:{regX:15.1,skewX:81.7624,skewY:-98.2277,x:76.7,y:43.7,regY:-28.2,scaleX:0.8985,scaleY:0.9993}},{t:this.ikNode_37,p:{scaleX:1.0562,skewX:28.2701,skewY:-151.7352,x:58.95,y:-61.05,regX:-24.4,scaleY:0.9977}},{t:this.ikNode_34,p:{regY:-79.7,rotation:-8.0372,x:-23.3,y:-103.9,scaleX:0.9979,scaleY:0.9979,regX:38.5}},{t:this.ikNode_35,p:{rotation:-8.0412,x:-49.85,y:-179.85,scaleX:0.9973,scaleY:0.9973,regY:21.9,regX:0.5}},{t:this.ikNode_39,p:{rotation:-6.6553,x:-3.8,y:168.15,regX:66.2,scaleX:0.9971,scaleY:0.9971}},{t:this.ikNode_36,p:{regY:-5.1,scaleX:0.9969,scaleY:0.9969,rotation:-54.2722,x:-108.15,y:-111.1,regX:-9.8}},{t:this.ikNode_38,p:{regX:8.4,regY:-11,rotation:-77.6213,x:-83.2,y:6.75,scaleX:0.9974,scaleY:0.9974}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-367.8,-282.8,727.4000000000001,996.5);


(lib.Tween17 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.petersburg5MC();
	this.instance.setTransform(-201.95,1.75,1,1,0,0,0,0,1);

	this.instance_1 = new lib.Tween15("synched",0);
	this.instance_1.setTransform(28.5,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-417.9,-173.2,835.9,346.5);


(lib.natalja_walkingcopy = function(mode,startPosition,loop,reversed) {
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
	this.ikNode_53 = new lib.head_smallerMC();
	this.ikNode_53.name = "ikNode_53";
	this.ikNode_53.setTransform(155.25,90.05,0.3373,0.3369,0,-5.8444,-5.723,5.5,89.5);

	this.ikNode_52 = new lib.leftArm_smallerMC();
	this.ikNode_52.name = "ikNode_52";
	this.ikNode_52.setTransform(177.85,120.8,0.5836,0.5849,-32.8725,0,0,-33,-94);

	this.ikNode_50 = new lib.upperBody_smallerMC();
	this.ikNode_50.name = "ikNode_50";
	this.ikNode_50.setTransform(151.5,108.5,0.6043,0.6059,-0.0245,0,0,37,-125.4);

	this.ikNode_54 = new lib.skirt_smallerMC();
	this.ikNode_54.name = "ikNode_54";
	this.ikNode_54.setTransform(150.75,208.45,0.5479,0.5499,0,4.5344,4.4676,-39.2,-200.3);

	this.ikNode_55 = new lib.leftFoot_smallerMC();
	this.ikNode_55.name = "ikNode_55";
	this.ikNode_55.setTransform(98.75,417.15,0.5195,0.5214,1.9252,0,0,-0.6,-56.1);

	this.ikNode_56 = new lib.leftFoot_smallerMC();
	this.ikNode_56.name = "ikNode_56";
	this.ikNode_56.setTransform(169.15,430.9,0.5201,0.521,0,-50.3034,-50.4088,16.2,-48.1);

	this.ikNode_57 = new lib.cape_smallerMC();
	this.ikNode_57.name = "ikNode_57";
	this.ikNode_57.setTransform(176.45,149.3,0.8525,0.8542,0,-10.1978,-10.1471,-67.3,-84.6);

	this.ikNode_51 = new lib.rightArm_smallerMC();
	this.ikNode_51.name = "ikNode_51";
	this.ikNode_51.setTransform(121.1,108.75,0.6299,0.6324,-34.4711,0,0,83.9,1.9);

	this.text = new cjs.Text("Oh", "italic bold 26px 'Verdana'", "#FFFFFF");
	this.text.lineHeight = 34;
	this.text.parent = this;
	this.text.setTransform(-109,-6);

	this.instance = new lib.CachedBmp_80();
	this.instance.setTransform(-111,-8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]}).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:134.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.1,regY:-48.1,skewX:24.6945,skewY:24.5892,x:127.15}},{t:this.ikNode_55,p:{x:166.85,y:427.35,rotation:-13.0748}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:72.1266,x:177.7,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:134.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.1,regY:-48.1,skewX:24.6945,skewY:24.5892,x:127.15}},{t:this.ikNode_55,p:{x:166.85,y:427.35,rotation:-13.0748}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:72.1266,x:177.7,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:134.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.1,regY:-48.1,skewX:24.6945,skewY:24.5892,x:127.15}},{t:this.ikNode_55,p:{x:166.85,y:427.35,rotation:-13.0748}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:72.1266,x:177.7,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:134.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.1,regY:-48.1,skewX:24.6945,skewY:24.5892,x:127.15}},{t:this.ikNode_55,p:{x:166.85,y:427.35,rotation:-13.0748}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:72.1266,x:177.7,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},2).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:134.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.1,regY:-48.1,skewX:24.6945,skewY:24.5892,x:127.15}},{t:this.ikNode_55,p:{x:166.85,y:427.35,rotation:-13.0748}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:72.1266,x:177.7,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},2).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:134.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.1,regY:-48.1,skewX:24.6945,skewY:24.5892,x:127.15}},{t:this.ikNode_55,p:{x:166.85,y:427.35,rotation:-13.0748}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:72.1266,x:177.7,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},2).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:134.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.1,regY:-48.1,skewX:24.6945,skewY:24.5892,x:127.15}},{t:this.ikNode_55,p:{x:166.85,y:427.35,rotation:-13.0748}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:72.1266,x:177.7,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4696,y:125.7,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:126.05,y:425.9,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-2.8742,x:177.75,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.3,regY:-48,skewX:-5.3038,skewY:-5.4102,x:152.25}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4711,y:108.75,regY:1.9,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:-32.8725,x:177.85,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-64.4699,y:132.75,regY:2,x:121.1,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:4.8566,x:177.8,regY:-94,scaleY:0.5849,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:49.8576,x:177.85,regY:-94.2,scaleY:0.5848,y:120.8,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},2).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_52,p:{rotation:94.8567,x:177.8,regY:-94,scaleY:0.5848,y:120.75,regX:-33,scaleX:0.5836}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}}]},2).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:124.8544,x:177.85,regY:-94.2,scaleY:0.5848,y:120.8,regX:-33,scaleX:0.5836}}]},2).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:154.8544,x:177.85,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33,scaleX:0.5836}}]},2).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:154.8544,x:177.85,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33,scaleX:0.5836}},{t:this.text,p:{text:"Oh",lineWidth:41}}]},2).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:154.8544,x:177.85,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33,scaleX:0.5836}},{t:this.text,p:{text:"Oh my",lineWidth:94}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:154.8544,x:177.85,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33,scaleX:0.5836}},{t:this.text,p:{text:"Oh my God",lineWidth:160}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:154.8544,x:177.85,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33,scaleX:0.5836}},{t:this.text,p:{text:"Oh my God!",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:154.8544,x:177.85,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33,scaleX:0.5836}},{t:this.text,p:{text:"Oh my God!\nIt's ",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:154.8544,x:177.85,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33,scaleX:0.5836}},{t:this.text,p:{text:"Oh my God!\nIt's the",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:154.8544,x:177.85,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33,scaleX:0.5836}},{t:this.text,p:{text:"Oh my God!\nIt's the\nEmpress!",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:-5.8444,skewY:-5.723,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:139.8556,x:177.8,regY:-94.2,scaleY:0.5848,y:120.8,regX:-33,scaleX:0.5836}},{t:this.text,p:{text:"Oh my God!\nIt's the\nEmpress!",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:2.8769,skewY:2.9981,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:117.1674,x:177.8,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33.1,scaleX:0.5836}},{t:this.text,p:{text:"Oh my God!\nIt's the\nEmpress!",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:2.8769,skewY:2.9981,regY:89.5,scaleX:0.3373,x:155.25,y:90.05,regX:5.5}},{t:this.ikNode_52,p:{rotation:102.1687,x:177.85,regY:-94.3,scaleY:0.5848,y:120.75,regX:-33.1,scaleX:0.5836}},{t:this.text,p:{text:"Oh my God!\nIt's the\nEmpress!",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:11.372,skewY:11.4909,regY:89.4,scaleX:0.3372,x:155.2,y:90,regX:5.5}},{t:this.ikNode_52,p:{rotation:87.1704,x:177.9,regY:-94.3,scaleY:0.5848,y:120.8,regX:-33.1,scaleX:0.5835}},{t:this.text,p:{text:"Oh my God!\nIt's the\nEmpress!",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:11.372,skewY:11.4909,regY:89.4,scaleX:0.3372,x:155.2,y:90,regX:5.5}},{t:this.ikNode_52,p:{rotation:72.1706,x:177.9,regY:-94.3,scaleY:0.5848,y:120.75,regX:-33.1,scaleX:0.5836}},{t:this.text,p:{text:"Oh my God!\nIt's the\nEmpress!",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-79.469,y:132.7,regY:1.9,x:121.05,regX:83.9}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:151.5}},{t:this.ikNode_53,p:{skewX:26.3712,skewY:26.4908,regY:89.5,scaleX:0.3372,x:155.25,y:90.05,regX:5.6}},{t:this.ikNode_52,p:{rotation:72.1706,x:177.9,regY:-94.3,scaleY:0.5848,y:120.75,regX:-33.1,scaleX:0.5836}},{t:this.instance}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-64.4699,y:132.7,regY:2,x:121.1,regX:83.8}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:153.5}},{t:this.ikNode_53,p:{skewX:26.3712,skewY:26.4908,regY:89.5,scaleX:0.3372,x:155.25,y:90.05,regX:5.6}},{t:this.ikNode_52,p:{rotation:57.1715,x:173.85,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33.2,scaleX:0.5835}},{t:this.text,p:{text:"Oh my God!\nIt's the\nEmpress!",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-49.4716,y:132.7,regY:2.1,x:121.05,regX:83.7}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:153.5}},{t:this.ikNode_53,p:{skewX:11.372,skewY:11.4914,regY:89.4,scaleX:0.3372,x:155.2,y:90,regX:5.5}},{t:this.ikNode_52,p:{rotation:42.1743,x:173.9,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33.1,scaleX:0.5835}},{t:this.text,p:{text:"Oh my God!\nIt's the\nEmpress!",lineWidth:171}}]},3).to({state:[{t:this.ikNode_51,p:{rotation:-34.4738,y:132.7,regY:2.1,x:121.05,regX:83.7}},{t:this.ikNode_57},{t:this.ikNode_56,p:{regX:16.2,regY:-48.1,skewX:-50.3034,skewY:-50.4088,x:169.15}},{t:this.ikNode_55,p:{x:98.75,y:417.15,rotation:1.9252}},{t:this.ikNode_54},{t:this.ikNode_50,p:{x:153.5}},{t:this.ikNode_53,p:{skewX:3.6594,skewY:3.7775,regY:89.5,scaleX:0.3372,x:155.25,y:90.1,regX:5.7}},{t:this.ikNode_52,p:{rotation:27.1748,x:173.9,regY:-94.2,scaleY:0.5848,y:120.75,regX:-33,scaleX:0.5835}},{t:this.text,p:{text:"Oh my God!\nIt's the\nEmpress!",lineWidth:171}}]},3).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-111,-8,470.4,496.2);


(lib.natalja_dressedup = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Armature_34
	this.ikNode_29 = new lib.head_smallerMC();
	this.ikNode_29.name = "ikNode_29";
	this.ikNode_29.setTransform(175,76.85,0.3371,0.3368,0,-3.2366,-3.0388,-19.7,53.9);

	this.ikNode_28 = new lib.leftArm_smallerMC();
	this.ikNode_28.name = "ikNode_28";
	this.ikNode_28.setTransform(229.1,136.55,0.6781,0.6804,-37.4939,0,0,-4.4,-39);

	this.ikNode_26 = new lib.upperBody_smallerMC();
	this.ikNode_26.name = "ikNode_26";
	this.ikNode_26.setTransform(173.8,197,0.6022,0.6045,-2.7389,0,0,20.8,22.5);

	this.ikNode_30 = new lib.skirt_smallerMC();
	this.ikNode_30.name = "ikNode_30";
	this.ikNode_30.setTransform(178.85,259.95,0.5464,0.5494,0,2.5055,2.3542,-45.9,-107.6);

	this.ikNode_27 = new lib.rightArm_smallerMC();
	this.ikNode_27.name = "ikNode_27";
	this.ikNode_27.setTransform(121.05,123.85,0.6278,0.6318,-25.3198,0,0,89,20.4);

	this.ikNode_31 = new lib.leftFoot_smallerMC();
	this.ikNode_31.name = "ikNode_31";
	this.ikNode_31.setTransform(118.9,462.7,0.519,0.5212,-0.213,0,0,-6.8,25.9);

	this.ikNode_32 = new lib.leftFoot_smallerMC();
	this.ikNode_32.name = "ikNode_32";
	this.ikNode_32.setTransform(219.3,450.8,0.52,0.5208,0,-55.1515,-55.2751);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:20.4,scaleX:0.6278,rotation:-25.3198,x:121.05,y:123.85,regX:89,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:-2.7389,x:173.8,y:197,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-37.4939,x:229.1,y:136.55,regX:-4.4,regY:-39,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:53.9,skewX:-3.2366,skewY:-3.0388,x:175,y:76.85,regX:-19.7,scaleX:0.3371,scaleY:0.3368}}]},60).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:20.5,scaleX:0.6277,rotation:-34.5655,x:105.4,y:133.4,regX:89,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-11.9816,x:169.2,y:197.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-46.7356,x:214.1,y:128.55,regX:-4.4,regY:-39,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:53.8,skewX:-12.4795,skewY:-12.2821,x:151.1,y:78.3,regX:-19.7,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:20.4,scaleX:0.6277,rotation:-43.7964,x:91.3,y:144.65,regX:89,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:-21.2127,x:164.5,y:197.3,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-40.9681,x:165.8,y:118.5,regX:-30.4,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:53.8,skewX:-21.7108,skewY:-21.5124,x:127.65,y:82.95,regX:-19.6,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-70.2846,x:95.7,y:146.3,regX:117.2,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-32.7008,x:160.4,y:197.2,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-52.4568,x:145.95,y:119.65,regX:-30.4,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:53.9,skewX:-33.199,skewY:-33.0052,x:101.45,y:92.5,regX:-19.8,scaleX:0.337,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.3,scaleX:0.6277,rotation:-88.479,x:82.45,y:159.4,regX:117.3,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:-45.178,x:154.55,y:195.55,regX:20.7,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-54.7392,x:123.75,y:122.95,regX:-30.3,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90.1,skewX:-30.6766,skewY:-30.4842,x:77.25,y:118.6,regX:-31.6,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:239.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.3,scaleX:0.6277,rotation:-98.9341,x:71.3,y:192.65,regX:117.3,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:269.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-55.6328,x:148.85,y:215.1,regX:20.7,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-54.7392,x:117.75,y:148.95,regX:-30.3,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90.1,skewX:-41.129,skewY:-40.9361,x:58.75,y:153.5,regX:-31.7,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-105.4246,x:76.3,y:215.75,regX:117.3,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:274.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-55.6328,x:148.85,y:230.1,regX:20.7,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-39.7411,x:117.75,y:166.9,regX:-30.2,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-26.1285,skewY:-25.9386,x:58.75,y:168.45,regX:-31.7,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:81.3,y:228.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:285.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-55.6328,x:148.85,y:243.1,regX:20.7,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-24.7415,x:112.75,y:182.9,regX:-30.2,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-26.1285,skewY:-25.9386,x:58.75,y:181.45,regX:-31.7,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:81.3,y:242.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:303.95,scaleX:0.5636,scaleY:0.4798,skewX:2.5062,skewY:2.3538,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-55.6328,x:148.85,y:257.1,regX:20.7,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-9.7428,x:105.7,y:196.9,regX:-30.2,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-11.1297,skewY:-10.9396,x:58.75,y:190.55,regX:-31.7,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:321.95,scaleX:0.5937,scaleY:0.4566,skewX:2.5071,skewY:2.3537,regX:-46,x:178.8,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-64.3315,x:152.85,y:281.05,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-19.7084,x:98.4,y:221.9,regX:-30.2,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-36.0972,skewY:-35.904,x:51,y:226.8,regX:-31.9,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-73.5587,x:163.8,y:293.05,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:12.726,x:104.4,y:253.95,regX:-30.2,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-66.0971,skewY:-65.9016,x:60,y:257.8,regX:-31.9,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:20.7215,x:104.45,y:260.9,regX:-30.1,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:89.9,skewX:-81.0981,skewY:-80.8993,x:64,y:261.8,regX:-31.9,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:35.7196,x:91.4,y:265.9,regX:-30.1,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:89.9,skewX:-89.5379,skewY:-89.3412,x:66,y:261.8,regX:-31.8,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:44.9627,x:91.35,y:265.9,regX:-30.1,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:89.9,skewX:-104.5362,skewY:-104.3413,x:68,y:257.8,regX:-31.9,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:89.9,skewX:-104.5362,skewY:-104.3413,x:68,y:257.8,regX:-31.9,scaleX:0.3371,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:74.9615,x:91.4,y:265.95,regX:-30,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-89.5353,skewY:-89.3438,x:68,y:257.8,regX:-31.8,scaleX:0.3371,scaleY:0.3368}},{t:this.ikNode_28,p:{rotation:74.9615,x:91.4,y:265.95,regX:-30,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90.2,skewX:-74.5368,skewY:-74.3457,x:68,y:257.8,regX:-31.6,scaleX:0.3371,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:59.9644,x:91.45,y:265.95,regX:-30,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}}]},3).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90.2,skewX:-59.5376,skewY:-59.3463,x:68,y:257.8,regX:-31.6,scaleX:0.3371,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:51.758,x:91.5,y:270.95,regX:-29.9,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}}]},3).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90.2,skewX:-44.5355,skewY:-44.347,x:68,y:257.8,regX:-31.5,scaleX:0.337,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:43.0635,x:91.45,y:273.95,regX:-29.9,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}}]},3).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90.2,skewX:-44.5355,skewY:-44.347,x:68,y:257.8,regX:-31.5,scaleX:0.337,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:43.0635,x:91.45,y:273.95,regX:-29.9,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}}]},11).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90.2,skewX:-59.5376,skewY:-59.3463,x:68,y:257.8,regX:-31.6,scaleX:0.3371,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:51.758,x:91.5,y:270.95,regX:-29.9,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}}]},11).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90.2,skewX:-74.5368,skewY:-74.3457,x:68,y:257.8,regX:-31.6,scaleX:0.3371,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:59.9644,x:91.45,y:265.95,regX:-30,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}}]},3).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-89.5353,skewY:-89.3438,x:68,y:257.8,regX:-31.8,scaleX:0.3371,scaleY:0.3368}},{t:this.ikNode_28,p:{rotation:74.9615,x:91.4,y:265.95,regX:-30,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}}]},3).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:89.9,skewX:-104.5362,skewY:-104.3413,x:68,y:257.8,regX:-31.9,scaleX:0.3371,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:74.9615,x:91.4,y:265.95,regX:-30,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}}]},3).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:44.9627,x:91.35,y:265.9,regX:-30.1,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:89.9,skewX:-104.5362,skewY:-104.3413,x:68,y:257.8,regX:-31.9,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:35.7196,x:91.4,y:265.9,regX:-30.1,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:89.9,skewX:-89.5379,skewY:-89.3412,x:66,y:261.8,regX:-31.8,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-88.5578,x:163.8,y:293.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:20.7215,x:104.45,y:260.9,regX:-30.1,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:89.9,skewX:-81.0981,skewY:-80.8993,x:64,y:261.8,regX:-31.9,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:347.9,scaleX:0.7057,scaleY:0.3793,skewX:2.5062,skewY:2.3532,regX:-45.9,x:178.9,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.6,rotation:-73.5587,x:163.8,y:293.05,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:12.726,x:104.4,y:253.95,regX:-30.2,regY:-80.9,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-66.0971,skewY:-65.9016,x:60,y:257.8,regX:-31.9,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:85.3,y:266.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:321.95,scaleX:0.5937,scaleY:0.4566,skewX:2.5071,skewY:2.3537,regX:-46,x:178.8,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-64.3315,x:152.85,y:281.05,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-19.7084,x:98.4,y:221.9,regX:-30.2,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-36.0972,skewY:-35.904,x:51,y:226.8,regX:-31.9,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:81.3,y:242.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:303.95,scaleX:0.5636,scaleY:0.4798,skewX:2.5062,skewY:2.3538,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-55.6328,x:148.85,y:257.1,regX:20.7,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-9.7428,x:105.7,y:196.9,regX:-30.2,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-11.1297,skewY:-10.9396,x:58.75,y:190.55,regX:-31.7,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-112.4002,x:81.3,y:228.65,regX:117.4,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:285.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-55.6328,x:148.85,y:243.1,regX:20.7,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-24.7415,x:112.75,y:182.9,regX:-30.2,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-26.1285,skewY:-25.9386,x:58.75,y:181.45,regX:-31.7,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:260.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-105.4246,x:76.3,y:215.75,regX:117.3,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:274.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-55.6328,x:148.85,y:230.1,regX:20.7,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-39.7411,x:117.75,y:166.9,regX:-30.2,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90,skewX:-26.1285,skewY:-25.9386,x:58.75,y:168.45,regX:-31.7,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:239.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.3,scaleX:0.6277,rotation:-98.9341,x:71.3,y:192.65,regX:117.3,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:269.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-55.6328,x:148.85,y:215.1,regX:20.7,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-54.7392,x:117.75,y:148.95,regX:-30.3,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90.1,skewX:-41.129,skewY:-40.9361,x:58.75,y:153.5,regX:-31.7,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.3,scaleX:0.6277,rotation:-88.479,x:82.45,y:159.4,regX:117.3,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:-45.178,x:154.55,y:195.55,regX:20.7,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-54.7392,x:123.75,y:122.95,regX:-30.3,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:90.1,skewX:-30.6766,skewY:-30.4842,x:77.25,y:118.6,regX:-31.6,scaleX:0.3371,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:25.4,scaleX:0.6277,rotation:-70.2846,x:95.7,y:146.3,regX:117.2,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-32.7008,x:160.4,y:197.2,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-52.4568,x:145.95,y:119.65,regX:-30.4,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:53.9,skewX:-33.199,skewY:-33.0052,x:101.45,y:92.5,regX:-19.8,scaleX:0.337,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:20.4,scaleX:0.6277,rotation:-43.7964,x:91.3,y:144.65,regX:89,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:-21.2127,x:164.5,y:197.3,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-40.9681,x:165.8,y:118.5,regX:-30.4,regY:-81,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:53.8,skewX:-21.7108,skewY:-21.5124,x:127.65,y:82.95,regX:-19.6,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:20.5,scaleX:0.6277,rotation:-34.5655,x:105.4,y:133.4,regX:89,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.6,rotation:-11.9816,x:169.2,y:197.1,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-46.7356,x:214.1,y:128.55,regX:-4.4,regY:-39,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:53.8,skewX:-12.4795,skewY:-12.2821,x:151.1,y:78.3,regX:-19.7,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:20.4,scaleX:0.6278,rotation:-25.3198,x:121.05,y:123.85,regX:89,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:-2.7389,x:173.8,y:197,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-37.4939,x:229.1,y:136.55,regX:-4.4,regY:-39,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:53.9,skewX:-3.2366,skewY:-3.0388,x:175,y:76.85,regX:-19.7,scaleX:0.3371,scaleY:0.3368}}]},2).to({state:[{t:this.ikNode_32,p:{x:219.3,scaleX:0.52,scaleY:0.5208,skewX:-55.1515,skewY:-55.2751,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.519,rotation:-0.213,skewX:0,skewY:0,x:118.9,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6277,rotation:-45.0284,x:145.05,y:123.9,regX:104.8,scaleY:0.6318,skewX:0,skewY:0}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5464,scaleY:0.5494,skewX:2.5055,skewY:2.3542,regX:-45.9,x:178.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:-2.7389,x:173.8,y:197,regX:20.8,scaleX:0.6022,scaleY:0.6045,skewX:0,skewY:0}},{t:this.ikNode_28,p:{rotation:-22.4938,x:207.15,y:136.6,regX:-30.1,regY:-58.6,scaleX:0.6781,scaleY:0.6804,skewX:0,skewY:0}},{t:this.ikNode_29,p:{regY:53.9,skewX:-3.2366,skewY:-3.0388,x:175,y:76.85,regX:-19.7,scaleX:0.3371,scaleY:0.3368}}]},3).to({state:[{t:this.ikNode_32,p:{x:125.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8421,skewY:-123.441,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:220.85,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:27.8,scaleX:0.6131,rotation:0,x:196.05,y:123.9,regX:104.7,scaleY:0.6171,skewX:43.6454,skewY:-133.5721}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5207,scaleY:0.5494,skewX:-2.3894,skewY:177.5293,regX:-45.9,x:163.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:136.85,y:136.55,regX:-30.1,regY:-58.7,scaleX:0.6509,scaleY:0.6758,skewX:21.5328,skewY:-156.5444}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:125.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8421,skewY:-123.441,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:220.85,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:196,y:137.85,regX:104.7,scaleY:0.617,skewX:58.6428,skewY:-118.5704}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5207,scaleY:0.5494,skewX:-2.3894,skewY:177.5293,regX:-45.9,x:163.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:137.85,y:136.6,regX:-30.1,regY:-58.6,scaleX:0.6509,scaleY:0.6758,skewX:6.5355,skewY:-171.5447}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:125.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8421,skewY:-123.441,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:220.85,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:189,y:137.85,regX:104.7,scaleY:0.6171,skewX:67.3716,skewY:-109.8424}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5207,scaleY:0.5494,skewX:-2.3894,skewY:177.5293,regX:-45.9,x:163.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:145.9,y:136.6,regX:-30.2,regY:-58.6,scaleX:0.6509,scaleY:0.6758,skewX:-8.464,skewY:173.4551}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:174.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8418,skewY:-153.4395,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:220.85,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:189,y:137.85,regX:104.7,scaleY:0.6171,skewX:67.3716,skewY:-109.8424}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5207,scaleY:0.5494,skewX:-2.3894,skewY:177.5293,regX:-45.9,x:174.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:145.9,y:136.6,regX:-30.2,regY:-58.6,scaleX:0.6509,scaleY:0.6758,skewX:-8.464,skewY:173.4551}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:210.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8418,skewY:-153.4395,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:220.85,regY:25.9,scaleY:0.5212,y:462.7}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:189,y:137.85,regX:104.7,scaleY:0.6171,skewX:67.3716,skewY:-109.8424}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5207,scaleY:0.5494,skewX:-2.3894,skewY:177.5293,regX:-45.9,x:174.85,regY:-107.6}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:161.9,y:136.55,regX:-30.1,regY:-58.7,scaleX:0.6509,scaleY:0.6758,skewX:-53.4613,skewY:128.4559}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:238.25,scaleX:0.5121,scaleY:0.5044,skewX:-6.158,skewY:176.5598,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:30.2009,skewY:-149.7777,x:165.85,regY:26.1,scaleY:0.5213,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:169.9,y:136.5,regX:-30.1,regY:-58.7,scaleX:0.6509,scaleY:0.6758,skewX:-74.4475,skewY:107.472}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:215.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8418,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.1998,skewY:-164.7784,x:181.9,regY:26.1,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.85,y:135.55,regX:-30.1,regY:-58.7,scaleX:0.6509,scaleY:0.6758,skewX:-104.4454,skewY:77.4729}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:152.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8406,skewY:-138.4425,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:201.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.9,y:135.6,regX:-29.9,regY:-58.7,scaleX:0.6509,scaleY:0.6758,skewX:-134.4447,skewY:47.4741}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:111.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8421,skewY:-123.442,y:450.8}},{t:this.ikNode_31,p:{regX:-6.6,scaleX:0.4945,rotation:0,skewX:-14.7966,skewY:165.2253,x:217.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.85,y:135.5,regX:-29.9,regY:-58.6,scaleX:0.6508,scaleY:0.6758,skewX:-164.4459,skewY:17.4749}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:144.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8417,skewY:-138.4425,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:199.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5493,scaleY:0.5494,skewX:-2.3894,skewY:177.529,regX:-46,x:183.85,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.5,regX:-29.9,regY:-58.7,scaleX:0.6508,scaleY:0.6758,skewX:165.5559,skewY:-12.5224}}]},2).to({state:[{t:this.ikNode_32,p:{x:173.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8449,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.203,skewY:-164.7784,x:151.85,regY:26.2,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5291,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.6,regX:-29.8,regY:-58.7,scaleX:0.6508,scaleY:0.6758,skewX:-164.4456,skewY:17.4749}}]},2).to({state:[{t:this.ikNode_32,p:{x:173.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8449,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.203,skewY:-164.7784,x:151.85,regY:26.2,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5291,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.75,y:135.65,regX:-29.8,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:-179.4437,skewY:2.4765}}]},2).to({state:[{t:this.ikNode_32,p:{x:138.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8444,skewY:-138.4402,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4944,rotation:0,skewX:-14.7962,skewY:165.2244,x:209.8,regY:26.2,scaleY:0.5213,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.85,scaleX:0.5494,scaleY:0.5494,skewX:-2.3894,skewY:177.5295,regX:-46,x:183.85,regY:-107.8}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:-164.4456,skewY:17.4749}}]},2).to({state:[{t:this.ikNode_32,p:{x:107.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8432,skewY:-123.4424,y:443.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:-29.7967,skewY:150.2244,x:239.8,regY:26.3,scaleY:0.5212,y:457.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5637,scaleY:0.5494,skewX:-2.3894,skewY:177.5301,regX:-46,x:183.85,regY:-107.8}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:165.5559,skewY:-12.523}}]},2).to({state:[{t:this.ikNode_32,p:{x:142.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8444,skewY:-138.4415,y:443.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4944,rotation:0,skewX:-14.7962,skewY:165.2244,x:218.8,regY:26.4,scaleY:0.5213,y:457.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.8,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5305,regX:-46.1,x:183.9,regY:-107.9}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.9,scaleX:0.6508,scaleY:0.6758,skewX:-164.4449,skewY:17.4753}}]},2).to({state:[{t:this.ikNode_32,p:{x:152.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8406,skewY:-138.4425,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:201.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.9,y:135.6,regX:-29.9,regY:-58.7,scaleX:0.6509,scaleY:0.6758,skewX:-134.4447,skewY:47.4741}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},1).to({state:[{t:this.ikNode_32,p:{x:111.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8421,skewY:-123.442,y:450.8}},{t:this.ikNode_31,p:{regX:-6.6,scaleX:0.4945,rotation:0,skewX:-14.7966,skewY:165.2253,x:217.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.85,y:135.5,regX:-29.9,regY:-58.6,scaleX:0.6508,scaleY:0.6758,skewX:-164.4459,skewY:17.4749}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:144.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8417,skewY:-138.4425,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:199.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5493,scaleY:0.5494,skewX:-2.3894,skewY:177.529,regX:-46,x:183.85,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.5,regX:-29.9,regY:-58.7,scaleX:0.6508,scaleY:0.6758,skewX:165.5559,skewY:-12.5224}}]},2).to({state:[{t:this.ikNode_32,p:{x:173.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8449,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.203,skewY:-164.7784,x:151.85,regY:26.2,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5291,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.6,regX:-29.8,regY:-58.7,scaleX:0.6508,scaleY:0.6758,skewX:-164.4456,skewY:17.4749}}]},2).to({state:[{t:this.ikNode_32,p:{x:173.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8449,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.203,skewY:-164.7784,x:151.85,regY:26.2,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5291,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.75,y:135.65,regX:-29.8,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:-179.4437,skewY:2.4765}}]},2).to({state:[{t:this.ikNode_32,p:{x:138.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8444,skewY:-138.4402,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4944,rotation:0,skewX:-14.7962,skewY:165.2244,x:209.8,regY:26.2,scaleY:0.5213,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.85,scaleX:0.5494,scaleY:0.5494,skewX:-2.3894,skewY:177.5295,regX:-46,x:183.85,regY:-107.8}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:-164.4456,skewY:17.4749}}]},2).to({state:[{t:this.ikNode_32,p:{x:107.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8432,skewY:-123.4424,y:443.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:-29.7967,skewY:150.2244,x:239.8,regY:26.3,scaleY:0.5212,y:457.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5637,scaleY:0.5494,skewX:-2.3894,skewY:177.5301,regX:-46,x:183.85,regY:-107.8}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:165.5559,skewY:-12.523}}]},2).to({state:[{t:this.ikNode_32,p:{x:142.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8444,skewY:-138.4415,y:443.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4944,rotation:0,skewX:-14.7962,skewY:165.2244,x:218.8,regY:26.4,scaleY:0.5213,y:457.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.8,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5305,regX:-46.1,x:183.9,regY:-107.9}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.9,scaleX:0.6508,scaleY:0.6758,skewX:-164.4449,skewY:17.4753}}]},2).to({state:[{t:this.ikNode_32,p:{x:152.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8406,skewY:-138.4425,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:201.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.9,y:135.6,regX:-29.9,regY:-58.7,scaleX:0.6509,scaleY:0.6758,skewX:-134.4447,skewY:47.4741}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},1).to({state:[{t:this.ikNode_32,p:{x:111.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8421,skewY:-123.442,y:450.8}},{t:this.ikNode_31,p:{regX:-6.6,scaleX:0.4945,rotation:0,skewX:-14.7966,skewY:165.2253,x:217.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.85,y:135.5,regX:-29.9,regY:-58.6,scaleX:0.6508,scaleY:0.6758,skewX:-164.4459,skewY:17.4749}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:144.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8417,skewY:-138.4425,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:199.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5493,scaleY:0.5494,skewX:-2.3894,skewY:177.529,regX:-46,x:183.85,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.5,regX:-29.9,regY:-58.7,scaleX:0.6508,scaleY:0.6758,skewX:165.5559,skewY:-12.5224}}]},2).to({state:[{t:this.ikNode_32,p:{x:173.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8449,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.203,skewY:-164.7784,x:151.85,regY:26.2,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5291,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.6,regX:-29.8,regY:-58.7,scaleX:0.6508,scaleY:0.6758,skewX:-164.4456,skewY:17.4749}}]},2).to({state:[{t:this.ikNode_32,p:{x:173.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8449,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.203,skewY:-164.7784,x:151.85,regY:26.2,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5291,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.75,y:135.65,regX:-29.8,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:-179.4437,skewY:2.4765}}]},2).to({state:[{t:this.ikNode_32,p:{x:138.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8444,skewY:-138.4402,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4944,rotation:0,skewX:-14.7962,skewY:165.2244,x:209.8,regY:26.2,scaleY:0.5213,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.85,scaleX:0.5494,scaleY:0.5494,skewX:-2.3894,skewY:177.5295,regX:-46,x:183.85,regY:-107.8}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:-164.4456,skewY:17.4749}}]},2).to({state:[{t:this.ikNode_32,p:{x:107.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8432,skewY:-123.4424,y:443.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:-29.7967,skewY:150.2244,x:239.8,regY:26.3,scaleY:0.5212,y:457.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5637,scaleY:0.5494,skewX:-2.3894,skewY:177.5301,regX:-46,x:183.85,regY:-107.8}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:165.5559,skewY:-12.523}}]},2).to({state:[{t:this.ikNode_32,p:{x:142.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8444,skewY:-138.4415,y:443.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4944,rotation:0,skewX:-14.7962,skewY:165.2244,x:218.8,regY:26.4,scaleY:0.5213,y:457.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.8,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5305,regX:-46.1,x:183.9,regY:-107.9}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.9,scaleX:0.6508,scaleY:0.6758,skewX:-164.4449,skewY:17.4753}}]},2).to({state:[{t:this.ikNode_32,p:{x:152.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8406,skewY:-138.4425,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:201.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.9,y:135.6,regX:-29.9,regY:-58.7,scaleX:0.6509,scaleY:0.6758,skewX:-134.4447,skewY:47.4741}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},1).to({state:[{t:this.ikNode_32,p:{x:111.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8421,skewY:-123.442,y:450.8}},{t:this.ikNode_31,p:{regX:-6.6,scaleX:0.4945,rotation:0,skewX:-14.7966,skewY:165.2253,x:217.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.85,y:135.5,regX:-29.9,regY:-58.6,scaleX:0.6508,scaleY:0.6758,skewX:-164.4459,skewY:17.4749}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:144.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8417,skewY:-138.4425,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:199.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5493,scaleY:0.5494,skewX:-2.3894,skewY:177.529,regX:-46,x:183.85,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.5,regX:-29.9,regY:-58.7,scaleX:0.6508,scaleY:0.6758,skewX:165.5559,skewY:-12.5224}}]},2).to({state:[{t:this.ikNode_32,p:{x:173.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8449,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.203,skewY:-164.7784,x:151.85,regY:26.2,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5291,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.6,regX:-29.8,regY:-58.7,scaleX:0.6508,scaleY:0.6758,skewX:-164.4456,skewY:17.4749}}]},2).to({state:[{t:this.ikNode_32,p:{x:173.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8449,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.203,skewY:-164.7784,x:151.85,regY:26.2,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5291,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.75,y:135.65,regX:-29.8,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:-179.4437,skewY:2.4765}}]},2).to({state:[{t:this.ikNode_32,p:{x:138.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8444,skewY:-138.4402,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4944,rotation:0,skewX:-14.7962,skewY:165.2244,x:209.8,regY:26.2,scaleY:0.5213,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.85,scaleX:0.5494,scaleY:0.5494,skewX:-2.3894,skewY:177.5295,regX:-46,x:183.85,regY:-107.8}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:-164.4456,skewY:17.4749}}]},2).to({state:[{t:this.ikNode_32,p:{x:107.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8432,skewY:-123.4424,y:443.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:-29.7967,skewY:150.2244,x:239.8,regY:26.3,scaleY:0.5212,y:457.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5637,scaleY:0.5494,skewX:-2.3894,skewY:177.5301,regX:-46,x:183.85,regY:-107.8}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:165.5559,skewY:-12.523}}]},2).to({state:[{t:this.ikNode_32,p:{x:142.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8444,skewY:-138.4415,y:443.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4944,rotation:0,skewX:-14.7962,skewY:165.2244,x:218.8,regY:26.4,scaleY:0.5213,y:457.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.8,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5305,regX:-46.1,x:183.9,regY:-107.9}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.9,scaleX:0.6508,scaleY:0.6758,skewX:-164.4449,skewY:17.4753}}]},2).to({state:[{t:this.ikNode_32,p:{x:152.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8406,skewY:-138.4425,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:201.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.9,y:135.6,regX:-29.9,regY:-58.7,scaleX:0.6509,scaleY:0.6758,skewX:-134.4447,skewY:47.4741}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},1).to({state:[{t:this.ikNode_32,p:{x:111.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8421,skewY:-123.442,y:450.8}},{t:this.ikNode_31,p:{regX:-6.6,scaleX:0.4945,rotation:0,skewX:-14.7966,skewY:165.2253,x:217.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5707,scaleY:0.5494,skewX:-2.3894,skewY:177.5296,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_28,p:{rotation:0,x:171.85,y:135.5,regX:-29.9,regY:-58.6,scaleX:0.6508,scaleY:0.6758,skewX:-164.4459,skewY:17.4749}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}}]},2).to({state:[{t:this.ikNode_32,p:{x:144.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8417,skewY:-138.4425,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:0.2029,skewY:-179.7772,x:199.85,regY:26.2,scaleY:0.5212,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5493,scaleY:0.5494,skewX:-2.3894,skewY:177.529,regX:-46,x:183.85,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.5,regX:-29.9,regY:-58.7,scaleX:0.6508,scaleY:0.6758,skewX:165.5559,skewY:-12.5224}}]},2).to({state:[{t:this.ikNode_32,p:{x:173.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8449,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.203,skewY:-164.7784,x:151.85,regY:26.2,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5291,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:53.9,skewX:3.0836,skewY:-176.8111,x:167.4,y:76.85,regX:-19.6,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.6,regX:-29.8,regY:-58.7,scaleX:0.6508,scaleY:0.6758,skewX:-164.4456,skewY:17.4749}}]},2).to({state:[{t:this.ikNode_32,p:{x:173.25,scaleX:0.5121,scaleY:0.5044,skewX:23.8449,skewY:-153.4411,y:450.8}},{t:this.ikNode_31,p:{regX:-6.8,scaleX:0.4945,rotation:0,skewX:15.203,skewY:-164.7784,x:151.85,regY:26.2,scaleY:0.5212,y:462.8}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.95,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5291,regX:-45.9,x:183.8,regY:-107.7}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.75,y:135.65,regX:-29.8,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:-179.4437,skewY:2.4765}}]},2).to({state:[{t:this.ikNode_32,p:{x:138.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8444,skewY:-138.4402,y:450.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4944,rotation:0,skewX:-14.7962,skewY:165.2244,x:209.8,regY:26.2,scaleY:0.5213,y:462.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.85,scaleX:0.5494,scaleY:0.5494,skewX:-2.3894,skewY:177.5295,regX:-46,x:183.85,regY:-107.8}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:-164.4456,skewY:17.4749}}]},2).to({state:[{t:this.ikNode_32,p:{x:107.25,scaleX:0.5121,scaleY:0.5044,skewX:53.8432,skewY:-123.4424,y:443.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4945,rotation:0,skewX:-29.7967,skewY:150.2244,x:239.8,regY:26.3,scaleY:0.5212,y:457.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.9,scaleX:0.5637,scaleY:0.5494,skewX:-2.3894,skewY:177.5301,regX:-46,x:183.85,regY:-107.8}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.8,scaleX:0.6508,scaleY:0.6758,skewX:165.5559,skewY:-12.523}}]},2).to({state:[{t:this.ikNode_32,p:{x:142.25,scaleX:0.5121,scaleY:0.5044,skewX:38.8444,skewY:-138.4415,y:443.8}},{t:this.ikNode_31,p:{regX:-6.7,scaleX:0.4944,rotation:0,skewX:-14.7962,skewY:165.2244,x:218.8,regY:26.4,scaleY:0.5213,y:457.75}},{t:this.ikNode_27,p:{regY:27.9,scaleX:0.6131,rotation:0,x:178.1,y:137.9,regX:104.6,scaleY:0.6171,skewX:82.3702,skewY:-94.8425}},{t:this.ikNode_30,p:{y:259.8,scaleX:0.5422,scaleY:0.5494,skewX:-2.3894,skewY:177.5305,regX:-46.1,x:183.9,regY:-107.9}},{t:this.ikNode_26,p:{regY:22.5,rotation:0,x:168.65,y:197,regX:20.8,scaleX:0.5739,scaleY:0.6044,skewX:2.6089,skewY:-177.1423}},{t:this.ikNode_29,p:{regY:83.6,skewX:-11.9134,skewY:168.1877,x:167.35,y:85.85,regX:-21.1,scaleX:0.3212,scaleY:0.3367}},{t:this.ikNode_28,p:{rotation:0,x:171.8,y:135.65,regX:-29.7,regY:-58.9,scaleX:0.6508,scaleY:0.6758,skewX:-164.4449,skewY:17.4753}}]},2).wait(1));

	// Layer_1
	this.ikNode_33 = new lib.cape_smallerMC();
	this.ikNode_33.name = "ikNode_33";
	this.ikNode_33.setTransform(211.05,149.45,0.8526,0.8542,-20.4648,0,0,-67.2,-84.6);
	this.ikNode_33._off = true;

	this.timeline.addTween(cjs.Tween.get(this.ikNode_33).wait(60).to({_off:false},0).wait(2).to({x:209.05},0).wait(2).to({x:188.05},0).wait(2).to({x:179.05},0).wait(2).to({x:156.05},0).wait(2).to({x:122.05,y:180.45},0).wait(2).to({y:199.45},0).wait(2).to({y:214.45},0).wait(2).to({y:222.45},0).wait(2).to({y:248.45},0).wait(2).to({y:277.45},0).wait(4).to({y:281.45},0).wait(2).to({y:283.45},0).wait(48).to({y:281.45},0).wait(2).to({y:277.45},0).wait(4).to({y:248.45},0).wait(2).to({y:222.45},0).wait(2).to({y:214.45},0).wait(2).to({y:199.45},0).wait(2).to({y:180.45},0).wait(2).to({x:156.05,y:149.45},0).wait(2).to({x:179.05},0).wait(2).to({x:188.05},0).wait(2).to({x:209.05},0).wait(2).to({x:211.05},0).wait(5).to({regY:-84.5,scaleX:0.8491,scaleY:0.8532,rotation:0,skewX:-5.3266,skewY:174.6845,x:147.05,y:149.5},0).wait(14).to({scaleX:0.7016,skewY:174.6842,y:149.55},0).wait(6).to({regX:-67.1,scaleX:0.7356,skewY:174.6844,x:147},0).wait(69));

	// Layer_1
	this.ikNode_13 = new lib.head_smallerMC();
	this.ikNode_13.name = "ikNode_13";
	this.ikNode_13.setTransform(155.7,90.5,0.3373,0.3369,0,-5.8467,-5.7302,5.5,89.5);

	this.ikNode_12 = new lib.leftArm_smallerMC();
	this.ikNode_12.name = "ikNode_12";
	this.ikNode_12.setTransform(178.3,121.3,0.5837,0.585,-32.871,0,0,-33,-93.5);

	this.ikNode_10 = new lib.upperBody_smallerMC();
	this.ikNode_10.name = "ikNode_10";
	this.ikNode_10.setTransform(151.5,108.5,0.6043,0.6059,-0.0231,0,0,37,-125.5);

	this.ikNode_14 = new lib.skirt_smallerMC();
	this.ikNode_14.name = "ikNode_14";
	this.ikNode_14.setTransform(150.9,208.65,0.5481,0.55,0,4.5335,4.4739,-38.9,-200.8);

	this.ikNode_15 = new lib.leftFoot_smallerMC();
	this.ikNode_15.name = "ikNode_15";
	this.ikNode_15.setTransform(98.8,417.15,0.5197,0.5214,1.9353,0,0,-0.6,-56.2);

	this.ikNode_16 = new lib.leftFoot_smallerMC();
	this.ikNode_16.name = "ikNode_16";
	this.ikNode_16.setTransform(169.3,430.95,0.5202,0.521,0,-50.3057,-50.41,16.3,-48);

	this.ikNode_17 = new lib.cape_smallerMC();
	this.ikNode_17.name = "ikNode_17";
	this.ikNode_17.setTransform(176.4,149.3,0.8528,0.8542,-10.2007,0,0,-67.3,-84.6);

	this.ikNode_11 = new lib.rightArm_smallerMC();
	this.ikNode_11.name = "ikNode_11";
	this.ikNode_11.setTransform(121.25,109.05,0.6301,0.6325,-34.4695,0,0,83.8,2.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6325,rotation:-34.4695,x:121.25,y:109.05,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8528,rotation:-10.2007,x:176.4,y:149.3,regY:-84.6,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.521,skewX:-50.3057,skewY:-50.41,x:169.3,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.6,rotation:1.9353,y:417.15,x:98.8}},{t:this.ikNode_14,p:{regX:-38.9,skewX:4.5335,skewY:4.4739,x:150.9,y:208.65,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0231,x:151.5,y:108.5}},{t:this.ikNode_12,p:{rotation:-32.871,x:178.3,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3373,scaleY:0.3369,skewX:-5.8467,skewY:-5.7302,x:155.7,y:90.5,regX:5.5,regY:89.5}}]}).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-29.087,x:121.3,y:109.05,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.1994,x:176.35,y:149.25,regY:-84.6,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9338,y:417.1,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.6,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:-29.8774,x:178.25,y:121.35,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.5,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-23.7052,x:121.3,y:109,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.1994,x:176.4,y:149.25,regY:-84.6,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9338,y:417.1,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.6,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:-26.8792,x:178.2,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.5,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-18.3217,x:121.25,y:109.1,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.1994,x:176.4,y:149.25,regY:-84.6,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9338,y:417.1,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.6,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:-23.8825,x:178.25,y:121.4,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.5,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-12.9412,x:121.25,y:109.05,regX:83.7,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.1994,x:176.4,y:149.25,regY:-84.6,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9338,y:417.1,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.6,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:-20.8858,x:178.25,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.5,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-7.5561,x:121.2,y:109.05,regX:83.7,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.1994,x:176.4,y:149.25,regY:-84.6,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9338,y:417.1,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.6,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:-17.8909,x:178.25,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.5,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6325,rotation:-2.175,x:121.25,y:109.1,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.4,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9338,y:417.1,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:-14.8946,x:178.3,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.5,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6325,rotation:3.2046,x:121.25,y:109.1,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.45,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9338,y:417.1,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:-11.897,x:178.25,y:121.35,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.5,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6325,rotation:8.5848,x:121.25,y:108.95,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.45,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9338,y:417.1,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:-8.9016,x:178.3,y:121.35,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.5,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:13.9689,x:121.25,y:109.1,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.45,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9338,y:417.1,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:-5.905,x:178.3,y:121.4,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.5,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:19.3486,x:121.25,y:109,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.45,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9338,y:417.1,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:-2.9067,x:178.3,y:121.45,regY:-93.4,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:24.7317,x:121.25,y:108.95,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.45,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9321,y:417.05,x:98.85}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:0.0852,x:178.35,y:121.25,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:30.1147,x:121.25,y:109,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9321,y:417.05,x:98.85}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:3.0818,x:178.25,y:121.35,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:35.497,x:121.3,y:109.05,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9321,y:417.05,x:98.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:6.0763,x:178.25,y:121.25,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:40.8811,x:121.3,y:109,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:9.0741,x:178.35,y:121.3,regY:-93.5,regX:-32.9,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:37.4928,x:121.25,y:108.95,regX:83.7,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:11.8449,x:178.3,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:34.1053,x:121.25,y:108.9,regX:83.7,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:14.6166,x:178.3,y:121.35,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:30.7177,x:121.15,y:109,regX:83.7,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:17.389,x:178.3,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:27.3323,x:121.2,y:109,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:20.1598,x:178.25,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:23.9441,x:121.3,y:108.9,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:22.9333,x:178.3,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:20.5586,x:121.3,y:109.05,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:25.7028,x:178.25,y:121.25,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:17.171,x:121.2,y:108.9,regX:83.7,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:28.4744,x:178.3,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:13.7838,x:121.3,y:108.95,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:31.2465,x:178.25,y:121.3,regY:-93.5,regX:-33,scaleY:0.5849}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:10.3987,x:121.25,y:109,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:34.018,x:178.3,y:121.25,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:7.0139,x:121.25,y:109,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:36.7889,x:178.35,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:3.627,x:121.15,y:108.95,regX:83.7,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.5,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:39.5608,x:178.25,y:121.35,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6325,rotation:0.2378,x:121.25,y:109,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.45,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:42.3337,x:178.25,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-3.141,x:121.2,y:109,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.45,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9304,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.5,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:45.1057,x:178.25,y:121.3,regY:-93.5,regX:-33,scaleY:0.5849}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-6.5321,x:121.15,y:109,regX:83.7,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.45,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9287,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:47.8768,x:178.25,y:121.25,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-9.9182,x:121.3,y:108.95,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.45,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3051,skewY:-50.4083,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9287,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:50.6493,x:178.3,y:121.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-13.3046,x:121.3,y:108.95,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.45,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3062,skewY:-50.4094,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9287,y:417.05,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:53.4195,x:178.2,y:121.35,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-16.6896,x:121.25,y:108.95,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.4,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3062,skewY:-50.4094,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9287,y:417,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:56.1922,x:178.3,y:121.3,regY:-93.5,regX:-33,scaleY:0.5849}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7258,x:155.65,y:90.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-20.0753,x:121.15,y:109.05,regX:83.7,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.4,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3062,skewY:-50.4107,x:169.2,y:430.95,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9287,y:417,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:58.9629,x:178.2,y:121.35,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7232,x:155.65,y:90.4,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-23.4651,x:121.3,y:108.95,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.4,y:149.3,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3062,skewY:-50.4107,x:169.2,y:430.9,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9287,y:417,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:61.735,x:178.25,y:121.35,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7232,x:155.65,y:90.4,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-26.8507,x:121.2,y:108.95,regX:83.7,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.2006,x:176.4,y:149.25,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.3062,skewY:-50.4107,x:169.2,y:430.9,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.9287,y:417,x:98.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.5322,skewY:4.4727,x:150.85,y:208.55,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.45,y:108.45}},{t:this.ikNode_12,p:{rotation:64.5065,x:178.25,y:121.25,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-5.8449,skewY:-5.7232,x:155.65,y:90.4,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-26.774,x:121.8,y:108.6,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-10.7123,x:177.15,y:148.85,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-50.5507,skewY:-50.653,x:171.4,y:430.75,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.8231,y:417.15,x:100.45}},{t:this.ikNode_14,p:{regX:-38.9,skewX:4.4271,skewY:4.3671,x:152,y:208.6,scaleY:0.5499,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:151.95,y:108}},{t:this.ikNode_12,p:{rotation:59.6906,x:178.85,y:120.9,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-6.4557,skewY:-6.3385,x:156.3,y:89.95,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-26.6986,x:122.4,y:108.1,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-11.2266,x:177.7,y:148.35,regY:-84.6,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-50.7927,skewY:-50.8968,x:173.6,y:430.8,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.7174,y:417.35,x:102.05}},{t:this.ikNode_14,p:{regX:-38.9,skewX:4.3219,skewY:4.2616,x:153.3,y:208.65,scaleY:0.5499,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:152.55,y:107.6}},{t:this.ikNode_12,p:{rotation:54.8743,x:179.4,y:120.45,regY:-93.5,regX:-33,scaleY:0.5849}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-7.07,skewY:-6.9543,x:156.8,y:89.6,regX:5.4,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-26.6207,x:122.95,y:107.8,regX:83.7,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-11.7391,x:178.25,y:148.1,regY:-84.5,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-51.0372,skewY:-51.1418,x:175.85,y:430.8,regY:-48}},{t:this.ikNode_15,p:{regX:-0.6,rotation:1.6117,y:417.5,x:103.7}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.2151,skewY:4.156,x:154.7,y:208.7,scaleY:0.5499,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:153.15,y:107.2}},{t:this.ikNode_12,p:{rotation:50.0572,x:180,y:120.1,regY:-93.5,regX:-32.9,scaleY:0.5849}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-7.6849,skewY:-7.5684,x:157.5,y:89.15,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-26.5453,x:123.6,y:107.3,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-12.252,x:178.85,y:147.65,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-51.2796,skewY:-51.3832,x:178.15,y:430.8,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.506,y:417.65,x:105.35}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.1099,skewY:4.0488,x:156,y:208.8,scaleY:0.5499,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:153.75,y:106.75}},{t:this.ikNode_12,p:{rotation:45.2431,x:180.6,y:119.65,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-8.3037,skewY:-8.1836,x:158,y:88.75,regX:5.4,regY:89.6}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-26.468,x:124.2,y:106.95,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-12.7668,x:179.4,y:147.2,regY:-84.5,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-51.5221,skewY:-51.6274,x:180.35,y:430.75,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.4002,y:417.9,x:107.1}},{t:this.ikNode_14,p:{regX:-38.8,skewX:4.003,skewY:3.9433,x:157.25,y:208.95,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:154.3,y:106.35}},{t:this.ikNode_12,p:{rotation:40.4254,x:181.2,y:119.15,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-8.9178,skewY:-8.7996,x:158.55,y:88.3,regX:5.4,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-26.392,x:124.8,y:106.45,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-13.2793,x:180,y:146.8,regY:-84.5,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-51.7669,skewY:-51.8701,x:182.55,y:430.75,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.2946,y:418,x:108.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:3.8962,skewY:3.8378,x:158.55,y:209.05,scaleY:0.55,regY:-200.7,scaleX:0.548}},{t:this.ikNode_10,p:{rotation:-0.0216,x:154.9,y:105.95}},{t:this.ikNode_12,p:{rotation:35.6093,x:181.75,y:118.85,regY:-93.5,regX:-33,scaleY:0.5849}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-9.5336,skewY:-9.4167,x:159.15,y:87.9,regX:5.4,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-26.3153,x:125.35,y:106.15,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-13.7922,x:180.6,y:146.4,regY:-84.5,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-52.0096,skewY:-52.1132,x:184.8,y:430.7,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.1889,y:418.15,x:110.4}},{t:this.ikNode_14,p:{regX:-38.8,skewX:3.791,skewY:3.7307,x:159.85,y:208.95,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:155.5,y:105.5}},{t:this.ikNode_12,p:{rotation:30.7938,x:182.3,y:118.35,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-10.1498,skewY:-10.0322,x:159.7,y:87.5,regX:5.4,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-26.2368,x:125.95,y:105.65,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-14.3061,x:181.15,y:146,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-52.2534,skewY:-52.3576,x:187.1,y:430.65,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:1.0833,y:418.3,x:112.15}},{t:this.ikNode_14,p:{regX:-38.8,skewX:3.6843,skewY:3.6236,x:161.2,y:209.05,scaleY:0.55,regY:-200.8,scaleX:0.548}},{t:this.ikNode_10,p:{rotation:-0.0216,x:156.05,y:105.1}},{t:this.ikNode_12,p:{rotation:25.9762,x:182.9,y:118,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-10.7673,skewY:-10.649,x:160.35,y:87,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-26.1613,x:126.55,y:105.3,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:0,x:181.7,y:145.65,regY:-84.5,scaleY:0.8541,skewX:-14.8195,skewY:-14.7691}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-52.4964,skewY:-52.601,x:189.2,y:430.6,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:0.9776,y:418.4,x:113.75}},{t:this.ikNode_14,p:{regX:-38.8,skewX:3.5792,skewY:3.518,x:162.45,y:209.15,scaleY:0.5499,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:156.65,y:104.7}},{t:this.ikNode_12,p:{rotation:21.1611,x:183.5,y:117.55,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-11.3807,skewY:-11.2642,x:160.9,y:86.6,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-26.0841,x:127.1,y:104.85,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-15.3322,x:182.3,y:145.2,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-52.7407,skewY:-52.843,x:191.45,y:430.5,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:0.872,y:418.55,x:115.45}},{t:this.ikNode_14,p:{regX:-38.8,skewX:3.4725,skewY:3.4126,x:163.65,y:209.2,scaleY:0.5499,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:157.25,y:104.25}},{t:this.ikNode_12,p:{rotation:16.3445,x:184,y:117.15,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-11.9981,skewY:-11.8778,x:161.45,y:86.25,regX:5.4,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-26.008,x:127.7,y:104.5,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-15.845,x:182.9,y:144.75,regY:-84.5,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-52.9814,skewY:-53.0881,x:193.75,y:430.45,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:0.7663,y:418.7,x:117.1}},{t:this.ikNode_14,p:{regX:-38.8,skewX:3.3658,skewY:3.3056,x:164.95,y:209.15,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:157.8,y:103.85}},{t:this.ikNode_12,p:{rotation:11.5274,x:184.65,y:116.7,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-12.6147,skewY:-12.4937,x:162.1,y:85.75,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.9326,x:128.25,y:104,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-16.3588,x:183.4,y:144.25,regY:-84.6,scaleY:0.8542,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-53.2271,skewY:-53.3318,x:195.95,y:430.3,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:0.6607,y:418.8,x:118.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:3.2607,skewY:3.1985,x:166.3,y:209.2,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:158.4,y:103.4}},{t:this.ikNode_12,p:{rotation:6.7125,x:185.2,y:116.3,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-13.2298,skewY:-13.11,x:162.65,y:85.4,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.8559,x:128.85,y:103.65,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-16.8717,x:184,y:143.9,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-53.4694,skewY:-53.5731,x:198.15,y:430.3,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:0.555,y:418.9,x:120.5}},{t:this.ikNode_14,p:{regX:-38.8,skewX:3.154,skewY:3.0946,x:167.55,y:209.25,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:159,y:103}},{t:this.ikNode_12,p:{rotation:1.8984,x:185.75,y:115.85,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-13.8442,skewY:-13.7263,x:163.3,y:84.9,regX:5.5,regY:89.4}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.7799,x:129.5,y:103.2,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-17.3849,x:184.6,y:143.5,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-53.7145,skewY:-53.8185,x:200.4,y:430.15,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:0.4494,y:419.05,x:122.15}},{t:this.ikNode_14,p:{regX:-38.9,skewX:3.049,skewY:2.9876,x:168.75,y:209.3,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:159.55,y:102.6}},{t:this.ikNode_12,p:{rotation:-2.9156,x:186.35,y:115.5,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-14.4593,skewY:-14.3431,x:163.85,y:84.55,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.702,x:130.05,y:102.85,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-17.8983,x:185.2,y:143.05,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-53.9545,skewY:-54.0616,x:202.7,y:430.05,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:0.3437,y:419.15,x:123.8}},{t:this.ikNode_14,p:{regX:-38.9,skewX:2.9423,skewY:2.8822,x:170.1,y:209.3,scaleY:0.5499,regY:-200.8,scaleX:0.548}},{t:this.ikNode_10,p:{rotation:-0.0216,x:160.15,y:102.15}},{t:this.ikNode_12,p:{rotation:-7.731,x:186.9,y:115.05,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-15.0744,skewY:-14.9568,x:164.45,y:84.1,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.6259,x:130.55,y:102.35,regX:83.7,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-18.411,x:185.75,y:142.65,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-54.1999,skewY:-54.3037,x:204.85,y:429.9,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:0.2381,y:419.25,x:125.5}},{t:this.ikNode_14,p:{regX:-38.9,skewX:2.8357,skewY:2.7752,x:171.35,y:209.3,scaleY:0.5499,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:160.75,y:101.75}},{t:this.ikNode_12,p:{rotation:-12.5484,x:187.5,y:114.6,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-15.6908,skewY:-15.5725,x:164.95,y:83.65,regX:5.4,regY:89.4}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.5499,x:131.1,y:102.05,regX:83.7,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-18.9253,x:186.35,y:142.25,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-54.4436,skewY:-54.5467,x:207,y:429.8,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:0.1325,y:419.35,x:127.15}},{t:this.ikNode_14,p:{regX:-38.9,skewX:2.7306,skewY:2.6698,x:172.6,y:209.35,scaleY:0.5499,regY:-200.8,scaleX:0.548}},{t:this.ikNode_10,p:{rotation:-0.0216,x:161.3,y:101.35}},{t:this.ikNode_12,p:{rotation:-17.3639,x:188.1,y:114.2,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-16.3069,skewY:-16.1897,x:165.55,y:83.3,regX:5.4,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-25.4732,x:131.7,y:101.55,regX:83.8,regY:2.1}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-19.4387,x:186.9,y:141.85,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.2,scaleY:0.5209,skewX:-54.6857,skewY:-54.7892,x:209.25,y:429.7,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:0.0285,y:419.45,x:128.8}},{t:this.ikNode_14,p:{regX:-38.8,skewX:2.624,skewY:2.5644,x:173.95,y:209.4,scaleY:0.5499,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:161.9,y:100.9}},{t:this.ikNode_12,p:{rotation:-22.1808,x:188.65,y:113.75,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-16.9237,skewY:-16.8058,x:166.2,y:82.85,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.6301,scaleY:0.6324,rotation:-25.3971,x:132.3,y:101.15,regX:83.7,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-19.9513,x:187.45,y:141.45,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-54.9315,skewY:-55.0354,x:211.55,y:429.6,regY:-48}},{t:this.ikNode_15,p:{regX:-0.5,rotation:-0.0738,y:419.55,x:130.5}},{t:this.ikNode_14,p:{regX:-38.8,skewX:2.519,skewY:2.4574,x:175.25,y:209.4,scaleY:0.5499,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:162.5,y:100.5}},{t:this.ikNode_12,p:{rotation:-26.9955,x:189.25,y:113.35,regY:-93.5,regX:-33,scaleY:0.5849}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-17.5411,skewY:-17.4216,x:166.8,y:82.45,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.3192,x:132.85,y:100.65,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-20.4645,x:188,y:141,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-55.1723,skewY:-55.2755,x:213.75,y:429.4,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:-0.1794,y:419.6,x:132.2}},{t:this.ikNode_14,p:{regX:-38.8,skewX:2.4107,skewY:2.3504,x:176.5,y:209.4,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:163.05,y:100.1}},{t:this.ikNode_12,p:{rotation:-31.8119,x:189.85,y:112.9,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-18.1567,skewY:-18.0365,x:167.35,y:82.05,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.3192,x:132.85,y:100.65,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-20.4645,x:188,y:141,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-55.1723,skewY:-55.2755,x:213.75,y:429.4,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:-0.1794,y:419.6,x:132.2}},{t:this.ikNode_14,p:{regX:-38.8,skewX:2.4107,skewY:2.3504,x:176.5,y:209.4,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:163.05,y:100.1}},{t:this.ikNode_12,p:{rotation:-31.8119,x:189.85,y:112.9,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-18.1567,skewY:-18.0365,x:167.35,y:82.05,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.3192,x:132.85,y:100.65,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-20.4645,x:188,y:141,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-55.1723,skewY:-55.2755,x:213.75,y:429.4,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:-0.1794,y:419.6,x:132.2}},{t:this.ikNode_14,p:{regX:-38.8,skewX:2.4107,skewY:2.3504,x:176.5,y:209.4,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:163.05,y:100.1}},{t:this.ikNode_12,p:{rotation:-31.8119,x:189.85,y:112.9,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-18.1567,skewY:-18.0365,x:167.35,y:82.05,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.3192,x:132.85,y:100.65,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-20.4645,x:188,y:141,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-55.1723,skewY:-55.2755,x:213.75,y:429.4,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:-0.1794,y:419.6,x:132.2}},{t:this.ikNode_14,p:{regX:-38.8,skewX:2.4107,skewY:2.3504,x:176.5,y:209.4,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:163.05,y:100.1}},{t:this.ikNode_12,p:{rotation:-31.8119,x:189.85,y:112.9,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-18.1567,skewY:-18.0365,x:167.35,y:82.05,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.3192,x:132.85,y:100.65,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-20.4645,x:188,y:141,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-55.1723,skewY:-55.2755,x:213.75,y:429.4,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:-0.1794,y:419.6,x:132.2}},{t:this.ikNode_14,p:{regX:-38.8,skewX:2.4107,skewY:2.3504,x:176.5,y:209.4,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:163.05,y:100.1}},{t:this.ikNode_12,p:{rotation:-31.8119,x:189.85,y:112.9,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-18.1567,skewY:-18.0365,x:167.35,y:82.05,regX:5.5,regY:89.5}}]},1).to({state:[{t:this.ikNode_11,p:{scaleX:0.63,scaleY:0.6324,rotation:-25.3192,x:132.85,y:100.65,regX:83.8,regY:2}},{t:this.ikNode_17,p:{scaleX:0.8527,rotation:-20.4645,x:188,y:141,regY:-84.5,scaleY:0.8541,skewX:0,skewY:0}},{t:this.ikNode_16,p:{regX:16.3,scaleY:0.5209,skewX:-55.1723,skewY:-55.2755,x:213.75,y:429.4,regY:-48.1}},{t:this.ikNode_15,p:{regX:-0.5,rotation:-0.1794,y:419.6,x:132.2}},{t:this.ikNode_14,p:{regX:-38.8,skewX:2.4107,skewY:2.3504,x:176.5,y:209.4,scaleY:0.55,regY:-200.8,scaleX:0.5481}},{t:this.ikNode_10,p:{rotation:-0.0216,x:163.05,y:100.1}},{t:this.ikNode_12,p:{rotation:-31.8119,x:189.85,y:112.9,regY:-93.5,regX:-33,scaleY:0.585}},{t:this.ikNode_13,p:{scaleX:0.3372,scaleY:0.3368,skewX:-18.1567,skewY:-18.0365,x:167.35,y:82.05,regX:5.5,regY:89.5}}]},1).to({state:[]},1).wait(192));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-47,-15.5,468.4,501.1);


// stage content:
(lib.AncestorSplit_31May2014_copyHTML5_HTML5_Canvas = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {tree:0,Start_nar1:79,nar1:139,wrong_nar1:878,continue_nar1:890,wrongbranch_nar1:2608};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,49,139,569,789,841,875,877,878,890,892,1094,1405,1876,2604,2608,2913];
	this.streamSoundSymbolsList[569] = [{id:"hmyrya0404",startFrame:569,endFrame:789,loop:1,offset:0}];
	this.streamSoundSymbolsList[789] = [{id:"hmyrya0404",startFrame:789,endFrame:841,loop:1,offset:9179}];
	this.streamSoundSymbolsList[841] = [{id:"hmyrya0404",startFrame:841,endFrame:875,loop:1,offset:11348}];
	this.streamSoundSymbolsList[892] = [{id:"instrumental_ukrainian",startFrame:892,endFrame:1405,loop:1,offset:0}];
	this.streamSoundSymbolsList[1094] = [{id:"instrumental_ukrainian",startFrame:1094,endFrame:2608,loop:1,offset:0}];
	this.streamSoundSymbolsList[1405] = [{id:"instrumental_ukrainian",startFrame:1405,endFrame:1876,loop:1,offset:0}];
	this.streamSoundSymbolsList[1876] = [{id:"_161316__husky70__echochimechime",startFrame:1876,endFrame:2610,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}
	this.frame_49 = function() {
		this.stop();
		
		this.nataljaBN.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("Start_nar1", "Scene 1");
		}
		
		
		this.kirilBN.addEventListener("click", fl_kirilClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_kirilClickToGoToAndPlayFromFrame()
		{
			window.open("AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 2.html", "_self");
		}
		
		this.aleksejBN.addEventListener("click", fl_aleksejClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_aleksejClickToGoToAndPlayFromFrame()
		{
			window.open("AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 3.html", "_self");
		}
		
		this.michailBN.addEventListener("click", fl_michailClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_michailClickToGoToAndPlayFromFrame()
		{
			window.open("AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 4.html", "_self");
		}
		
		this.viktorBN.addEventListener("click", fl_viktorClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_viktorClickToGoToAndPlayFromFrame()
		{
			window.open("AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 5.html", "_self");
		}
		
		this.nikolajBN.addEventListener("click", fl_nikolajClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_nikolajClickToGoToAndPlayFromFrame()
		{
			window.open("AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6.html", "_self");
		}
		
		this.veraBN.addEventListener("click", fl_veraClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_veraClickToGoToAndPlayFromFrame()
		{
			window.open("nar7_VeraAzbeleva_copyHTML5_HTML5 Canvas.html", "_self");
		}
		
		this.olgaBN.addEventListener("click", fl_olgaClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_olgaClickToGoToAndPlayFromFrame()
		{
			window.open("nar8_OlgaSchott_copyHTML5_HTML5 Canvas.html", "_self");
		}
		
		this.birutaBN.addEventListener("click", fl_birutaClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_birutaClickToGoToAndPlayFromFrame()
		{
			window.open("nar9_BirutaHansen_copyHTML5_HTML5 Canvas.html", "_self");
		}
		
		this.hansenBN.addEventListener("click", fl_hansenClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_hansenClickToGoToAndPlayFromFrame()
		{
			window.open("nar10_ErikIngrid_copyHTML5_HTML5 Canvas.html", "_self");
		}
		
		
		
		/*import flash.events.Event;
		import flash.display.Loader;
		import flash.net.URLRequest;
		
		nataljaBN.addEventListener(MouseEvent.MOUSE_UP, start_nar1);
		
		function start_nar1(e:Event):void {
			nataljaBN.removeEventListener(MouseEvent.MOUSE_UP, start_nar1);
			gotoAndPlay("Start_nar1","Scene 1");
		}
		
		kirilBN.addEventListener(MouseEvent.MOUSE_UP, start_nar2);
		
		function start_nar2(e:Event):void {
			kirilBN.removeEventListener(MouseEvent.MOUSE_UP, start_nar2);
			gotoAndPlay("nar2","Scene 2");
		}
		
		aleksejBN.addEventListener(MouseEvent.MOUSE_UP, start_nar3);
		
		function start_nar3(e:Event):void {
			aleksejBN.removeEventListener(MouseEvent.MOUSE_UP, start_nar3);
			gotoAndPlay("nar3","Scene 3");
		}
		
		michailBN.addEventListener(MouseEvent.MOUSE_UP, start_nar4);
		
		function start_nar4(e:Event):void {
			michailBN.removeEventListener(MouseEvent.MOUSE_UP, start_nar4);
			gotoAndPlay("nar4","Scene 4");
		}
		
		viktorBN.addEventListener(MouseEvent.MOUSE_UP, start_nar5);
		
		function start_nar5(e:Event):void {
			viktorBN.removeEventListener(MouseEvent.MOUSE_UP, start_nar5);
			gotoAndPlay("nar5","Scene 5");
		}
		
		nikolajBN.addEventListener(MouseEvent.MOUSE_UP, start_nar6);
		
		function start_nar6(e:Event):void {
			nikolajBN.removeEventListener(MouseEvent.MOUSE_UP, start_nar6);
			gotoAndPlay("nar6","Scene 6");
		}
		
		//loads separate nar7_VeraAzbeleva swf file
		
		var singleLoader:Loader = new Loader();
		veraBN.addEventListener(MouseEvent.MOUSE_UP, start_nar7);
		
		function start_nar7(e:Event):void {
			var request:URLRequest = new URLRequest("nar7_VeraAzbeleva.swf");
			singleLoader.contentLoaderInfo.addEventListener(Event.COMPLETE,onCompleteHandler);
			singleLoader.load(request);
		}
		
		function onCompleteHandler(loadEvent:Event) {
			addChild(loadEvent.currentTarget.content);
		}
		
		//loads separate nar8_OlgaSchott swf file
		
		var singleLoader_nar8:Loader = new Loader();
		olgaBN.addEventListener(MouseEvent.MOUSE_UP, start_nar8);
		
		function start_nar8(e:Event):void {
			var request:URLRequest = new URLRequest("nar8_OlgaSchott.swf");
			singleLoader_nar8.contentLoaderInfo.addEventListener(Event.COMPLETE,onCompleteHandler_nar8);
			singleLoader_nar8.load(request);
		}
		
		function onCompleteHandler_nar8(loadEvent:Event) {
			addChild(loadEvent.currentTarget.content);
		}
		
		//loads separate nar9_BirutaHansen swf file
		
		var singleLoader_nar9:Loader = new Loader();
		birutaBN.addEventListener(MouseEvent.MOUSE_UP, start_nar9);
		
		function start_nar9(e:Event):void {
			var request:URLRequest = new URLRequest("nar9_BirutaHansen.swf");
			singleLoader_nar9.contentLoaderInfo.addEventListener(Event.COMPLETE,onCompleteHandler_nar9);
			singleLoader_nar9.load(request);
		}
		
		function onCompleteHandler_nar9(loadEvent:Event) {
			addChild(loadEvent.currentTarget.content);
		}
		
		//loads separate nar10_ErikIngrid swf file
		
		var singleLoader_nar10:Loader = new Loader();
		hansenBN.addEventListener(MouseEvent.MOUSE_UP, start_nar10);
		
		function start_nar10(e:Event):void {
			var request:URLRequest = new URLRequest("nar10_ErikIngrid.swf");
			singleLoader_nar10.contentLoaderInfo.addEventListener(Event.COMPLETE,onCompleteHandler_nar10);
			singleLoader_nar10.load(request);
		}
		
		function onCompleteHandler_nar10(loadEvent:Event) {
			addChild(loadEvent.currentTarget.content);
		}
		
		//veraBN.addEventListener(MouseEvent.MOUSE_UP, start_nar7);
		
		//function start_nar7(e:Event):void {
			//veraBN.removeEventListener(MouseEvent.MOUSE_UP, start_nar7);
			//gotoAndPlay("nar7","Scene 7");
		//}
		
		//olgaBN.addEventListener(MouseEvent.MOUSE_UP, start_nar8);
		
		//function start_nar8(e:Event):void {
		//	olgaBN.removeEventListener(MouseEvent.MOUSE_UP, start_nar8);
		//	gotoAndPlay("nar8","Scene 8");
		//}*/
	}
	this.frame_139 = function() {
		playSound("nar1_pt1");
	}
	this.frame_569 = function() {
		var soundInstance = playSound("hmyrya0404",0);
		this.InsertIntoSoundStreamData(soundInstance,569,789,1);
		soundInstance.volume = 0.2;
	}
	this.frame_789 = function() {
		var soundInstance = playSound("hmyrya0404",0,9179);
		this.InsertIntoSoundStreamData(soundInstance,789,841,1,9179);
		soundInstance.volume = 0.0;
	}
	this.frame_841 = function() {
		var soundInstance = playSound("hmyrya0404",0,11348);
		this.InsertIntoSoundStreamData(soundInstance,841,875,1,11348);
		soundInstance.volume = 0;
	}
	this.frame_875 = function() {
		soundInstance.volume = 0;
	}
	this.frame_877 = function() {
		this.stop();
		
		this.button1.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar1");
		}
		
		
		this.button1_wrong.addEventListener("click", fl_WrongClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_WrongClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("wrongbranch_nar1");
		}
		
		
		/*import flash.events.Event;
		
		button1.addEventListener(MouseEvent.MOUSE_UP, continue_nar1);
		
		function continue_nar1(e:Event):void {
			button1.removeEventListener(MouseEvent.MOUSE_UP, continue_nar1);
			gotoAndPlay("continue_nar1");
		}
		
		button1_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar1);
		
		function wrong_nar1(e:Event):void {
			button1_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar1);
			gotoAndPlay("wrongbranch_nar1");
		}
		*/
	}
	this.frame_878 = function() {
		this.stop();
		
		this.button1.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar1");
		}
		
		/*import flash.events.Event;
		
		button1.addEventListener(MouseEvent.MOUSE_UP, continue_nar1a);
		
		function continue_nar1a(e:Event):void {
			button1.removeEventListener(MouseEvent.MOUSE_UP, continue_nar1);
			gotoAndPlay("continue_nar1");
		}
		
		button1_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar1a);
		
		function wrong_nar1a(e:Event):void {
			button1_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar1);
			gotoAndPlay("wrongbranch_nar1");
		}
		*/
	}
	this.frame_890 = function() {
		playSound("nar1_pt2");
	}
	this.frame_892 = function() {
		var soundInstance = playSound("instrumental_ukrainian",0);
		this.InsertIntoSoundStreamData(soundInstance,892,1405,1);
		soundInstance.volume = 0.2;
	}
	this.frame_1094 = function() {
		var soundInstance = playSound("instrumental_ukrainian",0);
		this.InsertIntoSoundStreamData(soundInstance,1094,2608,1);
		soundInstance.volume = 0.2;
	}
	this.frame_1405 = function() {
		var soundInstance = playSound("instrumental_ukrainian",0);
		this.InsertIntoSoundStreamData(soundInstance,1405,1876,1);
		soundInstance.volume = 0.2;
	}
	this.frame_1876 = function() {
		var soundInstance = playSound("_161316__husky70__echochimechime",0);
		this.InsertIntoSoundStreamData(soundInstance,1876,2610,1);
		soundInstance.volume = 0.2;
	}
	this.frame_2604 = function() {
		/*gotoAndPlay("tree","Scene 1");*/
		
		window.open("AncestorSplit_31May2014_copyHTML5_HTML5_Canvas.html?18596", "_self");
	}
	this.frame_2608 = function() {
		playSound("nar1_wrongbranch");
	}
	this.frame_2913 = function() {
		this.gotoAndStop("wrong_nar1");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(49).call(this.frame_49).wait(90).call(this.frame_139).wait(430).call(this.frame_569).wait(220).call(this.frame_789).wait(52).call(this.frame_841).wait(34).call(this.frame_875).wait(2).call(this.frame_877).wait(1).call(this.frame_878).wait(12).call(this.frame_890).wait(2).call(this.frame_892).wait(202).call(this.frame_1094).wait(311).call(this.frame_1405).wait(471).call(this.frame_1876).wait(728).call(this.frame_2604).wait(4).call(this.frame_2608).wait(305).call(this.frame_2913).wait(201));

	// text_nar1
	this.instance = new lib.Tween5("synched",0);
	this.instance.setTransform(330,16);
	this.instance._off = true;

	this.instance_1 = new lib.Tween6("synched",0);
	this.instance_1.setTransform(533.45,70);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},79).to({state:[{t:this.instance_1}]},63).to({state:[]},393).to({state:[]},1304).wait(1275));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(79).to({_off:false},0).to({_off:true,x:533.45,y:70},63).wait(2972));

	// text_title
	this.text = new cjs.Text("Click images below to select an episode between 1678 and 2000", "italic bold 18px 'Verdana'");
	this.text.textAlign = "center";
	this.text.lineHeight = 24;
	this.text.lineWidth = 335;
	this.text.parent = this;
	this.text.setTransform(335.25,42);

	this.text_1 = new cjs.Text("Following Arcimovics Ancestors' Trail", "bold 29px 'Verdana'");
	this.text_1.lineHeight = 37;
	this.text_1.lineWidth = 618;
	this.text_1.parent = this;
	this.text_1.setTransform(21.05,6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_1},{t:this.text}]},44).to({state:[]},7).to({state:[]},1788).wait(1275));

	// button_natalja
	this.nataljaBN = new lib.natalja_button();
	this.nataljaBN.name = "nataljaBN";
	this.nataljaBN.setTransform(44,422.95);
	new cjs.ButtonHelper(this.nataljaBN, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.nataljaBN).to({x:327,y:364},29).to({_off:true},50).wait(3035));

	// large_1NR
	this.instance_2 = new lib.Tween3("synched",0);
	this.instance_2.setTransform(321.6,342.9);
	this.instance_2._off = true;

	this.instance_3 = new lib.Natalja_largeMC();
	this.instance_3.setTransform(395.45,292,0.4293,0.4292,0,0,0,0,-2.1);
	this.instance_3.alpha = 0;
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(79).to({_off:false},0).to({x:334.5,y:222.75},30).to({_off:true},1).wait(3004));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(110).to({_off:false},0).to({x:342,y:250,alpha:1},9).to({x:237.95,y:188},23).to({x:108,y:131,alpha:0},18).to({_off:true},4).wait(2950));

	// button_kiril
	this.kirilBN = new lib.kiril_button();
	this.kirilBN.name = "kirilBN";
	this.kirilBN.setTransform(121,421);
	new cjs.ButtonHelper(this.kirilBN, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.kirilBN).to({x:509,y:383},9).to({_off:true},70).wait(3035));

	// _KR1728
	this.kirilBN_1 = new lib.kiril_button();
	this.kirilBN_1.name = "kirilBN_1";
	this.kirilBN_1.setTransform(509,383);
	new cjs.ButtonHelper(this.kirilBN_1, 0, 1, 2);

	this.instance_4 = new lib.Tween4("synched",0);
	this.instance_4.setTransform(267.75,202.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.kirilBN_1}]},79).to({state:[{t:this.instance_4}]},48).to({state:[]},15).wait(2972));

	// button_aleksej
	this.aleksejBN = new lib.aleksej_button();
	this.aleksejBN.name = "aleksejBN";
	this.aleksejBN.setTransform(196,426);
	new cjs.ButtonHelper(this.aleksejBN, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.aleksejBN).to({x:510,y:237},14).to({_off:true},65).wait(3035));

	// _AR1748
	this.aleksejBN_1 = new lib.aleksej_button();
	this.aleksejBN_1.name = "aleksejBN_1";
	this.aleksejBN_1.setTransform(510,237);
	this.aleksejBN_1._off = true;
	new cjs.ButtonHelper(this.aleksejBN_1, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.aleksejBN_1).wait(79).to({_off:false},0).to({_off:true},63).wait(2972));

	// button_michail
	this.michailBN = new lib.michail_button();
	this.michailBN.name = "michailBN";
	this.michailBN.setTransform(272.95,424);
	new cjs.ButtonHelper(this.michailBN, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.michailBN).to({x:385,y:157.1},19).to({_off:true},60).wait(3035));

	// _MZ1788
	this.michailBN_1 = new lib.michail_button();
	this.michailBN_1.name = "michailBN_1";
	this.michailBN_1.setTransform(385,157.1);
	this.michailBN_1._off = true;
	new cjs.ButtonHelper(this.michailBN_1, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.michailBN_1).wait(79).to({_off:false},0).to({_off:true},63).wait(2972));

	// button_viktor
	this.viktorBN = new lib.viktor_button();
	this.viktorBN.name = "viktorBN";
	this.viktorBN.setTransform(425.5,417);
	new cjs.ButtonHelper(this.viktorBN, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.viktorBN).to({x:267,y:150.4},22).to({_off:true},57).wait(3035));

	// _VA1820
	this.viktorBN_1 = new lib.viktor_button();
	this.viktorBN_1.name = "viktorBN_1";
	this.viktorBN_1.setTransform(267,150.4);
	this.viktorBN_1._off = true;
	new cjs.ButtonHelper(this.viktorBN_1, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.viktorBN_1).wait(79).to({_off:false},0).to({_off:true},63).wait(2972));

	// button_nikolaj
	this.nikolajBN = new lib.nikolaj_button();
	this.nikolajBN.name = "nikolajBN";
	this.nikolajBN.setTransform(508.5,412);
	new cjs.ButtonHelper(this.nikolajBN, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.nikolajBN).to({x:155,y:218.2},23).to({_off:true},56).wait(3035));

	// _NA1857
	this.nikolajBN_1 = new lib.nikolaj_button();
	this.nikolajBN_1.name = "nikolajBN_1";
	this.nikolajBN_1.setTransform(155,218.2);
	this.nikolajBN_1._off = true;
	new cjs.ButtonHelper(this.nikolajBN_1, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.nikolajBN_1).wait(79).to({_off:false},0).to({_off:true},63).wait(2972));

	// button_vera
	this.veraBN = new lib.vera_button();
	this.veraBN.name = "veraBN";
	this.veraBN.setTransform(581,423);
	new cjs.ButtonHelper(this.veraBN, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.veraBN).to({x:143.2,y:374.6},27).to({_off:true},52).wait(3035));

	// _VA1883
	this.veraBN_1 = new lib.vera_button();
	this.veraBN_1.name = "veraBN_1";
	this.veraBN_1.setTransform(143.2,374.6);
	this.veraBN_1._off = true;
	new cjs.ButtonHelper(this.veraBN_1, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.veraBN_1).wait(79).to({_off:false},0).to({_off:true},63).wait(2972));

	// button_olga
	this.olgaBN = new lib.olga_button();
	this.olgaBN.name = "olgaBN";
	this.olgaBN.setTransform(581,326);
	new cjs.ButtonHelper(this.olgaBN, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.olgaBN).to({x:234.2,y:513.5},29).to({_off:true},50).wait(3035));

	// _OS1921
	this.olgaBN_1 = new lib.olga_button();
	this.olgaBN_1.name = "olgaBN_1";
	this.olgaBN_1.setTransform(234.2,513.5);
	this.olgaBN_1._off = true;
	new cjs.ButtonHelper(this.olgaBN_1, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.olgaBN_1).wait(79).to({_off:false},0).to({_off:true},63).wait(2972));

	// button_biruta
	this.birutaBN = new lib.biruta_button();
	this.birutaBN.name = "birutaBN";
	this.birutaBN.setTransform(349,423);
	new cjs.ButtonHelper(this.birutaBN, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.birutaBN).to({x:385,y:512.9},31).to({_off:true},48).wait(3035));

	// _BA1947
	this.birutaBN_1 = new lib.biruta_button();
	this.birutaBN_1.name = "birutaBN_1";
	this.birutaBN_1.setTransform(385,512.9);
	this.birutaBN_1._off = true;
	new cjs.ButtonHelper(this.birutaBN_1, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.birutaBN_1).wait(79).to({_off:false},0).to({_off:true},63).wait(2972));

	// button_hansen
	this.hansenBN = new lib.hansen_button();
	this.hansenBN.name = "hansenBN";
	this.hansenBN.setTransform(50.05,321);
	new cjs.ButtonHelper(this.hansenBN, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.hansenBN).to({x:528,y:508.05},34).to({_off:true},45).wait(3035));

	// _0H1983
	this.hansenBN_1 = new lib.hansen_button();
	this.hansenBN_1.name = "hansenBN_1";
	this.hansenBN_1.setTransform(528,508.05);
	this.hansenBN_1._off = true;
	new cjs.ButtonHelper(this.hansenBN_1, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.hansenBN_1).wait(79).to({_off:false},0).to({_off:true},63).wait(2972));

	// arrows
	this.text_2 = new cjs.Text("....", "italic bold 47px 'Verdana'", "#554732");
	this.text_2.textAlign = "center";
	this.text_2.lineHeight = 59;
	this.text_2.parent = this;
	this.text_2.setTransform(606.05,474.7);

	this.instance_5 = new lib.CachedBmp_76();
	this.instance_5.setTransform(151.45,120,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_5},{t:this.text_2}]},39).to({state:[]},103).wait(2972));

	// tree
	this.instance_6 = new lib.tree_clear_small();
	this.instance_6.setTransform(214.5,138);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({_off:true},142).wait(2972));

	// branches
	this.instance_7 = new lib.tree_branch();
	this.instance_7.setTransform(345.5,382.5);

	this.instance_8 = new lib.tree_branch();
	this.instance_8.setTransform(542.6,507,0.8293,1.0441,0,-74.6679,-29.9986);

	this.instance_9 = new lib.tree_branch();
	this.instance_9.setTransform(586.45,490.9,1,1,-29.9992);

	this.instance_10 = new lib.tree_branch();
	this.instance_10.setTransform(446.5,486.5,1,1.164,0,30.7843,0);

	this.instance_11 = new lib.tree_branch();
	this.instance_11.setTransform(481.15,493.5,0.5341,0.7659,59.9996);

	this.instance_12 = new lib.tree_branch();
	this.instance_12.setTransform(436.1,479.85,1,1,45);

	this.instance_13 = new lib.tree_branch();
	this.instance_13.setTransform(346.3,480.2,1,1.451,59.9998);

	this.instance_14 = new lib.tree_branch();
	this.instance_14.setTransform(294.15,480.9,1,1,45);

	this.instance_15 = new lib.tree_branch();
	this.instance_15.setTransform(161.95,487.7,1,1,-74.9998);

	this.instance_16 = new lib.tree_branch();
	this.instance_16.setTransform(132.55,458.9,1.1309,1,0,-74.9998,-47.1609);

	this.instance_17 = new lib.tree_branch();
	this.instance_17.setTransform(109.5,316.2,1.7805,1,-45);

	this.instance_18 = new lib.tree_branch();
	this.instance_18.setTransform(171.5,147.5);

	this.instance_19 = new lib.tree_branch();
	this.instance_19.setTransform(212.9,188.05,1,1,-135);

	this.instance_20 = new lib.tree_branch();
	this.instance_20.setTransform(312.9,172.5,1,1,-120.0004);

	this.instance_21 = new lib.tree_branch();
	this.instance_21.setTransform(417.5,166.5,0.4634,1,-90);

	this.instance_22 = new lib.tree_branch();
	this.instance_22.setTransform(470.45,310.5,1.5366,1);

	this.instance_23 = new lib.tree_branch();
	this.instance_23.setTransform(462.85,426.15,1,0.7,-135.0009);

	this.instance_24 = new lib.tree_branch();
	this.instance_24.setTransform(397.6,383.55,1.6415,1,14.9983);

	this.instance_25 = new lib.tree_branch();
	this.instance_25.setTransform(459.4,328.95,1,1,-83.995);

	this.instance_26 = new lib.tree_branch();
	this.instance_26.setTransform(440.85,152.9,1,1,-45);

	this.instance_27 = new lib.Tween216("synched",0);
	this.instance_27.setTransform(377.45,331.65);
	this.instance_27._off = true;

	this.instance_28 = new lib.Tween217("synched",0);
	this.instance_28.setTransform(377.45,331.65);
	this.instance_28.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7}]},39).to({state:[{t:this.instance_27}]},89).to({state:[{t:this.instance_28}]},11).to({state:[]},2875).wait(100));
	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(128).to({_off:false},0).to({_off:true,alpha:0},11).wait(2975));

	// vine
	this.instance_29 = new lib.CachedBmp_77();
	this.instance_29.setTransform(88.1,62.4,0.5,0.5);

	this.instance_30 = new lib.Tween214("synched",0);
	this.instance_30.setTransform(314.5,296.9);
	this.instance_30._off = true;

	this.instance_31 = new lib.Tween215("synched",0);
	this.instance_31.setTransform(314.5,296.9);
	this.instance_31.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_29}]},39).to({state:[{t:this.instance_30}]},89).to({state:[{t:this.instance_31}]},11).wait(2975));
	this.timeline.addTween(cjs.Tween.get(this.instance_30).wait(128).to({_off:false},0).to({_off:true,alpha:0},11).wait(2975));

	// circle
	this.shape = new cjs.Shape();
	this.shape.graphics.beginFill("#CC0000").beginStroke().moveTo(-3.2,0.7).curveTo(-4.3,-1.1,-4.5,-2.7).curveTo(-1.7,-3.3,-0.9,-2.9).curveTo(2.7,-0.9,3.7,-0.5).lineTo(4.5,1).curveTo(3.8,3,1,3).curveTo(-1.6,3,-3.2,0.7).closePath();
	this.shape.setTransform(207.5,140.9536);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.6,3).curveTo(-2.8,2.5,-3.6,1.3).curveTo(-4.3,0.3,-4.7,-0.8).curveTo(-5,-1.7,-5.1,-2.7).lineTo(-4.8,-2.8).curveTo(-4.7,-1.5,-3.9,0.2).lineTo(-3.6,0.9).lineTo(-3,1.7).curveTo(-2.2,2.7,-1,3.1).curveTo(-0.5,3.3,1,3.4).curveTo(3.2,3.3,4.1,2.1).curveTo(4.5,1.6,4.8,1).lineTo(4.1,-0.7).curveTo(3.1,-1.3,-1,-3.3).curveTo(-1.6,-3.5,-2.8,-3.4).lineTo(-3.7,-3.2).curveTo(-2.5,-3.6,-1.7,-3.6).lineTo(-1.3,-3.5).lineTo(0.9,-2.6).lineTo(3.7,-1.2).lineTo(4.2,-1).lineTo(5,0.6).lineTo(5.1,0.8).curveTo(4.6,2.3,3.1,3).curveTo(2.4,3.4,1.4,3.5).lineTo(0.5,3.6).curveTo(-0.6,3.6,-1.6,3).closePath();
	this.shape_1.setTransform(210.825,142.7079);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.7,3.8).curveTo(-3,3.3,-4,2).curveTo(-4.9,0.9,-5.3,-0.4).curveTo(-5.7,-1.5,-5.6,-2.6).lineTo(-5.2,-2.9).curveTo(-5,-1.6,-4.3,0.4).lineTo(-3.9,1.2).lineTo(-3.4,2.1).curveTo(-2.6,3.2,-1.2,3.6).curveTo(-0.6,3.8,1,3.8).curveTo(3.2,3.6,4.4,2.2).curveTo(4.8,1.7,5,1.1).curveTo(4.9,0.1,4.5,-0.8).curveTo(3.6,-1.8,-1,-3.6).curveTo(-1.7,-3.9,-3,-3.8).lineTo(-4.4,-3.3).lineTo(-5,-3.1).curveTo(-3.4,-3.9,-2.2,-4.1).lineTo(-1.7,-4.1).lineTo(0.8,-3.3).curveTo(2.9,-2.5,4,-1.8).lineTo(4.7,-1.4).curveTo(5.3,-0.6,5.5,0.4).lineTo(5.6,0.6).curveTo(5.2,2.2,3.6,3.3).curveTo(2.8,3.8,1.8,4).curveTo(1,4.1,0.3,4.1).curveTo(-0.7,4.1,-1.7,3.8).closePath();
	this.shape_2.setTransform(214.15,144.442);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.6,4.5).curveTo(-3.2,3.9,-4.3,2.6).curveTo(-5.4,1.4,-5.9,-0.1).curveTo(-6.2,-1.3,-6.2,-2.6).lineTo(-6.2,-2.6).lineTo(-5.6,-3.2).curveTo(-4.1,-4.4,-2.7,-4.7).lineTo(-2.1,-4.8).curveTo(-0.6,-4.5,0.8,-4.1).curveTo(3.1,-3.3,4.5,-2.5).lineTo(5.2,-2).curveTo(5.9,-1,6.1,0.1).lineTo(6.3,0.3).curveTo(5.8,2.1,4.1,3.4).curveTo(3.3,4.1,2.1,4.4).curveTo(1.1,4.8,0.1,4.8).curveTo(-0.8,4.8,-1.6,4.5).closePath().moveTo(-3.3,-4.2).curveTo(-3.8,-3.9,-4.7,-3.6).lineTo(-5.4,-3.2).curveTo(-5.3,-1.8,-4.5,0.5).lineTo(-4.2,1.4).curveTo(-4.1,1.9,-3.8,2.3).curveTo(-2.8,3.5,-1.4,4).curveTo(-0.7,4.1,1.1,4.1).curveTo(3.3,3.7,4.6,2.3).curveTo(5,1.7,5.3,1).curveTo(5.2,-0,4.9,-1).curveTo(3.9,-2.3,-1.1,-4.1).curveTo(-1.7,-4.2,-2.5,-4.2).lineTo(-3.3,-4.2).closePath();
	this.shape_3.setTransform(217.45,146.201);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.7,5.2).curveTo(-3.5,4.7,-4.8,3.3).curveTo(-5.9,2,-6.4,0.2).curveTo(-6.8,-1.1,-6.8,-2.5).lineTo(-6.8,-2.6).lineTo(-6.2,-3.3).curveTo(-4.8,-4.8,-3.2,-5.3).lineTo(-2.5,-5.4).curveTo(-0.9,-5.3,0.7,-4.8).curveTo(3.3,-4,4.9,-3.1).lineTo(5.7,-2.5).curveTo(6.5,-1.4,6.7,-0.2).lineTo(6.8,0).curveTo(6.4,2,4.6,3.6).curveTo(3.7,4.4,2.5,4.8).curveTo(1.3,5.4,-0.1,5.4).curveTo(-0.9,5.4,-1.7,5.2).closePath().moveTo(-3.6,-4.6).curveTo(-4.1,-4.2,-4.9,-3.9).lineTo(-5.8,-3.3).curveTo(-5.7,-1.9,-4.9,0.7).lineTo(-4.6,1.6).lineTo(-4.1,2.6).curveTo(-3.2,4,-1.6,4.4).curveTo(-0.8,4.6,1,4.4).curveTo(3.5,4,4.7,2.4).curveTo(5.2,1.8,5.6,1).curveTo(5.5,-0.1,5.2,-1.2).curveTo(4.4,-2.8,-1.2,-4.5).curveTo(-1.8,-4.6,-2.8,-4.6).lineTo(-3.6,-4.6).closePath();
	this.shape_4.setTransform(220.775,147.9543);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.7,5.9).curveTo(-3.8,5.4,-5.1,3.9).curveTo(-6.4,2.5,-6.9,0.6).curveTo(-7.4,-0.9,-7.4,-2.5).lineTo(-7.4,-2.5).lineTo(-6.8,-3.5).curveTo(-5.5,-5.2,-3.7,-5.9).lineTo(-2.9,-6).curveTo(-1.2,-6,0.7,-5.6).curveTo(3.5,-4.8,5.2,-3.7).lineTo(6.2,-3).curveTo(7.1,-1.8,7.4,-0.5).lineTo(7.4,-0.2).curveTo(7,1.9,5.1,3.8).curveTo(4.1,4.7,2.9,5.3).curveTo(1.4,6,-0.2,6).curveTo(-1,6,-1.7,5.9).closePath().moveTo(-3.8,-5).curveTo(-4.4,-4.5,-5.2,-4.1).lineTo(-6.1,-3.5).curveTo(-6,-2.1,-5.2,0.8).lineTo(-5,1.9).curveTo(-4.8,2.5,-4.4,2.9).curveTo(-3.6,4.4,-1.7,4.8).curveTo(-1,5,1.1,4.8).curveTo(3.6,4.2,5,2.5).curveTo(5.5,1.8,5.8,1.1).curveTo(5.9,-0.2,5.6,-1.4).curveTo(4.8,-3.2,-1.3,-4.9).curveTo(-1.9,-5,-2.8,-5).lineTo(-3.8,-5).closePath();
	this.shape_5.setTransform(224.1,149.739);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.8,6.6).curveTo(-4,6.2,-5.6,4.5).curveTo(-6.9,3.1,-7.5,0.9).curveTo(-8,-0.7,-8,-2.5).lineTo(-7.4,-3.6).curveTo(-6.2,-5.6,-4.1,-6.5).lineTo(-3.3,-6.7).curveTo(-1.4,-6.7,0.7,-6.3).curveTo(3.7,-5.5,5.6,-4.3).lineTo(6.7,-3.5).curveTo(7.7,-2.3,7.9,-0.8).lineTo(8,-0.5).curveTo(7.6,1.8,5.6,4).curveTo(4.6,5.1,3.3,5.7).curveTo(1.6,6.7,-0.3,6.7).lineTo(-1.8,6.6).closePath().moveTo(-4.1,-5.4).curveTo(-4.6,-4.8,-5.5,-4.3).curveTo(-6.1,-4,-6.4,-3.6).curveTo(-6.4,-2.2,-5.6,1).lineTo(-5.3,2.1).curveTo(-5.1,2.8,-4.8,3.2).curveTo(-3.9,4.8,-1.9,5.3).curveTo(-1.1,5.4,1,5.2).curveTo(3.7,4.5,5.1,2.6).curveTo(5.7,1.9,6.1,1.1).curveTo(6.2,-0.3,6,-1.6).curveTo(5.2,-3.7,-1.3,-5.3).curveTo(-2,-5.4,-3,-5.4).lineTo(-4.1,-5.4).closePath();
	this.shape_6.setTransform(227.425,151.4901);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.8,7.3).curveTo(-4.3,6.9,-5.9,5.2).curveTo(-7.4,3.6,-8.1,1.2).curveTo(-8.5,-0.5,-8.6,-2.4).lineTo(-8,-3.7).curveTo(-6.9,-6.1,-4.6,-7).lineTo(-3.7,-7.3).curveTo(-1.7,-7.5,0.6,-7).curveTo(3.9,-6.3,6,-4.9).lineTo(7.2,-4.1).curveTo(8.3,-2.7,8.5,-1.1).lineTo(8.6,-0.7).curveTo(8.2,1.7,6.1,4.2).curveTo(5,5.4,3.7,6.2).curveTo(1.8,7.4,-0.4,7.4).lineTo(-1.8,7.3).closePath().moveTo(-4.3,-5.8).curveTo(-4.9,-5.1,-5.8,-4.6).curveTo(-6.5,-4.2,-6.7,-3.8).curveTo(-6.7,-2.4,-5.9,1.1).lineTo(-5.7,2.3).curveTo(-5.5,3.1,-5.2,3.5).curveTo(-4.2,5.2,-2.1,5.7).curveTo(-1.2,5.8,1.1,5.5).curveTo(3.8,4.7,5.3,2.7).curveTo(6,1.9,6.4,1.1).curveTo(6.6,-0.4,6.3,-1.8).curveTo(5.6,-4.2,-1.4,-5.7).curveTo(-2.1,-5.8,-3.2,-5.8).lineTo(-4.3,-5.8).closePath();
	this.shape_7.setTransform(230.725,153.2408);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.8,8).curveTo(-4.5,7.6,-6.4,5.8).curveTo(-7.9,4.1,-8.7,1.5).curveTo(-9.1,-0.3,-9.1,-2.4).lineTo(-9.1,-2.5).lineTo(-8.6,-3.9).curveTo(-7.6,-6.5,-5.1,-7.7).lineTo(-4.1,-8).curveTo(-1.9,-8.3,0.6,-7.8).curveTo(4.1,-7.1,6.4,-5.6).curveTo(7.2,-5.1,7.7,-4.6).curveTo(8.9,-3.1,9.1,-1.4).lineTo(9.1,-1).curveTo(8.8,1.6,6.5,4.4).curveTo(5.5,5.7,4.1,6.6).curveTo(1.9,8.1,-0.7,8.1).lineTo(-1.8,8).closePath().moveTo(-4.6,-6.2).curveTo(-5.2,-5.5,-6.1,-4.9).curveTo(-6.8,-4.4,-7.1,-4).curveTo(-7,-2.6,-6.3,1.2).lineTo(-6.1,2.5).curveTo(-5.9,3.3,-5.5,3.8).curveTo(-4.6,5.5,-2.2,6.1).curveTo(-1.3,6.2,1,5.8).curveTo(3.9,4.9,5.5,2.8).curveTo(6.2,1.9,6.6,1).curveTo(6.9,-0.5,6.7,-2).curveTo(6.1,-4.7,-1.5,-6.1).curveTo(-2.3,-6.2,-3.4,-6.2).lineTo(-4.6,-6.2).closePath();
	this.shape_8.setTransform(234.05,155.0014);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.8,8.7).curveTo(-4.8,8.4,-6.7,6.5).curveTo(-8.5,4.7,-9.2,1.9).curveTo(-9.7,-0.1,-9.7,-2.3).lineTo(-9.7,-2.4).lineTo(-9.2,-3.9).curveTo(-8.3,-6.9,-5.6,-8.2).lineTo(-4.5,-8.6).curveTo(-2.2,-9,0.5,-8.5).curveTo(4.3,-7.8,6.8,-6.2).lineTo(8.2,-5.1).curveTo(9.5,-3.5,9.7,-1.6).lineTo(9.7,-1.2).curveTo(9.3,1.5,7,4.6).curveTo(5.9,6.1,4.4,7.1).curveTo(2,8.8,-0.8,8.8).lineTo(-1.8,8.7).closePath().moveTo(-4.8,-6.6).curveTo(-5.4,-5.7,-6.4,-5.1).curveTo(-7.2,-4.6,-7.4,-4.1).curveTo(-7.3,-2.7,-6.6,1.4).lineTo(-6.4,2.8).curveTo(-6.2,3.6,-5.9,4.1).curveTo(-4.9,6,-2.4,6.5).curveTo(-1.4,6.7,1.1,6.2).curveTo(4,5.2,5.7,2.9).curveTo(6.4,2,6.9,1.1).curveTo(7.3,-0.6,7.1,-2.1).curveTo(6.5,-5.1,-1.5,-6.5).curveTo(-2.4,-6.6,-3.6,-6.6).lineTo(-4.8,-6.6).closePath();
	this.shape_9.setTransform(237.375,156.7319);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.8,9.4).curveTo(-5,9.1,-7.1,7.1).curveTo(-9,5.3,-9.8,2.2).curveTo(-10.3,0.2,-10.3,-2.3).lineTo(-10.3,-2.3).lineTo(-9.8,-4).curveTo(-9,-7.3,-6.1,-8.7).curveTo(-5.5,-9,-4.9,-9.2).curveTo(-2.4,-9.7,0.5,-9.2).curveTo(4.5,-8.5,7.2,-6.8).curveTo(8.1,-6.2,8.7,-5.6).curveTo(10.1,-3.9,10.2,-1.9).lineTo(10.3,-1.5).curveTo(10,1.5,7.5,4.8).curveTo(6.3,6.5,4.8,7.5).curveTo(2.2,9.5,-0.9,9.5).lineTo(-1.8,9.4).closePath().moveTo(-5.1,-7).curveTo(-5.6,-6,-6.7,-5.3).curveTo(-7.5,-4.7,-7.7,-4.2).curveTo(-7.6,-2.8,-7,1.6).lineTo(-6.8,3).curveTo(-6.5,3.9,-6.3,4.4).curveTo(-5.2,6.4,-2.6,7).curveTo(-1.6,7.1,1.1,6.6).curveTo(4.1,5.4,6,3).curveTo(6.7,2.1,7.2,1.1).curveTo(7.6,-0.6,7.4,-2.3).curveTo(6.9,-5.6,-1.6,-6.9).lineTo(-3.8,-7).lineTo(-5.1,-7).closePath();
	this.shape_10.setTransform(240.7,158.492);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.9,10.1).curveTo(-5.3,9.9,-7.5,7.8).curveTo(-9.5,5.9,-10.3,2.6).curveTo(-10.9,0.4,-10.9,-2.2).lineTo(-10.9,-2.3).lineTo(-10.4,-4.2).curveTo(-9.7,-7.7,-6.6,-9.3).lineTo(-5.3,-9.8).curveTo(-2.7,-10.4,0.5,-10).curveTo(4.7,-9.3,7.6,-7.4).curveTo(8.5,-6.8,9.2,-6.1).curveTo(10.7,-4.3,10.9,-2.2).lineTo(10.9,-1.7).curveTo(10.6,1.4,8,5).curveTo(6.8,6.8,5.1,7.9).curveTo(2.4,10.2,-1,10.2).lineTo(-1.9,10.1).closePath().moveTo(-5.3,-7.4).curveTo(-5.9,-6.4,-7,-5.6).curveTo(-7.8,-4.9,-8,-4.4).curveTo(-7.9,-2.9,-7.3,1.7).lineTo(-7.1,3.3).curveTo(-6.9,4.2,-6.6,4.7).curveTo(-5.6,6.8,-2.8,7.4).curveTo(-1.7,7.5,1.1,6.9).curveTo(4.3,5.7,6.1,3.1).curveTo(6.9,2.1,7.4,1.1).curveTo(8,-0.7,7.8,-2.5).curveTo(7.3,-6,-1.6,-7.3).lineTo(-3.7,-7.4).lineTo(-5.3,-7.4).closePath();
	this.shape_11.setTransform(244,160.2247);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.9,10.8).curveTo(-5.6,10.6,-7.9,8.4).curveTo(-10,6.4,-10.9,2.9).curveTo(-11.5,0.6,-11.5,-2.2).lineTo(-11.5,-2.2).lineTo(-11,-4.3).curveTo(-10.3,-8.1,-7,-9.9).lineTo(-5.7,-10.5).curveTo(-3,-11.2,0.4,-10.7).curveTo(4.9,-10.1,8,-8).curveTo(9,-7.3,9.7,-6.6).curveTo(11.3,-4.8,11.4,-2.5).lineTo(11.5,-2).curveTo(11.1,1.3,8.5,5.2).curveTo(7.2,7.1,5.5,8.4).curveTo(2.6,10.9,-1.1,10.9).lineTo(-1.9,10.8).closePath().moveTo(-5.6,-7.8).curveTo(-6.1,-6.7,-7.3,-5.8).curveTo(-8.2,-5.1,-8.3,-4.5).curveTo(-8.3,-3.1,-7.6,1.9).lineTo(-7.4,3.5).curveTo(-7.3,4.5,-7,5).curveTo(-5.9,7.2,-3,7.8).curveTo(-1.8,7.9,1.1,7.3).curveTo(4.3,5.9,6.3,3.2).curveTo(7.1,2.2,7.7,1.1).curveTo(8.3,-0.8,8.2,-2.7).curveTo(7.7,-6.5,-1.7,-7.7).lineTo(-3.9,-7.8).lineTo(-5.6,-7.8).closePath();
	this.shape_12.setTransform(247.325,161.9517);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.beginFill("#CC0000").beginStroke().moveTo(-1.9,11.6).curveTo(-5.8,11.3,-8.3,9.1).curveTo(-10.5,7,-11.4,3.2).curveTo(-12.1,0.8,-12,-2.1).lineTo(-12,-2.2).lineTo(-11.6,-4.4).curveTo(-11,-8.5,-7.5,-10.5).lineTo(-6.1,-11.1).curveTo(-3.2,-11.9,0.4,-11.5).curveTo(5.1,-10.8,8.4,-8.6).curveTo(9.5,-7.9,10.2,-7.1).curveTo(11.9,-5.2,12,-2.7).lineTo(12.1,-2.2).curveTo(11.7,1.2,9,5.4).curveTo(7.6,7.5,5.9,8.8).curveTo(2.7,11.6,-1.4,11.6).lineTo(-1.9,11.6).closePath().moveTo(-5.8,-8.2).curveTo(-6.4,-7,-7.6,-6.1).curveTo(-8.5,-5.3,-8.6,-4.7).curveTo(-8.6,-3.2,-8,2).lineTo(-7.8,3.7).curveTo(-7.6,4.7,-7.3,5.3).curveTo(-6.3,7.6,-3.1,8.3).curveTo(-1.9,8.3,1.1,7.6).curveTo(4.4,6.1,6.6,3.3).curveTo(7.4,2.2,7.9,1.1).curveTo(8.7,-0.9,8.6,-2.9).curveTo(8.2,-7,-1.7,-8.1).lineTo(-4.1,-8.2).lineTo(-5.8,-8.2).closePath();
	this.shape_13.setTransform(250.6482,163.7035);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.beginFill("#CC0000").beginStroke().moveTo(-2,12.3).curveTo(-6.1,12.1,-8.6,9.8).curveTo(-11,7.6,-12,3.6).curveTo(-12.6,1,-12.7,-2).lineTo(-12.7,-2.1).lineTo(-12.2,-4.5).curveTo(-11.7,-8.9,-8,-11).lineTo(-6.5,-11.7).curveTo(-3.5,-12.6,0.4,-12.2).curveTo(5.3,-11.5,8.8,-9.2).curveTo(9.9,-8.4,10.7,-7.6).curveTo(12.6,-5.5,12.6,-3).lineTo(12.6,-2.4).curveTo(12.3,1.1,9.5,5.6).curveTo(8.1,7.9,6.3,9.3).curveTo(3,12.3,-1.4,12.3).lineTo(-2,12.3).closePath().moveTo(-6.1,-8.5).curveTo(-6.6,-7.2,-7.9,-6.3).curveTo(-8.9,-5.5,-9,-4.8).curveTo(-8.9,-3.3,-8.3,2.2).lineTo(-8.2,4).curveTo(-8,5.1,-7.7,5.7).curveTo(-6.6,8.1,-3.3,8.7).curveTo(-2,8.8,1.1,8).curveTo(4.6,6.4,6.8,3.5).curveTo(7.6,2.3,8.2,1.1).curveTo(9,-1,8.9,-3).curveTo(8.5,-7.4,-1.8,-8.5).lineTo(-4.2,-8.6).lineTo(-6.1,-8.5).closePath();
	this.shape_14.setTransform(253.95,165.4336);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.beginFill("#CC0000").beginStroke().moveTo(-2,13).curveTo(-6.3,12.9,-9.1,10.4).curveTo(-11.5,8.1,-12.6,4).curveTo(-13.2,1.2,-13.2,-2).lineTo(-13.2,-2.1).lineTo(-12.8,-4.6).curveTo(-12.4,-9.3,-8.5,-11.6).lineTo(-6.9,-12.3).curveTo(-3.7,-13.3,0.3,-12.9).curveTo(5.5,-12.3,9.2,-9.8).curveTo(10.4,-9,11.2,-8.1).curveTo(13.1,-5.9,13.2,-3.3).lineTo(13.2,-2.7).curveTo(12.9,1,10,5.8).curveTo(8.5,8.2,6.7,9.8).curveTo(3.2,13,-1.4,13).lineTo(-2,13).closePath().moveTo(-6.3,-8.9).curveTo(-6.9,-7.5,-8.2,-6.5).curveTo(-9.2,-5.7,-9.3,-4.9).lineTo(-8.7,2.4).lineTo(-8.5,4.3).curveTo(-8.4,5.4,-8.1,6).curveTo(-7,8.5,-3.5,9.2).curveTo(-2.1,9.2,1.1,8.4).curveTo(4.7,6.7,6.9,3.6).curveTo(7.9,2.4,8.5,1.2).curveTo(9.4,-1.1,9.3,-3.2).curveTo(9,-7.9,-1.9,-8.9).lineTo(-4,-8.9).lineTo(-6.3,-8.9).closePath();
	this.shape_15.setTransform(257.275,167.1857);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.beginFill("#CC0000").beginStroke().moveTo(-2,13.7).curveTo(-6.6,13.6,-9.4,11).curveTo(-12,8.7,-13.1,4.3).curveTo(-13.8,1.4,-13.8,-2).lineTo(-13.8,-2).lineTo(-13.4,-4.7).curveTo(-13.1,-9.7,-8.9,-12.1).curveTo(-8.1,-12.6,-7.3,-12.9).curveTo(-4,-14.1,0.3,-13.6).curveTo(5.7,-13,9.6,-10.4).curveTo(10.8,-9.6,11.7,-8.6).curveTo(13.7,-6.4,13.8,-3.5).lineTo(13.8,-2.9).curveTo(13.5,0.9,10.5,6).curveTo(9,8.6,7.1,10.2).curveTo(3.4,13.7,-1.6,13.7).lineTo(-2,13.7).closePath().moveTo(-6.5,-9.3).curveTo(-7.1,-7.8,-8.5,-6.7).curveTo(-9.5,-5.9,-9.6,-5.1).curveTo(-9.6,-3.6,-9,2.5).curveTo(-9,3.6,-8.8,4.5).curveTo(-8.7,5.6,-8.4,6.3).curveTo(-7.3,8.9,-3.6,9.6).curveTo(-2.2,9.6,1.2,8.8).curveTo(4.8,6.9,7.2,3.7).curveTo(8.1,2.4,8.7,1.2).curveTo(9.8,-1.2,9.7,-3.4).curveTo(9.4,-8.3,-1.9,-9.3).lineTo(-4.1,-9.3).lineTo(-6.5,-9.3).closePath();
	this.shape_16.setTransform(260.5983,168.9147);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.beginFill("#CC0000").beginStroke().moveTo(-2.1,14.5).curveTo(-6.9,14.4,-9.9,11.7).curveTo(-12.6,9.3,-13.7,4.7).curveTo(-14.4,1.7,-14.4,-1.9).lineTo(-14.4,-1.9).lineTo(-14.1,-4.8).curveTo(-13.8,-10.1,-9.4,-12.7).curveTo(-8.6,-13.2,-7.7,-13.5).curveTo(-4.3,-14.8,0.2,-14.3).curveTo(5.9,-13.7,9.9,-11).curveTo(11.3,-10.1,12.2,-9.1).curveTo(14.3,-6.7,14.4,-3.8).lineTo(14.4,-3.1).curveTo(14.1,0.9,10.9,6.3).curveTo(9.4,8.9,7.4,10.7).curveTo(3.6,14.5,-1.7,14.5).lineTo(-2.1,14.5).closePath().moveTo(-6.8,-9.6).curveTo(-7.4,-8.1,-8.8,-6.9).curveTo(-9.9,-6,-9.9,-5.2).curveTo(-9.9,-3.7,-9.4,2.7).lineTo(-9.2,4.8).curveTo(-9.1,6,-8.8,6.6).curveTo(-7.7,9.4,-3.9,10.1).curveTo(-2.4,10.1,1.1,9.2).curveTo(4.9,7.2,7.3,3.9).curveTo(8.3,2.5,9,1.2).curveTo(10.1,-1.2,10,-3.5).curveTo(9.8,-8.8,-2,-9.6).lineTo(-4.3,-9.7).lineTo(-6.8,-9.6).closePath();
	this.shape_17.setTransform(263.9234,170.6432);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.beginFill("#CC0000").beginStroke().moveTo(-2.1,15.2).curveTo(-7.1,15.1,-10.2,12.4).curveTo(-13.1,9.8,-14.2,5).curveTo(-15,1.9,-15,-1.8).lineTo(-15,-1.9).lineTo(-14.7,-4.9).curveTo(-14.5,-10.5,-9.9,-13.2).curveTo(-9,-13.8,-8.1,-14.2).curveTo(-4.5,-15.5,0.2,-15.1).curveTo(6.1,-14.5,10.4,-11.6).curveTo(11.7,-10.6,12.7,-9.6).curveTo(14.9,-7.1,15,-4.1).lineTo(15,-3.4).curveTo(14.7,0.8,11.4,6.5).curveTo(9.8,9.3,7.8,11.2).curveTo(3.7,15.2,-1.9,15.2).lineTo(-2.1,15.2).closePath().moveTo(-7.1,-10).curveTo(-7.7,-8.4,-9.1,-7.2).curveTo(-10.2,-6.2,-10.2,-5.3).curveTo(-10.2,-3.8,-9.7,2.9).lineTo(-9.6,5).curveTo(-9.4,6.3,-9.1,6.9).curveTo(-8,9.8,-4,10.5).curveTo(-2.5,10.5,1.2,9.5).curveTo(5,7.4,7.5,4).curveTo(8.6,2.6,9.3,1.2).curveTo(10.4,-1.3,10.4,-3.7).curveTo(10.2,-9.2,-2.1,-10).lineTo(-4.4,-10.1).lineTo(-7.1,-10).closePath();
	this.shape_18.setTransform(267.225,172.3941);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.beginFill("#CC0000").beginStroke().moveTo(-10.6,13).curveTo(-13.6,10.4,-14.8,5.3).curveTo(-15.6,2.1,-15.5,-1.8).lineTo(-15.5,-1.9).lineTo(-15.2,-5).curveTo(-15.2,-10.9,-10.4,-13.8).curveTo(-9.5,-14.4,-8.4,-14.8).curveTo(-4.7,-16.2,0.2,-15.8).curveTo(6.4,-15.2,10.8,-12.2).curveTo(12.2,-11.2,13.2,-10.1).curveTo(15.6,-7.6,15.6,-4.3).lineTo(15.6,-3.6).curveTo(15.3,0.7,11.9,6.7).curveTo(10.3,9.6,8.2,11.6).curveTo(3.9,15.9,-2.1,15.9).curveTo(-7.3,15.9,-10.6,13).closePath().moveTo(-7.3,-10.4).curveTo(-7.9,-8.7,-9.3,-7.4).curveTo(-10.5,-6.4,-10.5,-5.5).curveTo(-10.5,-4,-10,3).lineTo(-9.9,5.2).curveTo(-9.8,6.5,-9.5,7.2).curveTo(-8.3,10.2,-4.2,10.9).curveTo(-2.6,11,1.2,9.9).curveTo(5.1,7.7,7.8,4.1).curveTo(8.8,2.6,9.5,1.2).curveTo(10.8,-1.4,10.8,-3.9).curveTo(10.7,-9.7,-2.1,-10.4).lineTo(-4.6,-10.5).lineTo(-7.3,-10.4).closePath();
	this.shape_19.setTransform(270.5485,174.1467);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.beginFill("#CC0000").beginStroke().moveTo(-15.4,5.7).curveTo(-16.2,2.3,-16.1,-1.8).lineTo(-15.9,-5.1).curveTo(-15.9,-11.3,-10.9,-14.4).curveTo(-6.5,-17.1,0.1,-16.5).curveTo(6.5,-16,11.1,-12.8).curveTo(16.1,-9.4,16.1,-4.6).curveTo(16.1,0.1,12.4,6.9).curveTo(7,16.6,-2.1,16.6).curveTo(-12.7,16.6,-15.4,5.7).closePath().moveTo(-7.6,-10.8).curveTo(-8.2,-9,-9.7,-7.7).curveTo(-10.9,-6.6,-10.9,-5.6).curveTo(-10.9,-4.1,-10.4,3.2).curveTo(-10.4,6.3,-9.9,7.5).curveTo(-8.7,10.6,-4.4,11.4).lineTo(-1.1,11.4).curveTo(4.4,8.9,7.9,4.2).curveTo(11.1,-0.1,11.1,-4).curveTo(11.1,-10.9,-5.3,-10.9).lineTo(-7.6,-10.8).closePath();
	this.shape_20.setTransform(273.8735,175.8785);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},313).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_7}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_10}]},1).to({state:[{t:this.shape_11}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_13}]},1).to({state:[{t:this.shape_14}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_16}]},1).to({state:[{t:this.shape_17}]},1).to({state:[{t:this.shape_18}]},1).to({state:[{t:this.shape_19}]},1).to({state:[{t:this.shape_20}]},1).to({state:[]},130).to({state:[]},2100).wait(551));

	// walk_natalja (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_2115 = new cjs.Graphics().moveTo(-65.7,-41.3).lineTo(64.6,-70.6).lineTo(55.8,119.8).lineTo(-63.1,189).closePath();
	var mask_graphics_2116 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2117 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2118 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2119 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2120 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2121 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2122 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2123 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2124 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2125 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2126 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2127 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2128 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2129 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2130 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2131 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2132 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2133 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2134 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2135 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2136 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2137 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2138 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2139 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2140 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2141 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2142 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2143 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2144 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2145 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2146 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2147 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2148 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2149 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2150 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2151 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2152 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2153 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2154 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2155 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2156 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2157 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2158 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2159 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2160 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2161 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2162 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2163 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2164 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2165 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2166 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2167 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2168 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2169 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2170 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2171 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2172 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2173 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2174 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2175 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2176 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2177 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2178 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2179 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2180 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2181 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2182 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2183 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2184 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2185 = new cjs.Graphics().moveTo(-65.2,-41.3).lineTo(65.2,-70.6).lineTo(56.3,119.8).lineTo(-62.6,189).closePath();
	var mask_graphics_2186 = new cjs.Graphics().moveTo(-64.5,-41.3).lineTo(65.9,-70.6).lineTo(57,119.8).lineTo(-61.9,189).closePath();
	var mask_graphics_2187 = new cjs.Graphics().moveTo(-63.6,-41.3).lineTo(66.8,-70.6).lineTo(57.9,119.8).lineTo(-61,189).closePath();
	var mask_graphics_2188 = new cjs.Graphics().moveTo(-62.6,-41.3).lineTo(67.7,-70.6).lineTo(58.9,119.8).lineTo(-60,189).closePath();
	var mask_graphics_2189 = new cjs.Graphics().moveTo(-61.7,-41.3).lineTo(68.7,-70.6).lineTo(59.8,119.8).lineTo(-59.1,189).closePath();
	var mask_graphics_2190 = new cjs.Graphics().moveTo(-60.7,-41.3).lineTo(69.6,-70.6).lineTo(60.8,119.8).lineTo(-58.1,189).closePath();
	var mask_graphics_2191 = new cjs.Graphics().moveTo(-59.8,-41.3).lineTo(70.5,-70.6).lineTo(61.7,119.8).lineTo(-57.2,189).closePath();
	var mask_graphics_2192 = new cjs.Graphics().moveTo(-58.9,-41.3).lineTo(71.5,-70.6).lineTo(62.6,119.8).lineTo(-56.3,189).closePath();
	var mask_graphics_2193 = new cjs.Graphics().moveTo(-57.9,-41.3).lineTo(72.4,-70.6).lineTo(63.6,119.8).lineTo(-55.3,189).closePath();
	var mask_graphics_2194 = new cjs.Graphics().moveTo(-57,-41.3).lineTo(73.3,-70.6).lineTo(64.5,119.8).lineTo(-54.4,189).closePath();
	var mask_graphics_2195 = new cjs.Graphics().moveTo(-56.1,-41.3).lineTo(74.3,-70.6).lineTo(65.4,119.8).lineTo(-53.5,189).closePath();
	var mask_graphics_2196 = new cjs.Graphics().moveTo(-55.1,-41.3).lineTo(75.2,-70.6).lineTo(66.4,119.8).lineTo(-52.5,189).closePath();
	var mask_graphics_2197 = new cjs.Graphics().moveTo(-54.2,-41.3).lineTo(76.2,-70.6).lineTo(67.3,119.8).lineTo(-51.6,189).closePath();
	var mask_graphics_2198 = new cjs.Graphics().moveTo(-53.3,-41.3).lineTo(77.1,-70.6).lineTo(68.2,119.8).lineTo(-50.7,189).closePath();
	var mask_graphics_2199 = new cjs.Graphics().moveTo(-52.3,-41.3).lineTo(78,-70.6).lineTo(69.2,119.8).lineTo(-49.7,189).closePath();
	var mask_graphics_2200 = new cjs.Graphics().moveTo(-51.4,-41.3).lineTo(79,-70.6).lineTo(70.1,119.8).lineTo(-48.8,189).closePath();
	var mask_graphics_2201 = new cjs.Graphics().moveTo(-50.5,-41.3).lineTo(79.9,-70.6).lineTo(71,119.8).lineTo(-47.9,189).closePath();
	var mask_graphics_2202 = new cjs.Graphics().moveTo(-49.5,-41.3).lineTo(80.8,-70.6).lineTo(72,119.8).lineTo(-46.9,189).closePath();
	var mask_graphics_2203 = new cjs.Graphics().moveTo(-48.6,-41.3).lineTo(81.8,-70.6).lineTo(72.9,119.8).lineTo(-46,189).closePath();
	var mask_graphics_2204 = new cjs.Graphics().moveTo(-47.6,-41.3).lineTo(82.7,-70.6).lineTo(73.9,119.8).lineTo(-45,189).closePath();
	var mask_graphics_2205 = new cjs.Graphics().moveTo(-46.7,-41.3).lineTo(83.6,-70.6).lineTo(74.8,119.8).lineTo(-44.1,189).closePath();
	var mask_graphics_2206 = new cjs.Graphics().moveTo(-45.8,-41.3).lineTo(84.6,-70.6).lineTo(75.7,119.8).lineTo(-43.2,189).closePath();
	var mask_graphics_2207 = new cjs.Graphics().moveTo(-44.8,-41.3).lineTo(85.5,-70.6).lineTo(76.7,119.8).lineTo(-42.2,189).closePath();
	var mask_graphics_2208 = new cjs.Graphics().moveTo(-43.9,-41.3).lineTo(86.4,-70.6).lineTo(77.6,119.8).lineTo(-41.3,189).closePath();
	var mask_graphics_2209 = new cjs.Graphics().moveTo(-43,-41.3).lineTo(87.4,-70.6).lineTo(78.5,119.8).lineTo(-40.4,189).closePath();
	var mask_graphics_2210 = new cjs.Graphics().moveTo(-42,-41.3).lineTo(88.3,-70.6).lineTo(79.5,119.8).lineTo(-39.4,189).closePath();
	var mask_graphics_2211 = new cjs.Graphics().moveTo(-41.1,-41.3).lineTo(89.2,-70.6).lineTo(80.4,119.8).lineTo(-38.5,189).closePath();
	var mask_graphics_2212 = new cjs.Graphics().moveTo(-40.2,-41.3).lineTo(90.2,-70.6).lineTo(81.3,119.8).lineTo(-37.6,189).closePath();
	var mask_graphics_2213 = new cjs.Graphics().moveTo(-39.2,-41.3).lineTo(91.1,-70.6).lineTo(82.3,119.8).lineTo(-36.6,189).closePath();
	var mask_graphics_2214 = new cjs.Graphics().moveTo(-38.3,-41.3).lineTo(92.1,-70.6).lineTo(83.2,119.8).lineTo(-35.7,189).closePath();
	var mask_graphics_2215 = new cjs.Graphics().moveTo(-37.4,-41.3).lineTo(93,-70.6).lineTo(84.1,119.8).lineTo(-34.8,189).closePath();
	var mask_graphics_2216 = new cjs.Graphics().moveTo(-36.4,-41.3).lineTo(93.9,-70.6).lineTo(85.1,119.8).lineTo(-33.8,189).closePath();
	var mask_graphics_2217 = new cjs.Graphics().moveTo(-35.5,-41.3).lineTo(94.9,-70.6).lineTo(86,119.8).lineTo(-32.9,189).closePath();
	var mask_graphics_2218 = new cjs.Graphics().moveTo(-34.6,-41.3).lineTo(95.8,-70.6).lineTo(86.9,119.8).lineTo(-32,189).closePath();
	var mask_graphics_2219 = new cjs.Graphics().moveTo(-33.6,-41.3).lineTo(96.7,-70.6).lineTo(87.9,119.8).lineTo(-31,189).closePath();
	var mask_graphics_2220 = new cjs.Graphics().moveTo(-32.7,-41.3).lineTo(97.7,-70.6).lineTo(88.8,119.8).lineTo(-30.1,189).closePath();
	var mask_graphics_2221 = new cjs.Graphics().moveTo(-31.7,-41.3).lineTo(98.6,-70.6).lineTo(89.8,119.8).lineTo(-29.1,189).closePath();
	var mask_graphics_2222 = new cjs.Graphics().moveTo(-30.8,-41.3).lineTo(99.5,-70.6).lineTo(90.7,119.8).lineTo(-28.2,189).closePath();
	var mask_graphics_2223 = new cjs.Graphics().moveTo(-29.9,-41.3).lineTo(100.5,-70.6).lineTo(91.6,119.8).lineTo(-27.3,189).closePath();
	var mask_graphics_2224 = new cjs.Graphics().moveTo(-28.9,-41.3).lineTo(101.4,-70.6).lineTo(92.6,119.8).lineTo(-26.3,189).closePath();
	var mask_graphics_2225 = new cjs.Graphics().moveTo(-28,-41.3).lineTo(102.3,-70.6).lineTo(93.5,119.8).lineTo(-25.4,189).closePath();
	var mask_graphics_2226 = new cjs.Graphics().moveTo(-27.1,-41.3).lineTo(103.3,-70.6).lineTo(94.4,119.8).lineTo(-24.5,189).closePath();
	var mask_graphics_2227 = new cjs.Graphics().moveTo(-26.1,-41.3).lineTo(104.2,-70.6).lineTo(95.4,119.8).lineTo(-23.5,189).closePath();
	var mask_graphics_2228 = new cjs.Graphics().moveTo(-25.2,-41.3).lineTo(105.2,-70.6).lineTo(96.3,119.8).lineTo(-22.6,189).closePath();
	var mask_graphics_2229 = new cjs.Graphics().moveTo(-24.3,-41.3).lineTo(106.1,-70.6).lineTo(97.2,119.8).lineTo(-21.7,189).closePath();
	var mask_graphics_2230 = new cjs.Graphics().moveTo(-23.3,-41.3).lineTo(107,-70.6).lineTo(98.2,119.8).lineTo(-20.7,189).closePath();
	var mask_graphics_2231 = new cjs.Graphics().moveTo(-22.4,-41.3).lineTo(108,-70.6).lineTo(99.1,119.8).lineTo(-19.8,189).closePath();
	var mask_graphics_2232 = new cjs.Graphics().moveTo(-21.5,-41.3).lineTo(108.9,-70.6).lineTo(100,119.8).lineTo(-18.9,189).closePath();
	var mask_graphics_2233 = new cjs.Graphics().moveTo(-20.5,-41.3).lineTo(109.8,-70.6).lineTo(101,119.8).lineTo(-17.9,189).closePath();
	var mask_graphics_2234 = new cjs.Graphics().moveTo(-19.6,-41.3).lineTo(110.8,-70.6).lineTo(101.9,119.8).lineTo(-17,189).closePath();
	var mask_graphics_2235 = new cjs.Graphics().moveTo(-18.6,-41.3).lineTo(111.7,-70.6).lineTo(102.9,119.8).lineTo(-16,189).closePath();
	var mask_graphics_2236 = new cjs.Graphics().moveTo(-17.7,-41.3).lineTo(112.6,-70.6).lineTo(103.8,119.8).lineTo(-15.1,189).closePath();
	var mask_graphics_2237 = new cjs.Graphics().moveTo(-16.8,-41.3).lineTo(113.6,-70.6).lineTo(104.7,119.8).lineTo(-14.2,189).closePath();
	var mask_graphics_2238 = new cjs.Graphics().moveTo(-15.8,-41.3).lineTo(114.5,-70.6).lineTo(105.7,119.8).lineTo(-13.2,189).closePath();
	var mask_graphics_2239 = new cjs.Graphics().moveTo(-14.9,-41.3).lineTo(115.4,-70.6).lineTo(106.6,119.8).lineTo(-12.3,189).closePath();
	var mask_graphics_2240 = new cjs.Graphics().moveTo(-14,-41.3).lineTo(116.4,-70.6).lineTo(107.5,119.8).lineTo(-11.4,189).closePath();
	var mask_graphics_2241 = new cjs.Graphics().moveTo(-13,-41.3).lineTo(117.3,-70.6).lineTo(108.5,119.8).lineTo(-10.4,189).closePath();
	var mask_graphics_2242 = new cjs.Graphics().moveTo(-12.1,-41.3).lineTo(118.2,-70.6).lineTo(109.4,119.8).lineTo(-9.5,189).closePath();
	var mask_graphics_2243 = new cjs.Graphics().moveTo(-11.2,-41.3).lineTo(119.2,-70.6).lineTo(110.3,119.8).lineTo(-8.6,189).closePath();
	var mask_graphics_2244 = new cjs.Graphics().moveTo(-10.2,-41.3).lineTo(120.1,-70.6).lineTo(111.3,119.8).lineTo(-7.6,189).closePath();
	var mask_graphics_2245 = new cjs.Graphics().moveTo(-9.3,-41.3).lineTo(121.1,-70.6).lineTo(112.2,119.8).lineTo(-6.7,189).closePath();
	var mask_graphics_2246 = new cjs.Graphics().moveTo(-8.4,-41.3).lineTo(122,-70.6).lineTo(113.1,119.8).lineTo(-5.8,189).closePath();
	var mask_graphics_2247 = new cjs.Graphics().moveTo(-65.2,-100.5).lineTo(65.2,-129.8).lineTo(56.3,60.6).lineTo(-62.6,129.8).closePath();

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(2115).to({graphics:mask_graphics_2115,x:-65.725,y:189}).wait(1).to({graphics:mask_graphics_2116,x:-64.4042,y:189}).wait(1).to({graphics:mask_graphics_2117,x:-62.5333,y:189}).wait(1).to({graphics:mask_graphics_2118,x:-60.6625,y:189}).wait(1).to({graphics:mask_graphics_2119,x:-58.7917,y:189}).wait(1).to({graphics:mask_graphics_2120,x:-56.9208,y:189}).wait(1).to({graphics:mask_graphics_2121,x:-55.05,y:189}).wait(1).to({graphics:mask_graphics_2122,x:-53.1792,y:189}).wait(1).to({graphics:mask_graphics_2123,x:-51.3083,y:189}).wait(1).to({graphics:mask_graphics_2124,x:-49.4375,y:189}).wait(1).to({graphics:mask_graphics_2125,x:-47.5667,y:189}).wait(1).to({graphics:mask_graphics_2126,x:-45.6958,y:189}).wait(1).to({graphics:mask_graphics_2127,x:-43.825,y:189}).wait(1).to({graphics:mask_graphics_2128,x:-41.9542,y:189}).wait(1).to({graphics:mask_graphics_2129,x:-40.0833,y:189}).wait(1).to({graphics:mask_graphics_2130,x:-38.2125,y:189}).wait(1).to({graphics:mask_graphics_2131,x:-36.3417,y:189}).wait(1).to({graphics:mask_graphics_2132,x:-34.4708,y:189}).wait(1).to({graphics:mask_graphics_2133,x:-32.6,y:189}).wait(1).to({graphics:mask_graphics_2134,x:-30.7292,y:189}).wait(1).to({graphics:mask_graphics_2135,x:-28.8583,y:189}).wait(1).to({graphics:mask_graphics_2136,x:-26.9875,y:189}).wait(1).to({graphics:mask_graphics_2137,x:-25.1167,y:189}).wait(1).to({graphics:mask_graphics_2138,x:-23.2458,y:189}).wait(1).to({graphics:mask_graphics_2139,x:-21.375,y:189}).wait(1).to({graphics:mask_graphics_2140,x:-19.5042,y:189}).wait(1).to({graphics:mask_graphics_2141,x:-17.6333,y:189}).wait(1).to({graphics:mask_graphics_2142,x:-15.7625,y:189}).wait(1).to({graphics:mask_graphics_2143,x:-13.8917,y:189}).wait(1).to({graphics:mask_graphics_2144,x:-12.0208,y:189}).wait(1).to({graphics:mask_graphics_2145,x:-10.15,y:189}).wait(1).to({graphics:mask_graphics_2146,x:-8.2792,y:189}).wait(1).to({graphics:mask_graphics_2147,x:-6.4083,y:189}).wait(1).to({graphics:mask_graphics_2148,x:-4.5375,y:189}).wait(1).to({graphics:mask_graphics_2149,x:-2.6667,y:189}).wait(1).to({graphics:mask_graphics_2150,x:-0.7958,y:189}).wait(1).to({graphics:mask_graphics_2151,x:1.075,y:189}).wait(1).to({graphics:mask_graphics_2152,x:2.9458,y:189}).wait(1).to({graphics:mask_graphics_2153,x:4.8167,y:189}).wait(1).to({graphics:mask_graphics_2154,x:6.6875,y:189}).wait(1).to({graphics:mask_graphics_2155,x:8.5583,y:189}).wait(1).to({graphics:mask_graphics_2156,x:10.4292,y:189}).wait(1).to({graphics:mask_graphics_2157,x:12.3,y:189}).wait(1).to({graphics:mask_graphics_2158,x:14.1708,y:189}).wait(1).to({graphics:mask_graphics_2159,x:16.0417,y:189}).wait(1).to({graphics:mask_graphics_2160,x:17.9125,y:189}).wait(1).to({graphics:mask_graphics_2161,x:19.7833,y:189}).wait(1).to({graphics:mask_graphics_2162,x:21.6542,y:189}).wait(1).to({graphics:mask_graphics_2163,x:23.525,y:189}).wait(1).to({graphics:mask_graphics_2164,x:25.3958,y:189}).wait(1).to({graphics:mask_graphics_2165,x:27.2667,y:189}).wait(1).to({graphics:mask_graphics_2166,x:29.1375,y:189}).wait(1).to({graphics:mask_graphics_2167,x:31.0083,y:189}).wait(1).to({graphics:mask_graphics_2168,x:32.8792,y:189}).wait(1).to({graphics:mask_graphics_2169,x:34.75,y:189}).wait(1).to({graphics:mask_graphics_2170,x:36.6208,y:189}).wait(1).to({graphics:mask_graphics_2171,x:38.4917,y:189}).wait(1).to({graphics:mask_graphics_2172,x:40.3625,y:189}).wait(1).to({graphics:mask_graphics_2173,x:42.2333,y:189}).wait(1).to({graphics:mask_graphics_2174,x:44.1042,y:189}).wait(1).to({graphics:mask_graphics_2175,x:45.975,y:189}).wait(1).to({graphics:mask_graphics_2176,x:47.8458,y:189}).wait(1).to({graphics:mask_graphics_2177,x:49.7167,y:189}).wait(1).to({graphics:mask_graphics_2178,x:51.5875,y:189}).wait(1).to({graphics:mask_graphics_2179,x:53.4583,y:189}).wait(1).to({graphics:mask_graphics_2180,x:55.3292,y:189}).wait(1).to({graphics:mask_graphics_2181,x:57.2,y:189}).wait(1).to({graphics:mask_graphics_2182,x:59.0708,y:189}).wait(1).to({graphics:mask_graphics_2183,x:60.9417,y:189}).wait(1).to({graphics:mask_graphics_2184,x:62.8125,y:189}).wait(1).to({graphics:mask_graphics_2185,x:64.6833,y:189}).wait(1).to({graphics:mask_graphics_2186,x:65.8646,y:189}).wait(1).to({graphics:mask_graphics_2187,x:66.8,y:189}).wait(1).to({graphics:mask_graphics_2188,x:67.7354,y:189}).wait(1).to({graphics:mask_graphics_2189,x:68.6708,y:189}).wait(1).to({graphics:mask_graphics_2190,x:69.6063,y:189}).wait(1).to({graphics:mask_graphics_2191,x:70.5417,y:189}).wait(1).to({graphics:mask_graphics_2192,x:71.4771,y:189}).wait(1).to({graphics:mask_graphics_2193,x:72.4125,y:189}).wait(1).to({graphics:mask_graphics_2194,x:73.3479,y:189}).wait(1).to({graphics:mask_graphics_2195,x:74.2833,y:189}).wait(1).to({graphics:mask_graphics_2196,x:75.2188,y:189}).wait(1).to({graphics:mask_graphics_2197,x:76.1542,y:189}).wait(1).to({graphics:mask_graphics_2198,x:77.0896,y:189}).wait(1).to({graphics:mask_graphics_2199,x:78.025,y:189}).wait(1).to({graphics:mask_graphics_2200,x:78.9604,y:189}).wait(1).to({graphics:mask_graphics_2201,x:79.8958,y:189}).wait(1).to({graphics:mask_graphics_2202,x:80.8313,y:189}).wait(1).to({graphics:mask_graphics_2203,x:81.7667,y:189}).wait(1).to({graphics:mask_graphics_2204,x:82.7021,y:189}).wait(1).to({graphics:mask_graphics_2205,x:83.6375,y:189}).wait(1).to({graphics:mask_graphics_2206,x:84.5729,y:189}).wait(1).to({graphics:mask_graphics_2207,x:85.5083,y:189}).wait(1).to({graphics:mask_graphics_2208,x:86.4438,y:189}).wait(1).to({graphics:mask_graphics_2209,x:87.3792,y:189}).wait(1).to({graphics:mask_graphics_2210,x:88.3146,y:189}).wait(1).to({graphics:mask_graphics_2211,x:89.25,y:189}).wait(1).to({graphics:mask_graphics_2212,x:90.1854,y:189}).wait(1).to({graphics:mask_graphics_2213,x:91.1208,y:189}).wait(1).to({graphics:mask_graphics_2214,x:92.0563,y:189}).wait(1).to({graphics:mask_graphics_2215,x:92.9917,y:189}).wait(1).to({graphics:mask_graphics_2216,x:93.9271,y:189}).wait(1).to({graphics:mask_graphics_2217,x:94.8625,y:189}).wait(1).to({graphics:mask_graphics_2218,x:95.7979,y:189}).wait(1).to({graphics:mask_graphics_2219,x:96.7333,y:189}).wait(1).to({graphics:mask_graphics_2220,x:97.6688,y:189}).wait(1).to({graphics:mask_graphics_2221,x:98.6042,y:189}).wait(1).to({graphics:mask_graphics_2222,x:99.5396,y:189}).wait(1).to({graphics:mask_graphics_2223,x:100.475,y:189}).wait(1).to({graphics:mask_graphics_2224,x:101.4104,y:189}).wait(1).to({graphics:mask_graphics_2225,x:102.3458,y:189}).wait(1).to({graphics:mask_graphics_2226,x:103.2813,y:189}).wait(1).to({graphics:mask_graphics_2227,x:104.2167,y:189}).wait(1).to({graphics:mask_graphics_2228,x:105.1521,y:189}).wait(1).to({graphics:mask_graphics_2229,x:106.0875,y:189}).wait(1).to({graphics:mask_graphics_2230,x:107.0229,y:189}).wait(1).to({graphics:mask_graphics_2231,x:107.9583,y:189}).wait(1).to({graphics:mask_graphics_2232,x:108.8938,y:189}).wait(1).to({graphics:mask_graphics_2233,x:109.8292,y:189}).wait(1).to({graphics:mask_graphics_2234,x:110.7646,y:189}).wait(1).to({graphics:mask_graphics_2235,x:111.7,y:189}).wait(1).to({graphics:mask_graphics_2236,x:112.6354,y:189}).wait(1).to({graphics:mask_graphics_2237,x:113.5708,y:189}).wait(1).to({graphics:mask_graphics_2238,x:114.5063,y:189}).wait(1).to({graphics:mask_graphics_2239,x:115.4417,y:189}).wait(1).to({graphics:mask_graphics_2240,x:116.3771,y:189}).wait(1).to({graphics:mask_graphics_2241,x:117.3125,y:189}).wait(1).to({graphics:mask_graphics_2242,x:118.2479,y:189}).wait(1).to({graphics:mask_graphics_2243,x:119.1833,y:189}).wait(1).to({graphics:mask_graphics_2244,x:120.1188,y:189}).wait(1).to({graphics:mask_graphics_2245,x:121.0542,y:189}).wait(1).to({graphics:mask_graphics_2246,x:121.9896,y:189}).wait(1).to({graphics:mask_graphics_2247,x:180.725,y:248.2}).wait(38).to({graphics:null,x:0,y:0}).wait(829));

	// maskW
	this.instance_32 = new lib.natalja_walkingcopy();
	this.instance_32.setTransform(-71.2,351.35,1,1,0,0,180,179.5,242.6);
	this.instance_32._off = true;

	var maskedShapeInstanceList = [this.instance_32];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_32).wait(2115).to({_off:false},0).to({x:175.8},132).wait(37).to({x:169.8},0).to({_off:true},1).wait(829));

	// natalja_mirror (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	var mask_1_graphics_2285 = new cjs.Graphics().moveTo(-68.5,-109.5).lineTo(68.5,-141.5).lineTo(51.6,63.5).lineTo(-68.5,141.5).closePath();
	var mask_1_graphics_2457 = new cjs.Graphics().moveTo(-68.5,-109.5).lineTo(68.5,-141.5).lineTo(51.6,63.5).lineTo(-68.5,141.5).closePath();
	var mask_1_graphics_2458 = new cjs.Graphics().moveTo(-15.1,-52.5).lineTo(121.9,-84.5).lineTo(105,120.5).lineTo(-15.1,198.5).closePath();
	var mask_1_graphics_2459 = new cjs.Graphics().moveTo(-18.6,-52.5).lineTo(118.4,-84.5).lineTo(101.4,120.5).lineTo(-18.6,198.5).closePath();
	var mask_1_graphics_2460 = new cjs.Graphics().moveTo(-22.2,-52.5).lineTo(114.8,-84.5).lineTo(97.9,120.5).lineTo(-22.2,198.5).closePath();
	var mask_1_graphics_2461 = new cjs.Graphics().moveTo(-25.7,-52.5).lineTo(111.3,-84.5).lineTo(94.3,120.5).lineTo(-25.7,198.5).closePath();
	var mask_1_graphics_2462 = new cjs.Graphics().moveTo(-29.3,-52.5).lineTo(107.7,-84.5).lineTo(90.8,120.5).lineTo(-29.3,198.5).closePath();
	var mask_1_graphics_2463 = new cjs.Graphics().moveTo(-32.8,-52.5).lineTo(104.2,-84.5).lineTo(87.2,120.5).lineTo(-32.8,198.5).closePath();
	var mask_1_graphics_2464 = new cjs.Graphics().moveTo(-36.4,-52.5).lineTo(100.6,-84.5).lineTo(83.7,120.5).lineTo(-36.4,198.5).closePath();
	var mask_1_graphics_2465 = new cjs.Graphics().moveTo(-39.9,-52.5).lineTo(97.1,-84.5).lineTo(80.1,120.5).lineTo(-39.9,198.5).closePath();
	var mask_1_graphics_2466 = new cjs.Graphics().moveTo(-43.5,-52.5).lineTo(93.5,-84.5).lineTo(76.6,120.5).lineTo(-43.5,198.5).closePath();
	var mask_1_graphics_2467 = new cjs.Graphics().moveTo(-47,-52.5).lineTo(90,-84.5).lineTo(73,120.5).lineTo(-47,198.5).closePath();
	var mask_1_graphics_2468 = new cjs.Graphics().moveTo(-50.6,-52.5).lineTo(86.4,-84.5).lineTo(69.5,120.5).lineTo(-50.6,198.5).closePath();
	var mask_1_graphics_2469 = new cjs.Graphics().moveTo(-54.1,-52.5).lineTo(82.9,-84.5).lineTo(65.9,120.5).lineTo(-54.1,198.5).closePath();
	var mask_1_graphics_2470 = new cjs.Graphics().moveTo(-57.7,-52.5).lineTo(79.3,-84.5).lineTo(62.4,120.5).lineTo(-57.7,198.5).closePath();
	var mask_1_graphics_2471 = new cjs.Graphics().moveTo(-61.2,-52.5).lineTo(75.8,-84.5).lineTo(58.8,120.5).lineTo(-61.2,198.5).closePath();
	var mask_1_graphics_2472 = new cjs.Graphics().moveTo(-64.8,-52.5).lineTo(72.2,-84.5).lineTo(55.3,120.5).lineTo(-64.8,198.5).closePath();
	var mask_1_graphics_2473 = new cjs.Graphics().moveTo(-68.3,-52.5).lineTo(68.7,-84.5).lineTo(51.7,120.5).lineTo(-68.3,198.5).closePath();
	var mask_1_graphics_2474 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.6,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2475 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.6,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2476 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.6,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2477 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.5,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2478 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.5,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2479 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.5,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2480 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.6,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2481 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.6,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2482 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.6,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2483 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.5,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2484 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.5,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2485 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.5,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2486 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.5,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2487 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.6,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2488 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.6,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2489 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.6,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2490 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.5,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2491 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.5,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2492 = new cjs.Graphics().moveTo(-68.5,-52.5).lineTo(68.5,-84.5).lineTo(51.5,120.5).lineTo(-68.5,198.5).closePath();
	var mask_1_graphics_2493 = new cjs.Graphics().moveTo(-70.8,-52.5).lineTo(66.2,-84.5).lineTo(49.2,120.5).lineTo(-70.8,198.5).closePath();
	var mask_1_graphics_2494 = new cjs.Graphics().moveTo(-74.4,-52.5).lineTo(62.6,-84.5).lineTo(45.7,120.5).lineTo(-74.4,198.5).closePath();
	var mask_1_graphics_2495 = new cjs.Graphics().moveTo(-77.9,-52.5).lineTo(59.1,-84.5).lineTo(42.1,120.5).lineTo(-77.9,198.5).closePath();
	var mask_1_graphics_2496 = new cjs.Graphics().moveTo(-81.5,-52.5).lineTo(55.5,-84.5).lineTo(38.6,120.5).lineTo(-81.5,198.5).closePath();
	var mask_1_graphics_2497 = new cjs.Graphics().moveTo(-85,-52.5).lineTo(52,-84.5).lineTo(35,120.5).lineTo(-85,198.5).closePath();
	var mask_1_graphics_2498 = new cjs.Graphics().moveTo(-88.6,-52.5).lineTo(48.4,-84.5).lineTo(31.5,120.5).lineTo(-88.6,198.5).closePath();
	var mask_1_graphics_2499 = new cjs.Graphics().moveTo(-92.1,-52.5).lineTo(44.9,-84.5).lineTo(27.9,120.5).lineTo(-92.1,198.5).closePath();
	var mask_1_graphics_2500 = new cjs.Graphics().moveTo(-95.7,-52.5).lineTo(41.3,-84.5).lineTo(24.4,120.5).lineTo(-95.7,198.5).closePath();
	var mask_1_graphics_2501 = new cjs.Graphics().moveTo(-99.2,-52.5).lineTo(37.8,-84.5).lineTo(20.8,120.5).lineTo(-99.2,198.5).closePath();
	var mask_1_graphics_2502 = new cjs.Graphics().moveTo(-102.8,-52.5).lineTo(34.2,-84.5).lineTo(17.3,120.5).lineTo(-102.8,198.5).closePath();
	var mask_1_graphics_2503 = new cjs.Graphics().moveTo(-106.3,-52.5).lineTo(30.7,-84.5).lineTo(13.7,120.5).lineTo(-106.3,198.5).closePath();
	var mask_1_graphics_2504 = new cjs.Graphics().moveTo(-109.9,-52.5).lineTo(27.1,-84.5).lineTo(10.2,120.5).lineTo(-109.9,198.5).closePath();
	var mask_1_graphics_2505 = new cjs.Graphics().moveTo(-113.4,-52.5).lineTo(23.6,-84.5).lineTo(6.6,120.5).lineTo(-113.4,198.5).closePath();
	var mask_1_graphics_2506 = new cjs.Graphics().moveTo(-68.5,-109.5).lineTo(68.5,-141.5).lineTo(51.6,63.5).lineTo(-68.5,141.5).closePath();

	this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:null,x:0,y:0}).wait(2285).to({graphics:mask_1_graphics_2285,x:182.5,y:255.475}).wait(172).to({graphics:mask_1_graphics_2457,x:182.5,y:255.475}).wait(1).to({graphics:mask_1_graphics_2458,x:121.949,y:198.475}).wait(1).to({graphics:mask_1_graphics_2459,x:118.398,y:198.475}).wait(1).to({graphics:mask_1_graphics_2460,x:114.8469,y:198.475}).wait(1).to({graphics:mask_1_graphics_2461,x:111.2959,y:198.475}).wait(1).to({graphics:mask_1_graphics_2462,x:107.7449,y:198.475}).wait(1).to({graphics:mask_1_graphics_2463,x:104.1939,y:198.475}).wait(1).to({graphics:mask_1_graphics_2464,x:100.6429,y:198.475}).wait(1).to({graphics:mask_1_graphics_2465,x:97.0918,y:198.475}).wait(1).to({graphics:mask_1_graphics_2466,x:93.5408,y:198.475}).wait(1).to({graphics:mask_1_graphics_2467,x:89.9898,y:198.475}).wait(1).to({graphics:mask_1_graphics_2468,x:86.4388,y:198.475}).wait(1).to({graphics:mask_1_graphics_2469,x:82.8878,y:198.475}).wait(1).to({graphics:mask_1_graphics_2470,x:79.3367,y:198.475}).wait(1).to({graphics:mask_1_graphics_2471,x:75.7857,y:198.475}).wait(1).to({graphics:mask_1_graphics_2472,x:72.2347,y:198.475}).wait(1).to({graphics:mask_1_graphics_2473,x:68.6837,y:198.475}).wait(1).to({graphics:mask_1_graphics_2474,x:61.7653,y:198.475}).wait(1).to({graphics:mask_1_graphics_2475,x:54.6633,y:198.475}).wait(1).to({graphics:mask_1_graphics_2476,x:47.5612,y:198.475}).wait(1).to({graphics:mask_1_graphics_2477,x:40.4592,y:198.475}).wait(1).to({graphics:mask_1_graphics_2478,x:33.3571,y:198.475}).wait(1).to({graphics:mask_1_graphics_2479,x:26.2551,y:198.475}).wait(1).to({graphics:mask_1_graphics_2480,x:19.1531,y:198.475}).wait(1).to({graphics:mask_1_graphics_2481,x:12.051,y:198.475}).wait(1).to({graphics:mask_1_graphics_2482,x:4.949,y:198.475}).wait(1).to({graphics:mask_1_graphics_2483,x:-2.1531,y:198.475}).wait(1).to({graphics:mask_1_graphics_2484,x:-9.2551,y:198.475}).wait(1).to({graphics:mask_1_graphics_2485,x:-16.3571,y:198.475}).wait(1).to({graphics:mask_1_graphics_2486,x:-23.4592,y:198.475}).wait(1).to({graphics:mask_1_graphics_2487,x:-30.5612,y:198.475}).wait(1).to({graphics:mask_1_graphics_2488,x:-37.6633,y:198.475}).wait(1).to({graphics:mask_1_graphics_2489,x:-44.7653,y:198.475}).wait(1).to({graphics:mask_1_graphics_2490,x:-51.8673,y:198.475}).wait(1).to({graphics:mask_1_graphics_2491,x:-58.9694,y:198.475}).wait(1).to({graphics:mask_1_graphics_2492,x:-66.0714,y:198.475}).wait(1).to({graphics:mask_1_graphics_2493,x:-70.8367,y:198.475}).wait(1).to({graphics:mask_1_graphics_2494,x:-74.3878,y:198.475}).wait(1).to({graphics:mask_1_graphics_2495,x:-77.9388,y:198.475}).wait(1).to({graphics:mask_1_graphics_2496,x:-81.4898,y:198.475}).wait(1).to({graphics:mask_1_graphics_2497,x:-85.0408,y:198.475}).wait(1).to({graphics:mask_1_graphics_2498,x:-88.5918,y:198.475}).wait(1).to({graphics:mask_1_graphics_2499,x:-92.1429,y:198.475}).wait(1).to({graphics:mask_1_graphics_2500,x:-95.6939,y:198.475}).wait(1).to({graphics:mask_1_graphics_2501,x:-99.2449,y:198.475}).wait(1).to({graphics:mask_1_graphics_2502,x:-102.7959,y:198.475}).wait(1).to({graphics:mask_1_graphics_2503,x:-106.3469,y:198.475}).wait(1).to({graphics:mask_1_graphics_2504,x:-109.898,y:198.475}).wait(1).to({graphics:mask_1_graphics_2505,x:-113.449,y:198.475}).wait(1).to({graphics:mask_1_graphics_2506,x:-165.5,y:255.475}).wait(29).to({graphics:null,x:0,y:0}).wait(579));

	// mask_idn
	this.instance_33 = new lib.natalja_dressedup();
	this.instance_33.setTransform(164.6,351.05,1,1,0,0,180,179.7,242.7);
	this.instance_33._off = true;

	var maskedShapeInstanceList = [this.instance_33];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_1;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_33).wait(2285).to({_off:false},0).wait(172).to({x:-183.4},49).to({_off:true},29).wait(579));

	// natalja_dressedup
	this.instance_34 = new lib.natalja_walkingcopy();
	this.instance_34.setTransform(631.95,303.3,1,1,0,0,0,153.7,209.7);

	this.instance_35 = new lib.natalja_dressedup();
	this.instance_35.setTransform(631.95,303.3,1,1,0,0,0,153.7,209.7);
	this.instance_35._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_34}]},2087).to({state:[{t:this.instance_35}]},198).to({state:[{t:this.instance_35}]},172).to({state:[{t:this.instance_35}]},78).to({state:[]},1).to({state:[]},72).wait(506));
	this.timeline.addTween(cjs.Tween.get(this.instance_35).wait(2285).to({_off:false},0).wait(172).to({x:960.95},78).to({_off:true},1).wait(578));

	// mirror
	this.instance_36 = new lib.mirror_perspective();
	this.instance_36.setTransform(-133,193,0.5897,0.5897);
	this.instance_36._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_36).wait(2087).to({_off:false},0).to({scaleX:0.5474,scaleY:0.5474,x:165,y:188},160).wait(210).to({x:-179},49).to({_off:true},30).wait(578));

	// empress
	this.instance_37 = new lib.elizavetaMC();
	this.instance_37.setTransform(91,167,1,1,0,0,0,-1,1);
	this.instance_37.alpha = 0;
	this.instance_37._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_37).wait(1985).to({_off:false},0).to({x:132,y:212,alpha:0.4883},51).to({x:180,y:223,alpha:0},51).to({_off:true},3).wait(1024));

	// dresser
	this.instance_38 = new lib.dresser();
	this.instance_38.setTransform(-173.65,381.85,0.5187,0.5186,0,0,0,-35.8,241.2);
	this.instance_38._off = true;

	this.instance_39 = new lib.dresser_framebyframe();
	this.instance_39.setTransform(393.15,391.6,0.5187,0.5186,0,0,0,-35.8,241.2);

	this.instance_40 = new lib.dresser_showQueen();
	this.instance_40.setTransform(393.15,391.6,0.51,0.5186,0,0,180,-35.7,241.2);
	this.instance_40._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_38}]},1807).to({state:[{t:this.instance_38}]},58).to({state:[{t:this.instance_39}]},3).to({state:[{t:this.instance_40}]},87).to({state:[{t:this.instance_40}]},106).to({state:[{t:this.instance_40}]},26).to({state:[]},3).to({state:[]},518).wait(506));
	this.timeline.addTween(cjs.Tween.get(this.instance_38).wait(1807).to({_off:false},0).to({x:379.15,y:359.6},58).to({_off:true},3).wait(1246));
	this.timeline.addTween(cjs.Tween.get(this.instance_40).wait(1955).to({_off:false},0).wait(106).to({alpha:0},26).to({_off:true},3).wait(1024));

	// clothing
	this.instance_41 = new lib.head_smallerMC();
	this.instance_41.setTransform(643.55,154.9,0.3572,0.3571,0,0,0,28.9,-24.2);

	this.instance_42 = new lib.upperBody_smallerMC();
	this.instance_42.setTransform(603.5,304.35,0.6858,0.6857,0,0,0,0,-1);

	this.instance_43 = new lib.rightArm_smallerMC();
	this.instance_43.setTransform(529,213.6,0.5243,0.5243,0,0,0,28.4,23.4);

	this.instance_44 = new lib.leftArm_smallerMC();
	this.instance_44.setTransform(678.95,285.25,0.614,0.6136,0,0,0,0,-0.6);

	this.instance_45 = new lib.skirt_smallerMC();
	this.instance_45.setTransform(638,436.8,0.5753,0.5747,0,0,0,0,-1.4);

	this.instance_46 = new lib.leftFoot_smallerMC();
	this.instance_46.setTransform(580,577.75,0.4627,0.461,0,0,0,0,-0.8);

	this.instance_47 = new lib.leftFoot_smallerMC();
	this.instance_47.setTransform(658,575.35,0.5672,0.567,0,0,180,0,-0.4);

	this.instance_48 = new lib.cape_smallerMC();
	this.instance_48.setTransform(709.95,308.75,0.7834,0.7828,0,0,0,0,-0.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_41}]},1875).to({state:[{t:this.instance_41},{t:this.instance_42}]},10).to({state:[{t:this.instance_43,p:{regX:28.4,rotation:0,x:529}},{t:this.instance_41},{t:this.instance_42}]},10).to({state:[{t:this.instance_43,p:{regX:28.4,rotation:0,x:529}},{t:this.instance_41},{t:this.instance_42},{t:this.instance_44}]},10).to({state:[{t:this.instance_45},{t:this.instance_43,p:{regX:28.4,rotation:0,x:529}},{t:this.instance_41},{t:this.instance_42},{t:this.instance_44}]},10).to({state:[{t:this.instance_46},{t:this.instance_45},{t:this.instance_43,p:{regX:28.4,rotation:0,x:529}},{t:this.instance_41},{t:this.instance_42},{t:this.instance_44}]},10).to({state:[{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_43,p:{regX:28.4,rotation:0,x:529}},{t:this.instance_41},{t:this.instance_42},{t:this.instance_44}]},10).to({state:[{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_43,p:{regX:28.4,rotation:0,x:529}},{t:this.instance_41},{t:this.instance_42},{t:this.instance_44}]},10).to({state:[{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_43,p:{regX:150.5,rotation:-33.7113,x:598}},{t:this.instance_41},{t:this.instance_42},{t:this.instance_44}]},68).to({state:[{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_43,p:{regX:150.6,rotation:-63.7109,x:607}},{t:this.instance_41},{t:this.instance_42},{t:this.instance_44}]},8).to({state:[]},66).to({state:[]},521).wait(506));

	// peas_parts
	this.instance_49 = new lib.headSimpleMC();
	this.instance_49.setTransform(644.95,174.5,0.7175,0.7175);

	this.instance_50 = new lib.peas_upperBodyMC();
	this.instance_50.setTransform(646,308.05,1,1.0001);

	this.instance_51 = new lib.peas_leftArmMC();
	this.instance_51.setTransform(679.95,312.5);

	this.instance_52 = new lib.Tween226("synched",0);
	this.instance_52.setTransform(623.95,251.45);

	this.instance_53 = new lib.Tween227("synched",0);
	this.instance_53.setTransform(623.95,254.45);
	this.instance_53._off = true;

	this.instance_54 = new lib.Tween228("synched",0);
	this.instance_54.setTransform(623.95,273.45);
	this.instance_54._off = true;

	this.instance_55 = new lib.Tween229("synched",0);
	this.instance_55.setTransform(621.95,306.05);
	this.instance_55._off = true;

	this.instance_56 = new lib.Tween230("synched",0);
	this.instance_56.setTransform(621.25,322.9);
	this.instance_56._off = true;

	this.instance_57 = new lib.Tween231("synched",0);
	this.instance_57.setTransform(621.25,328.35);
	this.instance_57._off = true;

	this.instance_58 = new lib.Tween232("synched",0);
	this.instance_58.setTransform(621.25,324.6);
	this.instance_58._off = true;

	this.instance_59 = new lib.Tween233("synched",0);
	this.instance_59.setTransform(607.45,324.6);
	this.instance_59._off = true;

	this.instance_60 = new lib.Tween234("synched",0);
	this.instance_60.setTransform(626.4,326.85);

	this.instance_61 = new lib.peas_rightArmMC();
	this.instance_61.setTransform(580,220.95,1,1,29.9984,0,0,0,-37);

	this.instance_62 = new lib.peas_skirtMC();
	this.instance_62.setTransform(637,409,1,0.9048);

	this.instance_63 = new lib.Tween235("synched",0);
	this.instance_63.setTransform(620.9,325.3);

	this.instance_64 = new lib.Tween236("synched",0);
	this.instance_64.setTransform(612.25,325.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_49,p:{regX:0,regY:0,scaleX:0.7175,scaleY:0.7175,x:644.95,y:174.5,rotation:0}}]},1706).to({state:[{t:this.instance_49,p:{regX:-0.1,regY:-1.1,scaleX:0.7172,scaleY:0.7155,x:643.85,y:173.05,rotation:0}},{t:this.instance_50,p:{scaleY:1.0001,x:646,y:308.05,regX:0,regY:0,rotation:0}}]},9).to({state:[{t:this.instance_49,p:{regX:0,regY:-0.6,scaleX:0.7172,scaleY:0.7171,x:643.95,y:172.95,rotation:0}},{t:this.instance_50,p:{scaleY:1,x:649,y:306.5,regX:0,regY:0,rotation:0}},{t:this.instance_51,p:{regX:0,regY:0,rotation:0,x:679.95,y:312.5}}]},10).to({state:[{t:this.instance_52}]},10).to({state:[{t:this.instance_53}]},10).to({state:[{t:this.instance_54}]},4).to({state:[{t:this.instance_55}]},4).to({state:[{t:this.instance_56}]},4).to({state:[{t:this.instance_57}]},4).to({state:[{t:this.instance_58}]},5).to({state:[{t:this.instance_59}]},5).to({state:[{t:this.instance_60}]},5).to({state:[{t:this.instance_62,p:{y:409}},{t:this.instance_49,p:{regX:0,regY:87.9,scaleX:0.3793,scaleY:0.3791,x:637.95,y:198.85,rotation:0}},{t:this.instance_50,p:{scaleY:1,x:642,y:245,regX:0,regY:0,rotation:0}},{t:this.instance_51,p:{regX:10.7,regY:-33.4,rotation:-29.9992,x:677.6,y:216.65}},{t:this.instance_61,p:{rotation:29.9984,x:580,y:220.95,regX:0}}]},5).to({state:[{t:this.instance_62,p:{y:409}},{t:this.instance_49,p:{regX:0,regY:87.9,scaleX:0.3793,scaleY:0.3791,x:637.95,y:198.85,rotation:-7.9455}},{t:this.instance_50,p:{scaleY:1,x:642,y:245,regX:0,regY:0,rotation:0}},{t:this.instance_51,p:{regX:10.7,regY:-33.4,rotation:-29.9992,x:677.6,y:216.65}},{t:this.instance_61,p:{rotation:14.9985,x:579.95,y:221,regX:0}}]},5).to({state:[{t:this.instance_63}]},5).to({state:[{t:this.instance_64}]},5).to({state:[{t:this.instance_62,p:{y:409}},{t:this.instance_49,p:{regX:0.1,regY:87.9,scaleX:0.3793,scaleY:0.3791,x:626.8,y:199.4,rotation:-15.3929}},{t:this.instance_50,p:{scaleY:1,x:637.05,y:285.5,regX:-5,regY:40.5,rotation:-7.4478}},{t:this.instance_51,p:{regX:10.8,regY:-33.5,rotation:-22.4482,x:668.45,y:211.9}},{t:this.instance_61,p:{rotation:7.5511,x:572.15,y:228.9,regX:0}}]},5).to({state:[{t:this.instance_62,p:{y:409}},{t:this.instance_49,p:{regX:0.1,regY:87.9,scaleX:0.3793,scaleY:0.3791,x:635.05,y:198.8,rotation:5.0902}},{t:this.instance_50,p:{scaleY:1,x:637.05,y:285.5,regX:-5,regY:40.5,rotation:-1.964}},{t:this.instance_51,p:{regX:10.7,regY:-33.5,rotation:-16.9631,x:675.3,y:215.2}},{t:this.instance_61,p:{rotation:13.0364,x:577.85,y:222.95,regX:0}}]},5).to({state:[{t:this.instance_62,p:{y:413}},{t:this.instance_49,p:{regX:0.1,regY:88,scaleX:0.3793,scaleY:0.3791,x:635.05,y:198.8,rotation:-2.8774}},{t:this.instance_50,p:{scaleY:1,x:637.05,y:285.5,regX:-5,regY:40.5,rotation:-1.964}},{t:this.instance_51,p:{regX:10.7,regY:-33.5,rotation:-16.9631,x:675.3,y:215.2}},{t:this.instance_61,p:{rotation:-1.9631,x:581.8,y:239.95,regX:-0.1}}]},5).to({state:[]},64).to({state:[]},732).wait(507));
	this.timeline.addTween(cjs.Tween.get(this.instance_53).wait(1745).to({_off:false},0).to({_off:true,y:273.45},4).wait(1365));
	this.timeline.addTween(cjs.Tween.get(this.instance_54).wait(1745).to({_off:false},4).to({_off:true,x:621.95,y:306.05},4).wait(1361));
	this.timeline.addTween(cjs.Tween.get(this.instance_55).wait(1749).to({_off:false},4).to({_off:true,x:621.25,y:322.9},4).wait(1357));
	this.timeline.addTween(cjs.Tween.get(this.instance_56).wait(1753).to({_off:false},4).to({_off:true,y:328.35},4).wait(1353));
	this.timeline.addTween(cjs.Tween.get(this.instance_57).wait(1757).to({_off:false},4).to({_off:true,y:324.6},5).wait(1348));
	this.timeline.addTween(cjs.Tween.get(this.instance_58).wait(1761).to({_off:false},5).to({_off:true,x:607.45},5).wait(1343));
	this.timeline.addTween(cjs.Tween.get(this.instance_59).wait(1766).to({_off:false},5).to({_off:true,x:626.4,y:326.85},5).wait(1338));

	// peasant
	this.instance_65 = new lib.peasant_nataljaMC();
	this.instance_65.setTransform(622,335);
	this.instance_65.alpha = 0;
	this.instance_65._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_65).wait(1868).to({_off:false},0).to({alpha:1},7).to({alpha:0},70).to({_off:true},142).wait(1027));

	// natalja
	this.instance_66 = new lib.natalja();
	this.instance_66.setTransform(296.5,303.75,0.0036,0.0035,0,0,0,430.4,494.4);
	this.instance_66._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_66).wait(379).to({_off:false},0).to({regX:431.4,regY:492.6,scaleX:0.2638,scaleY:0.2592,x:115.8,y:122.15},50).to({x:16.8,alpha:0},34).to({_off:true},15).wait(412).to({_off:false},0).wait(721).to({regX:417,regY:493,scaleX:0.3597,scaleY:0.3596,x:961.5,y:267.7,alpha:1},0).to({x:643},35).wait(60).to({regX:416.8,regY:492.8,scaleX:0.2458,scaleY:0.2457,x:600.65,y:276.5,alpha:0},50).to({_off:true},8).wait(1350));

	// map
	this.map_lemesi = new lib.map1();
	this.map_lemesi.name = "map_lemesi";
	this.map_lemesi.setTransform(317,215,1,1,0,0,0,109.5,89);
	this.map_lemesi.alpha = 0;
	this.map_lemesi._off = true;

	this.timeline.addTween(cjs.Tween.get(this.map_lemesi).wait(139).to({_off:false},0).to({x:330,y:239,alpha:1},98).to({_off:true},226).wait(2651));

	// text
	this.text_3 = new cjs.Text("Ukraine", "italic bold 39px 'Verdana'");
	this.text_3.lineHeight = 49;
	this.text_3.lineWidth = 179;
	this.text_3.parent = this;
	this.text_3.setTransform(240.5,69);
	this.text_3._off = true;

	this.text_4 = new cjs.Text("Ukraine", "italic bold 39px 'Verdana'");
	this.text_4.lineHeight = 49;
	this.text_4.lineWidth = 179;
	this.text_4.parent = this;
	this.text_4.setTransform(240.5,69);

	this.text_5 = new cjs.Text("Grigorij", "italic bold 25px 'Verdana'");
	this.text_5.lineHeight = 32;
	this.text_5.lineWidth = 125;
	this.text_5.parent = this;
	this.text_5.setTransform(253.85,126.5);

	this.instance_67 = new lib.Tween224("synched",0);
	this.instance_67.setTransform(202.75,384);
	this.instance_67._off = true;

	this.instance_68 = new lib.Tween225("synched",0);
	this.instance_68.setTransform(-98.7,384);

	this.text_6 = new cjs.Text("Aleksej Rozum", "bold 29px 'Times New Roman'");
	this.text_6.lineHeight = 34;
	this.text_6.lineWidth = 193;
	this.text_6.parent = this;
	this.text_6.setTransform(40,24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_3}]},165).to({state:[{t:this.text_4,p:{x:240.5,y:69,text:"Ukraine",font:"italic bold 39px 'Verdana'",lineHeight:49.4,lineWidth:179,textAlign:"",color:"#000000"}},{t:this.text_3}]},133).to({state:[]},165).to({state:[{t:this.text_3}]},5).to({state:[{t:this.text_4,p:{x:254.3,y:126.5,text:"Grigorij",font:"italic bold 25px 'Verdana'",lineHeight:32.4,lineWidth:136,textAlign:"",color:"#000000"}},{t:this.text_3}]},11).to({state:[{t:this.text_5,p:{x:253.85,y:126.5,text:"Grigorij",font:"italic bold 25px 'Verdana'",textAlign:"",lineHeight:32.4,lineWidth:125}},{t:this.text_4,p:{x:253.85,y:157.45,text:"Jakovlevic",font:"italic bold 25px 'Verdana'",lineHeight:32.4,lineWidth:150,textAlign:"",color:"#000000"}},{t:this.text_3}]},10).to({state:[]},25).to({state:[{t:this.text_3}]},51).to({state:[]},205).to({state:[{t:this.text_3}]},21).to({state:[{t:this.text_4,p:{x:132.5,y:371,text:"St.",font:"26px 'Arial'",lineHeight:31.05,lineWidth:32,textAlign:"center",color:"#000000"}},{t:this.text_3}]},11).to({state:[{t:this.instance_67}]},8).to({state:[{t:this.instance_68}]},22).to({state:[{t:this.text_3}]},1).to({state:[{t:this.text_5,p:{x:400,y:57,text:"What happened next?",font:"bold 44px 'Verdana'",textAlign:"center",lineHeight:55.5,lineWidth:399}},{t:this.text_4,p:{x:221,y:185,text:"He fell in love with the royal princess",font:"italic bold 26px 'Verdana'",lineHeight:33.6,lineWidth:237,textAlign:"center",color:"#993300"}},{t:this.text_3}]},8).to({state:[]},49).to({state:[{t:this.text_3}]},398).to({state:[{t:this.text_4,p:{x:40,y:24,text:"Aleksej Rozum",font:"bold 29px 'Times New Roman'",lineHeight:34.1,lineWidth:193,textAlign:"",color:"#000000"}},{t:this.text_3}]},20).to({state:[{t:this.text_4,p:{x:40,y:24,text:"Aleksej Rozum",font:"bold 29px 'Times New Roman'",lineHeight:34.1,lineWidth:193,textAlign:"",color:"#000000"}},{t:this.text_3}]},38).to({state:[{t:this.text_5,p:{x:40,y:24,text:"Aleksej Rozum",font:"bold 29px 'Times New Roman'",textAlign:"",lineHeight:34.1,lineWidth:193}},{t:this.text_4,p:{x:311.95,y:1,text:"Aleksej Rozumovskij",font:"bold 29px 'Times New Roman'",lineHeight:34.1,lineWidth:232,textAlign:"",color:"#000000"}},{t:this.text_3}]},54).to({state:[{t:this.text_6},{t:this.text_5,p:{x:311.95,y:1,text:"Aleksej Rozumovskij",font:"bold 29px 'Times New Roman'",textAlign:"",lineHeight:34.1,lineWidth:232}},{t:this.text_4,p:{x:66,y:69,text:"1741",font:"bold 29px 'Times New Roman'",lineHeight:34.1,lineWidth:62,textAlign:"",color:"#000000"}},{t:this.text_3}]},23).to({state:[]},192).to({state:[]},948).wait(551));
	this.timeline.addTween(cjs.Tween.get(this.text_3).wait(165).to({_off:false},0).wait(133).to({x:279,y:114.5,text:"Lemeshi",font:"italic bold 21px 'Verdana'",lineHeight:27.5,lineWidth:102},0).to({_off:true},165).wait(5).to({_off:false,x:254.8,y:126.5,text:"Grigorij",font:"italic bold 25px 'Verdana'",lineHeight:32.4,lineWidth:114},0).wait(11).to({x:254.3,y:157.45,text:"Jakovlevic",lineWidth:151},0).wait(10).to({x:253.85,y:188.4,text:"Rozum",lineWidth:103},0).to({_off:true},25).wait(51).to({_off:false,x:353.95,y:10,text:"Aleksejs",font:"italic bold 18px 'Verdana'",lineHeight:23.9,lineWidth:92},0).to({_off:true},205).wait(21).to({_off:false,x:132.5,y:371,text:"St.",font:"26px 'Arial'",textAlign:NaN,lineHeight:31.05,lineWidth:32},0).wait(11).to({x:217.95,text:"Petersburg",lineWidth:140},0).to({_off:true},8).wait(23).to({_off:false,x:400,y:57,text:"What happened  next?",font:"bold 44px 'Verdana'",lineHeight:55.5,lineWidth:399},0).wait(8).to({x:473.95,y:185,text:"He didn't like St. Petersburg and returned home",font:"italic bold 26px 'Verdana'",color:"#993300",lineHeight:33.6,lineWidth:245},0).to({_off:true},49).wait(398).to({_off:false,x:40,y:24,text:"Aleksej Rozum",font:"bold 29px 'Times New Roman'",color:"#000000",textAlign:0,lineHeight:34.1,lineWidth:193},0).wait(20).to({x:311.95,y:1,text:"Aleksej Rozumovskij",lineWidth:232},0).wait(92).to({x:66,y:69,text:"1741",lineWidth:62},0).wait(23).to({x:64,y:277,text:"1761",lineWidth:58},0).to({_off:true},192).wait(1499));
	this.timeline.addTween(cjs.Tween.get(this.instance_67).wait(810).to({_off:false},0).to({_off:true,x:-98.7},22).wait(2282));

	// aleksejs
	this.Aleksejs1 = new lib.aleksejs();
	this.Aleksejs1.name = "Aleksejs1";
	this.Aleksejs1.setTransform(316.45,55.6,0.0708,0.0706,0,0,0,106,157.2);
	this.Aleksejs1.alpha = 0;
	this.Aleksejs1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.Aleksejs1).wait(517).to({_off:false},0).to({regY:160.7,scaleX:0.9434,scaleY:0.9417,x:408.95,y:195.85,alpha:1},43).wait(213).to({x:-101,y:196.7},37).to({_off:true},5).wait(2299));

	// music_notes
	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-5,14.9).lineTo(-5,14.8).lineTo(-5,-14.9).curveTo(-5,-12.1,-2.1,-10.1).curveTo(0.9,-8.1,5.1,-8.1);
	this.shape_21.setTransform(229.9,168.0875);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.beginFill("#000000").beginStroke().moveTo(-4.5,2.3).lineTo(-5,0).curveTo(-5,-2.4,-3.5,-3.8).curveTo(-2.1,-5,0,-5).curveTo(2,-5,3.4,-3.8).curveTo(5,-2.4,5,-0.1).lineTo(5,0).curveTo(5,1.6,4,3).curveTo(2.6,5,0,5).curveTo(-3.3,5,-4.5,2.3).closePath();
	this.shape_22.setTransform(219.85,182.975);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.beginFill().beginStroke("rgba(0,0,0,0.169)").setStrokeStyle(0.2,1,1).moveTo(0,5).curveTo(0.1,5,0.3,5).curveTo(2.7,4.9,4,3).curveTo(4.3,2.5,4.6,2).curveTo(5,1.1,5,0).lineTo(5,-0.1).curveTo(5,-2.4,3.5,-3.8).curveTo(2.1,-5,0,-5).curveTo(-2,-5,-3.4,-3.8).curveTo(-5,-2.4,-5,0).curveTo(-4.9,0.2,-4.9,0.3).curveTo(-4.8,0.9,-4.4,2.3).curveTo(-3.3,4.9,-0.2,5);
	this.shape_23.setTransform(216.2,175.975);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(2.3,15.8).lineTo(2.3,-13.9).curveTo(2.4,-11.1,5.3,-9.1).curveTo(8.2,-7.1,12.4,-7.1).moveTo(-2.6,8.7).lineTo(-2.6,-20.9).curveTo(-2.5,-18.2,0.4,-16.2).curveTo(3.3,-14.1,7.5,-14.1).moveTo(2.3,15.8).curveTo(2.3,13.5,0.8,12.1).curveTo(-0.6,10.9,-2.7,10.9).curveTo(-2.8,10.9,-3,10.9).curveTo(-4.8,11,-6.1,12.1).curveTo(-6.9,12.9,-7.3,13.9).curveTo(-7.7,14.8,-7.7,15.9).curveTo(-7.6,16.1,-7.5,16.3).curveTo(-5.9,20.8,-2.9,20.9).lineTo(-2.7,20.9).curveTo(-0.1,20.9,1.3,18.9).curveTo(2.3,17.5,2.3,15.9).closePath().moveTo(-12.4,9.2).curveTo(-10.8,13.7,-7.8,13.9).lineTo(-7.6,13.9);
	this.shape_24.setTransform(223.7625,167.125);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.beginFill("#000000").beginStroke().moveTo(2.2,8.5).curveTo(-0.8,8.4,-2.4,3.9).lineTo(-2.6,3.6).curveTo(-2.5,2.4,-2.2,1.5).curveTo(0.2,1.4,1.6,-0.5).lineTo(2.1,-1.5).lineTo(2.5,-1.5).curveTo(4.5,-1.5,5.9,-0.2).curveTo(7.4,1.1,7.4,3.4).lineTo(7.4,3.6).curveTo(7.5,5.1,6.4,6.5).curveTo(5.1,8.6,2.5,8.5).closePath().moveTo(-2,5.8).lineTo(-2.4,3.9).curveTo(-0.8,8.4,2.2,8.5).curveTo(-0.8,8.5,-2,5.8).closePath().moveTo(-2.5,1.5).lineTo(-2.6,1.5).curveTo(-5.7,1.3,-7.3,-3.2).curveTo(-5.7,1.3,-2.6,1.5).curveTo(-5.7,1.4,-6.9,-1.2).lineTo(-7.3,-3.2).lineTo(-7.4,-3.5).curveTo(-7.4,-5.9,-5.9,-7.3).curveTo(-4.5,-8.6,-2.5,-8.6).curveTo(-0.4,-8.6,1,-7.3).curveTo(2.5,-6,2.6,-3.6).lineTo(2.6,-3.5).curveTo(2.5,-2.5,2.1,-1.5).curveTo(0.3,-1.4,-1,-0.2).curveTo(-1.8,0.5,-2.2,1.5).lineTo(-2.5,1.5).closePath().moveTo(-1,-0.2).curveTo(0.3,-1.4,2.1,-1.5).lineTo(1.6,-0.5).curveTo(0.2,1.4,-2.2,1.5).curveTo(-1.8,0.5,-1,-0.2).closePath().moveTo(2.1,-1.5).lineTo(2.1,-1.5).closePath();
	this.shape_25.setTransform(218.65,179.5);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.beginFill().beginStroke("rgba(0,0,0,0.333)").setStrokeStyle(0.4,1,1).moveTo(0,5).curveTo(2.6,5,4,3).curveTo(5,1.6,5,0).lineTo(5,-0.1).curveTo(4.9,-2.4,3.4,-3.8).curveTo(2,-5,0,-5).curveTo(-2.1,-5,-3.5,-3.8).curveTo(-5,-2.4,-5,0).curveTo(-4.9,0.2,-4.9,0.3).curveTo(-4.8,0.9,-4.5,2.3).curveTo(-3.3,4.9,-0.2,5);
	this.shape_26.setTransform(212.55,168.975);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-5,5.2).lineTo(-5,-24.4).curveTo(-4.9,-21.7,-2.1,-19.7).curveTo(0.9,-17.6,5.1,-17.6).moveTo(4.8,19.3).lineTo(4.8,-10.3).curveTo(4.9,-7.6,7.7,-5.6).curveTo(10.7,-3.5,14.9,-3.5).moveTo(4.8,19.3).curveTo(4.7,17,3.2,15.7).curveTo(1.8,14.4,-0.2,14.4).curveTo(-2.3,14.4,-3.7,15.7).curveTo(-5.2,17.1,-5.2,19.5).curveTo(-5.2,19.6,-5.1,19.8).curveTo(-3.4,24.3,-0.4,24.5).lineTo(-0.2,24.5).curveTo(2.4,24.5,3.8,22.5).curveTo(4.8,21,4.8,19.5).closePath().moveTo(-14.9,5.7).curveTo(-13.2,10.2,-10.2,10.4).lineTo(-10,10.4);
	this.shape_27.setTransform(222.5625,163.65);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.beginFill("#000000").beginStroke().moveTo(4.7,12.1).curveTo(1.7,11.9,0,7.4).lineTo(-0.1,7.1).curveTo(-0.1,4.7,1.4,3.3).curveTo(2.8,2,4.9,2).curveTo(6.9,2,8.4,3.3).curveTo(9.8,4.6,9.9,6.9).lineTo(9.9,7.1).curveTo(9.9,8.6,8.9,10.1).curveTo(7.5,12.1,4.9,12.1).closePath().moveTo(0.4,9.3).lineTo(0,7.4).curveTo(1.7,11.9,4.7,12.1).curveTo(1.6,12,0.4,9.3).closePath().moveTo(-5.1,-2).curveTo(-8.1,-2.2,-9.8,-6.7).curveTo(-8.1,-2.2,-5.1,-2).curveTo(-8.2,-2.1,-9.4,-4.8).lineTo(-9.8,-6.7).lineTo(-9.9,-7).curveTo(-9.9,-9.4,-8.4,-10.8).curveTo(-7,-12.1,-4.9,-12.1).curveTo(-2.9,-12.1,-1.4,-10.8).curveTo(0,-9.5,0.1,-7.2).lineTo(0.1,-7).curveTo(0.1,-5.5,-0.9,-4).curveTo(-2.3,-2,-4.9,-2).closePath();
	this.shape_28.setTransform(217.45,176.025);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.beginFill().beginStroke("rgba(0,0,0,0.502)").setStrokeStyle(0.5,1,1).moveTo(0,5).curveTo(2.6,5,4,3).curveTo(5,1.6,5,0).lineTo(5,-0.1).curveTo(4.9,-2.4,3.4,-3.8).curveTo(2,-5,0,-5).curveTo(-2.1,-5,-3.5,-3.8).curveTo(-5,-2.4,-5,0).curveTo(-4.9,0.2,-4.9,0.3).curveTo(-4.8,0.9,-4.5,2.3).curveTo(-3.3,4.9,-0.2,5);
	this.shape_29.setTransform(208.9,161.975);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-7.5,1.7).lineTo(-7.5,-28).curveTo(-7.4,-25.3,-4.5,-23.3).curveTo(-1.6,-21.2,2.6,-21.2).moveTo(7.3,22.9).lineTo(7.3,-6.8).curveTo(7.4,-4,10.2,-2).curveTo(13.2,0,17.4,0).moveTo(-17.4,2.1).curveTo(-15.7,6.6,-12.7,6.8).lineTo(-12.5,6.8).moveTo(7.3,22.9).curveTo(7.2,20.6,5.7,19.2).curveTo(4.3,18,2.3,18).curveTo(0.2,18,-1.2,19.2).curveTo(-2.7,20.6,-2.7,23).curveTo(-2.7,23.2,-2.6,23.3).curveTo(-0.9,27.8,2.1,28).lineTo(2.3,28).curveTo(4.9,28,6.3,26).curveTo(7.3,24.6,7.3,23).closePath();
	this.shape_30.setTransform(221.3875,160.2);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.beginFill("#000000").beginStroke().moveTo(7.2,15.6).curveTo(4.2,15.5,2.5,11).lineTo(2.4,10.6).curveTo(2.4,8.2,3.9,6.8).curveTo(5.3,5.6,7.4,5.6).curveTo(9.4,5.6,10.8,6.8).curveTo(12.3,8.2,12.4,10.5).lineTo(12.4,10.6).curveTo(12.4,12.2,11.4,13.6).curveTo(10,15.6,7.4,15.6).closePath().moveTo(2.9,12.9).lineTo(2.5,11).curveTo(4.2,15.5,7.2,15.6).curveTo(4.1,15.5,2.9,12.9).closePath().moveTo(-7.6,-5.6).curveTo(-10.6,-5.7,-12.3,-10.3).curveTo(-10.6,-5.7,-7.6,-5.6).curveTo(-10.7,-5.7,-11.8,-8.3).lineTo(-12.3,-10.3).lineTo(-12.4,-10.6).curveTo(-12.4,-13,-10.8,-14.4).curveTo(-9.4,-15.6,-7.4,-15.6).curveTo(-5.3,-15.6,-3.9,-14.4).curveTo(-2.4,-13,-2.4,-10.7).lineTo(-2.4,-10.6).curveTo(-2.4,-9,-3.4,-7.6).curveTo(-4.8,-5.6,-7.4,-5.6).closePath();
	this.shape_31.setTransform(216.275,172.575);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.beginFill().beginStroke("rgba(0,0,0,0.667)").setStrokeStyle(0.7,1,1).moveTo(0,5).curveTo(2.6,5,4,3).curveTo(5,1.6,5,0).lineTo(5,-0.1).curveTo(5,-2.4,3.5,-3.8).curveTo(2.1,-5,0,-5).curveTo(-2,-5,-3.4,-3.8).curveTo(-5,-2.4,-5,0).curveTo(-4.9,0.2,-4.9,0.3).curveTo(-4.8,0.9,-4.4,2.3).curveTo(-3.3,4.9,-0.2,5);
	this.shape_32.setTransform(205.2,154.975);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-10,-1.9).lineTo(-10,-31.5).curveTo(-9.9,-28.8,-7,-26.8).curveTo(-4.1,-24.7,0.1,-24.7).moveTo(9.7,26.4).lineTo(9.7,-3.3).curveTo(9.8,-0.5,12.7,1.5).curveTo(15.6,3.5,19.8,3.5).moveTo(-19.8,-1.4).curveTo(-18.2,3.1,-15.2,3.3).lineTo(-15,3.3).moveTo(9.7,26.4).curveTo(9.7,24.1,8.2,22.7).curveTo(6.8,21.5,4.7,21.5).curveTo(2.7,21.5,1.3,22.7).curveTo(-0.3,24.1,-0.3,26.5).curveTo(-0.2,26.7,-0.1,26.8).curveTo(1.5,31.4,4.5,31.5).lineTo(4.7,31.5).curveTo(7.3,31.5,8.7,29.5).curveTo(9.7,28.1,9.7,26.5).closePath();
	this.shape_33.setTransform(220.1625,156.725);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.beginFill("#000000").beginStroke().moveTo(9.7,19.2).curveTo(6.6,19,5,14.5).lineTo(4.8,14.1).curveTo(4.8,11.7,6.4,10.4).curveTo(7.8,9.1,9.9,9.1).curveTo(11.9,9.1,13.3,10.4).curveTo(14.8,11.7,14.8,14).lineTo(14.8,14.1).curveTo(14.8,15.7,13.8,17.1).curveTo(12.4,19.2,9.9,19.2).closePath().moveTo(5.4,16.4).lineTo(5,14.5).curveTo(6.6,19,9.7,19.2).curveTo(6.6,19.1,5.4,16.4).closePath().moveTo(-10,-9.1).curveTo(-13.1,-9.3,-14.7,-13.8).curveTo(-13.1,-9.3,-10,-9.1).curveTo(-13.1,-9.2,-14.3,-11.9).lineTo(-14.7,-13.8).lineTo(-14.9,-14.1).curveTo(-14.8,-16.5,-13.3,-17.9).curveTo(-11.9,-19.2,-9.9,-19.2).curveTo(-7.8,-19.2,-6.4,-17.9).curveTo(-4.9,-16.6,-4.8,-14.2).lineTo(-4.8,-14.1).curveTo(-4.8,-12.6,-5.9,-11.1).curveTo(-7.3,-9.1,-9.9,-9.1).closePath();
	this.shape_34.setTransform(215.05,169.1);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.beginFill().beginStroke("rgba(0,0,0,0.831)").setStrokeStyle(0.9,1,1).moveTo(0,5).curveTo(2.6,5,4,3).curveTo(5,1.6,5,0).lineTo(5,-0.1).curveTo(4.9,-2.4,3.4,-3.8).curveTo(2,-5,0,-5).curveTo(-2.1,-5,-3.5,-3.8).curveTo(-5,-2.4,-5,0).curveTo(-4.9,0.2,-4.9,0.3).curveTo(-4.8,0.9,-4.5,2.3).curveTo(-3.3,4.9,-0.2,5);
	this.shape_35.setTransform(201.55,147.975);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-12.4,-5.4).lineTo(-12.4,-35).curveTo(-12.3,-32.3,-9.5,-30.3).curveTo(-6.5,-28.3,-2.3,-28.3).moveTo(-22.3,-4.9).curveTo(-20.6,-0.4,-17.6,-0.3).lineTo(-17.4,-0.3).moveTo(12.2,29.9).lineTo(12.2,0.3).curveTo(12.3,3,15.1,5).curveTo(18.1,7.1,22.3,7.1).moveTo(12.2,29.9).curveTo(12.1,27.6,10.6,26.3).curveTo(9.2,25,7.2,25).curveTo(5.1,25,3.7,26.3).curveTo(2.2,27.7,2.2,30.1).curveTo(2.2,30.2,2.3,30.4).curveTo(4,34.9,7,35.1).lineTo(7.2,35.1).curveTo(9.8,35.1,11.2,33.1).curveTo(12.2,31.6,12.2,30.1).closePath();
	this.shape_36.setTransform(218.9625,153.25);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.beginFill("#000000").beginStroke().moveTo(12.1,22.7).curveTo(9.1,22.5,7.4,18).curveTo(9.1,22.5,12.1,22.7).curveTo(9,22.6,7.8,19.9).lineTo(7.4,18).lineTo(7.3,17.7).curveTo(7.3,15.3,8.8,13.9).curveTo(10.2,12.6,12.3,12.6).curveTo(14.3,12.6,15.7,13.9).curveTo(17.2,15.2,17.3,17.5).lineTo(17.3,17.7).curveTo(17.3,19.2,16.3,20.7).curveTo(14.9,22.7,12.3,22.7).closePath().moveTo(-12.5,-12.6).curveTo(-15.5,-12.8,-17.2,-17.3).curveTo(-15.5,-12.8,-12.5,-12.6).curveTo(-15.6,-12.7,-16.8,-15.4).lineTo(-17.2,-17.3).lineTo(-17.3,-17.6).curveTo(-17.3,-20,-15.8,-21.4).curveTo(-14.3,-22.7,-12.3,-22.7).curveTo(-10.2,-22.7,-8.8,-21.4).curveTo(-7.3,-20.1,-7.3,-17.8).lineTo(-7.3,-17.6).curveTo(-7.3,-16.1,-8.3,-14.6).curveTo(-9.7,-12.6,-12.3,-12.6).closePath();
	this.shape_37.setTransform(213.85,165.625);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-19.8,-6.3).lineTo(-19.8,-6.4).lineTo(-19.8,-36.1).curveTo(-19.7,-33.3,-16.8,-31.3).curveTo(-13.9,-29.3,-9.7,-29.3).moveTo(9.7,36.1).lineTo(9.7,35.9).lineTo(9.7,6.3).curveTo(9.8,9,12.7,11).curveTo(15.6,13.1,19.8,13.1);
	this.shape_38.setTransform(222.7,147.275);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.beginFill("#000000").beginStroke().moveTo(10.3,23.4).lineTo(9.7,21.2).curveTo(9.7,18.8,11.3,17.4).curveTo(12.7,16.1,14.8,16.1).curveTo(16.8,16.1,18.2,17.4).curveTo(19.7,18.7,19.7,21.1).lineTo(19.7,21.2).curveTo(19.8,22.7,18.7,24.2).curveTo(17.4,26.2,14.8,26.2).curveTo(11.5,26.2,10.3,23.4).closePath().moveTo(-19.2,-18.9).lineTo(-19.8,-21.1).curveTo(-19.8,-23.6,-18.2,-25).curveTo(-16.8,-26.2,-14.7,-26.2).curveTo(-12.7,-26.2,-11.3,-25).curveTo(-9.8,-23.6,-9.8,-21.3).lineTo(-9.8,-21.1).curveTo(-9.8,-19.6,-10.8,-18.1).curveTo(-12.2,-16.2,-14.7,-16.2).curveTo(-18,-16.1,-19.2,-18.9).closePath();
	this.shape_39.setTransform(212.65,162.15);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-20,-2.2).lineTo(-19.8,-2.2).curveTo(-17.2,-2.2,-15.8,-4.2).curveTo(-14.8,-5.7,-14.8,-7.2).lineTo(-14.8,-7.4).lineTo(-14.8,-37).curveTo(-14.7,-34.3,-11.8,-32.3).curveTo(-8.9,-30.2,-4.7,-30.2).moveTo(-14.8,-7.4).curveTo(-14.8,-9.7,-16.3,-11).curveTo(-17.8,-12.3,-19.8,-12.3).curveTo(-21.8,-12.3,-23.3,-11).curveTo(-24.8,-9.6,-24.8,-7.2).curveTo(-24.7,-7.1,-24.7,-6.9).moveTo(-20,-2.2).curveTo(-23.1,-2.3,-24.3,-5).curveTo(-24.6,-6.4,-24.7,-6.9).curveTo(-23,-2.4,-20,-2.2).closePath().moveTo(13.2,27).curveTo(12.9,25.8,12.8,24.5).curveTo(12.7,23.2,12.7,22.4).curveTo(12.7,21.7,12.8,21.1).lineTo(12.8,21).curveTo(12.7,20.6,12.7,20.4).curveTo(12.7,18.6,13,17).curveTo(13.3,15.5,13.7,14.3).curveTo(14.1,13.1,14.4,12.2).curveTo(14.6,11.6,14.7,11).curveTo(14.7,11.5,14.8,12).curveTo(15,6.9,15.3,7.2).curveTo(15.9,8.7,17.4,9.8).curveTo(18,10.3,18.7,10.7).curveTo(21.3,12.1,24.8,12.1).moveTo(13.2,27).curveTo(12.7,26.8,12.1,26.8).curveTo(11.2,26.9,10.7,27.4).curveTo(8.3,26.4,8,26.8).curveTo(6.7,28.4,6.7,30.9).curveTo(6.7,31,6.7,31).curveTo(8.1,36.1,10.7,36.8).curveTo(12.8,37.4,13.9,36.3).curveTo(14.6,35.6,14.7,34.9).curveTo(14.7,34.8,14.7,34.7).lineTo(14.7,32.7).curveTo(14.7,32,14.5,31.3).curveTo(14.2,30.2,13.7,28.8).curveTo(13.4,27.9,13.2,27).closePath().moveTo(14.7,29.4).curveTo(14.7,28.1,14,27.4).curveTo(13.6,27.1,13.2,27);
	this.shape_40.setTransform(217.7,147.8091);

	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.beginFill("#000000").beginStroke().moveTo(11.1,24.9).curveTo(10.5,24.1,10.2,23.3).lineTo(10.1,22.9).lineTo(9.9,21.6).lineTo(9.8,21).lineTo(9.7,21).curveTo(9.7,18.8,11,17.4).lineTo(11.8,16.9).curveTo(12.9,16.1,14.1,16).curveTo(16.2,16,17.2,16.5).curveTo(17.9,16.9,18.4,17.4).curveTo(19.2,18.3,19.5,19.3).lineTo(19.6,20.2).lineTo(19.7,20.8).lineTo(19.7,21.1).lineTo(19.7,21.3).lineTo(19.7,21.5).curveTo(19.7,22.8,19,24).lineTo(18.7,24.5).curveTo(17.5,26,15.7,26.3).lineTo(14.5,26.4).curveTo(12.3,26.3,11.1,24.9).closePath().moveTo(17.2,22.9).curveTo(18.2,22.9,18.9,22.3).lineTo(18.9,22.2).curveTo(19.6,21.5,19.7,20.8).curveTo(19.6,21.5,18.9,22.2).lineTo(18.9,22.3).curveTo(18.2,22.9,17.2,22.9).lineTo(17.1,22.9).lineTo(17.1,22.9).lineTo(15.9,22.7).lineTo(15.8,22.6).curveTo(13.2,22,11.8,16.9).curveTo(13.2,22,15.8,22.6).lineTo(15.9,22.7).lineTo(17.1,22.9).lineTo(17.1,22.9).lineTo(17.2,22.9).closePath().moveTo(-14.9,-16.3).curveTo(-18,-16.5,-19.6,-21).curveTo(-18,-16.5,-14.9,-16.3).curveTo(-18,-16.4,-19.2,-19.1).lineTo(-19.6,-21).lineTo(-19.8,-21.4).curveTo(-19.8,-23.8,-18.2,-25.1).curveTo(-16.8,-26.4,-14.7,-26.4).curveTo(-12.7,-26.4,-11.3,-25.1).curveTo(-9.8,-23.8,-9.8,-21.5).lineTo(-9.8,-21.4).curveTo(-9.8,-19.8,-10.8,-18.3).curveTo(-12.2,-16.4,-14.7,-16.3).closePath();
	this.shape_41.setTransform(212.65,161.95);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-20,-1).lineTo(-19.8,-1).curveTo(-17.2,-1,-15.8,-3).curveTo(-14.8,-4.4,-14.8,-6).lineTo(-14.8,-6.1).lineTo(-14.8,-35.8).curveTo(-14.7,-33,-11.8,-31).curveTo(-8.9,-29,-4.7,-29).moveTo(-14.8,-6.1).curveTo(-14.8,-8.4,-16.3,-9.8).curveTo(-17.8,-11,-19.8,-11).curveTo(-21.8,-11,-23.3,-9.8).curveTo(-24.8,-8.4,-24.8,-6).curveTo(-24.7,-5.8,-24.7,-5.7).moveTo(-20,-1).curveTo(-23.1,-1.1,-24.3,-3.7).curveTo(-24.6,-5.1,-24.7,-5.7).curveTo(-23,-1.1,-20,-1).closePath().moveTo(10.8,23.7).curveTo(11,22.7,11.3,21.8).curveTo(11.9,20.4,12.7,19.5).curveTo(13.5,18.6,14.1,18.2).curveTo(14.5,18,14.7,18).curveTo(14.7,18.5,14.8,19).curveTo(14.9,8,15.1,8).curveTo(15.6,9.6,17.2,10.9).curveTo(17.7,11.3,18.4,11.8).curveTo(21.1,13.4,24.8,13.4).moveTo(14.7,25.2).curveTo(14.7,24.8,14.8,24.8).curveTo(14.7,24.6,14.5,24.8).curveTo(14.2,24.9,14.2,25.3).curveTo(12,24.1,10.8,23.7).curveTo(9.7,23.3,9.7,23.5).curveTo(8.7,25.4,8.7,27.9).curveTo(9.1,29.9,9.6,31.4).curveTo(10.5,33.8,11.7,34.7).curveTo(13.3,35.8,14.1,35.8).curveTo(14.4,35.7,14.6,35.6).curveTo(14.7,35.6,14.7,35.5).lineTo(14.7,35.1).curveTo(14.7,35,14.5,34.8).curveTo(14.4,34.8,14.3,34.8).curveTo(13.8,34.5,12.7,33.4).curveTo(12.1,32.7,11.6,31.7).curveTo(11.2,30.7,10.9,29.5).curveTo(10.7,27.8,10.7,27.3).curveTo(10.7,26.6,10.8,26).lineTo(10.8,25.9).curveTo(10.7,25.5,10.7,25.3).curveTo(10.7,24.5,10.8,23.7);
	this.shape_42.setTransform(217.7,146.176);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.beginFill("#000000").beginStroke().moveTo(14.2,26.6).curveTo(12,26.4,10.9,24.8).lineTo(10.1,23.1).lineTo(10,22.7).lineTo(9.9,21.4).lineTo(9.8,20.9).lineTo(9.7,20.8).curveTo(9.7,18.6,11.1,17.2).curveTo(12.6,16,14.2,15.8).lineTo(14.7,15.8).curveTo(15.5,18.3,16.8,19.1).curveTo(18.3,20.3,19.2,20.2).lineTo(19.6,20.1).lineTo(19.6,20.5).lineTo(19.7,21.4).lineTo(19.7,21.5).lineTo(19.7,21.7).curveTo(19.8,23.1,18.9,24.3).lineTo(18.6,24.8).curveTo(17.4,26.4,15.4,26.6).lineTo(14.9,26.6).lineTo(14.2,26.6).closePath().moveTo(19.4,19.2).curveTo(18.8,18.9,17.7,17.8).curveTo(17.1,17.1,16.7,16.2).lineTo(17.5,16.5).curveTo(18.1,16.9,18.6,17.5).curveTo(19.2,18.3,19.5,19.3).lineTo(19.4,19.2).closePath().moveTo(-14.9,-16.5).curveTo(-18,-16.7,-19.6,-21.2).curveTo(-18,-16.7,-14.9,-16.5).curveTo(-18,-16.6,-19.2,-19.3).lineTo(-19.6,-21.2).lineTo(-19.8,-21.5).curveTo(-19.8,-23.9,-18.2,-25.3).curveTo(-16.8,-26.6,-14.7,-26.6).curveTo(-12.7,-26.6,-11.3,-25.3).curveTo(-9.8,-24,-9.8,-21.7).lineTo(-9.8,-21.5).curveTo(-9.8,-20,-10.8,-18.5).curveTo(-12.2,-16.5,-14.7,-16.5).closePath();
	this.shape_43.setTransform(212.65,161.7375);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-20,-1.7).lineTo(-19.8,-1.7).curveTo(-17.2,-1.7,-15.8,-3.7).curveTo(-14.8,-5.1,-14.8,-6.7).lineTo(-14.8,-6.8).lineTo(-14.8,-36.5).curveTo(-14.7,-33.7,-11.8,-31.7).curveTo(-8.9,-29.7,-4.7,-29.7).moveTo(-14.8,-6.8).curveTo(-14.8,-9.1,-16.3,-10.5).curveTo(-17.8,-11.7,-19.8,-11.7).curveTo(-21.8,-11.7,-23.3,-10.5).curveTo(-24.8,-9.1,-24.8,-6.7).curveTo(-24.7,-6.5,-24.7,-6.3).moveTo(-20,-1.7).curveTo(-23.1,-1.7,-24.3,-4.4).curveTo(-24.6,-5.8,-24.7,-6.3).curveTo(-23,-1.8,-20,-1.7).closePath().moveTo(14.8,19.3).curveTo(14.8,19.1,14.8,18.9).curveTo(14.8,7.1,15,6.8).curveTo(15.3,8.6,16.9,9.9).curveTo(17.5,10.5,18.2,10.9).curveTo(21,12.7,24.8,12.7).moveTo(14.8,19.7).curveTo(14.8,19.5,14.8,19.3).curveTo(14.9,19.6,15.4,20).curveTo(15.5,20.1,15.7,20.2).curveTo(16.3,20.5,16.9,20.8).curveTo(17.2,21.1,17.8,21.3).curveTo(16.5,20.6,15.4,20).curveTo(15.1,19.8,14.8,19.7).curveTo(11.4,17.9,11.3,18.2).curveTo(10.7,20.4,10.7,22.9).curveTo(10.7,23.2,10.8,23.4).curveTo(11.2,23,11.7,22.7).curveTo(13,22.1,13.8,22.3).curveTo(14.5,22.5,14.7,23).curveTo(14.7,23.5,14.8,24).curveTo(14.8,21.7,14.8,19.7).closePath().moveTo(10.8,23.4).curveTo(11.4,28.7,12.7,30.6).curveTo(13.8,32.4,14.3,33.3).curveTo(14.7,33.8,14.7,34.3).lineTo(14.7,35.5).curveTo(14.7,35.7,14.6,35.8).curveTo(14.5,36.1,14.1,36.3).curveTo(13.3,36.7,11.7,36).curveTo(9.8,35.1,9.1,32.5).curveTo(8.8,31.3,8.8,30.7).curveTo(8.7,30.4,8.7,30.3).curveTo(8.7,29.6,8.8,28.9).lineTo(8.8,28.9).lineTo(8.7,28.3).curveTo(8.7,26.2,9.7,24.7).curveTo(10.1,23.9,10.8,23.4).closePath();
	this.shape_44.setTransform(217.7,146.4594);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.beginFill("#000000").beginStroke().moveTo(14.1,26.8).curveTo(11.7,26.5,10.7,24.7).lineTo(10,22.9).lineTo(9.9,22.6).curveTo(9.8,21.7,9.9,21.2).lineTo(9.9,21.1).lineTo(9.7,20.6).curveTo(9.8,18.3,11.2,16.9).curveTo(12.5,15.9,13.8,15.6).lineTo(14.1,17.5).curveTo(14.8,20,16.8,20.9).lineTo(17,21).curveTo(17.7,21.3,18.2,21.4).lineTo(18.4,21.4).lineTo(18.4,21.4).lineTo(19.1,21.2).lineTo(19.2,21.2).curveTo(19.5,21,19.6,20.7).lineTo(19.7,21.6).lineTo(19.7,21.8).lineTo(19.7,22).curveTo(19.7,23.4,18.8,24.6).lineTo(18.6,25.1).curveTo(17.3,26.6,15.2,26.8).lineTo(14.6,26.8).lineTo(14.1,26.8).closePath().moveTo(18.2,21.4).curveTo(17.7,21.3,17,21).lineTo(16.8,20.9).curveTo(14.8,20,14.1,17.5).lineTo(13.8,15.6).lineTo(14.4,15.6).curveTo(16.7,15.8,17.7,16.5).curveTo(18.3,17,18.8,17.6).curveTo(19.4,18.5,19.6,19.7).lineTo(19.6,20.7).curveTo(19.5,21,19.2,21.2).lineTo(19.1,21.2).lineTo(18.4,21.4).lineTo(18.4,21.4).lineTo(18.2,21.4).closePath().moveTo(13.8,15.6).lineTo(13.8,15.6).closePath().moveTo(-14.9,-16.7).curveTo(-18,-16.9,-19.6,-21.4).curveTo(-18,-16.9,-14.9,-16.7).curveTo(-18,-16.8,-19.2,-19.5).lineTo(-19.6,-21.4).lineTo(-19.8,-21.7).curveTo(-19.8,-24.1,-18.2,-25.5).curveTo(-16.8,-26.8,-14.7,-26.8).curveTo(-12.7,-26.8,-11.3,-25.5).curveTo(-9.8,-24.2,-9.8,-21.9).lineTo(-9.8,-21.7).curveTo(-9.8,-20.2,-10.8,-18.7).curveTo(-12.2,-16.7,-14.7,-16.7).closePath();
	this.shape_45.setTransform(212.65,161.5375);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-20,-3.1).lineTo(-19.8,-3.1).curveTo(-17.2,-3.1,-15.8,-5.1).curveTo(-14.8,-6.6,-14.8,-8.1).lineTo(-14.8,-8.3).lineTo(-14.8,-37.9).curveTo(-14.7,-35.2,-11.8,-33.2).curveTo(-8.9,-31.1,-4.7,-31.1).moveTo(-14.8,-8.3).curveTo(-14.8,-10.6,-16.3,-11.9).curveTo(-17.8,-13.2,-19.8,-13.2).curveTo(-21.8,-13.2,-23.3,-11.9).curveTo(-24.8,-10.5,-24.8,-8.1).curveTo(-24.7,-8,-24.7,-7.8).moveTo(-20,-3.1).curveTo(-23.1,-3.2,-24.3,-5.9).curveTo(-24.6,-7.3,-24.7,-7.8).curveTo(-23,-3.3,-20,-3.1).closePath().moveTo(14.8,12.4).curveTo(14.8,12.2,14.8,12).curveTo(14.8,5.3,14.9,4.9).curveTo(15.1,6.8,16.6,8.3).curveTo(17.2,8.8,17.9,9.3).curveTo(20.8,11.2,24.8,11.2).moveTo(14.8,12.4).curveTo(14.8,12.7,14.9,12.9).curveTo(14.8,12.8,14.8,12.8).curveTo(13,12,13,12.2).curveTo(12.7,14.6,12.7,17.2).curveTo(13,23.1,13.7,25.8).lineTo(13.7,25.8).curveTo(14.2,28.1,14.5,30.1).curveTo(14.7,31.3,14.7,32.4).lineTo(14.7,35.1).curveTo(14.7,35.2,14.7,35.3).curveTo(14.6,36.2,13.9,37).curveTo(12.8,38.3,10.7,37.9).curveTo(8.1,37.4,7.2,34.8).lineTo(6.7,32.5).curveTo(6.7,31.8,6.9,31.1).lineTo(6.9,31.1).lineTo(6.7,30.5).curveTo(6.7,30.3,6.7,30.1).curveTo(6.8,28.1,8,26.8).curveTo(9.1,25.5,10.7,25.2).curveTo(12.4,24.9,13.5,25.6).curveTo(13.6,25.7,13.7,25.8).curveTo(14.4,26.3,14.6,27.2).curveTo(14.7,27.7,14.7,28.2).curveTo(14.7,18.5,14.8,12.8).curveTo(14.7,12.6,14.8,12.4).closePath().moveTo(14.9,12.9).curveTo(15.3,13.9,16.5,14.8).curveTo(17.9,15.7,19.2,16.1).curveTo(20.2,16.4,21.3,16.5).curveTo(16.9,13.9,14.9,12.9).closePath();
	this.shape_46.setTransform(217.7,147.5485);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.beginFill("#000000").beginStroke().moveTo(13.8,26.9).curveTo(11.5,26.5,10.5,24.6).lineTo(9.9,22.7).lineTo(9.8,22.3).curveTo(9.8,21.6,9.9,21).lineTo(9.9,20.9).lineTo(9.7,20.4).curveTo(9.8,18,11.3,16.7).lineTo(11.7,16.3).lineTo(11.7,16.7).lineTo(11.9,17.2).lineTo(11.9,17.3).curveTo(11.7,17.9,11.7,18.7).lineTo(12.2,21).curveTo(13.2,23.6,15.8,24).curveTo(17.9,24.4,18.9,23.2).curveTo(19.7,22.4,19.7,21.5).lineTo(19.7,21.9).lineTo(19.7,22).lineTo(19.7,22.2).curveTo(19.7,23.6,18.8,24.9).lineTo(18.5,25.3).curveTo(17.2,26.9,15,27).lineTo(13.8,26.9).closePath().moveTo(-14.9,-17).curveTo(-18,-17.1,-19.6,-21.6).curveTo(-18,-17.1,-14.9,-17).curveTo(-18,-17,-19.2,-19.7).lineTo(-19.6,-21.6).lineTo(-19.8,-21.9).curveTo(-19.8,-24.3,-18.2,-25.7).curveTo(-16.8,-27,-14.7,-27).curveTo(-12.7,-27,-11.3,-25.7).curveTo(-9.8,-24.4,-9.8,-22.1).lineTo(-9.8,-21.9).curveTo(-9.8,-20.4,-10.8,-19).curveTo(-12.2,-16.9,-14.7,-17).closePath();
	this.shape_47.setTransform(212.65,161.35);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(-19.8,-7.2).lineTo(-19.8,-7.3).lineTo(-19.8,-37).curveTo(-19.7,-34.2,-16.8,-32.2).curveTo(-13.9,-30.2,-9.7,-30.2).moveTo(19.8,12.2).curveTo(15.6,12.2,12.7,10.1).curveTo(9.8,8.1,9.7,5.4).lineTo(9.7,7.4).curveTo(9.8,10.1,12.7,12.1).curveTo(15.6,14.2,19.8,14.2).moveTo(9.7,37).lineTo(9.7,35.3).lineTo(9.7,35).lineTo(9.7,7.4);
	this.shape_48.setTransform(222.7,146.2);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.beginFill("#000000").beginStroke().moveTo(10.3,24.4).lineTo(9.7,22.2).curveTo(9.7,21.4,9.9,20.7).lineTo(9.9,20.7).lineTo(9.7,20.2).curveTo(9.8,17.8,11.3,16.4).curveTo(12.7,15.2,14.8,15.2).curveTo(16.8,15.2,18.2,16.4).curveTo(19.7,17.8,19.7,20).lineTo(19.7,20.3).lineTo(19.6,21.1).lineTo(19.6,21.1).lineTo(19.7,22.1).lineTo(19.7,22.2).curveTo(19.8,23.7,18.7,25.2).curveTo(17.4,27.2,14.8,27.2).curveTo(11.5,27.2,10.3,24.4).closePath().moveTo(-19.2,-19.9).lineTo(-19.8,-22.2).curveTo(-19.8,-24.5,-18.2,-26).curveTo(-16.8,-27.2,-14.7,-27.2).curveTo(-12.7,-27.2,-11.3,-26).curveTo(-9.8,-24.6,-9.8,-22.3).lineTo(-9.8,-22.2).curveTo(-9.8,-20.6,-10.8,-19.1).curveTo(-12.2,-17.2,-14.7,-17.1).curveTo(-18,-17.2,-19.2,-19.9).closePath();
	this.shape_49.setTransform(212.65,161.15);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(103.7,35.1).curveTo(103.8,37.9,106.7,39.9).curveTo(109.6,41.9,113.8,41.9).moveTo(113.8,39.9).curveTo(109.6,39.9,106.7,37.9).curveTo(103.8,35.9,103.7,33.1).lineTo(103.7,35.1).lineTo(103.7,62.8).lineTo(103.7,63.1).lineTo(103.7,64.6).lineTo(103.7,64.8).moveTo(-38,1.8).lineTo(-38,1.7).lineTo(-38,-28).curveTo(-37.9,-25.2,-35.1,-23.2).curveTo(-32.1,-21.2,-27.9,-21.2).moveTo(-8.5,16.4).curveTo(-8.4,19.1,-5.6,21.1).curveTo(-2.6,23.2,1.6,23.2).moveTo(1.6,21.2).curveTo(-2.6,21.2,-5.6,19.1).curveTo(-8.4,17.1,-8.5,14.4).lineTo(-8.5,16.4).lineTo(-8.5,44).lineTo(-8.5,44.3).lineTo(-8.5,46).moveTo(74.2,20.6).lineTo(74.2,20.4).lineTo(74.2,-9.2).curveTo(74.3,-6.5,77.2,-4.5).curveTo(80.1,-2.4,84.3,-2.4).moveTo(-113.8,-35).lineTo(-113.8,-35.1).lineTo(-113.8,-64.8).curveTo(-113.7,-62,-110.8,-60).curveTo(-107.9,-58,-103.7,-58).moveTo(-84.3,-20.4).curveTo(-84.2,-17.7,-81.3,-15.7).curveTo(-78.4,-13.6,-74.2,-13.6).moveTo(-74.2,-15.6).curveTo(-78.4,-15.6,-81.3,-17.7).curveTo(-84.2,-19.7,-84.3,-22.4).lineTo(-84.3,-20.4).lineTo(-84.3,7.2).lineTo(-84.3,7.6).lineTo(-84.3,9).lineTo(-84.3,9.2);
	this.shape_50.setTransform(240.95,137.175);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.beginFill("#000000").beginStroke().moveTo(104.3,52.2).lineTo(103.7,50).curveTo(103.7,49.2,104,48.5).lineTo(104,48.5).lineTo(103.7,48).curveTo(103.8,45.6,105.3,44.2).curveTo(106.7,42.9,108.8,42.9).curveTo(110.8,42.9,112.2,44.2).curveTo(113.7,45.5,113.7,47.8).lineTo(113.7,48.2).lineTo(113.6,48.9).lineTo(113.7,49.7).lineTo(113.7,49.8).lineTo(113.7,50).curveTo(113.7,51.5,112.7,53).curveTo(111.3,55,108.8,55).curveTo(105.5,55,104.3,52.2).closePath().moveTo(-8,33.5).lineTo(-8.5,31.2).curveTo(-8.5,30.4,-8.3,29.7).lineTo(-8.3,29.7).lineTo(-8.5,29.2).curveTo(-8.5,26.8,-7,25.4).curveTo(-5.6,24.2,-3.5,24.2).curveTo(-1.5,24.2,-0.1,25.4).curveTo(1.4,26.8,1.5,29.1).lineTo(1.5,29.4).lineTo(1.4,30.1).lineTo(1.4,30.1).lineTo(1.5,31.1).lineTo(1.5,31.2).curveTo(1.5,32.8,0.5,34.2).curveTo(-0.9,36.2,-3.5,36.2).curveTo(-6.8,36.2,-8,33.5).closePath().moveTo(74.8,7.9).lineTo(74.3,5.6).curveTo(74.3,3.2,75.8,1.8).curveTo(77.2,0.6,79.2,0.6).curveTo(81.3,0.6,82.7,1.8).curveTo(84.2,3.2,84.3,5.5).lineTo(84.3,5.6).curveTo(84.2,7.2,83.3,8.6).curveTo(81.9,10.6,79.2,10.6).curveTo(76,10.6,74.8,7.9).closePath().moveTo(-83.7,-3.3).lineTo(-84.3,-5.6).curveTo(-84.2,-6.4,-84,-7).lineTo(-84,-7.1).lineTo(-84.3,-7.6).curveTo(-84.2,-10,-82.7,-11.4).curveTo(-81.3,-12.6,-79.3,-12.6).curveTo(-77.2,-12.6,-75.8,-11.4).curveTo(-74.3,-10,-74.2,-7.7).lineTo(-74.2,-7.3).lineTo(-74.4,-6.7).lineTo(-74.2,-5.9).lineTo(-74.2,-5.7).lineTo(-74.2,-5.6).curveTo(-74.2,-4,-75.3,-2.6).curveTo(-76.7,-0.6,-79.3,-0.6).curveTo(-82.5,-0.6,-83.7,-3.3).closePath().moveTo(-37.5,-10.9).lineTo(-38,-13.1).curveTo(-38,-15.5,-36.4,-16.9).curveTo(-35.1,-18.2,-33,-18.2).curveTo(-31,-18.2,-29.6,-16.9).curveTo(-28.1,-15.6,-28,-13.3).lineTo(-28,-13.1).curveTo(-28,-11.6,-29,-10.1).curveTo(-30.4,-8.1,-33,-8.1).curveTo(-36.3,-8.1,-37.5,-10.9).closePath().moveTo(-113.2,-47.7).lineTo(-113.7,-49.9).lineTo(-113.7,-50.7).curveTo(-113.5,-52.6,-112.2,-53.7).curveTo(-110.8,-55,-108.8,-55).lineTo(-107.9,-54.9).curveTo(-106.4,-54.7,-105.3,-53.7).curveTo(-103.8,-52.4,-103.7,-50.1).lineTo(-103.7,-49.9).curveTo(-103.8,-48.4,-104.7,-46.9).curveTo(-106.1,-44.9,-108.8,-44.9).curveTo(-112,-44.9,-113.2,-47.7).closePath();
	this.shape_51.setTransform(230.9,152.125);

	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(39.1,1.8).lineTo(39.1,1.7).lineTo(39.1,-28).curveTo(39.2,-25.2,42,-23.2).curveTo(45,-21.2,49.2,-21.2).moveTo(68.6,16.4).curveTo(68.7,19.1,71.5,21.1).curveTo(74.5,23.2,78.7,23.2).moveTo(78.7,21.2).curveTo(74.5,21.2,71.5,19.1).curveTo(68.7,17.1,68.6,14.4).lineTo(68.6,16.4).lineTo(68.6,44).lineTo(68.6,44.3).lineTo(68.6,46).moveTo(-36.7,-35).lineTo(-36.7,-35.1).lineTo(-36.7,-64.8).curveTo(-36.6,-62,-33.7,-60).curveTo(-30.8,-58,-26.6,-58).moveTo(-7.2,-20.4).curveTo(-7.1,-17.7,-4.2,-15.7).curveTo(-1.3,-13.6,2.9,-13.6).moveTo(2.9,-15.6).curveTo(-1.3,-15.6,-4.2,-17.7).curveTo(-7.1,-19.7,-7.2,-22.4).lineTo(-7.2,-20.4).lineTo(-7.2,7.2).lineTo(-7.2,7.6).lineTo(-7.2,9).lineTo(-7.2,9.2).moveTo(-78.7,20.6).lineTo(-78.7,20.4).lineTo(-78.7,-9.2).curveTo(-78.6,-6.5,-75.7,-4.5).curveTo(-72.8,-2.4,-68.6,-2.4).moveTo(-49.2,35.1).curveTo(-49.1,37.9,-46.2,39.9).curveTo(-43.3,41.9,-39.1,41.9).moveTo(-39.1,39.9).curveTo(-43.3,39.9,-46.2,37.9).curveTo(-49.1,35.9,-49.2,33.1).lineTo(-49.2,35.1).lineTo(-49.2,62.8).lineTo(-49.2,63.2).lineTo(-49.2,64.6).lineTo(-49.2,64.8);
	this.shape_52.setTransform(163.825,137.175);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.beginFill("#000000").beginStroke().moveTo(-48.6,52.2).lineTo(-49.1,50).curveTo(-49.1,49.2,-48.9,48.5).lineTo(-48.9,48.5).lineTo(-49.1,48).curveTo(-49.1,45.6,-47.6,44.2).curveTo(-46.2,42.9,-44.1,42.9).curveTo(-42.1,42.9,-40.7,44.2).curveTo(-39.2,45.5,-39.1,47.8).lineTo(-39.1,48.2).lineTo(-39.2,48.9).lineTo(-39.1,49.6).lineTo(-39.1,49.8).lineTo(-39.1,50).curveTo(-39.1,51.5,-40.1,53).curveTo(-41.5,55,-44.1,55).curveTo(-47.4,55,-48.6,52.2).closePath().moveTo(69.2,33.5).lineTo(68.6,31.2).curveTo(68.6,30.4,68.8,29.7).lineTo(68.8,29.7).lineTo(68.6,29.2).curveTo(68.6,26.8,70.2,25.4).curveTo(71.6,24.2,73.6,24.2).curveTo(75.7,24.2,77.1,25.4).curveTo(78.6,26.8,78.6,29.1).lineTo(78.6,29.4).lineTo(78.5,30.1).lineTo(78.5,30.1).lineTo(78.6,31.1).lineTo(78.6,31.2).curveTo(78.6,32.8,77.6,34.2).curveTo(76.2,36.2,73.6,36.2).curveTo(70.4,36.2,69.2,33.5).closePath().moveTo(-78.1,7.9).lineTo(-78.6,5.6).curveTo(-78.6,3.2,-77.1,1.8).curveTo(-75.7,0.6,-73.6,0.6).curveTo(-71.6,0.6,-70.2,1.8).curveTo(-68.7,3.2,-68.6,5.5).lineTo(-68.6,5.6).curveTo(-68.6,7.2,-69.6,8.6).curveTo(-71,10.6,-73.6,10.6).curveTo(-76.9,10.6,-78.1,7.9).closePath().moveTo(-6.6,-3.3).lineTo(-7.1,-5.6).curveTo(-7.1,-6.4,-6.9,-7).lineTo(-6.9,-7.1).lineTo(-7.1,-7.6).curveTo(-7.1,-10,-5.6,-11.4).curveTo(-4.2,-12.6,-2.1,-12.6).curveTo(-0.1,-12.6,1.3,-11.4).curveTo(2.8,-10,2.9,-7.7).lineTo(2.9,-7.3).lineTo(2.8,-6.7).lineTo(2.9,-5.9).lineTo(2.9,-5.7).lineTo(2.9,-5.6).curveTo(2.9,-4,1.9,-2.6).curveTo(0.5,-0.6,-2.1,-0.6).curveTo(-5.4,-0.6,-6.6,-3.3).closePath().moveTo(39.7,-10.9).lineTo(39.1,-13.1).curveTo(39.1,-15.5,40.7,-16.9).curveTo(42.1,-18.2,44.1,-18.2).curveTo(46.2,-18.2,47.6,-16.9).curveTo(49.1,-15.6,49.1,-13.3).lineTo(49.1,-13.1).curveTo(49.1,-11.6,48.1,-10.1).curveTo(46.7,-8.1,44.1,-8.1).curveTo(40.9,-8.1,39.7,-10.9).closePath().moveTo(-36.1,-47.7).lineTo(-36.6,-49.9).lineTo(-36.6,-50.7).curveTo(-36.4,-52.6,-35.1,-53.7).curveTo(-33.7,-55,-31.6,-55).lineTo(-30.8,-54.9).curveTo(-29.3,-54.7,-28.2,-53.7).curveTo(-26.7,-52.4,-26.6,-50.1).lineTo(-26.6,-49.9).curveTo(-26.6,-48.4,-27.6,-46.9).curveTo(-29,-44.9,-31.6,-44.9).curveTo(-34.9,-44.9,-36.1,-47.7).closePath();
	this.shape_53.setTransform(153.775,152.125);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(22.3,-42.6).curveTo(22.4,-39.8,25.3,-37.8).curveTo(28.2,-35.8,32.4,-35.8).moveTo(22.3,-42.6).lineTo(22.3,-44.6).curveTo(22.4,-41.8,25.3,-39.8).curveTo(28.2,-37.8,32.4,-37.8).moveTo(39.1,24).lineTo(39.1,23.8).lineTo(39.1,-5.8).curveTo(39.2,-3,42,-1).curveTo(45,1,49.2,1).moveTo(22.3,-13).lineTo(22.3,-13.1).lineTo(22.3,-14.6).lineTo(22.3,-15).lineTo(22.3,-42.6).moveTo(68.6,38.6).curveTo(68.7,41.3,71.5,43.3).curveTo(74.5,45.3,78.7,45.3).moveTo(78.7,43.3).curveTo(74.5,43.3,71.5,41.3).curveTo(68.7,39.3,68.6,36.6).lineTo(68.6,38.6).lineTo(68.6,66.2).lineTo(68.6,66.5).lineTo(68.6,68.2).moveTo(-7.2,-57.1).lineTo(-7.2,-57.3).lineTo(-7.2,-87).curveTo(-7.1,-84.2,-4.2,-82.2).curveTo(-1.3,-80.2,2.9,-80.2).moveTo(-36.7,-12.8).lineTo(-36.7,-13).lineTo(-36.7,-42.6).curveTo(-36.6,-39.8,-33.7,-37.8).curveTo(-30.8,-35.8,-26.6,-35.8).moveTo(-7.2,1.8).curveTo(-7.1,4.5,-4.2,6.5).curveTo(-1.3,8.5,2.9,8.5).moveTo(2.9,6.5).curveTo(-1.3,6.5,-4.2,4.5).curveTo(-7.1,2.5,-7.2,-0.3).lineTo(-7.2,1.8).lineTo(-7.2,29.4).lineTo(-7.2,29.8).lineTo(-7.2,31.2).lineTo(-7.2,31.4).moveTo(-78.7,42.8).lineTo(-78.7,42.6).lineTo(-78.7,13).curveTo(-78.6,15.7,-75.7,17.7).curveTo(-72.8,19.8,-68.6,19.8).moveTo(-49.2,57.3).curveTo(-49.1,60.1,-46.2,62.1).curveTo(-43.3,64.1,-39.1,64.1).moveTo(-49.2,57.3).lineTo(-49.2,55.3).curveTo(-49.1,58.1,-46.2,60.1).curveTo(-43.3,62.1,-39.1,62.1).moveTo(-49.2,86.9).lineTo(-49.2,86.8).lineTo(-49.2,85.3).lineTo(-49.2,84.9).lineTo(-49.2,57.3);
	this.shape_54.setTransform(163.825,115);

	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.beginFill("#000000").beginStroke().moveTo(-48.6,74.4).lineTo(-49.1,72.2).curveTo(-49.1,71.4,-48.9,70.7).lineTo(-48.9,70.7).lineTo(-49.1,70.1).curveTo(-49.1,67.7,-47.6,66.3).curveTo(-46.2,65.1,-44.1,65.1).curveTo(-42.1,65.1,-40.7,66.3).curveTo(-39.2,67.7,-39.1,70).lineTo(-39.1,70.4).lineTo(-39.2,71).lineTo(-39.1,71.8).lineTo(-39.1,72).lineTo(-39.1,72.2).curveTo(-39.1,73.7,-40.1,75.2).curveTo(-41.5,77.1,-44.1,77.1).curveTo(-47.4,77.2,-48.6,74.4).closePath().moveTo(69.2,55.6).lineTo(68.6,53.4).curveTo(68.6,52.6,68.8,51.9).lineTo(68.8,51.9).lineTo(68.6,51.4).curveTo(68.6,49,70.2,47.6).curveTo(71.6,46.4,73.6,46.4).curveTo(75.7,46.4,77.1,47.6).curveTo(78.6,49,78.6,51.2).lineTo(78.6,51.5).lineTo(78.5,52.3).lineTo(78.5,52.3).lineTo(78.6,53.3).lineTo(78.6,53.4).curveTo(78.6,54.9,77.6,56.4).curveTo(76.2,58.4,73.6,58.4).curveTo(70.4,58.4,69.2,55.6).closePath().moveTo(-78.1,30.1).lineTo(-78.6,27.8).curveTo(-78.6,25.4,-77.1,24).curveTo(-75.7,22.8,-73.6,22.8).curveTo(-71.6,22.8,-70.2,24).curveTo(-68.7,25.3,-68.6,27.6).lineTo(-68.6,27.8).curveTo(-68.6,29.3,-69.6,30.8).curveTo(-71,32.8,-73.6,32.8).curveTo(-76.9,32.8,-78.1,30.1).closePath().moveTo(-6.6,18.8).lineTo(-7.1,16.6).curveTo(-7.1,15.8,-6.9,15.1).lineTo(-6.9,15.1).lineTo(-7.1,14.6).curveTo(-7.1,12.2,-5.6,10.8).curveTo(-4.2,9.6,-2.1,9.6).curveTo(-0.1,9.6,1.3,10.8).curveTo(2.8,12.2,2.9,14.4).lineTo(2.9,14.9).lineTo(2.8,15.5).lineTo(2.9,16.2).lineTo(2.9,16.5).lineTo(2.9,16.6).curveTo(2.9,18.1,1.9,19.6).curveTo(0.5,21.6,-2.1,21.6).curveTo(-5.4,21.6,-6.6,18.8).closePath().moveTo(39.7,11.3).lineTo(39.1,9).curveTo(39.1,6.7,40.7,5.2).curveTo(42.1,4,44.1,4).curveTo(46.2,4,47.6,5.2).curveTo(49.1,6.6,49.1,8.9).lineTo(49.1,9).curveTo(49.1,10.6,48.1,12.1).curveTo(46.7,14,44.1,14.1).curveTo(40.9,14,39.7,11.3).closePath().moveTo(22.9,-25.5).lineTo(22.4,-27.7).curveTo(22.4,-28.5,22.6,-29.2).lineTo(22.6,-29.2).lineTo(22.4,-29.8).curveTo(22.4,-32.2,23.9,-33.6).curveTo(25.3,-34.8,27.4,-34.8).curveTo(29.4,-34.8,30.8,-33.6).curveTo(32.3,-32.2,32.4,-29.9).lineTo(32.4,-29.5).lineTo(32.3,-28.9).lineTo(32.4,-28).lineTo(32.4,-27.9).lineTo(32.4,-27.7).curveTo(32.4,-26.2,31.4,-24.7).curveTo(30,-22.8,27.4,-22.8).curveTo(24.1,-22.7,22.9,-25.5).closePath().moveTo(-36.1,-25.5).lineTo(-36.6,-27.7).lineTo(-36.6,-28.5).curveTo(-36.4,-30.4,-35.1,-31.6).curveTo(-33.7,-32.8,-31.6,-32.8).lineTo(-30.8,-32.8).curveTo(-29.3,-32.5,-28.2,-31.6).curveTo(-26.7,-30.2,-26.6,-27.9).lineTo(-26.6,-27.7).curveTo(-26.6,-26.2,-27.6,-24.7).curveTo(-29,-22.8,-31.6,-22.8).curveTo(-34.9,-22.7,-36.1,-25.5).closePath().moveTo(-6.6,-69.8).lineTo(-7.1,-72.1).curveTo(-7.1,-74.5,-5.6,-75.9).curveTo(-4.2,-77.1,-2.1,-77.1).curveTo(-0.1,-77.1,1.3,-75.9).curveTo(2.8,-74.6,2.9,-72.3).lineTo(2.9,-72.1).curveTo(2.9,-70.5,1.9,-69.1).curveTo(0.5,-67.1,-2.1,-67.1).curveTo(-5.4,-67.1,-6.6,-69.8).closePath();
	this.shape_55.setTransform(153.775,129.95);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(32.4,-42.6).curveTo(32.5,-39.8,35.3,-37.8).curveTo(38.3,-35.8,42.5,-35.8).moveTo(32.4,-42.6).lineTo(32.4,-44.6).curveTo(32.5,-41.8,35.3,-39.8).curveTo(38.3,-37.8,42.5,-37.8).moveTo(49.1,24).lineTo(49.1,23.8).lineTo(49.1,-5.8).curveTo(49.2,-3,52.1,-1).curveTo(55,1,59.2,1).moveTo(32.4,-13).lineTo(32.4,-13.1).lineTo(32.4,-14.6).lineTo(32.4,-15).lineTo(32.4,-42.6).moveTo(78.6,38.6).curveTo(78.7,41.3,81.6,43.3).curveTo(84.5,45.3,88.7,45.3).moveTo(88.7,43.3).curveTo(84.5,43.3,81.6,41.3).curveTo(78.7,39.3,78.6,36.6).lineTo(78.6,38.6).lineTo(78.6,66.2).lineTo(78.6,66.5).lineTo(78.6,68.2).moveTo(2.9,-57.1).lineTo(2.9,-57.3).lineTo(2.9,-87).curveTo(3,-84.2,5.8,-82.2).curveTo(8.8,-80.2,13,-80.2).moveTo(-59.2,-35).curveTo(-59.1,-32.3,-56.3,-30.3).curveTo(-53.3,-28.3,-49.1,-28.3).moveTo(-49.1,-30.3).curveTo(-53.3,-30.3,-56.3,-32.3).curveTo(-59.1,-34.3,-59.2,-37).lineTo(-59.2,-35).moveTo(-26.6,-12.8).lineTo(-26.6,-13).lineTo(-26.6,-42.6).curveTo(-26.5,-39.8,-23.7,-37.8).curveTo(-20.7,-35.8,-16.5,-35.8).moveTo(-88.7,-49.6).lineTo(-88.7,-49.8).lineTo(-88.7,-79.4).curveTo(-88.6,-76.7,-85.8,-74.7).curveTo(-82.8,-72.6,-78.6,-72.6).moveTo(2.9,1.8).curveTo(3,4.5,5.8,6.5).curveTo(8.8,8.5,13,8.5).moveTo(13,6.5).curveTo(8.8,6.5,5.8,4.5).curveTo(3,2.5,2.9,-0.3).lineTo(2.9,1.8).lineTo(2.9,29.4).lineTo(2.9,29.8).lineTo(2.9,31.2).lineTo(2.9,31.4).moveTo(-59.2,-5.4).lineTo(-59.2,-5.5).lineTo(-59.2,-7).lineTo(-59.2,-7.4).lineTo(-59.2,-35).moveTo(-68.6,42.8).lineTo(-68.6,42.6).lineTo(-68.6,13).curveTo(-68.5,15.7,-65.7,17.7).curveTo(-62.7,19.8,-58.5,19.8).moveTo(-39.1,57.3).curveTo(-39,60.1,-36.2,62.1).curveTo(-33.2,64.1,-29,64.1).moveTo(-39.1,57.3).lineTo(-39.1,55.3).curveTo(-39,58.1,-36.2,60.1).curveTo(-33.2,62.1,-29,62.1).moveTo(-39.1,86.9).lineTo(-39.1,86.8).lineTo(-39.1,85.3).lineTo(-39.1,84.9).lineTo(-39.1,57.3);
	this.shape_56.setTransform(153.775,115);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.beginFill("#000000").beginStroke().moveTo(-38.5,74.4).lineTo(-39.1,72.2).curveTo(-39.1,71.4,-38.9,70.7).lineTo(-38.9,70.7).lineTo(-39.1,70.1).curveTo(-39.1,67.7,-37.5,66.3).curveTo(-36.1,65.1,-34.1,65.1).curveTo(-32,65.1,-30.6,66.3).curveTo(-29.1,67.7,-29.1,70).lineTo(-29.1,70.4).lineTo(-29.2,71).lineTo(-29.1,71.8).lineTo(-29.1,72).lineTo(-29.1,72.2).curveTo(-29.1,73.7,-30.1,75.2).curveTo(-31.5,77.1,-34.1,77.1).curveTo(-37.3,77.2,-38.5,74.4).closePath().moveTo(79.2,55.6).lineTo(78.7,53.4).curveTo(78.7,52.6,78.9,51.9).lineTo(78.9,51.9).lineTo(78.7,51.4).curveTo(78.7,49,80.2,47.6).curveTo(81.6,46.4,83.7,46.4).curveTo(85.7,46.4,87.1,47.6).curveTo(88.6,49,88.7,51.2).lineTo(88.7,51.5).lineTo(88.6,52.3).lineTo(88.6,52.3).lineTo(88.7,53.3).lineTo(88.7,53.4).curveTo(88.7,54.9,87.7,56.4).curveTo(86.3,58.4,83.7,58.4).curveTo(80.4,58.4,79.2,55.6).closePath().moveTo(-68,30.1).lineTo(-68.6,27.8).curveTo(-68.6,25.4,-67,24).curveTo(-65.6,22.8,-63.6,22.8).curveTo(-61.5,22.8,-60.1,24).curveTo(-58.6,25.3,-58.6,27.6).lineTo(-58.6,27.8).curveTo(-58.6,29.3,-59.6,30.8).curveTo(-61,32.8,-63.6,32.8).curveTo(-66.8,32.8,-68,30.1).closePath().moveTo(3.5,18.8).lineTo(2.9,16.6).curveTo(2.9,15.8,3.1,15.1).lineTo(3.1,15.1).lineTo(2.9,14.6).curveTo(2.9,12.2,4.5,10.8).curveTo(5.9,9.6,7.9,9.6).curveTo(10,9.6,11.4,10.8).curveTo(12.9,12.2,12.9,14.4).lineTo(12.9,14.9).lineTo(12.8,15.5).lineTo(12.9,16.2).lineTo(12.9,16.5).lineTo(12.9,16.6).curveTo(12.9,18.1,11.9,19.6).curveTo(10.5,21.6,7.9,21.6).curveTo(4.7,21.6,3.5,18.8).closePath().moveTo(49.7,11.3).lineTo(49.2,9).curveTo(49.2,6.7,50.7,5.2).curveTo(52.1,4,54.2,4).curveTo(56.2,4,57.6,5.2).curveTo(59.1,6.6,59.2,8.9).lineTo(59.2,9).curveTo(59.2,10.6,58.2,12.1).curveTo(56.8,14,54.2,14.1).curveTo(50.9,14,49.7,11.3).closePath().moveTo(-58.6,-18).lineTo(-59.2,-20.2).curveTo(-59.2,-21,-59,-21.7).lineTo(-59,-21.7).lineTo(-59.2,-22.2).curveTo(-59.2,-24.6,-57.6,-26).curveTo(-56.2,-27.3,-54.2,-27.3).curveTo(-52.1,-27.3,-50.7,-26).curveTo(-49.2,-24.7,-49.2,-22.3).lineTo(-49.2,-22).lineTo(-49.3,-21.3).lineTo(-49.2,-20.5).lineTo(-49.2,-20.3).lineTo(-49.2,-20.2).curveTo(-49.2,-18.6,-50.2,-17.2).curveTo(-51.6,-15.2,-54.2,-15.2).curveTo(-57.4,-15.2,-58.6,-18).closePath().moveTo(33,-25.5).lineTo(32.4,-27.7).curveTo(32.4,-28.5,32.6,-29.2).lineTo(32.6,-29.2).lineTo(32.4,-29.8).curveTo(32.4,-32.2,34,-33.6).curveTo(35.4,-34.8,37.4,-34.8).curveTo(39.5,-34.8,40.9,-33.6).curveTo(42.4,-32.2,42.4,-29.9).lineTo(42.4,-29.5).lineTo(42.3,-28.9).lineTo(42.4,-28).lineTo(42.4,-27.9).lineTo(42.4,-27.7).curveTo(42.4,-26.2,41.4,-24.7).curveTo(40,-22.8,37.4,-22.8).curveTo(34.2,-22.7,33,-25.5).closePath().moveTo(-26,-25.5).lineTo(-26.6,-27.7).lineTo(-26.5,-28.5).curveTo(-26.3,-30.4,-25,-31.6).curveTo(-23.6,-32.8,-21.6,-32.8).lineTo(-20.7,-32.8).curveTo(-19.2,-32.5,-18.1,-31.6).curveTo(-16.6,-30.2,-16.6,-27.9).lineTo(-16.6,-27.7).curveTo(-16.6,-26.2,-17.6,-24.7).curveTo(-19,-22.8,-21.6,-22.8).curveTo(-24.8,-22.7,-26,-25.5).closePath().moveTo(-88.1,-62.3).lineTo(-88.7,-64.5).curveTo(-88.7,-67,-87.1,-68.4).curveTo(-85.7,-69.6,-83.7,-69.6).curveTo(-81.6,-69.6,-80.2,-68.4).curveTo(-78.7,-67,-78.7,-64.7).lineTo(-78.7,-64.5).curveTo(-78.7,-63,-79.7,-61.5).curveTo(-81.1,-59.6,-83.7,-59.6).curveTo(-86.9,-59.5,-88.1,-62.3).closePath().moveTo(3.5,-69.8).lineTo(2.9,-72.1).curveTo(2.9,-74.5,4.5,-75.9).curveTo(5.9,-77.1,7.9,-77.1).curveTo(10,-77.1,11.4,-75.9).curveTo(12.9,-74.6,12.9,-72.3).lineTo(12.9,-72.1).curveTo(12.9,-70.5,11.9,-69.1).curveTo(10.5,-67.1,7.9,-67.1).curveTo(4.7,-67.1,3.5,-69.8).closePath();
	this.shape_57.setTransform(143.725,129.95);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(241.7,-30.4).lineTo(241.7,-30.5).lineTo(241.7,-60.2).curveTo(241.8,-57.5,244.7,-55.5).curveTo(247.6,-53.4,251.8,-53.4).moveTo(271.2,-15.8).curveTo(271.3,-13.1,274.2,-11.1).curveTo(277.1,-9,281.3,-9).moveTo(281.3,-11).curveTo(277.1,-11,274.2,-13.1).curveTo(271.3,-15.1,271.2,-17.8).lineTo(271.2,-15.8).lineTo(271.2,11.8).lineTo(271.2,12.2).lineTo(271.2,13.7).lineTo(271.2,13.8).moveTo(-160.2,-42.6).curveTo(-160.1,-39.8,-157.3,-37.8).curveTo(-154.3,-35.8,-150.1,-35.8).moveTo(-160.2,-42.6).lineTo(-160.2,-44.6).curveTo(-160.1,-41.8,-157.3,-39.8).curveTo(-154.3,-37.8,-150.1,-37.8).moveTo(-143.5,24).lineTo(-143.5,23.8).lineTo(-143.5,-5.8).curveTo(-143.4,-3,-140.5,-1).curveTo(-137.6,1,-133.4,1).moveTo(-160.2,-13).lineTo(-160.2,-13.1).lineTo(-160.2,-14.6).lineTo(-160.2,-15).lineTo(-160.2,-42.6).moveTo(-114,38.6).curveTo(-113.9,41.3,-111,43.3).curveTo(-108.1,45.3,-103.9,45.3).moveTo(-103.9,43.3).curveTo(-108.1,43.3,-111,41.3).curveTo(-113.9,39.3,-114,36.6).lineTo(-114,38.6).lineTo(-114,66.2).lineTo(-114,66.5).lineTo(-114,68.2).moveTo(-189.7,-57.1).lineTo(-189.7,-57.3).lineTo(-189.7,-87).curveTo(-189.6,-84.2,-186.8,-82.2).curveTo(-183.8,-80.2,-179.6,-80.2).moveTo(-251.8,-35).curveTo(-251.7,-32.3,-248.9,-30.3).curveTo(-245.9,-28.3,-241.7,-28.3).moveTo(-241.7,-30.3).curveTo(-245.9,-30.3,-248.9,-32.3).curveTo(-251.7,-34.3,-251.8,-37).lineTo(-251.8,-35).moveTo(-219.2,-12.8).lineTo(-219.2,-13).lineTo(-219.2,-42.6).curveTo(-219.1,-39.8,-216.3,-37.8).curveTo(-213.3,-35.8,-209.1,-35.8).moveTo(-281.3,-49.6).lineTo(-281.3,-49.8).lineTo(-281.3,-79.4).curveTo(-281.2,-76.7,-278.4,-74.7).curveTo(-275.4,-72.6,-271.2,-72.6).moveTo(-189.7,1.8).curveTo(-189.6,4.5,-186.8,6.5).curveTo(-183.8,8.5,-179.6,8.5).moveTo(-179.6,6.5).curveTo(-183.8,6.5,-186.8,4.5).curveTo(-189.6,2.5,-189.7,-0.3).lineTo(-189.7,1.8).lineTo(-189.7,29.4).lineTo(-189.7,29.8).lineTo(-189.7,31.2).lineTo(-189.7,31.4).moveTo(-251.8,-5.4).lineTo(-251.8,-5.5).lineTo(-251.8,-7).lineTo(-251.8,-7.4).lineTo(-251.8,-35).moveTo(-261.2,42.8).lineTo(-261.2,42.6).lineTo(-261.2,13).curveTo(-261.1,15.7,-258.3,17.7).curveTo(-255.3,19.8,-251.1,19.8).moveTo(-231.7,57.3).curveTo(-231.6,60.1,-228.8,62.1).curveTo(-225.8,64.1,-221.6,64.1).moveTo(-231.7,57.3).lineTo(-231.7,55.3).curveTo(-231.6,58.1,-228.8,60.1).curveTo(-225.8,62.1,-221.6,62.1).moveTo(-231.7,86.9).lineTo(-231.7,86.8).lineTo(-231.7,85.3).lineTo(-231.7,84.9).lineTo(-231.7,57.3);
	this.shape_58.setTransform(346.375,115);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.beginFill("#000000").beginStroke().moveTo(-231.1,74.4).lineTo(-231.7,72.2).curveTo(-231.7,71.4,-231.5,70.7).lineTo(-231.5,70.7).lineTo(-231.7,70.1).curveTo(-231.7,67.7,-230.1,66.3).curveTo(-228.7,65.1,-226.7,65.1).curveTo(-224.6,65.1,-223.2,66.3).curveTo(-221.7,67.7,-221.7,70).lineTo(-221.7,70.4).lineTo(-221.8,71).lineTo(-221.7,71.8).lineTo(-221.7,72).lineTo(-221.7,72.2).curveTo(-221.7,73.7,-222.7,75.2).curveTo(-224.1,77.1,-226.7,77.1).curveTo(-229.9,77.2,-231.1,74.4).closePath().moveTo(-113.4,55.6).lineTo(-113.9,53.4).curveTo(-113.9,52.6,-113.7,51.9).lineTo(-113.7,51.9).lineTo(-113.9,51.4).curveTo(-113.9,49,-112.4,47.6).curveTo(-111,46.4,-108.9,46.4).curveTo(-106.9,46.4,-105.5,47.6).curveTo(-104,49,-103.9,51.2).lineTo(-103.9,51.5).lineTo(-104,52.3).lineTo(-104,52.3).lineTo(-103.9,53.3).lineTo(-103.9,53.4).curveTo(-103.9,54.9,-104.9,56.4).curveTo(-106.3,58.4,-108.9,58.4).curveTo(-112.2,58.4,-113.4,55.6).closePath().moveTo(-260.6,30.1).lineTo(-261.2,27.8).curveTo(-261.2,25.4,-259.6,24).curveTo(-258.2,22.8,-256.2,22.8).curveTo(-254.1,22.8,-252.7,24).curveTo(-251.2,25.3,-251.2,27.6).lineTo(-251.2,27.8).curveTo(-251.2,29.3,-252.2,30.8).curveTo(-253.6,32.8,-256.2,32.8).curveTo(-259.4,32.8,-260.6,30.1).closePath().moveTo(-189.1,18.8).lineTo(-189.7,16.6).curveTo(-189.7,15.8,-189.5,15.1).lineTo(-189.5,15.1).lineTo(-189.7,14.6).curveTo(-189.7,12.2,-188.1,10.8).curveTo(-186.7,9.6,-184.7,9.6).curveTo(-182.6,9.6,-181.2,10.8).curveTo(-179.7,12.2,-179.7,14.4).lineTo(-179.7,14.9).lineTo(-179.8,15.5).lineTo(-179.7,16.2).lineTo(-179.7,16.5).lineTo(-179.7,16.6).curveTo(-179.7,18.1,-180.7,19.6).curveTo(-182.1,21.6,-184.7,21.6).curveTo(-187.9,21.6,-189.1,18.8).closePath().moveTo(-142.9,11.3).lineTo(-143.4,9).curveTo(-143.4,6.7,-141.9,5.2).curveTo(-140.5,4,-138.4,4).curveTo(-136.4,4,-135,5.2).curveTo(-133.5,6.6,-133.4,8.9).lineTo(-133.4,9).curveTo(-133.4,10.6,-134.4,12.1).curveTo(-135.8,14,-138.4,14.1).curveTo(-141.7,14,-142.9,11.3).closePath().moveTo(271.8,1.3).lineTo(271.3,-1).curveTo(271.3,-1.8,271.5,-2.4).lineTo(271.5,-2.5).lineTo(271.3,-3).curveTo(271.3,-5.4,272.8,-6.8).curveTo(274.2,-8.1,276.3,-8.1).curveTo(278.3,-8.1,279.7,-6.8).curveTo(281.2,-5.5,281.3,-3.1).lineTo(281.3,-2.8).lineTo(281.2,-2.1).lineTo(281.3,-1.3).lineTo(281.3,-1.2).lineTo(281.3,-1).curveTo(281.3,0.5,280.3,2).curveTo(278.9,4,276.3,4).curveTo(273,4,271.8,1.3).closePath().moveTo(-251.2,-18).lineTo(-251.8,-20.2).curveTo(-251.8,-21,-251.6,-21.7).lineTo(-251.6,-21.7).lineTo(-251.8,-22.2).curveTo(-251.8,-24.6,-250.2,-26).curveTo(-248.8,-27.3,-246.8,-27.3).curveTo(-244.7,-27.3,-243.3,-26).curveTo(-241.8,-24.7,-241.8,-22.3).lineTo(-241.8,-22).lineTo(-241.9,-21.3).lineTo(-241.8,-20.5).lineTo(-241.8,-20.3).lineTo(-241.8,-20.2).curveTo(-241.8,-18.6,-242.8,-17.2).curveTo(-244.2,-15.2,-246.8,-15.2).curveTo(-250,-15.2,-251.2,-18).closePath().moveTo(-159.6,-25.5).lineTo(-160.2,-27.7).curveTo(-160.2,-28.5,-160,-29.2).lineTo(-160,-29.2).lineTo(-160.2,-29.8).curveTo(-160.2,-32.2,-158.6,-33.6).curveTo(-157.2,-34.8,-155.2,-34.8).curveTo(-153.1,-34.8,-151.7,-33.6).curveTo(-150.2,-32.2,-150.2,-29.9).lineTo(-150.2,-29.5).lineTo(-150.3,-28.9).lineTo(-150.2,-28).lineTo(-150.2,-27.9).lineTo(-150.2,-27.7).curveTo(-150.2,-26.2,-151.2,-24.7).curveTo(-152.6,-22.8,-155.2,-22.8).curveTo(-158.4,-22.7,-159.6,-25.5).closePath().moveTo(-218.6,-25.5).lineTo(-219.2,-27.7).lineTo(-219.1,-28.5).curveTo(-218.9,-30.4,-217.6,-31.6).curveTo(-216.2,-32.8,-214.2,-32.8).lineTo(-213.3,-32.8).curveTo(-211.8,-32.5,-210.7,-31.6).curveTo(-209.2,-30.2,-209.2,-27.9).lineTo(-209.2,-27.7).curveTo(-209.2,-26.2,-210.2,-24.7).curveTo(-211.6,-22.8,-214.2,-22.8).curveTo(-217.4,-22.7,-218.6,-25.5).closePath().moveTo(242.3,-43.1).lineTo(241.8,-45.4).curveTo(241.8,-47.8,243.3,-49.1).curveTo(244.7,-50.4,246.8,-50.4).curveTo(248.8,-50.4,250.2,-49.1).curveTo(251.7,-47.8,251.8,-45.5).lineTo(251.8,-45.4).curveTo(251.8,-43.8,250.8,-42.4).curveTo(249.4,-40.3,246.8,-40.3).curveTo(243.5,-40.3,242.3,-43.1).closePath().moveTo(-280.7,-62.3).lineTo(-281.3,-64.5).curveTo(-281.3,-67,-279.7,-68.4).curveTo(-278.3,-69.6,-276.3,-69.6).curveTo(-274.2,-69.6,-272.8,-68.4).curveTo(-271.3,-67,-271.3,-64.7).lineTo(-271.3,-64.5).curveTo(-271.3,-63,-272.3,-61.5).curveTo(-273.7,-59.6,-276.3,-59.6).curveTo(-279.5,-59.5,-280.7,-62.3).closePath().moveTo(-189.1,-69.8).lineTo(-189.7,-72.1).curveTo(-189.7,-74.5,-188.1,-75.9).curveTo(-186.7,-77.1,-184.7,-77.1).curveTo(-182.6,-77.1,-181.2,-75.9).curveTo(-179.7,-74.6,-179.7,-72.3).lineTo(-179.7,-72.1).curveTo(-179.7,-70.5,-180.7,-69.1).curveTo(-182.1,-67.1,-184.7,-67.1).curveTo(-187.9,-67.1,-189.1,-69.8).closePath();
	this.shape_59.setTransform(336.325,129.95);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(236.7,-47.8).lineTo(236.7,-48).lineTo(236.7,-77.6).curveTo(236.8,-74.9,239.7,-72.9).curveTo(242.6,-70.8,246.8,-70.8).moveTo(266.2,-33.3).curveTo(266.3,-30.5,269.2,-28.5).curveTo(272.1,-26.5,276.3,-26.5).moveTo(276.3,-28.5).curveTo(272.1,-28.5,269.2,-30.5).curveTo(266.3,-32.5,266.2,-35.3).lineTo(266.2,-33.3).lineTo(266.2,-5.6).lineTo(266.2,-5.3).lineTo(266.2,-3.7).lineTo(266.2,-3.6).moveTo(246.7,60.2).lineTo(246.7,60).lineTo(246.7,30.3).curveTo(246.8,33.1,249.7,35.1).curveTo(252.6,37.2,256.8,37.2).moveTo(276.2,74.7).curveTo(276.3,77.4,279.2,79.4).curveTo(282.1,81.5,286.3,81.5).moveTo(286.3,79.5).curveTo(282.1,79.5,279.2,77.4).curveTo(276.3,75.4,276.2,72.7).lineTo(276.2,74.7).lineTo(276.2,102.3).lineTo(276.2,102.7).lineTo(276.2,104.2).lineTo(276.2,104.3).moveTo(-165.2,-60).curveTo(-165.1,-57.3,-162.3,-55.3).curveTo(-159.3,-53.2,-155.1,-53.2).moveTo(-155.1,-55.2).curveTo(-159.3,-55.2,-162.3,-57.3).curveTo(-165.1,-59.3,-165.2,-62).lineTo(-165.2,-60).lineTo(-165.2,-32.4).lineTo(-165.2,-32).lineTo(-165.2,-30.5).lineTo(-165.2,-30.4).moveTo(-148.5,6.6).lineTo(-148.5,6.4).lineTo(-148.5,-23.2).curveTo(-148.4,-20.5,-145.5,-18.5).curveTo(-142.6,-16.4,-138.4,-16.4).moveTo(-119,21.2).curveTo(-118.9,23.9,-116,25.9).curveTo(-113.1,27.9,-108.9,27.9).moveTo(-108.9,25.9).curveTo(-113.1,25.9,-116,23.9).curveTo(-118.9,21.9,-119,19.2).lineTo(-119,21.2).lineTo(-119,48.8).lineTo(-119,49.1).lineTo(-119,50.8).moveTo(-194.7,-74.6).lineTo(-194.7,-74.7).lineTo(-194.7,-104.4).curveTo(-194.6,-101.6,-191.8,-99.6).curveTo(-188.8,-97.6,-184.6,-97.6).moveTo(-256.8,-52.5).curveTo(-256.7,-49.7,-253.9,-47.7).curveTo(-250.9,-45.7,-246.7,-45.7).moveTo(-246.7,-47.7).curveTo(-250.9,-47.7,-253.9,-49.7).curveTo(-256.7,-51.7,-256.8,-54.5).lineTo(-256.8,-52.5).moveTo(-224.2,-30.2).lineTo(-224.2,-30.4).lineTo(-224.2,-60).curveTo(-224.1,-57.3,-221.3,-55.3).curveTo(-218.3,-53.2,-214.1,-53.2).moveTo(-286.3,-67).lineTo(-286.3,-67.2).lineTo(-286.3,-96.8).curveTo(-286.2,-94.1,-283.4,-92.1).curveTo(-280.4,-90,-276.2,-90).moveTo(-194.7,-15.7).curveTo(-194.6,-12.9,-191.8,-10.9).curveTo(-188.8,-8.9,-184.6,-8.9).moveTo(-184.6,-10.9).curveTo(-188.8,-10.9,-191.8,-12.9).curveTo(-194.6,-14.9,-194.7,-17.7).lineTo(-194.7,-15.7).lineTo(-194.7,12).lineTo(-194.7,12.4).lineTo(-194.7,13.8).lineTo(-194.7,14).moveTo(-256.8,-22.8).lineTo(-256.8,-22.9).lineTo(-256.8,-24.5).lineTo(-256.8,-24.8).lineTo(-256.8,-52.5).moveTo(-266.2,25.3).lineTo(-266.2,25.2).lineTo(-266.2,-4.5).curveTo(-266.1,-1.7,-263.3,0.3).curveTo(-260.3,2.3,-256.1,2.3).moveTo(-236.7,39.9).curveTo(-236.6,42.7,-233.8,44.7).curveTo(-230.8,46.7,-226.6,46.7).moveTo(-226.6,44.7).curveTo(-230.8,44.7,-233.8,42.7).curveTo(-236.6,40.7,-236.7,37.9).lineTo(-236.7,39.9).lineTo(-236.7,67.5).lineTo(-236.7,67.9).lineTo(-236.7,69.3).lineTo(-236.7,69.5);
	this.shape_60.setTransform(351.375,132.4);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.beginFill("#000000").beginStroke().moveTo(276.8,91.8).lineTo(276.3,89.5).curveTo(276.3,88.8,276.5,88.1).lineTo(276.5,88.1).lineTo(276.3,87.5).curveTo(276.3,85.1,277.8,83.8).curveTo(279.2,82.5,281.3,82.5).curveTo(283.3,82.5,284.7,83.8).curveTo(286.2,85.1,286.3,87.4).lineTo(286.3,87.7).lineTo(286.2,88.5).lineTo(286.3,89.3).lineTo(286.3,89.4).lineTo(286.3,89.5).curveTo(286.3,91.1,285.3,92.6).curveTo(283.9,94.5,281.3,94.6).curveTo(278,94.5,276.8,91.8).closePath().moveTo(-236.1,57).lineTo(-236.7,54.8).curveTo(-236.7,54,-236.5,53.3).lineTo(-236.5,53.3).lineTo(-236.7,52.7).curveTo(-236.7,50.3,-235.1,48.9).curveTo(-233.7,47.7,-231.7,47.7).curveTo(-229.6,47.7,-228.2,48.9).curveTo(-226.7,50.3,-226.7,52.6).lineTo(-226.7,53).lineTo(-226.8,53.6).lineTo(-226.7,54.4).lineTo(-226.7,54.6).lineTo(-226.7,54.8).curveTo(-226.7,56.3,-227.7,57.8).curveTo(-229.1,59.7,-231.7,59.7).curveTo(-234.9,59.8,-236.1,57).closePath().moveTo(247.3,47.4).lineTo(246.8,45.2).curveTo(246.8,42.8,248.3,41.4).curveTo(249.7,40.1,251.8,40.1).curveTo(253.8,40.1,255.2,41.4).curveTo(256.7,42.7,256.8,45.1).lineTo(256.8,45.2).curveTo(256.8,46.8,255.8,48.2).curveTo(254.4,50.2,251.8,50.2).curveTo(248.5,50.2,247.3,47.4).closePath().moveTo(-118.4,38.2).lineTo(-118.9,36).curveTo(-118.9,35.2,-118.7,34.5).lineTo(-118.7,34.5).lineTo(-118.9,34).curveTo(-118.9,31.6,-117.4,30.2).curveTo(-116,29,-113.9,29).curveTo(-111.9,29,-110.5,30.2).curveTo(-109,31.6,-108.9,33.8).lineTo(-108.9,34.1).lineTo(-109,34.9).lineTo(-109,34.9).lineTo(-108.9,35.9).lineTo(-108.9,36).curveTo(-108.9,37.5,-109.9,39).curveTo(-111.3,41,-113.9,41).curveTo(-117.2,41,-118.4,38.2).closePath().moveTo(-265.6,12.7).lineTo(-266.2,10.4).curveTo(-266.2,8,-264.6,6.6).curveTo(-263.2,5.4,-261.2,5.4).curveTo(-259.1,5.4,-257.7,6.6).curveTo(-256.2,7.9,-256.2,10.2).lineTo(-256.2,10.4).curveTo(-256.2,11.9,-257.2,13.4).curveTo(-258.6,15.4,-261.2,15.4).curveTo(-264.4,15.4,-265.6,12.7).closePath().moveTo(-194.1,1.4).lineTo(-194.7,-0.8).curveTo(-194.7,-1.6,-194.5,-2.3).lineTo(-194.5,-2.3).lineTo(-194.7,-2.8).curveTo(-194.7,-5.2,-193.1,-6.6).curveTo(-191.7,-7.8,-189.7,-7.8).curveTo(-187.6,-7.8,-186.2,-6.6).curveTo(-184.7,-5.2,-184.7,-3).lineTo(-184.7,-2.5).lineTo(-184.8,-1.9).lineTo(-184.7,-1.2).lineTo(-184.7,-0.9).lineTo(-184.7,-0.8).curveTo(-184.7,0.7,-185.7,2.2).curveTo(-187.1,4.2,-189.7,4.2).curveTo(-192.9,4.2,-194.1,1.4).closePath().moveTo(-147.9,-6.1).lineTo(-148.4,-8.4).curveTo(-148.4,-10.7,-146.9,-12.2).curveTo(-145.5,-13.4,-143.4,-13.4).curveTo(-141.4,-13.4,-140,-12.2).curveTo(-138.5,-10.8,-138.4,-8.5).lineTo(-138.4,-8.4).curveTo(-138.4,-6.8,-139.4,-5.3).curveTo(-140.8,-3.4,-143.4,-3.3).curveTo(-146.7,-3.4,-147.9,-6.1).closePath().moveTo(266.8,-16.1).lineTo(266.3,-18.4).curveTo(266.3,-19.2,266.5,-19.8).lineTo(266.5,-19.9).lineTo(266.3,-20.4).curveTo(266.3,-22.8,267.8,-24.2).curveTo(269.2,-25.5,271.3,-25.5).curveTo(273.3,-25.5,274.7,-24.2).curveTo(276.2,-22.9,276.3,-20.5).lineTo(276.3,-20.2).lineTo(276.2,-19.5).lineTo(276.3,-18.7).lineTo(276.3,-18.6).lineTo(276.3,-18.4).curveTo(276.3,-16.9,275.3,-15.4).curveTo(273.9,-13.4,271.3,-13.4).curveTo(268,-13.4,266.8,-16.1).closePath().moveTo(-256.2,-35.4).lineTo(-256.8,-37.6).curveTo(-256.8,-38.4,-256.6,-39.1).lineTo(-256.6,-39.1).lineTo(-256.8,-39.6).curveTo(-256.8,-42,-255.2,-43.4).curveTo(-253.8,-44.7,-251.8,-44.7).curveTo(-249.7,-44.7,-248.3,-43.4).curveTo(-246.8,-42.1,-246.8,-39.7).lineTo(-246.8,-39.4).lineTo(-246.9,-38.7).lineTo(-246.8,-37.9).lineTo(-246.8,-37.7).lineTo(-246.8,-37.6).curveTo(-246.8,-36,-247.8,-34.6).curveTo(-249.2,-32.6,-251.8,-32.6).curveTo(-255,-32.6,-256.2,-35.4).closePath().moveTo(-164.6,-42.9).lineTo(-165.2,-45.1).curveTo(-165.2,-45.9,-165,-46.6).lineTo(-165,-46.6).lineTo(-165.2,-47.2).curveTo(-165.2,-49.6,-163.6,-51).curveTo(-162.2,-52.2,-160.2,-52.2).curveTo(-158.1,-52.2,-156.7,-51).curveTo(-155.2,-49.6,-155.2,-47.3).lineTo(-155.2,-46.9).lineTo(-155.3,-46.3).lineTo(-155.2,-45.4).lineTo(-155.2,-45.3).lineTo(-155.2,-45.1).curveTo(-155.2,-43.6,-156.2,-42.1).curveTo(-157.6,-40.2,-160.2,-40.2).curveTo(-163.4,-40.1,-164.6,-42.9).closePath().moveTo(-223.6,-42.9).lineTo(-224.2,-45.1).lineTo(-224.1,-45.9).curveTo(-223.9,-47.8,-222.6,-49).curveTo(-221.2,-50.2,-219.2,-50.2).lineTo(-218.3,-50.2).curveTo(-216.8,-49.9,-215.7,-49).curveTo(-214.2,-47.6,-214.2,-45.3).lineTo(-214.2,-45.1).curveTo(-214.2,-43.6,-215.2,-42.1).curveTo(-216.6,-40.2,-219.2,-40.2).curveTo(-222.4,-40.1,-223.6,-42.9).closePath().moveTo(237.3,-60.5).lineTo(236.8,-62.8).curveTo(236.8,-65.2,238.3,-66.5).curveTo(239.7,-67.8,241.8,-67.8).curveTo(243.8,-67.8,245.2,-66.5).curveTo(246.7,-65.2,246.8,-62.9).lineTo(246.8,-62.8).curveTo(246.8,-61.2,245.8,-59.8).curveTo(244.4,-57.7,241.8,-57.7).curveTo(238.5,-57.7,237.3,-60.5).closePath().moveTo(-285.7,-79.7).lineTo(-286.3,-81.9).curveTo(-286.3,-84.4,-284.7,-85.8).curveTo(-283.3,-87,-281.3,-87).curveTo(-279.2,-87,-277.8,-85.8).curveTo(-276.3,-84.4,-276.3,-82.1).lineTo(-276.3,-81.9).curveTo(-276.3,-80.4,-277.3,-78.9).curveTo(-278.7,-77,-281.3,-77).curveTo(-284.5,-76.9,-285.7,-79.7).closePath().moveTo(-194.1,-87.2).lineTo(-194.7,-89.5).curveTo(-194.7,-91.9,-193.1,-93.3).curveTo(-191.7,-94.5,-189.7,-94.5).curveTo(-187.6,-94.5,-186.2,-93.3).curveTo(-184.7,-92,-184.7,-89.7).lineTo(-184.7,-89.5).curveTo(-184.7,-87.9,-185.7,-86.5).curveTo(-187.1,-84.5,-189.7,-84.5).curveTo(-192.9,-84.5,-194.1,-87.2).closePath();
	this.shape_61.setTransform(341.325,147.35);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.beginFill().beginStroke("#000000").setStrokeStyle(3,1,1).moveTo(58.5,2.5).lineTo(42.5,-18.5).moveTo(45.5,18.5).lineTo(58.5,2.5).moveTo(-58.5,2.5).lineTo(58.5,2.5);
	this.shape_62.setTransform(-101.5,432.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_22},{t:this.shape_21}]},569).to({state:[{t:this.shape_25},{t:this.shape_24},{t:this.shape_23}]},1).to({state:[{t:this.shape_28},{t:this.shape_27},{t:this.shape_26}]},1).to({state:[{t:this.shape_31},{t:this.shape_30},{t:this.shape_29}]},1).to({state:[{t:this.shape_34},{t:this.shape_33},{t:this.shape_32}]},1).to({state:[{t:this.shape_37},{t:this.shape_36},{t:this.shape_35}]},1).to({state:[{t:this.shape_39},{t:this.shape_38}]},1).to({state:[{t:this.shape_41},{t:this.shape_40}]},1).to({state:[{t:this.shape_43},{t:this.shape_42}]},1).to({state:[{t:this.shape_45},{t:this.shape_44}]},1).to({state:[{t:this.shape_47},{t:this.shape_46}]},1).to({state:[{t:this.shape_49},{t:this.shape_48}]},1).to({state:[{t:this.shape_51},{t:this.shape_50}]},4).to({state:[{t:this.shape_53},{t:this.shape_52}]},3).to({state:[{t:this.shape_55},{t:this.shape_54}]},2).to({state:[{t:this.shape_57},{t:this.shape_56}]},2).to({state:[{t:this.shape_59},{t:this.shape_58}]},2).to({state:[{t:this.shape_61},{t:this.shape_60}]},1).to({state:[]},197).to({state:[{t:this.shape_62}]},1659).to({state:[]},24).to({state:[]},89).wait(551));

	// arrow
	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(4.5,0).lineTo(-4.5,0);
	this.shape_63.setTransform(308.5,422);

	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-7.8,0.7).lineTo(-7.4,0.1).lineTo(-5.9,-0.7).lineTo(7.8,0.1);
	this.shape_64.setTransform(305.25,421.9);

	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-10.9,1.4).lineTo(-11.1,0.2).lineTo(-9,-1.4).lineTo(11.1,0.2);
	this.shape_65.setTransform(301.95,421.775);

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-13.9,2.1).lineTo(-14.5,0.2).lineTo(-11.9,-2.1).lineTo(14.5,0.2);
	this.shape_66.setTransform(298.475,421.675);

	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-16.9,2.8).lineTo(-18,0.3).lineTo(-14.9,-2.8).lineTo(18,0.3);
	this.shape_67.setTransform(295.025,421.575);

	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-19.9,3.6).lineTo(-21.4,0.4).lineTo(-17.9,-3.6).lineTo(21.4,0.4);
	this.shape_68.setTransform(291.55,421.475);

	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-22.9,4.3).lineTo(-24.9,0.5).lineTo(-20.8,-4.3).lineTo(24.9,0.5);
	this.shape_69.setTransform(288.075,421.375);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-25.9,5).lineTo(-28.4,0.5).lineTo(-23.7,-5).lineTo(28.4,0.5);
	this.shape_70.setTransform(284.6,421.275);

	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-28.9,5.7).lineTo(-31.9,0.7).lineTo(-26.7,-5.7).lineTo(31.9,0.7);
	this.shape_71.setTransform(281.125,421.15);

	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-31.9,6.4).lineTo(-35.3,0.7).lineTo(-29.6,-6.4).lineTo(35.4,0.7);
	this.shape_72.setTransform(277.65,421.05);

	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-34.9,7.1).lineTo(-38.8,0.8).lineTo(-32.5,-7.1).lineTo(38.8,0.8);
	this.shape_73.setTransform(274.2,420.95);

	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-37.9,7.8).lineTo(-42.3,0.8).lineTo(-35.5,-7.8).lineTo(42.3,0.8);
	this.shape_74.setTransform(270.725,420.85);

	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-40.9,8.5).lineTo(-45.8,1).lineTo(-38.4,-8.5).lineTo(45.8,1);
	this.shape_75.setTransform(267.25,420.725);

	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-43.9,9.2).lineTo(-49.2,1).lineTo(-41.4,-9.2).lineTo(49.2,1);
	this.shape_76.setTransform(263.775,420.625);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-46.9,9.9).lineTo(-52.7,1.1).lineTo(-44.3,-9.9).lineTo(52.7,1.1);
	this.shape_77.setTransform(260.3,420.525);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-49.9,10.7).lineTo(-56.2,1.2).lineTo(-47.3,-10.7).lineTo(56.2,1.2);
	this.shape_78.setTransform(256.825,420.425);

	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-53,11.4).lineTo(-59.6,1.3).lineTo(-50.2,-11.4).lineTo(59.6,1.3);
	this.shape_79.setTransform(253.375,420.325);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-55.9,12.1).lineTo(-63.1,1.3).lineTo(-53.1,-12.1).lineTo(63.1,1.3);
	this.shape_80.setTransform(249.9,420.225);

	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-58.9,12.8).lineTo(-66.6,1.4).lineTo(-56.1,-12.8).lineTo(66.6,1.4);
	this.shape_81.setTransform(246.425,420.1);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-61.9,13.5).lineTo(-70,1.5).lineTo(-59,-13.5).lineTo(70.1,1.5);
	this.shape_82.setTransform(242.95,420);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-65,14.2).lineTo(-73.5,1.6).lineTo(-62,-14.2).lineTo(73.5,1.6);
	this.shape_83.setTransform(239.475,419.9);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-67.9,14.9).lineTo(-77,1.7).lineTo(-64.9,-14.9).lineTo(77,1.7);
	this.shape_84.setTransform(236,419.775);

	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-70.9,15.6).lineTo(-80.5,1.7).lineTo(-67.9,-15.6).lineTo(80.5,1.7);
	this.shape_85.setTransform(232.525,419.675);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-74,16.3).lineTo(-83.9,1.8).lineTo(-70.8,-16.3).lineTo(83.9,1.8);
	this.shape_86.setTransform(229.075,419.575);

	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-76.9,17.1).lineTo(-87.4,1.9).lineTo(-73.8,-17.1).lineTo(87.4,1.9);
	this.shape_87.setTransform(225.6,419.475);

	this.shape_88 = new cjs.Shape();
	this.shape_88.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-80,17.8).lineTo(-90.9,2).lineTo(-76.7,-17.8).lineTo(90.9,2);
	this.shape_88.setTransform(222.125,419.375);

	this.shape_89 = new cjs.Shape();
	this.shape_89.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-82.9,18.5).lineTo(-94.3,2).lineTo(-79.6,-18.5).lineTo(94.4,2);
	this.shape_89.setTransform(218.65,419.275);

	this.shape_90 = new cjs.Shape();
	this.shape_90.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-86,19.2).lineTo(-97.8,2.2).lineTo(-82.6,-19.2).lineTo(97.8,2.2);
	this.shape_90.setTransform(215.175,419.15);

	this.shape_91 = new cjs.Shape();
	this.shape_91.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-88.9,19.9).lineTo(-101.3,2.2).lineTo(-85.5,-19.9).lineTo(101.3,2.2);
	this.shape_91.setTransform(211.7,419.05);

	this.shape_92 = new cjs.Shape();
	this.shape_92.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-92,20.6).lineTo(-104.8,2.3).lineTo(-88.5,-20.6).lineTo(104.8,2.3);
	this.shape_92.setTransform(208.25,418.95);

	this.shape_93 = new cjs.Shape();
	this.shape_93.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-95,21.3).lineTo(-108.2,2.3).lineTo(-91.4,-21.3).lineTo(108.2,2.3);
	this.shape_93.setTransform(204.775,418.85);

	this.shape_94 = new cjs.Shape();
	this.shape_94.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-98,22).lineTo(-111.7,2.5).lineTo(-94.4,-22).lineTo(111.7,2.5);
	this.shape_94.setTransform(201.3,418.725);

	this.shape_95 = new cjs.Shape();
	this.shape_95.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-101,22.7).lineTo(-115.2,2.5).lineTo(-97.3,-22.7).lineTo(115.2,2.5);
	this.shape_95.setTransform(197.825,418.625);

	this.shape_96 = new cjs.Shape();
	this.shape_96.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-104,23.4).lineTo(-118.6,2.6).lineTo(-100.3,-23.4).lineTo(118.7,2.6);
	this.shape_96.setTransform(194.35,418.525);

	this.shape_97 = new cjs.Shape();
	this.shape_97.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-107,24.2).lineTo(-122.1,2.7).lineTo(-103.2,-24.2).lineTo(122.1,2.7);
	this.shape_97.setTransform(190.875,418.425);

	this.shape_98 = new cjs.Shape();
	this.shape_98.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-110,24.9).lineTo(-125.6,2.8).lineTo(-106.2,-24.9).lineTo(125.6,2.8);
	this.shape_98.setTransform(187.425,418.325);

	this.shape_99 = new cjs.Shape();
	this.shape_99.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-113,25.6).lineTo(-129,2.8).lineTo(-109.1,-25.6).lineTo(129.1,2.8);
	this.shape_99.setTransform(183.95,418.225);

	this.shape_100 = new cjs.Shape();
	this.shape_100.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-116,26.3).lineTo(-132.5,2.9).lineTo(-112.1,-26.3).lineTo(132.5,2.9);
	this.shape_100.setTransform(180.475,418.1);

	this.shape_101 = new cjs.Shape();
	this.shape_101.graphics.beginFill().beginStroke("#000000").setStrokeStyle(11.8,1,1).moveTo(-136,3).lineTo(-119,27).moveTo(136,3).lineTo(-136,3).lineTo(-115,-27);
	this.shape_101.setTransform(177,418);

	this.instance_69 = new lib.Tween222("synched",0);
	this.instance_69.setTransform(177,418);
	this.instance_69._off = true;

	this.instance_70 = new lib.Tween223("synched",0);
	this.instance_70.setTransform(-150,418);

	this.shape_102 = new cjs.Shape();
	this.shape_102.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(24.5,0).lineTo(13.5,13).moveTo(12.5,-13).lineTo(24.5,0).moveTo(-24.5,0).lineTo(24.5,0);
	this.shape_102.setTransform(259.45,41);

	this.shape_103 = new cjs.Shape();
	this.shape_103.graphics.beginFill().beginStroke("#000000").setStrokeStyle(6.5,1,1).moveTo(100.5,-110.5).lineTo(89.5,-97.5).moveTo(88.5,-123.5).lineTo(100.5,-110.5).moveTo(51.5,-110.5).lineTo(100.5,-110.5).moveTo(-86.5,123.5).lineTo(-100.5,109.5).moveTo(-73.5,111.5).lineTo(-86.5,123.5).moveTo(-86.5,-46.5).lineTo(-86.5,123.5);
	this.shape_103.setTransform(183.475,151.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_63}]},724).to({state:[{t:this.shape_64}]},1).to({state:[{t:this.shape_65}]},1).to({state:[{t:this.shape_66}]},1).to({state:[{t:this.shape_67}]},1).to({state:[{t:this.shape_68}]},1).to({state:[{t:this.shape_69}]},1).to({state:[{t:this.shape_70}]},1).to({state:[{t:this.shape_71}]},1).to({state:[{t:this.shape_72}]},1).to({state:[{t:this.shape_73}]},1).to({state:[{t:this.shape_74}]},1).to({state:[{t:this.shape_75}]},1).to({state:[{t:this.shape_76}]},1).to({state:[{t:this.shape_77}]},1).to({state:[{t:this.shape_78}]},1).to({state:[{t:this.shape_79}]},1).to({state:[{t:this.shape_80}]},1).to({state:[{t:this.shape_81}]},1).to({state:[{t:this.shape_82}]},1).to({state:[{t:this.shape_83}]},1).to({state:[{t:this.shape_84}]},1).to({state:[{t:this.shape_85}]},1).to({state:[{t:this.shape_86}]},1).to({state:[{t:this.shape_87}]},1).to({state:[{t:this.shape_88}]},1).to({state:[{t:this.shape_89}]},1).to({state:[{t:this.shape_90}]},1).to({state:[{t:this.shape_91}]},1).to({state:[{t:this.shape_92}]},1).to({state:[{t:this.shape_93}]},1).to({state:[{t:this.shape_94}]},1).to({state:[{t:this.shape_95}]},1).to({state:[{t:this.shape_96}]},1).to({state:[{t:this.shape_97}]},1).to({state:[{t:this.shape_98}]},1).to({state:[{t:this.shape_99}]},1).to({state:[{t:this.shape_100}]},1).to({state:[{t:this.shape_101}]},1).to({state:[{t:this.instance_69}]},48).to({state:[{t:this.instance_70}]},23).to({state:[]},1).to({state:[{t:this.shape_102}]},476).to({state:[{t:this.shape_103}]},114).to({state:[]},189).to({state:[]},948).wait(553));
	this.timeline.addTween(cjs.Tween.get(this.instance_69).wait(810).to({_off:false},0).to({_off:true,x:-150},23).wait(2281));

	// wrong
	this.text_7 = new cjs.Text("Wrong Answer!", "italic bold 26px 'Verdana'", "#FF0000");
	this.text_7.textAlign = "center";
	this.text_7.lineHeight = 34;
	this.text_7.lineWidth = 230;
	this.text_7.parent = this;
	this.text_7.setTransform(574.95,408.95);

	this.instance_71 = new lib.CachedBmp_78();
	this.instance_71.setTransform(480.95,292,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_71},{t:this.text_7}]},878).to({state:[]},12).to({state:[]},1673).wait(551));

	// button_wrong1
	this.button1_wrong = new lib.button_nar1();
	this.button1_wrong.name = "button1_wrong";
	this.button1_wrong.setTransform(559.95,342.5);
	this.button1_wrong._off = true;
	new cjs.ButtonHelper(this.button1_wrong, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button1_wrong).wait(877).to({_off:false},0).wait(1).to({_off:true},12).wait(2224));

	// button1
	this.button1 = new lib.button_nar1();
	this.button1.name = "button1";
	this.button1.setTransform(220.5,347.5);
	this.button1._off = true;
	new cjs.ButtonHelper(this.button1, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button1).wait(876).to({_off:false},0).to({_off:true},14).wait(2224));

	// palace
	this.instance_72 = new lib.peterhofMC();
	this.instance_72.setTransform(68.3,281.7,1.7073,1.7062,0,0,0,0.1,-2.6);
	this.instance_72.alpha = 0;
	this.instance_72._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_72).wait(2087).to({_off:false},0).to({x:389.3,y:293.4,alpha:0.8008},160).wait(210).to({x:185.2,alpha:0},78).to({_off:true},9).wait(570));

	// elizaveta
	this.instance_73 = new lib.elizavetaMC();
	this.instance_73.setTransform(397.35,234,1,1,0,0,0,-1,1);
	this.instance_73.alpha = 0;
	this.instance_73._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_73).wait(1038).to({_off:false},0).to({x:390.85,alpha:1},121).wait(474).to({x:238.75},13).wait(60).to({x:239.95},0).to({regX:-1.2,regY:0.8,scaleX:0.6154,scaleY:0.6153,x:245.25,y:233.45,alpha:0},29).to({_off:true},1).wait(1378));

	// heart2
	this.instance_74 = new lib.heartMC();
	this.instance_74.setTransform(353.2,248.15,0.0798,0.0797,0,0,0,0,3.1);
	this.instance_74._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_74).wait(938).to({_off:false},0).to({scaleX:0.7983,scaleY:0.7974,x:400,y:250.3},100).wait(4).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(10).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(10).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(10).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(9).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(12).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(12).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(10).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(10).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(10).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(9).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(12).to({regX:0,regY:3.1,scaleY:0.7974,x:400,y:250.3},0).to({regX:0.1,regY:1.3,scaleX:0.938,scaleY:0.9369,x:400.1,y:248.6},4).to({scaleX:0.7983,scaleY:0.7972,y:248.45},3).to({scaleX:0.938,scaleY:0.9368,y:248.6},2).to({scaleX:0.7983,scaleY:0.7971,y:248.45},2).wait(345).to({x:248},13).wait(60).to({x:248.05},0).to({x:252.3,alpha:0.3398},19).to({x:254.55,alpha:0},10).to({_off:true},118).wait(1261));

	// petersburg1
	this.instance_75 = new lib.petersburg1MC();
	this.instance_75.setTransform(90,262,1,1,0,0,0,1,0);
	this.instance_75.alpha = 0;
	this.instance_75._off = true;

	this.instance_76 = new lib.petersburg4MC();
	this.instance_76.setTransform(590.95,342,1,1,0,0,0,0,2);
	this.instance_76.alpha = 0;
	this.instance_76._off = true;

	this.instance_77 = new lib.petersburg3MC();
	this.instance_77.setTransform(629.95,158,1,1,0,0,0,0,-1);
	this.instance_77.alpha = 0;
	this.instance_77._off = true;

	this.instance_78 = new lib.Tween17("synched",0);
	this.instance_78.setTransform(562.9,279.25);
	this.instance_78.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_75}]},2638).to({state:[{t:this.instance_75}]},65).to({state:[{t:this.instance_75}]},55).to({state:[]},1).to({state:[{t:this.instance_76}]},1).to({state:[{t:this.instance_76}]},57).to({state:[{t:this.instance_77}]},1).to({state:[{t:this.instance_78}]},94).to({state:[]},1).wait(201));
	this.timeline.addTween(cjs.Tween.get(this.instance_75).wait(2638).to({_off:false},0).to({x:303,alpha:1},65).to({x:323,y:269,alpha:0},55).to({_off:true},1).wait(355));
	this.timeline.addTween(cjs.Tween.get(this.instance_76).wait(2760).to({_off:false},0).to({x:-126,y:153},57).to({_off:true},1).wait(296));
	this.timeline.addTween(cjs.Tween.get(this.instance_77).wait(2818).to({_off:false},0).to({_off:true,regY:0,x:562.9,y:279.25,mode:"synched",startPosition:0},94).wait(202));

	// petersburg2
	this.instance_79 = new lib.petersburg2MC();
	this.instance_79.setTransform(574.95,269);
	this.instance_79.alpha = 0;
	this.instance_79._off = true;

	this.instance_80 = new lib.petersburg4MC();
	this.instance_80.setTransform(-10,280,1,1,0,0,0,0,2);
	this.instance_80.alpha = 0;
	this.instance_80._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_79).wait(2703).to({_off:false},0).to({x:290,y:298,alpha:1},55).to({x:30.05,y:396,alpha:0},57).to({_off:true},3).wait(296));
	this.timeline.addTween(cjs.Tween.get(this.instance_80).wait(2818).to({_off:false},0).to({x:247,y:231,alpha:1},93).to({_off:true},1).wait(202));

	// peters_title
	this.instance_81 = new lib.Tween18("synched",0);
	this.instance_81.setTransform(740.85,28);
	this.instance_81._off = true;

	this.instance_82 = new lib.Tween19("synched",0);
	this.instance_82.setTransform(266.95,-6);
	this.instance_82._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_81).wait(2810).to({_off:false},0).to({_off:true,x:266.95,y:-6},46).wait(258));
	this.timeline.addTween(cjs.Tween.get(this.instance_82).wait(2810).to({_off:false},46).to({x:375,y:35},54).to({_off:true},4).wait(200));

	// background
	this.instance_83 = new lib.paperbg2_600x800();
	this.instance_83.setTransform(2,0);

	this.timeline.addTween(cjs.Tween.get(this.instance_83).to({_off:true},2914).wait(200));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-1.4,220.3,1168.1000000000001,400.90000000000003);
// library properties:
lib.properties = {
	id: 'C18FCA4C807F524483B9017B0717EF7C',
	width: 800,
	height: 600,
	fps: 24,
	color: "#FFFF99",
	opacity: 1.00,
	manifest: [
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_1.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_1"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_2.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_2"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5_Canvas_atlas_3"},
		{src:"sounds/_161316__husky70__echochimechime.mp3", id:"_161316__husky70__echochimechime"},
		{src:"sounds/hmyrya0404.mp3", id:"hmyrya0404"},
		{src:"sounds/instrumental_ukrainian.mp3", id:"instrumental_ukrainian"},
		{src:"sounds/nar1_pt1.mp3", id:"nar1_pt1"},
		{src:"sounds/nar1_pt2.mp3", id:"nar1_pt2"},
		{src:"sounds/nar1_wrongbranch.mp3", id:"nar1_wrongbranch"}
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
an.compositions['C18FCA4C807F524483B9017B0717EF7C'] = {
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