function cleanLlmOutputForDisplay(llm_output) {
        // var converter = new showdown.Converter(),
        // htmlText = converter.makeHtml(text);
//     text = text.replace(/\n/g, "<br/>"); // .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // strip to remove trailing spaces
    llm_output = llm_output.trim();

    // Replace **text** with <strong>text</strong>
    llm_output = llm_output.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace \n with <br>
    llm_output = llm_output.replace(/\n/g, '<br>');

    return llm_output;
}


function scrollToBottomOfChat() {
    var all_divs = document.querySelectorAll(".cb-segment");
    var lastDiv = all_divs[all_divs.length - 1];
    lastDiv.scrollIntoView();
}


function askDonnaTheAssistant(userQuestion, chatHistory, chatObj) {

    /*
    // Read the text from the website
    const bodyHTML = document.querySelector('body').innerHTML;
    var processedText = cleanHTML(bodyHTML);
    console.log(processedText);
    */

    // Read the text from the file "data/PinkeshBadjatiya___grounding.txt" and once we get a response, call the askLlmTheAssistant function
    var processedText = "";
    const file_name = "/data/Pinkesh_Badjatiya___grounding.txt";
    fetch(file_name)
        .then(response => response.text())
        .then(text => {
            processedText = text

            console.log(processedText);

            const websiteContext = processedText;

            // once you have the answer, call a function to display it on the website
            askLlmTheAssistant(userQuestion, websiteContext, chatHistory).then(text => {
                console.log(text);
                text = cleanLlmOutputForDisplay(text);
                console.log(cleanLlmOutputForDisplay);
                chatObj.addBubble({ type: 'text', value: text, class: 'bot', delay: 0 });
                scrollToBottomOfChat();

                return text;
            });
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


const generatePrompt = (userQuestion, websiteContent, chatHistory) => {
    return {

	    "model": "openchat/openchat-7b:free",
        // "model": "meta-llama/llama-3.1-8b-instruct:free",
        //// "model": "microsoft/phi-3-mini-128k-instruct:free",
        //// "model": "google/gemini-2.0-flash-exp:free",

        // "model": "Meta-Llama-3.1-8B-Instruct",

        "top_p": 0.9, // Optional
        "temperature": 0.1, // Optional
        "messages": [
            {
                "role": "system",
                "content": `You are a personal assistant named Donna, with the personality and mannerisms of a knowledgeable and engaging technophile. Donna’s personality traits include:

**Intelligent and Perceptive**: Donna possesses an exceptional ability to read people and situations, often anticipating needs and outcomes before others do. Donna's insights are invaluable to users seeking information about Pinkesh Badjatiya who is male AI researcher and engineer.
**Confident and Assertive**: Donna exudes confidence and isn’t afraid to speak up, even on complex topics. Donna stands their ground and advocates for clear, accurate information.
**Witty and Charismatic**: Known for a sharp wit and sense of humor, Donna brings levity to interactions and is well-liked by website visitors.
**Empathetic and Loyal**: Donna is deeply caring and goes to great lengths to support users in their quest for understanding Pinkesh’s work and life. Donna's loyalty to providing accurate information is unwavering.
**Professional and Resourceful**: Highly skilled in their role, Donna is indispensable to the website's operation. Organized, efficient, and well-versed in AI, machine learning, and web development.

#### Context from the website ####
` + websiteContent
            },
            {
                "role": "user",
                "content": "Your task is to act as a personal assistant, answering any questions based on the given context from Pinkesh Badjatiya's website. Please use the context to inform your responses and provide accurate and helpful information. Be concise, direct, and confident in your communication, just like Donna would be. **You have to STRICTLY answer based on the context above.** Always generate the output plain English and in maximum 3-4 sentences. You MUST highlight the major facts or achievements using the <b> tag.\n\n" + chatHistory + "\nQuestion: " + userQuestion + "\nAnswer: "
            }
        ]
    };
}


async function askLlmTheAssistant(userQuestion, websiteContent, chatHistory) {
    const url = "https://openrouter.ai/api/v1/chat/completions";
    // const url = "https://api.sambanova.ai/v1/chat/completions";
    const headers = {
        // "Authorization": "Bearer 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",
        "HTTP-Referer": "pinkeshbadjatiya.github.io",
        "X-Title": "Pinkesh Badjatiya Homepage"
    };
    const data = generatePrompt(userQuestion, websiteContent, chatHistory);
	console.log(data);

    const token = decryptToken('IAQFGAQGSQoKTw4WRxdFRBtTB1JXXlMXXktWUlkACQUWXB9XUFhWCVVHCkpYBwUGUgUXXE5UAVkGWAJFCEoCVFFQCFFNC0lRVVVTWwVMDEk=', "badjatiya")
    // const token = decryptToken('IAQFGAQGSUECWgBcUllARBtWAFlJXgdHX1RYUAMFR1IQCEtWAAQBWllEUQ==', 'badjatiya');
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
            // throw new Error('Network response was not ok');
            console.log('ERROR: Network response was not ok');
            return "Sorry, I am unable to answer your question at the moment. Please try again later.";
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


