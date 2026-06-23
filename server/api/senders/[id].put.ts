import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing ID or Name'
    })
  }

  try {
    const updatedSender = await prisma.sender.update({
      where: { id: Number(id) },
      data: {
        name: body.name
      }
    })
    return updatedSender
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating sender'
    })
  }
})
