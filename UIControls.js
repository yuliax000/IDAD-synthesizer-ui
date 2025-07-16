///////// Global definitions

/* Because the inputs are referenced in multiple areas we need to declare them at the top of the file */

let var1Input = document.getElementById("var1Range");
let var2Input = document.getElementById("var2Range");
let var3Input = document.getElementById("var3Range");
let var4Input = document.getElementById("var4Range");

///////// Intro Modal popup

/* find modal */
let introModal = document.getElementById("introDialog");
/* to get the backdrop working we need to open the modal with js */
document.getElementById("introDialog").showModal();
/* find modal close button and add an eventlistener */
document.getElementById("dialogCloseButton").addEventListener("click", () => {
  introModal.close();
});
/* finally we want to initialize the synthesizer when the modal is closed */
/* because this can be through the above button, or by pressing esc, we tie it to the actual close event */
/* the referenced toneInit function is defined in toneSetup.js */
introModal.addEventListener("close", toneInit);



///////// Preset Selection
/* see toneSetup.js for synthPresets array which contains the preset definitions */

/* 
This function takes in one of the objects defined in the synthPresets array, applies its member values to the 
four sliders, then triggers their input events. We could directly set the synth's parameters based on the object,
but this way we can also update the slider's position to reflect the new value
*/
function applyPreset(newPreset){
  /* 
  Below we're setting the value of the range slider element directly with js. We can find the appropriate value 
  in our newPreset object by using dot notation - that is the name of the object followed by a . then the name 
  of the memeber we want to find
  */
  var1Input.value = newPreset.spreadAmount;
  /* 
  Because the range input elements are already updating the synth parameters based on user inputs : see line 
  !!!! update !!!! in toneSetup.js : they won't automatically update when we change their value with js instead.
  To get around this we simulate a user input event as seen below
  */
  var1Input.dispatchEvent(new Event("input"));
  /* Repeat for remaining 3 values */
  var2Input.value = newPreset.tempoFilterFrequencyAmount;
  var2Input.dispatchEvent(new Event("input"));
  var3Input.value = newPreset.delayChanceAmount;
  var3Input.dispatchEvent(new Event("input"));
  var4Input.value = newPreset.volumeDistAmount;
  var4Input.dispatchEvent(new Event("input"));
}

/* Next we want to trigger the above function when one of the radio inputs is clicked */
/* First we find all inputs with class of presetInput and add them to an array */
let presetInputs = Array.from(document.getElementsByClassName("presetInput"));
/* Then we loop through the array and add eventlisteners to each element */
presetInputs.forEach((input) => {
  input.addEventListener("click", (e) => {
    /* find the right preset in synthPresets array based on the input's value */
    let newPreset = synthPresets[e.target.value];
    /* send it to the function */
    applyPreset(newPreset);
  });
});
/* Lastly we want to make sure the default preset is selected when the page is loaded */
/* We set the first radio input to checked */
presetInputs[0].checked = true;
/* And then run the apply preset function using the first preset from synthPresets */
//applyPreset(synthPresets[0]);



///////// Playback Toggle

/* define current playback state as true/false boolean */
let isPlaying = false;
/* find playback toggle button */
let playbackToggleButton = document.querySelector(".playbackToggle");

/* 
Here we're adding an event listener for when the user clicks this button. Because we want two different things 
to happen based on the current state we can use an if else statement based on whether isPlaying is set to true 
or false
*/
playbackToggleButton.addEventListener("click", () => {
  /* 
  Check the state of isPlaying : this way of writing a conditional is a shorthand for writing 
  if(isPlaying === true) : for more information see below
  https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Conditionals
  */
  if(isPlaying){
    /* This block of code will run if the condition on line 93 is true */
    /* pause the playback */
    Tone.Transport.pause();
    /* update the variable storing our current state */
    isPlaying = false;
    /* update the text in our button */
////////// ************************************************************* \\\\\\\\\\
    playbackToggleButton.innerHTML = "play";
    /* then we want to remove our old class and add the new one */
    playbackToggleButton.classList.remove("pause");
    playbackToggleButton.classList.add("play");
  } else {
    /* This block of code will run if the condition on line 93 is false */
    /* the below lines are just the inverse of the true code block */
    Tone.Transport.start();
    isPlaying = true;
////////// ************************************************************* \\\\\\\\\\
    playbackToggleButton.innerHTML = "pause";
    playbackToggleButton.classList.remove("play");
    playbackToggleButton.classList.add("pause");
  }
});



///////// Feedback

/* For volume feedback */
let meterText = document.getElementById("meterOutputText");
let meterCheckInterval = 50;
meter.smoothing = 0.1;
let currentVolume = null;

let volumeCheck = setInterval(() => {
  /* meter defined in toneSetup */
  currentVolume = meter.getValue();
  if(currentVolume < -80) currentVolume = -Infinity;
  meterText.innerHTML = Math.floor(currentVolume);
}, meterCheckInterval);



///////// Variable Sliders

/* 

*/

/* 
Functions called via an event listener automatically receive an event object as their first parameter, which 
in this case we're calling e
*/
function changeVolume(e){
  /* first we find the thing we want from the event, in this case the value of the input it was triggered on */
  let newVolume = e.target.value;
  /* 
  then we set the volume of the synth based on this : this is a Tone.js specific method, run on the synth 
  polySynth which is defined within toneSetup.js 
  */
 polySynth.set({volume: newVolume});
}

/* then we add an eventlister that triggers our function to the appropriate input */
var1Input.addEventListener("input", changeVolume);


function changeSpread(e){
  /* while the range input will give whole numbers we need to convert to int */
  let intValue = Math.floor(e.target.value);
  /* our range input has a range of 0 - 100, but each of the things we want it to affect expect different ranges */
  /* the following four variables take the intValue and convert to those ranges */
  let newCount = clamp(1 + (intValue / 5), 3, 6);
  let newSpread = intValue * 2;
  let newPan = intValue / 50;
  let newHumanize = intValue / 100;
  /* then we take those values and apply them to the synth and effects */
  polySynth.set({
    oscillator : {
      count: newCount,
      spread: newSpread
    }
  });
  autoPanner.set({
    wet: newPan
  });
  part.humanize = newHumanize;
}

var2Input.addEventListener("input", changeSpread);



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let acceptedOscTypes = [
  "fatsine",
	"fatsquare",
	"fatsawtooth",
	"fattriangle"
]

function changeOscillatorType(newOscType){
  /* check to see if parameter matches one of the accepted types in the above array */
  if (acceptedOscTypes.includes(newOscType)){
    polySynth.set({
      oscillator : { type: newOscType }
    });
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let acceptedFilterTypes = [
  "lowpass",
  "highpass",
  "bandpass",
  "notch"
]

function changeFilterType(newFilterType){
  /* check to see if parameter matches one of the accepted types in the above array */
  if (acceptedFilterTypes.includes(newFilterType)){
    filter.set({
      type: newFilterType
    });
  }
}

function changeFilterFreq(newFilterFreq){
  /* check to see if parameter within expected range */
  if ( newFilterFreq >= 0 && newFilterFreq < 10000){
    filter.set({
      frequency: newFilterFreq
    });
  }
}

function changeFilterQ(newFilterQ){
  /* check to see if parameter within expected range */
  if ( newFilterQ >= 0 && newFilterQ < 20){
    filter.Q.value = newFilterQ;
  }
}

//////////////////////// Testing
var4Input.addEventListener("change", e => {
  changeFilterFreq(e.target.value);
})



