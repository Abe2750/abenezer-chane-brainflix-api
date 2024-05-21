const express = require('express');
const fs = require('fs');
const {v4:uuidv4} = require('uuid'); //npm install uuid
const app = express();
const cors = require('cors');
require('dotenv').config();



app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.get('/videos', (req, res) => {
    fs.readFile('./data/videos.json', 'utf8', (err, data) => {
        if(err) {
            res.status(500).send('Internal server error');
        } else {
            res.status(200).send(data);
        }
    });
});



app.get('/videos/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./data/videos.json', 'utf8', (err, data) => {
        if(err) {
            res.status(500).send('Internal server error');
        } else {
            const videos = JSON.parse(data);
            const video = videos.find(video => video.id === id);
            if(video) {
                res.status(200).send(video);
            } else {
                res.status(404).send('Video not found');
            }
        }
    });
});


app.post('/videos', (req, res) => {
    const newVideo = req.body;
    newVideo.id = uuidv4();
    fs.readFile('./data/videos.json', 'utf8', (err, data) => {
        if(err) {
            res.status(500).send('Internal server error');
        } else {
            const videos = JSON.parse(data);
            videos.push(newVideo);
            fs.writeFile('./data/videos.json', JSON.stringify(videos, null, 2), (err) => {
                if(err) {
                    res.status(500).send('Internal server error');
                } else {
                    res.status(201).send(newVideo);
                }
            });
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});