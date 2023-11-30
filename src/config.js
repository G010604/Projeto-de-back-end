module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'seuSegredoJWT',
    mongoURI: process.env.MONGO_URI || 'mongodb+srv://guyuusuke:twq22222@videogames.owmvyts.mongodb.net/?retryWrites=true&w=majority',
  };