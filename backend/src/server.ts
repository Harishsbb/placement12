import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Placement Quest Server] Running on http://localhost:${PORT}`);
});
