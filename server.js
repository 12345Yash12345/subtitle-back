const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, "video.mp4");
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

app.post('/upload', upload.single('video'), (req, res) => {
  debugger;
  try {
    // console.log("sub path >>>", path.join(__dirname, 'public/uploads/subtitles.vtt'))
    // if (!req.file || !req.file.buffer) {
    //   console.log('Invalid video file. No file or buffer found.');
    //   return res.status(400).json({ error: 'Invalid video file.' });
    // }

    const subtitlesString = req.body.subtitles;

    // Parse the subtitles JSON
    const subtitles = JSON.parse(subtitlesString);

    // // Save subtitles as an SRT file
    // const srtContent = generateSRT(subtitles);
    // console.log('Generated SRT Content:', srtContent);
    console.log("sub path >>>", path.join(__dirname, './public/uploads/subtitles.vtt'))
    fs.writeFileSync(path.join(__dirname, './public/uploads/subtitles.vtt'), subtitles);

    res.json({ message: 'Video and subtitles received successfully.' });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Serve subtitles file
app.get('/captions', (req, res) => {
  const captionsPath = path.join(__dirname, './public/uploads/subtitles.vtt');

  // Check if the file exists
  if (fs.existsSync(captionsPath)) {
    res.header('Content-Type', 'text/vtt');
    res.sendFile(captionsPath);
  } else {
    res.status(404).send('Captions file not found');
  }
});


// app.get('/subtitles/:filename', (req, res) => {
//   try {
//     const filename = req.params.filename;
//     const srtFilePath = `uploads/${filename}.srt`;

//     // Read the subtitles file
//     const srtContent = fs.readFileSync(srtFilePath, 'utf-8');

//     // Parse the subtitles content if needed
//     // For simplicity, we are sending the raw content for demonstration purposes
//     res.json({ subtitles: srtContent });
//   } catch (error) {
//     console.error('Error retrieving subtitles:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
