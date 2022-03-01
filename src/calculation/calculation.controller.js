import Calculation from './calculation.model.js';

export default async function createOne(req, res) {
    const { input, ipAddress } = req.body;
    const countDocumentsOfIPAddress = await Calculation.countDocuments({ ipAddress });
    if (countDocumentsOfIPAddress === 4) {
        const getLastRecord = await Calculation.find({ ipAddress }).sort({ createdAt: -1 }).limit(1).lean().exec();
        var t1 = new Date();
        var t2 = getLastRecord[0].createdAt
        var dif = (t1.getTime() - t2.getTime()) / 1000;
        if (dif <= 120) {
            return res.status.send(403);
        } else if (dif > 120 && countDocumentsOfIPAddress === 20) {
            await Calculation.remove({ ipAddress });
        }
    }
    const output = eval(input);
    // const doc = await Calculation.create({ ipAddress, input, output })
    res.status(201).send({ countDocumentsOfIPAddress });
}