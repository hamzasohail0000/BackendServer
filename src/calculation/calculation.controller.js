import Calculation from './calculation.model.js';

export default async function createOne(req, res) {
    const { input, ipAddress } = req.body;
    const countDocumentsOfIPAddress = await Calculation.countDocuments({ ipAddress });
    if (countDocumentsOfIPAddress === 20) {
        const getLastRecord = await Calculation.find({ ipAddress }).sort({ createdAt: -1 }).limit(1).lean().exec();
        var t1 = new Date();
        var t2 = getLastRecord[0].createdAt
        var dif = (t1.getTime() - t2.getTime()) / 1000;
        if (dif <= 120) {
            return res.status(403).send();
        } else if (dif > 120 && countDocumentsOfIPAddress === 20) {
            await Calculation.remove({ ipAddress });
        }
    }
    const output = eval(input);
    const doc = await Calculation.create({ ipAddress, input, output });
    const allRecords = await Calculation.find({ ipAddress }).sort({ created: -1 }).lean().exec();
    res.status(201).send({ data: allRecords, currentRecord: doc, count: allRecords.length });
}