
// Function to type text with animation
function typeWriterEffect(element, text, speed = 50) {
    let index = 0;
    element.value = ''; // Clear existing text
    element.focus();

    const type = () => {
        if (index < text.length) {
            element.value += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    };
    type();
}

// Function to highlight the field with a gray shadow
function highlightField(element) {
    element.style.boxShadow = "0 0 10px gray";
    setTimeout(() => {
        element.style.boxShadow = "none"; // Remove highlight after 2 seconds
    }, 2000);
}

// Function to initialize speech recognition
document.getElementById('bingoButton').addEventListener('click', function() {
    if ('webkitSpeechRecognition' in window) {
        const bingoButton = document.getElementById('bingoButton');
        //const status = document.getElementById('status');
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = true;

        let isListening = bingoButton.classList.contains('listening');

        if (!isListening) {
            // Start listening
            recognition.start();
            bingoButton.classList.add('listening');
            bingoButton.style.backgroundColor = 'red';
            //status.textContent = "Listening... Say 'Bingo' or click the button to stop.";
        } else {
            // Stop listening
            recognition.stop();
            bingoButton.classList.remove('listening');
            bingoButton.style.backgroundColor = '#007BFF'; // Change back to blue
            //status.textContent = "Speech recognition stopped.";
        }

        recognition.onresult = function(event) {
            const speechResult = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            console.log('User said:', speechResult);

            // Iterate through the fieldMapping and fill the corresponding fields
            for (const label in fieldMapping) {
                if (speechResult.includes(`${label} is`)) {
                    const value = speechResult.replace(`${label} is`, '').trim();
                    const field = document.getElementById(fieldMapping[label]);

                    if (field) {
                        highlightField(field); // Highlight the field
                        typeWriterEffect(field, value); // Typewriter effect to fill the field
                    }
                }
            }

            if (speechResult === 'bingo') {
                recognition.stop();
                bingoButton.classList.remove('listening');
                bingoButton.style.backgroundColor = '#007BFF'; // Change back to blue
                //status.textContent = "Speech recognition stopped.";
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            console.error("Error occurred while recognizing speech. Please try again.");
            //status.textContent = "Error occurred. Please try again.";
        };

        recognition.onend = function() {
            if (bingoButton.classList.contains('listening')) {
                recognition.start(); // Restart listening if not stopped
            }
        };
    } else {
        console.error('Your browser does not support speech recognition.');
    }
});
