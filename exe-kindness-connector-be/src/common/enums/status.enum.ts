export enum Status_ACTIVE_LOCKED {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
}

export enum Book_Status {
  AVAILABLE = 'AVAILABLE',
  REQUESTED = 'REQUESTED',
  EXCHANGED = 'EXCHANGED',
  HIDDEN = 'HIDDEN',
}

export enum Exchange_Status {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export enum Message_Status {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  SEEN = 'SEEN',
}

export enum Membership_Status {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
}

export enum BookViolation_Status {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}
