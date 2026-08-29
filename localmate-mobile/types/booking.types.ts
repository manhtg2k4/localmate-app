export type BookingStatus =
  'PENDING' | 'CONFIRMED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type BookingType = 'HOURLY' | 'DAILY';

export interface Booking {
  _id: string;
  touristId: any;
  guideId: any;
  locationId?: any;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  type: BookingType;
  basePrice: number;
  platformFee: number;
  totalAmount: number;
  status: BookingStatus;
  specialRequests?: string;
  cancelReason?: string;
  expiresAt: string;
  createdAt: string;
}

export interface CreateBookingData {
  guideId: string;
  locationId?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  type: BookingType;
  specialRequests?: string;
}
