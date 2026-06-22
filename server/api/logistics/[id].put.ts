import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id || body.emptyQuantity === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing ID or emptyQuantity'
    })
  }

  try {
    const updatedRecord = await prisma.deliveryRecord.update({
      where: { id: Number(id) },
      data: {
        emptyQuantity: Number(body.emptyQuantity),
        status: 'Completed'
      }
    })
    return updatedRecord
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating logistics record'
    })
  }
})
