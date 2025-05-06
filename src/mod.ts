import app from './app.ts';

try {
  const PORT = Number(Deno.env.get('PORT')) || 3000;
  console.log(`Server running on http://localhost:${PORT}`);
  await app.listen({ port: PORT });
} catch (error) {
  console.error('Failed to start server:', error);
}
