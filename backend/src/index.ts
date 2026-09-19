import express from 'express';
import cors from 'cors';
import { processLogs } from './analyzer';
import { ApiLog } from './types';

const app = express();
const PORT = 3000;



app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/analyze', (req, res) => {
  try {
    const logs: ApiLog[] = req.body;

    if (!Array.isArray(logs) || logs.length === 0) {
      res.status(400).json({ error: "No valid JSON log entries provided." });
      return;
    }

    const results = processLogs(logs);

    res.json(results);

  } catch (error: any) {
    console.error(`Error analyzing logs: ${error.message}`);
    res.status(500).json({ error: "Internal server error during analysis." });
  }
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});