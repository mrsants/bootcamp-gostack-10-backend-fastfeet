import Mail from '../../lib/Mail';

class NewJobs {
  get key() {
    return 'NewJobs';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Nova Entrega',
      template: 'NewJobs',
      context: {
        deliveryman: delivery.deliveryman.name,
        product: delivery.product,
        name: delivery.recipient.name,
        cep: delivery.recipient.cep,
        number: delivery.recipient.number,
        complement: delivery.recipient.complement
          ? delivery.recipient.complement
          : 'Sem complemento',
      },
    });
  }
}

export default new NewJobs();
