// Catch-all for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Error handler (optional, for other errors)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});