import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    if (query.dateString) {
      // Get all shifts for a specific date
      const shifts = await prisma.shiftSchedule.findMany({
        where: { dateString: String(query.dateString) }
      })
      
      // Also return the default shifts
      const defaults = await prisma.shiftSchedule.findMany({
        where: { dateString: 'default' }
      })

      return { shifts, defaults }
    } else {
      // Get all shifts
      const allShifts = await prisma.shiftSchedule.findMany({
        orderBy: { dateString: 'desc' }
      })
      return allShifts
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching shifts'
    })
  }
})
