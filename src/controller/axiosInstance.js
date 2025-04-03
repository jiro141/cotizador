import { OpenAI } from 'openai';  // Importa la librería 'openai'

// Crear una instancia de OpenAI con tu clave de API
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,  // Tu API key de OpenAI desde las variables de entorno
});

// Función para obtener una respuesta de la API de OpenAI
async function getChatCompletion() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',  // El modelo de OpenAI que deseas utilizar
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Write a haiku about recursion in programming.' },
      ],
      store: true,
    });

    // Accedemos a la respuesta y mostramos el resultado
    console.log(completion.choices[0].message.content); // Asegúrate de acceder al contenido de la respuesta
  } catch (error) {
    console.error('Error en la solicitud a OpenAI:', error);
  }
}

// Llamar a la función para obtener la respuesta
getChatCompletion();
