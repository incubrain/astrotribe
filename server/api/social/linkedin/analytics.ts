import { useLinkedinAnalytics, useServerLogger, useServerError } from '#imports';

const PREFIX = 'social/linkedin/analytics';

export default defineEventHandler(async (event) => {
  const log = useServerLogger(PREFIX);
  const errors = useServerError(PREFIX);

  const { postId } = getQuery(event) as { postId: string };

  log.info(`postId: ${postId}`);

  try {
    const linkedin = useLinkedinAnalytics(postId);
    const postAnalytics = await linkedin.fetchPostAnalytics();
    log.info(postAnalytics);

    return {
      status: 200,
      message: 'Post analytics returned from LinkedIn',
      data: postAnalytics
    };
  } catch (error: any) {
    errors.handleError({
      error,
      devMessage: 'Error fetching LinkedIn analytics',
      userMessage: 'Error fetching LinkedIn analytics'
    });
  }
});
