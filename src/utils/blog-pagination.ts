export const BLOGS_PER_PAGE = 5;

export const getBlogPageCount = (postCount: number) =>
  Math.ceil(postCount / BLOGS_PER_PAGE);