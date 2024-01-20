import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
// import { Configuration, OpenAIApi } from 'openai'
import OpenAI from 'openai'

dotenv.config()

// const configuration = new Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// const openai = new OpenAIApi(configuration);

// initialize express \\
const app = express()

// middleware that allows us to make cross origin requests \\
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Nothing stops this train - Nothing!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // const response = await openai.createCompletion
    const response = await openai.completions.create({
        
        // code example from the openai website \\ 
        model: "gpt-3.5-turbo-instruct",
        // model: "text-davinci-003", // select one of the AI models from the openai website - this one handles text as well as code
      prompt: `${prompt}`,
      temperature: 2, // Higher numbers could generate responses that are nonsense. Low numbers typically mean more concise and accurate responses. 
      max_tokens: 3000, // Determines the length of the response
      top_p: 1, // like temperature but uses a process called nucleus sampling, lower values should lead to higher quality responses. 
      frequency_penalty: 0.5, // should be between -2.0 and 2.0. Higher positive values decrease the likelihood of repeating the same answers.
      presence_penalty: 1, // should be between -2.0 and 2.0. Higher positive values increase the likelihood of talking about new topics.
    });

    res.status(200).send({
    //   bot: response.data.choices[0].text
    bot: response.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'You broke it..');
  }
})

app.listen(5000, () => console.log('server started on http://localhost:5000'))


