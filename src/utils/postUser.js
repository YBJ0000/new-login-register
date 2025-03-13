import prisma from '../lib/prisma.js';

export async function postUser(user) {
  try {
    const newUser = await prisma.user.create({
      data: {
        username: user.username,
        password: user.password
      }
    });
    return newUser;
  } catch (error) {
    console.error("postUser error: ", error);
    throw error;
  }
}