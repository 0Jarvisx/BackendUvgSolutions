const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const User = require("../models/User");
const Order = require("../models/Order");
// Inicializa el cliente de SES y SQS
const ses = new SESClient({ region: process.env.AWS_REGION });
const sqs = new SQSClient({ region: process.env.AWS_REGION });

exports.createOrder = async (req, res) => {
  const { userId, statusId, products, total, email } = req.body;

  try {
    // 1. Crear la orden en la base de datos
    console.log(Order)
    const order = await Order.create({
      user_id: userId,
      status_id: statusId,
      total: total,
    });

    // 2. Verificar el stock y actualizarlo
    /* for (const prod of products) {
      const product = await Product.findByPk(prod.product_id);
      if (product.stock >= prod.quantity) {
        product.stock -= prod.quantity;
        await product.save();
      } else {
        return res.status(400).json({ message: "Not enough stock" });
      }
    } */

    // 3. Preparar los datos para enviar a la cola SQS
    const orderData = {
      orderId: order.id,
      userId: userId,
      email: email,
      statusId: statusId,
      total: total,
    };

    const sqsParams = {
      QueueUrl: process.env.SQS_QUEUE_URL, // URL de la cola SQS
      MessageBody: JSON.stringify(orderData), // Convierte el pedido en un string JSON
    };

    // 4. Enviar el mensaje a la cola SQS
    try {
      const sqsResponse = await sqs.send(new SendMessageCommand(sqsParams));
      console.log("Pedido enviado a SQS:", sqsResponse.MessageId);
    } catch (error) {
      console.error("Error al enviar a SQS:", error.message);
      return res.status(500).json({ message: "Error al enviar a la cola SQS" });
    }

    // 5. Responder con la orden creada
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar estado de la orden y enviar notificación por SES
exports.updateOrderStatus = async (req, res) => {
  const { orderId, statusId, userId } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // Actualizar el estado de la orden
    await order.update({ status_id: statusId });

    // Buscar al usuario por ID
    const user = await User.findByPk(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log(user.email);

    // Configurar los parámetros del correo
    const emailParams = {
      Destination: {
        ToAddresses: [user.email], // Correo del usuario
      },
      Message: {
        Body: {
          Text: { Data: `El estado de tu orden ${orderId} ha cambiado a ${statusId}.` },
        },
        Subject: { Data: "Actualización del estado de tu orden" },
      },
      Source: process.env.SES_SOURCE_EMAIL, // Correo electrónico verificado en SES
    };
    console.log(emailParams);
    // Enviar correo a través de SES
    try {
      const data = await ses.send(new SendEmailCommand(emailParams));
      console.log('Correo enviado con cambio de estado:', data.MessageId);
    } catch (error) {
      console.error('Error enviando correo:', error);
    }

    // Enviar la orden actualizada como respuesta
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las órdenes y sus respectivos nombres de cliente
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();

    const ordersWithCustomerName = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findOne({ where: { id: order.user_id } });
        order.dataValues.customerName = user ? user.name : "Unknown";
        return order;
      })
    );
    res.json(ordersWithCustomerName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
