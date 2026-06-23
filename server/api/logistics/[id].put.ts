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
    const currentRecord = await prisma.deliveryRecord.findUnique({ where: { id: Number(id) } })
    if (!currentRecord) throw createError({ statusCode: 404, statusMessage: 'Not found' })

    const dataToUpdate: any = {}
    if (body.type !== undefined) dataToUpdate.type = body.type
    if (body.senderName !== undefined) dataToUpdate.senderName = body.senderName
    if (body.receiverName !== undefined) dataToUpdate.receiverName = body.receiverName
    if (body.quantity !== undefined) dataToUpdate.quantity = Number(body.quantity)
    if (body.emptyQuantity !== undefined) {
      dataToUpdate.emptyQuantity = body.emptyQuantity !== null && body.emptyQuantity !== '' ? Number(body.emptyQuantity) : null
    }
    if (body.uploadedQuantity !== undefined) {
      dataToUpdate.uploadedQuantity = body.uploadedQuantity !== null && body.uploadedQuantity !== '' ? Number(body.uploadedQuantity) : null
    }

    const finalEmpty = dataToUpdate.emptyQuantity !== undefined ? dataToUpdate.emptyQuantity : currentRecord.emptyQuantity
    const finalUploaded = dataToUpdate.uploadedQuantity !== undefined ? dataToUpdate.uploadedQuantity : currentRecord.uploadedQuantity

    if (finalEmpty !== null && finalUploaded !== null) {
      dataToUpdate.status = 'Completed'
    } else {
      dataToUpdate.status = 'Pending'
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
