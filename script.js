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
// Like button logic
function likeMinistry(button) {
  const countSpan = button.querySelector('.like-count');
  let count = parseInt(countSpan.textContent);
  count++;
  countSpan.textContent = count;
}

// Share button logic
function shareMinistry(ministryName) {
  const shareText = `Check out the ${ministryName} at Jesus Recreation Church! Visit our website for more.`;
  if (navigator.share) {
    navigator.share({
      title: `${ministryName} - JRC`,
      text: shareText,
      url: window.location.href
    }).catch((err) => console.log('Share failed:', err));
  } else {
    alert('Sharing is not supported in your browser.');
  }
}

// Fetch YouTube view count (mock/demo)
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.ministry-card');
  cards.forEach(card => {
    const viewsEl = card.querySelector('.views');
    // Replace this mock number with real API logic if needed
    viewsEl.textContent = Math.floor(Math.random() * 1000) + 100;
  });
});
function toggleChatbot() {
  const chatbot = document.getElementById("chatbot");
  chatbot.style.display = (chatbot.style.display === "none" || chatbot.style.display === "") ? "flex" : "none";
}

// Send message and add it to chat window
function sendMessage() {
  const messageInput = document.getElementById("chat-input");
  const messageText = messageInput.value.trim();
  
  if (messageText !== "") {
      const messageContainer = document.querySelector(".messages");
      
      // Create a new message element
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.textContent = messageText;
      messageContainer.appendChild(messageElement);
      
      // Scroll to the bottom
      messageContainer.scrollTop = messageContainer.scrollHeight;
      
      // Clear the input field
      messageInput.value = "";
      
      // Example: Auto-reply (can be replaced with actual chatbot logic)
      setTimeout(() => {
          const replyElement = document.createElement("div");
          replyElement.classList.add("message");
          replyElement.textContent = "Thanks for your message! We'll get back to you soon.";
          messageContainer.appendChild(replyElement);
          messageContainer.scrollTop = messageContainer.scrollHeight;
      }, 1000);
  }
}

// Prevent form submission
document.getElementById("chat-input").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
  }
});
// Send message to the server
async function sendMessage() {
  const messageInput = document.getElementById("chat-input");
  const messageText = messageInput.value.trim();

  if (messageText !== "") {
      const messageContainer = document.querySelector(".messages");

      // Create a new message element
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.textContent = messageText;
      messageContainer.appendChild(messageElement);

      // Scroll to the bottom
      messageContainer.scrollTop = messageContainer.scrollHeight;

      // Clear the input field
      messageInput.value = "";

      try {
          // Send the user's message to the backend (your Node.js server)
          const response = await fetch("http://localhost:3000/chat", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ message: messageText }),
          });

          const data = await response.json();

          // Display the chatbot's response
          const replyElement = document.createElement("div");
          replyElement.classList.add("message");
          replyElement.textContent = data.message;
          messageContainer.appendChild(replyElement);

          // Scroll to the bottom again
          messageContainer.scrollTop = messageContainer.scrollHeight;
      } catch (error) {
          console.error("Error sending message:", error);
      }
  }
}
// Initialize EmailJS
(function() {
  emailjs.init("y-kqJPw-TARRB_NCh");
})();
document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();
  emailjs.sendForm('service_pesipu', 'template_pesipu', this)
    .then(function(response) {
      alert('Message sent successfully!');
      document.getElementById('contact-form').reset();
    }, function(error) {
      alert('Failed to send message. Please try again!');
    });
});
function selectService(serviceName) {
  document.getElementById('service').value = serviceName;
  document.getElementById('service-form').style.display = 'block';
}
const hasPendingEvents = true; // Example condition

  const eventAlert = document.querySelector('.event-alert');
  if (!hasPendingEvents) {
    eventAlert.style.display = 'none';
  }


