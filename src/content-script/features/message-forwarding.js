// TODO: replace with dependency injection
let zulipInstance = null;

let currentForwardMessageUrl = null;

const forwardCurrentMessageTo = (userId) =>
  zulipInstance.messages.send({
    type: "private",
    to: [userId],
    content: currentForwardMessageUrl,
  });

const onForwardDestinationSelected = (event) => {
  const userButton = event.target.closest("[data-user-id]");
  const userId = userButton && userButton.getAttribute("data-user-id");
  if (userId) {
    event.preventDefault();
    event.stopPropagation();

    forwardCurrentMessageTo(parseInt(userId, 10)).then(disableForwardMode);
  }
};

const enableForwardMode = (messageUrl) => {
  if (!currentForwardMessageUrl) {
    document.body.addEventListener("click", onForwardDestinationSelected, true);
    document.body.classList.add("zkt-forward-mode");
  }
  currentForwardMessageUrl = messageUrl;
};

const disableForwardMode = () => {
  currentForwardMessageUrl = null;
  document.body.removeEventListener(
    "click",
    onForwardDestinationSelected,
    true
  );
  document.body.classList.add("zkt-forward-mode-complete");
  setTimeout(
    () =>
      document.body.classList.remove(
        ...["zkt-forward-mode", "zkt-forward-mode-complete"]
      ),
    1500
  );
};

const onForwardActionSelected = (event) => {
  event.preventDefault();

  const messageUrl = event.target.getAttribute("data-message-url");
  event.target.closest(".popover").remove();

  enableForwardMode(messageUrl);
};

const addForwardAction = (actionsList) => {
  const messageUrlElement = actionsList.querySelector(
    "[data-message-id][data-clipboard-text]"
  );
  const messageUrl = messageUrlElement.getAttribute("data-clipboard-text");

  if (!messageUrl) {
    return;
  }

  const forwardAction = document.createElement("li");
  forwardAction.innerHTML = `
    <a href="#" class="popover_forward_message" data-message-url="${messageUrl}">
      <i class="fa fa-forward" aria-hidden="true"></i>
      Переслать сообщение
    </a>
  `;

  actionsList.appendChild(forwardAction);

  forwardAction.addEventListener("click", onForwardActionSelected, true);
};

const addForwardToPopoverContent = (popoverContent) => {
  if (popoverContent.getAttribute("data-zkt")) {
    return;
  }

  popoverContent.setAttribute("data-zkt", true);
  addForwardAction(popoverContent.getElementsByClassName("actions_popover")[0]);
};

export default (zulip) => {
  zulipInstance = zulip;

  new MutationObserver((mutations) =>
    mutations
      .filter(
        ({ type, addedNodes }) => type === "childList" && addedNodes.length > 0
      )
      .map(({ target }) =>
        Array.from(target.getElementsByClassName("popover-content")).map(
          addForwardToPopoverContent
        )
      )
  ).observe(document.body, { childList: true, subtree: true });
};
