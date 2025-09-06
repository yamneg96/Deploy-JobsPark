import Review from '../models/Review.js'
import WorkerProfile from '../models/WorkerProfile.js'

export const updateWorkerRating = async (workerId) => {
  const agg = await Review.aggregate([
    { $match: { worker_id: workerId, status: 'approved' } },
    { $group: {
      _id: '$worker_id',
      avgRating: { $avg: '$rating' },
      count: { $sum: 1 },
      distribution: {
        $push: '$rating'
      }
    }}
  ])

  if (!agg.length) {
    await WorkerProfile.findOneAndUpdate({ user_id: workerId }, { rating: 0 }, { new: true })
    return { avgRating: 0, count: 0 }
  }

  const { avgRating, count } = agg[0]

  // optional: compute counts per star
  const dist = { 1:0,2:0,3:0,4:0,5:0 }
  agg[0].distribution.forEach(r => dist[r] = (dist[r] || 0) + 1)

  await WorkerProfile.findOneAndUpdate(
    { user_id: workerId },
    { rating: Number(avgRating.toFixed(2)), ratingCount: count },
    { new: true }
  )

  return { avgRating, count, distribution: dist }
}
