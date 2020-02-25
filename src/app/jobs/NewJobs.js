import Mail from '../../lib/Mail';

class NewJobs {
  get key() {
    return 'NewJobs';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliverymans.name} <${delivery.deliverymans.email}>`,
      subject: 'Entrega Efetuada',
      template: 'NewDelivery'
    });
  }
}

export default new NewJobs();
