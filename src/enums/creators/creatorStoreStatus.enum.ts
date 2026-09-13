export enum CreatorStoreStatus {
  /** Store created by the creator, still being set up. Not publicly visible. */
  DRAFT = 'DRAFT',

  /** Creator submitted the store for the platform team to review. */
  PENDING_REVIEW = 'PENDING_REVIEW',

  /** Approved by the platform team, publicly visible and able to sell. */
  ACTIVE = 'ACTIVE',

  /** Reviewed and rejected by the platform team. Creator can edit and resubmit. */
  REJECTED = 'REJECTED',

  /** Temporarily disabled by the platform team (policy violation, disputes, ...). */
  SUSPENDED = 'SUSPENDED',

  /** Closed by the creator themselves. Can be reopened. */
  CLOSED = 'CLOSED',
}

/** Statuses in which the store is visible on the public storefront. */
export const PUBLICLY_VISIBLE_STORE_STATUSES: CreatorStoreStatus[] = [
  CreatorStoreStatus.ACTIVE,
];

/** Statuses from which a creator is allowed to submit the store for review. */
export const SUBMITTABLE_STORE_STATUSES: CreatorStoreStatus[] = [
  CreatorStoreStatus.DRAFT,
  CreatorStoreStatus.REJECTED,
];
