import onChange from 'on-change';
import i18next from 'i18next';
import elements from './constants';
import handleFormSubmit from './utils';
import { renderInitial, renderChanges } from './render';
import en from './locales/en';
import ru from './locales/ru';

export default async function app() {
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
    renderInitial(i18nextInstance);
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

  const watchedState = onChange(state, renderChanges(i18nextInstance));

  elements.formElement.addEventListener('submit', (event) => handleFormSubmit(event, watchedState));
}
