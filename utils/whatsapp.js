const Listing = require('../models/Listing');
const axios = require('axios');

// WhatsApp API credentials (from .env)
const WABA_TOKEN = process.env.WABA_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Function to send WhatsApp messages
async function sendWhatsappMessage(to, message) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${WABA_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

// Parse incoming WhatsApp messages
async function parseMessage(text, from) {
  const parts = text.trim().split(' ');
  const command = parts[0].toUpperCase();

  switch (command) {
    case 'SELL':
      const details = parts.slice(1).join(' ').split(',');
      if (details.length < 3) return "Invalid format. Use: SELL name, weight, price";
      
      const [title, weight, price] = details.map(d => d.trim());
      const listing = new Listing({
        title,
        description: `${weight}`,
        startingPrice: parseFloat(price.replace('R', '')),
        status: 'pending'
      });
      await listing.save();
      return `Listing received: ${title} (${weight}) for R${price}. Awaiting approval.`;

    case 'JOIN':
      return `You've joined auction ${parts[1]}. Type BID ${parts[1]} Ramount to place a bid.`;

    case 'BID':
      return `Bid for ${parts[1]} recorded: ${parts[2]}`;

    case 'HELP':
    default:
      return `Commands:\nSELL name, weight, price\nJOIN auction_id\nBID auction_id Ramount`;
  }
}

module.exports = { sendWhatsappMessage, parseMessage };
// Compare this snippet from server.js:
// const express = require('express');