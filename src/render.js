import onChange from 'on-change';

/* eslint-disable no-param-reassign */

const showSuccessMessage = (i18nextInstance, elements) => {
  elements.messageElement.classList.remove('text-danger');
  elements.messageElement.classList.add('text-success');
  elements.messageElement.textContent = i18nextInstance.t('successMessage');
};

const showErrorMessage = (error, i18nextInstance, elements) => {
  elements.messageElement.classList.remove('text-success');
  elements.messageElement.classList.add('text-danger');
  elements.messageElement.textContent = i18nextInstance.t(error);
};

const renderForm = (formStatus, isValid, { formElement, inputElement, submitButton }) => {
  if (isValid) {
    inputElement.classList.remove('is-invalid');
  } else {
    inputElement.classList.add('is-invalid');
  }

  if (formStatus === 'ready') {
    formElement.reset();
    inputElement.focus();
  }

  if (formStatus === 'pending') {
    inputElement.readOnly = true;
    submitButton.disabled = true;
  } else {
    inputElement.readOnly = false;
    submitButton.disabled = false;
  }

  if (formStatus === 'error') {
    inputElement.focus();
  }
};

const showSectionHeaders = (i18nextInstance, elements) => {
  elements.feedsHeader.textContent = i18nextInstance.t('feedsHeader');
  elements.postsHeader.textContent = i18nextInstance.t('postsHeader');
};

const getTemplate = (selector) => {
  const element = document
    .querySelector(`#${selector}-template`)
    .content
    .querySelector(`.${selector}`)
    .cloneNode(true);

  return element;
};

const generateFeedElement = ({ title, description }) => {
  const feedElement = getTemplate('feed');

  const feedTitle = feedElement.querySelector('.feed__title');
  const feedDescription = feedElement.querySelector('.feed__description');

  feedTitle.textContent = title;
  feedDescription.textContent = description;

  return feedElement;
};

const renderFeedElements = (feedsData, { feedListElement }) => {
  feedListElement.innerHTML = '';
  feedsData.forEach((item) => {
    feedListElement.append(generateFeedElement(item));
  });
};

const markPostAsRead = (postLinkElem) => {
  postLinkElem.classList.remove('fw-bold');
  postLinkElem.classList.add('link-secondary');
};

const generatePostElement = ({ link, title, id }, i18nextInstance, isRead) => {
  const postElement = getTemplate('post');

  const postLink = postElement.querySelector('a');
  const postBtn = postElement.querySelector('button');

  postLink.setAttribute('href', link);
  postLink.textContent = title;
  postLink.setAttribute('data-post-id', id);
  if (isRead) markPostAsRead(postLink);

  postBtn.textContent = i18nextInstance.t('seePostInfoBtn');
  postBtn.setAttribute('data-post-id', id);

  return postElement;
};

const renderPostElements = (
  { posts, ui: { viewedPosts } },
  i18nextInstance,
  { postsListElement },
) => {
  postsListElement.innerHTML = '';
  posts.forEach((item) => {
    const isRead = viewedPosts.has(item.id);
    postsListElement.append(generatePostElement(item, i18nextInstance, isRead));
  });
};

const fillInModalPreview = ({ title, description, link }, elements) => {
  elements.modalHeader.textContent = title;
  elements.modalTextElement.textContent = description;
  elements.modalReadArticleLink.setAttribute('href', link);
};

const renderChanges = (state, elements, i18nextInstance) => (path, value) => {
  switch (path) {
    case ('feeds'):
      renderFeedElements(value, elements);
      break;
    case ('posts'):
      renderPostElements(state, i18nextInstance, elements);
      break;
    case ('ui.feedback.status'):
      if (value === 'success') {
        showSuccessMessage(i18nextInstance, elements);
      } else {
        showErrorMessage(value, i18nextInstance, elements);
      }
      break;
    case ('ui.form.status' || 'ui.form.isValid'):
      renderForm(state.ui.form.status, state.ui.form.isValid, elements);
      break;
    case ('ui.headers'):
      showSectionHeaders(i18nextInstance, elements);
      break;
    case ('ui.previewInModal'):
      fillInModalPreview(value, elements);
      break;
    case ('ui.viewedPosts'):
      renderPostElements(state, i18nextInstance, elements);
      break;
    default:
      break;
  }
};

export default (state, elements, i18nextInstance) => {
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

  return onChange(state, renderChanges(state, elements, i18nextInstance));
};
