(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_1", frames: [[0,0,906,938],[0,940,906,938],[908,0,906,938],[908,940,697,1000]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2", frames: [[0,0,725,795],[0,797,600,799],[1529,667,500,375],[1404,1526,476,298],[0,1598,566,364],[727,667,800,600],[1561,0,356,480],[1529,1044,356,480],[727,0,832,665],[602,1269,800,515]]},
		{name:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3", frames: [[600,866,195,66],[515,591,144,122],[379,812,512,52],[0,605,243,234],[0,841,229,115],[938,374,64,113],[499,744,442,66],[379,866,219,66],[797,866,195,66],[659,381,50,66],[372,283,70,94],[667,934,80,78],[938,489,70,90],[286,381,227,271],[286,283,84,81],[938,581,70,90],[0,283,284,320],[245,654,252,139],[749,934,70,86],[943,673,70,90],[0,0,450,281],[943,765,70,90],[721,0,268,372],[452,0,267,379],[379,934,70,90],[451,934,70,90],[245,795,132,221],[659,449,41,47],[721,374,215,368],[523,934,70,90],[515,381,142,208],[595,934,70,90]]}
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



(lib.CachedBmp_73 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_72 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_71 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_69 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_66 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_70 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.AleksejRazumovskij_small1748 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.astronomy_2k2_1 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.back_wheel = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.BirutaAkerbergs_small1947 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.child_Vera_arcimovics = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.front_wheel = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.Hansen_small1983 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.hiroshima_nagasaki_map = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.honda_cutout = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.JapaneseDictionary = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.KirilRazumovskij_small1728 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.MichailZemcuznikov_small1788 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.nagasaki = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.NataljaRozum_small1678 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.Nicolas_II_photographie_couleur = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.Nik_Azb_large_smaller = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.nik_vera_cutout = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.NikAzb_andFriends = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.nikAzb_parents = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.NikolajAzbelev_small1857 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.OlgaSott_small1921 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.paperbg2_600x800 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.rider_cutout = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.throne_heir = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.throne_heir_cutout = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.throne_heirsCastle = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.tree_branch = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.tree_clear_small = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.VeraAzbeleva_small1883 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.viktor2 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.ViktorArcimovic_small1820 = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.vladivostok = function() {
	this.initialize(ss["AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"]);
	this.gotoAndStop(9);
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


(lib.Tween221 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Azbelev", "italic bold 24px 'Verdana'");
	this.text.lineHeight = 31;
	this.text.parent = this;
	this.text.setTransform(0.85,-14.5);

	this.text_1 = new cjs.Text("Nikolai", "italic bold 24px 'Verdana'");
	this.text_1.lineHeight = 31;
	this.text_1.parent = this;
	this.text_1.setTransform(-106.4,-14.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text_1},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-108.4,-16.5,216.9,33.2);


(lib.Tween220 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("Azbelev", "italic bold 24px 'Verdana'");
	this.text.lineHeight = 31;
	this.text.parent = this;
	this.text.setTransform(0.85,-14.5);

	this.instance = new lib.CachedBmp_73();
	this.instance.setTransform(-108.4,-16.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-108.4,-16.5,216.9,33.2);


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
	this.instance = new lib.CachedBmp_72();
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
	this.instance = new lib.CachedBmp_71();
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

	this.instance = new lib.CachedBmp_70();
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
	this.instance = new lib.CachedBmp_69();
	this.instance.setTransform(172.45,145.1,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_70();
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


(lib.Tween206 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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


(lib.Tween203 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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


(lib.Tween202 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
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


(lib.Tween200 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_67();
	this.instance.setTransform(-127.9,-13,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-127.9,-13,256,26);


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


(lib.vladiMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.vladivostok();
	this.instance.setTransform(-400,-257.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.vladiMC, new cjs.Rectangle(-400,-257.5,800,515), null);


(lib.NikVera_cutoutMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.nik_vera_cutout();
	this.instance.setTransform(-133.5,-189.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.NikVera_cutoutMC, new cjs.Rectangle(-133.5,-189.5,267,379), null);


(lib.NikParentsMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.nikAzb_parents();
	this.instance.setTransform(-283,-182);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.NikParentsMC, new cjs.Rectangle(-283,-182,566,364), null);


(lib.NagMapMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.hiroshima_nagasaki_map();
	this.instance.setTransform(-142,-160);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.NagMapMC, new cjs.Rectangle(-142,-160,284,320), null);


(lib.nagasakiMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.nagasaki();
	this.instance.setTransform(-225,-140.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.nagasakiMC, new cjs.Rectangle(-225,-140.5,450,281), null);


(lib.riderCutoutMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.rider_cutout();
	this.instance.setTransform(-66,-110.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.riderCutoutMC, new cjs.Rectangle(-66,-110.5,132,221), null);


(lib.hondaMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.honda_cutout();
	this.instance.setTransform(-126,-69.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hondaMC, new cjs.Rectangle(-126,-69.5,252,139), null);


(lib.front_wheelMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.front_wheel();
	this.instance.setTransform(-42,-40.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(30));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-42,-40.5,84,81);


(lib.back_wheelMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.back_wheel();
	this.instance.setTransform(-40,-39);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.back_wheelMC, new cjs.Rectangle(-40,-39,80,78), null);


(lib.heirMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.throne_heir();
	this.instance.setTransform(-178,-240);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.heirMC, new cjs.Rectangle(-178,-240,356,480), null);


(lib.heir_cutoutMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.throne_heir_cutout();
	this.instance.setTransform(-178,-240);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.heir_cutoutMC, new cjs.Rectangle(-178,-240,356,480), null);


(lib.friendsMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.NikAzb_andFriends();
	this.instance.setTransform(-238,-149);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.friendsMC, new cjs.Rectangle(-238,-149,476,298), null);


(lib.czarMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Nicolas_II_photographie_couleur();
	this.instance.setTransform(-134,-186);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.czarMC, new cjs.Rectangle(-134,-186,268,372), null);


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
	this.instance = new lib.throne_heirsCastle();
	this.instance.setTransform(-416,-332.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.castleMC, new cjs.Rectangle(-416,-332.5,832,665), null);


(lib.booksMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.JapaneseDictionary();
	this.instance.setTransform(-250,-187.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.booksMC, new cjs.Rectangle(-250,-187.5,500,375), null);


(lib.astronomyMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.astronomy_2k2_1();
	this.instance.setTransform(-300,-399.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.astronomyMC, new cjs.Rectangle(-300,-399.5,600,799), null);


(lib.VeraMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.child_Vera_arcimovics();
	this.instance.setTransform(-113.5,-135.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.VeraMC, new cjs.Rectangle(-113.5,-135.5,227,271), null);


(lib.viktor_olderMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.viktor2();
	this.instance.setTransform(-71,-104);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.viktor_olderMC, new cjs.Rectangle(-71,-104,142,208), null);


(lib.Nikolaj_largeMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Nik_Azb_large_smaller();
	this.instance.setTransform(-348.5,-500);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Nikolaj_largeMC, new cjs.Rectangle(-348.5,-500,697,1000), null);


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


(lib.frontrotateMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.front_wheelMC();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({rotation:49.6552},0).wait(1).to({rotation:99.3103},0).wait(1).to({rotation:148.9655},0).wait(1).to({rotation:198.6207},0).wait(1).to({rotation:248.2759},0).wait(1).to({rotation:297.931},0).wait(1).to({rotation:347.5862},0).wait(1).to({rotation:397.2414},0).wait(1).to({rotation:446.8966},0).wait(1).to({rotation:496.5517},0).wait(1).to({rotation:546.2069},0).wait(1).to({rotation:595.8621},0).wait(1).to({rotation:645.5172},0).wait(1).to({rotation:695.1724},0).wait(1).to({rotation:744.8276},0).wait(1).to({rotation:794.4828},0).wait(1).to({rotation:844.1379},0).wait(1).to({rotation:893.7931},0).wait(1).to({rotation:943.4483},0).wait(1).to({rotation:993.1034},0).wait(1).to({rotation:1042.7586},0).wait(1).to({rotation:1092.4138},0).wait(1).to({rotation:1142.069},0).wait(1).to({rotation:1191.7241},0).wait(1).to({rotation:1241.3793},0).wait(1).to({rotation:1291.0345},0).wait(1).to({rotation:1340.6897},0).wait(1).to({rotation:1390.3448},0).wait(1).to({rotation:1440},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-58.4,-58.3,116.69999999999999,116.6);


(lib.backrotate = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.back_wheelMC();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({rotation:49.6552},0).wait(1).to({rotation:99.3103},0).wait(1).to({rotation:148.9655},0).wait(1).to({rotation:198.6207},0).wait(1).to({rotation:248.2759},0).wait(1).to({rotation:297.931},0).wait(1).to({rotation:347.5862},0).wait(1).to({rotation:397.2414},0).wait(1).to({rotation:446.8966},0).wait(1).to({rotation:496.5517},0).wait(1).to({rotation:546.2069},0).wait(1).to({rotation:595.8621},0).wait(1).to({rotation:645.5172},0).wait(1).to({rotation:695.1724},0).wait(1).to({rotation:744.8276},0).wait(1).to({rotation:794.4828},0).wait(1).to({rotation:844.1379},0).wait(1).to({rotation:893.7931},0).wait(1).to({rotation:943.4483},0).wait(1).to({rotation:993.1034},0).wait(1).to({rotation:1042.7586},0).wait(1).to({rotation:1092.4138},0).wait(1).to({rotation:1142.069},0).wait(1).to({rotation:1191.7241},0).wait(1).to({rotation:1241.3793},0).wait(1).to({rotation:1291.0345},0).wait(1).to({rotation:1340.6897},0).wait(1).to({rotation:1390.3448},0).wait(1).to({rotation:1440},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-55.9,-55.8,111.8,111.6);


(lib.motorcyclemovingMC = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.riderCutoutMC();
	this.instance.setTransform(-17,-52);

	this.instance_1 = new lib.frontrotateMC();
	this.instance_1.setTransform(84,28);

	this.instance_2 = new lib.backrotate();
	this.instance_2.setTransform(-86,31);

	this.instance_3 = new lib.hondaMC();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.motorcyclemovingMC, new cjs.Rectangle(-126,-162.5,252,232.5), null);


// stage content:
(lib.AncestorSplit_31May2014_copyHTML5_HTML5Canvas_Scene6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {nar6:0,wrong_nar6:1381,continue_nar6:1385,wrongbranch_nar6:1844};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,100,1380,1381,1385,1839,1844,1954,1970,2124,2439];
	this.streamSoundSymbolsList[1954] = [{id:"_7722__leiki__motorcycle",startFrame:1954,endFrame:2440,loop:1,offset:0}];
	this.streamSoundSymbolsList[1970] = [{id:"_71737__audibleedge__chryslerlhstiresqueal0204252009",startFrame:1970,endFrame:2440,loop:1,offset:0}];
	this.streamSoundSymbolsList[2124] = [{id:"crashwav",startFrame:2124,endFrame:2440,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
	}
	this.frame_100 = function() {
		playSound("nar6_pt1");
	}
	this.frame_1380 = function() {
		this.stop();
		
		this.button6.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar6");
		}
		
		
		this.button6_wrong.addEventListener("click", fl_WrongClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_WrongClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("wrongbranch_nar6");
		}
		
		
		/*import flash.events.Event;
		
		button6.addEventListener(MouseEvent.MOUSE_UP, continue_nar6);
		
		function continue_nar6(e:Event):void {
			button6.removeEventListener(MouseEvent.MOUSE_UP, continue_nar6);
			gotoAndPlay("continue_nar6");
		}
		
		button6_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar6);
		
		function wrong_nar6(e:Event):void {
			button6_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar6);
			gotoAndPlay("wrongbranch_nar6");
		}
		*/
	}
	this.frame_1381 = function() {
		this.stop();
		
		this.button6.addEventListener("click", fl_ClickToGoToAndPlayFromFrame.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame()
		{
			this.gotoAndPlay("continue_nar6");
		}
		
		
		/*import flash.events.Event;
		
		button6.addEventListener(MouseEvent.MOUSE_UP, continue_nar6a);
		
		function continue_nar6a(e:Event):void {
			button6.removeEventListener(MouseEvent.MOUSE_UP, continue_nar6);
			gotoAndPlay("continue_nar6");
		}
		
		button6_wrong.addEventListener(MouseEvent.MOUSE_UP, wrong_nar6a);
		
		function wrong_nar6a(e:Event):void {
			button6_wrong.removeEventListener(MouseEvent.MOUSE_UP, wrong_nar6);
			gotoAndPlay("wrongbranch_nar6");
		}
		*/
	}
	this.frame_1385 = function() {
		playSound("nar6_pt2");
	}
	this.frame_1839 = function() {
		/*this.gotoAndPlay("tree","Scene 1");*/
		
		window.open("AncestorSplit_31May2014_copyHTML5_HTML5_Canvas.html?18596", "_self");
	}
	this.frame_1844 = function() {
		playSound("nar6_wrongbranch");
	}
	this.frame_1954 = function() {
		var soundInstance = playSound("_7722__leiki__motorcycle",0);
		this.InsertIntoSoundStreamData(soundInstance,1954,2440,1);
		soundInstance.volume = 0.1;
	}
	this.frame_1970 = function() {
		var soundInstance = playSound("_71737__audibleedge__chryslerlhstiresqueal0204252009",0);
		this.InsertIntoSoundStreamData(soundInstance,1970,2440,1);
		soundInstance.volume = 0.1;
	}
	this.frame_2124 = function() {
		var soundInstance = playSound("crashwav",0);
		this.InsertIntoSoundStreamData(soundInstance,2124,2440,1);
		soundInstance.volume = 0.1;
	}
	this.frame_2439 = function() {
		this.gotoAndStop("wrong_nar6");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(100).call(this.frame_100).wait(1280).call(this.frame_1380).wait(1).call(this.frame_1381).wait(4).call(this.frame_1385).wait(454).call(this.frame_1839).wait(5).call(this.frame_1844).wait(110).call(this.frame_1954).wait(16).call(this.frame_1970).wait(154).call(this.frame_2124).wait(315).call(this.frame_2439).wait(1));

	// text_nar6
	this.text = new cjs.Text("Nikolaj Azbelev -- 1857", "italic bold 18px 'Verdana'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 252;
	this.text.parent = this;
	this.text.setTransform(204.1,23.9);

	this.instance = new lib.Tween200("synched",0);
	this.instance.setTransform(330,34.9);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text}]}).to({state:[{t:this.instance}]},44).to({state:[{t:this.instance}]},45).to({state:[]},11).to({state:[]},300).wait(2040));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(44).to({_off:false},0).to({x:190.5},45).to({_off:true},11).wait(2340));

	// nikolaj_large
	this.instance_1 = new lib.Nikolaj_largeMC();
	this.instance_1.setTransform(315.2,211.55,0.0208,0.0207,0,0,0,2.4,-12.1);
	this.instance_1.alpha = 0;
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(14).to({_off:false},0).to({regX:2.6,regY:-47.4,scaleX:0.7344,scaleY:0.731,x:316.3,y:274.15,alpha:1},30).to({regX:4.1,scaleX:0.4622,scaleY:0.46,x:-260.95,y:287.05,alpha:0},75).to({_off:true},1).wait(2320));

	// _NR1678
	this.instance_2 = new lib.Tween3("synched",0);
	this.instance_2.setTransform(333.6,342.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(89).to({startPosition:0},0).to({alpha:0},11).to({_off:true},1).wait(2339));

	// _KR1728
	this.instance_3 = new lib.Tween20("synched",0);
	this.instance_3.setTransform(509.15,383.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(89).to({startPosition:0},0).to({alpha:0},11).to({_off:true},1).wait(2339));

	// _AR1748
	this.instance_4 = new lib.Tween58("synched",0);
	this.instance_4.setTransform(510.55,237.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(89).to({startPosition:0},0).to({alpha:0},11).to({_off:true},1).wait(2339));

	// _MZ1788
	this.instance_5 = new lib.Tween95("synched",0);
	this.instance_5.setTransform(385.95,159);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(89).to({startPosition:0},0).to({alpha:0},11).to({_off:true},1).wait(2339));

	// _VA1820
	this.instance_6 = new lib.Tween178("synched",0);
	this.instance_6.setTransform(267,158);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(89).to({startPosition:0},0).to({alpha:0},11).to({_off:true},1).wait(2339));

	// _NA1857
	this.instance_7 = new lib.NikolajAzbelev_small1857();
	this.instance_7.setTransform(117,184);

	this.instance_8 = new lib.Tween202("synched",0);
	this.instance_8.setTransform(152,229);
	this.instance_8._off = true;

	this.instance_9 = new lib.Tween203("synched",0);
	this.instance_9.setTransform(332.4,251.55);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_7}]}).to({state:[{t:this.instance_8}]},29).to({state:[{t:this.instance_9}]},60).to({state:[{t:this.instance_9}]},11).to({state:[]},1).wait(2339));
	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(29).to({_off:false},0).to({_off:true,x:332.4,y:251.55},60).wait(2351));
	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(29).to({_off:false},60).to({alpha:0},11).to({_off:true},1).wait(2339));

	// _VA1883
	this.instance_10 = new lib.VeraAzbeleva_small1883();
	this.instance_10.setTransform(109,329);

	this.instance_11 = new lib.Tween204("synched",0);
	this.instance_11.setTransform(144,374);
	this.instance_11._off = true;

	this.instance_12 = new lib.Tween205("synched",0);
	this.instance_12.setTransform(144,374);
	this.instance_12.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_10}]}).to({state:[{t:this.instance_11}]},89).to({state:[{t:this.instance_12}]},11).to({state:[]},1).wait(2339));
	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2340));

	// _OS1921
	this.instance_13 = new lib.OlgaSott_small1921();
	this.instance_13.setTransform(200.1,466.45);

	this.instance_14 = new lib.Tween206("synched",0);
	this.instance_14.setTransform(235.1,511.45);
	this.instance_14._off = true;

	this.instance_15 = new lib.Tween207("synched",0);
	this.instance_15.setTransform(235.1,511.45);
	this.instance_15.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_13}]}).to({state:[{t:this.instance_14}]},89).to({state:[{t:this.instance_15}]},11).to({state:[]},1).wait(2339));
	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2340));

	// _BA1947
	this.instance_16 = new lib.BirutaAkerbergs_small1947();
	this.instance_16.setTransform(349.05,467);

	this.instance_17 = new lib.Tween208("synched",0);
	this.instance_17.setTransform(384.05,512);
	this.instance_17._off = true;

	this.instance_18 = new lib.Tween209("synched",0);
	this.instance_18.setTransform(384.05,512);
	this.instance_18.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_16}]}).to({state:[{t:this.instance_17}]},89).to({state:[{t:this.instance_18}]},11).to({state:[]},1).wait(2339));
	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2340));

	// _0H1983
	this.instance_19 = new lib.Hansen_small1983();
	this.instance_19.setTransform(490.1,462.7);

	this.instance_20 = new lib.Tween210("synched",0);
	this.instance_20.setTransform(525.1,507.7);
	this.instance_20._off = true;

	this.instance_21 = new lib.Tween211("synched",0);
	this.instance_21.setTransform(525.1,507.7);
	this.instance_21.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_19}]}).to({state:[{t:this.instance_20}]},89).to({state:[{t:this.instance_21}]},11).to({state:[]},1).wait(2339));
	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2340));

	// arrows
	this.text_1 = new cjs.Text("....", "italic bold 47px 'Verdana'", "#554732");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 59;
	this.text_1.parent = this;
	this.text_1.setTransform(606.05,474.7);

	this.instance_22 = new lib.CachedBmp_70();
	this.instance_22.setTransform(151.45,120,0.5,0.5);

	this.instance_23 = new lib.Tween212("synched",0);
	this.instance_23.setTransform(397.5,327.6);
	this.instance_23._off = true;

	this.instance_24 = new lib.Tween213("synched",0);
	this.instance_24.setTransform(397.5,327.6);
	this.instance_24.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_22},{t:this.text_1}]}).to({state:[{t:this.instance_23}]},89).to({state:[{t:this.instance_24}]},11).to({state:[]},1).wait(2339));
	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2340));

	// vine
	this.instance_25 = new lib.CachedBmp_58();
	this.instance_25.setTransform(88.1,62.4,0.5,0.5);

	this.instance_26 = new lib.Tween214("synched",0);
	this.instance_26.setTransform(314.5,296.9);
	this.instance_26._off = true;

	this.instance_27 = new lib.Tween215("synched",0);
	this.instance_27.setTransform(314.5,296.9);
	this.instance_27.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_25}]}).to({state:[{t:this.instance_26}]},89).to({state:[{t:this.instance_27}]},11).to({state:[]},1).wait(2339));
	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2340));

	// branches
	this.instance_28 = new lib.tree_branch();
	this.instance_28.setTransform(345.5,382.5);

	this.instance_29 = new lib.tree_branch();
	this.instance_29.setTransform(542.6,507,0.8293,1.0441,0,-74.6679,-29.9986);

	this.instance_30 = new lib.tree_branch();
	this.instance_30.setTransform(586.45,490.9,1,1,-29.9992);

	this.instance_31 = new lib.tree_branch();
	this.instance_31.setTransform(446.5,486.5,1,1.164,0,30.7843,0);

	this.instance_32 = new lib.tree_branch();
	this.instance_32.setTransform(481.15,493.5,0.5341,0.7659,59.9996);

	this.instance_33 = new lib.tree_branch();
	this.instance_33.setTransform(436.1,479.85,1,1,45);

	this.instance_34 = new lib.tree_branch();
	this.instance_34.setTransform(346.3,480.2,1,1.451,59.9998);

	this.instance_35 = new lib.tree_branch();
	this.instance_35.setTransform(294.15,480.9,1,1,45);

	this.instance_36 = new lib.tree_branch();
	this.instance_36.setTransform(161.95,487.7,1,1,-74.9998);

	this.instance_37 = new lib.tree_branch();
	this.instance_37.setTransform(132.55,458.9,1.1309,1,0,-74.9998,-47.1609);

	this.instance_38 = new lib.tree_branch();
	this.instance_38.setTransform(109.5,316.2,1.7805,1,-45);

	this.instance_39 = new lib.tree_branch();
	this.instance_39.setTransform(171.5,147.5);

	this.instance_40 = new lib.tree_branch();
	this.instance_40.setTransform(212.9,188.05,1,1,-135);

	this.instance_41 = new lib.tree_branch();
	this.instance_41.setTransform(312.9,172.5,1,1,-120.0004);

	this.instance_42 = new lib.tree_branch();
	this.instance_42.setTransform(417.5,166.5,0.4634,1,-90);

	this.instance_43 = new lib.tree_branch();
	this.instance_43.setTransform(470.45,310.5,1.5366,1);

	this.instance_44 = new lib.tree_branch();
	this.instance_44.setTransform(462.85,426.15,1,0.7,-135.0009);

	this.instance_45 = new lib.tree_branch();
	this.instance_45.setTransform(397.6,383.55,1.6415,1,14.9983);

	this.instance_46 = new lib.tree_branch();
	this.instance_46.setTransform(459.4,328.95,1,1,-83.995);

	this.instance_47 = new lib.tree_branch();
	this.instance_47.setTransform(440.85,152.9,1,1,-45);

	this.instance_48 = new lib.Tween216("synched",0);
	this.instance_48.setTransform(377.45,331.65);
	this.instance_48._off = true;

	this.instance_49 = new lib.Tween217("synched",0);
	this.instance_49.setTransform(377.45,331.65);
	this.instance_49.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_41},{t:this.instance_40},{t:this.instance_39},{t:this.instance_38},{t:this.instance_37},{t:this.instance_36},{t:this.instance_35},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32},{t:this.instance_31},{t:this.instance_30},{t:this.instance_29},{t:this.instance_28}]}).to({state:[{t:this.instance_48}]},89).to({state:[{t:this.instance_49}]},11).to({state:[]},1).wait(2339));
	this.timeline.addTween(cjs.Tween.get(this.instance_48).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2340));

	// tree
	this.instance_50 = new lib.tree_clear_small();
	this.instance_50.setTransform(214.5,138);

	this.instance_51 = new lib.Tween218("synched",0);
	this.instance_51.setTransform(322,322);
	this.instance_51._off = true;

	this.instance_52 = new lib.Tween219("synched",0);
	this.instance_52.setTransform(322,322);
	this.instance_52.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_50}]}).to({state:[{t:this.instance_51}]},89).to({state:[{t:this.instance_52}]},11).to({state:[]},1).wait(2339));
	this.timeline.addTween(cjs.Tween.get(this.instance_51).wait(89).to({_off:false},0).to({_off:true,alpha:0},11).wait(2340));

	// text
	this.instance_53 = new lib.CachedBmp_59();
	this.instance_53.setTransform(309.1,17.2,0.5,0.5);
	this.instance_53._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_53).wait(146).to({_off:false},0).to({_off:true},151).wait(2143));

	// text_nikolaj
	this.instance_54 = new lib.CachedBmp_60();
	this.instance_54.setTransform(61.3,19.3,0.5,0.5);

	this.instance_55 = new lib.CachedBmp_61();
	this.instance_55.setTransform(164.25,17.25,0.5,0.5);

	this.text_2 = new cjs.Text("Nikolai", "italic bold 24px 'Verdana'");
	this.text_2.lineHeight = 31;
	this.text_2.parent = this;
	this.text_2.setTransform(59,19.25);

	this.instance_56 = new lib.Tween220("synched",0);
	this.instance_56.setTransform(165.4,33.75);
	this.instance_56._off = true;

	this.instance_57 = new lib.Tween221("synched",0);
	this.instance_57.setTransform(126.7,33.75);

	this.instance_58 = new lib.CachedBmp_62();
	this.instance_58.setTransform(20.2,23.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_54}]},117).to({state:[{t:this.text_2},{t:this.instance_55}]},27).to({state:[{t:this.instance_56}]},153).to({state:[{t:this.instance_57}]},12).to({state:[]},104).to({state:[{t:this.instance_58}]},7).to({state:[]},346).to({state:[]},1299).wait(375));
	this.timeline.addTween(cjs.Tween.get(this.instance_56).wait(297).to({_off:false},0).to({_off:true,x:126.7},12).wait(2131));

	// nikolaj
	this.instance_59 = new lib.Nikolaj_largeMC();
	this.instance_59.setTransform(163.2,208.4,0.3,0.3,0,0,0,-8.2,-7);
	this.instance_59.alpha = 0;
	this.instance_59._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_59).wait(100).to({_off:false},0).to({regY:-8,scaleX:0.3001,x:163,y:210.35,alpha:1},39).wait(158).to({regX:-8.6,regY:-9.3,scaleX:0.2751,scaleY:0.275,x:162.8,y:210.1},0).to({regX:-2.9,regY:-8.8,x:122.25,y:210.15},12).wait(98).to({alpha:0},13).to({_off:true},5).wait(2015));

	// viktor
	this.instance_60 = new lib.viktor_olderMC();
	this.instance_60.setTransform(467,486);
	this.instance_60._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_60).wait(198).to({_off:false},0).wait(99).to({alpha:0},12).to({_off:true},8).wait(2123));

	// text_viktor
	this.shape = new cjs.Shape();
	this.shape.graphics.beginFill().beginStroke("#000000").setStrokeStyle(3,1,1).moveTo(0.3,-26.8).lineTo(14.5,-14.8).moveTo(-14.5,-12.8).lineTo(0.3,-26.8).moveTo(0.3,26.8).lineTo(0.3,-26.8);
	this.shape.setTransform(463.45,380.8);

	this.text_3 = new cjs.Text("Viktor", "italic bold 24px 'Verdana'");
	this.text_3.lineHeight = 31;
	this.text_3.parent = this;
	this.text_3.setTransform(276,391);

	this.instance_61 = new lib.CachedBmp_64();
	this.instance_61.setTransform(447.45,352.5,0.5,0.5);

	this.text_4 = new cjs.Text("Viktor", "italic bold 24px 'Verdana'");
	this.text_4.lineHeight = 31;
	this.text_4.parent = this;
	this.text_4.setTransform(276,391);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},185).to({state:[{t:this.instance_61},{t:this.text_3,p:{x:276,y:391,text:"Viktor",lineWidth:82}}]},13).to({state:[{t:this.instance_61},{t:this.text_4},{t:this.text_3,p:{x:242,y:432,text:"Arcimovics",lineWidth:147}}]},6).to({state:[]},93).to({state:[]},1768).wait(375));

	// text_vera
	this.text_5 = new cjs.Text("Vera", "italic bold 24px 'Verdana'");
	this.text_5.lineHeight = 31;
	this.text_5.parent = this;
	this.text_5.setTransform(358.6,19.25);

	this.text_6 = new cjs.Text("Vera", "italic bold 24px 'Verdana'");
	this.text_6.lineHeight = 31;
	this.text_6.parent = this;
	this.text_6.setTransform(358.6,19.25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_5,p:{x:358.6,y:19.25,text:"Vera",lineWidth:63}}]},171).to({state:[{t:this.text_6},{t:this.text_5,p:{x:432.95,y:19.2,text:"Arcimovics",lineWidth:147}}]},6).to({state:[]},120).to({state:[]},1760).wait(383));

	// vera
	this.instance_62 = new lib.VeraMC();
	this.instance_62.setTransform(463.7,214.45);
	this.instance_62._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_62).wait(166).to({_off:false},0).wait(131).to({alpha:0},12).to({_off:true},8).wait(2123));

	// text_heir
	this.text_7 = new cjs.Text("Heir to throne \nGeorgij Alexandrovich", "italic bold 24px 'Verdana'");
	this.text_7.lineHeight = 31;
	this.text_7.parent = this;
	this.text_7.setTransform(296.95,4.2);
	this.text_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_7).wait(309).to({_off:false},0).to({_off:true},457).wait(1674));

	// heir_cutout
	this.instance_63 = new lib.heir_cutoutMC();
	this.instance_63.setTransform(431.7,314.3);
	this.instance_63.alpha = 0;
	this.instance_63._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_63).wait(700).to({_off:false},0).to({alpha:1},66).to({regX:-0.3,regY:-3.3,scaleX:0.4101,scaleY:0.4091,x:560.85,y:488.1},78).wait(81).to({alpha:0},96).to({_off:true},8).wait(1411));

	// heir
	this.instance_64 = new lib.heirMC();
	this.instance_64.setTransform(431.85,362.4);
	this.instance_64.alpha = 0;
	this.instance_64._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_64).wait(297).to({_off:false},0).to({y:315.1,alpha:1},12).wait(391).to({alpha:0},66).to({_off:true},10).wait(1073).to({_off:false,x:265.95,y:336},0).to({x:189.95,y:316.05,alpha:1},60).to({x:59,y:293.3,alpha:0},124).to({_off:true},32).wait(375));

	// czar
	this.instance_65 = new lib.czarMC();
	this.instance_65.setTransform(133.2,778.3,0.791,0.791,0,0,0,0,-0.4);
	this.instance_65.alpha = 0;
	this.instance_65._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_65).wait(395).to({_off:false},0).to({x:130,y:222.35,alpha:1},25).wait(179).to({alpha:0},167).to({_off:true},10).wait(1664));

	// friends_text
	this.text_8 = new cjs.Text("Nik and friends", "italic bold 24px 'Verdana'");
	this.text_8.lineHeight = 31;
	this.text_8.parent = this;
	this.text_8.setTransform(239,51.8);
	this.text_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_8).wait(919).to({_off:false},0).to({_off:true},97).wait(1424));

	// friends
	this.instance_66 = new lib.friendsMC();
	this.instance_66.setTransform(259.7,496);
	this.instance_66.alpha = 0;
	this.instance_66._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_66).wait(868).to({_off:false},0).to({regY:-1.3,scaleX:0.7731,scaleY:0.773,x:197.3,y:478.75,alpha:1},54).wait(3).to({alpha:0},96).to({_off:true},8).wait(1411));

	// nikvera_text
	this.text_9 = new cjs.Text("Nik and Vera", "italic bold 24px 'Verdana'");
	this.text_9.lineHeight = 31;
	this.text_9.parent = this;
	this.text_9.setTransform(463.85,37.1);
	this.text_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_9).wait(869).to({_off:false},0).to({_off:true},148).wait(1423));

	// NikVera
	this.instance_67 = new lib.NikVera_cutoutMC();
	this.instance_67.setTransform(802.95,399.3);
	this.instance_67.alpha = 0;
	this.instance_67._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_67).wait(808).to({_off:false},0).to({x:532.7,y:272.65,alpha:1},62).wait(55).to({alpha:0},96).to({_off:true},8).wait(1411));

	// parent_text
	this.text_10 = new cjs.Text("Nik's parents", "italic bold 24px 'Verdana'");
	this.text_10.lineHeight = 31;
	this.text_10.parent = this;
	this.text_10.setTransform(23.9,37.1);
	this.text_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_10).wait(808).to({_off:false},0).to({_off:true},211).wait(1421));

	// nikParents
	this.instance_68 = new lib.NikParentsMC();
	this.instance_68.setTransform(-246.35,463);
	this.instance_68.alpha = 0;
	this.instance_68._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_68).wait(776).to({_off:false},0).to({regX:0.1,regY:-2.3,scaleX:0.5124,scaleY:0.5118,x:164.75,y:182.55,alpha:1},56).wait(93).to({alpha:0},96).to({_off:true},8).wait(1411));

	// castle_text
	this.text_11 = new cjs.Text("Abas-Tuman castle", "italic bold 30px 'Verdana'");
	this.text_11.lineHeight = 38;
	this.text_11.parent = this;
	this.text_11.setTransform(169.35,4.1);
	this.text_11._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text_11).wait(766).to({_off:false},0).to({_off:true},254).wait(1420));

	// castle
	this.instance_69 = new lib.castleMC();
	this.instance_69.setTransform(332.05,388.45);
	this.instance_69.alpha = 0;
	this.instance_69._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_69).wait(599).to({_off:false},0).to({regX:-0.1,regY:-0.5,scaleX:0.7728,scaleY:0.7728,x:331.9,y:338.2,alpha:1},167).wait(159).to({alpha:0},96).to({_off:true},8).wait(1411));

	// nagasaki
	this.instance_70 = new lib.nagasakiMC();
	this.instance_70.setTransform(388.45,394.95);
	this.instance_70.alpha = 0;
	this.instance_70._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_70).wait(1248).to({_off:false},0).to({x:251.75,y:217.45,alpha:1},23).to({_off:true},73).wait(1096));

	// nagMap
	this.instance_71 = new lib.NagMapMC();
	this.instance_71.setTransform(327.7,312.5);
	this.instance_71.alpha = 0;
	this.instance_71._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_71).wait(1224).to({_off:false},0).to({regX:0.1,regY:-0.5,scaleX:1.3486,scaleY:1.3484,x:327.9,y:311.35,alpha:1},24).to({_off:true},96).wait(1096));

	// books
	this.instance_72 = new lib.booksMC();
	this.instance_72.setTransform(351.55,460.05);
	this.instance_72.alpha = 0;
	this.instance_72._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_72).wait(1125).to({_off:false},0).to({regY:-1.3,scaleX:1.84,scaleY:1.84,x:447.75,y:295.85,alpha:1},76).to({x:315.4,y:239.4,alpha:0},33).to({_off:true},110).wait(1096));

	// astronomy
	this.instance_73 = new lib.astronomyMC();
	this.instance_73.setTransform(400,314.05,0.8,0.7999,0,0,0,0,-2.6);
	this.instance_73.alpha = 0;
	this.instance_73._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_73).wait(925).to({_off:false},0).to({regX:0.1,scaleX:1.4333,scaleY:1.4332,x:400.25,y:441.4,alpha:1},96).to({regY:-3,x:374.55,y:272.55},104).to({regY:-0.9,scaleX:1.1333,scaleY:1.1333,x:327.85,y:151.55,alpha:0},89).to({_off:true},130).wait(1096));

	// text_question
	this.text_12 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_12.lineHeight = 56;
	this.text_12.parent = this;
	this.text_12.setTransform(213.55,53.5);

	this.instance_74 = new lib.CachedBmp_65();
	this.instance_74.setTransform(211.55,51.5,0.5,0.5);

	this.text_13 = new cjs.Text("did", "bold 44px 'Verdana'");
	this.text_13.lineHeight = 56;
	this.text_13.parent = this;
	this.text_13.setTransform(423.7,53.7);

	this.text_14 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_14.lineHeight = 56;
	this.text_14.parent = this;
	this.text_14.setTransform(285.55,53.5);

	this.text_15 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_15.lineHeight = 56;
	this.text_15.parent = this;
	this.text_15.setTransform(285.55,53.5);

	this.text_16 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_16.lineHeight = 56;
	this.text_16.parent = this;
	this.text_16.setTransform(285.55,53.5);

	this.text_17 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_17.lineHeight = 56;
	this.text_17.parent = this;
	this.text_17.setTransform(285.55,53.5);

	this.text_18 = new cjs.Text("How", "bold 44px 'Verdana'");
	this.text_18.lineHeight = 56;
	this.text_18.parent = this;
	this.text_18.setTransform(285.55,53.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.text_12,p:{x:213.55,y:53.5,text:"How",lineWidth:110,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}}]},1345).to({state:[{t:this.instance_74},{t:this.text_12,p:{x:351.7,y:53.7,text:"did",lineWidth:77,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}}]},2).to({state:[{t:this.text_14,p:{x:285.55,y:53.5,text:"How",lineWidth:110}},{t:this.text_13,p:{x:423.7,y:53.7,text:"did",lineWidth:77,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}},{t:this.text_12,p:{x:191.15,y:116.65,text:"Nikolai",lineWidth:172,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}}]},2).to({state:[{t:this.text_15,p:{x:285.55,y:53.5,text:"How",lineWidth:110}},{t:this.text_14,p:{x:423.7,y:53.7,text:"did",lineWidth:77}},{t:this.text_13,p:{x:191.15,y:116.65,text:"Nikolai",lineWidth:172,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}},{t:this.text_12,p:{x:384.55,y:116.55,text:"Azbelev",lineWidth:193,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}}]},2).to({state:[{t:this.text_16,p:{x:285.55,y:53.5,text:"How",lineWidth:110}},{t:this.text_15,p:{x:423.7,y:53.7,text:"did",lineWidth:77}},{t:this.text_14,p:{x:191.15,y:116.65,text:"Nikolai",lineWidth:172}},{t:this.text_13,p:{x:384.55,y:116.55,text:"Azbelev",lineWidth:193,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}},{t:this.text_12,p:{x:350.85,y:183.7,text:"die?",lineWidth:102,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}}]},2).to({state:[{t:this.text_17,p:{x:285.55,y:53.5,text:"How",lineWidth:110}},{t:this.text_16,p:{x:423.7,y:53.7,text:"did",lineWidth:77}},{t:this.text_15,p:{x:191.15,y:116.65,text:"Nikolai",lineWidth:172}},{t:this.text_14,p:{x:384.55,y:116.55,text:"Azbelev",lineWidth:193}},{t:this.text_13,p:{x:350.85,y:183.7,text:"die?",lineWidth:102,font:"bold 44px 'Verdana'",color:"#000000",textAlign:"",lineHeight:55.5}},{t:this.text_12,p:{x:265.4,y:281.4,text:"In a motorcycle\naccident",lineWidth:256,font:"bold 29px 'Verdana'",color:"#993300",textAlign:"center",lineHeight:37.25}}]},8).to({state:[{t:this.text_18},{t:this.text_17,p:{x:423.7,y:53.7,text:"did ",lineWidth:92}},{t:this.text_16,p:{x:191.15,y:116.65,text:"Nikolai",lineWidth:172}},{t:this.text_15,p:{x:384.55,y:116.55,text:"Azbelev",lineWidth:193}},{t:this.text_14,p:{x:350.85,y:183.7,text:"die?",lineWidth:102}},{t:this.text_13,p:{x:265.4,y:281.4,text:"In a motorcycle\naccident",lineWidth:256,font:"bold 29px 'Verdana'",color:"#993300",textAlign:"center",lineHeight:37.25}},{t:this.text_12,p:{x:554.35,y:281.15,text:"He committed\nsuicide",lineWidth:228,font:"bold 29px 'Verdana'",color:"#993300",textAlign:"center",lineHeight:37.25}}]},3).to({state:[{t:this.text_18},{t:this.text_17,p:{x:423.7,y:53.7,text:"did",lineWidth:77}},{t:this.text_16,p:{x:191.15,y:116.65,text:"Nikolai",lineWidth:172}},{t:this.text_15,p:{x:384.55,y:116.55,text:"Azbelev",lineWidth:193}},{t:this.text_14,p:{x:350.85,y:183.7,text:"die?",lineWidth:102}},{t:this.text_13,p:{x:265.4,y:281.4,text:"In a motorcycle\naccident",lineWidth:256,font:"bold 29px 'Verdana'",color:"#993300",textAlign:"center",lineHeight:37.25}},{t:this.text_12,p:{x:554.35,y:281.15,text:"He committed\nsuicide",lineWidth:228,font:"bold 29px 'Verdana'",color:"#993300",textAlign:"center",lineHeight:37.25}}]},1).to({state:[]},20).to({state:[]},782).wait(273));

	// wrong
	this.text_19 = new cjs.Text("Wrong answer!", "italic bold 26px 'Verdana'", "#FF0000");
	this.text_19.textAlign = "center";
	this.text_19.lineHeight = 34;
	this.text_19.parent = this;
	this.text_19.setTransform(247.4,489.65);

	this.instance_75 = new lib.CachedBmp_66();
	this.instance_75.setTransform(195.9,367.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_75},{t:this.text_19}]},1381).to({state:[]},4).to({state:[]},782).wait(273));

	// button_wrong
	this.button6_wrong = new lib.button_nar1();
	this.button6_wrong.name = "button6_wrong";
	this.button6_wrong.setTransform(260.85,425.1);
	this.button6_wrong._off = true;
	new cjs.ButtonHelper(this.button6_wrong, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button6_wrong).wait(1368).to({_off:false},0).to({_off:true},17).wait(1055));

	// button
	this.button6 = new lib.button_nar1();
	this.button6.name = "button6";
	this.button6.setTransform(554.6,424.95);
	this.button6._off = true;
	new cjs.ButtonHelper(this.button6, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.button6).wait(1372).to({_off:false},0).to({_off:true},13).wait(1055));

	// vladivostok
	this.instance_76 = new lib.vladiMC();
	this.instance_76.setTransform(582.2,282.15);
	this.instance_76.alpha = 0;
	this.instance_76._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_76).wait(1385).to({_off:false},0).to({x:406.1,y:305.25,alpha:1},114).to({regX:-0.1,regY:-1.5,scaleX:1.205,scaleY:1.205,x:347.7,y:301.85},100).to({x:277.55,y:318.25},100).to({x:201.45,alpha:0},100).to({_off:true},39).wait(602));

	// motorcycle
	this.instance_77 = new lib.motorcyclemovingMC();
	this.instance_77.setTransform(-129.75,382.75,1,1,0,0,0,0,0.3);
	this.instance_77._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_77).wait(2028).to({_off:false},0).to({x:927.2,y:382.4},96).wait(316));

	// background
	this.instance_78 = new lib.paperbg2_600x800();

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.beginFill().beginStroke("#000000").setStrokeStyle(1,1,1).moveTo(139.8,-74.8).lineTo(139.8,-102.5).curveTo(139.9,-99.7,142.7,-97.7).curveTo(145.7,-95.7,149.9,-95.7).moveTo(129.9,-74.1).lineTo(129.9,-74.2).moveTo(136.3,-67.9).curveTo(138,-67.4,140.1,-67.4).moveTo(158.9,-61.1).lineTo(158.9,-88.8).curveTo(158.9,-86,161.8,-84).curveTo(164.8,-82,168.9,-82).moveTo(159.9,64.5).lineTo(159.9,36.8).curveTo(160.1,39.6,162.9,41.6).curveTo(165.9,43.6,170.1,43.6).moveTo(129.9,-72).lineTo(129.9,-46.5).moveTo(-170,102.5).lineTo(-170,74.8).curveTo(-169.9,77.6,-167.1,79.6).curveTo(-164.1,81.6,-159.9,81.6);
	this.shape_1.setTransform(289.95,155.775);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.beginFill("#000000").beginStroke().moveTo(-169.5,91.9).lineTo(-170,89.7).curveTo(-170,88.9,-169.8,88.2).lineTo(-169.8,88.2).lineTo(-170,87.7).curveTo(-170,85.3,-168.5,83.9).curveTo(-167.1,82.6,-165,82.6).curveTo(-163,82.6,-161.6,83.9).curveTo(-160.1,85.2,-160,87.5).lineTo(-160,87.8).lineTo(-160.1,88.6).lineTo(-160,89.5).lineTo(-160,89.7).curveTo(-160,91.2,-161,92.7).curveTo(-162.4,94.7,-165,94.7).curveTo(-168.3,94.7,-169.5,91.9).closePath().moveTo(160.6,53.9).lineTo(160,51.7).curveTo(160,50.9,160.2,50.2).lineTo(160.2,50.2).lineTo(160,49.7).curveTo(160,47.3,161.5,45.9).curveTo(163,44.6,165,44.6).curveTo(167.1,44.6,168.5,45.9).curveTo(170,47.2,170,49.5).lineTo(170,49.8).lineTo(169.9,50.6).lineTo(170,51.5).lineTo(170,51.7).curveTo(170,53.2,169,54.7).curveTo(167.6,56.7,165,56.7).curveTo(161.8,56.7,160.6,53.9).closePath().moveTo(130.6,-57.1).lineTo(130,-59.3).curveTo(130,-60.1,130.2,-60.8).lineTo(130.2,-60.8).lineTo(130,-61.3).curveTo(130,-63.7,131.6,-65.1).curveTo(132.9,-66.4,135,-66.4).curveTo(137.1,-66.4,138.4,-65.1).curveTo(140,-63.8,140,-61.5).lineTo(140,-61.2).lineTo(139.9,-60.4).lineTo(140,-59.5).lineTo(140,-59.3).curveTo(140,-57.8,139,-56.3).curveTo(137.6,-54.3,135,-54.3).curveTo(131.7,-54.3,130.6,-57.1).closePath().moveTo(159.5,-71.7).lineTo(158.9,-73.9).curveTo(158.9,-74.7,159.1,-75.4).lineTo(159.1,-75.4).lineTo(158.9,-75.9).curveTo(158.9,-78.3,160.5,-79.7).curveTo(161.9,-81,163.9,-81).curveTo(166,-81,167.3,-79.7).curveTo(168.9,-78.4,168.9,-76.1).lineTo(168.9,-75.8).lineTo(168.8,-75).lineTo(168.9,-74.1).lineTo(168.9,-73.9).curveTo(168.9,-72.4,167.9,-70.9).curveTo(166.5,-68.9,163.9,-68.9).curveTo(160.7,-68.9,159.5,-71.7).closePath().moveTo(140.3,-85.4).lineTo(140,-87).lineTo(139.8,-87.6).curveTo(139.8,-88.4,140,-89.1).lineTo(140,-89.1).lineTo(139.8,-89.6).curveTo(139.8,-92,141.4,-93.4).curveTo(142.7,-94.7,144.8,-94.7).curveTo(146.8,-94.7,148.2,-93.4).curveTo(149.7,-92.1,149.8,-89.8).lineTo(149.8,-89.5).lineTo(149.7,-88.7).lineTo(149.8,-87.8).lineTo(149.8,-87.6).curveTo(149.8,-86.1,148.8,-84.6).curveTo(147.8,-83.2,146.3,-82.8).curveTo(145.6,-82.6,144.8,-82.6).curveTo(141.5,-82.6,140.3,-85.4).closePath();
	this.shape_2.setTransform(279.9,170.725);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.instance_78}]}).wait(2440));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-129.4,-0.2,1182.6000000000001,1017.9000000000001);
// library properties:
lib.properties = {
	id: 'F655CB2B74D9AF4A8B1C755C0CE040C5',
	width: 800,
	height: 600,
	fps: 24,
	color: "#FFFF99",
	opacity: 1.00,
	manifest: [
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_1.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_1"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_2"},
		{src:"images/AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3.png", id:"AncestorSplit_31May2014_copyHTML5_HTML5 Canvas_Scene 6_atlas_3"},
		{src:"sounds/_71737__audibleedge__chryslerlhstiresqueal0204252009.mp3", id:"_71737__audibleedge__chryslerlhstiresqueal0204252009"},
		{src:"sounds/_7722__leiki__motorcycle.mp3", id:"_7722__leiki__motorcycle"},
		{src:"sounds/crashwav.mp3", id:"crashwav"},
		{src:"sounds/nar6_pt1.mp3", id:"nar6_pt1"},
		{src:"sounds/nar6_pt2.mp3", id:"nar6_pt2"},
		{src:"sounds/nar6_wrongbranch.mp3", id:"nar6_wrongbranch"}
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
an.compositions['F655CB2B74D9AF4A8B1C755C0CE040C5'] = {
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