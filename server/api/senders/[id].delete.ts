import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing ID'
    })
  }

  try {
    const deletedSender = await prisma.sender.delete({
      where: { id: Number(id) }
    })
    return deletedSender
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error deleting sender'
    })
  }
})
