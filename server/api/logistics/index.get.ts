import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  try {
    let logistics;
    if (query.status) {
      logistics = await prisma.deliveryRecord.findMany({
        where: { status: String(query.status) },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      logistics = await prisma.deliveryRecord.findMany({
        orderBy: { createdAt: 'desc' }
      })
    }
    return logistics
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching logistics data'
    })
  }
})
