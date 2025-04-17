import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

export enum UserAcquisitionMetric {
  SignUpConversion = 'sign_up_conversion',
  Conversion = 'conversion',
  DemoRequest = 'demo_request',
  ContactFormSubmission = 'contact_form_submission',
  FeaturePageEngagement = 'feature_page_engagement',
  BlogTraffic = 'blog_traffic',
}

export enum OnboardingMetric {
  StartRate = 'start_rate',
  StepCompletion = 'step_completion',
  DropOff = 'drop_off',
  CompletionTime = 'completion_time',
}

export enum UserEngagementMetric {
  SessionDuration = 'session_duration',
  ActionsPerSession = 'actions_per_session',
  ContentPerformance = 'content_performance',
  PageViews = 'page_views',
  VisitFrequency = 'visit_frequency',
  FeatureAdoption = 'feature_adoption',
}

export enum ContentPerformanceMetric {
  ArticleView = 'article_view',
  ReadTime = 'read_time',
  Share = 'share',
  Like = 'like',
  Comment = 'comment',
}

export enum JobMarketMetric {
  JobListing = 'job_listing',
  JobView = 'job_view',
  JobApplication = 'job_application',
  CompanyProfileCreation = 'company_profile_creation',
  CompanyFollow = 'company_follow',
}

export enum TechnicalPerformanceMetric {
  PageLoadTime = 'page_load_time',
  APIResponseTime = 'api_response_time',
  ErrorRate = 'error_rate',
  Uptime = 'uptime',
}

export type ContentType = 'blog_post' | 'news_article' | 'company_profile' | 'job_listing'

export type ErrorType = 'javascript_error' | 'api_error' | '404_error'

export interface AnalyticsEventProperties {
  [key: string]: any
}

export function useAnalytics() {
  if (import.meta.server) {
    return {
      trackEvent: () => {},
      trackPageView: () => {},
      identifyUser: () => {},
      trackUserAcquisition: () => {},
      trackOnboarding: () => {},
      trackUserEngagement: () => {},
      trackContentPerformance: () => {},
      trackJobMarketActivity: () => {},
      trackTechnicalPerformance: () => {},
      trackError: () => {},
      UserAcquisitionMetric,
      OnboardingMetric,
      UserEngagementMetric,
      ContentPerformanceMetric,
      JobMarketMetric,
      TechnicalPerformanceMetric,
    }
  }

  const { $posthog } = useNuxtApp()
  const route = useRoute()
  const pageEnterTime = ref(Date.now())

  const trackEvent = (eventName: string, properties?: AnalyticsEventProperties) => {
    $posthog.capture(eventName, properties)
  }

  const trackPageView = (properties?: AnalyticsEventProperties) => {
    const timeSpent = Date.now() - pageEnterTime.value
    $posthog.capture('$pageview', {
      path: route.path,
      title: document.title,
      timeSpent,
      ...properties,
    })
    pageEnterTime.value = Date.now()
  }

  const identifyUser = (userId: string, properties?: AnalyticsEventProperties) => {
    $posthog.identify(userId, properties)
  }

  const trackError = (errorType: ErrorType, errorDetails: string, componentName?: string) => {
    $posthog.capture('Error Occurred', {
      errorType,
      errorDetails,
      componentName,
    })
  }

  const trackUserAcquisition = (
    metric: UserAcquisitionMetric,
    properties?: AnalyticsEventProperties,
  ) => {
    $posthog.capture(`User Acquisition - ${metric}`, properties)
  }

  const trackOnboarding = (metric: OnboardingMetric, properties?: AnalyticsEventProperties) => {
    $posthog.capture(`Onboarding - ${metric}`, properties)
  }

  const trackUserEngagement = (
    metric: UserEngagementMetric,
    properties?: AnalyticsEventProperties,
  ) => {
    $posthog.capture(`User Engagement - ${metric}`, properties)
  }

  const trackContentPerformance = (
    metric: ContentPerformanceMetric,
    contentType: ContentType,
    properties?: AnalyticsEventProperties,
  ) => {
    $posthog.capture(`Content Performance - ${contentType} - ${metric}`, properties)
  }

  const trackJobMarketActivity = (
    metric: JobMarketMetric,
    properties?: AnalyticsEventProperties,
  ) => {
    $posthog.capture(`Job Market - ${metric}`, properties)
  }

  const trackTechnicalPerformance = (
    metric: TechnicalPerformanceMetric,
    value: number,
    properties?: AnalyticsEventProperties,
  ) => {
    $posthog.capture(`Technical Performance - ${metric}`, { value, ...properties })
  }

  // Session tracking
  onMounted(() => {
    trackPageView()
    $posthog.capture('Session Started')
  })

  onUnmounted(() => {
    trackPageView()
    $posthog.capture('Session Ended', {
      sessionDuration: Date.now() - pageEnterTime.value,
    })
  })

  return {
    trackEvent,
    trackPageView,
    identifyUser,
    trackUserAcquisition,
    trackOnboarding,
    trackUserEngagement,
    trackContentPerformance,
    trackJobMarketActivity,
    trackTechnicalPerformance,
    trackError,
    // enums
    UserAcquisitionMetric,
    OnboardingMetric,
    UserEngagementMetric,
    ContentPerformanceMetric,
    JobMarketMetric,
    TechnicalPerformanceMetric,
  }
}
