import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.send('1Shift Down API is running');
});

// Import routes
import routes from './routes';
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
