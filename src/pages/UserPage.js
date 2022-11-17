import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination, TextField, InputAdornment, Divider,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------


export default function UserPage() {
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const getAnswer= async (question, topic) => {
    await fetch("http://127.0.0.1:8000/question/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({question: question, topic: topic})

    }).then((res) => {
      res.json().then((data) => {
        console.log("Data:", data)
        setAnswer(data.answer);
      })
    });
  }


  return(
      <Stack width={'100%'}>
        <Stack margin={2} spacing={5} width={'100%'} direction="row" alignItems="center" justifyContent="flex-start">
          <Stack width={"50%"}>
            <TextField
                value={question}
                onChange={(val) => setQuestion(val.target.value)}
                name="Question"
                label="Question"
                type={'text'}
            />
          </Stack>
          <Typography> --- OR --- </Typography>
          {isListening ?
              <Button variant="contained" onClick={()=>{
                SpeechRecognition.stopListening()
                setQuestion(transcript+'?')
                setIsListening(false)
              }}>
                Stop
              </Button>
              :
              <>
                <Stack direction="row" alignItems="center" justifyContent="center" mb={10} spacing={2}>
                  <Button variant="contained" onClick={() => {
                    setIsListening(true)
                    SpeechRecognition.startListening()
                  }}>
                    Say your question
                  </Button>
                  {transcript &&
                      <Button variant="contained" onClick={() => {
                        resetTranscript()
                        setQuestion('');
                      }}>
                        Reset
                      </Button>
                  }

                </Stack>

              </>


          }
        </Stack>


        <Stack margin={2} spacing={5} width={'50%'}>
          <TextField
              value={topic}
              onChange={(val) => setTopic(val.target.value)}
              name="Topic"
              label="Topic"
              type={'text'}
          />
        </Stack>
        <Stack margin={2}  width={"50%"}>
          <Button variant="contained" onClick={()=>getAnswer(question,topic)}>
            Submit Question
          </Button>
        </Stack>

        {answer !== null &&
            <Stack margin={2}  width={"60%"}>
              <Typography variant="h6" width={'100%'} textAlign={'center'} margin={0}>
                Answer
              </Typography>
              <Typography variant="h7" width={'100%'} textAlign={'center'}>
                {answer}
              </Typography>
            </Stack>

        }
      </Stack>
  );
}
