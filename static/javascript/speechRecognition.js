// variables
const button = document.getElementById('microphone-button'); // const button is getting html button element
let finalTranscript = '';
let speechTime = 0;
let speechActive = false; // tracking if microphone is recording, defaulted to false
let speech = new webkitSpeechRecognition() || new SpeechRecognition();
speech.continuous = true; // will continue to listen to user
speech.interimResults = false;
speech.lang = 'en-US';

let timerInterval; // store interval timer
let totalSeconds = 0; // store total seconds
let pressCount = 0; // count button presses

speech.onresult = function(event) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
    }
        else{
            finalTranscript += event;
        }}
    // transcription.textContent = finalTranscript; // can be used for debugging, updates the page with the transcription
};

speech.onend = function() {
    if (finalTranscript !== '') {
        // Prepare form data
        let formData = new FormData();
        formData.append('text', finalTranscript);
        formData.append('time', speechTime.toString());

        // Send the complete transcription and the speech time when the speech recognition stops
        fetch('/send_text', {
            method: 'POST',
            body: formData  // Sending as FormData object
        })
            .then(data => console.log(data))
            document.getElementById('next-page-button').style.display = 'inline-block'; // Display the next page button

    }
};

button.onclick = () => {
    pressCount++; // Increment the press count each click
    if (pressCount > 2) {
        button.disabled = true; // Disable the button after two presses
        button.style.backgroundColor = '#424242'; // Change the button color to grey
        button.style.boxShadow = '0px 8px #212121'; // Remove the shadow by setting offsets and blur to 0
        return; // Stop further execution
    }

    if (speechActive) {
        clearInterval(timerInterval); // clear the timer when stop recording
        speech.stop();
        speechTime = totalSeconds;
        button.innerHTML = '<img class = "microphone-image" src="/static/images/microphone.png" alt="microphone image">';

    } else {
        startTimer(); // start the timer when start recording
        speech.start();
        button.innerHTML = '<img class = "stop-image" src="/static/images/stop.png" alt="stop image">';
    }
    speechActive = !speechActive;
};

function startTimer() { // start timer
    totalSeconds = 0;
    timerInterval = setInterval(() => {
        totalSeconds++;
        console.log(totalSeconds);
    }, 1000); // 1000ms = 1s
}