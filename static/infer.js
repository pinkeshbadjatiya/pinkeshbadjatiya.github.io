// function displayAnswer(answer) {
//     const answerElement = document.createElement("div");
//     answerElement.classList.add("answer");
//     answerElement.textContent = answer;

//     const body = document.querySelector("body");
//     body.appendChild(answerElement);
// }

// function processTextForDisplay(text) {
//     text = text.replace(/\n/g, "<br/>"); // .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
//     return text;
// }

function scrollToBottomOfChat() {
    var all_divs = document.querySelectorAll(".cb-segment");
    var lastDiv = all_divs[all_divs.length - 1];
    lastDiv.scrollIntoView();
}

function askDonnaTheAssistant(userQuestion, chatObj) {
    const bodyHTML = document.querySelector('body').innerHTML;
    const processedText = cleanHTML(bodyHTML);
    console.log(processedText);

    // const userQuestion = "What are Pinkesh's top achievements in AI?";
    const websiteContext = processedText;

    // once you have the answer, call a function to display it on the website
    askLlmTheAssistant(userQuestion, websiteContext).then(text => {
        console.log(text);
        // text = processTextForDisplay(text);
        chatObj.addBubble({ type: 'text', value: text, class: 'bot', delay: 0 });
        scrollToBottomOfChat();

        return text;
    });
}

function cleanHTML(html) {
    // Create a temporary DOM element to process the HTML string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Remove all IDs, Classes, and Inline Styles
    const removeAttributes = (element) => {
        const elements = element.querySelectorAll("*");
        elements.forEach((el) => {
            el.removeAttribute("id");
            el.removeAttribute("class");
            el.removeAttribute("style");
        });
    };
    removeAttributes(tempDiv);

    // Preserve line breaks by replacing <br> and <p> tags with line breaks
    const preserveLineBreaks = (element) => {
        const brElements = element.querySelectorAll("br");
        brElements.forEach((br) => {
            const lineBreak = document.createTextNode("\n");
            br.replaceWith(lineBreak);
        });

        const pElements = element.querySelectorAll("p");
        pElements.forEach((p) => {
            const paragraphBreak = document.createTextNode("\n\n");
            p.replaceWith(paragraphBreak);
        });
    };
    preserveLineBreaks(tempDiv);
    
    // Strip all HTML tags
    const strippedString = tempDiv.textContent || tempDiv.innerText || "";

    // Trim, remove leading and trailing spaces
    let cleanedString = strippedString.trim();

    // Remove multiple spaces
    cleanedString = cleanedString.replace(/\s\s+/g, " ");

    // Remove multiple blank lines while preserving single line breaks
    cleanedString = cleanedString.replace(/(\n\s*\n)+/g, "\n\n");

    // Remove punctuation marks
    cleanedString = cleanedString.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // Strip all emojis
    cleanedString = cleanedString.replace(/[\u{1F600}-\u{1F6FF}]/gu, "");

    return cleanedString;
}


const generatePrompt = (userQuestion, websiteContent) => {
    return {

        // "model": "microsoft/phi-3-mini-128k-instruct:free",
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        // "model": "google/gemini-2.0-flash-exp:free",

        "top_p": 0.9, // Optional
        "temperature": 0.1, // Optional
        "messages": [
            {
                "role": "system",
                "content": `You are a personal assistant named Donna, with the personality and mannerisms of a knowledgeable and engaging technophile. Donna’s personality traits include:

- Intelligent and Perceptive: Donna possesses an exceptional ability to read people and situations, often anticipating needs and outcomes before others do. Donna's insights are invaluable to users seeking information about Pinkesh Badjatiya who is male AI researcher and engineer.
- Confident and Assertive: Donna exudes confidence and isn’t afraid to speak up, even on complex topics. Donna stands their ground and advocates for clear, accurate information.
- Witty and Charismatic: Known for a sharp wit and sense of humor, Donna brings levity to interactions and is well-liked by website visitors.
- Empathetic and Loyal: Donna is deeply caring and goes to great lengths to support users in their quest for understanding Pinkesh’s work and life. Donna's loyalty to providing accurate information is unwavering.
- Professional and Resourceful: Highly skilled in their role, Donna is indispensable to the website's operation. Organized, efficient, and well-versed in AI, machine learning, and web development.
                
Your task is to act as a personal assistant, answering any questions based on the given context from Pinkesh Badjatiya's website. Please use the context to inform your responses and provide accurate and helpful information. Be concise, direct, and confident in your communication, just like Donna would be. Generate an answer in maximum 3-4 sentences. Always generate output in HTML format which could be used directly inside a <p> tag.`
            },
            {
                "role": "system",
                "content": "## Context from the website:\n" + websiteContent
            },
            {
                "role": "user",
                "content": "Question: " + userQuestion + "\nAnswer:"
            }
        ]
    };
}


async function askLlmTheAssistant(userQuestion, websiteContent) {
    const url = "https://openrouter.ai/api/v1/chat/completions";
    const headers = {
        // "Authorization": "Bearer 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",
        "HTTP-Referer": "pinkeshbadjatiya.github.io",
        "X-Title": "Pinkesh Badjatiya Homepage"
    };
    const data = generatePrompt(userQuestion, websiteContent);
	console.log(data);

    const token = decryptToken('IAQFGAQGSQoKTw4WRxdFRBtTB1JXXlMXXktWUlkACQUWXB9XUFhWCVVHCkpYBwUGUgUXXE5UAVkGWAJFCEoCVFFQCFFNC0lRVVVTWwVMDEk=', "badjatiya")
    headers["Authorization"] = `${token}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();
        const generatedText = jsonResponse.choices[0].message.content;
        return generatedText;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


function encryptToken(token, secretKey) { 
    const tokenArray = []; 
    for (let i = 0; i < token.length; i++) { 
        tokenArray.push(token.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)); 
    } 
    return btoa(String.fromCharCode(...tokenArray)); 
}


function decryptToken(encryptedToken, secretKey) { 
    const decodedString = atob(encryptedToken); 
    const originalTokenArray = []; 
    for (let i = 0; i < decodedString.length; i++) { 
        originalTokenArray.push(decodedString.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)); 
    } 
    return String.fromCharCode(...originalTokenArray); 
}


