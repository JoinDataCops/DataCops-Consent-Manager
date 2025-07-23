import { Selectors } from "./constants";

function enableScroll() {
  document.body.style.overflowY = "auto";
  document.getElementById(Selectors.styleTagId)?.remove();
}

export function hideConsentBanner(element: HTMLElement) {
  element.remove();
  enableScroll();
}

export function handleConsents(
  rootElem: HTMLElement,
  consentChoices: any,
  clickedElement: HTMLElement,
  applyRegion: "eu" | "usa" | "global"
) {
  let choices = {
    strictly_necessary: true,
    performance: false,
    targeting: false,
    functional: false,
    social_media: false,
    ...consentChoices,
  };
  let explicitConsent: boolean = false; // if explicit Consent is false then again show the consent banner at the next visit
  let status: "rejected" | "accepted" = "rejected"; // if explicit Consent is false then again show the consent banner at the next visit

  // SET ALL CONSENT TO FALSE IF THE BUTTON IS REJECT ALL BUTTON ELSE TRUE
  if (
    clickedElement.closest("button")?.dataset.identity ===
      Selectors.rejectAllBtn ||
    clickedElement.closest("button")?.id === Selectors.topCloseBtnId
  ) {
    explicitConsent = true;
    status = "rejected"
    for (let key in choices) {
      choices[key] = false;
    }
  } else if (
    clickedElement.closest("button")?.dataset.identity ===
    Selectors.acceptAllBtn
  ) {
    explicitConsent = true;
    status = "accepted";

    for (let key in choices) {
      choices[key] = true;
    }
  } else if (
    clickedElement.closest("button")?.dataset.identity ===
    Selectors.saveAndCloseBtnId
  ) {
    status = "accepted";
    /* Save Preferences Button is also explicit consent */
    explicitConsent = true;
  }
  // inform other module that consent is done
  (window as any).onConsentGiven({
    status,
    explicitConsent,
    consents: choices,
    region: applyRegion,
  });

  // call consent.change action
  (window as any).datacops("consent.change", {
    status,
    explicitConsent,
    consents: choices,
    region: applyRegion,
  });

  hideConsentBanner(rootElem);
}
