// Contact Form Message
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('✅ Your message has been sent successfully!');
  this.reset();
});

const axios = require('axios');

// Step 1: Obtain OAuth2 token (with Consumer Key and Secret)
async function getToken() {
  const credentials = Buffer.from('YourConsumerKey:YourConsumerSecret').toString('base64');
  
  const tokenResponse = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${credentials}`,
    }
  });

  return tokenResponse.data.access_token;
}

// Step 2: Perform STK Push Request
async function performStkPush() {
  const token = await getToken();

  const stkData = {
    BusinessShortCode: "174379",
    Password: "Base64EncodedPassword", // Base64 encode (Shortcode + Passkey + Timestamp)
    Timestamp: "YYYYMMDDHHMMSS", // Your current timestamp
    TransactionType: "CustomerPayBillOnline",
    Amount: 100,
    PartyA: "254708374149", // Phone number
    PartyB: "174379",
    PhoneNumber: "254708374149",
    CallBackURL: "https://<your-ngrok-id>.ngrok.io/callback",
    AccountReference: "Donation",
    TransactionDesc: "Support Our Ministry",
  };

  const response = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    stkData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log(response.data);
}
performStkPush();
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

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


