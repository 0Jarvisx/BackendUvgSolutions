const cron = require('node-cron');
const axios = require('axios');


cron.schedule('0 9,21 * * *', () => {
  axios.post('http://localhost:3000/api/subscription/sendEmails')
    .then(response => {
      console.log('Emails sent', response.data);
    })
    .catch(error => {
      console.error('Error sending emails', error);
    });
});
