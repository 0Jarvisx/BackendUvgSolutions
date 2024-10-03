const { hashPassword,comparePassword } = require("../jobs/encryptGenerator");
const User = require("../models/User");
const { SESClient, VerifyEmailIdentityCommand } = require('@aws-sdk/client-ses');
require("dotenv").config()
const sesClient = new SESClient({ region: process.env.AWS_REGION });
// Crear usuario
exports.createUser = async (req, res) => {
  console.log("----------hola", req.body);

  try {
    req.body.password = await hashPassword(req.body.password)
    const user = await User.create(req.body);
    await verifyEmail(user.email);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Leer todos los usuarios
exports.getUsers = async (req, res) => {
  console.log('----------holaGET')
  
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Leer un solo usuario
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de usuario
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por su email
    const user = await User.findOne({ where: { email } });

    // 2. Verificar si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 3. Comparar la contraseña
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 4. Autenticar al usuario (puedes generar un token JWT aquí si lo deseas)
    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.rol,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Verificacion del correo en SES
const verifyEmail = async (email) => {
  const params = {
    EmailAddress: email,
  };

  try {
    const data = await sesClient.send(new VerifyEmailIdentityCommand(params));
    console.log('Correo de verificación enviado a ${email}', data);
  } catch (error) {
    console.error('Error verificando el correo:', error);
  }
};