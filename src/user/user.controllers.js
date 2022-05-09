import { User } from './user.model.js';
import jwt from 'jsonwebtoken';

export const me = (req, res) => {
  res.status(200).json({ data: req.user });
};

// export const getOne = async (req, res) => {
//   try {
//     const doc = await User.findOne({ _id: req.params.id }).lean().exec();

//     if (!doc) {
//       return res.status(400).end();
//     }

//     res.status(200).json({ data: doc });
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.error(e);
//     res.status(400).end();
//   }
// };

// export const getMany = async (req, res) => {
//   try {
//     let docs =
//       req.user.role === 'superadmin'
//         ? User.find({
//             DataBaseName: jwt.jwtverify(req),
//           })
//         : User.find({
//             DataBaseName: jwt.jwtverify(req),
//             role: { $nin: ['superadmin'] },
//           });
//     if (req.query.populate) {
//       docs = docs.populate(req.query.populate);
//     }

//     let findQuery = {};

//     // item related query params
//     if (req.query.name) {
//       findQuery.name = { $regex: `.*${req.query.name}.*`, $options: 'i' };
//     }
//     if (req.query.id) {
//       findQuery._id = req.query.id;
//     }
//     if (req.query.role) {
//       findQuery.role = req.query.role;
//     }
//     if (req.query.changeRequest) {
//       findQuery = { 'changePasswordRequest.isRequest': true, ...findQuery };
//     }
//     if (req.query.filteredFrom || req.query.filteredTo) {
//       findQuery.updatedAt = {};
//       if (req.query.filteredFrom) {
//         findQuery.updatedAt.$gte = new Date(req.query.filteredFrom);
//       }
//       if (req.query.filteredTo) {
//         findQuery.updatedAt.$lte = new Date(req.query.filteredTo);
//       }
//     }
//     if (req.query.createdBy) {
//       findQuery.createdBy = req.query.createdBy;
//     }

//     // order by Clause - this code block implies that the documents will
//     // always be sorted by date - the second clause will be used for secondary sorting
//     // TODO: ensure the index matches primary/secondary indexes correct
//     // - also confirm whether clientUpdateDate is always the first clause in the index for
//     // a complex index
//     // sort clause

//     const orderBy = {};
//     if (req.query.$orderBy) {
//       let orderDir = 1;
//       if (req.query.$orderDir) {
//         orderDir = parseInt(req.query.$orderDir, 10);
//       }
//       orderBy[req.query.$orderBy] = orderDir;
//     } else {
//       orderBy.clientUpdatedAt = -1;
//       orderBy.updatedAt = -1;
//     }

//     // find the total count of documents that match this query without
//     // pagination
//     const totalCount = await docs.countDocuments(findQuery);

//     // skip/pagination related
//     let skipCount = 0;
//     if (req.query.$skip) {
//       skipCount = parseInt(req.query.$skip, 10);
//     }

//     // limit/pagination related clause
//     let limitCount = 10;
//     if (req.query.$top) {
//       limitCount = parseInt(req.query.$top, 10);
//     }

//     let docsFind = docs
//       .find(findQuery)
//       .collation({ locale: 'en' })
//       .sort(orderBy)
//       .skip(skipCount)
//       .limit(limitCount);

//     docsFind = await docsFind.lean().exec();

//     res.status(200).json({ data: docsFind, count: totalCount });
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.error(e);
//     res.status(400).end();
//   }
// };

export const createOne = async (req, res) => {
  const createdBy = req.user._id;
  try {
    const doc = await User.create({ ...req.body, createdBy });
    res.status(201).json({ data: doc });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.status(400).end();
  }
};

export const removeOne = async (req, res) => {
  try {
    const removed = await User.findOneAndRemove({
      _id: req.params.id,
    });

    if (!removed) {
      // eslint-disable-next-line no-console
      console.error('removeOne - !removed');
      return res.status(400).end();
    }

    return res.status(200).json({ data: removed });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.status(400).end();
  }
};

export const newToken = (user) =>
  jwt.sign(
    {
      data: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    },
    'hello123'
  );

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, 'hello123', (err, payload) => {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end();
  }

  const token = bearer.split('Bearer ')[1].trim();
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.status(401).end();
  }
  const user = await User.findById(payload.data.id)
    .select('-password')
    .lean()
    .exec();
  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    return res.status(400).send({ message: 'need email, password and name' });
  }
  const userCheck = await User.findOne({ email: req.body.email })
    .select('email')
    .exec();

  if (userCheck) {
    return res.status(400).send('user already exist');
  }
  try {
    const application = req.body;
    const user = await User.create(application);
    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.status(400).send(e);
  }
};

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' });
  }
  req.body.email = req.body.email.toLowerCase();
  const invalid = { message: 'Invalid email and password combination' };

  try {
    const user = await User.findOne({
      email: req.body.email,
    })
      .select('email password')
      .exec();
    if (!user) {
      return res.status(401).send(invalid);
    }
    const match = await user.checkPassword(req.body.password);
    if (!match) {
      return res.status(401).send(invalid);
    }
    const token = newToken(user);
    return res.status(200).send({ token, user });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.status(500).end();
  }
};
