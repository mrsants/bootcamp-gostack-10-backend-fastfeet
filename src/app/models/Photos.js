import Sequelize, { Model } from 'sequelize';

class Photos extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/photos/${this.path}`;
          },
        },
      },
      {
        sequelize,
      },
    );

    return this;
  }
}

export default Photos;
