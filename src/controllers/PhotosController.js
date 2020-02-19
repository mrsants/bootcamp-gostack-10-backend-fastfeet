import Photos from '../models/Photos';

class PhotoController {
  /**
   * @method store
   * @param {*} req
   * @param {*} res
   * @returns {Object} { id, name, email }
   * @description Método responsável por criar um arquivo.
   */
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await Photos.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new PhotoController();
