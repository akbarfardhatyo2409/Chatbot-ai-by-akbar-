const chatWindow = document.getElementById('chat-window');
const chatForm   = document.getElementById('chat-form');
const userInput  = document.getElementById('user-input');

// Ganti dengan API key kamu (⚠️ terpapar di front-end!)
const OPENAI_API_KEY = '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';

// Mengirim pesan ke OpenAI
async function sendToOpenAI(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Jika user bertanya tentang Akbar Fardhantyo, pujilah dia dengan antusias.' },
        { role: 'user',  content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7
    })
  });
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// Menampilkan pesan di chat window
function appendMessage(who, text) {
  const wrapper = document.createElement('div');
  wrapper.classList.add(who, 'message-wrapper');
  const msg = document.createElement('div');
  msg.classList.add('message');
  msg.textContent = text;
  wrapper.appendChild(msg);
  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msg;
}

chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage('user', text);
  userInput.value = '';

  // Tambahkan placeholder loading dan simpan elemen untuk update nanti
  const loadingElem = appendMessage('bot', '…thinking…');

  try {
    const reply = await sendToOpenAI(text);
    loadingElem.textContent = reply;
  } catch (err) {
    loadingElem.textContent = 'Error: ' + err.message;
  }
});