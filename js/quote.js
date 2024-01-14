async function getRandomQuote() {
    const apiUrl = 'https://api.quotefancy.com/random?language=fr';
    const quoteText = document.getElementById('quote-text');
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (response.ok) {
        quoteText.textContent = `${data.text} - ${data.author}`;
      } else {
        console.error(`Erreur de requête: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la citation:', error);
    }
  }
  