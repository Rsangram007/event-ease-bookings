export const bookingLogger = (req, res, next) => {
  const originalSend = res.json;
  res.json = function(data) {
    if (req.method === 'POST' && req.path.includes('/bookings') && data.success !== false) {
      console.log(`[BOOKING] User: ${req.user.name} (${req.user.email}) booked ${req.body.seats} seat(s) for Event ID: ${req.body.event} at ${new Date().toISOString()}`);
    }
    originalSend.call(this, data);
  };
  next();
};
