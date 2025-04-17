
import { BookingProvider } from '@/context/BookingContext';
import BookingContainer from '@/components/BookingContainer';

const Index = () => {
  return (
    <BookingProvider>
      <BookingContainer />
    </BookingProvider>
  );
};

export default Index;
