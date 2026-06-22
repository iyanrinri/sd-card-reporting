import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const senders = await prisma.sender.findMany({
      orderBy: { name: 'asc' }
    })
    return senders
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching senders'
    })
  }
})
