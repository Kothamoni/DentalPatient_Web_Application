const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ----------------- CORS -----------------
app.use(cors({
  origin: 'https://dental-patient-web-application.vercel.app', // Vercel frontend URL
  credentials: true
}));

app.use(express.json());

// ----------------- MongoDB Connection -----------------
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected ✅'))
.catch(err => console.error('MongoDB connection error ❌:', err));

// ----------------- Static Files -----------------
app.use('/images', express.static(path.join(__dirname, 'image')));
app.use(express.static(path.join(__dirname, '../front-end')));

// ----------------- API Routes -----------------
app.use('/patients', require('./routes/patient.routes'));
app.use('/advice', require('./routes/advice.routes'));
app.use('/medicines', require('./routes/medicine.routes'));
app.use('/options', require('./routes/options.routes'));
app.use('/reports', require('./routes/report.routes'));
app.use('/', require('./routes/user.routes')); 

// ----------------- Frontend Catch-all -----------------
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end/login.html'));
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
