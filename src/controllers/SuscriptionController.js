const User = require('../models/User');
const { ses } = require('../config/aws');

// Envío de correos 2 veces por día
exports.sendEmails = async (req, res) => {
  try {
    const users = await User.findAll();

    for (const user of users) {
      const params = {
        Source: process.env.SES_SOURCE_EMAIL,
        Destination: {
          ToAddresses: [user.email],
        },
        Message: {
          Subject: {
            Data: 'Actualizaciones en E-Commerce',
          },
          Body: {
            Text: {
              Data: `Hola ${user.name}, te notificamos de nuevos productos!`,
            },
          },
        },
      };

      await ses.sendEmail(params).promise();
    }

    res.json({ message: 'Emails Enviado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
