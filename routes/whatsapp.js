const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const axios = require('axios');

// Handle incoming messages from WhatsApp
router.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from; // WhatsApp number
    const text = message.text?.body || '';

    const response = await parseMessage(text, from);
    await sendWhatsappMessage(from, response);

    res.sendStatus(200);
  } catch (err) {
    console.error('WhatsApp webhook error:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
