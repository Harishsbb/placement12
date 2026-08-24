import app from './app';

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Placement Quest Server] Running on http://localhost:${PORT}`);
  });
}

export default app;
