// Contact Form Message
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('✅ Your message has been sent successfully!');
  this.reset();
});

// PWA Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('✅ Service Worker registered:', reg))
    .catch(err => console.error('❌ SW registration failed:', err));
}
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const consumerKey = "YOUR_CONSUMER_KEY";
const consumerSecret = "YOUR_CONSUMER_SECRET";
const shortcode = "174379"; // Replace with your Paybill/Till number
const passkey = "YOUR_PASSKEY";
const callbackUrl = "https://your-server.com/api/callback";

app.post("/api/stk-push", async (req, res) => {
  const { phone, amount } = req.body;
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  try {
    const { data: auth } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
        }
      }
    );

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone.replace(/^0/, "254"),
        PartyB: shortcode,
        PhoneNumber: phone.replace(/^0/, "254"),
        CallBackURL: callbackUrl,
        AccountReference: "JRC Donation",
        TransactionDesc: "Church donation"
      },
      {
        headers: {
          Authorization: `Bearer ${auth.access_token}`
        }
      }
    );

    res.json({ success: true, data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.json({ success: false, message: "Failed to initiate STK push" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
document.getElementById("mpesaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const amount = document.getElementById("amount").value;

  if (!/^07\d{8}$/.test(phone)) {
    alert("Please enter a valid Kenyan M-Pesa number (e.g., 07XXXXXXXX)");
    return;
  }

  fetch("https://your-server.com/api/stk-push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      phone,
      amount
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("STK Push sent to your phone. Complete payment to donate.");
      } else {
        alert("Payment failed: " + data.message);
      }
    })
    .catch((err) => {
      console.error(err);
      alert("An error occurred while processing your donation.");
    });
});