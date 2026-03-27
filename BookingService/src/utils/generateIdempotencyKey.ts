import { v4 as uuidv4 } from "uuid";

export function generateIdempotencyKey(): string {
  // Generate a random string as the idempotency key
  return uuidv4();
}

