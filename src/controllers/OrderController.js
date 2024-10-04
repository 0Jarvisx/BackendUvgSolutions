const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const User = require("../models/User");
const Order = require("../models/Order");

// Inicializa los clientes de SES, SQS y SNS
const ses = new SESClient({ region: process.env.AWS_REGION });
const sqs = new SQSClient({ region: process.env.AWS_REGION });
const sns = new SNSClient({ region: process.env.AWS_REGION });

exports.createOrder = async (req, res) => {
  const { userId, statusId, products, total, email } = req.body;

  try {
    // 1. Crear la orden en la base de datos
    const order = await Order.create({
      user_id: userId,
      status_id: statusId,
      total: total,
    });

    // 2. Preparar los datos para enviar a la cola SQS
    const orderData = {
      orderId: order.id,
      userId: userId,
      email: email,
      statusId: statusId,
      total: total,
    };

    const sqsParams = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(orderData),
    };

    // 3. Enviar el mensaje a la cola SQS
    try {
      const sqsResponse = await sqs.send(new SendMessageCommand(sqsParams));
      console.log("Pedido enviado a SQS:", sqsResponse.MessageId);
    } catch (error) {
      console.error("Error al enviar a SQS:", error.message);
      return res.status(500).json({ message: "Error al enviar a la cola SQS" });
    }

    // 4. Enviar notificación a los clientes usando SNS
    const snsParams = {
      Message:` Su pedido con ID ${order.id} ha sido confirmado.`,
      TopicArn: process.env.SNS_CUSTOMER_TOPIC_ARN,  // ARN del Topic para clientes
    };

    try {
      const snsResponse = await sns.send(new PublishCommand(snsParams));
      console.log("Notificación de confirmación enviada al cliente:", snsResponse.MessageId);
    } catch (error) {
      console.error("Error enviando confirmación al cliente vía SNS:", error.message);
    }

    // 5. Responder con la orden creada
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar estado de la orden y enviar notificación por SES y SNS
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
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Enviar correo de actualización de estado con SES
    const emailParams = {
      Destination: { ToAddresses: [user.email] },
      Message: {
        Body: { Text: { Data: `El estado de tu orden ${orderId} ha cambiado a ${statusId}.` } },
        Subject: { Data: "Actualización del estado de tu orden" },
      },
      Source: process.env.SES_SOURCE_EMAIL,
    };

    try {
      const emailData = await ses.send(new SendEmailCommand(emailParams));
      console.log("Correo enviado con cambio de estado:", emailData.MessageId);
    } catch (error) {
      console.error("Error enviando correo:", error.message);
    }

    // Enviar notificación de estado actualizado al cliente usando SNS
    const snsParams = {
      Message: `El estado de tu orden ${orderId} ha cambiado a ${statusId}.`,
      TopicArn: process.env.SNS_CUSTOMER_TOPIC_ARN,
    };

    try {
      const snsResponse = await sns.send(new PublishCommand(snsParams));
      console.log("Notificación enviada al cliente:", snsResponse.MessageId);
    } catch (error) {
      console.error("Error enviando notificación al cliente vía SNS:", error.message);
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
    res.status(500).json({ error: error.message });
  }
};
