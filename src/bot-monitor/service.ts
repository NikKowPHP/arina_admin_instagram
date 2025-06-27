import { PrismaClient } from '@prisma/client';
import { Client } from 'instagram-private-api';
import logger from '../lib/logger';

const prisma = new PrismaClient();

export class BotMonitorService {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    // ROO-AUDIT-TAG :: plan-001-comment-monitoring.md :: Keyword matching logic
    async checkCommentsForKeywords(postId: string, keywords: string[]): Promise<string[]> {
        try {
            const post = await this.client.media.info(postId);
            const matchedComments: string[] = [];

            // Get already processed comments for this post
            const processedComments = await prisma.processedComment.findMany({
                where: { postId }
            });
            const processedIds = new Set(processedComments.map(pc => pc.commentId));

            for (const comment of post.items[0].comments) {
                if (processedIds.has(comment.pk)) continue;

                for (const keyword of keywords) {
                    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                    if (regex.test(comment.text)) {
                        matchedComments.push(comment.pk);
                        logger.info(`Keyword "${keyword}" matched in comment: ${comment.text}`);

                        // Log the match to database
                        // ROO-AUDIT-TAG :: plan-001-comment-monitoring.md :: Database logging
                        await prisma.commentMatch.create({
                            data: {
                                commentId: comment.pk,
                                postId,
                                keyword,
                                text: comment.text
                            }
                        });
                        // ROO-AUDIT-TAG :: plan-001-comment-monitoring.md :: END
                        break; // No need to check other keywords for this comment
                    }
                }
            }

            return matchedComments;
        } catch (error) {
            logger.error(`Error checking comments for post ${postId}: ${error.message}`);
            return [];
        }
    }
    // ROO-AUDIT-TAG :: plan-001-comment-monitoring.md :: END
}