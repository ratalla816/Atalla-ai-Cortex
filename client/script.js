

import bot from './assets/robot.png'
import user from './assets/blueUser.png'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

// create the loading animation \\
let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        element.textContent += '.';

        // reset if the loading indicator reaches three dots \\
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

// Atalla ai types response one letter a time so it looks cool \\
function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// create a unique ID for each response so it can be mapped over otherwise text will work on every element \\
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chat background \\
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chat background \\
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // keep scrolling down as the bot types \\
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div \\
    const messageDiv = document.getElementById(uniqueId)

    // // activate loader "..." \\
    loader(messageDiv)

    // Fetch data from server (Bot response)
    const response = await fetch('https://atalla-ai.onrender.com/', {
        // ('http://localhost:5000',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = '';

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "You broke it..."
        alert(err);
    }
}

form.addEventListener('submit', handleSubmit)

// When the enter key is pressed it will call the callback function
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) // 13 is the enter key
     {
        handleSubmit(e)
    }
})