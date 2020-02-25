import Mail from '../../lib/Mail';

class CancelJobs {
  get key() {
    return 'CancelJobs';
  }

  async handle({ data }) {
    const { updatedDelivery, problem } = data;
    await Mail.sendMail({
      to: `${updatedDelivery.deliverymans.name} <${updatedDelivery.deliverymans.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancelDelivery',
      context: {
        product: updatedDelivery.product,
        problem: problem.description,
      },
    });
  }
}

export default new CancelJobs();
