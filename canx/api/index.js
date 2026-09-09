'use strict';

// Vercel serverless entry point: every non-static request is rewritten here
// (see vercel.json) and handled by the same Express app as `npm start`.
module.exports = require('../server');
