import { findUserByName } from '../utils/getUsers.js';
import bcrypt from 'bcryptjs';
import { genToken } from '../utils/genToken.js';

async function login(req, res) {
  try {
    const {username, password} = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: 'username and password are required',
        code: "2"
      });
    }

    const user = await findUserByName(username);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid username or password',
        code: "1",
        username
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid username or password',
        code: "1",
        username
      });
    }

    const token = genToken({
      username, password
    },
      process.env.TOKEN_EXPIRE_IN || '1h',
    );

    res.status(200).json({
      message: 'Login successful',
      code: "0",
      username,
      token
    });
  } catch (error) {
    console.error("login error: ", error);
    res.status(500).json({
      message: 'Internal server error',
      code: "3"
    });
  }
}

export { login }