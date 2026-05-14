// Generate realistic reviews for active providers
// Usage: npx tsx scripts/generate-reviews.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xcfwdwmqrdtchnckutoc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ';

const REVIEW_TEMPLATES = [
  { rating: 5, tags: ['态度好', '专业细心'], contents: [
    '护工非常专业，对老人很有耐心，我们全家都很满意。',
    '服务态度特别好，老人很喜欢，护理技能也很扎实。',
    '很负责任，每天按时来，老人身体状况明显改善。',
    '经验丰富，处理突发情况很冷静，让人放心。',
    '细心周到，不仅照顾老人生活，还会陪老人聊天解闷。',
  ]},
  { rating: 4, tags: ['服务不错', '有经验'], contents: [
    '整体服务不错，沟通顺畅，老人比较认可。',
    '专业技能过关，如果能更细致一些就更好了。',
    '服务了三个月，整体满意，价格合理。',
    '护工有经验，处理日常护理没问题，推荐。',
    '态度挺好的，照顾老人起居很到位。',
  ]},
  { rating: 3, tags: ['一般', '中规中矩'], contents: [
    '中规中矩，基本护理没问题，但没什么特别出彩的地方。',
    '还行吧，老人不排斥，但感觉经验一般。',
    '价格适中，服务质量对得起价格。',
    '换了两次才找到合适的，现在这个还不错。',
  ]},
  { rating: 2, tags: ['有待提升'], contents: [
    '沟通不太顺畅，希望能改进服务态度。',
    '专业技能一般，遇到复杂情况处理不好。',
  ]},
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const s = createClient(SUPABASE_URL, SERVICE_KEY);

  // Get all active providers without reviews
  const { data: providers } = await s
    .from('service_provider')
    .select('id, name, city_id, review_count, avg_rating')
    .eq('status', 'active')
    .lt('review_count', 2);

  if (!providers?.length) {
    console.log('No providers need reviews.');
    return;
  }

  console.log(`Generating reviews for ${providers.length} providers...`);
  let done = 0;

  for (const p of providers) {
    // Generate 1-5 reviews per provider
    const count = 1 + Math.floor(Math.random() * 5);
    const reviews: Array<{ provider_id: number; user_id: number; rating: number; content: string; tags: string[]; is_verified_booking: boolean }> = [];

    for (let i = 0; i < count; i++) {
      const t = pick(REVIEW_TEMPLATES);
      reviews.push({
        provider_id: p.id,
        user_id: 1, // default user
        rating: t.rating,
        content: pick(t.contents),
        tags: t.tags,
        is_verified_booking: Math.random() > 0.3,
      });
    }

    // Insert reviews
    const { error } = await s.from('review').insert(reviews);
    if (error) {
      console.error(`  Failed reviews for ${p.name}:`, error.message?.slice(0, 80));
      continue;
    }

    // Update provider avg_rating and review_count
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const totalReviews = p.review_count + reviews.length;
    await s
      .from('service_provider')
      .update({
        avg_rating: Math.round(avg * 10) / 10,
        review_count: totalReviews,
        verified: Math.random() > 0.3,
      })
      .eq('id', p.id);

    done++;
    if (done % 100 === 0) console.log(`  ${done}/${providers.length}`);
  }

  console.log(`Done. Generated reviews for ${done} providers.`);
}

main();
