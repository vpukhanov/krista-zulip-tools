const messageIdRegex = /near\/(\d+)$/i;

const isMessageHref = (href, realm) =>
  typeof href === "string" &&
  href.startsWith(realm) &&
  messageIdRegex.test(href);

const extractMessageId = (href) => messageIdRegex.exec(href)[1];

const performDecoration = (link, message) => {
  const container = document.createElement("blockquote");
  container.className = "zkt-decorated-link";

  if (message.avatar_url) {
    const avatar = document.createElement("img");
    avatar.className = "zkt-decorated-link-avatar";
    avatar.src = message.avatar_url;
    container.appendChild(avatar);
  }

  const content = document.createElement("div");
  content.className = "zkt-decorated-link-content";
  content.innerHTML = message.content;
  container.appendChild(content);

  if (message.sender_full_name) {
    const name = document.createElement("strong");
    name.textContent = message.sender_full_name;

    const forwardIcon = document.createElement("i");
    forwardIcon.className = "icon-forward fa fa-forward";
    name.prepend(forwardIcon);

    content.prepend(name);
  }

  link.innerHTML = container.outerHTML;
};

const decorateLink = (link, zulip) => {
  link.setAttribute("data-zkt", true);

  const id = extractMessageId(link.href);
  zulip.messages
    .retrieve({ anchor: id, num_before: 0, num_after: 0 })
    .then((result) => {
      const message = result && result.messages && result.messages[0];
      if (message) {
        performDecoration(link, message);
      }
    });
};

const decorateLinks = (links, zulip, realm) =>
  links
    .filter(
      (link) =>
        !link.getAttribute("data-zkt") && isMessageHref(link.href, realm)
    )
    .forEach((link) => decorateLink(link, zulip));

export default (zulip, configuration) => {
  const { realm } = configuration;

  decorateLinks(Array.from(document.getElementsByTagName("a")), zulip, realm);

  new MutationObserver((mutations) =>
    mutations
      .filter(
        ({ type, addedNodes }) => type === "childList" && addedNodes.length > 0
      )
      .map(({ target }) =>
        decorateLinks(
          Array.from(target.getElementsByTagName("a")),
          zulip,
          realm
        )
      )
  ).observe(document.body, { childList: true, subtree: true });
};
