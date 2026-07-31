import { pushToDataLayer } from './gtm.js';

// URL의 utm_source -> document.referrer -> 'direct' 순으로 유입 경로 자동 추출
const getReferralSource = () => {
  if (typeof window === 'undefined') return 'unknown';
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  
  if (utmSource) return utmSource;
  if (document.referrer) {
    try {
      return new URL(document.referrer).hostname;
    } catch (e) {
      return 'referrer_error';
    }
  }
  return 'direct';
};

export const trackPageOpen = () => pushToDataLayer('page_open');
export const trackStep1View = () => pushToDataLayer('step1_view');
export const trackStep1Complete = (charCount) => pushToDataLayer('step1_complete', { char_count: charCount });
export const trackStep2View = () => pushToDataLayer('step2_view');

// 💡 인자 없이 호출 시 UTM/Referrer 자동 수집
export const trackSubmitSuccess = (referralSource = getReferralSource()) => {
  pushToDataLayer('submit_success', { referral_source: referralSource });
};

export const trackValidationError = (fieldName, errorMessage, step) => {
  pushToDataLayer('validation_error', {
    field_name: fieldName,
    error_message: errorMessage,
    step_number: step,
  });
};

export const trackFieldFocus = (fieldName, stepNumber) => {
  pushToDataLayer('field_focus', {
    field_name: fieldName,
    step_number: stepNumber,
  });
};

export const trackFieldBlur = (fieldName, stepNumber, hasValue) => {
  pushToDataLayer('field_blur', {
    field_name: fieldName,
    step_number: stepNumber,
    has_value: hasValue,
  });
};