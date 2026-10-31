// Controller handling home and health status business logic
export const getHomeStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to ACADEXA API Server",
    status: "Running smoothly",
    timestamp: new Date().toISOString()
  });
};

export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    service: "ACADEXA Backend API",
    health: "OK",
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage()
  });
};