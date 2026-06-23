import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing ID'
    })
  }

  try {
    const dataToUpdate: any = {}
    if (body.senderName !== undefined) dataToUpdate.senderName = body.senderName
    if (body.receiverName !== undefined) dataToUpdate.receiverName = body.receiverName
    if (body.quantity !== undefined) dataToUpdate.quantity = Number(body.quantity)
    if (body.emptyQuantity !== undefined) {
      dataToUpdate.emptyQuantity = body.emptyQuantity !== null ? Number(body.emptyQuantity) : null
      dataToUpdate.status = 'Completed'
    }

    const updatedRecord = await prisma.deliveryRecord.update({
      where: { id: Number(id) },
      data: dataToUpdate
    })
    return updatedRecord
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating logistics record'
    })
  }
})
