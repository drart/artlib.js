(function(){
    var adam = fluid.registerNamespace("adam");
    //var numChans = flock.enviro.shared.audioSystem.model.chans;


    /*noizilator
     *
     * 500ms line from prev to current midi
     * phasor -> tanh -> env -> decimate -> pan
     *
     *
     * sawOsc -> flock.ugen.distortion.tanh -> env -> flock.ugen.distortion.deJonge
     * tarrabiaDeJonge
     */

    ////// IN PROGRESS
    fluid.defaults("adam.stereosquare", {
        gradenames: "flock.synth",
        synthDef: [{
            ugen: "flock.ugen.squareOsc",
            freq: 100,
            duty: {
                ugen: "flock.ugen.triangle",
                freq: {
                    ugen: "flock.ugen.sin",
                    freq: 1.17391,
                    add: 6
                },
                mul: 0.2,
                add: 0.5
            }
        },{
            ugen: "flock.ugen.squareOsc",
            freq: 101,
            duty: 0.5 // ??
        }] 
    });



    fluid.defaults("adam.noizilator", {
        gradeNames: "flock.synth",
        synthDef: {
            ugen: "flock.ugen.sawOsc",
                freq: {
                ugen: "flock.ugen.mouse.cursor",
                    mul: 500,
                    add: 100
                },
                mul: {
                    ugen: "flock.ugen.asr",
                    attack: 0.25,
                    sustain: 0.25,
                    release: 0.5,
                    gate: {
                        ugen: "flock.ugen.mouse.click"
                    }
             }
        } 
    });

    fluid.defaults("adam.sinekick", {
        gradeNames: "flock.synth",
        synthDef: {
            ugen: "flock.ugen.sinOsc",
            id: "kicky",
            freq: 95,
            phase: 3.14/2,
            mul: {
                ugen: "flock.ugen.envGen",
                id: "env",
                envelope: {
                    type: "flock.envelope.adsr",
                    attack: 0.001,
                    decay: 0.5,
                    sustain: 0,
                    release: 0,
                },
                //mul: 0.25
            }
        }
    });

    //////
    // Simple Sine Synth
    //////
    fluid.defaults("adam.bop", {
        gradeNames: "flock.synth", 
        synthDef: {
            id: "bop",
            ugen: "flock.ugen.sinOsc",
            freq: 440,
            mul: {
                id: "env",
                ugen: "flock.ugen.asr",
                start: 0.0,
                attack: 0.01,
                sustain: 0.1,
                release: 0.5,
            }
        }
    });

    fluid.defaults("adam.bopper", {
        gradeNames: "adam.bop",
        synthDef: {
            freq:{
                ugen: "flock.ugen.sinOsc",
                freq: 10, 
                add: 400,
                mul: 1
            }
        }
    });

    fluid.defaults("adam.flutter", {
        gradeNames: "adam.bop", 
        synthDef: {
            id: "root",
            ugen: "flock.ugen.triOsc",
            freq: {
                ugen: "flock.ugen.square",
                freq: 3,
                mul: 80,
                add: 500
            }
        }
        /*
           listeners: {
               noteOn: {
                   funcName: "adam.flutter.hardsync",
                   args: ["{that}", "{arguments}.0"]
               }
           }
         * */
    });

    adam.flutter.hardsync = function(that, freq){
        // this.set("{that}".); 
        that.set("root.phase", 0.5);
        that.set("root.freq.phase", 0);
    };

    fluid.defaults("adam.tick", {
        gradeNames: "flock.synth", 
        synthDef: {
            id : "tick",
            ugen: "flock.ugen.filter.moog", 
            resonance: 10,
            cutoff: 500,
            source: {
                ugen: "flock.ugen.whiteNoise"
            },
            mul: {
                id: "env",
                ugen: "flock.ugen.asr",
                attack: 0.1,
                sustain: 0.1,
                release: 0.5,
            }
        }
        
    });

    fluid.defaults("adam.windy", {
        gradeNames: "flock.synth", 
        synthDef:{
            id: "moogy",
            ugen: "flock.ugen.filter.moog",
            source: {
                id: "testy",
                ugen: "flock.ugen.whiteNoise",
                mul: {
                    id: "freqy",
                    ugen: "flock.ugen.dust",
                    density: 100,
                    mul: 0.4,
                    add: 0.5
                }
            },
            resonance: {
               ugen: "flock.ugen.line",
               start: 1,
               end: 15,
               duration: 100    
            },
            cutoff: {
                ugen: "flock.ugen.sinOsc",
                freq: 0.1,
                mul: 500,
                add: 1000
            },
        }
    });

    fluid.defaults("adam.amfm", {
        gradeNames: "flock.synth", 
                synthDef: {
                    id: "synth",
                    ugen: "flock.ugen.sawOsc",
                    freq: {
                        id: "fmod",
                        ugen: "flock.ugen.sinOsc",
                        freq: {
                            ugen: "flock.ugen.sin",
                            freq: 4,
                            add: 40,
                            mul: 4
                        },
                        mul: 300,
                        add: 500
                    },
                    mul: {
                        id: "amod",
                        ugen: "flock.ugen.sinOsc",
                        freq: 167,
                        mul: 0,
                        add: 0.5
                    }
                }
    });

    fluid.defaults("adam.dusty", {
        gradeNames: "flock.synth", 
        synthDef: {
            ugen: "flock.ugen.dust",
            density: {
                ugen: "flock.ugen.sinOsc",
                freq: .05,
                mul: 50,
                add: 50,
            },
            mul: 0.25
        }
    });

    fluid.defaults("adam.floaty", {
        gradeNames: "flock.synth", 
        synthDef:{
            ugen: "flock.ugen.sin",
            expand: 6,
            freq: {
                ugen: "flock.ugen.lfNoise",
                freq: 1,
                mul: 180,
                add: 180
            },
            mul: {
                ugen: "flock.ugen.envGen",
                envelope: {
                    type: "flock.envelope.sin",
                    duration: 0.5
                },
                gate: {
                    ugen: "flock.ugen.lfPulse",
                    width: 0.5,
                    freq: 1
                }
            }
        }
    });

    fluid.defaults("adam.cloosh", {
        gradeNames: "flock.band", 
        synthDef: {
            id: "freeverb",
            ugen: "flock.ugen.freeverb",
                source: {
                    id: "boop",
                    ugen: "flock.ugen.sinOsc",
                    freq: 500,
                mul: {
                    id : "env",
                    ugen: "flock.ugen.envGen",
                    rate: "control",
                    envelope: {
                        levels: [0, 0.45, 0],
                        times: [0.01, 0.5],
                        curve: ["exponential", "exponential"]
                    }
                }
            }
        }  
    });



    // BIGGER SYNTHS
    fluid.defaults("adam.synth.quadvoicepanning", {
        gradeNames: "flock.synth",
        synthDef:{
            id: "root",
            ugen: "flock.ugen.pan2",
            pan: {
                ugen: "flock.ugen.sin",
                freq: 0.1
            },
            source:{
                ugen: "flock.ugen.sum",
                mul: 0,
                sources: [
                {
                    id: "voice1",
                    ugen: "flock.ugen.sawOsc",
                    freq: 442,

                },
                {
                    id: "voice2",
                    ugen: "flock.ugen.sawOsc",
                    freq: 445
                },
                {
                    id: "voice3",
                    ugen: "flock.ugen.sawOsc",
                    freq: 500                    
                },
                {
                    id: "voice4",
                    ugen: "flock.ugen.sawOsc",
                    freq: 600
                }
                ]
            }
       },
       invokers: {
           changenotes: {
               func: function(that, note){
                   var notefreq = flock.midiFreq( note );
                   if (that.get("root.source.mul") === 0){
                       that.set("root.source.mul", 0.25);
                   }
                   that.set({
                       "voice1.freq": notefreq,
                       "voice2.freq": notefreq *1.02,
                       "voice3.freq": notefreq *2.02,
                       "voice4.freq": notefreq *1.52,
                   });
               },
               args: ["{that}", "{arguments}.0"]
           }
       }
    });



    fluid.defaults("adam.octopus", {
        gradeNames: "flock.synth", 
        frequencies : [300,302,303,305,307,308,311,314],
        thesynths: [
            {
                id: "f1",
                ugen: "flock.ugen.sinOsc",
                freq: 300,
                mul: 0.0
            },
            {
                id: "f2",
                ugen: "flock.ugen.sinOsc",
                freq: 302,
                mul: 0.
            },
            {
                id: "f3",
                ugen: "flock.ugen.sinOsc",
                freq: 303,
                mul: 0.
            },
            {
                id: "f4",
                ugen: "flock.ugen.sinOsc",
                freq: 305,
                mul: 0.
            },
            {
                id: "f5",
                ugen: "flock.ugen.sinOsc",
                freq: 307,
                mul: 0.
            },
            {
                id: "f6",
                ugen: "flock.ugen.sinOsc",
                freq: 308,
                mul: 0.
            },
            {
                id: "f7",
                ugen: "flock.ugen.sinOsc",
                freq: 311,
                mul: 0.
            },
            {
                id: "f8",
                ugen: "flock.ugen.sinOsc",
                freq: 314,
                mul: 0.
            }
        ],
        listeners: {
            onCreate: {
                func: function(that){
                    var numChans = flock.enviro.shared.audioSystem.model.chans;
                    console.log("octopus is under development");
                    /*
                    if (numChans >= 8){
                        return; 
                    }
                    
                    that.optionssynthDef = {
                        id: "sum",
                        ugen : "flock.ugen.sum"
                    }

                    if (numChans === 2){
                        var leftchan = [];
                        var rightchan = [];
                        var thing = {
                            ugen: "flock.ugen.sinOsc",
                            mul: 0
                        };

                        for (var i = 0; i < 8; i++){
                            thing.id = "f" + (i+1);
                            thing.freq = that.options.freqs[i];
                            (i % 2 == 0) ? leftchan.push(thing) : rightchan.push(thing);
                        }
                        that.set("sum.sources", [leftchan, rightchan] );
                        return;
                    }
                    if ( numChans === 4){
                        var frontleft = [];
                        var frontright = [];
                        var rearleft = [];
                        var rearright = [];

                        return;
                    }
                    console.log(" uh oh - octopus needs help");
                    */
                },
                args: ["{that}"]

            }
        },
        dynamicComponents: {
            /*
            synthDef: {
                func: function(){
                }
            }
            */
        },
        invokers: {
            scatter: {
                funcName: "adam.octopus.scatterfreqs", 
                args: ["{arguments}.0", "{that}"]
            },
            scatterratio: {
                funcName: "adam.octopus.ratiofader",
                args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
            },
            setallvol: {
                funcName: "adam.octopus.setallvol",
                args: ["{arguments}.0", "{that}"]
            },
            proceed: {
                funcName: "adam.octopus.proceed",
                args: ["{arguments}.0", "{that}"]
            }
        },
        synthDef: [
            {
                id: "f1",
                ugen: "flock.ugen.sinOsc",
                freq: 300,
                mul: 0.0
            },
            {
                id: "f2",
                ugen: "flock.ugen.sinOsc",
                freq: 302,
                mul: 0.
            },
            {
                id: "f3",
                ugen: "flock.ugen.sinOsc",
                freq: 303,
                mul: 0.
            },
            {
                id: "f4",
                ugen: "flock.ugen.sinOsc",
                freq: 305,
                mul: 0.
            },
            {
                id: "f5",
                ugen: "flock.ugen.sinOsc",
                freq: 307,
                mul: 0.
            },
            {
                id: "f6",
                ugen: "flock.ugen.sinOsc",
                freq: 308,
                mul: 0.
            },
            {
                id: "f7",
                ugen: "flock.ugen.sinOsc",
                freq: 311,
                mul: 0.
            },
            {
                id: "f8",
                ugen: "flock.ugen.sinOsc",
                freq: 314,
                mul: 0.
            }
        ]
    });

    adam.octopus.scatterfreqs = function(t, that){
        var that = that;
        var freqs = [];
        for (var i = 0 ; i<  8; i++){
            //octopus.set("f"+(i+1)+".freq", Math.random() * 1000);
            freqs[i] = (typeof  that.get("f"+(i+1)+".freq") !== 'object') ? that.get("f"+(i+1)+".freq"): that.get("f"+(i+1)+".freq.end");
        }
        //console.log(freqs);
        t  = t || 10;
        //console.log(t);
        freqs.sort(function(){return .5 - Math.random()})
        //console.log(freqs);
        for ( var i = 0 ; i < 8; i++){
            //var temp = Math.floor(Math.random() * freqs.length);
            var x = freqs.pop();
            var yy = (typeof  that.get("f"+(i+1)+".freq") !== 'object') ? that.get("f"+(i+1)+".freq"): that.get("f"+(i+1)+".freq.end");
            var xx = {ugen:"flock.ugen.line", start: yy, end:x, duration: t};
            console.log(xx);
            that.set("f"+(i+1)+".freq", xx);
        }
    };

    adam.octopus.ratiofader = function (v,r,t,that){
        var that = that;
        t = t || 1;
        for ( var i = 0; i < 8; i++){
            var yy = (typeof  that.get("f"+(i+1)+".freq") !== 'object') ? that.get("f"+(i+1)+".freq"): that.get("f"+(i+1)+".freq.end");
            var xx = {ugen:"flock.ugen.line", start: yy, end:v, duration: t};
            that.set("f"+(i+1)+".freq", xx);
            v *= r;
            console.log( that.get("f"+(i+1)+".freq"));
        }
    };

    adam.octopus.setallvol = function(v, that){
        var that = that;
        if ( v instanceof Array){
            if (v.length === 8){
                for (var i = 0; i < 8; i++){
                    that.set( "f" + (i+1)+".mul", adam.dbtorms(v[i]) );
                }
            } 
            return;
        }
        if ( typeof v === "number"){
            for (var i = 0 ; i < 8; i++){
                that.set( "f" + (i+1)+".mul", adam.dbtorms(v) );
            }
            return;
        }
        if (typeof v === "object"){
            console.log("it's an object and not an array");
            return;
        }
    };

    adam.octopus.proceed = function(index, that){
        if (index === undefined){
            index = 1;
        }
        var temp = [];
        for (var i = 0; i < 8; i++){
            temp[i]  = that.get("f" + (i+1) + ".freq");
        }
        for (var i = 0; i < 8; i++){
            that.set("f" + ( i+1) + ".freq", temp[(i+index)%8]);
        }
    };

    // from hexapod
    fluid.defaults("adam.stereoclick", {
        gradeNames: "flock.synth", 
        invokers: {
            split: {
                funcName: "adam.stereoclick.split", 
                args: ["{that}"]
            },
            slide: {
                funcName: "adam.stereoclick.slide",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            splitsimple: {
                func: "{that}.set",
                args: ["cr.source.phase", 0.5]
            }
        },
        synthDef: [
        {
            id: "cl",
            ugen: "flock.ugen.filter.biquad.lp",
            freq: {
                ugen: "flock.ugen.sinOsc",
                freq: 0.2, 
                add: 5000, 
                mul: 1200,
            },
            source: {
                ugen: "flock.ugen.impulse",
                freq: 3,
            }
        },
        {
            id: "cr",
            ugen: "flock.ugen.filter.biquad.lp",
            freq: {
                ugen: "flock.ugen.sinOsc",
                add: 4000, 
                mul: 1000, 
                freq: 0.25
            }, 
            source: {
                ugen: "flock.ugen.impulse",
                freq: 3,
            }
        } 
        ]
    });
    adam.stereoclick.split = function(that){
        that.set("cr.source.phase", 0.5);
    }
    
    adam.stereoclick.slide = function(that, start, end, duration){
        var d = duration || 10;
        var e = end || 0.5;
        var s = start || 0;

        var liner = {
            "ugen" : "flock.ugen.line",
            "duration" : d,
            "start" : s,
            "end" : e 
        };
        console.log(liner);
        that.set("cr.source.phase", liner);
    }
    
    // new overriding     
    /*
    fluid.defaults("adam.superstereoclick", {
        gradeNames: ['adam.stereoclick'] ,
        invokers : {
            splitsimple: {
                args: ["cr.source.phase", 0.1] 
             }
        }
    });
    */
    // TODO make this more random...  functiongenerator then randomize freq?
    fluid.defaults("adam.bass.randomstereo", {
        gradeNames: "flock.synth", 
            synthDef: [{
                ugen: "flock.ugen.square",
                id: "tester",
                freq: {
                    ugen: "flock.ugen.lfNoise",
                    freq: 0.25,
                    mul: 20,
                    add: 30
                },
                mul: {
                    ugen: "flock.ugen.envGen",
                    envelope: {
                        type: "flock.envelope.sin",
                        duration: 2
                    },
                    gate: {
                        ugen: "flock.ugen.lfPulse",
                        width: 0.5,
                        freq: 0.25
                    }
                }
            },
            {
                ugen: "flock.ugen.saw",
                id: "tester",
                freq: {
                    ugen: "flock.ugen.lfNoise",
                    freq: 0.25,
                    mul: 20,
                    add: 30
                },
                mul: {
                    ugen: "flock.ugen.envGen",
                    envelope: {
                        type: "flock.envelope.sin",
                        duration: 2
                    },
                    gate: {
                        ugen: "flock.ugen.lfPulse",
                        width: 0.5,
                        freq: 0.25
                    }
                }
            }
            ]
    });

    fluid.defaults("adam.lowgranny", {
    gradeNames: "flock.synth", 
       synthDef: {
           ugen: "flock.ugen.granulator",
           numGrains: {
               ugen: "flock.ugen.lfSaw",
               freq: 0.17283,
               add: 20,
               mul: 19
           },
           grainDur: {
               ugen: "flock.ugen.lfSaw",
               add: 0.5,
               mul: 0.4,
               freq: 0.0184
           },
           delayDur: 8,
           mul: 0.5,
           source: {
               ugen: "flock.ugen.filter.biquad.lp",
               q: 2,
               freq: {
                   ugen: "flock.ugen.sin",
                   rate: "control",
                   freq: {
                       ugen: "flock.ugen.lfSaw",
                       add: 500,
                       mul: 200,
                       freq: 0.018214124
                   },
                   phase: 0,
                   mul: 1000,
                   add: 2000
               },
               source: {
                   ugen: "flock.ugen.lfSaw",
                   freq: {
                       ugen: "flock.ugen.sin",
                       freq: 0.08263,
                       mul: 100,
                       add: 300,
                   },
                   mul: 0.25
               }
           }
       }
    });

    fluid.defaults("adam.bass.stereodistortionphasing", {
        gradeNames: "flock.synth", 
        synthDef: [{
                ugen: "flock.ugen.distortion.deJonge",
                amount: {
                    ugen: "flock.ugen.sin",
                    mul: 99,
                    add: 100,
                    freq: 0.1,
                },
                source: {
                    ugen: "flock.ugen.sawOsc",
                    freq: {
                        ugen: "flock.ugen.sin",
                        add: 45, 
                        freq: .25
                    }, 
                    mul: 0.01
                }
            },
            {
                ugen: "flock.ugen.distortion.deJonge",
                amount: {
                    ugen: "flock.ugen.sin",
                    mul: 49,
                    add: 50,
                    freq: 0.11,
                },
                source: {
                    ugen: "flock.ugen.sawOsc",
                    freq: 45.3456, 
                    mul: 0.01
                }   
            }]
    });

    ///////////////////////////////
    /// samplers
    ///////////////////////////////

    fluid.defaults("adam.sampler.simple", {
        gradeNames: ["flock.synth"],
        bufferUrl: "fluid.mustBeOverridden",
        synthDef:{
            ugen: "flock.ugen.playBuffer",
            id: "sample",
            buffer:{
                url: "{that}.options.bufferUrl"
            },
            start: 0,
            loop: 0,
            trigger:{
                ugen: "flock.ugen.valueChangeTrigger",
                source: 0
            }
        },
        invokers: {
            noteOn:{
                func: function(that, vol = 1){
                    that.set({
                        "sample.mul": vol,
                        "sample.trigger.source": 1
                    });
                },
                args: ["{that}", "{arguments}.0"]
            },
            ripple: {
                func: "{that}.set",
                args: ["sample.mul", { ugen: "flock.ugen.squareOsc", add: 0.5, mul: 0.5, freq: 5 }]
            }
        }
    });


    fluid.defaults("adam.sampler.looper", {
        // figure out how to extend to this way
        //gradeNames: "adam.sampler.simple", 
        gradeNames: "flock.synth",
        bufferUrl: "fluid.mustBeOverridden",
        loop: 1, 
        synthDef: {
            id: "sample",
            ugen: "flock.ugen.playBuffer",
            buffer: {
                url: "{that}.options.bufferUrl"
            },
            loop: "{that}.options.loop",
            mul: 0,
            start: 0,
            end: 1,
        },
        model: {
            fadein: {
                ugen: "flock.ugen.line",
                start: 0, 
                end: 1, 
                duration: 30
            },
            fadeout: {
                ugen: "flock.ugen.line",
                start: 1, 
                end: 0, 
                duration: 30
            }
        },
        invokers: {
            fadein: {
                func: "{that}.set",
                args: ["sample.mul",  "{that}.model.fadein"]
            },
            fadeout: {
                func: "{that}.set",
                args: ["sample.mul",  "{that}.model.fadeout"]
            }
        }
    });

    fluid.defaults("adam.sampler.bufferBand", {
        gradeNames: "flock.band",
        components: {
            grandrone: {
                type: "adam.bufferPlayingSynth",
                options: {
                    bufferUrl: "grandrone.wav"
                }
            },
            freezer: {
                type: "adam.bufferPlayingSynth",
                options: {
                    bufferUrl: "freezer.wav"
                }
            },
            newdrone: {
                type: "adam.bufferPlayingSynth", 
                options: {
                    bufferUrl: "newdrone.wav"
                }
            },
            cymbal: {
                type: "adam.bufferPlayingSynth", 
                options: {
                    bufferUrl: "cymballike.wav"
                }
            }
        }
    });

    fluid.defaults("adam.noiser", {
        gradeNames: "flock.synth", 
        synthDef: {
            id: "noiser",
            ugen: "flock.ugen.whiteNoise",    
            mul: 0.05,
            options: {
                numOutputs: 1,
                bus: 1
            }
        }
    });


    fluid.defaults("adam.glitchseq", {
        gradeNames: "flock.synth", 
        model: {
            beat: 0,
            beatinc: 1,
            glitches: {
                expander: {
                    func: function(that){
                        var g = [];
                        for(var i = 1; i < 9; i++){
                            g.push( flock.synth({
                                synthDef:{
                                    ugen: "flock.ugen.playBuffer",
                                    buffer: {
                                        url: "glitchseq/beat" + i + ".wav"
                                    },
                                    trigger: {
                                        id: "trig",
                                        ugen: "flock.ugen.valueChangeTrigger"
                                    }
                                }
                            }));
                            g[i-1].prob = 1;
                        }
                        return g;
                    },
                    args: ["{that}"]
                }
            },
            pushmapping: {
                buttons: []
            }
        },
        synthDef: {
            ugen: "flock.ugen.triggerCallback",
            trigger: {
                id: "pulse",
                ugen: "flock.ugen.impulse",
                freq: 4
            },
            options: {
                callback: {
                    func: function(that){
                        that.events.beat.fire(that.model.beat);
                        //console.log("kjfklajfd");
                        if (that.model.glitches[that.model.beat].prob > Math.random()){
                            that.model.glitches[that.model.beat].set("trig.source", 1);
                        }
                        that.model.beat += that.model.beatinc;
                        that.model.beat = that.model.beat % that.model.glitches.length;
                    },
                    args: ["{that}"]
                }
            }
        },
        /*
         * this namespace is a problem, why?
        listeners: {
            noteOn: {
                function: function(that, msg){
                    console.log();
                },
                args: ["{that}", "{arguments.0"]
            }
        },
        */
        events: {
            beat: null,
        },
        invokers:{
            scatter: {
                func: function(that){
                    that.model.glitches.sort(function(){return .5 - Math.random()});
                },
                args: ["{that}"]
            },
            randProb: {
                func: function(that){
                    for( var i = 0; i < that.model.glitches.length; i++){
                        that.model.glitches[i].prob = Math.random();
                    }
                },
                args: ["{that}"]
            },
            setProb: {
                func: function(that, prob, step=-1){
                    if (step > -1){
                        that.model.glitches[step].prob = prob;
                    }else{
                        for( var i = 0; i < that.model.glitches.length; i++){
                            that.model.glitches[i].prob = prob;
                        }
                    }
                },
                args: ["{that}", "{arguments}.0", "{arguments}.1" ]
            }
        }
    });

    fluid.defaults("adam.windingwaves", {
        gradeNames: "flock.synth",
        synthDef: [{
        ugen: "flock.ugen.sinOsc",
        freq: {
            ugen: "flock.ugen.lfNoise",
                add: 310,
                mul: {
                    ugen: "flock.ugen.sin",
                    add: 200,
                    mul: 100,
                    freq: 0.1
                }
            },
            mul: 0.25
        },
        {
            ugen: "flock.ugen.sinOsc",
            freq: {
                ugen: "flock.ugen.lfNoise",
                add: 340,
                mul: {
                    ugen: "flock.ugen.sin",
                    add: 200,
                    mul: 130,
                    freq: 0.2
                }
            },
            mul: 0.25
        }]      
    });



    fluid.defaults("adam.alternatingwaves", {
        gradeNames: "flock.synth",
            synthDef: {
            ugen: "flock.ugen.sum",
            sources: [
            {
                ugen: "flock.ugen.distortion.tanh",
                source: {
                    ugen: "flock.ugen.sinOsc", 
                    freq: 500,
                    mul: {
                        ugen: "flock.ugen.asr",
                        attack: 0.1,
                        sustain: 0.1,
                        release: 0.1,
                        mul: 2,
                        gate: {
                            ugen: "flock.ugen.impulse",
                            rate: "control",
                            freq: 0.7,
                            phase: 0
                        
                        }
                    }
                } 
            }, 
            {
                ugen: "flock.ugen.sinOsc", 
                freq: 600,
                mul: {
                    ugen: "flock.ugen.asr",
                    attack: 0.1,
                    sustain: 0.1,
                    release: 0.1,
                    mul: 2,
                    gate: {
                        ugen: "flock.ugen.impulse",
                        rate: "control",
                        freq: 0.7,
                        phase: 0.5
                    }
                }
            }] 
        }
    });    

    fluid.defaults("adam.noiseSynth", {
        gradeNames: "flock.synth",
        
        freq: 300,
        
        synthDef: {
            ugen: "flock.ugen.sum",
            sources: {
                ugen: "flock.ugen.filter.biquad.bp",
                freq: "{that}.options.freq",
                q: 10,
                source: {
                    ugen: "flock.ugen.whiteNoise"
                }
            }
        }
    });

    // help from colin clark
    // https://gist.github.com/colinbdclark/ff036ffb9b79a5ddb27c199aec09f8ff
    // https://gist.github.com/colinbdclark/1cec7c0fb1e66ac3cc1cb3936340b31f
    fluid.defaults("adam.noiseBand", {
        gradeNames: "flock.band",
        
        numFreqBands: 10,
        bandFreqMul: 100,
        baseFreq: 300,
        
        noiseFrequencies: {
            expander: {
                funcName: "adam.noiseBand.generateFrequencies",
                args: [
                    "{that}.options.numFreqBands",
                    "{that}.options.bandFreqMul",
                    "{that}.options.baseFreq"
                ]
            }
        },
        
        dynamicComponents: {
            noiseSynth: {
                sources: "{that}.options.noiseFrequencies",
                type: "adam.noiseSynth",
                options: {
                    freq: "{source}"
                }
            }
        }
    });

    adam.noiseBand.generateFrequencies = function (numFreqBands, bandFreqMul, baseFreq) {
        return fluid.generate(numFreqBands, function (i) {
            return (bandFreqMul * i) + baseFreq;
        }, true);
    };



    fluid.defaults("adam.triglidepan", {
        gradeNames: "flock.synth",
        synthDef : {
            id: "gibble",
            ugen: "flock.ugen.pan2",
            pan : {
                ugen: "flock.ugen.sin",
                freq: {
                    ugen: "flock.ugen.sin",
                    freq: 0.1,
                    add: 2,
                    mul: {
                        ugen:"flock.ugen.line",
                        start: 0,
                        end: 1.9,
                        duration: 60              
                    }
                }
            }, 
            source : {
                ugen: "flock.ugen.triOsc",
                freq: {
                    ugen: "flock.ugen.line",
                    start: 60,
                    end: 100, 
                    duration: 60
                },
                mul: 0.25
            }
        }
    });


    ////////
    // New Style
    ////////
    fluid.defaults("adam.synth", {
        gradeNames: "flock.synth",
        bus: 0, 
        synthDef: {
            ugen: "flock.ugen.out",
            bus: "{that}.options.bus",
            expand: "{that}.options.chans", 
            mul: {
                id: "env",
                ugen: "flock.ugen.asr",
                start: 0,
                attack: 0.1,
                sustain: 0.25, 
                release: 0.5
            }

        }
    });

    // not quite working...
    // how to use buses in flocking
    // https://gist.github.com/colinbdclark/0bd443589eec51d0756bff736e6c346d
    // multichannel chord 
    // https://gist.github.com/colinbdclark/483e5f1befd882b29869e39bc973cfd4
    fluid.defaults("adam.effectsbus", {
        gradeNames: "flock.synth", 
        bus : {
            expander: {
                func: function(){
                    ///// bad idea
                    return flock.environment.busManager.acquireNextBus("interconnect");
                }
            }
        },
        addToEnvironment: "tail",
        synthDef: {
            id: "freebird",
            ugen: "flock.ugen.freeverb",
            source: {
                ugen: "flock.ugen.in",
                bus: "{that}.options.bus",
            }
        } 
    });

    // working great
    fluid.defaults("adam.testsinesynth", {
        gradeNames: "adam.synth",
        chans: 1,
        synthDef: {
            sources: [
                {
                    ugen: "flock.ugen.sinOsc",
                    freq: 500,
                }
            ]
        }
    });

    adam.freqtoms = function(f){ return (1/f) * 1000 };
    adam.mstofreq = function(ms){ return (1/ms) * 1000 };

    /**
     ** Implementation from LODASH
     ** The base implementation of `_.clamp` which doesn't coerce arguments.
     **
     ** @private
     ** @param {number} number The number to clamp.
     ** @param {number} [lower] The lower bound.
     ** @param {number} upper The upper bound.
     ** @returns {number} Returns the clamped number.
     **/
    adam.clamp = function (number, lower, upper) {
        if (number === number) {
            if (upper !== undefined) {
                number = number <= upper ? number : upper;
            }
            if (lower !== undefined) {
                number = number >= lower ? number : lower;
            }
        }
        return number;
    }

    adam.dbtoa = function(val) { 
        return Math.pow(10,val/20); 
    };

    adam.scale = function (in_min, in_max, out_min, out_max) {
        return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    };

    //// adapted from STD.dbtorms in ChucK
    // maps 0-100db input to 0-1 rms output, useful for MIDI velocity mapping
    adam.dbtorms = function (val){
        var logten = Math.log(10);
        return  (val<=0)? 0: Math.exp( (logten * 0.05) * (val-100));
    };

    adam.makeline = function(start, end, duration = 10, name){
        var theline = {
            ugen: "flock.ugen.line",
            start: start,
            end: end, 
            dur: duration
        };
        if(name !== undefined){
            theline.id = name;
        }
        return theline;
    };

    // detect node.js environement
    if (typeof module !== 'undefined' && module.exports) {
        fluid.module.register("adam", __dirname, require);
        module.exports = adam;
    }
})();


///////////////////
// TODO
///////////////////

//////////
//  Synth Buses
//////////
// ideally this is automatic-ish

//////////
// Array of Synths
//////////
///
/*
var chansynths = [];

for ( var i = 0 ; i < flock.enviro.shared.audioSystem.model.chans; i++){
    chansynths.push({ugen: "flock.ugen.sinOsc", mul: 0.0});
    chansynths[i].freq = 440 + (i*5); 
    chansynths[i].id = Number(i).toString();
}

var synths = flock.synth({
    synthDef: chansynths    
});


*/

/*
// stolen from colin clark
var s = flock.synth({
    synthDef: {
        ugen: "flock.ugen.sin",
        id: "tester",
        expand: 6,
        freq: {
            ugen: "flock.ugen.lfNoise",
            freq: 1,
            mul: 180,
            add: 180
        },
        mul: {
            ugen: "flock.ugen.envGen",
            envelope: {
                type: "flock.envelope.sin",
                duration: 0.5
            },
            gate: {
                ugen: "flock.ugen.lfPulse",
                width: 0.5,
                freq: 1
            }
        }
    }
});

s.play();
*/

