import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reviewId = parseInt(id);
  if (isNaN(reviewId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'approve':
        await db.review.update({
          where: { id: reviewId },
          data: { isVerifiedBooking: true },
        });
        break;
      case 'unverify':
        await db.review.update({
          where: { id: reviewId },
          data: { isVerifiedBooking: false },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reviewId = parseInt(id);
  if (isNaN(reviewId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const review = await db.review.findUnique({
      where: { id: reviewId },
      select: { providerId: true },
    });

    await db.review.delete({ where: { id: reviewId } });

    if (review) {
      const agg = await db.review.aggregate({
        where: { providerId: review.providerId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await db.serviceProvider.update({
        where: { id: review.providerId },
        data: {
          avgRating: agg._avg.rating ?? 0,
          reviewCount: agg._count.rating,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
