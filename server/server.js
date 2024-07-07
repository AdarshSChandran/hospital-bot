const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const json = require('./intents.json');
const intents = json.intents;
const cors = require('cors');

app.use(cors());


// production script
// Serve static files from the Next.js app's export directory
app.use(express.static(path.join(__dirname, '../client/out')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/out', 'index.html'));
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initial intent and fallback counter
let intent = "start";
let fallbackCounter = 0;
let formatFallbackCounter = 0;
let pastDateFallbackCounter = 0;

io.on('connection', (socket) => {
  console.log('connected');

  socket.emit('botmes', "Welcome to the chat! How can I assist you today?");

  socket.on('human', (data) => {
    const input = data.toLowerCase();
    handleInput(socket, input);
  });
});

function handleInput(socket, input) {
  const currentIntent = intents.find(i => i.intent_name === intent);

  // Check if input matches any keywords of the current intent
  if (currentIntent.keywords.length === 0 || currentIntent.keywords.some(keyword => input.includes(keyword))) {
    fallbackCounter = 0; // Reset fallback counter on successful match

    if (currentIntent.intent_name === "date") {
      validateDate(socket, input);
    } else if (currentIntent.intent_name === "time") {
      validateTime(socket, input);
    } else {
      const response = currentIntent.answers[0];
      socket.emit('botmes', response);
      intent = currentIntent.next_expectation;
    }
  } else {
    fallback(socket);
  }
}

// Function to handle fallback logic
function fallback(socket) {
  fallbackCounter++;
  if (fallbackCounter >= 3) {
    fallbackCounter = 0;  // Reset counter
    intent = 'start';  // Reset intent to start
    socket.emit('botmes', "Sorry, I'm having trouble understanding. Let's start over. Hi, This is your Munchen city hospital appointment booking Bot");
  } else {
    socket.emit('botmes', "Sorry, I didn't understand that. Can you please rephrase?");
  }
}

// Specific functions to handle validations for date and time
function validateDate(socket, input) {
  const currentDate = new Date().toISOString().split('T')[0];
  const selectedDate = input.trim();

  if (selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Reset format fallback counter on successful match
    formatFallbackCounter = 0;
    if (selectedDate >= currentDate) {
      intent = 'time';
      pastDateFallbackCounter = 0;  // Reset past date fallback counter on successful match
      socket.emit('botmes', "What time do you want to book the appointment? Mention the time in HH:MM format :)");
    } else {
      pastDateFallbackCounter++;
      if (pastDateFallbackCounter >= 3) {
        pastDateFallbackCounter = 0;  // Reset counter
        fallbackCounter = 0;
        intent = 'start';  // Reset intent to start
        socket.emit('botmes', "Sorry, I'm having trouble understanding. Let's start over. Hi, how can I help you today?");
      } else {
        socket.emit('botmes', 'Please provide a valid date. Date should not be in the past.');
      }
    }
  } else {
    formatFallbackCounter++;
    if (formatFallbackCounter >= 3) {
      formatFallbackCounter = 0;  // Reset counter
      fallbackCounter = 0;
      intent = 'start';  // Reset intent to start
      socket.emit('botmes', "Sorry, I'm having trouble understanding. Let's start over. Hi, how can I help you today?");
    } else {
      socket.emit('botmes', 'Please provide a valid date in the format YYYY-MM-DD.');
    }
  }
}

function validateTime(socket, input) {
  const timeRegex24Hour = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

  console.log("entering then time")
  if (input.match(timeRegex24Hour)) {
    intent = 'resident_munich';
    fallbackCounter = 0;  // Reset fallback counter on successful match
    socket.emit('botmes', "Is the patient a resident of Munich? (yes/no)");
  } else {
    timetimer++;
    if (timetimer >= 3) {
      console.log("Going to restart")
      timetimer = 0;  // Reset counter
      fallbackCounter = 0;
      intent = 'start';  // Reset intent to start
      socket.emit('botmes', "Sorry, I'm having trouble understanding. Let's start over. Hi, how can I help you today?");
    } else {
      console.log("Entering else condition")
      fallbackCounter++;
      socket.emit('botmes', 'Please provide a valid time in 24-hour format (e.g., 13:00).');
    }
  }
}
