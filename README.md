# 🚚 We Want Waste - Skip Hire & Waste Management App

## About the Application

We Want Waste is a comprehensive online platform for booking skip hire and waste management services. The application guides users through a step-by-step booking process to ensure they select the right skip size and service for their needs.

## Project Structure

The application is organized as a multi-step booking process:

1. **Postcode Step**: Enter location details
2. **Waste Type Step**: Select the type of waste for disposal
3. **Skip Size Step**: Choose the appropriate skip size based on waste volume
4. **Permit Check Step**: Determine if a permit is needed for skip placement
5. **Choose Date Step**: Schedule delivery and collection dates
6. **Payment Step**: Review order and complete payment

## Technology Stack

This project is built with:

- **React + TypeScript**: For a robust frontend experience
- **Vite**: For fast development and optimized builds
- **shadcn-ui**: For consistent, accessible UI components
- **Tailwind CSS**: For responsive, utility-first styling
- **Framer Motion**: For smooth animations and transitions
- **date-fns**: For date manipulation and formatting
- **React Router**: For client-side routing
- **React Hook Form**: For form validation

## Getting Started

To run this project locally:

```sh
# Clone the repository
git clone https://github.com/racharya404/we-want-waste.git

# Navigate to the project directory
cd we-want-waste

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:8080

## Development Notes

- The application uses a step-based navigation system with state management through React Context
- All booking data is stored in the `BookingContext`
- The UI is fully responsive and works on mobile devices
- Tooltips provide helpful guidance throughout the booking process
- The progress stepper allows users to track their journey and navigate backward to previous steps
