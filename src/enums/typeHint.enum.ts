export enum TypeHint {
  // Pricing & Promotions
  COLD_SALE = "cold_sale", // Limited-time sale or special discount
  HOT_DEAL = "hot_deal", // High-demand or flash sale

  // Product Origin & Nature
  IMPORTED = "imported", // Imported content or material
  LOCAL = "local", // Locally sourced content

  // Content Highlights
  STATIC = "static", // Permanent, non-changing content
  BEST_SELLERS = "best_sellers", // Top-selling books/resources
  MOST_VIEWED = "most_viewed", // Popular by view count
  EDITOR_PICK = "editor_pick", // Recommended by editors/admins
  NEW_ARRIVAL = "new_arrival", // Recently added
  TRENDING = "trending", // Currently popular

  // Special Categories for a Library
  FEATURED_AUTHOR = "featured_author", // Highlighting a specific author
  RECOMMENDED_FOR_YOU = "recommended_for_you", // Personalized picks
  LIMITED_EDITION = "limited_edition", // Exclusive or rare resources
}
