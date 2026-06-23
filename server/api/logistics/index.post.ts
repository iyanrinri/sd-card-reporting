import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.senderName || !body.receiverName || !body.quantity) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  try {
    // Save sender if not exists
    const existingSender = await prisma.sender.findUnique({
      where: { name: body.senderName }
    })
    
    if (!existingSender) {
      await prisma.sender.create({
        data: { name: body.senderName }
      })
    }

    const newRecord = await prisma.deliveryRecord.create({
      data: {
        type: body.type || 'Business',
        senderName: body.senderName,
        receiverName: body.receiverName,
        quantity: Number(body.quantity),
        createdAt: body.date ? new Date(body.date) : new Date(),
        status: 'Pending'
      }
    })
    return newRecord
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating logistics record'
    })
  }
})
