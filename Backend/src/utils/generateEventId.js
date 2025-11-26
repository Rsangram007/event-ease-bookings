import { v4 as uuidv4 } from 'uuid';

export const generateEventId = () => {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = now.getFullYear();
  const random = uuidv4().slice(0, 3).toUpperCase();
  return `EVT-${month}${year}-${random}`;
};
