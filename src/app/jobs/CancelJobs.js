import Mail from '../../lib/Mail';

class CancelJobs {
  get key() {
    return 'CancelJobs';
  }

  async handle({ data }) {
    const { updatedDelivery, problem } = data;

    await Mail.sendMail({
      to: `${updatedDelivery.deliveryman.name} <${updatedDelivery.deliveryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancelDelivery',
      context: {
        deliveryman: updatedDelivery.deliveryman.name,
        product: updatedDelivery.product,
        name: updatedDelivery.recipient.name,
        cep: updatedDelivery.recipient.cep,
        number: updatedDelivery.recipient.number,
        complement: updatedDelivery.recipient.complement
          ? updatedDelivery.recipient.complement
          : 'Sem complemento',
        problem: problem.description,
      },
    });
  }
}

export default new CancelJobs();
