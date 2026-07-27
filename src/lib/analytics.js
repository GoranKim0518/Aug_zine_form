// src/lib/analytics.js
import { pushToDataLayer } from './gtm.js';

export const trackPageOpen = () => {
  pushToDataLayer('page_open');
};

export const trackStep1Complete = (charCount) => {
  pushToDataLayer('step1_complete', { char_count: charCount });
};

export const trackStep2View = () => {
  pushToDataLayer('step2_view');
};

export const trackSubmitSuccess = (referralSource) => {
  pushToDataLayer('submit_success', { referral_source: referralSource });
};

export const trackValidationError = (fieldName, errorMessage, step) => {
  pushToDataLayer('validation_error', {
    field_name: fieldName,
    error_message: errorMessage,
    step: step,
  });
};

export const trackFieldFocus = (fieldName, stepNumber) => {
  pushToDataLayer('field_focus', {
    field_name: fieldName,
    step: stepNumber,
  });
};

export const trackFieldBlur = (fieldName, stepNumber, hasValue) => {
  pushToDataLayer('field_blur', {
    field_name: fieldName,
    step: stepNumber,
    has_value: hasValue,
  });
};