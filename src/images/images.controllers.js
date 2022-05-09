import { Images } from './images.model.js';

export const getMany = async (req, res) => {
  try {
    const createdBy = req.query.createdBy;
    console.log({ createdBy });
    const doc = await Images.find({ createdBy });
    res.status(200).json({ data: doc });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.status(400).end();
  }
};

export const createOne = async (req, res) => {
  try {
    const doc = await Images.create({ ...req.body });
    res.status(201).json({ data: doc });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.status(400).end();
  }
};
