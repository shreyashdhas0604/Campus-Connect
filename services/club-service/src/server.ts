import express from 'express';

const app = express();
const port = process.env.PORT || 8083;

// Example endpoint to confirm the service is running
app.get('/', (req, res) => {
  res.send('Club Service is running!');
});

// Start the server and log the port number
app.listen(port, () => {
  console.log(`Club-Service Server started on port ${port}`);
});
 