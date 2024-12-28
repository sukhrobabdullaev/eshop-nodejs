// Helper function for responses
const sendResponse = (res, statusCode, success, data = null, message = null) => {
    res.status(statusCode).json({ success, data, message });
  };
  
module.exports = sendResponse;