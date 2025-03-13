import prisma from '../lib/prisma.js';

export async function findUserByName(username) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    });
    return user;
  } catch (error) {
    console.error("findUserByName error: ", error);
    throw error;
  }
}