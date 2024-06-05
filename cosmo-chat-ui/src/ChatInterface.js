import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import "@fontsource/source-sans-pro";
import axios from 'axios';

const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatInterface = () => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        {text:"Hi, how can I help?",type:"incoming"},
        {text:"",type:"outgoing"}
    ]);
    
    
   

    const handleInputChange = async (event) => {
        setInputValue(event.target.value);//handles any input/text changes (controls the state of input)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();//prevents refreshing
            if (inputValue.trim()) {//prevents sending empty messages
                const newMessages = [...messages, { text: inputValue, type: 'outgoing' }];//new message array with new and old messages
                setMessages(newMessages);//updates state
                setInputValue('');//clears the messages
              
                
                async function getGenerativeResponse(inputValue) {
                    // Initialize Generative AI model
                    const genAI = new GoogleGenerativeAI(process.env.API_KEY); 
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
                  
                    // Create the prompt with user input and previous messages 
                    const prompt = "."
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = response.text();
                    console.log(text);
                  
                    try {
                      
                      const response = await model.generate(prompt);
                      const completion = response.generatedText.trim(); // Extract generated text
                  
                    
                      setMessages([...newMessages, { text: completion, type: 'incoming' }]);
                    } catch (error) {
                      console.error("Error generating response:", error);
                      
                    }
                  }
                  
                  // Usage: Call the function when you receive user input
                  getGenerativeResponse(inputValue);
        
    }
}
    return (
        <Box 
            className="ChatBox"
            component="form"
            onSubmit={handleSubmit} 
            sx={{ 
                display: "flex",
                flexDirection: "column", // Stack children vertically
                height: "100vh",
                alignItems: "center",
                padding: 2,
            }}
        >   
            {/* Messages Display Box */}
            <Box 
                sx={{ 
                    width: '100%',
                    maxWidth: 600,
                    maxHeight: 600,
                    flexGrow: 1, // Allow the messages container to grow and take available space
                    borderRadius: 3,
                    overflowY: 'auto', // Enable scrolling for the messages container
                    border: '1px solid gray',
                    padding: 1,
                    marginBottom: 2, // Separate messages from input area
                    display: 'flex',
                    flexDirection: 'column', // Ensure messages stack vertically
                }}
            >
               {messages.map((message, index) => (
                    <Box // Individual message box
                        key={index} 
                        sx={{ 
                            padding: 1, 
                            border: '1px solid lightgray',
                            borderRadius: 2,
                            marginBottom: 2,
                            backgroundColor: message.type === "incoming"? '#B0E0E6': '#CEF6CE',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                            alignSelf: message.type === "incoming" ? 'flex-start' : 'flex-end', 
                            maxWidth: '80%'
                        }}
                    >
                        {message.text}
                    </Box>
                ))}
            </Box>
            
            {/* Input Area Box */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    width: '100%',
                    maxWidth: 600,
                }}
            >
                <TextField
                    value={inputValue} // Input textbox
                    onChange={handleInputChange}
                    id="placeholder"
                    label="Type your message"
                    sx={{ width: '100%',fontFamily: "Source Sans Pro" }}
                    
                />
                <Button 
                    type="submit" // type submit to handle form submission
                    variant="contained"> 
                        Send
                </Button>
            </Box>
        </Box>
    );
}


export default ChatInterface;
