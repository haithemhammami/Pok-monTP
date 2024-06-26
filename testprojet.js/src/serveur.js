const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));

// Initialisez Resend avec le clé d'API 
const resend = new Resend('votre clé');


// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Route pour la page de détails d'un Pokémon
app.get('/pokemon-details.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pokemon-details.html'));
});

// Route pour récupérer la liste des Pokémon
app.get('/pokemon', async (req, res) => {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
    const pokemonList = response.data.results;
    res.json(pokemonList);
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des Pokémon:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la liste des Pokémon' });
  }
});

// Route pour récupérer les détails d'un Pokémon 
app.get('/pokemon/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonDetails = response.data;
    res.json(pokemonDetails);
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails du Pokémon avec l'ID ${id}:`, error);
    res.status(500).json({ error: `Erreur lors de la récupération des détails du Pokémon avec l'ID ${id}` });
  }
});

// Route pour gérer l'envoi d'e-mail 
app.post('/send-email', (req, res) => {
    const { Nom, Prénom, date_de_naissance, Email } = req.body;

  
    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'votre email',
        subject: 'Sujet de l\'e-mail',
        html: `<p>Bonjour ${Prénom} ${Nom},</p>
               <p>Merci pour votre message. Votre date de naissance est ${date_de_naissance}.</p>`
    })
    .then(() => {
        res.sendStatus(200); // Réponse OK si l'e-mail est envoyé avec succès
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        res.status(500).send('Une erreur est survenue lors de l\'envoi de l\'e-mail.');
    });
});


app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});
