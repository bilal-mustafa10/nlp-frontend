// A page that contains a form for the user to input a question and a topic
// and a button to submit the question to the backend
// Also speech recognition is implemented here to allow the user to speak
// their question instead of typing it

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {styled, useTheme} from "@mui/material/styles";
import { Link, Container, Typography, Divider, Stack, Button } from "@mui/material";
import useResponsive from "../hooks/useResponsive";
import Logo from "../components/logo";


const StyledRoot = styled("div")(({ theme }) => ({
    [theme.breakpoints.up("md")]: {
        display: "flex",
    },
}));

// text input for the question
const StyledSection = styled("div")(({ theme }) => ({
    width: "100%",
    maxWidth: 480,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));


// button to submit the question
const StyledContent = styled("div")(({ theme }) => ({
    maxWidth: 480,
    margin: "auto",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(12, 0),
}));

// speech recognition
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

// button to start and stop speech recognition
const SpeechRecognitionButton = () => {
    const [isListening, setIsListening] = useState(false);
    const [note, setNote] = useState(null);
    const [savedNotes, setSavedNotes] = useState([]);

    const handleListen = () => {
        if (isListening) {
            mic.stop();
            mic.onend = () => {
                console.log("Stopped Mic on Click");
                setIsListening(false);
            };
        } else {
            mic.start();
            mic.onend = () => {
                console.log("Mic on Click");
                setIsListening(true);
            };
        }

        mic.onstart = () => {
            console.log("Mics on");
        };

        mic.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join("");
            console.log(transcript);
            setNote(transcript);

            mic.onerror = (event) => {
                console.log(event.error);
            };
        };
    };
    // if

    const handleSaveNote = () => {
        setSavedNotes([...savedNotes, note]);
        setNote("");
    };

    return (
        <div>
            <button onClick={handleListen} type="button">
                {isListening ? "Stop" : "Start"}
            </button>
            <p>{note}</p>
            <button onClick={handleSaveNote} type="button">
                Save Note
            </button>
            {savedNotes.map((n) => (
                <p key={n}>{n}</p>
            ))}
        </div>
    );

};


export default function Question() {
    const theme = useTheme();
    const isDesktop = useResponsive("up", "md");

    return (
        <>
            <Helmet>
                <title> Question | NLP Hackathon </title>
            </Helmet>

            <StyledRoot>
                <StyledSection>
                    <Container maxWidth="sm">
                        <Stack spacing={3} sx={{ mb: 5 }}>
                            <Logo />
                            <Typography variant="h3" gutterBottom>
                                Question
                            </Typography>
                            <Typography sx={{ color: "text.secondary" }}>
                                Enter a question and a topic to get the answer
                            </Typography>
                        </Stack>

                        <Stack spacing={3}>
                            <Typography variant="h6" gutterBottom>
                                Question
                            </Typography>
                            <TextField
                                fullWidth
                                label="Question"
                                name="question"
                                size="small"
                                type="text"
                                variant="outlined"
                            />
                        </Stack>

                        <Stack spacing={3}>
                            <Typography variant="h6" gutterBottom>
                                Topic
                            </Typography>
                            <TextField
                                fullWidth
                                label="Topic"
                                name="topic"
                                size="small"
                                type="text"
                                variant="outlined"
                            />
                        </Stack>

                        <Stack spacing={3}>
                            <Typography variant="h6" gutterBottom>
                                Speech Recognition
                            </Typography>
                            <SpeechRecognitionButton />
                        </Stack>

                        <Stack spacing={3}>
                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Submit
                            </Button>
                        </Stack>

                    </Container>
                </StyledSection>
            </StyledRoot>
        </>
    );
}

