import bcrypt from "bcrypt";

const hashService = {
    hashPassword: async (password) => await bcrypt.hash(password, 10),
    comparePassword: async (password, hashPassword) => await bcrypt.compare(password, hashPassword)
};

export default hashService;