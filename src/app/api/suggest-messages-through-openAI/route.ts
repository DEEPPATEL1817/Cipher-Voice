// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const runtime = 'edge';

// export async function POST() {
//   try {
//     const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     const completion = await openai.completions.create({
//       model: 'gpt-3.5-turbo-instruct',
//       prompt,
//       max_tokens: 300,
//       temperature: 0.7,
//     });


//     // console.log(result.choices[0].message));

//     return Response.json({ 
//       completion: completion.choices[0].text 
//     });

//   } catch (error) {
//     console.error('OpenAI API error:', error);
//     return Response.json(
//       { error: 'Failed to generate suggestions' },
//       { status: 500 }
//     );
//   }
// }
export const runtime = 'edge';


import { CohereClient } from 'cohere-ai';
import { NextResponse } from 'next/server';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || ''
});

export async function POST() {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.Return only three open-ended questions, separated by '||'. No introductions, no numbering, no quotation marks. Output format must be:Question 1||Question 2||Question 3.
    Do not include anything else in the response.`;

    const response = await cohere.generate({
      model: 'command-light',
      prompt,
      maxTokens: 100,
    });

    let generatedText = response.generations[0].text.trim();

    const questionsArray = generatedText.split('?').map(q => q.trim()).filter(Boolean);
    generatedText = questionsArray.slice(0, 3).map(q => q + '?').join('||');


    const finalOutput = generatedText.split('||').slice(0, 3).join('||');

    return NextResponse.json({
      completion: finalOutput
    });
  } catch (error) {
    console.error('Cohere API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}