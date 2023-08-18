import onChange from 'on-change';
import i18next from 'i18next';
import elements from './constants';
import handleFormSubmit from './utils';
import {
  addFeedElement,
  addPostElement,
  showErrorMessage,
  showSuccessMessage,
  showSectionHeaders,
} from './render';
import en from './locales/en';
import ru from './locales/ru';

export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    fallbackLng: 'ru',
    debug: true,
    resources: {
      en,
      ru,
    },
  }).then(() => {
    // TO DO: some initial render func?
    elements.headerElement.textContent = i18nextInstance.t('header');
    elements.leadElement.textContent = i18nextInstance.t('lead');
    elements.inputElement.setAttribute('placeholder', i18nextInstance.t('inputPlaceholder'));
    elements.inputLabelElement.textContent = i18nextInstance.t('inputPlaceholder');
    elements.submitButton.textContent = i18nextInstance.t('submitBtn');
    elements.exampleElement.textContent = i18nextInstance.t('linkExample');
    elements.footerCreatedElement.prepend(i18nextInstance.t('footerCreated'));
    elements.authorLinkElement.textContent = i18nextInstance.t('author');
    elements.modalReadArticleLink.textContent = i18nextInstance.t('modalReadArticle');
    elements.modalCloseButton.textContent = i18nextInstance.t('modalCloseBtn');
  });

  const state = {
    rssUrls: [],
    feeds: [],
    posts: [],
    ui: {
      feedback: {
        status: '',
      },
      headers: false,
    },
  };

  const renderChanges = (path, value, previousValue) => {
    switch (path) {
      case ('feeds'):
        addFeedElement(value[0]);
        break;
      case ('posts'):
        addPostElement(value[0], i18nextInstance);
        break;
      case ('ui.feedback.status'):
        if (value === 'success') {
          showSuccessMessage(i18nextInstance);
        } else {
          showErrorMessage(value, i18nextInstance);
        }
        break;
      case ('ui.headers'):
        if (value !== previousValue) {
          showSectionHeaders(i18nextInstance);
        }
        break;
      default:
        break;
    }
  };

  const watchedState = onChange(state, renderChanges);

  elements.formElement.addEventListener('submit', (event) => handleFormSubmit(event, watchedState));
};
