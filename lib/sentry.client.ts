import * as Sentry from "@sentry/nextjs";

// Initialize Sentry on the client side
export function initSentry() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  
  if (!dsn) {
    console.log("Sentry DSN not configured, skipping client initialization");
    return;
  }

  Sentry.init({
    dsn,
    
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: process.env.NODE_ENV === 'development',
    
    replaysOnErrorSampleRate: 1.0,
    
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1,
    
    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
      Sentry.replayIntegration({
        // Additional Replay configuration goes in here, for example:
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Capture unhandled promise rejections
    captureUnhandledRejections: true,
    
    // Set user context when available
    beforeSend(event, hint) {
      // Filter out development errors in production
      if (process.env.NODE_ENV === 'production') {
        // Don't send errors from localhost in production
        if (event.request?.url?.includes('localhost')) {
          return null;
        }
      }
      
      return event;
    },
    
    // Set tags for better filtering
    initialScope: {
      tags: {
        component: 'client',
        environment: process.env.NODE_ENV,
      },
    },
  });
  
  console.log("Sentry client initialized");
}

// Helper function to capture exceptions
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

// Helper function to capture messages
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

// Helper function to set user context
export function setUserContext(user: {
  id: string;
  email?: string;
  role?: string;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

// Helper function to add breadcrumb
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}
