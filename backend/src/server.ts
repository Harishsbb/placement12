import app from './app';

const PORT = process.env.PORT || 5000;

// Never call app.listen in Vercel / Production Serverless environments
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.VERCEL_ENV) {
  app.listen(PORT, () => {
    console.log(`[Placement Quest Server] Running on http://localhost:${PORT}`);
  });
}

export = app;
