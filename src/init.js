import i18next from 'i18next';
import { setLocale } from 'yup';
import { handleFormSubmit, handlePostClick, updatePosts } from './utils';
import init from './render';
import en from './locales/en';
import ru from './locales/ru';

export default async function app() {
  const state = {
    rssUrls: [],
    feeds: [],
    posts: [],
    ui: {
      feedback: {
        status: '',
      },
      headers: false,
      previewInModal: null,
      viewedPosts: [],
    },
  };

  const elements = {
    headerElement: document.querySelector('h1'),
    leadElement: document.querySelector('p.lead'),
    formElement: document.querySelector('form.rss-form'),
    inputElement: document.querySelector('input#url-input'),
    inputLabelElement: document.querySelector('label'),
    submitButton: document.querySelector('form button'),
    exampleElement: document.querySelector('p.example'),
    messageElement: document.querySelector('p.feedback'),
    feedsHeader: document.querySelector('h2.feeds__header'),
    postsHeader: document.querySelector('h2.posts__header'),
    feedListElement: document.querySelector('ul.feeds__list'),
    postsListElement: document.querySelector('ul.posts__list'),
    footerCreatedElement: document.querySelector('div.copyright'),
    authorLinkElement: document.querySelector('a.author'),
    modalHeader: document.querySelector('.modal-title'),
    modalTextElement: document.querySelector('.modal-body'),
    modalReadArticleLink: document.querySelector('.modal-footer > a'),
    modalCloseButton: document.querySelector('.modal-footer > button'),
  };

  const i18nextInstance = i18next.createInstance();

  setLocale({
    string: {
      url: ({ url }) => ({ type: 'error.validation', message: 'error.invalidURL', values: { url } }),
    },
    mixed: {
      notOneOf: ({ notOneOf }) => ({ type: 'error.validation', message: 'error.duplicate', values: { notOneOf } }),
    },
  });

  await i18nextInstance.init({
    lng: 'ru',
    fallbackLng: 'ru',
    debug: true,
    resources: {
      en,
      ru,
    },
  }).then(() => {
    const watchedState = init(state, elements, i18nextInstance);

    elements.formElement.addEventListener('submit', (event) => handleFormSubmit(event, watchedState));
    elements.postsListElement.addEventListener('click', (event) => handlePostClick(event, watchedState));

    updatePosts(watchedState);
  });
}
