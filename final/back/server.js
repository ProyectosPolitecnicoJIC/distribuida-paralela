const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store active games and players
const games = new Map();
const players = new Map();

// Sample word lists for the word search game
const wordLists = [
    ['PERRO', 'GATO', 'RATON', 'CONEJO', 'HAMSTER'],
    ['MANZANA', 'PERA', 'PLATANO', 'NARANJA', 'UVA'],
    ['ROJO', 'AZUL', 'VERDE', 'AMARILLO', 'NEGRO'],
    ['SOL', 'LUNA', 'ESTRELLA', 'NUBE', 'LLUVIA']
];

// Function to generate a random word list
function getRandomWordList() {
    const list = wordLists[Math.floor(Math.random() * wordLists.length)];
    console.log('Generated word list:', list);
    return list;
}

// Function to create a new game
function createGame(playerName) {
    const gameId = Date.now().toString();
    const game = {
        id: gameId,
        playerName: playerName,
        words: getRandomWordList(),
        foundWords: new Set(),
        startTime: new Date()
    };
    games.set(gameId, game);
    console.log('Created new game:', game);
    return game;
}

wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    let currentPlayer = null;
    let currentGame = null;

    ws.on('message', (message) => {
        console.log('Received message:', message.toString());
        const data = JSON.parse(message);

        switch (data.type) {
            case 'join':
                console.log('Player joining:', data.playerName);
                // Handle player joining
                currentPlayer = data.playerName;
                currentGame = createGame(currentPlayer);
                players.set(ws, { playerName: currentPlayer, gameId: currentGame.id });
                
                // Send initial game data
                const gameStartMessage = {
                    type: 'gameStart',
                    gameId: currentGame.id,
                    words: currentGame.words
                };
                console.log('Sending game start message:', gameStartMessage);
                ws.send(JSON.stringify(gameStartMessage));

                // Broadcast updated game list to all clients
                broadcastGameList();
                break;

            case 'wordFound':
                console.log('Word found:', data.word);
                // Handle found word
                if (currentGame && currentGame.words.includes(data.word)) {
                    currentGame.foundWords.add(data.word);
                    const wordFoundMessage = {
                        type: 'wordFound',
                        word: data.word,
                        foundWords: Array.from(currentGame.foundWords)
                    };
                    console.log('Sending word found message:', wordFoundMessage);
                    ws.send(JSON.stringify(wordFoundMessage));
                    broadcastGameList();
                }
                break;

            case 'newGame':
                console.log('New game requested by:', currentPlayer);
                // Handle new game request
                if (currentPlayer) {
                    currentGame = createGame(currentPlayer);
                    players.set(ws, { playerName: currentPlayer, gameId: currentGame.id });
                    
                    const newGameMessage = {
                        type: 'gameStart',
                        gameId: currentGame.id,
                        words: currentGame.words
                    };
                    console.log('Sending new game message:', newGameMessage);
                    ws.send(JSON.stringify(newGameMessage));

                    broadcastGameList();
                }
                break;
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
        if (currentGame) {
            console.log('Cleaning up game:', currentGame.id);
            games.delete(currentGame.id);
            players.delete(ws);
            broadcastGameList();
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Function to broadcast game list to all connected clients
function broadcastGameList() {
    const gameList = Array.from(games.values()).map(game => ({
        id: game.id,
        playerName: game.playerName,
        foundWords: Array.from(game.foundWords).length,
        totalWords: game.words.length
    }));

    console.log('Broadcasting game list:', gameList);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'gameList',
                games: gameList
            }));
        }
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 