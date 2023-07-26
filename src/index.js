import { string, setLocale } from 'yup';
import 'bootstrap';
import i18next from 'i18next';
import axios from 'axios';
import en from './locales/en';
import ru from './locales/ru';
import './index.css';
import {
  headerElement,
  leadElement,
  formElement,
  inputElement,
  inputLabelElement,
  submitButton,
  exampleElement,
  footerCreatedElement,
  authorLinkElement,
  feedList,
  modalReadArticleLink,
  modalCloseButton,
} from './constants';
import {
  showSuccessMessage,
  showErrorMessage,
  addFeedElement,
  addPostElement,
  isDuplicate,
} from './utils';

// localization
i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
  resources: {
    en,
    ru,
  },
});

// TO DO: move it to some function with lang parameter (en default)
headerElement.textContent = i18next.t('header');
leadElement.textContent = i18next.t('lead');
inputElement.setAttribute('placeholder', i18next.t('inputPlaceholder'));
inputLabelElement.textContent = i18next.t('inputPlaceholder');
submitButton.textContent = i18next.t('submitBtn');
exampleElement.textContent = i18next.t('linkExample');
footerCreatedElement.prepend(i18next.t('footerCreated'));
authorLinkElement.textContent = i18next.t('author');
modalReadArticleLink.textContent = i18next.t('modalReadArticle');
modalCloseButton.textContent = i18next.t('modalCloseBtn');

// validation
setLocale({
  string: {
    url: ({ url }) => ({ type: 'error.validation', message: 'error.invalidURL', values: { url } }),
  },
});

const urlSchema = string().trim().url().required();

const parseData = (data) => new window.DOMParser().parseFromString(data, 'text/xml');

// listening to events
formElement.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = await urlSchema.validate(inputElement.value)
    .catch((error) => {
      const { type, message } = error.errors[0];
      showErrorMessage(`${i18next.t(type)} ${i18next.t(message)}`);
    });

  if (url) {
    axios.get(`https://allorigins.hexlet.app/get?url=${url}`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          if (!isDuplicate(response.data.status.url)) {
            showSuccessMessage();
            feedList.push(response.data.status.url);
            formElement.reset();
            const content = parseData(response.data.contents);
            // feeds
            const title = content.querySelector('title').textContent;
            const description = content.querySelector('description').textContent;
            // posts
            const items = content.querySelectorAll('item');
            const posts = Array.from(items).map((elem) => ({
              link: elem.querySelector('link').textContent,
              title: elem.querySelector('title').textContent,
              description: elem.querySelector('description').textContent,
            }));
            addFeedElement({ title, description });
            posts.forEach((postData) => {
              addPostElement(postData);
            });
            // TO DO: make posts and feeds section headers visible
          } else {
            throw new Error(i18next.t('error.duplicate'));
          }
        } else {
          throw new Error(i18next.t('error.generic', { error: response.status }));
        }
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  }
});
