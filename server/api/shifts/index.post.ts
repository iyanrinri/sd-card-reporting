import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.dateString || !body.shiftType || !body.receiverName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  try {
    // Upsert shift schedule
    const shift = await prisma.shiftSchedule.upsert({
      where: {
        dateString_shiftType: {
          dateString: body.dateString,
          shiftType: body.shiftType
        }
      },
      update: {
        receiverName: body.receiverName
      },
      create: {
        dateString: body.dateString,
        shiftType: body.shiftType,
        receiverName: body.receiverName
      }
    })
    return shift
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating shift schedule'
    })
  }
})
